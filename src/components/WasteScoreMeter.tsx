"use client";

import { useEffect, useState } from "react";

type Props = {
  score: number; // 0-100
  savingPercent: number;
};

function getScoreConfig(score: number) {
  if (score <= 20) return { label: "Efficient", color: "#34d399", bg: "rgba(52,211,153,0.12)", glow: "rgba(52,211,153,0.4)" };
  if (score <= 45) return { label: "Moderate Waste", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", glow: "rgba(245,158,11,0.4)" };
  if (score <= 70) return { label: "High Waste", color: "#f97316", bg: "rgba(249,115,22,0.12)", glow: "rgba(249,115,22,0.4)" };
  return { label: "Critical Waste", color: "#f87171", bg: "rgba(248,113,113,0.12)", glow: "rgba(248,113,113,0.5)" };
}

export function WasteScoreMeter({ score, savingPercent }: Props) {
  const [animated, setAnimated] = useState(0);
  const config = getScoreConfig(score);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1400;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  // SVG circular gauge
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animated / 100) * circumference;
  const rotation = -90; // start from top

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 flex flex-col items-center h-full"
      style={{
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <h3 className="font-bold text-sm mb-1" style={{ color: "var(--foreground)" }}>
        AI Waste Score
      </h3>
      <p className="text-xs mb-5" style={{ color: "var(--foreground)", opacity: 0.5 }}>
        Lower is better
      </p>

      {/* Circular gauge */}
      <div className="relative mb-4">
        <svg width={130} height={130} viewBox="0 0 130 130">
          {/* Background track */}
          <circle
            cx={65}
            cy={65}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={10}
          />
          {/* Progress arc */}
          <circle
            cx={65}
            cy={65}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(${rotation} 65 65)`}
            style={{
              transition: "stroke-dashoffset 0.1s linear",
              filter: `drop-shadow(0 0 6px ${config.glow})`,
            }}
          />
          {/* Center text */}
          <text
            x={65}
            y={60}
            textAnchor="middle"
            fill={config.color}
            fontSize={26}
            fontWeight="900"
            fontFamily="var(--font-geist-sans)"
          >
            {animated}
          </text>
          <text
            x={65}
            y={78}
            textAnchor="middle"
            fill="#64748b"
            fontSize={10}
            fontFamily="var(--font-geist-sans)"
          >
            / 100
          </text>
        </svg>

        {/* Glow behind circle */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${config.glow} 0%, transparent 70%)`,
            opacity: 0.3,
          }}
        />
      </div>

      {/* Status badge */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-bold mb-3"
        style={{ background: config.bg, color: config.color, border: `1px solid ${config.color}30` }}
      >
        {config.label}
      </div>

      {/* Mini stats */}
      <div className="w-full space-y-2 mt-1">
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--foreground)", opacity: 0.5 }}>Overspend</span>
          <span style={{ color: config.color, fontWeight: 700 }}>{savingPercent}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${savingPercent}%`,
              background: `linear-gradient(90deg, ${config.color}, ${config.glow})`,
            }}
          />
        </div>
        <p className="text-xs text-center pt-1" style={{ color: "var(--foreground)", opacity: 0.4 }}>
          {score <= 20
            ? "Your stack is well-optimised 🎉"
            : score <= 45
            ? "Some quick wins available"
            : score <= 70
            ? "Significant savings possible"
            : "Immediate action recommended"}
        </p>
      </div>
    </div>
  );
}
