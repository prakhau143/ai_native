"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  Activity, Cpu, Shield, TrendingUp, AlertTriangle,
  CheckCircle2, Minus, ChevronRight,
} from "lucide-react";
import type { AuditResult, BenchmarkRow } from "@/lib/auditEngine";

type Props = { result: AuditResult };

// ── Shared tooltip style ─────────────────────────────────────────────────────
const ttStyle = {
  backgroundColor: "var(--card-solid)",
  border: "1px solid var(--card-border)",
  borderRadius: 10,
  color: "var(--foreground)",
  fontSize: 12,
};

// ── Glass card wrapper ───────────────────────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--card-border)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: `0 8px 32px ${color}18` }}
      className="rounded-2xl px-5 py-5 flex flex-col gap-3 transition-all duration-200"
      style={glassCard}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--foreground)", opacity: 0.4 }}>
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.45 }}>{sub}</div>
    </motion.div>
  );
}

// ── Score ring (tiny SVG gauge) ───────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width={50} height={50} viewBox="0 0 50 50">
      <circle cx={25} cy={25} r={r} fill="none" stroke="var(--stat-bar-border)" strokeWidth={5} />
      <circle
        cx={25} cy={25} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 25 25)"
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={11} fontWeight="bold" fill={color}>
        {score}
      </text>
    </svg>
  );
}

// ── Benchmark row ─────────────────────────────────────────────────────────────
function BenchRow({ row }: { row: BenchmarkRow }) {
  const icons = {
    good: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    ok:   <Minus className="h-3.5 w-3.5 text-amber-400" />,
    bad:  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />,
  };
  const colors = { good: "#34d399", ok: "#f59e0b", bad: "#f87171" };
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--card-border)" }}>
      <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>{row.metric}</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-bold" style={{ color: colors[row.status] }}>{row.yourValue}</span>
        <span style={{ color: "var(--foreground)", opacity: 0.35 }}>vs {row.avgValue} avg</span>
        {icons[row.status]}
      </div>
    </div>
  );
}

// ── Timeline card ─────────────────────────────────────────────────────────────
function TimelineCard({
  title, urgency, color, items,
}: {
  title: string; urgency: string; color: string;
  items: Array<{ toolName: string; saving: number; implementationTime: string }>;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ ...glassCard, borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{title}</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: `${color}18`, color }}
        >
          {urgency}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>No actions in this tier</p>
      ) : (
        items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 shrink-0" style={{ color }} />
              <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.75 }}>{item.toolName}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {item.saving > 0 && (
                <span className="text-xs font-bold" style={{ color: "#34d399" }}>-${item.saving}/mo</span>
              )}
              <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.35 }}>{item.implementationTime}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AICommandCenter({ result }: Props) {
  const {
    totalCurrentCost, annualSaving, efficiencyScore, stackMaturityScore,
    wasteScore, vendorConcentration, predictiveTrend, benchmarkData, recommendations,
  } = result;

  // Vendor risk flag
  const topVendor = vendorConcentration[0];
  const hasVendorRisk = topVendor && topVendor.percentage >= 60;

  // Urgent / medium / strategic recs (with savings)
  const urgentRecs = recommendations.filter((r) => r.priority === "critical" && r.saving > 0).slice(0, 3);
  const medRecs = recommendations.filter((r) => r.priority === "high" && r.saving > 0).slice(0, 3);
  const strategicRecs = recommendations.filter((r) => ["medium", "low"].includes(r.priority) && r.saving > 0).slice(0, 3);

  // Chart data: split predictive into actual vs forecast series
  const predictActual = predictiveTrend.filter((p) => p.actual !== undefined);
  // For recharts we merge them into one array so the x-axis is continuous
  const trendData = predictiveTrend.map((p) => ({
    month: p.month,
    actual: p.actual,
    forecast: p.forecast,
  }));
  // The divider month label (where actual ends / forecast begins)
  const dividerMonth = predictActual[predictActual.length - 1]?.month;

  return (
    <div className="space-y-6 mb-8">
      {/* ── Section title ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Activity className="h-5 w-5" style={{ color: "#06b6d4" }} />
        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>AI FinOps Intelligence</h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.2)" }}
        >
          Command Center
        </span>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Annual burn"
          value={`$${(totalCurrentCost * 12).toLocaleString()}`}
          sub={`Save $${annualSaving.toLocaleString()}/yr if optimised`}
          color="#f87171"
        />
        <KpiCard
          icon={<Activity className="h-4 w-4" />}
          label="Efficiency score"
          value={`${efficiencyScore}/100`}
          sub={efficiencyScore >= 75 ? "Well optimised stack" : efficiencyScore >= 50 ? "Room for improvement" : "Significant waste detected"}
          color={efficiencyScore >= 75 ? "#34d399" : efficiencyScore >= 50 ? "#f59e0b" : "#f87171"}
        />
        <KpiCard
          icon={<Cpu className="h-4 w-4" />}
          label="Stack maturity"
          value={`${stackMaturityScore}/100`}
          sub={stackMaturityScore >= 70 ? "Curated stack" : "Overlaps & mismatches found"}
          color={stackMaturityScore >= 70 ? "#a855f7" : "#f59e0b"}
        />
        <KpiCard
          icon={<Shield className="h-4 w-4" />}
          label="Vendor diversity"
          value={`${vendorConcentration.length} vendor${vendorConcentration.length !== 1 ? "s" : ""}`}
          sub={hasVendorRisk ? `⚠ ${topVendor.percentage}% on ${topVendor.vendor}` : "Healthy distribution"}
          color={hasVendorRisk ? "#f59e0b" : "#34d399"}
        />
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Predictive spend trend */}
        <div className="rounded-2xl p-5" style={glassCard}>
          <div className="mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>12-Month Spend Forecast</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--foreground)", opacity: 0.45 }}>
              6-month history → 6-month projection if optimisations applied
            </p>
          </div>
          <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-cyan-400 rounded" />Actual</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-orange-400 rounded" style={{ borderTop: "2px dashed #fb923c", background: "none" }} />Forecast</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} width={52} />
              <Tooltip
                contentStyle={ttStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any, name: any) => [`$${Number(v).toLocaleString()}`, name]}
              />
              {dividerMonth && (
                <ReferenceLine x={dividerMonth} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
              )}
              <Line
                type="monotone" dataKey="actual" name="Actual" stroke="#06b6d4"
                strokeWidth={2} dot={{ r: 3, fill: "#06b6d4" }} connectNulls={false}
              />
              <Line
                type="monotone" dataKey="forecast" name="Forecast" stroke="#fb923c"
                strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: "#fb923c" }} connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor concentration donut */}
        <div className="rounded-2xl p-5" style={glassCard}>
          <div className="mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Vendor Concentration</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--foreground)", opacity: 0.45 }}>
              Share of total AI spend per vendor
            </p>
          </div>

          {vendorConcentration.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm" style={{ color: "var(--foreground)", opacity: 0.35 }}>
              Add tools to see vendor breakdown
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie
                    data={vendorConcentration}
                    dataKey="spend"
                    nameKey="vendor"
                    cx="50%" cy="50%"
                    innerRadius={42} outerRadius={72}
                    paddingAngle={3}
                    startAngle={90} endAngle={-270}
                  >
                    {vendorConcentration.map((v, i) => (
                      <Cell key={i} fill={v.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={ttStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any, name: any) => [`$${Number(v).toLocaleString()}/mo`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex-1 space-y-2 pt-2">
                {vendorConcentration.slice(0, 6).map((v) => (
                  <div key={v.vendor} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: v.color }} />
                      <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.75 }}>{v.vendor}</span>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: v.color }}>{v.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Vendor risk alert ─────────────────────────────────────────────── */}
      {hasVendorRisk && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#f59e0b" }}>Vendor Lock-in Risk</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.65 }}>
              <strong>{topVendor.percentage}%</strong> of your AI spend is concentrated on <strong>{topVendor.vendor}</strong>.
              A pricing change or outage would critically impact your team. Consider diversifying with an alternative for non-critical workloads.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Optimization Timeline ────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--foreground)" }}>
          Optimisation Timeline
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <TimelineCard
            title="Do Now"
            urgency="Critical"
            color="#f87171"
            items={urgentRecs.map((r) => ({
              toolName: r.toolName,
              saving: r.saving,
              implementationTime: r.implementationTime,
            }))}
          />
          <TimelineCard
            title="This Week"
            urgency="High"
            color="#f59e0b"
            items={medRecs.map((r) => ({
              toolName: r.toolName,
              saving: r.saving,
              implementationTime: r.implementationTime,
            }))}
          />
          <TimelineCard
            title="This Month"
            urgency="Strategic"
            color="#34d399"
            items={strategicRecs.map((r) => ({
              toolName: r.toolName,
              saving: r.saving,
              implementationTime: r.implementationTime,
            }))}
          />
        </div>
      </div>

      {/* ── Benchmarking table ───────────────────────────────────────────── */}
      <div className="rounded-2xl p-5" style={glassCard}>
        <div className="flex items-center gap-2 mb-4">
          <ScoreRing
            score={wasteScore}
            color={wasteScore <= 30 ? "#34d399" : wasteScore <= 55 ? "#f59e0b" : "#f87171"}
          />
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Benchmark vs Industry</h3>
            <p className="text-xs" style={{ color: "var(--foreground)", opacity: 0.45 }}>
              Based on 2,800+ audited startup teams
            </p>
          </div>
        </div>
        {benchmarkData.map((row, i) => <BenchRow key={i} row={row} />)}
      </div>
    </div>
  );
}
