# Architecture

## Stack Selection & Justification

| Layer | Choice | Why not something else |
|-------|--------|------------------------|
| **Frontend** | Next.js 16 (App Router) | React 19, edge functions, API routes built-in. Alternative: Vue/Svelte would need separate backend. |
| **Styling** | Tailwind v4 + shadcn/ui | CSS-first config, dark mode via `dark:` class. Alternative: CSS modules would be slower to iterate. |
| **Database** | Supabase (Postgres) | Free tier, RLS, `public_id` pattern. Alternative: Firebase Firestore has worse query flexibility. |
| **Email** | Nodemailer + Gmail SMTP | No domain verification needed. Alternative: Resend required DNS proof (impossible with @gmail.com). |
| **AI Summary** | Groq (Llama 3.3-70b) | Free, fast (<800ms). Alternative: Anthropic requires manual free credit approval (too slow). |
| **Hosting** | Vercel | Git push deploy, edge OG images. Alternative: Netlify has worse edge function cold starts. |

---

## System Diagram

```mermaid
graph TD
    User[User with browser] -->|GET| Landing[Landing Page /]
    Landing -->|Fills form + clicks Run| AuditForm[AuditForm component]
    AuditForm -->|tools[] + spend[]| AuditEngine[auditEngine.ts]

    AuditEngine -->|RULES: 20 deterministic checks| Result[AuditResult]
    AuditEngine -->|detectOverlap| CrossTool[Cross-tool savings]

    Result -->|savings > $500| HighCTA[HighSavingsCTA]
    Result -->|savings < $100| LowCTA[LowSavingsCTA]
    Result -->|Any savings| LeadModal[LeadCapture modal]

    LeadModal -->|email + auditId| SaveAPI[/api/save-audit]
    SaveAPI -->|INSERT| Supabase[(Supabase audits)]
    SaveAPI -->|POST| Slack[Slack webhook]
    SaveAPI -->|returns public_id| EmailAPI[/api/send-email]

    EmailAPI -->|SMTP| Gmail[Gmail SMTP]
    Gmail -->|Delivers| UserInbox[User's inbox]

    LeadModal -->|public_id| ResultPage[/results/:publicId]
    ResultPage -->|Fetch by public_id| Supabase
    ResultPage -->|OG image| OGAPI[/api/og]
    OGAPI -->|Edge runtime| TwitterCard[Twitter/LinkedIn preview]

    Cron[Vercel Cron - daily] -->|DELETE stale| Supabase
```

---

## Data Flow (Step by Step)

1. **User enters tools:** `AuditForm` maintains state in `localStorage`. On every change, saves to `localStorage`. On page reload, rehydrates from `localStorage`.

2. **Run audit:** `AuditForm` calls `runAudit(tools)` → `auditEngine.ts` → applies 20 RULES + `detectOverlap()` → returns `AuditResult` (totalSavings, perToolRecommendations, savingsTier).

3. **Show results:** `ResultsPanel` renders savings breakdown, charts (Recharts), and AI summary (via Groq). Conditional CTA based on savings tier.

4. **Lead capture:** User sees value first (savings number), then modal appears. Honeypot field prevents bot submissions. Email + optional fields sent to `/api/save-audit`.

5. **Persistence:** `/api/save-audit` inserts into Supabase `audits` table. Generates `public_id` (8-byte random hex via `crypto.randomBytes(8).toString('hex')`). Sends Slack notification (if webhook configured). Triggers email send.

6. **Email send:** `/api/send-email` uses Nodemailer with Gmail SMTP. Template includes savings amount and shareable URL. On high savings (>$500), notes "Credex will reach out."

7. **Shareable URL:** `/results/[public_id]` fetches audit by `public_id`. Strips email + company name. Shows only tools + savings. Open Graph tags generated dynamically via edge API route (`/api/og`).

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Rule-based engine (no ML) | Deterministic, auditable, no hallucination risk. Finance teams need reproducible numbers. |
| No authentication | Login is friction. Users start auditing in one click. Shareable results use `public_id` as access token. |
| Honeypot anti-bot | Zero UX friction vs CAPTCHA; sufficient for MVP scale. |
| Two savings tiers (<$100 vs >$500) | Avoids Credex pitch on low-value leads. Only genuine high-savings users see consultation CTA. |
| `publicId` separate from DB `id` | `id` is UUID (internal), `publicId` is 8-byte hex (shareable without exposing internal IDs or row counts). |
| Edge runtime for OG image | Zero cold start for social previews. |

---

## Scaling to 10k Audits/Day

| Component | Current | Scaled solution |
|-----------|---------|-----------------|
| Audit engine | Runs on every request (~50ms) | Move to edge function with caching by input hash (Upstash Redis) |
| AI summary | Groq API call per audit (~800ms) | Queue via Supabase Edge Functions, async generation |
| Database | Single Supabase instance | Read replica for `/results/[id]` queries |
| Rate limiting | Honeypot only | Upstash Ratelimit by IP (100/day) |
| Email | Gmail SMTP (500/day limit) | Migrate to Resend with verified custom domain |
| Asset serving | Vercel CDN | CloudFront + S3 for images (OG previews) |

**Cost at 10k audits/day:** ~$200/month (Supabase Pro $25, Resend $50, Upstash $15, Vercel Pro $20, edge compute $90). Still profitable given Credex's average contract value.

---

## Security & Privacy

| Concern | Mitigation |
|---------|------------|
| Guessable shareable URLs | `public_id` is 8-byte random hex (16^8 = 4.3 billion possibilities). No PII on public page — only savings and recommendations. |
| Bot submissions | Honeypot field (hidden via CSS). Real users don't see it; bots fill it → request rejected. |
| Email exposure | Email never stored in `public_id` lookup. Separate `email` column not queried by public route. |
| Rate limiting | Not implemented at MVP scale (<100 audits/day). At 10k/day, add Upstash Ratelimit. |
| Secrets in repo | `.env.local` excluded via `.gitignore`. `.env.example` has placeholders only. |
