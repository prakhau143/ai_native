import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, phone, monthlySpend, teamSize } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_APP_PASSWORD;

    if (!smtpUser || !smtpPass) {
      console.error("[pricing-contact] SMTP not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const savingEstimate = monthlySpend
      ? `$${Math.round(Number(monthlySpend) * 0.28)}/mo`
      : "TBD";

    // ── Email to admin ────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"SpendWiseAI" <${smtpUser}>`,
      to: smtpUser, // mittalprakhar504@gmail.com
      subject: `🔥 New Pro Lead: ${name} @ ${company || "Unknown"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>
          body { font-family: Arial, sans-serif; background: #050b1a; color: #e2e8f0; margin: 0; padding: 20px; }
          .card { max-width: 560px; margin: 0 auto; background: #0d1526; border: 1px solid rgba(6,182,212,0.3); border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #06b6d4, #6366f1); padding: 24px; }
          .header h1 { color: white; margin: 0; font-size: 22px; }
          .header p { color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px; }
          .body { padding: 24px; }
          .row { display: flex; margin-bottom: 14px; }
          .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; width: 130px; flex-shrink: 0; padding-top: 2px; }
          .value { color: #e2e8f0; font-size: 15px; font-weight: 600; }
          .highlight { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); border-radius: 8px; padding: 12px 16px; margin: 16px 0; }
          .highlight .val { color: #34d399; font-size: 24px; font-weight: 900; }
          .footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #475569; }
        </style></head>
        <body>
          <div class="card">
            <div class="header">
              <h1>⚡ New Pro Plan Lead</h1>
              <p>Someone wants to start their Pro trial — reach out within 24h</p>
            </div>
            <div class="body">
              <div class="row"><div class="label">Name</div><div class="value">${name}</div></div>
              <div class="row"><div class="label">Company</div><div class="value">${company || "—"}</div></div>
              <div class="row"><div class="label">Email</div><div class="value"><a href="mailto:${email}" style="color:#67e8f9">${email}</a></div></div>
              <div class="row"><div class="label">Phone</div><div class="value">${phone || "—"}</div></div>
              <div class="row"><div class="label">Team Size</div><div class="value">${teamSize ? `${teamSize} people` : "—"}</div></div>
              <div class="row"><div class="label">Monthly AI Spend</div><div class="value">${monthlySpend ? `$${Number(monthlySpend).toLocaleString()}/mo` : "—"}</div></div>
              <div class="highlight">
                <div style="color:#94a3b8; font-size:12px; margin-bottom:4px;">ESTIMATED SAVINGS OPPORTUNITY</div>
                <div class="val">${savingEstimate}</div>
                <div style="color:#64748b; font-size:11px; margin-top:4px;">Based on 28% average savings across similar teams</div>
              </div>
            </div>
            <div class="footer">
              Sent from SpendWiseAI pricing page · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // ── Confirmation email to lead ─────────────────────────────────────────
    await transporter.sendMail({
      from: `"SpendWiseAI" <${smtpUser}>`,
      to: email,
      subject: `Welcome to SpendWiseAI Pro, ${name.split(" ")[0]}! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>
          body { font-family: Arial, sans-serif; background: #f0f7ff; color: #0f172a; margin: 0; padding: 20px; }
          .card { max-width: 540px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 40px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #06b6d4, #6366f1, #a855f7); padding: 32px 28px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 26px; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
          .body { padding: 28px; }
          .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
          .num { background: linear-gradient(135deg, #06b6d4, #6366f1); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; flex-shrink: 0; }
          .step-text h3 { margin: 0 0 2px; font-size: 15px; color: #0f172a; }
          .step-text p { margin: 0; font-size: 13px; color: #64748b; }
          .cta { display: block; text-align: center; background: linear-gradient(135deg, #06b6d4, #6366f1); color: white; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; margin-top: 20px; }
          .footer { padding: 16px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style></head>
        <body>
          <div class="card">
            <div class="header">
              <h1>You're in! ✨</h1>
              <p>Your Pro trial request has been received</p>
            </div>
            <div class="body">
              <p style="color:#64748b; margin-bottom:20px;">Hi ${name.split(" ")[0]}, our team will contact you within <strong>24 hours</strong> to set up your Pro account. Here's what happens next:</p>
              <div class="step">
                <div class="num">1</div>
                <div class="step-text">
                  <h3>Our team reviews your profile</h3>
                  <p>We'll analyse your AI stack and prepare personalised recommendations.</p>
                </div>
              </div>
              <div class="step">
                <div class="num">2</div>
                <div class="step-text">
                  <h3>15-min onboarding call</h3>
                  <p>We'll walk you through the Pro dashboard and connect your AI tools.</p>
                </div>
              </div>
              <div class="step">
                <div class="num">3</div>
                <div class="step-text">
                  <h3>Start saving immediately</h3>
                  <p>Your 14-day Pro trial begins — no credit card required.</p>
                </div>
              </div>
              <a class="cta" href="${process.env.NEXT_PUBLIC_BASE_URL || "https://spendwiseai.com"}">Run a Free Audit While You Wait →</a>
            </div>
            <div class="footer">
              SpendWiseAI · ${new Date().getFullYear()} · <a href="mailto:${smtpUser}" style="color:#06b6d4">${smtpUser}</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[pricing-contact] Error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
