# Reflection

## 1. What was the hardest technical problem?

The hardest problem was designing the audit engine rules to avoid false positives. Early versions recommended downgrading anyone on a "Business" plan regardless of team size — which is wrong for teams of 10+. I added `seats` thresholds to every rule so recommendations are context-aware. The cross-tool overlap detection (running after per-tool rules) was a second pass I added after realising single-tool analysis misses the biggest waste: paying for both ChatGPT and Claude.

## 2. What would you do differently?

I'd start with user interviews before writing a single rule. I assumed "Claude Max → Pro" was always a downgrade, but one interview revealed a founder who hits Claude Pro limits daily — for them that's wrong advice. The engine needs a `usage_intensity` field ("light", "moderate", "heavy") to gate some rules. I'd add that in week 2.

## 3. What did you learn about the problem space?

Most founders don't know what they're paying. The median response during user interviews was "probably around $300" — actual number was $780. The audit isn't just about the recommendation; the act of filling in the form creates awareness that drives action even before results appear.

## 4. How did you handle abuse?

Honeypot field (hidden `name="website"` input). Bots auto-fill all fields; humans never see or interact with it. Server rejects any POST where `honeypot !== ""`. For production I'd add Upstash Ratelimit (5 audits per IP per hour) and Vercel's Edge Middleware to block repeat offenders.

## 5. What's the path to $1M ARR?

The product is a top-of-funnel lead generator for Credex's core business (AI credit negotiation). Each high-savings lead ($500+/mo) represents $5,000–$20,000 ARR to Credex. At 10% conversion: 1,000 high-savings leads/month × 10% × $10k average = $1M ARR. That requires ~3,000 total audits/month (assuming 1/3 are high-savings). Totally achievable via Hacker News, indie founder communities, and one viral tweet showing "$2,400/year saved."
