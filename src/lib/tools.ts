export type UseCase = "coding" | "writing" | "research" | "image" | "voice" | "general";

export type PlanInfo = {
  name: string;
  price: number | "variable"; // per seat/month
  priceNote?: string;
};

export type ToolDef = {
  id: string;
  name: string;
  category: UseCase[];
  plans: PlanInfo[];
  pricingUrl: string;
  verifiedDate: string; // ISO date
};

export const TOOLS: ToolDef[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: ["coding"],
    pricingUrl: "https://cursor.sh/pricing",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Hobby", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Business", price: 40 },
      { name: "Enterprise", price: 60, priceNote: "per user, custom" },
    ],
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    category: ["coding"],
    pricingUrl: "https://github.com/features/copilot#pricing",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Individual", price: 10 },
      { name: "Business", price: 19 },
      { name: "Enterprise", price: 39 },
    ],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    category: ["writing", "coding", "research", "general"],
    pricingUrl: "https://claude.ai/pricing",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Max", price: 100 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60, priceNote: "per user, custom" },
      { name: "API direct", price: "variable", priceNote: "token-based" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    category: ["writing", "coding", "research", "general"],
    pricingUrl: "https://openai.com/pricing",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Free", price: 0 },
      { name: "Plus", price: 20 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60, priceNote: "per user, custom" },
      { name: "API direct", price: "variable", priceNote: "token-based" },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    category: ["coding", "general"],
    pricingUrl: "https://www.anthropic.com/api",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Pay as you go", price: "variable", priceNote: "per million tokens" },
    ],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    category: ["coding", "general"],
    pricingUrl: "https://openai.com/api/pricing",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Pay as you go", price: "variable", priceNote: "per million tokens" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    category: ["writing", "coding", "research", "general"],
    pricingUrl: "https://gemini.google.com/advanced",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Free", price: 0 },
      { name: "Advanced (1.5 Pro)", price: 20 },
      { name: "Business", price: 30 },
      { name: "API (Gemini API)", price: "variable", priceNote: "token-based" },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: ["coding"],
    pricingUrl: "https://windsurf.com/pricing",
    verifiedDate: "2026-05-21",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 15 },
      { name: "Teams", price: 30 },
    ],
  },
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

export function getToolByName(name: string): ToolDef | undefined {
  return TOOLS.find((t) => t.name === name || t.id === name);
}
