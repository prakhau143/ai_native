import Groq from "groq-sdk";
import type { AuditResult } from "./auditEngine";

const SYSTEM_PROMPT = `You are a senior AI FinOps analyst — think McKinsey meets Bloomberg Terminal.
Your job is to write sharp, CFO-quality spending audits for startup teams.
Rules:
- Be ruthlessly specific: use exact $ figures and percentages from the data.
- Prioritise by ROI impact, not alphabetically.
- Never use filler phrases like "great opportunity" or "consider exploring".
- Write in plain prose — no bullets, no headers, no markdown.
- Target length: 90–120 words.`;

export async function generateAISummary(result: AuditResult): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return result.summary;

  // Build a rich context snapshot
  const criticalRecs = result.recommendations
    .filter((r) => r.priority === "critical" && r.saving > 0)
    .slice(0, 3)
    .map((r) => `${r.toolName}: ${r.suggestedAction} from ${r.currentPlan} → saves $${r.saving}/mo`);

  const highRecs = result.recommendations
    .filter((r) => r.priority === "high" && r.saving > 0)
    .slice(0, 2)
    .map((r) => `${r.toolName}: $${r.saving}/mo`);

  const vendorRisk = result.vendorConcentration?.[0];
  const vendorNote = vendorRisk && vendorRisk.percentage >= 60
    ? `${vendorRisk.percentage}% of spend is concentrated on ${vendorRisk.vendor} — vendor lock-in risk.`
    : null;

  const prompt = `You are analyzing AI tool spend for a startup. Write a single executive summary paragraph.

METRICS:
- Monthly AI spend: $${result.totalCurrentCost}/mo across ${result.recommendations.length} tool(s)
- Recoverable savings: $${result.totalSaving}/mo (${result.savingPercent}%)
- Annual savings opportunity: $${result.annualSaving}
- Waste score: ${result.wasteScore}/100 (industry avg: 38)
- Stack efficiency: ${result.efficiencyScore}/100
- Stack maturity: ${result.stackMaturityScore}/100

CRITICAL ACTIONS (highest ROI):
${criticalRecs.length ? criticalRecs.join("\n") : "None identified"}

HIGH-VALUE ACTIONS:
${highRecs.length ? highRecs.join("\n") : "None identified"}

${vendorNote ? `VENDOR RISK: ${vendorNote}` : ""}

Write 90–120 words. Start with the biggest dollar figure. Be specific. No bullet points. Plain prose only.`;

  try {
    const groq = new Groq({ apiKey: key });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 200,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text && text.length > 40 ? text : result.summary;
  } catch (err) {
    console.error("generateAISummary error:", err);
    return result.summary;
  }
}
