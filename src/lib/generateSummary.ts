import Groq from "groq-sdk";
import type { AuditResult } from "./auditEngine";

const SYSTEM_PROMPT =
  "You are a financial advisor specialising in AI tool spending for startups. Write short, actionable spending audits.";

export async function generateAISummary(result: AuditResult): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return result.summary;

  const auditData = {
    totalCurrentCost: result.totalCurrentCost,
    totalSaving: result.totalSaving,
    annualSaving: result.annualSaving,
    savingPercent: result.savingPercent,
    recommendations: result.recommendations
      .filter((r) => r.saving > 0)
      .map((r) => ({
        tool: r.toolName,
        action: r.suggestedAction,
        from: r.currentPlan,
        to: r.suggestedPlan,
        saving: r.saving,
      })),
  };

  const prompt = `Analyze this audit and write a single paragraph (80–110 words) for a startup.
Explain: (1) where the biggest waste is, (2) what to do first, (3) the potential annual impact.
Be direct, encouraging, and specific. Use "$" figures. No bullet points. No headers. Plain prose only.

Audit data:
${JSON.stringify(auditData, null, 2)}`;

  try {
    const groq = new Groq({ apiKey: key });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 250,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() || result.summary;
  } catch (err) {
    console.error("generateAISummary error:", err);
    return result.summary;
  }
}
