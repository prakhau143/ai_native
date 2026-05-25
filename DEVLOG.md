# Dev Log

## Day 1 — 2026-05-21

**Hours worked:** 6

**What I did:** Project bootstrap with Next.js 16.2.6 + Tailwind v4 + shadcn/ui. Built Header, Hero section, AnimatedBackground, AuditForm with multi-tool rows, and core ResultsPanel skeleton. Set up dark glassmorphism UI with CSS custom properties (`--card-solid`, `--card-border`). Wrote first 8 audit rules (Cursor, ChatGPT, Claude, Copilot).

**What I learned:** Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base/components/utilities` — the config API changed significantly. Also `@custom-variant dark` is needed to scope dark mode to a class selector.

**Blockers / what I'm stuck on:** shadcn Sheet component threw Radix accessibility warnings about missing dialog title — fixed with `<SheetTitle className="sr-only">`.

**Plan for tomorrow:** Supabase schema design, save-audit API route, lead capture modal.

---

## Day 2 — 2026-05-22

**Hours worked:** 5

**What I did:** Set up Supabase (audits table with `public_id` for shareable URLs, RLS policies for anon insert + select). Built `/api/save-audit` route. Built LeadCapture modal with honeypot spam protection. Started Resend email integration — hit domain verification wall (more on this tomorrow).

**What I learned:** `public_id` pattern (8-byte random hex separate from internal UUID) is the right way to expose shareable URLs without leaking DB IDs. Supabase RLS needs separate policies for insert vs select — they're not the same.

**Blockers / what I'm stuck on:** Resend requires DNS-verified sending domain. My email is `@gmail.com` — impossible to verify. Emails would arrive from `onboarding@resend.dev` (looks spammy). Need to find alternative tomorrow.

**Plan for tomorrow:** Switch to Gmail SMTP + Nodemailer, build `/api/send-email`, start `/results/[id]` shareable page.

---

## Day 3 — 2026-05-23

**Hours worked:** 7

**What I did:** **Reversed email decision** — scrapped Resend, implemented Gmail SMTP with Nodemailer (App Password setup took 2 minutes). Completed `/results/[id]` page with Supabase fetch by public_id. Built edge OG image generator at `/api/og` (1200×630, shows savings amount). Added conditional `SavingsCTA` components (high vs low savings tiers). Expanded audit engine from 8 to 20 rules (Gemini, Perplexity, Notion AI, Grammarly, Jasper, Copy.ai, Midjourney, Runway, ElevenLabs). Added `detectOverlap()` for cross-tool redundancy detection.

**What I learned:** Gmail SMTP with App Password works immediately — no domain verification, no approval queue. Good enough for prototype scale. For production at volume, I'd switch back to Resend with a verified custom domain.

**Blockers / what I'm stuck on:** OG image was showing "$0" savings when result wasn't persisted yet — fixed by passing savings directly in URL query param for the preview.

**Plan for tomorrow:** AI Command Center component, Stack Advisor, ResultsPanel charts, fix light mode CSS bugs.

---

## Day 4 — 2026-05-24

**Hours worked:** 8

**What I did:** Built AICommandCenter component (score rings, waste meter, Recharts charts). Built StackAdvisor component with tool-action cards and cost comparison bars. Expanded tools catalog to 45 tools in `src/lib/tools.ts`. Implemented Slack Block Kit webhook alerts (`src/lib/slackNotify.ts`). **Fixed critical light mode bugs** — replaced hardcoded dark RGBA values with CSS custom properties (`--card-solid`, `--card-border`, `--stat-bar-bg`). Set up GitHub Actions CI (lint + test + build). Wrote all 7 Jest tests for audit engine.

**What I learned:** SVG `stroke` attribute must be set as an HTML attribute (`stroke="var(--stat-bar-border)"`), not via `style={}` — CSS properties don't override SVG presentation attributes. CSS custom properties only update when parent class changes, not inline styles.

**Blockers / what I'm stuck on:** Test #4 was failing because two overlapping RULES entries for `openai_api` — the `> 200` rule was catching before `> 400` rule. Fixed by reordering rules (more specific first).

**Plan for tomorrow:** Vercel deployment, env var setup, Lighthouse testing.

---

## Day 5 — 2026-05-25

**Hours worked:** 5

**What I did:** Deployed to Vercel (resolved name casing error — `Spendwise_ai` fails, `spendwise-ai` works). Added all 9 env vars via `vercel env add`. Triggered successful production build. Fixed form state localStorage persistence — `AuditForm` now saves/restores via `useEffect` on mount and every change. Added `role` and `team size` optional fields to LeadCapture. Fixed `.env.example` (had real values accidentally committed — replaced with placeholders).

**What I learned:** Vercel project names must be all lowercase. `vercel --name` flag deprecated in CLI v54 — use interactive mode. First deploy failed with `supabaseUrl is required` because env vars weren't set yet on Vercel — had to add all vars and redeploy.

**Blockers / what I'm stuck on:** First deploy failed with `supabaseUrl is required` because env vars weren't set yet — had to add all vars and redeploy.

**Plan for tomorrow:** Run Lighthouse, fix any a11y issues, add screenshots, record Loom demo.

---

## Day 6 — 2026-05-26

**Hours worked:** 0 (took day off for personal commitment — logged honestly)

**What I did:** None.

**What I learned:** Building a 7-day MVP is intense. Taking one day off prevented burnout. Better to log zero hours honestly than fabricate work.

**Blockers / what I'm stuck on:** N/A.

**Plan for tomorrow:** Final polish, documentation review, smoke test live site, submit.

---

## Day 7 — 2026-05-27

**Hours worked:** 3

**What I did:** Ran Lighthouse CLI on deployed URL — Performance 95, Accessibility 100, Best Practices 100, SEO 100. Fixed two a11y issues (missing `htmlFor` on select elements, range slider labels). Added `next/dynamic` lazy loading for ResultsPanel + SavingsCTA to push LCP below 2.5s. Added screenshots to `public/`. Enhanced all documentation files. Final smoke test: add tools → run audit → submit email → check shareable URL. All working. Submitted.

**What I learned:** `next/dynamic` with `ssr: false` is the fastest path to improving Lighthouse Performance when heavy components (Recharts, framer-motion) are only needed after user interaction. Deferring 200KB of JS dropped LCP from 3.5s to 2.4s.

**Blockers / what I'm stuck on:** None — clean submission.

**Plan for tomorrow:** Ship it.
