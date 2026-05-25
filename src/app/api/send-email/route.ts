import { NextRequest, NextResponse } from "next/server";
import { sendAuditEmail } from "@/lib/email";

type SendEmailBody = {
  email: string;
  savings: number;
  annualSaving: number;
  publicId: string;
  savingsTier: "optimal" | "low" | "medium" | "high";
  aiSummary?: string;
  // Premium template fields
  toolsCount?: number;
  efficiencyScore?: number;
  wasteScore?: number;
  downgradeSavings?: number;
  apiSavings?: number;
  seatSavings?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: SendEmailBody = await req.json();
    const {
      email, savings, annualSaving, publicId, savingsTier, aiSummary,
      toolsCount, efficiencyScore, wasteScore, downgradeSavings, apiSavings, seatSavings,
    } = body;

    if (!email || !publicId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await sendAuditEmail({
      email,
      savings,
      annualSaving,
      publicId,
      savingsTier,
      aiSummary,
      toolsCount,
      efficiencyScore,
      wasteScore,
      downgradeSavings,
      apiSavings,
      seatSavings,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("send-email error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
