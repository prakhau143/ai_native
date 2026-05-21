import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "./auditEngine";

const SYSTEM_PROMPT = `You are a financial advisor specialising in AI tool spending for startups.
Given an audit of a team's AI subscriptions, write a single paragraph (80–110 words) explaining:
1. Where the biggest waste is
2. What the team should do first
3. The potential annual impact

Be direct, encouraging, and specific. Use "$" figures. No bullet points. No headers. Plain prose only.`;

export async function generateAISummary(result: AuditResult): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // Fallback to template when key not present (dev/test)
    return result.summary;
  }

  const client = new Anthropic({ apiKey: key });

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

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001", // fast + cheap for summaries
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Audit data:\n${JSON.stringify(auditData, null, 2)}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") return content.text;
    return result.summary;
  } catch (err) {
    console.error("generateAISummary error:", err);
    return result.summary; // Graceful fallback
  }
}
