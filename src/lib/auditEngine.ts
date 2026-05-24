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

export type ActionType = "downgrade" | "switch" | "keep" | "consolidate" | "api-switch" | "cancel";

export type Recommendation = {
  toolId?: string;
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
  priority: "critical" | "high" | "medium" | "low";
  confidenceScore: number; // 0-100
  implementationTime: string; // e.g. "5 min", "1 day"
  tips?: string[]; // additional optimization tips
};

export type AuditSavingsTier = "optimal" | "low" | "medium" | "high";

export type SpendTrendPoint = {
  month: string;
  current: number;
  optimized: number;
};

// ── New intelligence types ───────────────────────────────────────────────────

/** One row in the benchmark table shown to the user */
export type BenchmarkRow = {
  metric: string;
  yourValue: string;
  avgValue: string;
  status: "good" | "ok" | "bad";
};

/** Vendor share of total AI spend */
export type VendorShare = {
  vendor: string;
  spend: number;
  percentage: number;
  color: string;
};

/**
 * Predictive spend timeline — 12 data points:
 * months[-5…0] = simulated historical, months[1…6] = forecast
 */
export type PredictivePoint = {
  month: string;
  actual?: number;    // historical value (shown as solid line)
  forecast?: number;  // projected value (shown as dashed line)
};

export type AuditResult = {
  totalCurrentCost: number;
  totalNewCost: number;
  totalSaving: number;
  annualSaving: number;
  savingPercent: number;
  savingsTier: AuditSavingsTier;
  wasteScore: number;          // 0-100  higher = more waste
  efficiencyScore: number;     // 0-100  higher = more efficient
  stackMaturityScore: number;  // 0-100  higher = more optimised stack
  recommendations: Recommendation[];
  summary: string;
  spendTrend: SpendTrendPoint[];
  categoryBreakdown: { category: string; spend: number; color: string }[];
  topWastedTools: { name: string; wastedAmount: number }[];
  // ── FinOps intelligence ──────────────────────────────────────────────────
  vendorConcentration: VendorShare[];
  predictiveTrend: PredictivePoint[];
  benchmarkData: BenchmarkRow[];
};

// ---------------------------------------------------------------------------
// Rule definitions per tool
// ---------------------------------------------------------------------------

type Rule = {
  match: (e: ToolEntry) => boolean;
  action: ActionType;
  priority: "critical" | "high" | "medium" | "low";
  confidence: number; // 0-100
  implementationTime: string;
  suggestedTool?: (e: ToolEntry) => string;
  suggestedPlan?: (e: ToolEntry) => string;
  newCostPerSeat: (e: ToolEntry) => number;
  reason: (e: ToolEntry) => string;
  tips?: (e: ToolEntry) => string[];
};

const RULES: Rule[] = [
  // ── Cursor: Business with ≤3 seats → downgrade to Pro ──────────────────
  {
    match: (e) => e.toolId === "cursor" && e.plan === "Business" && e.seats <= 3,
    action: "downgrade",
    priority: "high",
    confidence: 92,
    implementationTime: "5 min",
    suggestedTool: () => "Cursor",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `Cursor Business ($40/seat) adds admin controls + SSO. With ${e.seats} seat${e.seats > 1 ? "s" : ""}, Pro ($20/seat) gives identical AI completions. Save $${e.seats * 20}/mo.`,
    tips: () => [
      "Export your settings before downgrading",
      "Pro plan includes all AI features except SSO/policy controls",
      "Re-evaluate at 10+ seats when Business tier pays off",
    ],
  },

  // ── Cursor: switch to Windsurf for large teams ────────────────────────
  {
    match: (e) => e.toolId === "cursor" && e.plan === "Pro" && e.seats >= 5,
    action: "switch",
    priority: "medium",
    confidence: 68,
    implementationTime: "2 days",
    suggestedTool: () => "Windsurf",
    suggestedPlan: () => "Teams",
    newCostPerSeat: () => 30,
    reason: () =>
      "Windsurf Teams ($30/seat) offers comparable AI coding with a more generous context window for large teams. Run a 2-week parallel trial.",
    tips: () => [
      "Run both tools simultaneously for 2 weeks before fully switching",
      "Check your most-used IDE integrations compatibility",
      "Windsurf has better multi-file context for large codebases",
    ],
  },

  // ── Copilot: Business when Cursor already in use ──────────────────────
  {
    match: (e) => e.toolId === "copilot" && e.plan === "Business" && e.useCase === "coding",
    action: "switch",
    priority: "high",
    confidence: 85,
    implementationTime: "1 day",
    suggestedTool: () => "Cursor",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `GitHub Copilot Business ($19/seat) vs Cursor Pro ($20/seat): Cursor provides full IDE context + agent mode. For ${e.seats} dev seat${e.seats > 1 ? "s" : ""}, Cursor delivers higher ROI.`,
    tips: () => [
      "Cursor includes GPT-4 and Claude for completions — no need for separate subscriptions",
      "Copilot may still be worth keeping if you use GitHub Enterprise features heavily",
      "Most teams switching from Copilot to Cursor report 40% faster code generation",
    ],
  },

  // ── Copilot: Individual ($10) → consider Codeium free ─────────────────
  {
    match: (e) => e.toolId === "copilot" && e.plan === "Individual" && e.seats === 1,
    action: "switch",
    priority: "medium",
    confidence: 72,
    implementationTime: "30 min",
    suggestedTool: () => "Codeium",
    suggestedPlan: () => "Individual",
    newCostPerSeat: () => 0,
    reason: () =>
      "Codeium's Individual plan is free and covers basic autocomplete for solo developers. If Copilot's advanced features aren't critical, switching saves $10/mo immediately.",
    tips: () => [
      "Codeium has extensions for VS Code, JetBrains, Vim, and Emacs",
      "Copilot's advantage is GitHub PR summarization and chat — evaluate if you use these",
      "Consider keeping Copilot only if you review 20+ PRs/month",
    ],
  },

  // ── Copilot: Enterprise → Business unless >50 seats ─────────────────────
  {
    match: (e) => e.toolId === "copilot" && e.plan === "Enterprise" && e.seats < 50,
    action: "downgrade",
    priority: "high",
    confidence: 88,
    implementationTime: "1 day",
    suggestedTool: () => "GitHub Copilot",
    suggestedPlan: () => "Business",
    newCostPerSeat: () => 19,
    reason: () =>
      "Copilot Enterprise ($39/seat) adds policy compliance & fine-tuning. Under 50 seats, Business ($19/seat) covers all AI features. Save ~51% per seat.",
    tips: () => [
      "Enterprise features: code review in PRs, knowledge bases, fine-tuning",
      "Most SMBs never use fine-tuning features — validate before deciding",
      "Save the difference and invest in AI training for your team",
    ],
  },

  // ── Claude: Max → Pro if spend < $120/mo ────────────────────────────────
  {
    match: (e) => e.toolId === "claude" && e.plan === "Max" && e.monthlySpend <= 120,
    action: "downgrade",
    priority: "critical",
    confidence: 95,
    implementationTime: "2 min",
    suggestedTool: () => "Claude (Anthropic)",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: () =>
      "Claude Max ($100/mo) gives 5× more usage for heavy power users. If you're spending ≤$120/mo total, you're not hitting Pro limits. Pro ($20/mo) covers 95% of users.",
    tips: () => [
      "Monitor your usage in Claude settings → Usage before downgrading",
      "Claude Pro gives ~40-50 messages per 8 hours with Opus",
      "Downgrade and upgrade again anytime if you hit limits",
    ],
  },

  // ── Claude: Team → Pro if ≤2 seats ──────────────────────────────────────
  {
    match: (e) => e.toolId === "claude" && e.plan === "Team" && e.seats <= 2,
    action: "downgrade",
    priority: "high",
    confidence: 90,
    implementationTime: "5 min",
    suggestedTool: () => "Claude (Anthropic)",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `Claude Team ($30/seat) makes sense at 3+ seats for shared Projects workspace. With ${e.seats} seat${e.seats > 1 ? "s" : ""}, two individual Pro plans ($20 each) cost the same or less.`,
    tips: () => [
      "Individual Pro plans maintain separate conversation histories",
      "Team plan worth it if you use shared Projects heavily (3+ users)",
      "API access is the same cost regardless of subscription tier",
    ],
  },

  // ── Anthropic API: high spend → suggest Groq for non-critical tasks ──────
  {
    match: (e) => e.toolId === "anthropic_api" && e.monthlySpend > 200,
    action: "api-switch",
    priority: "high",
    confidence: 82,
    implementationTime: "3 days",
    suggestedTool: () => "Groq API (+ Anthropic fallback)",
    suggestedPlan: () => "Hybrid routing",
    newCostPerSeat: (e) => e.monthlySpend * 0.65,
    reason: (e) =>
      `You're spending $${e.monthlySpend}/mo on Anthropic API. Route non-critical tasks to Groq (near-free) and reserve Claude for complex reasoning. Typical saving: 30-40%.`,
    tips: () => [
      "Use LLM router like LiteLLM to auto-route by task complexity",
      "Groq's Llama-3.3-70b is excellent for summarization, extraction, classification",
      "Keep Claude Opus/Sonnet for complex reasoning and code generation",
      "Credex also offers 20-30% volume discounts on Anthropic credits",
    ],
  },

  // ── Anthropic API: very high spend → Credex discounted credits ───────────
  {
    match: (e) => e.toolId === "anthropic_api" && e.monthlySpend > 400,
    action: "api-switch",
    priority: "critical",
    confidence: 90,
    implementationTime: "1 day",
    suggestedTool: () => "Anthropic API via Credex",
    suggestedPlan: () => "Discounted credits",
    newCostPerSeat: (e) => e.monthlySpend * 0.72,
    reason: (e) =>
      `$${e.monthlySpend}/mo on Anthropic API qualifies for Credex volume discounts (20-28%). That's $${Math.round(e.monthlySpend * 0.28)}/mo back with zero code changes.`,
    tips: () => [
      "Same API endpoint — only billing changes through Credex",
      "Volume discount increases with spend (up to 30% at $1k+/mo)",
      "Pair with Groq routing for compounding savings",
    ],
  },

  // ── OpenAI API: high spend → Groq/Mistral routing ────────────────────────
  {
    match: (e) => e.toolId === "openai_api" && e.monthlySpend > 200,
    action: "api-switch",
    priority: "high",
    confidence: 80,
    implementationTime: "2 days",
    suggestedTool: () => "OpenAI API (+ Groq routing)",
    suggestedPlan: () => "Hybrid routing",
    newCostPerSeat: (e) => e.monthlySpend * 0.6,
    reason: (e) =>
      `$${e.monthlySpend}/mo on OpenAI API. Route simple tasks to Groq or Mistral (up to 100× cheaper per token). Save 35-50% with a smart routing layer.`,
    tips: () => [
      "GPT-4o mini vs GPT-4o: 15× cost difference for similar quality on simple tasks",
      "Use OpenAI's model selector to benchmark GPT-4o mini first",
      "Mistral 7B handles summarization at $0.25/1M tokens vs GPT-4o $5/1M",
    ],
  },

  // ── OpenAI API: very high spend → Credex ─────────────────────────────────
  {
    match: (e) => e.toolId === "openai_api" && e.monthlySpend > 400,
    action: "api-switch",
    priority: "critical",
    confidence: 90,
    implementationTime: "1 day",
    suggestedTool: () => "OpenAI API via Credex",
    suggestedPlan: () => "Discounted credits",
    newCostPerSeat: (e) => e.monthlySpend * 0.75,
    reason: (e) =>
      `$${e.monthlySpend}/mo on OpenAI API. Credex volume pricing cuts this by 20-30%. No code changes needed — same API, lower bill.`,
    tips: () => [
      "Credex negotiates bulk API credits at discounted rates",
      "Contact Credex with your current invoice for fastest pricing",
      "Stack with model downgrading for maximum savings",
    ],
  },

  // ── ChatGPT: Team with ≤2 seats → Plus ──────────────────────────────────
  {
    match: (e) => e.toolId === "chatgpt" && e.plan === "Team" && e.seats <= 2,
    action: "downgrade",
    priority: "high",
    confidence: 93,
    implementationTime: "5 min",
    suggestedTool: () => "ChatGPT (OpenAI)",
    suggestedPlan: () => "Plus",
    newCostPerSeat: () => 20,
    reason: (e) =>
      `ChatGPT Team ($30/seat, 2-seat minimum = $60) vs two Plus plans ($20 × ${e.seats} = $${e.seats * 20}). With ${e.seats} seat${e.seats > 1 ? "s" : ""}, individual Plus subscriptions cost less.`,
    tips: () => [
      "Team plan benefits: shared custom instructions, usage analytics, no data training",
      "If you don't need team admin controls, Plus is identical in AI capability",
      "Can always upgrade back to Team when you add a 3rd user",
    ],
  },

  // ── ChatGPT Plus for writing when Claude Pro available ──────────────────
  {
    match: (e) => e.toolId === "chatgpt" && e.plan === "Plus" && e.useCase === "writing",
    action: "consolidate",
    priority: "medium",
    confidence: 75,
    implementationTime: "Immediate",
    suggestedTool: () => "Claude (Anthropic)",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: () =>
      "For writing tasks, Claude Pro and ChatGPT Plus are functionally interchangeable. Consolidating to one saves $20/mo per seat with no productivity loss.",
    tips: () => [
      "Claude tends to score higher on long-form writing benchmarks",
      "ChatGPT has better plugin/tool integration if you use GPTs",
      "Try Claude for 2 weeks on your typical writing tasks before cancelling ChatGPT",
    ],
  },

  // ── Gemini Advanced overlaps with other LLMs ─────────────────────────────
  {
    match: (e) => e.toolId === "gemini" && e.plan !== "Free" && e.plan !== "API (Gemini API)",
    action: "consolidate",
    priority: "medium",
    confidence: 78,
    implementationTime: "Immediate",
    suggestedTool: () => "ChatGPT (OpenAI) or Claude",
    suggestedPlan: () => "Plus / Pro",
    newCostPerSeat: () => 0,
    reason: () =>
      "Gemini Advanced ($20/mo) overlaps 80%+ with ChatGPT Plus and Claude Pro. If you pay for any of the three, the others are largely redundant for general use.",
    tips: () => [
      "Gemini unique value: Google Workspace deep integration (Docs, Gmail, Meet)",
      "Keep Gemini only if you're in Google Workspace and use AI in Docs/Sheets",
      "Otherwise, consolidate to ChatGPT or Claude as your primary",
    ],
  },

  // ── Perplexity: Pro often replaceable with ChatGPT browsing ─────────────
  {
    match: (e) => e.toolId === "perplexity" && e.plan === "Pro",
    action: "consolidate",
    priority: "low",
    confidence: 65,
    implementationTime: "Immediate",
    suggestedTool: () => "ChatGPT Plus (with browsing)",
    suggestedPlan: () => "Plus",
    newCostPerSeat: () => 0,
    reason: () =>
      "Perplexity Pro ($20/mo) specializes in cited search. ChatGPT Plus includes web browsing and can often cover the same research workflows. Evaluate overlap before renewing.",
    tips: () => [
      "Perplexity excels at rapid fact-finding with source citations",
      "Keep Perplexity if >50% of your use case is research-heavy",
      "ChatGPT browsing is better for interactive follow-up questions",
    ],
  },

  // ── Notion AI: add-on when Grammarly already paid ────────────────────────
  {
    match: (e) => e.toolId === "notion_ai" && e.plan !== "Free (limited)",
    action: "consolidate",
    priority: "medium",
    confidence: 70,
    implementationTime: "Immediate",
    suggestedTool: () => "Notion AI (Free tier)",
    suggestedPlan: () => "Free (limited)",
    newCostPerSeat: () => 0,
    reason: (e) =>
      `Notion AI add-on ($${e.monthlySpend * e.seats}/mo) for basic writing assistance overlaps with Claude/ChatGPT. Use those for heavy lifting; Notion AI free tier covers in-doc edits.`,
    tips: () => [
      "Notion AI free tier: summarize, fix grammar, generate outlines",
      "For complex writing, paste into Claude/ChatGPT — it's more capable",
      "Re-enable paid Notion AI if you have 5+ users relying on it daily",
    ],
  },

  // ── Grammarly Premium when AI writing tools already in stack ─────────────
  {
    match: (e) => e.toolId === "grammarly" && e.plan === "Premium",
    action: "consolidate",
    priority: "low",
    confidence: 60,
    implementationTime: "Immediate",
    suggestedTool: () => "Claude / ChatGPT",
    suggestedPlan: () => "Free (for grammar checks)",
    newCostPerSeat: () => 0,
    reason: () =>
      "Grammarly Premium ($30/mo) for grammar/style checking overlaps with Claude and ChatGPT, which do this for free as part of their plans. Consider cancelling Grammarly Premium.",
    tips: () => [
      "Grammarly's browser extension free tier catches most grammar errors",
      "Claude excels at tone improvement and style rewriting",
      "Keep Grammarly Premium only if you need plagiarism detection",
    ],
  },

  // ── Jasper: expensive for what AI assistants cover ───────────────────────
  {
    match: (e) => e.toolId === "jasper" && e.plan === "Creator",
    action: "switch",
    priority: "high",
    confidence: 82,
    implementationTime: "1 week",
    suggestedTool: () => "Claude Pro + custom templates",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 20,
    reason: () =>
      "Jasper Creator ($49/mo) is a writing workflow layer built on top of OpenAI/Anthropic. Claude Pro ($20/mo) or ChatGPT Plus + custom prompts replicate 90% of Jasper's templates at 60% less cost.",
    tips: () => [
      "Save your best Jasper templates as Claude/ChatGPT custom instructions",
      "Jasper Brand Voice → Claude's custom system prompts can replicate this",
      "Jasper's ROI case: justify it only if it saves >1 hour/week per user",
    ],
  },

  // ── Midjourney: Basic → might overlap with DALL-E via ChatGPT Plus ───────
  {
    match: (e) => e.toolId === "midjourney" && e.plan === "Basic",
    action: "consolidate",
    priority: "low",
    confidence: 58,
    implementationTime: "Immediate",
    suggestedTool: () => "DALL-E 3 (via ChatGPT Plus)",
    suggestedPlan: () => "Included in ChatGPT Plus",
    newCostPerSeat: () => 0,
    reason: () =>
      "Midjourney Basic ($10/mo) gives 200 images/month. ChatGPT Plus includes DALL-E 3 access. If image quality isn't critical, consolidating saves $10/mo.",
    tips: () => [
      "Midjourney still produces the highest quality artistic images",
      "DALL-E 3 is better for realistic product images and text-in-image",
      "Keep Midjourney if image generation is central to your workflow",
    ],
  },

  // ── Runway: can replace Midjourney for some video use cases ──────────────
  {
    match: (e) => e.toolId === "runway" && e.plan === "Standard" && e.seats === 1,
    action: "downgrade",
    priority: "medium",
    confidence: 72,
    implementationTime: "5 min",
    suggestedTool: () => "Runway ML",
    suggestedPlan: () => "Basic",
    newCostPerSeat: () => 0,
    reason: () =>
      "Runway Standard ($15/mo, 625 credits) vs Basic (free, 125 credits). If you generate fewer than 10 short video clips/month, the free tier is sufficient.",
    tips: () => [
      "Track your credit usage in Runway dashboard for 30 days",
      "Runway credits roll over monthly on paid plans only",
      "Basic tier sufficient for up to ~5 video-to-video transforms per month",
    ],
  },

  // ── ElevenLabs: Creator tier often over-provisioned ──────────────────────
  {
    match: (e) => e.toolId === "elevenlabs" && e.plan === "Creator",
    action: "downgrade",
    priority: "medium",
    confidence: 75,
    implementationTime: "2 min",
    suggestedTool: () => "ElevenLabs",
    suggestedPlan: () => "Starter",
    newCostPerSeat: () => 5,
    reason: () =>
      "ElevenLabs Creator ($22/mo, 100k chars) vs Starter ($5/mo, 30k chars). Unless you generate >30k characters of voice per month, Starter covers most use cases.",
    tips: () => [
      "Monitor usage in ElevenLabs → Subscription page",
      "30k chars ≈ 3.5 hours of audio content/month",
      "Creator tier adds commercial license and priority queue — assess if needed",
    ],
  },

  // ── Windsurf: Pro → Free for individual/hobby use ───────────────────────
  {
    match: (e) => e.toolId === "windsurf" && e.plan === "Pro" && e.seats === 1 && e.monthlySpend <= 15,
    action: "downgrade",
    priority: "medium",
    confidence: 80,
    implementationTime: "2 min",
    suggestedTool: () => "Windsurf",
    suggestedPlan: () => "Free",
    newCostPerSeat: () => 0,
    reason: () =>
      "Windsurf Free tier is generous for solo developers. Unless you need priority model access or unlimited completions, the free plan covers 95% of daily coding use.",
    tips: () => [
      "Free tier: 5 Cascade actions/day, unlimited autocomplete",
      "Pro tier adds unlimited Cascade, faster models, and priority queue",
      "Downgrade if you primarily use autocomplete, not agent mode",
    ],
  },

  // ── Tabnine Enterprise → Pro for small teams ─────────────────────────────
  {
    match: (e) => e.toolId === "tabnine" && e.plan === "Enterprise" && e.seats < 20,
    action: "downgrade",
    priority: "high",
    confidence: 85,
    implementationTime: "1 day",
    suggestedTool: () => "Tabnine",
    suggestedPlan: () => "Pro",
    newCostPerSeat: () => 12,
    reason: (e) =>
      `Tabnine Enterprise ($39/seat) for ${e.seats} devs = $${e.seats * 39}/mo. Pro ($12/seat) includes personalized AI completions without on-premise hosting. Save $${e.seats * 27}/mo.`,
    tips: () => [
      "Enterprise adds: on-premise hosting, SLA, admin controls",
      "Under 20 seats, Pro's cloud deployment is equally reliable",
      "Revisit Enterprise if you have strict data residency requirements",
    ],
  },

  // ── Copy.ai: Pro when Jasper/Claude already in stack ─────────────────────
  {
    match: (e) => e.toolId === "copy_ai" && e.plan === "Pro",
    action: "consolidate",
    priority: "high",
    confidence: 80,
    implementationTime: "Immediate",
    suggestedTool: () => "Claude Pro or ChatGPT Plus",
    suggestedPlan: () => "Pro / Plus",
    newCostPerSeat: () => 0,
    reason: () =>
      "Copy.ai Pro ($49/mo) is a specialized writing workflow tool built on GPT. Claude Pro or ChatGPT Plus ($20/mo) with custom prompts replicates the same output at 60% less cost.",
    tips: () => [
      "Copy.ai templates → save as Claude custom instructions",
      "Copy.ai's workflow builder = ChatGPT's custom GPTs",
      "Only keep Copy.ai if your non-technical team can't use raw AI tools",
    ],
  },

  // ── HeyGen: Business tier for small teams ────────────────────────────────
  {
    match: (e) => e.toolId === "heygen" && e.plan === "Business" && e.seats <= 2,
    action: "downgrade",
    priority: "medium",
    confidence: 78,
    implementationTime: "5 min",
    suggestedTool: () => "HeyGen",
    suggestedPlan: () => "Creator",
    newCostPerSeat: () => 29,
    reason: (e) =>
      `HeyGen Business ($89/seat) for ${e.seats} user${e.seats > 1 ? "s" : ""} = $${e.seats * 89}/mo. Creator ($29/mo for 1 user) covers most video generation needs for small teams.`,
    tips: () => [
      "Business tier adds: custom avatars, API access, multiple seats",
      "Creator tier: 3 avatar styles, 50 videos/month",
      "Share one Creator account if video generation is occasional",
    ],
  },
];

// ---------------------------------------------------------------------------
// Cross-tool consolidation check (run after per-tool rules)
// ---------------------------------------------------------------------------

function detectOverlap(entries: ToolEntry[]): Recommendation[] {
  const overlaps: Recommendation[] = [];

  const hasGPT = entries.some((e) => e.toolId === "chatgpt" && e.plan !== "Free");
  const hasClaude = entries.some((e) => e.toolId === "claude" && e.plan !== "Free");
  const hasGemini = entries.some((e) => e.toolId === "gemini" && e.plan !== "Free" && e.plan !== "API (Gemini API)");
  const hasCursor = entries.some((e) => e.toolId === "cursor");
  const hasCopilot = entries.some((e) => e.toolId === "copilot");
  const hasJasper = entries.some((e) => e.toolId === "jasper");
  const hasCopyAI = entries.some((e) => e.toolId === "copy_ai");
  const hasGrammarly = entries.some((e) => e.toolId === "grammarly" && e.plan !== "Free");
  const hasNotionAI = entries.some((e) => e.toolId === "notion_ai" && e.plan !== "Free (limited)");

  if (hasGPT && hasClaude && hasGemini) {
    overlaps.push({
      toolName: "Triple LLM Overlap",
      currentPlan: "ChatGPT + Claude + Gemini",
      currentCost: 0,
      seats: 1,
      suggestedAction: "consolidate",
      suggestedTool: "Pick one primary LLM",
      suggestedPlan: "Pro/Plus ($20/mo)",
      newCost: 0,
      saving: 40,
      reason: "You pay for ChatGPT, Claude AND Gemini — three general-purpose LLMs with 80%+ capability overlap. Pick one as primary, use free tier of others for second opinions. Save $40/mo instantly.",
      priority: "critical",
      confidenceScore: 95,
      implementationTime: "Immediate",
      tips: [
        "Keep Claude for coding + long-context tasks",
        "Keep ChatGPT for plugins, image generation (DALL-E), code interpreter",
        "Gemini only if deeply integrated into Google Workspace",
      ],
    });
  } else if (hasGPT && hasClaude) {
    overlaps.push({
      toolName: "Dual LLM Overlap",
      currentPlan: "ChatGPT Plus + Claude Pro",
      currentCost: 0,
      seats: 1,
      suggestedAction: "consolidate",
      suggestedTool: "Choose primary LLM",
      suggestedPlan: "Pro/Plus ($20/mo)",
      newCost: 0,
      saving: 20,
      reason: "ChatGPT Plus and Claude Pro overlap for most writing/coding tasks. Pick your primary and use the other's free tier for comparison. Save $20/mo.",
      priority: "high",
      confidenceScore: 88,
      implementationTime: "Immediate",
      tips: [
        "Claude wins on: long documents, coding, nuanced instructions",
        "ChatGPT wins on: plugins, DALL-E images, code interpreter, Sora",
        "Run both free for 1 week, pick the one you reach for first",
      ],
    });
  }

  if (hasCursor && hasCopilot) {
    overlaps.push({
      toolName: "Duplicate AI Coding Tools",
      currentPlan: "Cursor + GitHub Copilot",
      currentCost: 0,
      seats: 1,
      suggestedAction: "consolidate",
      suggestedTool: "Cursor (recommended)",
      suggestedPlan: "Pro",
      newCost: 0,
      saving: 10,
      reason: "Cursor and GitHub Copilot both provide AI coding assistance. Running both on the same developer is redundant — Cursor subsumes Copilot's core features. Save $10-19/seat.",
      priority: "high",
      confidenceScore: 90,
      implementationTime: "Immediate",
      tips: [
        "Cursor Pro includes GPT-4 + Claude for completions — no Copilot needed",
        "Keep Copilot only if you use GitHub's PR review AI features heavily",
        "Poll your devs: most who switch to Cursor don't return to Copilot",
      ],
    });
  }

  if (hasJasper && hasCopyAI) {
    overlaps.push({
      toolName: "Duplicate AI Writing Platforms",
      currentPlan: "Jasper + Copy.ai",
      currentCost: 0,
      seats: 1,
      suggestedAction: "consolidate",
      suggestedTool: "Pick one or switch to Claude/ChatGPT",
      suggestedPlan: "Pro ($20/mo)",
      newCost: 0,
      saving: 49,
      reason: "Jasper and Copy.ai are both AI writing workflows built on the same underlying models. You're double-paying for templates. Consolidate to one or switch to raw Claude/ChatGPT.",
      priority: "critical",
      confidenceScore: 93,
      implementationTime: "1 week",
      tips: [
        "Audit which platform your team actually opens daily",
        "Export your best templates from both before cancelling",
        "Claude Pro at $20/mo outperforms both at half the combined cost",
      ],
    });
  }

  if (hasGrammarly && hasNotionAI && (hasGPT || hasClaude)) {
    overlaps.push({
      toolName: "Writing Tool Sprawl",
      currentPlan: "Grammarly + Notion AI + LLM",
      currentCost: 0,
      seats: 1,
      suggestedAction: "consolidate",
      suggestedTool: "Claude/ChatGPT as primary writing AI",
      suggestedPlan: "Downgrade others to free",
      newCost: 0,
      saving: 30,
      reason: "You're paying for Grammarly, Notion AI, AND a general LLM — all overlapping on writing assistance. Your LLM subscription already covers grammar, style, and content generation.",
      priority: "high",
      confidenceScore: 85,
      implementationTime: "Immediate",
      tips: [
        "Grammarly free tier for browser-level grammar is enough",
        "Notion AI free tier handles in-document edits",
        "Use Claude/ChatGPT for heavy writing — it's more capable anyway",
      ],
    });
  }

  return overlaps;
}

// ---------------------------------------------------------------------------
// Waste score calculation (0-100, higher = more waste)
// ---------------------------------------------------------------------------

function calculateWasteScore(
  tools: ToolEntry[],
  recommendations: Recommendation[]
): number {
  if (tools.length === 0) return 0;

  const totalCurrentCost = tools.reduce((s, t) => s + t.monthlySpend * t.seats, 0);
  const totalSaving = recommendations.reduce((s, r) => s + r.saving, 0);

  // Base waste from overspend ratio
  const overspendRatio = totalCurrentCost > 0 ? totalSaving / totalCurrentCost : 0;

  // Penalty for redundant tools
  const hasRedundancy = recommendations.some(
    (r) => r.suggestedAction === "consolidate" && r.priority === "critical"
  );
  const redundancyBonus = hasRedundancy ? 15 : 0;

  // Penalty for unused high plans
  const criticalRecs = recommendations.filter((r) => r.priority === "critical").length;
  const criticalBonus = Math.min(criticalRecs * 8, 20);

  const raw = overspendRatio * 65 + redundancyBonus + criticalBonus;
  return Math.min(Math.round(raw), 100);
}

// ---------------------------------------------------------------------------
// Spend trend generation (6-month projection)
// ---------------------------------------------------------------------------

function generateSpendTrend(
  currentCost: number,
  optimizedCost: number
): SpendTrendPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const now = new Date();
  const currentMonth = now.getMonth();

  return months.map((_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[monthIndex];

    // Historical months: slightly varied current spend (simulated)
    // Future months (from current): show optimized trajectory
    const isHistorical = i < 4;
    const variation = 0.92 + Math.random() * 0.16; // ±8% variation
    const current = Math.round(currentCost * variation);
    // Optimized is ALWAYS ≤ current — historical shows slow decline, future shows full savings
    const rawOptimized = isHistorical
      ? Math.round(current * (0.88 + Math.random() * 0.08)) // historical: 4-12% less than current
      : Math.round(optimizedCost * (0.98 + Math.random() * 0.04));
    const optimized = Math.min(current, rawOptimized); // hard cap: never above current

    return { month, current, optimized };
  });
}

// ---------------------------------------------------------------------------
// Category breakdown
// ---------------------------------------------------------------------------

function getCategoryBreakdown(tools: ToolEntry[]): { category: string; spend: number; color: string }[] {
  const categories: Record<string, number> = {};
  const categoryColors: Record<string, string> = {
    coding: "#06b6d4",
    writing: "#a855f7",
    research: "#f59e0b",
    image: "#ec4899",
    video: "#f97316",
    audio: "#10b981",
    voice: "#10b981",
    general: "#6366f1",
    data: "#64748b",
  };

  tools.forEach((t) => {
    const cat = t.useCase;
    categories[cat] = (categories[cat] || 0) + t.monthlySpend * t.seats;
  });

  return Object.entries(categories).map(([cat, spend]) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    spend,
    color: categoryColors[cat] || "#94a3b8",
  })).sort((a, b) => b.spend - a.spend);
}

// ---------------------------------------------------------------------------
// Vendor mapping — derives a "vendor" company from toolId
// ---------------------------------------------------------------------------

const TOOL_VENDOR: Record<string, string> = {
  chatgpt: "OpenAI",
  openai_api: "OpenAI",
  claude: "Anthropic",
  anthropic_api: "Anthropic",
  gemini: "Google",
  copilot: "Microsoft",
  cursor: "Anysphere",
  windsurf: "Codeium",
  tabnine: "Tabnine",
  codeium: "Codeium",
  replit_ai: "Replit",
  perplexity: "Perplexity",
  notion_ai: "Notion",
  grammarly: "Grammarly",
  jasper: "Jasper",
  copy_ai: "Copy.ai",
  midjourney: "Midjourney",
  dall_e: "OpenAI",
  stability_ai: "Stability AI",
  adobe_firefly: "Adobe",
  runway: "Runway",
  heygen: "HeyGen",
  elevenlabs: "ElevenLabs",
  murf_ai: "Murf AI",
  otter_ai: "Otter.ai",
  zapier_ai: "Zapier",
  groq_api: "Groq",
  mistral: "Mistral",
  cohere: "Cohere",
};

const VENDOR_COLORS: string[] = [
  "#06b6d4", "#a855f7", "#34d399", "#f59e0b",
  "#f87171", "#6366f1", "#10b981", "#ec4899",
];

function getVendorConcentration(tools: ToolEntry[]): VendorShare[] {
  const map = new Map<string, number>();
  const totalCost = tools.reduce((s, t) => s + t.monthlySpend * t.seats, 0);
  if (totalCost === 0) return [];

  tools.forEach((t) => {
    const vendor = TOOL_VENDOR[t.toolId] ?? t.toolName;
    map.set(vendor, (map.get(vendor) ?? 0) + t.monthlySpend * t.seats);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([vendor, spend], i) => ({
      vendor,
      spend,
      percentage: Math.round((spend / totalCost) * 100),
      color: VENDOR_COLORS[i % VENDOR_COLORS.length],
    }));
}

// ---------------------------------------------------------------------------
// Predictive spend trend — 6 historical + 6 forecast months
// ---------------------------------------------------------------------------

function getPredictiveTrend(
  currentCost: number,
  optimizedCost: number,
): PredictivePoint[] {
  const now = new Date();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const points: PredictivePoint[] = [];

  // 6 simulated historical months (slight upward variance around current)
  for (let i = -5; i <= 0; i++) {
    const idx = ((now.getMonth() + i) + 12) % 12;
    const variation = 0.88 + Math.random() * 0.18;
    points.push({
      month: monthNames[idx],
      actual: Math.round(currentCost * variation),
    });
  }

  // 6 forecast months — trend toward optimised
  const decline = (currentCost - optimizedCost) / 6;
  for (let i = 1; i <= 6; i++) {
    const idx = (now.getMonth() + i) % 12;
    const noise = 1 + (Math.random() - 0.5) * 0.04;
    points.push({
      month: monthNames[idx],
      forecast: Math.max(0, Math.round((currentCost - decline * i) * noise)),
    });
  }

  return points;
}

// ---------------------------------------------------------------------------
// Benchmark data — compare against industry averages
// ---------------------------------------------------------------------------

function getBenchmarkData(
  tools: ToolEntry[],
  totalCurrentCost: number,
  savingPercent: number,
  wasteScore: number,
): BenchmarkRow[] {
  const toolCount = tools.length;
  const avgToolCount = 5;
  const avgSpend = 1480;   // industry avg monthly AI spend (from Groq insights)
  const avgWaste = 38;     // avg waste score
  const avgSavingPct = 26; // avg saving opportunity %

  return [
    {
      metric: "Monthly AI Spend",
      yourValue: `$${totalCurrentCost.toLocaleString()}`,
      avgValue: `$${avgSpend.toLocaleString()}`,
      status: totalCurrentCost <= avgSpend * 1.15 ? "good" : totalCurrentCost <= avgSpend * 1.5 ? "ok" : "bad",
    },
    {
      metric: "Number of AI Tools",
      yourValue: `${toolCount}`,
      avgValue: `${avgToolCount}`,
      status: toolCount <= avgToolCount + 1 ? "good" : toolCount <= avgToolCount + 3 ? "ok" : "bad",
    },
    {
      metric: "Waste Score",
      yourValue: `${wasteScore}/100`,
      avgValue: `${avgWaste}/100`,
      status: wasteScore <= 30 ? "good" : wasteScore <= 50 ? "ok" : "bad",
    },
    {
      metric: "Savings Opportunity",
      yourValue: `${savingPercent}%`,
      avgValue: `${avgSavingPct}%`,
      status: savingPercent <= 20 ? "good" : savingPercent <= 35 ? "ok" : "bad",
    },
  ];
}

// ---------------------------------------------------------------------------
// Stack maturity score — how well-chosen and optimised the stack is
// ---------------------------------------------------------------------------

function getStackMaturityScore(
  tools: ToolEntry[],
  recommendations: Recommendation[],
): number {
  if (tools.length === 0) return 100;

  // % of tools with "keep" action = maturity indicator
  const keepPct = recommendations.filter((r) => r.suggestedAction === "keep").length / recommendations.length;

  // Penalty for critical recommendations
  const criticalPenalty = recommendations.filter((r) => r.priority === "critical").length * 12;

  // Penalty for duplicate tool categories
  const useCaseCounts: Record<string, number> = {};
  tools.forEach((t) => { useCaseCounts[t.useCase] = (useCaseCounts[t.useCase] ?? 0) + 1; });
  const overlapPenalty = Object.values(useCaseCounts).filter((c) => c > 1).reduce((s, c) => s + (c - 1) * 8, 0);

  const raw = keepPct * 80 + (100 - criticalPenalty) * 0.15 - overlapPenalty;
  return Math.max(10, Math.min(100, Math.round(raw)));
}

// ---------------------------------------------------------------------------
// Summary templates (used when Groq API key not present)
// ---------------------------------------------------------------------------

const SUMMARY_TEMPLATES = [
  (saving: number, pct: number, topTool: string) =>
    `Your team is leaving $${saving}/mo on the table. The biggest opportunity is ${topTool} — a plan mismatch accounts for over half the recoverable savings. Right-sizing plans and eliminating overlap would cut AI spend by ${pct}% without reducing capability.`,
  (saving: number, pct: number, topTool: string) =>
    `At ${pct}% over-spend, ${topTool} stands out as the primary cost driver. You're paying for features your team size doesn't require. Trimming those plus eliminating subscription overlap returns $${saving}/mo — no productivity trade-off needed.`,
  (saving: number, pct: number) =>
    `Classic SaaS sprawl: overlapping tools, unused seats, wrong plan tiers. Consolidating your AI stack to match actual usage unlocks $${saving}/mo (${pct}% reduction). Start with the highest-saving recommendation for fastest ROI.`,
  (saving: number, pct: number, topTool: string) =>
    `Your audit reveals systematic over-provisioning. ${topTool} alone accounts for significant recoverable spend. By implementing our ${pct > 40 ? "aggressive" : "targeted"} optimisation plan, you could redirect $${saving}/mo toward product development instead.`,
];

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function runAudit(tools: ToolEntry[]): AuditResult {
  const perToolRecs: Recommendation[] = tools.map((entry) => {
    const rule = RULES.find((r) => r.match(entry));
    const currentCost = entry.monthlySpend * entry.seats;

    if (!rule) {
      return {
        toolId: entry.toolId,
        toolName: entry.toolName,
        currentPlan: entry.plan,
        currentCost,
        seats: entry.seats,
        suggestedAction: "keep",
        suggestedTool: entry.toolName,
        suggestedPlan: entry.plan,
        newCost: currentCost,
        saving: 0,
        reason: "Your current plan is well-matched to your team size and use case. No changes recommended at this time.",
        priority: "low",
        confidenceScore: 98,
        implementationTime: "N/A",
      };
    }

    const newCostPerSeat = rule.newCostPerSeat(entry);
    const newCost = Math.round(newCostPerSeat * entry.seats);
    const saving = Math.max(0, currentCost - newCost);

    return {
      toolId: entry.toolId,
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
      priority: rule.priority,
      confidenceScore: rule.confidence,
      implementationTime: rule.implementationTime,
      tips: rule.tips?.(entry),
    };
  });

  // Overlap notes injected as advisory recommendations
  const overlapRecs = detectOverlap(tools);
  const recommendations = [...perToolRecs, ...overlapRecs];

  const totalCurrentCost = tools.reduce((s, t) => s + t.monthlySpend * t.seats, 0);

  // Per-tool savings are already capped at 0 via Math.max in each Recommendation.
  // Sum those guaranteed savings, then add advisory overlap savings.
  const perToolSaving = perToolRecs.reduce((s, r) => s + r.saving, 0);
  const overlapSaving = overlapRecs.reduce((s, r) => s + r.saving, 0);

  // totalSaving is bounded by what you actually spend — can never exceed currentCost
  const totalSaving = Math.min(totalCurrentCost, perToolSaving + overlapSaving);

  // Optimised spend is ALWAYS ≤ current spend (guaranteed by Math.max 0 floor)
  const totalNewCost = Math.max(0, totalCurrentCost - totalSaving);

  const annualSaving = totalSaving * 12;
  const savingPercent = totalCurrentCost > 0 ? Math.round((totalSaving / totalCurrentCost) * 100) : 0;

  // Savings tier — drives UI branching
  const savingsTier: AuditSavingsTier =
    totalSaving === 0 ? "optimal"
    : totalSaving < 100 ? "low"
    : totalSaving < 500 ? "medium"
    : "high";

  const wasteScore = calculateWasteScore(tools, recommendations);
  const efficiencyScore = Math.max(0, 100 - wasteScore);
  const stackMaturityScore = getStackMaturityScore(tools, recommendations);
  const spendTrend = generateSpendTrend(totalCurrentCost, totalCurrentCost - totalSaving);
  const categoryBreakdown = getCategoryBreakdown(tools);

  // Top wasted tools (biggest savings opportunities)
  const topWastedTools = recommendations
    .filter((r) => r.saving > 0)
    .sort((a, b) => b.saving - a.saving)
    .slice(0, 5)
    .map((r) => ({ name: r.toolName, wastedAmount: r.saving }));

  // ── FinOps intelligence ──────────────────────────────────────────────────
  const vendorConcentration = getVendorConcentration(tools);
  const predictiveTrend = getPredictiveTrend(totalCurrentCost, totalNewCost);
  const benchmarkData = getBenchmarkData(tools, totalCurrentCost, savingPercent, wasteScore);

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
    wasteScore,
    efficiencyScore,
    stackMaturityScore,
    recommendations,
    summary,
    spendTrend,
    categoryBreakdown,
    topWastedTools,
    vendorConcentration,
    predictiveTrend,
    benchmarkData,
  };
}
