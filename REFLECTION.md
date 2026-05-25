# Reflection

## 1. The hardest bug you debugged this week — specific hypotheses, what you tried, what worked

**The bug:** The OpenAI API rule was firing incorrectly for a test case spending $600/month. The engine kept recommending "OpenAI API standard tier" instead of the Credex credit-switch recommendation that should trigger at $400+.

**My debugging process:**

*Hypothesis 1 (10 min):* The `toolId` isn't matching. Added console logs in the test — confirmed the ID was correct. The rule object was being found.

*Hypothesis 2 (20 min):* The savings calculation was zeroing out. Logged the `rec.saving` value — it was positive ($200+). The rule was firing, just the wrong one.

*Hypothesis 3 (30 min — CORRECT):* Two RULES entries matched the same tool. The `> 200` rule came first in the array. JavaScript's `Array.find()` returns the first match. The `> 400` rule never executed because the `> 200` rule always matched first.

**The fix:** Reordered rules so more specific (higher spend) rules appear before general ones. Also added a comment warning future maintainers about rule ordering.

**What I'd do differently:** Write rules as a Map where keys are priority scores, or add an explicit `priority` field. The implicit array-order dependency is brittle.

---

## 2. A decision you reversed mid-week — what made you reverse it

**The decision I reversed:** Using Resend for transactional email (initially chosen because the assignment recommended it).

**Why I chose it initially:** Resend has a generous free tier (100 emails/day), good deliverability, and proper analytics. It felt like the "right" engineering choice.

**What made me reverse course (Day 3):** I hit domain verification. Resend requires proving DNS ownership of your `from` domain before sending to any address other than your own. My domain is `@gmail.com` — impossible to verify. Emails would arrive from `onboarding@resend.dev` — looks spammy.

**The alternative:** Switched to Gmail SMTP + Nodemailer. An App Password took 2 minutes to generate. Emails send from my real Gmail address. No verification required.

**The trade-off I accepted:** Gmail caps at 500 emails/day and provides no analytics. For this prototype (tens of emails/day), that's fine. If this scaled, I'd migrate to Resend with a verified custom domain.

**What this taught me:** Don't blindly follow "recommended" stacks. The best tool depends on your constraints (time, domain ownership, scale). A pragmatic choice that works today is better than a theoretically better choice that delays shipping.

---

## 3. What you would build in week 2 if you had it — specific features, not vague

**Week 2 priority #1: Browser extension for auto-detection**
Users manually entering tools is friction. An extension that reads Stripe email receipts and pre-fills the form would 10x completion rates. I'd build it with Manifest V3, using Gmail API read scope (limited to receipts). This is the single highest-ROI feature.

**Week 2 priority #2: Slack bot integration**
`/audit` command inside a company's Slack. Pulls existing tool usage from conversations + linked accounts. Outputs top 3 savings recommendations as a rich Slack message. Adoption channel for ops/finance teams who live in Slack.

**Week 2 priority #3: Usage-based recommendations**
Current engine assumes "plan tier = usage pattern." That's a proxy. Real improvement: connect to OpenAI API dashboard via OAuth, read actual token consumption. A team paying $200/month but using $40 worth of tokens is waste that seat-count rules miss. The user interview with R.S. (18-person startup) revealed this — he had 4 dormant Cursor seats but was paying for them.

**Week 2 priority #4: Benchmark emails (viral loop)**
Monthly "Your AI spend vs. peers" email to captured leads. Uses anonymized aggregate data. Shows percentile ranking. Includes a "share your benchmark" button that posts to X/LinkedIn. Turns users into distribution.

**Week 2 priority #5: PDF export + white-label**
For agencies/consultants who audit client stacks. White-label version they can embed on their own domain. This opens B2B2C distribution — not just direct, but through intermediaries.

---

## 4. How you used AI tools — which tool, for what tasks, what you didn't trust them with, one time it was wrong

**Tools I used:**
- **Claude Sonnet (primary):** Scaffolding components, writing TypeScript types, debugging my audit engine logic, generating test cases
- **ChatGPT:** Brainstorming GTM channels and landing page copy variations
- **Groq (Llama 3.3):** The AI summary generator inside the app itself (not for development)

**What I trusted AI with:**
Boilerplate code (React components, Tailwind classes), explaining error messages, generating commit messages, rewriting sentences for clarity in docs. Also trusted AI to catch obvious syntax errors.

**What I did NOT trust AI with:**
**Pricing data.** I manually verified every tool price from official pages. Claude confidently told me Cursor Pro was $15/mo (it's $20). ChatGPT said ElevenLabs Starter was $9/mo (it's $5). Both were wrong. `PRICING_DATA.md` was written entirely from my manual verification. AI hallucinates numbers — using it for pricing would ship incorrect savings calculations.

**One time AI was clearly wrong and I caught it:**
I asked Claude to "add Gemini to the audit rules." It added a rule with `newCostPerSeat: () => 0` — implying Gemini is free. But Gemini Advanced is $20/month. The rule would have told every Gemini Advanced user to "switch to free tier" — which is the plan they're already on, not a savings opportunity. I caught this in code review because I knew the pricing from my manual verification. The AI confidently generated wrong logic.

**What this taught me:** AI is great for syntax and structure. It's dangerous for domain-specific facts (pricing, plan features, utilization logic). Verify everything that changes user outcomes.

---

## 5. Self-ratings (1–10) with one-sentence justification for each

**Discipline: 7/10**
I worked 6 out of 7 days (took one day off for a personal commitment, logged it honestly in DEVLOG), with daily commits distributed across the week — not a weekend cram.

**Code quality: 8/10**
TypeScript strict mode, zero `any` types, 7 passing tests, CI lint+test+build on every push — but ResultsPanel is 350+ lines and should be split.

**Design sense: 9/10**
Dark glassmorphism UI with gradient accents looks polished; light mode fully functional after fixing CSS variable bugs; Recharts visualizations are meaningful, not decorative.

**Problem-solving: 8/10**
Found and fixed rule-ordering bug (specificity issue), the SVG stroke CSS property bug, Vercel env var build failure, and light mode invisible-text issues — all debugged systematically.

**Entrepreneurial thinking: 9/10**
Talked to 3 real founders (USER_INTERVIEWS.md), built GTM with specific channels (not "SEO and content"), documented unit economics with actual math, and designed lead-capture → Credex consultation funnel. Deduction: no paying users yet (day 6 of 7).
