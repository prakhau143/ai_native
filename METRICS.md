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

## Lighthouse Targets

| Category | Target | Current |
|---|---|---|
| Performance | ≥85 | TBD after deploy |
| Accessibility | ≥90 | TBD — run `npx @unlighthouse/cli` |
| Best Practices | ≥90 | TBD |
| SEO | ≥85 | TBD |

**Optimisation checklist:**
- [ ] Use `next/image` for all images
- [ ] Add `alt` attributes everywhere
- [ ] Form `<label>` for every input
- [ ] Remove `console.log` from production (`next.config.ts` compiler options)
- [ ] Add `<meta name="description">` to layout.tsx
- [ ] Verify color contrast ratio ≥4.5:1 for all text
