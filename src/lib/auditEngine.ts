import type { UseCase } from "./tools";

export type ToolEntry = {
  id: string;
  toolId: string;
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: UseCase;
};

export type ActionType = "downgrade" | "switch" | "keep" | "consolidate" | "api-switch";

export type Recommendation = {
  toolName: string;
  currentPlan: string;
  currentCost: number;
  seats: number;
  suggestedAction: ActionType;
  suggestedTool?: string;
  suggestedPlan?: string;
  newCost: number;
  saving: number;
  reason: string;
};

export type AuditSavingsTier = "optimal" | "low" | "medium" | "high";

export type AuditResult = {
  totalCurrentCost: number;
  totalNewCost: number;
  totalSaving: number;
  annualSaving: number;
  savingPercent: number;
  savingsTier: AuditSavingsTier; // NEW
  recommendations: Recommendation[];
  summary: string;
};

// ---------------------------------------------------------------------------
// Rule definitions per tool
// ---------------------------------------------------------------------------

type Rule = {
  match: (e: ToolEntry) => boolean;
  action: ActionType;
  suggestedTool?: (e: ToolEntry) => string;
  suggestedPlan?: (e: ToolEntry) => string;
  newCostPerSeat: (e: ToolEntry) => number;
  reason: (e: ToolEntry) => string;
};

const RULES: Rule[] = [
  // ── Cursor: Business with ≤3 seats → downgrade to Pro ──────────────────
  {
    match: (e) => e.toolId === "cursor" && e.plan === "Business" && e.seats <= 3,
    action: "downgrade",
    suggestedTool: () => "Cursor",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `Cursor Business ($40/seat) adds admin controls + SSO. With ${e.seats} seat${e.seats > 1 ? "s" : ""}, Pro ($20/seat) gives identical AI completions. Save $${(e.seats * 20)}/mo.`,
  },

  // ── Cursor: if team already uses Windsurf Pro (cheaper) → switch ────────
  {
    match: (e) => e.toolId === "cursor" && e.plan === "Pro" && e.seats >= 5,
    action: "switch",
    suggestedTool: () => "Windsurf",
    suggestedPlan: () => "Teams",
    newCostPerSeat: () => 30 / 1, // $30 flat per seat for Teams
    reason: () =>
      "Windsurf Teams ($30/seat) bundles similar AI coding features at slightly lower cost for teams ≥5. Evaluate a 2-week trial before switching.",
  },

  // ── Copilot: Business when coding use-case covered by Cursor Pro ─────────
  {
    match: (e) => e.toolId === "copilot" && e.plan === "Business" && e.useCase === "coding",
    action: "switch",
    suggestedTool: () => "Cursor",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `GitHub Copilot Business ($19/seat) vs Cursor Pro ($20/seat): Cursor provides a full IDE context window and agent mode. For ${e.seats} dev seat${e.seats > 1 ? "s" : ""} focused on coding, Cursor delivers more value at near-identical price.`,
  },

  // ── Copilot: Enterprise → Business unless >50 seats ─────────────────────
  {
    match: (e) => e.toolId === "copilot" && e.plan === "Enterprise" && e.seats < 50,
    action: "downgrade",
    suggestedTool: () => "GitHub Copilot",
    suggestedPlan: () => "Business",
    newCostPerSeat: () => 19,
    reason: () =>
      "Copilot Enterprise ($39/seat) adds policy compliance & fine-tuning. Under 50 seats, Business ($19/seat) covers all AI features. Save ~51% per seat.",
  },

  // ── Claude: Max → Pro if spend < $120/mo ────────────────────────────────
  {
    match: (e) => e.toolId === "claude" && e.plan === "Max" && e.monthlySpend <= 120,
    action: "downgrade",
    suggestedTool: () => "Claude (Anthropic)",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: () =>
      "Claude Max ($100/mo) is designed for power users needing 5× more usage. Pro ($20/mo) covers standard workloads. Only keep Max if you consistently hit Pro limits.",
  },

  // ── Claude: Team → Pro if ≤2 seats ──────────────────────────────────────
  {
    match: (e) => e.toolId === "claude" && e.plan === "Team" && e.seats <= 2,
    action: "downgrade",
    suggestedTool: () => "Claude (Anthropic)",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `Claude Team ($30/seat) starts making sense at 3+ seats for shared workspace. With ${e.seats} seat${e.seats > 1 ? "s" : ""}, two individual Pro plans ($20/each) cost the same or less.`,
  },

  // ── Claude API direct: high spend → suggest Credex discounted credits ───
  {
    match: (e) => e.toolId === "anthropic_api" && e.monthlySpend > 400,
    action: "api-switch",
    suggestedTool: () => "Anthropic API via Credex",
    suggestedPlan: () => "Discounted credits",
    newCostPerSeat: (e) => e.monthlySpend * 0.75,
    reason: (e) =>
      `You're spending $${e.monthlySpend}/mo on Anthropic API. Credex offers 20–30% volume discounts on API credits. At your spend level, that's ~$${Math.round(e.monthlySpend * 0.25)}/mo back.`,
  },

  // ── OpenAI API direct: high spend → suggest Credex ──────────────────────
  {
    match: (e) => e.toolId === "openai_api" && e.monthlySpend > 400,
    action: "api-switch",
    suggestedTool: () => "OpenAI API via Credex",
    suggestedPlan: () => "Discounted credits",
    newCostPerSeat: (e) => e.monthlySpend * 0.75,
    reason: (e) =>
      `$${e.monthlySpend}/mo on OpenAI API. Credex volume pricing cuts this by 20–30%. No code changes needed — same API, lower bill.`,
  },

  // ── ChatGPT: Team with ≤2 seats → Plus ──────────────────────────────────
  {
    match: (e) => e.toolId === "chatgpt" && e.plan === "Team" && e.seats <= 2,
    action: "downgrade",
    suggestedTool: () => "ChatGPT (OpenAI)",
    suggestedPlan: () => "Plus",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `ChatGPT Team ($30/seat, 2-seat minimum) vs two Plus plans ($20 each = $40 total). With ${e.seats} seat${e.seats > 1 ? "s" : ""}, two individual Plus subscriptions are equal or cheaper.`,
  },

  // ── ChatGPT: Plus AND Claude: Pro → consolidate to one ──────────────────
  // (Handled at the multi-tool level below — single-entry rule: flag it)
  {
    match: (e) => e.toolId === "chatgpt" && e.plan === "Plus" && e.useCase === "writing",
    action: "consolidate",
    suggestedTool: () => "Claude (Anthropic)",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: () =>
      "For writing tasks Claude Pro and ChatGPT Plus are functionally interchangeable. Consolidating to one saves $20/mo per seat with no productivity loss.",
  },

  // ── Gemini Advanced: overlap with ChatGPT Plus ───────────────────────────
  {
    match: (e) => e.toolId === "gemini" && e.plan !== "Free" && e.plan !== "API (Gemini API)",
    action: "consolidate",
    suggestedTool: () => "ChatGPT (OpenAI)",
    suggestedPlan: () => "Plus",
    newCostPerSeat: () => 0,
    reason: () =>
      "Gemini Advanced ($20/mo) overlaps heavily with ChatGPT Plus and Claude Pro. If you pay for any of the three, the others are largely redundant for general use.",
  },

  // ── Windsurf: Pro → Free for individual/hobby use ───────────────────────
  {
    match: (e) => e.toolId === "windsurf" && e.plan === "Pro" && e.seats === 1 && e.monthlySpend <= 15,
    action: "downgrade",
    suggestedTool: () => "Windsurf",
    suggestedPlan: () => "Free",
    newCostPerSeat: () => 0,
    reason: () =>
      "Windsurf Free tier is generous for solo developers. Unless you need priority model access, the free plan covers 95% of daily use.",
  },
];

// ---------------------------------------------------------------------------
// Cross-tool consolidation check (run after per-tool rules)
// ---------------------------------------------------------------------------

function detectOverlap(entries: ToolEntry[]): string[] {
  const notes: string[] = [];
  const hasGPT = entries.some((e) => e.toolId === "chatgpt" && e.plan !== "Free");
  const hasClaude = entries.some((e) => e.toolId === "claude" && e.plan !== "Free");
  const hasGemini = entries.some((e) => e.toolId === "gemini" && e.plan !== "Free" && e.plan !== "API (Gemini API)");
  const hasCursor = entries.some((e) => e.toolId === "cursor");
  const hasCopilot = entries.some((e) => e.toolId === "copilot");

  if (hasGPT && hasClaude && hasGemini)
    notes.push("You pay for ChatGPT, Claude AND Gemini — three general-purpose LLMs. Pick one as primary and cancel the rest.");
  else if (hasGPT && hasClaude)
    notes.push("ChatGPT Plus and Claude Pro overlap for most writing/coding tasks. Consider picking your primary and using the free tier of the other.");
  if (hasCursor && hasCopilot)
    notes.push("Cursor and GitHub Copilot both provide AI coding assistance. Running both on the same developer is redundant — evaluate which gives higher completion quality for your stack.");

  return notes;
}

// ---------------------------------------------------------------------------
// Summary templates (used when Anthropic API key not present)
// ---------------------------------------------------------------------------

const SUMMARY_TEMPLATES = [
  (saving: number, pct: number, topTool: string) =>
    `Your team is leaving $${saving}/mo on the table. The biggest opportunity is ${topTool} — a plan mismatch accounts for over half the recoverable savings. Right-sizing plans and eliminating overlap would cut AI spend by ${pct}% without reducing capability.`,
  (saving: number, pct: number, topTool: string) =>
    `At ${pct}% over-spend, ${topTool} stands out as the primary cost driver. You're paying for features your team size doesn't require. Trimming those plus eliminating subscription overlap returns $${saving}/mo — no productivity trade-off needed.`,
  (saving: number, pct: number) =>
    `Classic SaaS sprawl: overlapping tools, unused seats, wrong plan tiers. Consolidating your AI stack to match actual usage unlocks $${saving}/mo (${pct}% reduction). Start with the highest-saving recommendation for fastest ROI.`,
];

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function runAudit(tools: ToolEntry[]): AuditResult {
  const recommendations: Recommendation[] = tools.map((entry) => {
    const rule = RULES.find((r) => r.match(entry));
    const currentCost = entry.monthlySpend * entry.seats;

    if (!rule) {
      return {
        toolName: entry.toolName,
        currentPlan: entry.plan,
        currentCost,
        seats: entry.seats,
        suggestedAction: "keep",
        suggestedTool: entry.toolName,
        suggestedPlan: entry.plan,
        newCost: currentCost,
        saving: 0,
        reason: "Your current plan is well-matched to your team size and use case.",
      };
    }

    const newCostPerSeat = rule.newCostPerSeat(entry);
    const newCost = Math.round(newCostPerSeat * entry.seats);
    const saving = Math.max(0, currentCost - newCost);

    return {
      toolName: entry.toolName,
      currentPlan: entry.plan,
      currentCost,
      seats: entry.seats,
      suggestedAction: rule.action,
      suggestedTool: rule.suggestedTool?.(entry) ?? entry.toolName,
      suggestedPlan: rule.suggestedPlan?.(entry) ?? entry.plan,
      newCost,
      saving,
      reason: rule.reason(entry),
    };
  });

  // Overlap notes injected as zero-cost advisory recommendations
  const overlapNotes = detectOverlap(tools);
  overlapNotes.forEach((note) => {
    recommendations.push({
      toolName: "Cross-tool overlap",
      currentPlan: "",
      currentCost: 0,
      seats: 1,
      suggestedAction: "consolidate",
      newCost: 0,
      saving: 0,
      reason: note,
    });
  });

  const totalCurrentCost = tools.reduce((s, t) => s + t.monthlySpend * t.seats, 0);
  const totalNewCost = recommendations
    .filter((r) => r.toolName !== "Cross-tool overlap")
    .reduce((s, r) => s + r.newCost, 0);
  const totalSaving = Math.max(0, totalCurrentCost - totalNewCost);
  const annualSaving = totalSaving * 12;
  const savingPercent = totalCurrentCost > 0 ? Math.round((totalSaving / totalCurrentCost) * 100) : 0;

  // Savings tier — drives UI branching
  const savingsTier: AuditSavingsTier =
    totalSaving === 0 ? "optimal"
    : totalSaving < 100 ? "low"
    : totalSaving < 500 ? "medium"
    : "high";

  const topRec = [...recommendations].sort((a, b) => b.saving - a.saving)[0];
  const fn = SUMMARY_TEMPLATES[Math.floor(Math.random() * SUMMARY_TEMPLATES.length)];
  const summary = fn(totalSaving, savingPercent, topRec?.toolName ?? "your top tool");

  return {
    totalCurrentCost,
    totalNewCost,
    totalSaving,
    annualSaving,
    savingPercent,
    savingsTier,
    recommendations,
    summary,
  };
}
