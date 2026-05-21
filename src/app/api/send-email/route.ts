import { NextRequest, NextResponse } from "next/server";

type SendEmailBody = {
  email: string;
  savings: number;
  annualSaving: number;
  publicId: string;
  savingsTier: "optimal" | "low" | "medium" | "high";
};

export async function POST(req: NextRequest) {
  try {
    const { email, savings, annualSaving, publicId, savingsTier }: SendEmailBody = await req.json();

    if (!email || !publicId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      // In dev without Resend key, silently skip sending
      console.warn("RESEND_API_KEY not set — skipping email");
      return NextResponse.json({ sent: false, reason: "no_key" });
    }

    const reportUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/results/${publicId}?public=true`;
    const isHighSavings = savingsTier === "high";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #050b1a; color: #e2e8f0; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto;">

    <div style="background: linear-gradient(135deg, #06b6d4, #6366f1); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">Your AI Spend Report</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">SpendWise AI</p>
    </div>

    ${savings > 0 ? `
    <div style="background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Monthly savings found</p>
      <p style="margin: 8px 0 0; font-size: 42px; font-weight: 900; color: #34d399;">$${savings.toLocaleString()}</p>
      <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">$${annualSaving.toLocaleString()} / year</p>
    </div>
    ` : `
    <div style="background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
      <p style="font-size: 24px; margin: 0;">✅</p>
      <p style="margin: 8px 0 0; font-weight: 700; color: #34d399;">You're spending well!</p>
      <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">No major waste found in your current stack.</p>
    </div>
    `}

    <div style="margin-bottom: 24px;">
      <a href="${reportUrl}" style="display: block; background: linear-gradient(135deg, #06b6d4, #6366f1); color: white; text-decoration: none; text-align: center; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 16px;">
        View Full Report →
      </a>
    </div>

    ${isHighSavings ? `
    <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; font-weight: 700; color: #fbbf24;">🚀 We'll reach out soon</p>
      <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
        Your savings potential ($${savings.toLocaleString()}/mo) puts you in our high-value tier.
        A Credex advisor will contact you within 24 hours about volume discounts on your specific AI tools.
      </p>
    </div>
    ` : ""}

    <p style="color: #475569; font-size: 12px; text-align: center; margin: 0;">
      SpendWiseAI — Made for founders · <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe" style="color: #475569;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SpendWiseAI <audit@spendwiseai.com>",
        to: email,
        subject: savings > 0
          ? `Your audit: $${savings.toLocaleString()}/mo in savings found`
          : "Your AI spend audit — you're in good shape",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ sent: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error("send-email error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
