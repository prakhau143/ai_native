"use client";

import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Audit", href: "/#audit" },
  { label: "How It Works", href: "/#how" },
  { label: "AI Insights", href: "/ai-insights", pulse: true },
  { label: "Pricing", href: "/pricing" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div
              className="relative flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #a855f7)",
                boxShadow: "0 0 20px rgba(6,182,212,0.4)",
              }}
            >
              <Zap className="h-5 w-5 text-white" fill="white" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(90deg, var(--foreground), #67e8f9, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SpendWise<span style={{ WebkitTextFillColor: "rgba(6,182,212,0.9)" }}>AI</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-cyan-400 relative group flex items-center gap-1.5"
                style={{ color: "var(--foreground)", opacity: 0.7 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                {link.label}
                {"pulse" in link && link.pulse && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right: CTA + theme toggle + mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            <a
              href="/#audit"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #6366f1)",
                boxShadow: "0 0 20px rgba(6,182,212,0.35)",
              }}
            >
              Free Audit
              <span className="text-xs opacity-80">→</span>
            </a>

            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "var(--foreground)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t animate-fade-up"
          style={{
            borderColor: "var(--header-border)",
            background: "var(--header-bg)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="hover:text-cyan-400 transition-colors py-2 text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#audit"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white text-center"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
            >
              Start Free Audit
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
