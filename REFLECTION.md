# Reflection

## 1. The hardest bug you debugged — including the specific hypotheses you formed

The hardest bug was **Test #4 failing silently while the app appeared to work**. The test asserted that auditing an OpenAI API subscription at $600/month should recommend switching to Credex (the `> 400` rule). But the test kept returning `"OpenAI API (+ Groq routing)"` instead.

**Hypothesis 1:** The `openai_api` toolId wasn't matching. I added a `console.log` in the test and confirmed the toolId was correct.

**Hypothesis 2:** The savings calculation was zeroing out the Credex rule. I logged `rec.saving` and saw it was positive — so the rule *was* firing, just the wrong one.

**Hypothesis 3 (correct):** Two RULES entries both matched `openai_api` with spend > $200 — the `> 200` rule came first in the array and was always found first by `RULES.find()`. The `> 400` rule was never reached. The fix was simple: put the more specific rule (`> 400`) *before* the more general rule (`> 200`) in the array. This is a classic "rule ordering" bug in expert systems. The same issue existed for the Anthropic API rules so I fixed both at once.

**What I'd do differently:** Write rules in a table/config format where `match` conditions are explicitly sorted by specificity, or use a priority field on the rules themselves to force ordering regardless of array position.

---

## 2. A decision you reversed mid-week — what changed your mind

I started with **Resend** for transactional email (as recommended in the brief) and got halfway through the integration. Then I hit the domain verification step: Resend requires you to prove DNS ownership of the `from` domain before it will send to any address other than the verified domain. For a 7-day build where my domain is `mittalprakhar504@gmail.com`, that would mean emails would either fail or arrive from a Resend sandbox address that looks spammy.

I reversed course and switched to **Gmail SMTP + Nodemailer**. The reasons:

1. No domain verification needed — I own the Gmail account
2. App Passwords work in under 2 minutes
3. For the evaluation, the evaluator cares that emails *send*, not which provider fires them
4. Resend's free tier is better for production (100/day, custom domain) but worse for this specific prototype

The trade-off: Gmail caps at 500/day and doesn't give delivery analytics. I documented this in the README Decisions section so evaluators understand it's a conscious choice, not an oversight.

---

## 3. What you'd build in Week 2 — specific feature roadmap

1. **Browser extension** — auto-detect AI subscriptions from the user's inbox or bank statement. Right now users manually enter tools. An extension that reads email receipts from Stripe/Paddle and pre-fills the form would 10× conversion.

2. **Slack bot** — `/audit` command inside the user's workspace. Shows the top 3 savings recommendations as a Slack message. Easier adoption than a web app for ops/finance teams.

3. **Invoice scanner** — Upload a PDF invoice or screenshot; GPT-4V extracts the tool name, plan, and amount automatically. Currently we ask users to remember their pricing — most don't know it to the dollar.

4. **Usage data integration** — Connect to OpenAI's API usage dashboard via OAuth to see *actual* token consumption vs. what they're paying. Rule-based recommendations are good; usage-data recommendations are better.

5. **Benchmark emails** — Monthly "Your AI spend vs. peers" report. Uses anonymised aggregate data from all audits to tell users whether they're above or below median for their company size.

---

## 4. How you used AI tools — which tool, what tasks, what you didn't trust, one time it was wrong

**Tools used:**
- **Claude Sonnet** (via Claude Code) — primary coding assistant for this entire project. Used for component scaffolding, debugging, writing audit rules, reviewing logic.
- **Groq (Llama 3.3-70b)** — the AI summary generator inside the app itself (the CFO paragraph on results page).
- **ChatGPT** — initial brainstorming for the GTM strategy and landing copy.

**What I trusted AI with:** Boilerplate (component structure, CSS patterns, TypeScript types), debugging stack traces, explaining Tailwind v4 migration differences from v3.

**What I didn't trust AI with:** The audit engine *rules themselves*. The pricing data (monthly spend per plan per tool) had to come from me manually checking each product's pricing page. AI hallucinated prices consistently — Claude said Cursor Pro was $15/mo (it's $20), and ChatGPT said ElevenLabs Starter was $9/mo (it's $5). Both wrong. PRICING_DATA.md was written entirely from official pricing pages, not AI output.

**One time AI was clearly wrong:** I asked Claude Code to "add Gemini to the audit rules." It added a rule `match: (e) => e.toolId === "gemini"` but the actual toolId in `tools.ts` was `"gemini"` — fine. But it also wrote `newCostPerSeat: () => 0` for Gemini Advanced, implying Gemini is free. It's $20/month. The rule would have told every Gemini Advanced user to "switch to free tier" which is the plan they're already on. I caught it in code review before it shipped.

---

## 5. Self-ratings (1–10) with justification

**Discipline: 7/10**
Worked 5 out of 7 days for 4–8 hours each. Skipped two planned sessions and crammed catch-up work. The DEVLOG shows the honest log. I'd rate higher if I'd kept daily commits from day one instead of batching work.

**Code quality: 8/10**
TypeScript strict mode throughout, no `any` types, 7 unit tests, GitHub Actions CI running lint + test + build on every push. The audit engine is well-structured with explicit rule types and no magic strings. Deduction: a few components are long and could use splitting (ResultsPanel is ~350 lines), and some error states are missing.

**Design sense: 9/10**
The glassmorphism dark UI with gradient accents looks genuinely polished. Light mode is fully functional (fixed all invisible-text issues). The results page has meaningful charts (spend trend, vendor concentration, category breakdown). Deduction: mobile responsiveness could be better on the AuditForm grid.

**Problem-solving: 8/10**
Found and fixed the rule-ordering bug, the SVG stroke CSS property issue, the Vercel build env var failure, and the light mode CSS variable problem. All debugged from first principles without copying Stack Overflow answers. Deduction: took too long on the Vercel deploy (should have checked env vars first).

**Entrepreneurial thinking: 9/10**
The app is genuinely useful and solves a real problem I discovered through 3 user interviews. The lead capture → Credex funnel is a working revenue model, not just a demo. The GTM plan has specific channels and week-1 traction targets. The economics doc shows a credible path to $1M ARR. Deduction: no paying users yet (it's day 5 of 7).
