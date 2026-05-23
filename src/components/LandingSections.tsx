"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, Cpu, Zap, Eye, BarChart3, Shield, Sparkles,
  Check, ArrowRight, Lock, Activity, Star, ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Animated CountUp (trigger once when in view)
// ─────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2200;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Recharts data
// ─────────────────────────────────────────────────────────────
const spendTrendData = [
  { month: "Jan", current: 2800, optimized: 1680 },
  { month: "Feb", current: 2950, optimized: 1620 },
  { month: "Mar", current: 3100, optimized: 1560 },
  { month: "Apr", current: 3050, optimized: 1500 },
  { month: "May", current: 3350, optimized: 1440 },
  { month: "Jun", current: 3500, optimized: 1380 },
];

const tokenUsageData = [
  { model: "GPT-4o", tokens: 420 },
  { model: "Claude", tokens: 310 },
  { model: "Gemini", tokens: 190 },
  { model: "Groq",   tokens: 98  },
];

const savingsByType = [
  { type: "Downgrade",   realised: 840, potential: 360 },
  { type: "Switch Tool", realised: 620, potential: 280 },
  { type: "API Credits", realised: 450, potential: 200 },
  { type: "Seat Trim",   realised: 310, potential: 140 },
];

// ─────────────────────────────────────────────────────────────
// Live activity feed
// ─────────────────────────────────────────────────────────────
const liveActivities = [
  "⚡ Startup saved $1,200/mo by switching to Cursor Pro",
  "📊 Team cut OpenAI spend by 42% via token routing",
  "🚀 Agency consolidated 5 AI tools → saved $3,400/yr",
  "💡 Detected 7 duplicate seats → recovered $980",
  "🔥 Founder eliminated ChatGPT + Claude overlap → -$40/mo",
];

// ─────────────────────────────────────────────────────────────
// Glass card style helper
// ─────────────────────────────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--card-border)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const tooltipStyle = {
  backgroundColor: "rgba(5,11,26,0.92)",
  border: "1px solid rgba(6,182,212,0.3)",
  borderRadius: 10,
  color: "#e2e8f0",
  fontSize: 12,
};

// ─────────────────────────────────────────────────────────────
// Section wrapper (fade-up on scroll)
// ─────────────────────────────────────────────────────────────
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export function LandingSections({ onAuditClick }: { onAuditClick: () => void }) {
  const [activityIdx, setActivityIdx] = useState(0);
  const [teamSize, setTeamSize] = useState(10);
  const [monthlySpend, setMonthlySpend] = useState(3000);

  useEffect(() => {
    const t = setInterval(() => setActivityIdx((i) => (i + 1) % liveActivities.length), 4000);
    return () => clearInterval(t);
  }, []);

  const roiSavings = Math.round(monthlySpend * 0.26 * 12);

  return (
    <div className="space-y-28 pb-24 px-4 sm:px-6">

      {/* ── 1. HERO GLASS CTA — "Ready to stop overspending" ─────────── */}
      <Section>
        <div
          className="relative rounded-3xl overflow-hidden text-center px-8 py-16"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 0 80px rgba(6,182,212,0.08), 0 0 160px rgba(168,85,247,0.06), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Gradient orbs inside card */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute -top-16 left-1/4 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)", filter: "blur(48px)" }} />
            <div className="absolute -bottom-16 right-1/4 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)", filter: "blur(48px)" }} />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#67e8f9" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            2,800+ startups already optimised
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold"
            style={{ background: "linear-gradient(135deg, #ffffff 10%, #67e8f9 50%, #c084fc 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Ready to stop overspending on AI?
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            Join 2,800+ startups that have already optimised their AI costs.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onAuditClick}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.92)",
                color: "#3730a3",
                boxShadow: "0 4px 24px rgba(255,255,255,0.2)",
              }}
            >
              Start Free Audit <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://calendly.com/mittalprakhar504/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(12px)",
              }}
            >
              Start Pro Trial <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>

      {/* ── 2. TRUSTED COMPANIES MARQUEE ─────────────────────────────── */}
      <Section>
        <p className="text-center text-xs uppercase tracking-widest mb-6 font-medium" style={{ color: "var(--foreground)", opacity: 0.35 }}>
          Trusted by AI-first startups, agencies &amp; SaaS teams
        </p>
        <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
          <div className="animate-marquee flex gap-14 items-center">
            {["OpenAI", "Anthropic", "Cursor", "Vercel", "Notion", "Zapier", "Replit", "Midjourney", "ElevenLabs", "Runway", "HeyGen", "Perplexity",
              "OpenAI", "Anthropic", "Cursor", "Vercel", "Notion", "Zapier", "Replit", "Midjourney", "ElevenLabs", "Runway", "HeyGen", "Perplexity"].map((logo, i) => (
              <span
                key={i}
                className="text-lg font-bold whitespace-nowrap select-none"
                style={{ color: "var(--foreground)", opacity: 0.22 }}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 3. LIVE STATS (animated counters) ────────────────────────── */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "AI Spend Optimised", value: 2.4, suffix: "M+", decimals: 1, icon: <TrendingUp className="h-5 w-5" />, color: "#34d399" },
            { label: "Audits Generated",    value: 18000, suffix: "",  decimals: 0, icon: <Activity className="h-5 w-5" />,   color: "#67e8f9" },
            { label: "Average Savings",     value: 43, suffix: "%",   decimals: 0, icon: <Zap className="h-5 w-5" />,        color: "#a855f7" },
            { label: "AI Tools Supported",  value: 35, suffix: "+",   decimals: 0, icon: <Cpu className="h-5 w-5" />,        color: "#f59e0b" },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: `0 8px 32px ${s.color}18` }}
              className="rounded-2xl px-5 py-6 text-center"
              style={glassCard}
            >
              <div className="flex justify-center mb-3" style={{ color: s.color }}>{s.icon}</div>
              <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>
                <CountUp target={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.45 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 4. "SEE HOW YOUR STACK COMPARES" GLASS CTA ───────────────── */}
      <Section>
        <div
          className="relative rounded-3xl overflow-hidden text-center px-8 py-14"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 0 80px rgba(168,85,247,0.08), 0 0 160px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)", filter: "blur(56px)" }} />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(56px)" }} />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold"
            style={{ background: "linear-gradient(135deg, #ffffff 10%, #c084fc 50%, #67e8f9 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            See how YOUR stack compares
          </h2>
          <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            Get a free personalised audit powered by Groq AI — results in under 2 minutes.
          </p>
          <button
            onClick={onAuditClick}
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#4c1d95",
              boxShadow: "0 4px 24px rgba(255,255,255,0.18)",
            }}
          >
            Run Free Audit <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Section>

      {/* ── 5. WHY SPENDWISE AI? (feature cards) ─────────────────────── */}
      <Section id="features">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>Why SpendWise AI?</h2>
          <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.45 }}>Everything you need to make your AI budget go further</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Eye className="h-6 w-6" />, color: "#67e8f9", title: "Hidden AI Waste", desc: "Uncover unused seats, dormant subscriptions and overlapping tools in seconds." },
            { icon: <BarChart3 className="h-6 w-6" />, color: "#a855f7", title: "Real-Time Token Visibility", desc: "Track OpenAI, Claude & Gemini token burn per user, per day, in real time." },
            { icon: <Shield className="h-6 w-6" />, color: "#34d399", title: "AI CFO Dashboard", desc: "Single control center for all AI spend — budgets, alerts, forecasts." },
            { icon: <Sparkles className="h-6 w-6" />, color: "#f59e0b", title: "Smart Recommendations", desc: "Our engine maps your stack against 35+ alternatives and flags exact savings." },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 transition-all duration-300"
              style={{ ...glassCard, borderColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${card.color}40`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${card.color}18`, color: card.color }}>
                {card.icon}
              </div>
              <h3 className="font-bold mb-2" style={{ color: "var(--foreground)" }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.5 }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 6. DASHBOARD PREVIEW (recharts graphs) ───────────────────── */}
      <Section id="dashboard">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
            One Dashboard, Total Control
          </h2>
          <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.45 }}>
            Live token tracking · Team analytics · Cost forecasting · Budget alerts
          </p>
        </div>

        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{
            ...glassCard,
            boxShadow: "0 4px 60px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Top 2-column charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Spend Trend Area Chart */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" style={{ color: "#67e8f9" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Monthly AI Cost Trend</span>
              </div>
              <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: "var(--foreground)", opacity: 0.5 }}>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-400" />Current</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />Optimised</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={spendTrendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradOptimized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} width={52} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any, name: any) => [`$${Number(v).toLocaleString()}`, name]}
                  />
                  <Area type="monotone" dataKey="current" name="Current" stroke="#f87171" strokeWidth={2} fill="url(#gradCurrent)" />
                  <Area type="monotone" dataKey="optimized" name="Optimised" stroke="#34d399" strokeWidth={2} fill="url(#gradOptimized)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Token Usage Bar Chart */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4" style={{ color: "#a855f7" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Token Usage by Model (000s)</span>
              </div>
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={tokenUsageData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <XAxis dataKey="model" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k`} width={40} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any) => [`${v}k tokens`]}
                  />
                  <Bar dataKey="tokens" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings by Type — horizontal bar */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4" style={{ color: "#f59e0b" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Savings by Optimisation Type ($)</span>
              <div className="ml-auto flex items-center gap-4 text-xs" style={{ color: "var(--foreground)", opacity: 0.5 }}>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />Realised</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" />Untapped</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={savingsByType} layout="vertical" margin={{ top: 0, right: 16, left: 60, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="type" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={60} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any, name: any) => [`$${v}`, name]}
                />
                <Bar dataKey="realised" name="Realised" fill="#34d399" radius={[0, 6, 6, 0]} barSize={14} />
                <Bar dataKey="potential" name="Untapped" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {["Live token tracking", "Team analytics", "Cost forecasting", "Budget alerts", "API monitoring", "Seat analytics", "Renewal reminders"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.2)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 7. AI TOOL ECOSYSTEM ──────────────────────────────────────── */}
      <Section>
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: "var(--foreground)" }}>
          Integrated with 35+ AI Tools
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {["OpenAI", "Claude", "Gemini", "Groq", "Cursor", "Windsurf", "Copilot", "Midjourney", "ElevenLabs", "Runway", "Jasper", "Perplexity"].map((tool) => (
            <motion.div
              key={tool}
              whileHover={{ scale: 1.04 }}
              className="rounded-xl p-3 text-center text-xs font-semibold cursor-default transition-all"
              style={{ ...glassCard }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
            >
              <span style={{ color: "var(--foreground)", opacity: 0.75 }}>{tool}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 8. BEFORE VS AFTER ───────────────────────────────────────── */}
      <Section>
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: "var(--card)",
            border: "1px solid rgba(52,211,153,0.2)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 0 60px rgba(52,211,153,0.05)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-6" style={{ color: "var(--foreground)" }}>Before vs After SpendWise</h2>
              <div className="space-y-4">
                {[
                  { before: "9 AI subscriptions", after: "4 optimised tools" },
                  { before: "$4,200/month", after: "$1,800/month saved" },
                  { before: "Zero visibility", after: "Full token analytics" },
                  { before: "Manual tracking", after: "Automated alerts" },
                ].map((row) => (
                  <div key={row.before} className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.5 }}>{row.before}</span>
                    <span className="text-sm font-semibold" style={{ color: "#34d399" }}>→ {row.after}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-2xl p-8" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="text-6xl font-black" style={{ color: "#34d399" }}>-57%</div>
                <div className="text-sm mt-2" style={{ color: "var(--foreground)", opacity: 0.5 }}>average cost reduction</div>
                <div className="mt-4 text-xs" style={{ color: "var(--foreground)", opacity: 0.35 }}>across 2,800+ audited teams</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 9. ADVANCED FEATURES GRID ────────────────────────────────── */}
      <Section>
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: "var(--foreground)" }}>Advanced Features</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Token-level analytics per model", "API usage heatmaps by team",
            "Team cost attribution & chargebacks", "AI budget forecasting (3-month)",
            "Renewal reminders & auto-alerts", "Subscription overlap detection",
            "Smart downgrade suggestions", "PDF audit export & sharing",
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
              style={glassCard}
            >
              <Check className="h-4 w-4 shrink-0" style={{ color: "#34d399" }} />
              <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.75 }}>{feat}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 10. TESTIMONIALS ─────────────────────────────────────────── */}
      <Section id="testimonials">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: "var(--foreground)" }}>Loved by AI Teams</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { quote: "SpendWise helped us cut 38% of AI costs in just 2 days. The overlap detection alone saved us $800/mo.", author: "Alex M.", role: "Founder, AI Startup", color: "#67e8f9" },
            { quote: "We discovered we were paying for duplicate AI tools we didn't even know about. Found $2k/mo in savings.", author: "Sarah K.", role: "CTO, SaaS Company", color: "#a855f7" },
            { quote: "The Groq-powered audit summary was shockingly accurate. It saved our team 3 hours of manual analysis.", author: "Rohan P.", role: "VP Engineering, Agency", color: "#34d399" },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-6"
              style={{
                ...glassCard,
                borderColor: `${t.color}25`,
              }}
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" style={{ color: t.color }} />)}
              </div>
              <p className="text-sm italic leading-relaxed mb-5" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}>
                  {t.author[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{t.author}</div>
                  <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 11. WHO IS THIS FOR? ─────────────────────────────────────── */}
      <Section>
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: "var(--foreground)" }}>Who Is This For?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Startups", desc: "Catch AI waste before Series A", icon: "🚀", color: "#67e8f9" },
            { label: "Agencies", desc: "Track AI cost per client project", icon: "🎯", color: "#a855f7" },
            { label: "SaaS Teams", desc: "Control AI API budget & token burn", icon: "⚙️", color: "#34d399" },
            { label: "Enterprises", desc: "Governance, compliance & chargebacks", icon: "🏢", color: "#f59e0b" },
          ].map((a) => (
            <motion.div
              key={a.label}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 text-center"
              style={glassCard}
            >
              <div className="text-3xl mb-3">{a.icon}</div>
              <div className="font-bold mb-1" style={{ color: a.color }}>{a.label}</div>
              <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.45 }}>{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 12. SECURITY & PRIVACY ───────────────────────────────────── */}
      <Section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>Enterprise-Grade Security</h2>
          <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.45 }}>Your data never leaves your control</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: <Lock className="h-4 w-4" />, label: "Encrypted API keys" },
            { icon: <Shield className="h-4 w-4" />, label: "GDPR Ready" },
            { icon: <Activity className="h-4 w-4" />, label: "SOC-2 Inspired" },
            { icon: <Zap className="h-4 w-4" />, label: "Zero data training" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
              style={{ ...glassCard, color: "var(--foreground)" }}
            >
              <span style={{ color: "#34d399" }}>{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>
      </Section>

      {/* ── 13. ROI CALCULATOR ───────────────────────────────────────── */}
      <Section>
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: "var(--card)",
            border: "1px solid rgba(99,102,241,0.2)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: "var(--foreground)" }}>
            Estimate Your Savings
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--foreground)", opacity: 0.45 }}>
            Adjust the sliders to see your potential annual savings
          </p>

          <div className="max-w-lg mx-auto space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 flex justify-between" style={{ color: "var(--foreground)" }}>
                <span>Team size</span>
                <span style={{ color: "#67e8f9" }}>{teamSize} people</span>
              </label>
              <input
                type="range" min={1} max={200} value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex justify-between" style={{ color: "var(--foreground)" }}>
                <span>Monthly AI spend</span>
                <span style={{ color: "#a855f7" }}>${monthlySpend.toLocaleString()}/mo</span>
              </label>
              <input
                type="range" min={100} max={20000} step={100} value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Result */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--foreground)", opacity: 0.4 }}>
                Potential yearly savings
              </div>
              <div className="text-5xl font-black" style={{ color: "#34d399" }}>
                ${roiSavings.toLocaleString()}
              </div>
              <div className="text-xs mt-2" style={{ color: "var(--foreground)", opacity: 0.35 }}>
                Based on 26% avg savings across similar teams
              </div>
            </div>

            <button
              onClick={onAuditClick}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 24px rgba(6,182,212,0.2)" }}
            >
              Get My Real Savings Report →
            </button>
          </div>
        </div>
      </Section>

      {/* ── 14. FINAL CTA ────────────────────────────────────────────── */}
      <Section>
        <div
          className="relative rounded-3xl overflow-hidden text-center px-8 py-16"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 0 100px rgba(6,182,212,0.07), 0 0 160px rgba(168,85,247,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Orbs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-20 left-1/3 h-80 w-80 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute -bottom-20 right-1/3 h-80 w-80 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
            style={{ background: "linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Stop Overspending on AI.<br />Start Scaling Smarter.
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            Get your AI cost audit in under 2 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onAuditClick}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 32px rgba(6,182,212,0.28)" }}
            >
              Run Free Audit <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="https://calendly.com/mittalprakhar504/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              Book Free Trial →
            </a>
          </div>
        </div>
      </Section>

      {/* ── Live activity feed ── (fixed, rendered here for layout) */}
      <LiveActivityFeed activities={liveActivities} currentIdx={activityIdx} />

      {/* ── Sticky floating audit button ── */}
      <button
        onClick={onAuditClick}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-2xl transition-all hover:scale-105 animate-pulse-glow"
        style={{
          background: "linear-gradient(135deg, #06b6d4, #6366f1)",
          boxShadow: "0 4px 32px rgba(6,182,212,0.4)",
        }}
      >
        ⚡ Free Audit
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Live Activity Feed — fixed bottom-left
// ─────────────────────────────────────────────────────────────
function LiveActivityFeed({ activities, currentIdx }: { activities: string[]; currentIdx: number }) {
  return (
    <div
      className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 rounded-full px-4 py-2.5 text-xs max-w-xs sm:max-w-sm"
      style={{
        background: "rgba(5,11,26,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(6,182,212,0.25)",
        color: "#67e8f9",
      }}
    >
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-400 animate-pulse" />
      <span className="truncate">{activities[currentIdx]}</span>
    </div>
  );
}
