import type { AuditResult } from "./auditEngine";

interface SlackAuditPayload {
  email: string;
  company: string | null;
  result: AuditResult;
  auditId: string;
}

function wasteEmoji(score: number): string {
  if (score >= 70) return "🔴";
  if (score >= 40) return "🟡";
  return "🟢";
}

function riskLabel(score: number): string {
  if (score >= 70) return "Critical";
  if (score >= 40) return "Moderate";
  return "Low";
}

export async function sendSlackAuditAlert(payload: SlackAuditPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return; // silently skip if not configured

  const { email, company, result, auditId } = payload;
  const savingPercent = result.savingPercent ?? 0;
  const toolCount = result.recommendations?.length ?? 0;
  const displayCompany = company?.trim() || "Unknown company";

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🎯 New SpendWise AI Audit",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Company*\n${displayCompany}`,
        },
        {
          type: "mrkdwn",
          text: `*Contact*\n${email}`,
        },
        {
          type: "mrkdwn",
          text: `*Monthly AI Spend*\n$${result.totalCurrentCost?.toLocaleString() ?? "—"}/mo`,
        },
        {
          type: "mrkdwn",
          text: `*Recoverable Savings*\n$${result.totalSaving?.toLocaleString() ?? "—"}/mo (${savingPercent}%)`,
        },
        {
          type: "mrkdwn",
          text: `*Annual Opportunity*\n$${result.annualSaving?.toLocaleString() ?? "—"}`,
        },
        {
          type: "mrkdwn",
          text: `*Tools Audited*\n${toolCount} tool${toolCount !== 1 ? "s" : ""}`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Waste Score*\n${wasteEmoji(result.wasteScore)} ${result.wasteScore}/100 — ${riskLabel(result.wasteScore)} risk`,
        },
        {
          type: "mrkdwn",
          text: `*Stack Efficiency*\n${result.efficiencyScore ?? "—"}/100`,
        },
      ],
    },
    ...(result.summary
      ? [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*AI Summary*\n_${result.summary.slice(0, 280)}${result.summary.length > 280 ? "…" : ""}_`,
            },
          },
        ]
      : []),
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View in Supabase", emoji: true },
          url: `https://app.supabase.com/project/_/table-editor?table=audits`,
          style: "primary",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Audit ID: \`${auditId}\` • ${new Date().toUTCString()}`,
        },
      ],
    },
    { type: "divider" },
  ];

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "SpendWise AI",
        icon_emoji: ":bar_chart:",
        blocks,
        // Fallback text for notifications / non-Block-Kit clients
        text: `New audit: ${displayCompany} (${email}) — $${result.totalSaving?.toLocaleString()}/mo savings identified`,
      }),
    });
    if (!res.ok) {
      console.error("Slack webhook error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("sendSlackAuditAlert failed:", err);
  }
}
