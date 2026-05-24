"use client";

import { useMemo } from "react";
import { CheckCircle2, XCircle, ArrowDownCircle, RefreshCw, TrendingDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { AuditResult, Recommendation } from "@/lib/auditEngine";

// ── Tool category metadata ─────────────────────────────────────────────────────
const TOOL_EMOJI: Record<string, string> = {
  cursor: "⚡", copilot: "🐙", windsurf: "🏄", tabnine: "💡", codeium: "🆓",
  replit: "🔄", amazon_q: "☁️",
  claude: "🧠", chatgpt: "🤖", gemini: "♊", grok: "⚡", meta_ai: "🔵",
  openai_api: "🔌", anthropic_api: "🔌", groq_api: "⚡", mistral_api: "🌪️",
  together_ai: "🤝", replicate: "🔁", cohere_api: "🔗",
  perplexity: "🔍", notion_ai: "📝", grammarly: "✅",
  jasper: "✍️", copy_ai: "📋", writesonic: "🖊️",
  midjourney: "🎨", dalle: "🖼️", stability_ai: "🌌", adobe_firefly: "🦋",
  runway: "🎬", heygen: "📹", synthesia: "🎭",
  elevenlabs: "🔊", murf_ai: "🎙️", otter_ai: "📝",
  zapier_ai: "⚙️",
};

const ACTION_CONFIG = {
  keep: {
    label: "KEEP",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.3)",
    Icon: CheckCircle2,
  },
  cancel: {
    label: "CANCEL",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.3)",
    Icon: XCircle,
  },
  downgrade: {
    label: "DOWNGRADE",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    Icon: ArrowDownCircle,
  },
  switch: {
    label: "SWITCH",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
    border: "rgba(129,140,248,0.3)",
    Icon: RefreshCw,
  },
} as const;

type ActionKey = keyof typeof ACTION_CONFIG;

interface StackItem {
  rec: Recommendation;
  action: ActionKey;
  emoji: string;
  monthlyCost: number;
  optimisedCost: number;
}

function resolveAction(rec: Recommendation): ActionKey {
  const a = rec.suggestedAction?.toLowerCase() ?? "";
  if (a.includes("cancel") || a.includes("remove") || a.includes("eliminat")) return "cancel";
  if (a.includes("downgrad") || a.includes("lower") || a.includes("free") || a.includes("cheaper")) return "downgrade";
  if (a.includes("switch") || a.includes("replace") || a.includes("migrat")) return "switch";
  return "keep";
}

// Best single replacement for a cancelled/switched tool by category guess
const SMART_ALTERNATIVES: Record<string, string> = {
  copilot: "Cursor (Pro) — full agent mode + chat, $20/seat",
  jasper: "Claude Pro — better quality writing at $20/mo",
  grammarly: "Claude (free tier) — handles grammar + rewrites at zero cost",
  copy_ai: "ChatGPT Plus — native workflows + plugins at same price",
  writesonic: "Claude Pro — better SEO drafts, no per-word limits",
  heygen: "HeyGen Basic (free) or Runway for $15/mo",
  synthesia: "HeyGen Creator — similar avatars at 67% less cost",
  gemini: "Claude Pro — equal capability, better long-context",
  notion_ai: "Claude (free) — shareable via API, no per-seat add-on",
  amazon_q: "Cursor Pro — better DX, not locked to AWS",
  replit: "Cursor (free tier) — local editor, no cloud runtime charges",
};

const glassCard: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--card-border)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

export function StackAdvisor({ result }: { result: AuditResult }) {
  const items = useMemo<StackItem[]>(() => {
    return (result.recommendations ?? []).map((rec) => {
      const action = rec.saving > 0 ? resolveAction(rec) : "keep";
      const monthlyCost = rec.currentCost ?? 0;
      const optimisedCost = Math.max(0, monthlyCost - rec.saving);
      const emoji = TOOL_EMOJI[rec.toolId ?? ""] ?? "🔧";
      return { rec, action, emoji, monthlyCost, optimisedCost };
    });
  }, [result.recommendations]);

  const keptItems = items.filter((i) => i.action === "keep");
  const changeItems = items.filter((i) => i.action !== "keep");
  const totalCurrentCost = result.totalCurrentCost ?? 0;
  const totalNewCost = result.totalNewCost ?? totalCurrentCost;
  const annualSaving = (totalCurrentCost - totalNewCost) * 12;

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-6 sm:p-8"
      style={glassCard}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5" style={{ color: "#c084fc" }} />
            <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              AI Stack Advisor
            </h2>
          </div>
          <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            Optimal configuration based on your spend profile
          </p>
        </div>

        {/* Savings badge */}
        {annualSaving > 0 && (
          <div
            className="shrink-0 rounded-2xl px-4 py-2 text-center"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
          >
            <p className="text-xs font-medium" style={{ color: "#34d399", opacity: 0.7 }}>
              Annual saving
            </p>
            <p className="text-xl font-extrabold" style={{ color: "#34d399" }}>
              ${annualSaving.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Cost comparison bar */}
      <div className="mb-6 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            Current monthly spend
          </span>
          <span className="text-sm font-bold" style={{ color: "#f87171" }}>
            ${totalCurrentCost.toLocaleString()}/mo
          </span>
        </div>
        <div className="h-2 w-full rounded-full mb-3" style={{ background: "rgba(248,113,113,0.2)" }}>
          <div className="h-2 rounded-full" style={{ width: "100%", background: "linear-gradient(90deg, #f87171, #fb923c)" }} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            Recommended spend
          </span>
          <span className="text-sm font-bold" style={{ color: "#34d399" }}>
            ${totalNewCost.toLocaleString()}/mo
          </span>
        </div>
        <div className="h-2 w-full rounded-full" style={{ background: "rgba(52,211,153,0.12)" }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: totalCurrentCost > 0 ? `${Math.round((totalNewCost / totalCurrentCost) * 100)}%` : "0%",
              background: "linear-gradient(90deg, #34d399, #10b981)",
            }}
          />
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: "#34d399", opacity: 0.8 }}>
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {result.savingPercent}% reduction — from ${totalCurrentCost}/mo to ${totalNewCost}/mo
        </p>
      </div>

      {/* Tool cards */}
      <div className="space-y-3">
        {/* Changed tools first */}
        {changeItems.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--foreground)", opacity: 0.35 }}>
              Action required
            </p>
            {changeItems.map((item, i) => (
              <ToolActionCard key={item.rec.toolId ?? i} item={item} />
            ))}
          </>
        )}

        {/* Kept tools */}
        {keptItems.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mt-4 mb-2" style={{ color: "var(--foreground)", opacity: 0.35 }}>
              Keep as-is
            </p>
            {keptItems.map((item, i) => (
              <ToolActionCard key={item.rec.toolId ?? i} item={item} />
            ))}
          </>
        )}
      </div>

      {/* Smart alternative callouts */}
      {changeItems.some((i) => i.action === "cancel" || i.action === "switch") && (
        <div className="mt-6 rounded-2xl p-4" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "#818cf8" }}>
            💡 Suggested replacements
          </p>
          <div className="space-y-2">
            {changeItems
              .filter((i) => (i.action === "cancel" || i.action === "switch") && SMART_ALTERNATIVES[i.rec.toolId ?? ""])
              .map((item) => (
                <div key={item.rec.toolId} className="flex gap-2 text-xs" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  <span>{item.emoji}</span>
                  <span>
                    <span className="font-semibold">{item.rec.toolName}</span>
                    {" → "}
                    {SMART_ALTERNATIVES[item.rec.toolId ?? ""]}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ToolActionCard({ item }: { item: StackItem }) {
  const cfg = ACTION_CONFIG[item.action];
  const { Icon } = cfg;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {/* Emoji */}
      <span className="text-lg shrink-0">{item.emoji}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
          {item.rec.toolName}
        </p>
        {item.rec.suggestedAction && (
          <p className="text-xs truncate" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            {item.rec.suggestedAction}
          </p>
        )}
      </div>

      {/* Cost */}
      <div className="text-right shrink-0">
        {item.action !== "keep" && item.rec.saving > 0 ? (
          <>
            <p className="text-xs line-through" style={{ color: "var(--foreground)", opacity: 0.4 }}>
              ${item.monthlyCost}/mo
            </p>
            <p className="text-sm font-bold" style={{ color: "#34d399" }}>
              ${item.optimisedCost}/mo
            </p>
          </>
        ) : (
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)", opacity: 0.7 }}>
            ${item.monthlyCost}/mo
          </p>
        )}
      </div>

      {/* Badge */}
      <div
        className="flex items-center gap-1 rounded-full px-2 py-0.5 shrink-0"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        <Icon className="h-3 w-3" style={{ color: cfg.color }} />
        <span className="text-xs font-bold" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
      </div>
    </motion.div>
  );
}
