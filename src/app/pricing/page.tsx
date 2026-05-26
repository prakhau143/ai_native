"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Check, Sparkles, Zap, Shield, Rocket, ArrowRight, X, Send,
  TrendingUp, Users, Key, Bell, Download, BarChart3, Cpu, Lock,
  CheckCircle, Globe, CreditCard
} from "lucide-react";
import { Header } from "@/components/Header";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// ── Plan type ─────────────────────────────────────────────────────────────────
type Plan = {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  popular: boolean;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accentColor: string;
  badge: string | null;
  isModal: boolean;
};

// ── Static illustrative data for pricing page charts ────────────────────────
const costTrendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Current Spend",
      data: [2400, 2600, 2800, 2700, 2950, 3100],
      borderColor: "#f87171",
      backgroundColor: "rgba(248,113,113,0.08)",
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
    },
    {
      label: "With SpendWise Pro",
      data: [2400, 1900, 1750, 1680, 1620, 1580],
      borderColor: "#34d399",
      backgroundColor: "rgba(52,211,153,0.08)",
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
    },
  ],
};

const tokenUsageData = {
  labels: ["OpenAI API", "Anthropic API", "Gemini", "Groq", "Others"],
  datasets: [{
    label: "Monthly Tokens (thousands)",
    data: [450, 320, 180, 95, 60],
    backgroundColor: ["rgba(6,182,212,0.75)", "rgba(168,85,247,0.75)", "rgba(99,102,241,0.75)", "rgba(245,158,11,0.75)", "rgba(52,211,153,0.75)"],
    borderColor: ["#06b6d4", "#a855f7", "#6366f1", "#f59e0b", "#34d399"],
    borderWidth: 2,
    borderRadius: 8,
    borderSkipped: false,
  }],
};

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "var(--foreground)", font: { size: 11 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
    },
    tooltip: {
      backgroundColor: "rgba(5,11,26,0.92)",
      borderColor: "rgba(6,182,212,0.25)",
      borderWidth: 1,
      titleColor: "#e2e8f0",
      bodyColor: "#94a3b8",
      padding: 12,
    },
  },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } }, border: { color: "rgba(255,255,255,0.06)" } },
    y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } }, border: { color: "rgba(255,255,255,0.06)" } },
  },
};

// ── Plans data ────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Free",
    price: "$0",
    yearlyPrice: "$0",
    period: "",
    description: "For solo founders exploring AI cost control",
    features: [
      "1 AI spend audit/month",
      "Track up to 5 AI tools",
      "Basic token analytics",
      "Email summary report",
      "7-day audit history",
      "Community support",
    ],
    cta: "Start Free",
    href: "/#audit",
    popular: false,
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #475569, #64748b)",
    accentColor: "#94a3b8",
    badge: null,
    isModal: false,
  },
  {
    name: "Pro",
    price: "$20",
    yearlyPrice: "$192",
    period: "/month",
    description: "Advanced AI cost intelligence for startups & teams",
    features: [
      "Unlimited AI audits",
      "Track 30+ AI tools",
      "Per-user token analytics",
      "Sub-token monitoring system",
      "Track employee & API-key usage",
      "Real-time AI spending dashboard",
      "OpenAI, Claude, Gemini integrations",
      "Custom API key management",
      "AI cost optimisation engine",
      "Export reports (PDF/CSV)",
      "Admin analytics panel",
      "Priority support",
      "30-day history",
      "Team sharing",
    ],
    cta: "Start 14-day Trial",
    href: "#",
    popular: true,
    icon: Zap,
    gradient: "linear-gradient(135deg, #06b6d4, #6366f1)",
    accentColor: "#06b6d4",
    badge: "Most Popular",
    isModal: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    yearlyPrice: "Custom",
    period: "",
    description: "For large organisations with complex AI infrastructure",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom AI integrations",
      "SLA guarantee (99.9%)",
      "Bulk API credits via Credex",
      "On-premise deployment option",
      "SSO & enterprise auth",
      "White-label dashboard",
      "Unlimited team members",
      "Custom compliance reports",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    href: "mailto:mittalprakhar504@gmail.com?subject=Enterprise%20Plan%20Inquiry",
    popular: false,
    icon: Shield,
    gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
    accentColor: "#a855f7",
    badge: "Best Value",
    isModal: false,
  },
] satisfies Plan[];

// ── Comparison table ──────────────────────────────────────────────────────────
const comparisonRows = [
  { feature: "AI Tool Tracking", free: "5 tools", pro: "30+ tools", enterprise: "Unlimited" },
  { feature: "Audits per Month", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Token Analytics", free: "Basic", pro: "Advanced", enterprise: "Custom" },
  { feature: "Per-User Tracking", free: false, pro: true, enterprise: true },
  { feature: "Sub-token System", free: false, pro: true, enterprise: true },
  { feature: "Admin Dashboard", free: false, pro: true, enterprise: true },
  { feature: "API Key Management", free: false, pro: true, enterprise: true },
  { feature: "Export PDF/CSV", free: false, pro: true, enterprise: true },
  { feature: "Custom Integrations", free: false, pro: false, enterprise: true },
  { feature: "On-Premise Deployment", free: false, pro: false, enterprise: true },
  { feature: "SLA Guarantee", free: false, pro: false, enterprise: true },
  { feature: "24/7 Support", free: false, pro: false, enterprise: true },
  { feature: "Audit History", free: "7 days", pro: "30 days", enterprise: "Forever" },
  { feature: "Data Retention", free: "7 days", pro: "30 days", enterprise: "Forever" },
] as const;

// ── Admin features grid ────────────────────────────────────────────────────────
const adminFeatures = [
  { icon: BarChart3, title: "AI Token Analytics", desc: "Track every AI token used across your organisation in real-time with visual dashboards.", color: "#06b6d4" },
  { icon: Users, title: "User-wise Usage", desc: "See which employee, client, or API key consumes the most AI tokens this month.", color: "#a855f7" },
  { icon: Key, title: "Sub-token System", desc: "Create sub-accounts and monitor token budgets individually per team or project.", color: "#f59e0b" },
  { icon: Zap, title: "AI Cost Optimizer", desc: "Get smart Groq-powered recommendations to cut OpenAI/Gemini/Claude costs by 30%+.", color: "#34d399" },
  { icon: TrendingUp, title: "Live Spending Graphs", desc: "Beautiful real-time charts showing AI cost trends and savings forecasts.", color: "#f97316" },
  { icon: Cpu, title: "Multi-Model Tracking", desc: "Track OpenAI, Claude, Gemini, Groq, Mistral & custom LLM APIs from one pane.", color: "#ec4899" },
  { icon: Lock, title: "API Key Monitoring", desc: "Securely monitor all connected AI APIs. Get alerts on abnormal usage spikes.", color: "#6366f1" },
  { icon: Users, title: "Team Management", desc: "Manage unlimited users, roles, permissions, and spending limits per member.", color: "#06b6d4" },
  { icon: Download, title: "Export Analytics", desc: "Download detailed PDF/CSV reports instantly. Schedule weekly email digests.", color: "#a855f7" },
  { icon: Bell, title: "Budget Alerts", desc: "Get real-time Slack/email alerts when any team or API key crosses budget thresholds.", color: "#34d399" },
  { icon: Globe, title: "Shareable Reports", desc: "Create public report links to share AI cost insights with your board or investors.", color: "#f59e0b" },
  { icon: CreditCard, title: "Credex Integration", desc: "Unlock 20-30% volume discounts on Anthropic & OpenAI API credits via Credex.", color: "#f97316" },
];

// ── Trust badges ──────────────────────────────────────────────────────────────
const trustBadges = [
  { icon: CheckCircle, label: "99.9% Uptime SLA" },
  { icon: Shield, label: "GDPR Ready" },
  { icon: Lock, label: "SOC 2 Compliant" },
  { icon: Zap, label: "< 2s Audit Results" },
  { icon: Globe, label: "Global CDN" },
  { icon: Users, label: "2,800+ Teams Audited" },
];

// ── Pro Plan Modal ─────────────────────────────────────────────────────────────
function ProPlanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", monthlySpend: "", teamSize: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pricing-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setForm({ name: "", company: "", email: "", phone: "", monthlySpend: "", teamSize: "" });
      }, 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none futuristic-input";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,11,26,0.85)", backdropFilter: "blur(12px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: "var(--background)", border: "1px solid rgba(6,182,212,0.3)", boxShadow: "0 0 60px rgba(6,182,212,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 sm:p-7" style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1, #a855f7)" }}>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <Zap className="w-10 h-10 text-white mb-3" />
              <h2 className="text-2xl font-black text-white">Start Your Pro Trial</h2>
              <p className="text-white/75 text-sm mt-1">14 days free · No credit card needed · Our team contacts you within 24h</p>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-7">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                    <CheckCircle className="w-8 h-8" style={{ color: "#34d399" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>You&apos;re in!</h3>
                  <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                    Check your inbox — we&apos;ve sent confirmation to <strong>{form.email}</strong>.
                    Our team will reach out within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--foreground)", opacity: 0.6 }}>Full Name *</label>
                      <input required className={inputClass} placeholder="Prakhar Mittal" value={form.name} onChange={(e) => set("name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--foreground)", opacity: 0.6 }}>Company</label>
                      <input className={inputClass} placeholder="Your startup" value={form.company} onChange={(e) => set("company", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--foreground)", opacity: 0.6 }}>Work Email *</label>
                    <input required type="email" className={inputClass} placeholder="you@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--foreground)", opacity: 0.6 }}>Phone</label>
                      <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--foreground)", opacity: 0.6 }}>Team Size</label>
                      <input type="number" min="1" className={inputClass} placeholder="e.g. 8" value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                      Monthly AI Spend ($) — helps us personalise your audit
                    </label>
                    <input type="number" min="0" className={inputClass} placeholder="e.g. 850" value={form.monthlySpend} onChange={(e) => set("monthlySpend", e.target.value)} />
                  </div>

                  {error && (
                    <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100 mt-2"
                    style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
                  >
                    {loading ? (
                      <span className="animate-pulse">Sending…</span>
                    ) : (
                      <><Send className="w-4 h-4" /> Start My Free Trial</>
                    )}
                  </button>
                  <p className="text-center text-xs mt-2" style={{ color: "var(--foreground)", opacity: 0.35 }}>
                    No credit card · Cancel anytime · We reply within 24h
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Header />

      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse-glow" style={{ background: "#06b6d4" }} />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl animate-pulse-glow delay-2000" style={{ background: "#a855f7" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)" }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-20 pb-14 px-4"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#67e8f9" }}
          >
            <Rocket className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>

          <h1
            className="text-5xl md:text-7xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, var(--foreground) 0%, #67e8f9 50%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Scale Your AI Stack<br />Without Losing Control
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            Track every token, audit every tool, optimise every dollar. Start free — upgrade when you need the full power.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex p-1 rounded-full" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize"
                style={
                  billing === b
                    ? { background: "linear-gradient(135deg, #06b6d4, #6366f1)", color: "white", boxShadow: "0 2px 12px rgba(6,182,212,0.3)" }
                    : { color: "var(--foreground)", opacity: 0.5 }
                }
              >
                {b}
                {b === "yearly" && (
                  <span className="ml-1.5 text-xs font-bold text-emerald-400">−20%</span>
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ── Pricing Cards ──────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, idx) => {
              const displayPrice = billing === "yearly" ? plan.yearlyPrice : plan.price;
              const showPerYear = billing === "yearly" && plan.price !== "$0" && plan.price !== "Custom";

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="relative rounded-3xl overflow-hidden"
                  style={
                    plan.popular
                      ? { border: `2px solid ${plan.accentColor}`, boxShadow: `0 0 40px ${plan.accentColor}33` }
                      : { border: "1px solid var(--card-border)" }
                  }
                >
                  {plan.badge && (
                    <div
                      className="absolute top-0 right-0 z-10 px-4 py-1 text-xs font-bold text-white rounded-bl-2xl"
                      style={{ background: plan.gradient }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Card header */}
                  <div className="p-7 text-white" style={{ background: plan.gradient }}>
                    <plan.icon className="w-11 h-11 mb-5 opacity-90" />
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                    <div className="mt-4 mb-1">
                      <span className="text-5xl font-black">{displayPrice}</span>
                      {plan.period && !showPerYear && (
                        <span className="text-base opacity-70 ml-1">{plan.period}</span>
                      )}
                      {showPerYear && (
                        <span className="text-sm opacity-70 ml-1">/ year</span>
                      )}
                    </div>
                    <p className="text-sm opacity-80 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Card body */}
                  <div className="p-7" style={{ background: "var(--background)" }}>
                    <ul className="space-y-2.5 mb-7">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: plan.accentColor }} />
                          <span style={{ color: "var(--foreground)", opacity: 0.8 }}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.isModal ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setModalOpen(true)}
                        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white"
                        style={{ background: plan.gradient, boxShadow: `0 0 20px ${plan.accentColor}40` }}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <a href={plan.href}>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                          style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                        >
                          {plan.cta}
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </a>
                    )}

                    {plan.name === "Pro" && (
                      <p className="text-center text-xs mt-2.5" style={{ color: "var(--foreground)", opacity: 0.35 }}>
                        No credit card required · 14 days free
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Charts Section ─────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2
              className="text-3xl font-bold mb-2"
              style={{ background: "linear-gradient(90deg, #06b6d4, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              See the Impact in Numbers
            </h2>
            <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.5 }}>
              Illustrative data based on average savings across 2,800+ audited teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Line chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" style={{ color: "#34d399" }} />
                <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Monthly AI Cost: Before vs After</h3>
              </div>
              <div className="h-52">
                <Line data={costTrendData} options={{
                  ...chartDefaults,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  plugins: { ...chartDefaults.plugins, tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: (ctx: any) => ` ${ctx.dataset?.label}: $${((ctx.parsed?.y) ?? 0).toLocaleString()}` } } },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: (v: any) => `$${v}` } } },
                  interaction: { mode: "index" as const, intersect: false },
                }} />
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: "#34d399", opacity: 0.8 }}>
                Average team saves $1,520/mo after Pro optimisation
              </p>
            </motion.div>

            {/* Bar chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4" style={{ color: "#06b6d4" }} />
                <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Token Usage by AI Model</h3>
              </div>
              <div className="h-52">
                <Bar data={tokenUsageData} options={{
                  ...chartDefaults,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  plugins: { ...chartDefaults.plugins, legend: { display: false }, tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: (ctx: any) => ` ${(ctx.parsed?.y ?? 0)}k tokens/mo` } } },
                }} />
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: "#06b6d4", opacity: 0.8 }}>
                Pro dashboard shows live token usage per model & user
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Admin Dashboard Features ───────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
            >
              <Zap className="w-4 h-4" />
              Pro & Enterprise
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ background: "linear-gradient(90deg, #06b6d4, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Premium Admin Dashboard Features
            </h2>
            <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.5 }}>
              Everything you need to control AI spending across your organisation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {adminFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl p-5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--card-border)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}30` }}
                >
                  <feat.icon className="h-5 w-5" style={{ color: feat.color }} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--foreground)" }}>{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.5 }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Comparison Table ───────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-10"
            style={{ color: "var(--foreground)" }}
          >
            Compare Plans
          </motion.h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--card-border)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--card)", borderBottom: "1px solid var(--card-border)" }}>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--foreground)", opacity: 0.6 }}>Feature</th>
                  {["Free", "Pro", "Enterprise"].map((plan) => (
                    <th key={plan} className="px-6 py-4 text-center text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {plan}
                      {plan === "Pro" && <span className="ml-1.5 text-xs font-normal" style={{ color: "#06b6d4" }}>$20/mo</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className="transition-colors"
                    style={{ borderBottom: i < comparisonRows.length - 1 ? "1px solid var(--card-border)" : "none", background: i % 2 === 0 ? "transparent" : "var(--card)" }}
                  >
                    <td className="px-6 py-3.5 text-sm" style={{ color: "var(--foreground)", opacity: 0.75 }}>{row.feature}</td>
                    {(["free", "pro", "enterprise"] as const).map((tier) => {
                      const val = row[tier];
                      return (
                        <td key={tier} className="px-6 py-3.5 text-center">
                          {typeof val === "boolean" ? (
                            val
                              ? <Check className="w-5 h-5 mx-auto" style={{ color: "#34d399" }} />
                              : <span style={{ color: "var(--foreground)", opacity: 0.2 }}>—</span>
                          ) : (
                            <span className="text-sm font-medium" style={{ color: tier === "pro" ? "#06b6d4" : tier === "enterprise" ? "#a855f7" : "var(--foreground)", opacity: tier === "free" ? 0.6 : 1 }}>
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Trust Section ──────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-8 sm:p-12 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-sm font-medium mb-6" style={{ color: "var(--foreground)", opacity: 0.5 }}>
              Trusted by AI-first startups, agencies & modern SaaS teams worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", color: "var(--foreground)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#06b6d4" }} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "var(--foreground)" }}>
            Frequently Asked Questions
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { q: "Can I cancel anytime?", a: "Yes — all plans cancel with 30 days' notice. No long-term contracts, ever." },
              { q: "Is there a free trial for Pro?", a: "14-day free trial with all Pro features — no credit card required." },
              { q: "What payment methods do you accept?", a: "All major credit cards, PayPal, and wire transfers for Enterprise." },
              { q: "How do Credex discounts work?", a: "Enterprise customers get exclusive 20-30% discounts on API credits via our partner Credex." },
              { q: "Can I switch plans?", a: "Upgrade or downgrade anytime — we prorate the difference automatically." },
              { q: "Educational discounts?", a: "Students and educators get 50% off Pro. Contact us with your .edu email to apply." },
            ].map(({ q, a }, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="p-5 rounded-2xl"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
              >
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "var(--foreground)" }}>{q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.55 }}>{a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden p-14 text-center"
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
              <div className="absolute -top-20 -left-10 h-80 w-80 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.45) 0%, transparent 65%)", filter: "blur(52px)" }} />
              <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 65%)", filter: "blur(52px)" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)", filter: "blur(40px)" }} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black mb-3"
              style={{ background: "linear-gradient(135deg, #ffffff 10%, #a5f3fc 50%, #e9d5ff 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Ready to stop overspending on AI?
            </h2>
            <p className="mb-8 text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
              Join 2,800+ startups that have already optimised their AI costs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#audit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-2xl font-bold text-base"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "#4f46e5",
                    boxShadow: "0 4px 24px rgba(255,255,255,0.2)",
                  }}
                >
                  Start Free Audit →
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
                className="px-10 py-4 rounded-2xl font-bold text-base text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                Start Pro Trial →
              </motion.button>
            </div>
          </motion.div>
        </section>

        <footer
          className="py-10 text-center text-sm opacity-40"
          style={{ borderTop: "1px solid var(--card-border)" }}
        >
          © 2026 SpendWiseAI — Made for founders who ship fast.
        </footer>
      </div>

      {/* Modal */}
      <ProPlanModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
