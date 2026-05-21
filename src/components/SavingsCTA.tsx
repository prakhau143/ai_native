"use client";

import { useState } from "react";
import { CheckCircle, Bell, Loader2, Rocket, CalendarDays, ArrowRight } from "lucide-react";

// ─── Low savings (<$100 or already optimal) ────────────────────────────────

type LowSavingsCTAProps = {
  totalSaving: number;
  onNotifySubmit: (email: string) => Promise<void>;
};

export function LowSavingsCTA({ totalSaving, onNotifySubmit }: LowSavingsCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await onNotifySubmit(email.trim());
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl p-6 text-center animate-fade-up"
      style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>

      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: "rgba(52,211,153,0.12)" }}>
        <CheckCircle className="h-7 w-7" style={{ color: "#34d399" }} />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {totalSaving === 0 ? "You're spending well!" : `Only $${totalSaving}/mo to recover`}
      </h3>

      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
        {totalSaving === 0
          ? "Your AI stack is already well-optimised. We'll watch the market and notify you when a better deal appears."
          : "Modest savings found. Your stack is mostly efficient — a few small tweaks and you're golden."}
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-sm mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="futuristic-input flex-1 rounded-xl px-4 py-2.5 text-sm w-full"
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            Notify me
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-center gap-2 text-emerald-300 text-sm">
          <CheckCircle className="h-4 w-4" />
          You&apos;re on the list — we&apos;ll reach out when savings appear.
        </div>
      )}
    </div>
  );
}

// ─── High savings (>$500) — prominent Credex CTA ───────────────────────────

type HighSavingsCTAProps = {
  totalSaving: number;
  auditId?: string;
};

export function HighSavingsCTA({ totalSaving, auditId }: HighSavingsCTAProps) {
  const annualSaving = totalSaving * 12;

  return (
    <div className="rounded-2xl p-6 sm:p-8 animate-fade-up"
      style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))", border: "1px solid rgba(245,158,11,0.3)" }}>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Left content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "rgba(245,158,11,0.2)" }}>
              <Rocket className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              High-savings audit
            </span>
          </div>

          <h3 className="text-2xl font-black text-white mb-2">
            Save ${annualSaving.toLocaleString()}/year with Credex
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            You&apos;re overpaying by <span className="font-bold text-amber-300">${totalSaving.toLocaleString()}/mo</span>.
            Credex negotiates volume discounts on AI API credits so you stop leaving money on the table.
            Our advisors help teams your size save 20–35% on their exact stack.
          </p>

          <ul className="space-y-1.5 text-sm text-slate-400">
            {["Free 15-min consultation", "We audit your actual invoices", "No commitment required"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 flex flex-col gap-3 sm:text-center">
          <a
            href={`https://cal.com/credex/consultation${auditId ? `?auditId=${auditId}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #d97706, #dc2626)", boxShadow: "0 0 25px rgba(245,158,11,0.3)" }}
          >
            <CalendarDays className="h-4 w-4" />
            Book Free Call
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-xs text-slate-600">15 min · No sales pitch</p>
        </div>
      </div>
    </div>
  );
}
