"use client";

import { useState } from "react";
import { Mail, Building2, Loader2, ArrowRight, Lock } from "lucide-react";

type LeadCaptureProps = {
  estimatedSaving: number;
  onSubmit: (email: string, company: string) => void;
  isSubmitting: boolean;
};

export function LeadCapture({ estimatedSaving, onSubmit, isSubmitting }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim(), company.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(5,11,26,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-md rounded-3xl p-8 animate-fade-up"
        style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.08))", border: "1px solid rgba(6,182,212,0.25)" }}>

        {/* Savings teaser */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300 mb-4"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
            Audit complete — results ready
          </div>
          <div className="text-5xl font-black mb-1"
            style={{ background: "linear-gradient(135deg, #34d399, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            ${estimatedSaving.toLocaleString()}<span className="text-2xl font-semibold">/mo</span>
          </div>
          <p className="text-slate-400 text-sm">potential savings found in your stack</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot — must stay hidden, never visible to user */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
            aria-hidden="true"
          />

          <div>
            <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">
              Work email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="futuristic-input w-full rounded-xl pl-9 pr-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">
              Company <span className="text-slate-600">(optional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="futuristic-input w-full rounded-xl pl-9 pr-4 py-3 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.trim() || isSubmitting}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 25px rgba(6,182,212,0.3)" }}
          >
            {isSubmitting ? (
              <><Loader2 className="h-5 w-5 animate-spin" />Saving your report...</>
            ) : (
              <>View My Full Report <ArrowRight className="h-5 w-5" /></>
            )}
          </button>
        </form>

        {/* Trust line */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-600">
          <Lock className="h-3 w-3" />
          No spam. Report is yours — we only reach out if savings &gt; $500/mo.
        </p>
      </div>
    </div>
  );
}
