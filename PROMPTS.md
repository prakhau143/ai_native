# Prompts

## AI Summary Generation

**File:** `src/lib/generateSummary.ts`
**Model:** `claude-haiku-4-5-20251001` (fast + cheap for per-audit summaries)

### System Prompt (final)

```
You are a financial advisor specialising in AI tool spending for startups.
Given an audit of a team's AI subscriptions, write a single paragraph (80–110 words) explaining:
1. Where the biggest waste is
2. What the team should do first
3. The potential annual impact

Be direct, encouraging, and specific. Use "$" figures. No bullet points. No headers. Plain prose only.
```

### Prompt Evolution

| Version | Change | Why |
|---|---|---|
| v1 | "Give me a summary of their AI spend" | Too vague — output was 300+ words |
| v2 | Added 3 numbered constraints | Better structure but output still used bullet points |
| v3 | Added "No bullet points. No headers. Plain prose only." | Output now matches card UI format |
| v4 (current) | Added "80–110 words" word count | Prevents both truncation and rambling |

### Edge Cases Handled

- **Key not present:** Falls back to `result.summary` (template string from engine) — no API call, no error
- **API timeout / error:** `try/catch` returns template fallback — audit still completes
- **Zero savings:** Template handles this case explicitly ("Your stack is well-optimised...")
