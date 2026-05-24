"use client";

import { useEffect, useRef, useState } from "react";
import {
  TrendingDown, ArrowRight, RotateCcw, Share2, CheckCircle,
  AlertTriangle, Info, Zap, Target, Clock, ChevronDown, ChevronUp,
  Sparkles, TrendingUp, DollarSign, Award
} from "lucide-react";
import type { AuditResult, Recommendation } from "@/lib/auditEngine";
import { SpendTrendChart } from "./SpendTrendChart";
import { WasteScoreMeter } from "./WasteScoreMeter";
import { SavingsProjectionChart } from "./SavingsProjectionChart";
import { AICommandCenter } from "./AICommandCenter";
import { StackAdvisor } from "./StackAdvisor";

// Re-export for consumers
export type { AuditResult, Recommendation };

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

const ACTION_STYLES: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  downgrade: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    icon: <TrendingDown className="h-3.5 w-3.5" />,
    label: "Downgrade",
  },
  switch: {
    color: "#67e8f9",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    label: "Switch",
  },
  keep: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.05)",
    border: "rgba(148,163,184,0.15)",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "Optimal",
  },
  "api-switch": {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    icon: <Zap className="h-3.5 w-3.5" />,
    label: "Optimise API",
  },
  consolidate: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    label: "Consolidate",
  },
  cancel: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    icon: <TrendingDown className="h-3.5 w-3.5" />,
    label: "Cancel",
  },
};

const PRIORITY_STYLES = {
  critical: { color: "#f87171", label: "Critical", dot: "bg-red-400" },
  high: { color: "#f97316", label: "High Priority", dot: "bg-orange-400" },
  medium: { color: "#f59e0b", label: "Medium", dot: "bg-amber-400" },
  low: { color: "#34d399", label: "Low", dot: "bg-emerald-400" },
};

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const style = ACTION_STYLES[rec.suggestedAction] ?? ACTION_STYLES.keep;
  const priorityStyle = PRIORITY_STYLES[rec.priority ?? "low"];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 animate-slide-in"
      style={{
        animationDelay: `${index * 60}ms`,
        border: `1px solid var(--card-border)`,
        borderLeftWidth: "3px",
        borderLeftColor: style.color,
        background: "var(--card)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Left: tool info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>
                {rec.toolName}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
              >
                {style.icon}
                {style.label}
              </span>
              {rec.priority && rec.priority !== "low" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: `${priorityStyle.color}15`, color: priorityStyle.color, border: `1px solid ${priorityStyle.color}30` }}
                >
                  {priorityStyle.label}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm mb-2" style={{ color: "var(--foreground)", opacity: 0.6 }}>
              <span>{rec.currentPlan}</span>
              {rec.suggestedAction !== "keep" && rec.suggestedTool && (
                <>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40 shrink-0" />
                  <span style={{ color: style.color, opacity: 1 }}>
                    {rec.suggestedTool !== rec.toolName ? `${rec.suggestedTool} ` : ""}
                    {rec.suggestedPlan}
                  </span>
                </>
              )}
              {rec.seats > 1 && (
                <span className="text-xs opacity-50">· {rec.seats} seats</span>
              )}
            </div>

            {/* AI Confidence bar */}
            {rec.confidenceScore !== undefined && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-40" style={{ color: "var(--foreground)" }}>
                  AI confidence
                </span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--stat-bar-bg)", maxWidth: 80 }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${rec.confidenceScore}%`,
                      background: `linear-gradient(90deg, ${style.color}, ${style.color}99)`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold" style={{ color: style.color }}>
                  {rec.confidenceScore}%
                </span>
              </div>
            )}
          </div>

          {/* Right: cost delta */}
          <div className="text-right shrink-0">
            {rec.saving > 0 ? (
              <>
                <div className="text-xl font-black" style={{ color: "#34d399" }}>
                  Save ${rec.saving.toLocaleString()}/mo
                </div>
                <div className="text-xs opacity-40 mt-0.5" style={{ color: "var(--foreground)" }}>
                  ${rec.currentCost.toLocaleString()} → ${rec.newCost.toLocaleString()}/mo
                </div>
              </>
            ) : (
              <div className="text-sm font-medium opacity-40" style={{ color: "var(--foreground)" }}>
                No cost change
              </div>
            )}

            {/* Implementation time */}
            {rec.implementationTime && rec.implementationTime !== "N/A" && (
              <div className="flex items-center justify-end gap-1 mt-1.5 text-xs opacity-50" style={{ color: "var(--foreground)" }}>
                <Clock className="h-3 w-3" />
                {rec.implementationTime}
              </div>
            )}
          </div>
        </div>

        {/* Reason */}
        <div
          className="mt-3 pt-3 flex items-start gap-2 text-xs"
          style={{ borderTop: "1px solid var(--card-border)", color: "var(--foreground)", opacity: 0.6 }}
        >
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-60" />
          <span className="leading-relaxed">{rec.reason}</span>
        </div>

        {/* Tips toggle */}
        {rec.tips && rec.tips.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs transition-all duration-200"
            style={{ color: style.color }}
          >
            <Sparkles className="h-3 w-3" />
            {expanded ? "Hide tips" : `${rec.tips.length} implementation tips`}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>

      {/* Expanded tips */}
      {expanded && rec.tips && (
        <div
          className="px-5 pb-4 space-y-2"
          style={{ borderTop: `1px solid ${style.color}20`, background: `${style.bg}` }}
        >
          <p className="text-xs font-semibold pt-3 mb-2" style={{ color: style.color }}>
            Implementation Tips
          </p>
          {rec.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              <span style={{ color: style.color }} className="shrink-0 mt-0.5">→</span>
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultsPanel({ result, onReset, shareUrl }: ResultsPanelProps) {
  const animatedSaving = useCountUp(result.totalSaving, 1400);
  const animatedAnnual = useCountUp(result.annualSaving, 1600);
  const animatedPercent = useCountUp(result.savingPercent, 1200);
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "critical" | "savings">("all");

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const copyShareLink = () => {
    const url = shareUrl ?? window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter recommendations by tab
  const actionableRecs = result.recommendations.filter((r) => r.suggestedAction !== "keep");
  const criticalRecs = result.recommendations.filter((r) => r.priority === "critical" || r.priority === "high");
  const savingsRecs = result.recommendations.filter((r) => r.saving > 0).sort((a, b) => b.saving - a.saving);

  const displayRecs = activeTab === "critical" ? criticalRecs
    : activeTab === "savings" ? savingsRecs
    : actionableRecs;

  const tabs = [
    { key: "all", label: "All Actions", count: actionableRecs.length },
    { key: "critical", label: "Priority", count: criticalRecs.length },
    { key: "savings", label: "Top Savings", count: savingsRecs.length },
  ] as const;

  return (
    <section ref={panelRef} className="py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Top actions bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded-lg"
            style={{ color: "var(--foreground)", opacity: 0.5 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          >
            <RotateCcw className="h-4 w-4" />
            New audit
          </button>
          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 text-sm transition-colors px-4 py-1.5 rounded-full"
            style={{
              color: copied ? "#34d399" : "#67e8f9",
              border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(6,182,212,0.2)"}`,
            }}
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Copied!" : "Share results"}
          </button>
        </div>

        {/* ── Savings hero ─────────────────────────────────────────────── */}
        <div
          className="text-center mb-8 rounded-3xl px-6 py-10 animate-fade-up"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 4px 48px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: "var(--foreground)", opacity: 0.4 }}>
            Potential monthly savings identified
          </p>
          <div
            className="text-7xl sm:text-8xl lg:text-9xl font-black mb-3"
            style={{
              background: "linear-gradient(135deg, #34d399, #06b6d4, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ${animatedSaving.toLocaleString()}
          </div>
          <p className="text-base sm:text-lg" style={{ color: "var(--foreground)", opacity: 0.6 }}>
            That&apos;s{" "}
            <span className="font-bold" style={{ color: "#34d399" }}>
              ${animatedAnnual.toLocaleString()} per year
            </span>{" "}
            — a{" "}
            <span className="font-bold" style={{ color: "#67e8f9" }}>
              {animatedPercent}% reduction
            </span>
          </p>

          {/* Stat bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Current spend", value: `$${result.totalCurrentCost.toLocaleString()}/mo`, color: "#f87171", icon: <DollarSign className="h-4 w-4" /> },
              { label: "Optimised spend", value: `$${result.totalNewCost.toLocaleString()}/mo`, color: "#34d399", icon: <TrendingDown className="h-4 w-4" /> },
              { label: "Annual saving", value: `$${result.annualSaving.toLocaleString()}`, color: "#67e8f9", icon: <TrendingUp className="h-4 w-4" /> },
              { label: "Action items", value: `${actionableRecs.length} found`, color: "#a855f7", icon: <Target className="h-4 w-4" /> },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-stat rounded-xl px-4 py-3 text-center"
              >
                <div className="flex justify-center mb-1.5" style={{ color: s.color, opacity: 0.8 }}>{s.icon}</div>
                <div className="text-lg font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.45 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Charts row — all 3 cells same height via items-stretch ──────── */}
        <div className="grid md:grid-cols-3 gap-4 mb-6 items-stretch">
          {/* Trend chart — spans 2 columns, fills full height of the row */}
          <div className="md:col-span-2 flex flex-col">
            <SpendTrendChart trend={result.spendTrend} totalSaving={result.totalSaving} />
          </div>
          {/* Waste score meter — fills remaining column at same height */}
          <div className="flex flex-col">
            <WasteScoreMeter score={result.wasteScore} savingPercent={result.savingPercent} />
          </div>
        </div>

        {/* Savings projection */}
        {result.totalSaving > 0 && (
          <div className="mb-6">
            <SavingsProjectionChart
              monthlySaving={result.totalSaving}
              annualSaving={result.annualSaving}
            />
          </div>
        )}

        {/* ── AI FinOps Command Center ──────────────────────────────────────── */}
        <AICommandCenter result={result} />

        {/* ── Stack Advisor ─────────────────────────────────────────────────── */}
        <StackAdvisor result={result} />

        {/* ── AI Summary card ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5 sm:p-6 mb-8 animate-fade-up"
          style={{
            background: "rgba(6,182,212,0.06)",
            border: "1px solid rgba(6,182,212,0.22)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)" }}
            >
              <Award className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: "#67e8f9" }}>SpendWise AI Analysis</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              Powered by Groq · Llama 3.3
            </span>
          </div>
          <p className="leading-relaxed italic text-sm sm:text-base" style={{ color: "var(--foreground)", opacity: 0.75 }}>
            &ldquo;{result.summary}&rdquo;
          </p>
        </div>

        {/* ── Category breakdown ──────────────────────────────────────────── */}
        {result.categoryBreakdown.length > 0 && (
          <div
            className="rounded-2xl p-5 sm:p-6 mb-8"
            style={{
              background: "var(--card)",
              border: "1px solid var(--card-border)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--foreground)" }}>
              Spend by Category
            </h3>
            <div className="space-y-3">
              {result.categoryBreakdown.map((cat) => {
                const totalSpend = result.totalCurrentCost;
                const pct = totalSpend > 0 ? Math.round((cat.spend / totalSpend) * 100) : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--foreground)" }}>
                      <span className="font-medium">{cat.category}</span>
                      <span className="opacity-60">${cat.spend.toLocaleString()}/mo ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--stat-bar-bg)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Recommendations ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span className="h-1 w-6 rounded-full inline-block" style={{ background: "linear-gradient(90deg, #06b6d4, #a855f7)" }} />
              Optimisation Recommendations
            </h3>
            {/* Tab filter */}
            <div className="flex gap-1 rounded-full p-1" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200"
                  style={
                    activeTab === tab.key
                      ? { background: "linear-gradient(135deg, #06b6d4, #6366f1)", color: "white" }
                      : { color: "var(--foreground)", opacity: 0.5 }
                  }
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {displayRecs.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <CheckCircle className="h-10 w-10 mx-auto mb-3" style={{ color: "#34d399" }} />
              <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>All good here!</p>
              <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.5 }}>
                No recommendations in this category.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayRecs.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* ── "Keep" tools ────────────────────────────────────────────────── */}
        {result.recommendations.some((r) => r.suggestedAction === "keep") && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)", opacity: 0.5 }}>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Well-optimised tools (no changes needed)
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.recommendations
                .filter((r) => r.suggestedAction === "keep")
                .map((r, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(52,211,153,0.08)",
                      border: "1px solid rgba(52,211,153,0.2)",
                      color: "#34d399",
                    }}
                  >
                    ✓ {r.toolName}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.07), rgba(99,102,241,0.07))",
            border: "1px solid rgba(6,182,212,0.2)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Ready to implement these savings?
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            Our team can help you execute the full optimisation plan in under a week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              className="w-full sm:w-auto rounded-xl px-7 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 20px rgba(6,182,212,0.25)" }}
            >
              Book Free Strategy Call
            </button>
            <button
              onClick={onReset}
              className="w-full sm:w-auto rounded-xl px-7 py-3 text-sm font-medium transition-colors hover:opacity-80"
              style={{ border: "1px solid var(--card-border)", color: "var(--foreground)", opacity: 0.6 }}
            >
              Audit another stack
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
