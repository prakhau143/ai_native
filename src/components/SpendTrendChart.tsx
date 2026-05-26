"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { SpendTrendPoint } from "@/lib/auditEngine";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Props = {
  trend: SpendTrendPoint[];
  totalSaving: number;
};

export function SpendTrendChart({ trend, totalSaving }: Props) {
  // Guard: older audits may not have spendTrend — render a placeholder instead of crashing
  if (!trend || trend.length === 0) {
    return (
      <div
        className="rounded-2xl p-5 sm:p-6 h-full flex flex-col items-center justify-center"
        style={{
          background: "var(--card)",
          border: "1px solid var(--card-border)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          minHeight: "180px",
        }}
      >
        <p className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>
          Spend trend not available for this report
        </p>
      </div>
    );
  }

  const labels = trend.map((t) => t.month);
  const currentData = trend.map((t) => t.current);
  const optimizedData = trend.map((t) => t.optimized);

  const data = {
    labels,
    datasets: [
      {
        label: "Current Spend",
        data: currentData,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#f87171",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Optimised Spend",
        data: optimizedData,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#34d399",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        borderDash: [0, 0],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "var(--foreground)",
          font: { size: 12, family: "var(--font-geist-sans)" },
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "rgba(5,11,26,0.9)",
        borderColor: "rgba(6,182,212,0.3)",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        padding: 12,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) =>
            ` ${context.dataset.label}: $${(context.parsed.y ?? 0).toLocaleString()}/mo`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#64748b", font: { size: 11 } },
        border: { color: "rgba(255,255,255,0.06)" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (value: number | string) => `$${Number(value).toLocaleString()}`,
        },
        border: { color: "rgba(255,255,255,0.06)" },
      },
    },
    interaction: { mode: "index" as const, intersect: false },
  };

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 h-full flex flex-col"
      style={{
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
            Monthly Spend Trend
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            6-month projection with optimisation applied
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
        >
          Save ${totalSaving}/mo
        </div>
      </div>
      <div className="flex-1 min-h-[180px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
