# Economics

## Unit Economics (Bottom-Up)

| Metric | Value | Source / Assumption |
|--------|-------|---------------------|
| Avg monthly savings surfaced per audit | $620 | Based on rule engine test data on 20 sample stacks |
| % of audits with "high savings" (>$500) | 35% | User interview data + industry estimate |
| Lead → consultation click rate | 10% | SaaS warm inbound benchmark |
| Consultation → Credex customer | 25% | Credex historical close rate (from public data) |
| Average contract value (ACV) | $8,400/yr ($700/mo) | Credex avg deal size (estimated from AI credit market) |
| Customer LTV (3-year retention) | $25,200 | 3 years × $8,400 (conservative; SaaS retention often longer) |

---

## Funnel Math

```
1,000 audits/month
  × 35% high-savings = 350 high-savings leads
  × 10% CTA click → consultation booked = 35 calls
  × 25% close rate = 8.75 new Credex customers/month
  × $8,400 ACV = $73,500 new ARR/month
  → $882,000 ARR added per year from this channel
```

---

## Customer Acquisition Cost (CAC) by Channel

| Channel | CAC | Calculation |
|---------|-----|-------------|
| **Organic (HN / Twitter / Slack)** | $0 | No paid spend |
| **LinkedIn DMs (manual)** | $0 | My time not counted in CAC |
| **Paid Twitter ads** | $85–230 | $3–8 CPA × 10% lead capture × 25% close = $120–320 |
| **Paid LinkedIn ads** | $120–400 | $5–12 CPA × funnel = $200–480 |
| **Outbound SDR (baseline)** | $1,200–2,500 | Industry benchmark for B2B SaaS SDR |

**Verdict:** Even paid acquisition at $320 CAC is 4–8× cheaper than outbound SDR.

---

## Path to $1M ARR Contributed

Target: **1,200 new Credex customers/year** from SpendWiseAI channel.

Required inputs:
- 1,200 customers ÷ 25% close rate = 4,800 consultations/year
- 4,800 consultations ÷ 10% click rate = 48,000 high-savings leads/year
- 48,000 high-savings leads ÷ 35% of audits = **137,000 audits/year** (~11,400/month)

At 11,400 audits/month:
- Organic: 4,000 audits (free)
- Paid: 7,400 audits at $5 CPA = $37,000/month spend
- Generates: ~400 consultations/month → ~100 customers/month → $840,000 new ARR/month
- **ROI: ($840k ARR - $37k spend) / $37k = 21.7× monthly ROI**

---

## Break-Even Point

Fixed costs at scale (11k audits/month):

| Item | Monthly Cost |
|------|-------------|
| Supabase Pro | $25 |
| Resend (10k emails) | $10 |
| Upstash Redis | $15 |
| Vercel Pro | $20 |
| Edge compute (AI summaries) | $50 |
| **Total fixed** | **$120/month** |

**Per-audit value to Credex:**
= 35% high-savings × 10% click × 25% close × $700/mo ACV
= 0.35 × 0.10 × 0.25 × $700 = **$6.13 per audit**

**Break-even audits needed:** $120 fixed ÷ $6.13 = **20 audits/month**

Even at 20 audits/month (far below target), fixed costs are covered. At 11k/month, variable ad spend is the only meaningful cost — and at $6.13 value per audit, $5 CPA is profitable.

---

## What Would Have to Be True for $1M ARR in 18 Months

1. **High-savings rate stays at 35%** (not declining as tool pricing optimizes)
2. **Conversion funnel holds** (10% → 25% → 3-year retention)
3. **Credex can fulfill 100 new customers/month** (supply-side capacity)
4. **No major competitor launches free audit tool** (moat = Credex's portfolio network)
5. **AI tool prices don't collapse** (if Cursor drops Business to $20, savings evaporate)

**Most sensitive assumption:** High-savings rate. If it drops to 20%, audits needed double to 22,000/month. Paid CAC becomes $10 CPA to stay profitable — still viable but margin shrinks.

---

## Summary

| Metric | Value |
|--------|-------|
| Value per audit to Credex | $6.13 |
| Organic CAC | $0 |
| Paid CAC (break-even) | $6.13 |
| Monthly audits needed for $1M ARR/year | 11,400 |
| Monthly ad spend at scale | $37,000 |
| ROI at scale | 21.7× monthly |

**Verdict:** Economics work. This tool is a profitable lead-gen asset at even modest scale.
