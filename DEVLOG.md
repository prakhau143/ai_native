# Dev Log

## Day 1 — 2026-05-21
**Hours:** 6
**Did:** Project bootstrap with Next.js 16.2.6 + Tailwind v4 + shadcn/ui. Built Header, Hero section, AnimatedBackground, AuditForm with multi-tool rows, and the core ResultsPanel skeleton. Implemented dark glassmorphism UI with CSS custom properties. Set up the rule-based audit engine with first 8 rules (Cursor, ChatGPT, Claude, Copilot).
**Learned:** Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base/components/utilities` — the config approach changed significantly. Also `@custom-variant dark` is needed to scope dark mode to a class selector rather than the default `prefers-color-scheme`.
**Blockers:** shadcn Sheet component threw Radix accessibility warnings about missing dialog title — fixed with visually hidden `<SheetTitle className="sr-only">`.
**Tomorrow:** Supabase schema, save-audit API route, lead capture modal, shareable URL.

---

## Day 2 — 2026-05-22
**Hours:** 5
**Did:** Set up Supabase (created `audits` table with `public_id` for shareable URLs, enabled RLS with anon insert + select policies). Built `/api/save-audit` route. Built LeadCapture modal with honeypot spam protection. Set up Gmail SMTP via Nodemailer for transactional email. Built `/api/send-email` route. Started `/results/[id]` shareable page.
**Learned:** Supabase `public_id` pattern (separate 8-byte hex from internal UUID) is the right way to expose shareable URLs without leaking internal IDs. Nodemailer needs an App Password not the account password when 2FA is enabled.
**Blockers:** `.env.example` was caught by the `.env*` gitignore rule — added `!.env.example` negation to allow committing placeholder file. Gmail SMTP initially failed because 2FA wasn't enabled on the account first.
**Tomorrow:** Shareable result page completion, OG image, conditional savings UI.

---

## Day 3 — 2026-05-23
**Hours:** 7
**Did:** Completed `/results/[id]` page with Supabase fetch by public_id. Built edge OG image generator at `/api/og` (1200×630, shows savings amount). Added `HighSavingsCTA` and `LowSavingsCTA` conditional components. Expanded the audit engine RULES from 8 to 20 rules covering Gemini, Perplexity, Notion AI, Grammarly, Jasper, Copy.ai, Midjourney, Runway, ElevenLabs. Added `detectOverlap()` for cross-tool redundancy detection (triple LLM, Cursor+Copilot, etc.). Added Groq API integration for CFO-style AI summaries with template fallback.
**Learned:** Next.js edge runtime for OG images doesn't support `fs` module — must use `fetch` or inline base64 for fonts. Groq `llama-3.3-70b-versatile` returns in <800ms which is fast enough to not need streaming for a summary paragraph.
**Blockers:** OG image was showing "0" savings when the result wasn't persisted yet — fixed by passing savings directly in the URL query param for the lead-capture preview.
**Tomorrow:** AI Command Center, Stack Advisor, ResultsPanel charts, dark/light mode.

---

## Day 4 — 2026-05-24
**Hours:** 8
**Did:** Built AICommandCenter component (score rings, waste meter, Recharts charts). Built StackAdvisor component with tool-action cards, cost comparison bars, and smart alternatives. Expanded tools catalog to 45 tools in `src/lib/tools.ts` and `src/app/tools/page.tsx`. Implemented Slack Block Kit webhook alerts (`src/lib/slackNotify.ts`). Fixed critical light mode visibility bugs across all components — replaced hardcoded dark RGBA values with CSS custom properties (`--card-solid`, `--card-border`, `--stat-bar-bg`). Set up GitHub Actions CI (lint + test + build). Wrote all 7 Jest tests.
**Learned:** SVG `stroke` attribute must be set as an HTML attribute (`stroke="var(--stat-bar-border)"`), not via `style={}` — CSS properties don't override SVG presentation attributes. CSS custom properties only update when the parent class changes, not when inline styles do — so the `dark:` class on `<html>` is critical.
**Blockers:** Test #4 was failing because two overlapping RULES entries for `openai_api` — the `> 200` rule was catching `> 400` spend before the Credex rule could fire. Fixed by reordering rules so more specific (higher spend) rules come first. Light mode text was invisible because `--stat-bar-bg` was set to `rgba(255,255,255,0.72)` — nearly white on white. Fixed to `rgba(15,23,42,0.07)`.
**Tomorrow:** Vercel deployment, env var setup, Lighthouse audit, documentation polish.

---

## Day 5 — 2026-05-25
**Hours:** 5
**Did:** Deployed to Vercel (resolved name casing error, added all 9 env vars, triggered successful production build). Fixed form state localStorage persistence — `AuditForm` now saves/restores via `useEffect` on mount and on every change. Added `role` and `team size` optional fields to LeadCapture. Fixed `.env.example` to contain only placeholders (had real values accidentally). Updated `.gitignore` with `!.env.example` negation. Rewrote README.md with proper format (summary, quick start, 5 decisions, Lighthouse scores, stack). Rewrote REFLECTION.md with the required 5 questions. Updated all docs.
**Learned:** Vercel project names must be all-lowercase — `Spendwise_ai` fails but `spendwise-ai` works. `vercel env add` accepts piped stdin which is faster than interactive mode for bulk env var setup.
**Blockers:** First deploy failed with `supabaseUrl is required` because env vars weren't set yet on Vercel — had to add all vars and redeploy. `vercel --name` flag is deprecated in CLI v54; use `vercel` interactive and type the lowercase name.

---

## Day 6 — 2026-05-26 *(planned)*
**Hours planned:** 3
**Plan:** Run Lighthouse on https://spendwise-ai-dun.vercel.app — target Performance ≥85, Accessibility ≥90, Best Practices ≥90. Fix any a11y issues (missing alt text, contrast). Add screenshots to `public/screenshots/`. Record a 60-second Loom demo. Update METRICS.md with real scores.

---

## Day 7 — 2026-05-27 *(planned)*
**Hours planned:** 2
**Plan:** Final review pass. Verify CI is green. Confirm all 7 tests pass. Smoke test the live site end-to-end (add tools → run audit → submit email → check shareable URL). Submit the assignment.
