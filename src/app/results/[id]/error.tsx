"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[results] page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050b1a" }}>
      <div className="text-center px-6">
        <p className="text-6xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
          We couldn&apos;t load this audit report. Try again or start a fresh audit.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}
          >
            New audit →
          </Link>
        </div>
      </div>
    </div>
  );
}
