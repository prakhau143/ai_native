import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Upsert into a notify_list table
    // SQL: create table notify_list (id uuid default gen_random_uuid(), email text unique, created_at timestamptz default now());
    const { error } = await supabase
      .from("notify_list")
      .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

    if (error) console.error("notify insert:", error.message);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
