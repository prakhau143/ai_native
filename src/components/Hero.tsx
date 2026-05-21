"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, TrendingDown, Sparkles, Shield } from "lucide-react";

const stats = [
  { value: "$840", label: "avg monthly saved" },
  { value: "60%", label: "cost reduction" },
  { value: "2 min", label: "audit time" },
];

const badges = [
  { icon: <Shield className="h-3 w-3" />, label: "No card required" },
  { icon: <Sparkles className="h-3 w-3" />, label: "AI-powered analysis" },
  { icon: <TrendingDown className="h-3 w-3" />, label: "Instant results" },
];

export function Hero({ onAuditClick }: { onAuditClick: () => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-20 grid-bg">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-10 left-1/4 h-[500px] w-[500px] rounded-full animate-pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute top-40 right-1/4 h-[400px] w-[400px] rounded-full animate-pulse-glow delay-2000"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Top badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 animate-fade-up"
          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Trusted by 2,400+ startups — save before your next renewal
        </div>

        {/* Headline */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6"
          style={{ background: "linear-gradient(135deg, #ffffff 0%, #67e8f9 45%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          Stop Burning Cash<br />on AI Tools
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 animate-fade-up delay-200">
          Paste your AI stack. Get an instant, personalized audit showing exactly where you&apos;re overpaying —
          and what to switch to save up to <span className="text-cyan-300 font-semibold">60% monthly</span>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up delay-400">
          <button
            onClick={onAuditClick}
            className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
          >
            Start Free Audit
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium text-slate-300 transition-all duration-200 hover:text-white hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            See sample report
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-up delay-600">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-cyan-500">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden animate-fade-up delay-800"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`px-6 py-5 text-center ${i < stats.length - 1 ? "border-r" : ""}`}
              style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-2xl sm:text-3xl font-extrabold mb-0.5"
                style={{ background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {s.value}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
