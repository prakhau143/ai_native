import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateAISummary } from "@/lib/generateSummary";
import type { AuditResult } from "@/lib/auditEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, tools, result, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    if (!email || !tools || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Enhance summary with Groq AI (falls back to template if key absent)
    const aiSummary = await generateAISummary(result as AuditResult);
    const enrichedResult: AuditResult = { ...result, summary: aiSummary };

    const { data, error } = await supabase
      .from("audits")
      .insert({
        email: email.toLowerCase().trim(),
        company: company?.trim() ?? null,
        tools,
        result: enrichedResult,
        savings: enrichedResult.totalSaving ?? 0,
      })
      .select("id, public_id")
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, publicId: data.public_id, aiSummary });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
