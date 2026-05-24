"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Audit", href: "/#audit" },
  { label: "AI Insights", href: "/ai-insights", pulse: true },
  { label: "Tools DB", href: "/tools" },
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
          <a href="/" className="flex items-center shrink-0">
            <Logo />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-soft transition-colors duration-200 hover:text-accent relative group flex items-center gap-1.5"
              >
                {link.label}
                {"pulse" in link && link.pulse && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <a
              href="/#audit"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 btn-primary"
            >
              Free Audit
              <span className="text-xs opacity-80">→</span>
            </a>

            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: "var(--foreground)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

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
                className="hover:text-accent transition-colors py-2 text-sm font-medium text-soft"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#audit"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full px-5 py-2.5 text-sm font-semibold text-center btn-primary"
            >
              Start Free Audit
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
