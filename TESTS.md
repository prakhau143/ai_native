# Tests

## Running Tests

```bash
npm test
```

## Test File

`__tests__/auditEngine.test.ts` — 7 tests covering the audit engine rule logic.

| # | Test | What it validates |
|---|---|---|
| 1 | Cursor Business ≤3 seats → downgrade | Most common over-spend pattern |
| 2 | ChatGPT Team ≤2 seats → Plus | Minimum seat trap |
| 3 | Claude Max → Pro | Power plan waste |
| 4 | OpenAI API >$400 → Credex api-switch | High-value lead identification |
| 5 | Cursor Pro 1 seat → keep | Already optimal — no false positives |
| 6 | Savings >$500 → tier="high" | Correct CTA routing |
| 7 | Zero savings → tier="optimal" | "Well spent" UI routing |

## What's NOT tested (yet)

- API routes (would need Supabase + Resend mocks)
- React components (would need @testing-library/react + jest-environment-jsdom)
- Cross-tool overlap detection (e.g., paying for both ChatGPT and Claude)

## CI

Tests run automatically on every push via `.github/workflows/ci.yml`.
