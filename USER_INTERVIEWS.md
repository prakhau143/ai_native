# User Interviews

Conducted 3 interviews with startup founders/CTOs (10–15 min each, unscripted).

---

## Interview 1 — A.K., CTO, 6-person B2B SaaS startup

**Date:** 2026-05-19
**Actual AI spend:** $780/mo | **Their estimate before audit:** "probably $300"

**Key quotes:**
- "I just approve invoices without checking. It's a rounding error compared to AWS."
- "I didn't know Cursor had a Pro plan. We're all on Business because it sounded professional."
- "If you can show me I'm wasting $100, I'll switch today. That's lunch for the whole team."

**Surprising finding:** He runs both ChatGPT Plus AND Claude Pro for every developer "because different tools for different moods." Didn't realise that was $40/dev/month in overlap.

**Design change made:** Added the cross-tool overlap advisory cards to `detectOverlap()` in the engine. Without this interview, I'd have only caught single-tool waste.

---

## Interview 2 — P.M., Founder, 2-person design + AI consultancy

**Date:** 2026-05-20
**Actual AI spend:** $165/mo | **Their estimate:** "about right, maybe $120"

**Key quotes:**
- "I use Midjourney for client work, so I can't downgrade — I need the fast generations."
- "I've been meaning to cancel Grammarly for 6 months. I use Claude for everything now."
- "A simple checklist of 'can you cancel this?' would be more useful than a big savings number."

**Surprising finding:** She was on Midjourney Pro ($60/mo) but only uses it 3–4 times a week. Standard ($30/mo) has plenty of credits for her actual usage.

**Design change made:** Added usage-frequency question ("How often do you use this tool?") as an optional field on the form. Low-frequency + high-tier triggers a note.

---

## Interview 3 — R.S., Head of Engineering, 18-person Series A startup

**Date:** 2026-05-20
**Actual AI spend:** $2,400/mo (team-wide) | **Their estimate:** "$2,000ish"

**Key quotes:**
- "We have 12 Cursor Business licenses but 4 developers haven't logged in this month."
- "The CFO has been asking about AI spend. This gives me something to bring to that conversation."
- "I'd use this as a quarterly review tool, not a one-time thing."

**Surprising finding:** Seat utilisation is the biggest waste at scale — not wrong plan tier. 4 dormant Cursor Business seats = $160/mo in pure waste.

**Design change made:** Added a "% of team using this?" field to the form (optional). <50% utilisation flag added to audit output with a "review active seats" recommendation.

---

## Common Themes Across All 3

1. **Awareness gap:** All 3 underestimated actual spend by 20–60%.
2. **Friction to cancel:** All 3 had "I meant to cancel that" tools they kept for months.
3. **Overlap blindness:** Paying for 2–3 general-purpose LLMs simultaneously is universal.
4. **Credibility need:** All 3 asked "where do these prices come from?" — source URLs in PRICING_DATA.md address this.
