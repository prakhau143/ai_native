import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Vercel Cron — runs daily at midnight UTC
// Config in vercel.json: { "crons": [{ "path": "/api/cron/cleanup", "schedule": "0 0 * * *" }] }

export async function GET(req: NextRequest) {
  // Security: only allow Vercel cron or internal calls
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Fallback: use anon key with limited permissions
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }
  }

  const supabase = createClient(
    supabaseUrl!,
    supabaseServiceKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Delete free-tier audits older than 7 days
    // Requires: user_tier column = 'free' (or null) and created_at < 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("audits")
      .delete()
      .or("user_tier.is.null,user_tier.eq.free")
      .lt("created_at", sevenDaysAgo.toISOString())
      .select("id");

    if (error) {
      console.error("[cleanup] Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const deleted = data?.length ?? 0;
    console.log(`[cleanup] Deleted ${deleted} expired free-tier audits`);

    return NextResponse.json({
      success: true,
      deleted,
      cutoff: sevenDaysAgo.toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cleanup] Unexpected error:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
