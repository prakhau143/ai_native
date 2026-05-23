"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Radar, Bar, Line, Doughnut } from "react-chartjs-2";
import { Header } from "@/components/Header";
import { Brain, TrendingDown, Zap, DollarSign, Users, BarChart3, Activity, Target, RefreshCw, Sparkles } from "lucide-react";
import type { InsightsData } from "@/app/api/ai-insights/route";

ChartJS.register(
  CategoryScale, LinearScale, RadialLinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    />
  );
}

// ── Waste bar ────────────────────────────────────────────────────────────────
function WasteBar({ score }: { score: number }) {
  const color = score <= 35 ? "#34d399" : score <= 60 ? "#f59e0b" : "#f87171";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

// ── Chart defaults ────────────────────────────────────────────────────────────
const tooltipDefaults = {
  backgroundColor: "rgba(5,11,26,0.92)",
  borderColor: "rgba(6,182,212,0.25)",
  borderWidth: 1,
  titleColor: "#e2e8f0",
  bodyColor: "#94a3b8",
  padding: 12,
};

const axisDefaults = {
  x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } }, border: { color: "rgba(255,255,255,0.06)" } },
  y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } }, border: { color: "rgba(255,255,255,0.06)" } },
};

const legendDefaults = {
  labels: {
    color: "var(--foreground)",
    font: { size: 11, family: "var(--font-geist-sans)" },
    padding: 16,
    usePointStyle: true,
    pointStyleWidth: 8,
  },
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AIInsightsPage() {
  const [period, setPeriod] = useState<"30d" | "90d" | "12m">("90d");
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchInsights = useCallback(async (p: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai-insights?period=${p}`);
      if (!res.ok) throw new Error("Failed to fetch insights");
      const json: InsightsData = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (e) {
      setError("Unable to load insights. Showing cached data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights(period);
  }, [period, fetchInsights]);

  // ── Chart data builders ───────────────────────────────────────────────────
  const radarChartData = data ? {
    labels: ["Coding", "Writing", "Research", "Image Gen", "Video", "Audio", "APIs", "General"],
    datasets: [
      {
        label: "Current Spend",
        data: data.radarCurrent,
        backgroundColor: "rgba(6,182,212,0.15)",
        borderColor: "#06b6d4",
        borderWidth: 2,
        pointBackgroundColor: "#06b6d4",
        pointRadius: 4,
      },
      {
        label: "Optimised Spend",
        data: data.radarOptimized,
        backgroundColor: "rgba(168,85,247,0.12)",
        borderColor: "#a855f7",
        borderWidth: 2,
        pointBackgroundColor: "#a855f7",
        pointRadius: 4,
      },
    ],
  } : null;

  const trendChartData = data ? {
    labels: data.monthlyTrend.map((t) => t.month),
    datasets: [
      {
        label: "Avg AI Spend",
        data: data.monthlyTrend.map((t) => t.spend),
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.08)",
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Industry Benchmark",
        data: data.monthlyTrend.map((t) => t.benchmark),
        borderColor: "#64748b",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  } : null;

  const popularityChartData = data ? {
    labels: data.toolPopularity.map((t) => t.tool),
    datasets: [{
      label: "Teams Using Tool (%)",
      data: data.toolPopularity.map((t) => t.percentage),
      backgroundColor: [
        "rgba(6,182,212,0.75)", "rgba(168,85,247,0.75)", "rgba(99,102,241,0.75)", "rgba(245,158,11,0.75)",
        "rgba(236,72,153,0.75)", "rgba(16,185,129,0.75)", "rgba(249,115,22,0.75)", "rgba(52,211,153,0.75)",
      ],
      borderColor: ["#06b6d4","#a855f7","#6366f1","#f59e0b","#ec4899","#10b981","#f97316","#34d399"],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  } : null;

  const categoryChartData = data ? {
    labels: data.categoryBreakdown.map((c) => c.category),
    datasets: [{
      data: data.categoryBreakdown.map((c) => c.percentage),
      backgroundColor: [
        "rgba(6,182,212,0.8)","rgba(99,102,241,0.8)","rgba(245,158,11,0.8)","rgba(168,85,247,0.8)",
        "rgba(236,72,153,0.8)","rgba(16,185,129,0.8)","rgba(249,115,22,0.8)",
      ],
      borderColor: "transparent",
      hoverOffset: 8,
    }],
  } : null;

  const savingsChartData = data ? {
    labels: data.savingsTypes.map((s) => s.type),
    datasets: [
      {
        label: "Realised Savings",
        data: data.savingsTypes.map((s) => s.realized),
        backgroundColor: "rgba(52,211,153,0.7)",
        borderColor: "#34d399",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Untapped Potential",
        data: data.savingsTypes.map((s) => s.potential),
        backgroundColor: "rgba(99,102,241,0.5)",
        borderColor: "#6366f1",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  } : null;

  const kpis = data ? [
    { label: "Avg Team AI Spend", value: `$${data.kpis.avgTeamSpend.toLocaleString()}/mo`, change: data.kpis.spendChange, up: data.kpis.spendChange.startsWith("+"), icon: DollarSign, color: "#f87171" },
    { label: "Avg Savings Found", value: `$${data.kpis.avgSavingsFound.toLocaleString()}/mo`, change: data.kpis.savingsChange, up: true, icon: TrendingDown, color: "#34d399" },
    { label: "Tools Per Team", value: `${data.kpis.toolsPerTeam} avg`, change: "tracked", up: false, icon: Zap, color: "#06b6d4" },
    { label: "Teams Audited", value: `${data.kpis.teamsAudited.toLocaleString()}+`, change: "data points", up: true, icon: Users, color: "#a855f7" },
  ] : [];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-10 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}
              >
                <Brain className="w-4 h-4" />
                Groq AI–Powered Market Intelligence
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-2"
                style={{
                  background: "linear-gradient(135deg, var(--foreground) 0%, #67e8f9 40%, #c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI Insights Dashboard
              </h1>
              <p className="text-sm sm:text-base max-w-2xl" style={{ color: "var(--foreground)", opacity: 0.55 }}>
                Live benchmarks generated by Groq Llama 3.3 from aggregated startup audit data. Numbers update every 5 minutes.
              </p>
            </div>

            {/* Refresh + last updated */}
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => fetchInsights(period)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Generating..." : "Refresh"}
              </button>
              {lastUpdated && (
                <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.35 }}>
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Period toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex p-1 rounded-full" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              {(["30d", "90d", "12m"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  disabled={loading}
                  className="px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                  style={
                    period === p
                      ? { background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "white" }
                      : { color: "var(--foreground)", opacity: 0.45 }
                  }
                >
                  {p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "12 Months"}
                </button>
              ))}
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#a855f7" }}>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Groq AI is generating insights…
              </div>
            )}
          </div>

          {/* Period insight from Groq */}
          {data && !loading && (
            <div
              className="mt-5 p-4 rounded-2xl text-sm leading-relaxed animate-fade-up"
              style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)", color: "var(--foreground)", opacity: 0.8 }}
            >
              <span className="font-semibold" style={{ color: "#c084fc" }}>Groq Insight: </span>
              {data.periodInsight}
            </div>
          )}
          {loading && <Skeleton className="mt-5 h-14 w-full" />}
          {error && (
            <div className="mt-5 p-4 rounded-2xl text-sm" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </section>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)
            : kpis.map(({ label, value, change, up, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200"
                  style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: up ? "rgba(52,211,153,0.1)" : "rgba(100,116,139,0.1)", color: up ? "#34d399" : "#64748b" }}>
                      {change}
                    </span>
                  </div>
                  <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
                  <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.5 }}>{label}</div>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── Charts Row 1: Radar + Line ────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          {/* Radar */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4" style={{ color: "#06b6d4" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Spend by Category</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--foreground)", opacity: 0.45 }}>Current vs optimised ($/mo)</p>
            {loading || !radarChartData
              ? <Skeleton className="h-64" />
              : <div className="h-64">
                  <Radar data={radarChartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: legendDefaults, tooltip: { ...tooltipDefaults } },
                    scales: { r: { angleLines: { color: "rgba(255,255,255,0.06)" }, grid: { color: "rgba(255,255,255,0.06)" }, pointLabels: { color: "#64748b", font: { size: 10 } }, ticks: { display: false } } },
                  }} />
                </div>
            }
          </div>

          {/* Line trend */}
          <div className="lg:col-span-2 rounded-2xl p-5 sm:p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4" style={{ color: "#f87171" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>AI Spend Trend vs Benchmark</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--foreground)", opacity: 0.45 }}>Groq-generated averages from audited startups</p>
            {loading || !trendChartData
              ? <Skeleton className="h-64" />
              : <div className="h-64">
                  <Line data={trendChartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    plugins: { legend: legendDefaults, tooltip: { ...tooltipDefaults, mode: "index" as const, intersect: false, callbacks: { label: (ctx: any) => ` ${ctx.dataset?.label}: $${((ctx.parsed?.y) ?? 0).toLocaleString()}/mo` } } },
                    scales: { ...axisDefaults, y: { ...axisDefaults.y, ticks: { ...axisDefaults.y.ticks, callback: (v: number | string) => `$${Number(v).toLocaleString()}` } } },
                    interaction: { mode: "index" as const, intersect: false },
                  }} />
                </div>
            }
          </div>
        </div>
      </section>

      {/* ── Charts Row 2: Doughnut + Grouped Bar ──────────────────────────── */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          {/* Doughnut */}
          <div className="rounded-2xl p-5 sm:p-6 flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4" style={{ color: "#a855f7" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Budget Allocation</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--foreground)", opacity: 0.45 }}>Where AI dollars go</p>
            {loading || !categoryChartData
              ? <Skeleton className="h-56" />
              : <div className="h-56">
                  <Doughnut data={categoryChartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                      legend: { ...legendDefaults, position: "right" as const },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      tooltip: { ...tooltipDefaults, callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}%` } },
                    },
                    cutout: "65%",
                  }} />
                </div>
            }
          </div>

          {/* Savings grouped bar */}
          <div className="lg:col-span-2 rounded-2xl p-5 sm:p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4" style={{ color: "#34d399" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Savings by Optimisation Type</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--foreground)", opacity: 0.45 }}>Realised vs remaining opportunity ($/mo avg)</p>
            {loading || !savingsChartData
              ? <Skeleton className="h-56" />
              : <div className="h-56">
                  <Bar data={savingsChartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    plugins: { legend: legendDefaults, tooltip: { ...tooltipDefaults, mode: "index" as const, intersect: false, callbacks: { label: (ctx: any) => ` ${ctx.dataset?.label}: $${((ctx.parsed?.y) ?? 0).toLocaleString()}` } } },
                    scales: { ...axisDefaults, y: { ...axisDefaults.y, ticks: { ...axisDefaults.y.ticks, callback: (v: number | string) => `$${v}` } } },
                    interaction: { mode: "index" as const, intersect: false },
                  }} />
                </div>
            }
          </div>
        </div>
      </section>

      {/* ── Tool Popularity ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4" style={{ color: "#06b6d4" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Most Used AI Tools</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--foreground)", opacity: 0.45 }}>% of audited startups using each tool (paid plans) — from Groq analysis</p>
            {loading || !popularityChartData
              ? <Skeleton className="h-56" />
              : <div className="h-56">
                  <Bar data={popularityChartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults, callbacks: { label: (ctx: any) => ` ${(ctx.parsed?.y ?? 0)}% of teams` } } },
                    scales: { ...axisDefaults, y: { ...axisDefaults.y, ticks: { ...axisDefaults.y.ticks, callback: (v: number | string) => `${v}%` }, max: 100 } },
                  }} />
                </div>
            }
          </div>
        </div>
      </section>

      {/* ── Benchmark Table ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--card-border)" }}>
            <div className="p-5 sm:p-6" style={{ borderBottom: "1px solid var(--card-border)", background: "var(--card)" }}>
              <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Tool-by-Tool Benchmark</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--foreground)", opacity: 0.45 }}>
                Groq AI–generated benchmarks based on aggregated audit data
              </p>
            </div>
            {loading || !data
              ? <div className="p-6 space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--card-border)", background: "var(--card)" }}>
                        {["Tool", "Popular Plan & Price", "Teams Using", "Waste Score", "Top Saving Tip"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)", opacity: 0.45 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.benchmarkTable.map((row, i) => (
                        <tr key={row.tool} className="transition-colors" style={{ borderBottom: i < data.benchmarkTable.length - 1 ? "1px solid var(--card-border)" : "none", background: i % 2 === 0 ? "transparent" : "var(--card)" }}>
                          <td className="px-5 py-4 text-sm font-semibold" style={{ color: "var(--foreground)" }}>{row.tool}</td>
                          <td className="px-5 py-4 text-sm font-mono" style={{ color: "#f87171" }}>{row.plan}</td>
                          <td className="px-5 py-4 text-sm" style={{ color: "#06b6d4" }}>{row.teamsUsing}</td>
                          <td className="px-5 py-4"><WasteBar score={row.wasteScore} /></td>
                          <td className="px-5 py-4 text-sm" style={{ color: "var(--foreground)", opacity: 0.6 }}>{row.tip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center"
            style={{
              background: "rgba(8, 20, 52, 0.52)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 80px rgba(6,182,212,0.12), 0 0 140px rgba(168,85,247,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Gradient orbs behind the glass */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div
                className="absolute -top-16 left-1/4 h-72 w-72 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 65%)", filter: "blur(52px)" }}
              />
              <div
                className="absolute -bottom-16 right-1/4 h-72 w-72 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 65%)", filter: "blur(52px)" }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-80 rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)", filter: "blur(40px)" }}
              />
            </div>

            <h2
              className="text-2xl sm:text-3xl font-black mb-3"
              style={{
                background: "linear-gradient(135deg, #ffffff 10%, #a5f3fc 50%, #e9d5ff 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              See how YOUR stack compares
            </h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
              Get a free personalised audit powered by Groq AI — results in under 2 minutes.
            </p>
            <a href="/#audit">
              <button
                className="px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  color: "#4f46e5",
                  boxShadow: "0 4px 24px rgba(255,255,255,0.2)",
                }}
              >
                Run Free Audit →
              </button>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm opacity-40" style={{ borderTop: "1px solid var(--card-border)" }}>
        © 2026 SpendWiseAI · Benchmarks generated by Groq Llama 3.3 · Refreshed every 5 minutes
      </footer>
    </div>
  );
}
