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
    <div className="rounded-2xl p-6 text-center animate-fade-up bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
        <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {totalSaving === 0 ? "You're spending well!" : `Only $${totalSaving}/mo to recover`}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
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
            className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none w-full"
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap disabled:opacity-60 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            Notify me
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
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
    <div className="rounded-2xl p-6 sm:p-8 animate-fade-up bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Left content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Rocket className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              High-savings audit
            </span>
          </div>

          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            Save ${annualSaving.toLocaleString()}/year with Credex
          </h3>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
            You&apos;re overpaying by{" "}
            <span className="font-bold text-amber-700 dark:text-amber-400">
              ${totalSaving.toLocaleString()}/mo
            </span>
            . Credex negotiates volume discounts on AI API credits so you stop leaving money on the
            table. Our advisors help teams your size save 20–35% on their exact stack.
          </p>

          <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            {["Free 15-min consultation", "We audit your actual invoices", "No commitment required"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 flex flex-col gap-3 sm:text-center">
          <a
            href={`https://calendly.com/mittalprakhar504/30min${auditId ? `?auditId=${auditId}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/20"
          >
            <CalendarDays className="h-4 w-4" />
            Book Free Call
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-500">15 min · No sales pitch</p>
        </div>
      </div>
    </div>
  );
}
