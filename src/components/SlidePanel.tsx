"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { LayoutGrid, Copy, Check, BookOpen, Gift, Settings, ChevronRight } from "lucide-react";

type SavedAudit = {
  id: string;
  date: string;
  saving: number;
  tools: number;
};

const MOCK_AUDITS: SavedAudit[] = [
  { id: "a1", date: "May 18, 2026", saving: 620, tools: 5 },
  { id: "a2", date: "Apr 30, 2026", saving: 340, tools: 3 },
];

export function SlidePanel() {
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    navigator.clipboard.writeText("https://spendwise.ai/ref/prakhu2026").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open panel"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 25px rgba(6,182,212,0.45)" }}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 border-l p-0 flex flex-col"
        style={{
          background: "var(--card-solid)",
          borderColor: "var(--card-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Accessible title/description (visually rendered in the header below) */}
        <SheetTitle className="sr-only">My Dashboard</SheetTitle>
        <SheetDescription className="sr-only">Manage saved audits, referrals, and settings</SheetDescription>

        {/* Panel header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)" }}>
              <LayoutGrid className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white" aria-hidden="true">My Dashboard</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-500" aria-hidden="true">Audits, referrals &amp; settings</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">

          {/* Saved audits */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Saved Audits</span>
            </div>
            <div className="space-y-2">
              {MOCK_AUDITS.map((audit) => (
                <button
                  key={audit.id}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5 group"
                  style={{ border: "1px solid var(--card-border)" }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{audit.date}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">{audit.tools} tools · saved ${audit.saving}/mo</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
              <button className="w-full text-xs text-gray-500 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 text-center">
                + New audit
              </button>
            </div>
          </div>

          {/* Referral */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider">Referral Program</span>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              <p className="text-sm text-gray-700 dark:text-slate-300 mb-3">
                Earn <span className="font-bold text-purple-600 dark:text-purple-300">$20 credit</span> for every friend who upgrades.
              </p>
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-xs font-mono text-gray-500 dark:text-slate-400 truncate"
                style={{ background: "var(--stat-bar-bg)", border: "1px solid var(--card-border)" }}
              >
                spendwise.ai/ref/prakhu2026
              </div>
              <button
                onClick={copyReferral}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy referral link"}
              </button>
            </div>
          </div>

          {/* Quick settings */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-3.5 w-3.5 text-gray-400 dark:text-slate-400" />
              <span className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Settings</span>
            </div>
            <div className="space-y-1">
              {["Email notifications", "Auto-refresh prices", "Dark mode"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ border: "1px solid var(--card-border)" }}
                >
                  <span className="text-sm text-gray-700 dark:text-slate-300">{item}</span>
                  <div
                    className="h-5 w-9 rounded-full flex items-center px-0.5 cursor-pointer"
                    style={{ background: item === "Dark mode" ? "rgba(6,182,212,0.6)" : "rgba(148,163,184,0.2)" }}
                  >
                    <div
                      className="h-4 w-4 rounded-full bg-white shadow transition-transform"
                      style={{ transform: item === "Dark mode" ? "translateX(16px)" : "translateX(0)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel footer */}
        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--card-border)" }}>
          <p className="text-xs text-gray-400 dark:text-slate-600 text-center">SpendWiseAI · Made for founders</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
