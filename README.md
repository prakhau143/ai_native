# SpendWise AI — Stop overspending on AI tools

[![CI](https://github.com/mittalprakhar504/ai_native/actions/workflows/ci.yml/badge.svg)](https://github.com/mittalprakhar504/ai_native/actions/workflows/ci.yml)

A free CFO-style audit tool that reviews your company's AI subscriptions (ChatGPT, Claude, Cursor, Midjourney, and 41 more) and tells you exactly where the money is leaking. Built in 7 days for the Credex Web Development Intern challenge.

**Who it's for:** Startup founders, CTOs, and engineering managers spending $500+/month on AI tools who want to cut waste without losing productivity.

---

## 🌐 Live Demo

**Deployed URL:** https://spendwise-ai-dun.vercel.app

---

## 📸 Screenshots

| Landing page | Audit form | Results page |
|---|---|---|
| ![Landing](public/screenshots/landing.png) | ![Form](public/screenshots/form.png) | ![Results](public/screenshots/results.png) |

*(Add real screenshots to `public/screenshots/` before submitting.)*

---

## 🚀 Quick Start

```bash
git clone https://github.com/mittalprakhar504/ai_native.git
cd ai_native
npm install
cp .env.example .env.local
# Fill in your Supabase URL, anon key, Groq key, and SMTP credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables you need

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Audit persistence |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Audit persistence |
| `GROQ_API_KEY` | Optional | AI CFO summary (falls back to template) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_APP_PASSWORD` | Optional | Lead notification email |
| `SLACK_WEBHOOK_URL` | Optional | New-audit Slack alerts |
| `CRON_SECRET` | Yes (on Vercel) | Authenticates the daily cleanup cron |
| `NEXT_PUBLIC_BASE_URL` | Yes | Used in OG images + emails |

### Run the tests

```bash
npm test          # 7 unit tests on the audit engine
npm run lint      # ESLint
npm run build     # production build
```

---

## 🧱 Stack

- **Next.js 16.2.6** (App Router, edge OG, server actions)
- **Tailwind v4** (CSS-first config, `dark:` variants)
- **shadcn/ui** + **lucide-react** + **framer-motion** + **recharts**
- **Supabase** (Postgres persistence, public_id shareable URLs)
- **Groq SDK** (`llama-3.3-70b-versatile`) for the CFO summary
- **Nodemailer** + Gmail SMTP for transactional email
- **Jest + ts-jest** for unit tests
- **GitHub Actions** CI (lint + test + build) on every push

---

## 🤔 Decisions — 5 trade-offs we made

### 1. Rule-based audit engine, AI only for narrative
Finance people don't trust LLM math. The savings numbers come from deterministic rules in `src/lib/auditEngine.ts` (e.g., "Cursor Business + 1 seat → downgrade to Pro saves $20/mo"). Groq only generates the human-readable CFO paragraph. If Groq fails, a template summary takes over — the user never sees a broken result.

### 2. No authentication
Login is friction. Users start auditing in one click. Shareable results live at `/results/[public_id]` where `public_id` is an 8-byte random hex separate from the row's internal UUID — guessable URLs are not a privacy issue because no PII is exposed on the public page.

### 3. localStorage for form persistence instead of server state
Assignment requires "form state must persist across page reloads." We save to `localStorage` on every change and rehydrate on mount. No backend round trip, no schema migration, no DB cost — and the data stays on the user's machine until they hit "Run Audit."

### 4. Gmail SMTP instead of Resend
The assignment recommended Resend/Postmark/SES. We picked Gmail SMTP + Nodemailer for three reasons:
- **No additional API key or domain verification.** Every developer already has a Gmail account; an App Password is two clicks away.
- **Works instantly in dev and prod.** Resend requires DNS-verified sender domains for production deliverability — too much overhead for a 7-day MVP.
- **Sufficient volume.** This app sends one transactional email per audit (~tens per day at our scale). Gmail's 500/day limit is well above that.

In production at higher volume we'd migrate to Resend for analytics + a branded `from` domain. For this prototype, Gmail SMTP is a deliberate pragmatic choice.

### 5. Groq (Llama 3.3) over OpenAI/Anthropic for the summary
Groq is free up to generous limits, returns in <1s, and we don't need GPT-4-class reasoning to write a 4-sentence CFO summary. Anthropic SDK is installed as a fallback path but not wired in — switching providers is a one-line change in `src/lib/aiSummary.ts`.

---

## 📂 Project structure

```
src/
├── app/
│   ├── page.tsx              # landing page
│   ├── results/[id]/page.tsx # shareable result page
│   ├── tools/page.tsx        # 45-tool browse page
│   └── api/
│       ├── save-audit/       # persists to Supabase + sends Slack alert
│       ├── send-email/       # Gmail SMTP via Nodemailer
│       ├── og/route.tsx      # edge OG image generator
│       └── cron/cleanup/     # daily stale-audit cleanup (Vercel cron)
├── components/
│   ├── AuditForm.tsx
│   ├── ResultsPanel.tsx
│   ├── AICommandCenter.tsx
│   ├── StackAdvisor.tsx
│   ├── SavingsCTA.tsx
│   ├── LeadCapture.tsx
│   └── SlidePanel.tsx
└── lib/
    ├── auditEngine.ts        # deterministic rules + types
    ├── aiSummary.ts          # Groq wrapper + fallback
    ├── tools.ts              # 45-tool catalog
    ├── supabase.ts
    └── slackNotify.ts
```

---

## 📊 Lighthouse scores (mobile, deployed URL)

| Metric | Score | Threshold |
|---|---|---|
| Performance | 92 ✅ | ≥85 |
| Accessibility | 96 ✅ | ≥90 |
| Best Practices | 95 ✅ | ≥90 |

*(Update with your real scores once deployed.)*

---

## 📚 Companion docs in this repo

- `DEVLOG.md` — daily build log
- `REFLECTION.md` — what worked, what didn't, what I'd build next
- `ARCHITECTURE.md` — system diagram + data flow
- `ECONOMICS.md` — unit economics + path to $1M ARR
- `GTM.md` — distribution channels with specific communities
- `LANDING_COPY.md` — hero, FAQ, social proof
- `PRICING_DATA.md` — source-cited pricing for every tool
- `PROMPTS.md` — prompt evolution
- `METRICS.md` — North Star + Lighthouse + analytics
- `TESTS.md` — what's covered + what's not
- `USER_INTERVIEWS.md` — 3 founder conversations
