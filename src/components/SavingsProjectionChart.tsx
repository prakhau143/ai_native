"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler
);

type Props = {
  monthlySaving: number;
  annualSaving: number;
};

export function SavingsProjectionChart({ monthlySaving, annualSaving }: Props) {
  const months = ["Month 1", "Month 3", "Month 6", "Month 9", "Month 12"];
  const cumulative = [1, 3, 6, 9, 12].map((m) => monthlySaving * m);

  const data = {
    labels: months,
    datasets: [
      {
        label: "Cumulative Savings",
        data: cumulative,
        backgroundColor: [
          "rgba(6,182,212,0.6)",
          "rgba(6,182,212,0.7)",
          "rgba(99,102,241,0.7)",
          "rgba(99,102,241,0.8)",
          "rgba(168,85,247,0.85)",
        ],
        borderColor: [
          "#06b6d4",
          "#06b6d4",
          "#6366f1",
          "#6366f1",
          "#a855f7",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
            ` Saved: $${(context.parsed.y ?? 0).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
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
  };

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
            Savings Projection
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            12-month cumulative savings forecast
          </p>
        </div>
        <div
          className="text-right"
        >
          <div className="text-lg font-black" style={{ color: "#a855f7" }}>
            ${annualSaving.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>
            annual total
          </div>
        </div>
      </div>
      <div className="h-44">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
