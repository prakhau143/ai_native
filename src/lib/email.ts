import nodemailer from "nodemailer";

export type AuditEmailParams = {
  email: string;
  savings: number;
  annualSaving: number;
  publicId: string;
  savingsTier: "optimal" | "low" | "medium" | "high";
  aiSummary?: string;
  // Rich data for premium template
  toolsCount?: number;
  efficiencyScore?: number;
  wasteScore?: number;
  downgradeSavings?: number;
  apiSavings?: number;
  seatSavings?: number;
};

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

function buildHtml({
  savings,
  annualSaving,
  publicId,
  savingsTier,
  aiSummary,
  toolsCount = 0,
  efficiencyScore = 0,
  wasteScore = 0,
  downgradeSavings = 0,
  apiSavings = 0,
  seatSavings = 0,
}: AuditEmailParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://spendwise-ai-dun.vercel.app";
  const reportUrl = `${baseUrl}/results/${publicId}?public=true`;
  const summaryText = aiSummary ?? "Your audit is complete. Follow the recommendations above to start saving on your AI stack.";
  const isHighSavings = savingsTier === "high";

  // Bar widths — proportional to share of total breakdown savings
  const total = downgradeSavings + apiSavings + seatSavings;
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const downgradeW = pct(downgradeSavings);
  const apiW = pct(apiSavings);
  const seatW = pct(seatSavings);

  // Bar fill label text
  const barLabel = (v: number) => (v > 0 ? `$${v.toLocaleString()}` : "");

  // Savings section — different for zero vs positive savings
  const savingsSection =
    savings > 0
      ? `
      <div class="savings-card">
        <div class="savings-label">💰 MONTHLY SAVINGS FOUND</div>
        <div class="savings-amount">$${savings.toLocaleString()}<small>/mo</small></div>
        <div class="savings-year">That's $${annualSaving.toLocaleString()} per year</div>
      </div>`
      : `
      <div class="savings-card" style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #a7f3d0;">
        <div class="savings-label" style="color:#065f46;">✅ STACK ALREADY OPTIMISED</div>
        <div style="font-size:32px;font-weight:800;color:#059669;margin:12px 0 4px;">You're spending well!</div>
        <div class="savings-year">No major waste found in your current AI stack.</div>
      </div>`;

  // Credex callout for high savings
  const credexSection = isHighSavings
    ? `
      <div style="background:#fffbeb;border-radius:20px;padding:20px;margin:20px 0;border:1px solid #fcd34d;">
        <div style="font-size:16px;font-weight:700;color:#92400e;margin-bottom:8px;">🚀 We'll reach out soon</div>
        <div style="color:#78350f;font-size:14px;line-height:1.6;">
          Your savings potential (<strong>$${savings.toLocaleString()}/mo</strong>) puts you in our high-value tier.
          A Credex advisor will contact you within 24 hours to discuss volume discounts on AI credits.
        </div>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Spend Report – SpendWiseAI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #0f0c29, #1a1a3e, #24243e);
      margin: 0; padding: 40px 20px;
    }
    .email-container {
      max-width: 600px; margin: 0 auto; background: #ffffff;
      border-radius: 32px; overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    .header {
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      padding: 32px 28px; text-align: center;
      border-bottom: 3px solid #06b6d4;
    }
    .logo {
      font-size: 28px; font-weight: 800;
      background: linear-gradient(135deg, #06b6d4, #8b5cf6);
      -webkit-background-clip: text; background-clip: text;
      color: transparent; letter-spacing: -0.5px;
    }
    .logo span { background: none; color: #ffffff; font-weight: 600; }
    .tagline { color: #94a3b8; font-size: 13px; margin-top: 8px; letter-spacing: 0.5px; }
    .content { padding: 32px 28px; background: #ffffff; }
    .greeting h2 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .greeting p { color: #64748b; font-size: 15px; line-height: 1.5; }
    .savings-card {
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      border-radius: 24px; padding: 24px; text-align: center;
      margin: 24px 0; border: 1px solid #a7f3d0;
    }
    .savings-label { color: #065f46; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .savings-amount { font-size: 48px; font-weight: 800; color: #059669; margin: 12px 0 4px; line-height: 1; }
    .savings-amount small { font-size: 20px; font-weight: 500; }
    .savings-year { font-size: 18px; font-weight: 600; color: #047857; margin-top: 8px; }
    .metrics-row { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .metric-card {
      flex: 1; background: #f8fafc; border-radius: 20px;
      padding: 16px; text-align: center; border: 1px solid #e2e8f0;
    }
    .metric-value { font-size: 28px; font-weight: 800; color: #0f172a; }
    .metric-label { font-size: 12px; color: #64748b; margin-top: 4px; }
    .analysis-box {
      background: #f1f5f9; border-radius: 20px; padding: 20px;
      margin: 20px 0; border-left: 4px solid #06b6d4;
    }
    .analysis-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .analysis-text { color: #334155; font-size: 14px; line-height: 1.6; }
    .graph-section { margin: 24px 0; }
    .graph-title { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .bar-item { margin-bottom: 12px; }
    .bar-label { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 4px; }
    .bar-bg { background: #e2e8f0; border-radius: 10px; height: 32px; overflow: hidden; }
    .bar-fill {
      background: linear-gradient(90deg, #06b6d4, #8b5cf6); height: 100%;
      border-radius: 10px; display: flex; align-items: center;
      justify-content: flex-end; padding-right: 10px;
      color: white; font-size: 12px; font-weight: 600; min-width: 8px;
    }
    .services-section { margin: 28px 0; }
    .services-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; text-align: center; }
    .services-grid { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
    .service-chip {
      background: #f1f5f9; padding: 8px 16px; border-radius: 40px;
      font-size: 12px; font-weight: 500; color: #1e293b;
      display: flex; align-items: center; gap: 6px;
    }
    .service-chip .dot { width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; }
    .cta-buttons { display: flex; gap: 16px; margin: 28px 0 20px; flex-wrap: wrap; }
    .btn-primary {
      flex: 1; background: linear-gradient(135deg, #06b6d4, #8b5cf6);
      color: white; text-align: center; padding: 14px 24px; border-radius: 40px;
      text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;
    }
    .btn-secondary {
      flex: 1; background: #f1f5f9; color: #1e293b; text-align: center;
      padding: 14px 24px; border-radius: 40px; text-decoration: none;
      font-weight: 600; font-size: 14px; border: 1px solid #e2e8f0;
    }
    .footer {
      background: #f8fafc; padding: 24px 28px; text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.5; }
    .footer a { color: #06b6d4; text-decoration: none; }
    hr { margin: 16px 0; border: none; border-top: 1px solid #e2e8f0; }
    @media (max-width: 500px) {
      .metrics-row { flex-direction: column; }
      .cta-buttons { flex-direction: column; }
      .content { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">✨ SpendWise<span>AI</span></div>
      <div class="tagline">AI Cost Intelligence Platform</div>
    </div>

    <div class="content">
      <div class="greeting">
        <h2>Your AI Spend Report</h2>
        <p>Here's your personalized analysis — we found <strong>real savings opportunities</strong> in your AI stack.</p>
      </div>

      ${savingsSection}

      <div class="metrics-row">
        <div class="metric-card">
          <div class="metric-value">${toolsCount}</div>
          <div class="metric-label">AI Tools Analyzed</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${efficiencyScore}%</div>
          <div class="metric-label">Stack Efficiency</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${wasteScore}%</div>
          <div class="metric-label">Waste Score</div>
        </div>
      </div>

      <div class="analysis-box">
        <div class="analysis-title">🧠 AI Analysis</div>
        <div class="analysis-text">${summaryText}</div>
      </div>

      ${
        total > 0
          ? `
      <div class="graph-section">
        <div class="graph-title">📊 Savings Breakdown by Opportunity</div>
        <div class="bar-item">
          <div class="bar-label"><span>Tool Downgrades</span><span>$${downgradeSavings.toLocaleString()}/mo</span></div>
          <div class="bar-bg"><div class="bar-fill" style="width:${downgradeW}%">${barLabel(downgradeSavings)}</div></div>
        </div>
        <div class="bar-item">
          <div class="bar-label"><span>API Optimization</span><span>$${apiSavings.toLocaleString()}/mo</span></div>
          <div class="bar-bg"><div class="bar-fill" style="width:${apiW}%">${barLabel(apiSavings)}</div></div>
        </div>
        <div class="bar-item">
          <div class="bar-label"><span>Plan Consolidation</span><span>$${seatSavings.toLocaleString()}/mo</span></div>
          <div class="bar-bg"><div class="bar-fill" style="width:${seatW}%">${barLabel(seatSavings)}</div></div>
        </div>
      </div>`
          : ""
      }

      ${credexSection}

      <div class="services-section">
        <div class="services-title">✨ What SpendWise AI Provides</div>
        <div class="services-grid">
          <div class="service-chip"><span class="dot"></span> Spend audit engine</div>
          <div class="service-chip"><span class="dot"></span> Cross-tool overlap detection</div>
          <div class="service-chip"><span class="dot"></span> AI cost forecasting</div>
          <div class="service-chip"><span class="dot"></span> Vendor comparison</div>
          <div class="service-chip"><span class="dot"></span> Credex volume discounts</div>
          <div class="service-chip"><span class="dot"></span> Shareable reports</div>
        </div>
      </div>

      <div class="cta-buttons">
        <a href="${reportUrl}" class="btn-primary">📄 View Full Report →</a>
        <a href="https://calendly.com/mittalprakhar504/30min" class="btn-secondary">📅 Book Free Consultation</a>
      </div>

      <p style="font-size:12px;color:#64748b;text-align:center;margin-top:16px;">
        🔒 Your data is private. We never share your information with third parties.
      </p>
    </div>

    <div class="footer">
      <div class="footer-text"><strong>SpendWise AI</strong> — AI Cost Intelligence Platform</div>
      <div class="footer-text" style="margin-top:8px;">Made for founders who want to scale smarter.</div>
      <hr />
      <div class="footer-text">
        You received this because you requested an AI spend audit.<br />
        <a href="${baseUrl}">SpendWise AI</a> · <a href="${baseUrl}">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendAuditEmail(
  params: AuditEmailParams
): Promise<{ sent: boolean; error?: string }> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    console.warn("SMTP credentials not set — skipping email");
    return { sent: false, error: "no_credentials" };
  }

  const { email, savings } = params;
  const html = buildHtml(params);

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
