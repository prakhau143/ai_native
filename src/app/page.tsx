"use client";

import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AuditForm } from "@/components/AuditForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { LeadCapture } from "@/components/LeadCapture";
import { HighSavingsCTA, LowSavingsCTA } from "@/components/SavingsCTA";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LandingSections } from "@/components/LandingSections";
import { runAudit, type ToolEntry, type AuditResult } from "@/lib/auditEngine";

type AppState = "landing" | "loading" | "lead-capture" | "results";

export default function HomePage() {
  const [state, setState] = useState<AppState>("landing");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [pendingTools, setPendingTools] = useState<ToolEntry[]>([]);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Step 1: Run rule engine, show lead capture gate
  const handleAudit = async (tools: ToolEntry[]) => {
    setState("loading");
    await new Promise((res) => setTimeout(res, 1000));
    const auditResult = runAudit(tools);
    setPendingTools(tools);
    setResult(auditResult);
    setState("lead-capture");
  };

  // Step 2: Save to DB + send email, then show results
  const handleLeadSubmit = async (email: string, company: string, role: string, teamSize: string) => {
    if (!result) return;
    setIsSubmittingLead(true);

    try {
      // Save audit to Supabase
      const saveRes = await fetch("/api/save-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize,
          tools: pendingTools,
          result,
          honeypot: "", // always empty on legitimate submit
        }),
      });

      const saveData = saveRes.ok
        ? await saveRes.json()
        : { publicId: null, aiSummary: null };

      const { publicId, aiSummary } = saveData;
      if (publicId) setAuditId(publicId);

      // Replace template summary with Groq AI summary
      if (aiSummary && result) {
        setResult((prev) => prev ? { ...prev, summary: aiSummary } : prev);
      }

      // Fire-and-forget confirmation email (includes AI summary if available)
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          savings: result.totalSaving,
          annualSaving: result.annualSaving,
          publicId: publicId ?? "unknown",
          savingsTier: result.savingsTier,
          aiSummary: aiSummary ?? undefined,
        }),
      }).catch(() => {}); // non-blocking

    } catch {
      // Network error — still show results
    }

    setState("results");
    setIsSubmittingLead(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setResult(null);
    setAuditId(null);
    setPendingTools([]);
    setState("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNotifyMe = async (email: string) => {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero — only on landing */}
        {state === "landing" && <Hero onAuditClick={scrollToForm} />}

        {/* Form — landing + loading states */}
        {(state === "landing" || state === "loading") && (
          <section ref={formRef}>
            <AuditForm onSubmit={handleAudit} isLoading={state === "loading"} />
          </section>
        )}

        {/* Loading overlay */}
        {state === "loading" && (
          <div className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: "rgba(5,11,26,0.75)", backdropFilter: "blur(8px)" }}>
            <div className="text-center animate-fade-up">
              <div className="relative mx-auto mb-6 h-16 w-16">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(6,182,212,0.25)" }} />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}>
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
              <p className="text-white font-semibold text-lg mb-1">Analysing your stack…</p>
              <p className="text-slate-400 text-sm">Finding savings opportunities</p>
            </div>
          </div>
        )}

        {/* Lead capture gate (shown after engine runs) */}
        {state === "lead-capture" && result && (
          <LeadCapture
            estimatedSaving={result.totalSaving}
            onSubmit={handleLeadSubmit}
            isSubmitting={isSubmittingLead}
          />
        )}

        {/* Results */}
        {state === "results" && result && (
          <div className="w-full">
            {/* High-savings Credex CTA — shown prominently at top */}
            {result.savingsTier === "high" && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
                <HighSavingsCTA totalSaving={result.totalSaving} auditId={auditId ?? undefined} />
              </div>
            )}

            <ResultsPanel
              result={result}
              onReset={handleReset}
              shareUrl={auditId ? `${window.location.origin}/results/${auditId}?public=true` : undefined}
            />

            {/* Low/optimal savings CTA */}
            {(result.savingsTier === "optimal" || result.savingsTier === "low") && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
                <LowSavingsCTA totalSaving={result.totalSaving} onNotifySubmit={handleNotifyMe} />
              </div>
            )}
          </div>
        )}

        {/* "How it works" + all landing sections — only on landing */}
        {state === "landing" && (
          <>
            <HowItWorks />
            <LandingSections onAuditClick={scrollToForm} />
          </>
        )}
      </main>

      <footer className="py-10 text-center" style={{ borderTop: "1px solid var(--card-border)" }}>
        <p className="text-sm text-muted">
          © 2026 SpendWiseAI — Made for founders who ship fast.
        </p>
      </footer>

      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Add your tools", body: "List every AI subscription your team pays for — takes 2 minutes. We support 30+ tools.", color: "#06b6d4" },
    { n: "02", title: "Get instant analysis", body: "Our AI engine compares your stack against 30+ tools, plans, and usage patterns to find waste.", color: "#6366f1" },
    { n: "03", title: "Save immediately", body: "Follow prioritised action items. Switch plans, cut seats, eliminate overlap — save in days, not months.", color: "#a855f7" },
  ];

  return (
    <section id="how" className="py-20 px-4 sm:px-6" style={{ borderTop: "1px solid var(--card-border)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-3"
            style={{ color: "var(--foreground)" }}
          >
            How it works
          </h2>
          <p className="text-sm text-muted">Three steps. No fluff.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="glass-panel rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-200"
            >
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}35`, color: s.color }}
              >
                {s.n}
              </div>
              <h3 className="font-bold mb-2" style={{ color: "var(--foreground)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed text-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
