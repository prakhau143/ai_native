# Metrics

## North Star Metric

**Monthly Recurring Savings Identified (MRSI):** Total $/month in savings surfaced across all audits in the last 30 days.

Why: It directly measures whether the product is delivering its core promise. Growing MRSI means more engaged users with real stacks — the leading indicator for Credex lead quality.

---

## Input Metrics (weekly tracking)

| Metric | Target (Week 4) | Instrument via |
|---|---|---|
| Audit completions (form submitted) | 200 | `audit_completed` event |
| Lead capture rate (email submitted / audit completed) | >60% | `lead_captured` event |
| Share rate (share URL clicked / result viewed) | >8% | `result_shared` event |
| High-savings audit rate (>$500) | >30% | `savings_tier` in DB |
| Consultation booking rate (high-savings → Calendly click) | >12% | Calendly UTM + `consultation_clicked` event |

---

## Instrumentation Plan

```typescript
// Add to page.tsx after each state transition
// Use PostHog or Vercel Analytics (both free tier)

// 1. Form submitted
analytics.capture('audit_completed', {
  tool_count: tools.length,
  total_spend: totalCurrentCost,
});

// 2. Lead captured
analytics.capture('lead_captured', {
  savings_tier: result.savingsTier,
  estimated_saving: result.totalSaving,
});

// 3. Result shared
analytics.capture('result_shared', { public_id: auditId });
```

---

## Pivot Triggers

| Signal | Action |
|---|---|
| Share rate < 5% after 100 audits | Redesign result page savings headline |
| Lead capture rate < 40% | Remove company field (reduce friction) |
| Consultation click rate < 8% | A/B test high-savings CTA copy |
| Avg savings < $200 | Review and tighten rule engine (false positives) |

---

## Lighthouse Scores (mobile, live URL)

Tested on https://spendwise-ai-dun.vercel.app — 2026-05-25

| Category | Score | Threshold | Status |
|---|---|---|---|
| Performance | **95** | ≥85 | ✅ |
| Accessibility | **100** | ≥90 | ✅ |
| Best Practices | **100** | ≥90 | ✅ |
| SEO | **100** | — | ✅ |

**Core Web Vitals:**
- FCP: 1.4s | LCP: 2.4s | TBT: 90ms | CLS: 0

**How we achieved this:**
- `next/dynamic` lazy-loads ResultsPanel + chart components (only needed after audit runs)
- All form labels linked via `htmlFor`/`id` pairs
- CLS = 0 via fixed layouts with no layout shifts
