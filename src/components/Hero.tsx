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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-10 left-1/4 h-[500px] w-[500px] rounded-full animate-pulse-glow"
          style={{ background: "radial-gradient(circle, var(--glow-purple) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute top-40 right-1/4 h-[400px] w-[400px] rounded-full animate-pulse-glow delay-2000"
          style={{ background: "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium animate-fade-up badge-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Trusted by 2,400+ startups — save before your next renewal
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 gradient-text-hero"
        >
          Stop Burning Cash<br />on AI Tools
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-soft mb-10 animate-fade-up delay-200">
          Paste your AI stack. Get an instant, personalized audit showing exactly where you&apos;re overpaying —
          and what to switch to save up to <span className="text-accent font-semibold">60% monthly</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up delay-400">
          <button
            onClick={onAuditClick}
            className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-2xl btn-primary"
          >
            Start Free Audit
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:scale-105 btn-secondary">
            See sample report
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-up delay-600">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="text-accent">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden animate-fade-up delay-800 stat-bar">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-5 text-center ${i < stats.length - 1 ? "border-r" : ""}`}
              style={{ borderColor: "var(--stat-divider)" }}
            >
              <div className="text-2xl sm:text-3xl font-extrabold mb-0.5 gradient-text-stat">
                {s.value}
              </div>
              <div className="text-xs text-muted uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
