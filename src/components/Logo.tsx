"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer">
      <div className="relative flex items-center justify-center">
        <div
          className="
            absolute inset-0
            rounded-full
            blur-2xl
            opacity-40
            group-hover:opacity-70
            transition-all
            duration-500
          "
          style={{
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
          }}
        />

        <svg
          width="48"
          height="48"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="
            logo-glow
            logo-float
            relative
            z-10
            h-10 w-10
            sm:h-12
            sm:w-12
            transition-transform
            duration-500
            group-hover:scale-105
          "
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="swGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          <circle
            cx="96"
            cy="18"
            r="6"
            fill={dark ? "#0f172a" : "#ffffff"}
            stroke="url(#swGradient)"
            strokeWidth="4"
          />

          <circle
            cx="20"
            cy="92"
            r="6"
            fill={dark ? "#0f172a" : "#ffffff"}
            stroke="url(#swGradient)"
            strokeWidth="4"
          />

          <path
            d="M90 18 C60 -2, 20 8, 20 44 L20 44 C20 54, 28 60, 38 60 L52 60"
            stroke="url(#swGradient)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            d="M68 60 L78 84 L92 44"
            stroke="url(#swGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M92 44 L92 70 C92 92, 74 104, 52 104 C34 104, 20 100, 20 92"
            stroke="url(#swGradient)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="leading-none">
        <div
          className="text-xl sm:text-2xl font-black tracking-tight"
          style={{ color: dark ? "#ffffff" : "#0f172a" }}
        >
          SpendWise{" "}
          <span className="gradient-text-logo">AI</span>
        </div>

        <div className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-[0.3em] sm:tracking-[0.35em] uppercase gradient-text-logo">
          Audit. Optimize. Save.
        </div>
      </div>
    </div>
  );
}
