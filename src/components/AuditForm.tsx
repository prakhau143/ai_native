"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, Loader2, Sparkles, Users, DollarSign } from "lucide-react";
import type { ToolEntry } from "@/lib/auditEngine";
import type { UseCase } from "@/lib/tools";
import { TOOLS } from "@/lib/tools";

// Re-export so pages that already import from here still work
export type { ToolEntry };

type AuditFormProps = {
  onSubmit: (tools: ToolEntry[]) => void;
  isLoading: boolean;
};

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding / Dev" },
  { value: "writing", label: "Writing / Content" },
  { value: "research", label: "Research" },
  { value: "image", label: "Image gen" },
  { value: "voice", label: "Voice / Audio" },
  { value: "general", label: "General" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function defaultEntry(): ToolEntry {
  const tool = TOOLS[0];
  return {
    id: uid(),
    toolId: tool.id,
    toolName: tool.name,
    plan: tool.plans[1]?.name ?? tool.plans[0].name,
    monthlySpend: typeof tool.plans[1]?.price === "number" ? tool.plans[1].price : 20,
    seats: 1,
    useCase: "general",
  };
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [tools, setTools] = useState<ToolEntry[]>([defaultEntry()]);

  const addTool = () => setTools((prev) => [...prev, defaultEntry()]);
  const removeTool = (id: string) => setTools((prev) => prev.filter((t) => t.id !== id));

  const updateEntry = (id: string, patch: Partial<ToolEntry>) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (patch.toolId) {
          const def = TOOLS.find((x) => x.id === patch.toolId)!;
          const defaultPlan = def.plans[1] ?? def.plans[0];
          return {
            ...t,
            toolId: def.id,
            toolName: def.name,
            plan: defaultPlan.name,
            monthlySpend: typeof defaultPlan.price === "number" ? defaultPlan.price : t.monthlySpend,
          };
        }
        return { ...t, ...patch };
      })
    );
  };

  const totalMonthly = tools.reduce((s, t) => s + t.monthlySpend * t.seats, 0);

  const selectedPlans = (toolId: string) =>
    TOOLS.find((t) => t.id === toolId)?.plans ?? [];

  return (
    <section id="audit" className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-purple-300 mb-4"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <Sparkles className="h-3 w-3" />
            Step 1 — Tell us your stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            What are you paying for?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Add every AI subscription your team uses. Be honest — we&apos;ll show you where the money is leaking.
          </p>
        </div>

        {/* Tool rows */}
        <div className="space-y-3 mb-4">
          {tools.map((entry, idx) => (
            <div key={entry.id} className="glass-card rounded-2xl p-4 sm:p-5 animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tool #{idx + 1}</span>
                {tools.length > 1 && (
                  <button onClick={() => removeTool(entry.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                {/* Tool */}
                <div className="lg:col-span-1">
                  <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">AI Tool</label>
                  <div className="relative">
                    <select value={entry.toolId}
                      onChange={(e) => updateEntry(entry.id, { toolId: e.target.value })}
                      className="futuristic-input w-full rounded-xl px-3 py-2.5 pr-8 text-sm appearance-none cursor-pointer">
                      {TOOLS.map((t) => (
                        <option key={t.id} value={t.id} style={{ background: "#0d1526" }}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                {/* Plan */}
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">Plan</label>
                  <div className="relative">
                    <select value={entry.plan}
                      onChange={(e) => updateEntry(entry.id, { plan: e.target.value })}
                      className="futuristic-input w-full rounded-xl px-3 py-2.5 pr-8 text-sm appearance-none cursor-pointer">
                      {selectedPlans(entry.toolId).map((p) => (
                        <option key={p.name} value={p.name} style={{ background: "#0d1526" }}>
                          {p.name}{typeof p.price === "number" && p.price > 0 ? ` ($${p.price}/mo)` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                {/* Use case */}
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">Use case</label>
                  <div className="relative">
                    <select value={entry.useCase}
                      onChange={(e) => updateEntry(entry.id, { useCase: e.target.value as UseCase })}
                      className="futuristic-input w-full rounded-xl px-3 py-2.5 pr-8 text-sm appearance-none cursor-pointer">
                      {USE_CASES.map((u) => (
                        <option key={u.value} value={u.value} style={{ background: "#0d1526" }}>{u.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  </div>
                </div>

                {/* Monthly spend */}
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />Per seat $</span>
                  </label>
                  <input type="number" min={0} value={entry.monthlySpend}
                    onChange={(e) => updateEntry(entry.id, { monthlySpend: Math.max(0, Number(e.target.value)) })}
                    className="futuristic-input w-full rounded-xl px-3 py-2.5 text-sm" placeholder="0" />
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wide">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />Seats</span>
                  </label>
                  <input type="number" min={1} value={entry.seats}
                    onChange={(e) => updateEntry(entry.id, { seats: Math.max(1, Number(e.target.value)) })}
                    className="futuristic-input w-full rounded-xl px-3 py-2.5 text-sm" placeholder="1" />
                </div>
              </div>

              {/* Line total */}
              <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xs text-slate-500">
                  Subtotal: <span className="text-cyan-300 font-semibold">${(entry.monthlySpend * entry.seats).toLocaleString()}/mo</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add tool */}
        <button onClick={addTool}
          className="mb-8 w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-slate-400 hover:text-cyan-300 transition-all duration-200"
          style={{ border: "1px dashed rgba(255,255,255,0.15)" }}>
          <Plus className="h-4 w-4" /> Add another tool
        </button>

        {/* Total + submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl p-5"
          style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}>
          <div>
            <p className="text-sm text-slate-500 mb-0.5">Current monthly spend</p>
            <p className="text-3xl font-extrabold"
              style={{ background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ${totalMonthly.toLocaleString()}<span className="text-base font-normal text-slate-500">/mo</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">${(totalMonthly * 12).toLocaleString()} / year</p>
          </div>
          <button onClick={() => tools.length > 0 && onSubmit(tools)}
            disabled={isLoading || tools.length === 0}
            className="flex items-center gap-2.5 rounded-xl px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}>
            {isLoading
              ? <><Loader2 className="h-5 w-5 animate-spin" />Analysing...</>
              : <><Sparkles className="h-5 w-5" />Run Audit</>}
          </button>
        </div>
      </div>
    </section>
  );
}
