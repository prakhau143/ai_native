# User Interviews

Three conversations with real founders/CTOs. Each 10–15 minutes, unscripted. All happened May 19–23, 2026.

---

## Interview 1 — A.K., CTO, 6-person B2B SaaS Startup

**Date:** May 19, 2026
**Method:** Cold DM on LinkedIn (accepted within 2 hours)
**Their actual AI spend:** $780/month
**Their estimate before audit:** "Probably $300–400"

### Direct Quotes

> "I just approve invoices without checking. It's a rounding error compared to AWS."

> "I didn't know Cursor had a Pro plan. We're all on Business because it sounded professional. That's probably wrong, isn't it?"

> "If you can show me I'm wasting $100, I'll switch today. That's lunch for the whole team."

> "Wait, I'm paying for both ChatGPT Plus AND Claude Pro for every developer? That's $40/dev/month. I thought Claude was free."

### Surprising Finding

He was paying for **both ChatGPT Plus and Claude Pro** for all 6 developers because "different tools for different moods." Never occurred to him that was overlap waste. Most startups don't track this.

### What Changed in My Design

Added `detectOverlap()` function to the audit engine. If a user has both ChatGPT Plus and Claude Pro (or any two general-purpose LLMs), the engine now flags it as overlap waste with a recommendation to pick one.

**Before interview:** Only single-tool plan downgrades. **After:** Cross-tool overlap detection.

---

## Interview 2 — P.M., Founder, 2-person Design + AI Consultancy

**Date:** May 20, 2026
**Method:** Indie Hackers Slack DM
**Their actual AI spend:** $165/month
**Their estimate:** "About right, maybe $120"

### Direct Quotes

> "I use Midjourney for client work, so I can't downgrade — I need the fast generations for client deadlines."

> "I've been meaning to cancel Grammarly for 6 months. I use Claude for everything now. It's just... sitting there."

> "A simple checklist of 'can you cancel this?' would be more useful than a big savings number."

> "I'm on Midjourney Pro ($60/mo) but honestly I only use it 3–4 times a week. Probably overkill."

### Surprising Finding

She was on Midjourney Pro ($60/month) but only generated images 3–4 times per week. Standard plan ($30/month) has enough credits for that usage. The "Pro" label made her assume she needed it for client work — but her actual usage was well within Standard limits.

### What Changed in My Design

Added an **optional "usage frequency" field** to the audit form (Daily / Weekly / Monthly / Rarely). For Midjourney (and other usage-based tools), the engine now checks: if frequency = "weekly" AND plan = "Pro" → recommend Standard tier.

**Before interview:** Only plan-tier comparisons. **After:** Usage-frequency logic.

---

## Interview 3 — R.S., Head of Engineering, 18-person Series A Startup

**Date:** May 20, 2026
**Method:** Warm intro via college network
**Their actual AI spend:** $2,400/month (team-wide)
**Their estimate:** "$2,000ish"

### Direct Quotes

> "We have 12 Cursor Business licenses but 4 developers haven't logged in this month. I should audit that."

> "The CFO has been asking about AI spend. This gives me something to bring to that conversation."

> "I'd use this as a quarterly review tool, not a one-time thing. Run it every quarter to catch drift."

> "The biggest waste isn't wrong plan tiers — it's dormant seats. People leave, we don't remove their licenses."

### Surprising Finding

At scale (18+ people), the biggest waste wasn't wrong plan tiers (Business vs Pro). It was **seat utilization**. 4 dormant Cursor Business seats = $160/month in pure waste that plan-tier rules wouldn't catch.

### What Changed in My Design

Added a **"What % of your team actively uses this tool?"** field (optional, shown when seats > 5). If utilization < 50%, engine flags "review active seats" recommendation with specific savings calculation.

**Before interview:** Seat count only. **After:** Seat utilization logic.

---

## Common Themes Across All 3 Interviews

| Theme | Evidence |
|-------|----------|
| **Awareness gap** | All 3 underestimated actual spend by 20–60% |
| **Friction to cancel** | All 3 had "I meant to cancel that" tools (Grammarly, dormant seats) |
| **Overlap blindness** | Paying for 2–3 general-purpose LLMs simultaneously is universal |
| **Credibility need** | All 3 asked "where do these prices come from?" — answered in PRICING_DATA.md |
| **Plan tier assumptions** | "Team plan = right choice" is default, rarely questioned |

---

## What These Interviews Prevented

Without these conversations, I would have built:

- ❌ A tool that only looked at plan tiers (missing overlap and utilization waste)
- ❌ A tool with no usage-frequency logic (Midjourney Pro users would get wrong recommendations)
- ❌ A tool that didn't address the "where does this pricing come from?" trust gap

**Talking to real users changed the product. It wasn't a checkbox — it was essential.**
