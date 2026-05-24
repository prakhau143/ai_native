# Architecture

## Stack
- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (Postgres) — stores audits + notify list
- **Email:** Nodemailer + Gmail SMTP — transactional confirmation emails (see Decisions in README for rationale vs Resend)
- **AI Summary:** Groq Llama-3.3-70b-versatile (fallback to template if key absent)
- **Hosting:** Vercel (edge functions for OG image)

## Data Flow

```mermaid
graph TD
  User -->|fills form| AuditForm
  AuditForm -->|ToolEntry[]| Page["page.tsx (state machine)"]
  Page -->|runAudit()| Engine["auditEngine.ts (rule engine)"]
  Engine -->|AuditResult| LeadCapture["LeadCapture modal"]
  LeadCapture -->|email + result| SaveAudit["POST /api/save-audit"]
  SaveAudit -->|insert| Supabase[(Supabase audits)]
  SaveAudit -->|publicId| SendEmail["POST /api/send-email"]
  SendEmail -->|HTML email| Resend[Resend API]
  Resend -->|delivery| UserInbox[User inbox]
  Page -->|publicId| ResultsPanel
  ResultsPanel -->|/results/:publicId| ShareURL[Shareable URL]
  ShareURL -->|?public=true| StrippedView[Personal info hidden]
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Rule-based engine (no ML) | Deterministic, auditable, no hallucination risk |
| No authentication | Reduces friction; URL acts as access token |
| Honeypot anti-bot | No UX friction vs CAPTCHA; sufficient for MVP |
| Two savings tiers (<$100 vs >$500) | Avoids Credex pitch on low-value leads |
| `publicId` separate from `id` | `id` is UUID (internal), `publicId` is 8-char hex (shareable without exposing DB IDs) |
| Edge runtime for OG image | Zero cold start for social previews |

## Scaling to 10k audits/day
1. Add Redis (Upstash) to cache `runAudit()` output by input hash
2. Move AI summary generation to a Supabase Edge Function queue
3. Add Supabase read replica for `/results/[id]` queries
4. Rate-limit `/api/save-audit` by IP (Upstash Ratelimit)
