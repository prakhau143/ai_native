import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, tools, result, honeypot } = body;

    // Abuse protection: honeypot field must be empty
    if (honeypot) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    if (!email || !tools || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("audits")
      .insert({
        email: email.toLowerCase().trim(),
        company: company?.trim() ?? null,
        tools,
        result,
        savings: result.totalSaving ?? 0,
      })
      .select("id, public_id")
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, publicId: data.public_id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
