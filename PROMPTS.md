# Prompts

## AI Summary Generation

**File:** `src/lib/generateSummary.ts`
**Provider:** Groq (free tier) — switched from Anthropic because Groq requires no credit card
**Model:** `llama-3.3-70b-versatile` (fast, high quality, free on Groq developer tier)

### System Prompt (final)

```
You are a financial advisor specialising in AI tool spending for startups.
Write short, actionable spending audits.
```

### User Prompt Template

```
Analyze this audit and write a single paragraph (80–110 words) for a startup.
Explain: (1) where the biggest waste is, (2) what to do first, (3) the potential annual impact.
Be direct, encouraging, and specific. Use "$" figures. No bullet points. No headers. Plain prose only.

Audit data:
{auditData JSON}
```

### Prompt Evolution

| Version | Change | Why |
|---|---|---|
| v1 | "Give me a summary of their AI spend" | Too vague — output was 300+ words |
| v2 | Added 3 numbered constraints | Better structure but output still used bullet points |
| v3 | Added "No bullet points. No headers. Plain prose only." | Output now matches card UI format |
| v4 (current) | Added "80–110 words" word count | Prevents both truncation and rambling |

### Edge Cases Handled

- **Key not present:** Falls back to `result.summary` (template string from `auditEngine.ts`) — no API call, no error
- **API timeout / error:** `try/catch` returns template fallback — audit still completes
- **Zero savings:** Template handles this case explicitly

### Why Groq Instead of Anthropic

Anthropic free credits require manual approval; Groq works immediately with no credit card.
The API is OpenAI-compatible so switching providers later is trivial.

### What We Tried That Didn't Work

- Anthropic API — requires paid credits or manual free-credit approval
- OpenAI API — same paid requirement
- Client-side LLM — not feasible in a serverless Next.js environment
