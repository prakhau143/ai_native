import nodemailer from "nodemailer";

type AuditEmailParams = {
  email: string;
  savings: number;
  annualSaving: number;
  publicId: string;
  savingsTier: "optimal" | "low" | "medium" | "high";
  aiSummary?: string;
};

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: false, // TLS on port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

export async function sendAuditEmail({
  email,
  savings,
  annualSaving,
  publicId,
  savingsTier,
  aiSummary,
}: AuditEmailParams): Promise<{ sent: boolean; error?: string }> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    console.warn("SMTP credentials not set — skipping email");
    return { sent: false, error: "no_credentials" };
  }

  const reportUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/results/${publicId}?public=true`;
  const isHighSavings = savingsTier === "high";
  const summaryText =
    aiSummary ??
    "Your audit is complete. Follow the recommendations above to start saving.";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your AI Spend Report</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#050b1a;color:#e2e8f0;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">

    <div style="background:linear-gradient(135deg,#06b6d4,#6366f1);border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <h1 style="color:white;margin:0;font-size:24px;font-weight:800;">Your AI Spend Report</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">SpendWise AI</p>
    </div>

    ${
      savings > 0
        ? `<div style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="margin:0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">Monthly savings found</p>
        <p style="margin:8px 0 0;font-size:42px;font-weight:900;color:#34d399;">$${savings.toLocaleString()}</p>
        <p style="margin:4px 0 0;color:#94a3b8;font-size:14px;">$${annualSaving.toLocaleString()} / year</p>
      </div>`
        : `<div style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="font-size:24px;margin:0;">✅</p>
        <p style="margin:8px 0 0;font-weight:700;color:#34d399;">You're spending well!</p>
        <p style="margin:4px 0 0;color:#94a3b8;font-size:14px;">No major waste found in your current stack.</p>
      </div>`
    }

    <div style="background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#67e8f9;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">📊 AI Analysis</p>
      <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.7;font-style:italic;">"${summaryText}"</p>
    </div>

    <div style="margin-bottom:24px;">
      <a href="${reportUrl}" style="display:block;background:linear-gradient(135deg,#06b6d4,#6366f1);color:white;text-decoration:none;text-align:center;padding:14px;border-radius:12px;font-weight:700;font-size:16px;">
        View Full Report →
      </a>
    </div>

    ${
      isHighSavings
        ? `<div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-weight:700;color:#fbbf24;">🚀 We'll reach out soon</p>
        <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">
          Your savings potential ($${savings.toLocaleString()}/mo) puts you in our high-value tier.
          A Credex advisor will contact you within 24 hours about volume discounts.
        </p>
      </div>`
        : ""
    }

    <p style="color:#475569;font-size:12px;text-align:center;margin:0;">
      SpendWiseAI — Made for founders ·
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe" style="color:#475569;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`.trim();

  try {
    const transporter = buildTransporter();
    const info = await transporter.sendMail({
      from: `"SpendWiseAI" <${user}>`,
      to: email,
      subject:
        savings > 0
          ? `Your audit: $${savings.toLocaleString()}/mo in savings found`
          : "Your AI spend audit — you're in good shape",
      html,
    });
    console.log("Email sent:", info.messageId);
    return { sent: true };
  } catch (err) {
    console.error("SMTP send error:", err);
    return { sent: false, error: String(err) };
  }
}
