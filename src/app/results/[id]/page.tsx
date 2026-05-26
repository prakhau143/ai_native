import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ResultsPanel } from "@/components/ResultsPanel";
import { HighSavingsCTA, LowSavingsCTA } from "@/components/SavingsCTA";
import type { AuditResult } from "@/lib/auditEngine";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ public?: string }>;
};

// Generate OG metadata dynamically
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const isPublic = sp.public === "true";

  const { data } = await supabase
    .from("audits")
    .select("savings, public_id")
    .eq("public_id", id)
    .single();

  if (!data) return { title: "Audit not found" };

  const saving = data.savings as number;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://spendwiseai.com";

  return {
    title: isPublic
      ? `AI Spend Audit — $${saving.toLocaleString()}/mo savings found`
      : "Your AI Spend Audit Report",
    description: `This team found $${saving.toLocaleString()}/month in AI tool savings using SpendWiseAI.`,
    openGraph: {
      title: `I found $${saving.toLocaleString()}/mo in AI savings — here's how`,
      description: "Free AI spend audit. See exactly where your team is overpaying.",
      images: [`${baseUrl}/api/og?savings=${saving}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `$${saving.toLocaleString()}/mo in AI savings found`,
      description: "Free AI spend audit by SpendWiseAI",
      images: [`${baseUrl}/api/og?savings=${saving}`],
    },
  };
}

export default async function ResultsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const isPublic = sp.public === "true";

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("public_id", id)
    .single();

  if (error || !data) notFound();

  const result = data.result as AuditResult;

  // Strip personal fields for public view
  const displayEmail = isPublic ? null : (data.email as string);
  const displayCompany = isPublic ? null : (data.company as string | null);
  const publicShareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/results/${data.public_id}?public=true`;

  return (
    <div className="min-h-screen" style={{ background: "#050b1a" }}>
      {/* Minimal header for shared view */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ backdropFilter: "blur(20px)", background: "rgba(5,11,26,0.7)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/" className="text-lg font-bold" style={{ background: "linear-gradient(90deg,#ffffff,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          SpendWiseAI
        </Link>
        {!isPublic && displayEmail && (
          <span className="text-xs text-slate-500">{displayEmail}{displayCompany ? ` · ${displayCompany}` : ""}</span>
        )}
        {isPublic && (
          <Link href="/#audit" className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
            style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
            Run my own audit →
          </Link>
        )}
      </header>

      <main className="pb-20">
        {/* Savings-tier specific CTA — shown at top for clarity */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10">
          {result.savingsTier === "high" && (
            <div className="mb-8">
              <HighSavingsCTA totalSaving={result.totalSaving} auditId={data.public_id} />
            </div>
          )}
        </div>

        {/* Main results */}
        <ResultsPanel
          result={result}
          onReset={() => { /* server component — no state */ }}
          shareUrl={publicShareUrl}
          isSharedView={isPublic}
        />

        {/* Low savings CTA */}
        {(result.savingsTier === "optimal" || result.savingsTier === "low") && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <LowSavingsCTA
              totalSaving={result.totalSaving}
              onNotifySubmit={async (email) => {
                "use server";
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notify`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
