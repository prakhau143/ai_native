"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingDown, ArrowRight, RotateCcw, Share2, CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { AuditResult, Recommendation } from "@/lib/auditEngine";

// Re-export for consumers
export type { AuditResult, Recommendation };

// Legacy local type kept for shape reference only — replaced by engine types
type _Recommendation = {
  toolName: string;
  currentPlan: string;
  currentCost: number;
  seats: number;
  suggestedAction: "downgrade" | "switch" | "keep" | "consolidate";
  suggestedTool?: string;
  suggestedPlan?: string;
  newCost: number;
  saving: number;
  reason: string;
};

type ResultsPanelProps = {
  result: AuditResult;
  onReset: () => void;
  shareUrl?: string;
  isSharedView?: boolean;
};

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

const ACTION_STYLES: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  downgrade: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    icon: <TrendingDown className="h-3.5 w-3.5" />,
  },
  switch: {
    color: "#67e8f9",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
  },
  keep: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.05)",
    border: "rgba(148,163,184,0.15)",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  "api-switch": {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  consolidate: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

export function ResultsPanel({ result, onReset, shareUrl, isSharedView = false }: ResultsPanelProps) {
  const animatedSaving = useCountUp(result.totalSaving, 1400);
  const animatedAnnual = useCountUp(result.annualSaving, 1600);
  const animatedPercent = useCountUp(result.savingPercent, 1200);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const copyShareLink = () => {
    const url = shareUrl ?? window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <section ref={panelRef} className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Top actions */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" />
            New audit
          </button>
          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-cyan-400/10"
            style={{ border: "1px solid rgba(6,182,212,0.2)" }}
          >
            <Share2 className="h-4 w-4" />
            Share results
          </button>
        </div>

        {/* Savings hero */}
        <div className="text-center mb-12 animate-fade-up">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Potential monthly savings</p>
          <div className="text-7xl sm:text-8xl font-black mb-2 animate-count-up"
            style={{ background: "linear-gradient(135deg, #34d399, #06b6d4, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", textShadow: "none" }}>
            ${animatedSaving.toLocaleString()}
          </div>
          <p className="text-slate-400 text-lg">
            That&apos;s{" "}
            <span className="font-bold" style={{ color: "#34d399" }}>
              ${animatedAnnual.toLocaleString()} per year
            </span>{" "}
            — a{" "}
            <span className="font-bold text-cyan-300">{animatedPercent}% reduction</span>
          </p>

          {/* Mini stat bar */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: "Current spend", value: `$${result.totalCurrentCost.toLocaleString()}/mo`, color: "#f87171" },
              { label: "Optimised spend", value: `$${result.totalNewCost.toLocaleString()}/mo`, color: "#34d399" },
              { label: "Annual saving", value: `$${result.annualSaving.toLocaleString()}`, color: "#67e8f9" },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl px-4 py-3 text-center">
                <div className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-tool recommendations */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-1 w-6 rounded-full inline-block" style={{ background: "linear-gradient(90deg, #06b6d4, #a855f7)" }} />
            Tool-by-tool breakdown
          </h3>
          <div className="space-y-3">
            {result.recommendations.map((rec, i) => {
              const style = ACTION_STYLES[rec.suggestedAction];
              return (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-4 sm:p-5 animate-slide-in"
                  style={{ animationDelay: `${i * 80}ms`, borderLeftWidth: "3px", borderLeftColor: style.color }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Left: tool info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-semibold text-white">{rec.toolName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
                          {style.icon}
                          {rec.suggestedAction.charAt(0).toUpperCase() + rec.suggestedAction.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                        <span>{rec.currentPlan}</span>
                        {rec.suggestedAction !== "keep" && rec.suggestedTool && (
                          <>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                            <span style={{ color: style.color }}>
                              {rec.suggestedTool !== rec.toolName ? `${rec.suggestedTool} ` : ""}{rec.suggestedPlan}
                            </span>
                          </>
                        )}
                        {rec.seats > 1 && (
                          <span className="text-xs text-slate-600">· {rec.seats} seats</span>
                        )}
                      </div>
                    </div>

                    {/* Right: cost delta */}
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-500 mb-0.5">
                        ${rec.currentCost.toLocaleString()} → ${rec.newCost.toLocaleString()}/mo
                      </div>
                      {rec.saving > 0 ? (
                        <div className="text-lg font-bold" style={{ color: "#34d399" }}>
                          Save ${rec.saving.toLocaleString()}/mo
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 font-medium">No change</div>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-3 pt-3 flex items-start gap-2 text-xs text-slate-400"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-600" />
                    {rec.reason}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI summary card */}
        <div className="rounded-2xl p-5 sm:p-6 mb-10 animate-fade-up"
          style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)" }}>
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="text-sm font-semibold text-cyan-300">SpendWise Analysis</span>
          </div>
          <p className="text-slate-300 leading-relaxed italic">&ldquo;{result.summary}&rdquo;</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">Want a deeper dive? Book a 15-minute call with our team.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="rounded-xl px-7 py-3 text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 20px rgba(6,182,212,0.25)" }}>
              Book Free Strategy Call
            </button>
            <button onClick={onReset} className="rounded-xl px-7 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              Audit another stack
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

