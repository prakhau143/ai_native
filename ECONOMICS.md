# Economics

## Unit Economics

| Metric | Value | Assumption |
|---|---|---|
| Avg monthly savings surfaced | $620/audit | Based on rule engine test data |
| % of audits that are "high savings" (>$500) | ~35% | Industry est. from Credex pipeline data |
| Lead → consultation conversion | 10% | SaaS sales benchmark for warm inbound |
| Consultation → Credex customer | 25% | Credex historical close rate |
| Average contract value (ACV) | $8,400/yr ($700/mo) | Credex avg deal size |
| Customer LTV (3yr avg) | $25,200 | Assumption: 3-year retention |

## Revenue Model

SpendWiseAI is a **lead generation asset** for Credex (not a standalone SaaS).

```
1,000 audits/month
  × 35% high-savings = 350 high-savings leads
  × 10% CTA click → consultation booked = 35 calls
  × 25% close rate = ~9 new Credex customers/month
  × $8,400 ACV = $75,600 new ARR/month
  → $907,200 ARR added per year from this channel
```

## CAC via SpendWiseAI

- **Organic (HN / Twitter):** $0 CAC
- **Paid (Twitter/LinkedIn ads):** est. $3–8 per audit completion → $85–$230 per Credex customer acquired
- **Break-even vs. outbound SDR:** SDR CAC ~$1,200–$2,500. SpendWiseAI is 10× cheaper.

## Path to $1M ARR Contributed

Needs: ~1,100 new Credex customers/year from this channel.
Requires: ~122 calls/month → ~1,220 high-savings leads/month → **~3,500 audits/month**.
At 50% organic + 50% paid ($5 CPA): total CAC spend ~$8,750/month for $83k+ ARR/month. **ROI: 9.5×.**

## Cost to Run SpendWiseAI

| Item | Monthly Cost |
|---|---|
| Vercel Pro | $20 |
| Supabase (free tier → Pro at 5k audits/mo) | $0–$25 |
| Resend (100k emails free) | $0 |
| Anthropic API (Haiku, ~$0.001/summary) | ~$3.50 at 3,500 audits |
| **Total** | **~$50/mo** |
