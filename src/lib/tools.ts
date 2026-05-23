export type UseCase = "coding" | "writing" | "research" | "image" | "voice" | "general" | "video" | "audio" | "data";

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
  description?: string;
  logoEmoji?: string;
};

export const TOOLS: ToolDef[] = [
  // ── Coding Tools ──────────────────────────────────────────────────────────
  {
    id: "cursor",
    name: "Cursor",
    category: ["coding"],
    pricingUrl: "https://cursor.sh/pricing",
    verifiedDate: "2026-05-21",
    description: "AI-first code editor with agent mode",
    logoEmoji: "🖱️",
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
    description: "AI pair programmer by GitHub/Microsoft",
    logoEmoji: "🤖",
    plans: [
      { name: "Individual", price: 10 },
      { name: "Business", price: 19 },
      { name: "Enterprise", price: 39 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: ["coding"],
    pricingUrl: "https://windsurf.com/pricing",
    verifiedDate: "2026-05-21",
    description: "AI code editor by Codeium",
    logoEmoji: "🏄",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 15 },
      { name: "Teams", price: 30 },
    ],
  },
  {
    id: "tabnine",
    name: "Tabnine",
    category: ["coding"],
    pricingUrl: "https://www.tabnine.com/pricing",
    verifiedDate: "2026-05-21",
    description: "AI code completion for enterprise",
    logoEmoji: "💻",
    plans: [
      { name: "Starter", price: 0 },
      { name: "Pro", price: 12 },
      { name: "Enterprise", price: 39, priceNote: "per user" },
    ],
  },
  {
    id: "codeium",
    name: "Codeium",
    category: ["coding"],
    pricingUrl: "https://codeium.com/pricing",
    verifiedDate: "2026-05-21",
    description: "Free AI coding assistant",
    logoEmoji: "⚡",
    plans: [
      { name: "Individual", price: 0 },
      { name: "Teams", price: 12, priceNote: "per user" },
      { name: "Enterprise", price: 24, priceNote: "per user" },
    ],
  },
  {
    id: "replit",
    name: "Replit AI",
    category: ["coding"],
    pricingUrl: "https://replit.com/pricing",
    verifiedDate: "2026-05-21",
    description: "AI-powered cloud development",
    logoEmoji: "🔁",
    plans: [
      { name: "Free", price: 0 },
      { name: "Core", price: 20 },
      { name: "Teams", price: 40, priceNote: "per user" },
    ],
  },

  // ── General AI Assistants ─────────────────────────────────────────────────
  {
    id: "claude",
    name: "Claude (Anthropic)",
    category: ["writing", "coding", "research", "general"],
    pricingUrl: "https://claude.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "Advanced AI by Anthropic",
    logoEmoji: "🧠",
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
    description: "World's most popular AI assistant",
    logoEmoji: "💬",
    plans: [
      { name: "Free", price: 0 },
      { name: "Plus", price: 20 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60, priceNote: "per user, custom" },
      { name: "API direct", price: "variable", priceNote: "token-based" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    category: ["writing", "coding", "research", "general"],
    pricingUrl: "https://gemini.google.com/advanced",
    verifiedDate: "2026-05-21",
    description: "Google's multimodal AI",
    logoEmoji: "✨",
    plans: [
      { name: "Free", price: 0 },
      { name: "Advanced (1.5 Pro)", price: 20 },
      { name: "Business", price: 30 },
      { name: "API (Gemini API)", price: "variable", priceNote: "token-based" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    category: ["research", "general"],
    pricingUrl: "https://www.perplexity.ai/hub/blog/introducing-perplexity-pro",
    verifiedDate: "2026-05-21",
    description: "AI-powered search and research",
    logoEmoji: "🔍",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Enterprise", price: "variable", priceNote: "custom" },
    ],
  },
  {
    id: "notion_ai",
    name: "Notion AI",
    category: ["writing", "research", "general"],
    pricingUrl: "https://www.notion.so/pricing",
    verifiedDate: "2026-05-21",
    description: "AI writing and organization in Notion",
    logoEmoji: "📝",
    plans: [
      { name: "Free (limited)", price: 0 },
      { name: "AI add-on", price: 10, priceNote: "per member/month" },
      { name: "Plus + AI", price: 18, priceNote: "per member" },
      { name: "Business + AI", price: 25, priceNote: "per member" },
    ],
  },
  {
    id: "grammarly",
    name: "Grammarly",
    category: ["writing"],
    pricingUrl: "https://www.grammarly.com/plans",
    verifiedDate: "2026-05-21",
    description: "AI writing and grammar assistant",
    logoEmoji: "✏️",
    plans: [
      { name: "Free", price: 0 },
      { name: "Premium", price: 30 },
      { name: "Business", price: 25, priceNote: "per member, min 3" },
    ],
  },
  {
    id: "jasper",
    name: "Jasper AI",
    category: ["writing"],
    pricingUrl: "https://www.jasper.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "AI content writing platform",
    logoEmoji: "🚀",
    plans: [
      { name: "Creator", price: 49 },
      { name: "Teams", price: 125, priceNote: "per team (3 seats)" },
      { name: "Business", price: "variable", priceNote: "custom" },
    ],
  },

  // ── API Providers ─────────────────────────────────────────────────────────
  {
    id: "anthropic_api",
    name: "Anthropic API",
    category: ["coding", "general"],
    pricingUrl: "https://www.anthropic.com/api",
    verifiedDate: "2026-05-21",
    description: "Claude API for developers",
    logoEmoji: "🔌",
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
    description: "GPT-4 API for developers",
    logoEmoji: "🔌",
    plans: [
      { name: "Pay as you go", price: "variable", priceNote: "per million tokens" },
    ],
  },
  {
    id: "groq_api",
    name: "Groq API",
    category: ["coding", "general"],
    pricingUrl: "https://groq.com/pricing",
    verifiedDate: "2026-05-21",
    description: "Ultra-fast LLM inference",
    logoEmoji: "⚡",
    plans: [
      { name: "Free tier", price: 0, priceNote: "rate limited" },
      { name: "Pay as you go", price: "variable", priceNote: "per million tokens" },
    ],
  },
  {
    id: "mistral_api",
    name: "Mistral AI",
    category: ["coding", "general"],
    pricingUrl: "https://mistral.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "European open-weight AI API",
    logoEmoji: "🌀",
    plans: [
      { name: "Free tier", price: 0, priceNote: "rate limited" },
      { name: "Pay as you go", price: "variable", priceNote: "per million tokens" },
      { name: "Optimum", price: 15, priceNote: "per month, fixed" },
    ],
  },
  {
    id: "cohere_api",
    name: "Cohere API",
    category: ["coding", "data", "general"],
    pricingUrl: "https://cohere.com/pricing",
    verifiedDate: "2026-05-21",
    description: "Enterprise NLP and embeddings API",
    logoEmoji: "🧬",
    plans: [
      { name: "Trial", price: 0, priceNote: "rate limited" },
      { name: "Production", price: "variable", priceNote: "token-based" },
      { name: "Enterprise", price: "variable", priceNote: "custom" },
    ],
  },

  // ── Image Generation ──────────────────────────────────────────────────────
  {
    id: "midjourney",
    name: "Midjourney",
    category: ["image"],
    pricingUrl: "https://www.midjourney.com/account",
    verifiedDate: "2026-05-21",
    description: "AI image generation",
    logoEmoji: "🎨",
    plans: [
      { name: "Basic", price: 10 },
      { name: "Standard", price: 30 },
      { name: "Pro", price: 60 },
      { name: "Mega", price: 120 },
    ],
  },
  {
    id: "dalle",
    name: "DALL-E (OpenAI)",
    category: ["image"],
    pricingUrl: "https://openai.com/api/pricing#image-generation",
    verifiedDate: "2026-05-21",
    description: "OpenAI's image generation API",
    logoEmoji: "🖼️",
    plans: [
      { name: "API usage", price: "variable", priceNote: "per image ($0.04–$0.12)" },
    ],
  },
  {
    id: "stability_ai",
    name: "Stability AI",
    category: ["image"],
    pricingUrl: "https://stability.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "Stable Diffusion API provider",
    logoEmoji: "🌊",
    plans: [
      { name: "Free", price: 0, priceNote: "25 credits/month" },
      { name: "Starter", price: 20, priceNote: "1,000 credits" },
      { name: "Pro", price: 50, priceNote: "3,000 credits" },
    ],
  },
  {
    id: "adobe_firefly",
    name: "Adobe Firefly",
    category: ["image"],
    pricingUrl: "https://www.adobe.com/products/firefly/pricing.html",
    verifiedDate: "2026-05-21",
    description: "AI image generation by Adobe",
    logoEmoji: "🦋",
    plans: [
      { name: "Free", price: 0, priceNote: "25 generative credits/month" },
      { name: "Premium", price: 9 },
      { name: "Creative Cloud", price: 60 },
    ],
  },

  // ── Video Generation ──────────────────────────────────────────────────────
  {
    id: "runway",
    name: "Runway ML",
    category: ["video", "image"],
    pricingUrl: "https://runwayml.com/pricing",
    verifiedDate: "2026-05-21",
    description: "AI video generation and editing",
    logoEmoji: "🎬",
    plans: [
      { name: "Basic", price: 0, priceNote: "125 credits" },
      { name: "Standard", price: 15 },
      { name: "Pro", price: 35 },
      { name: "Unlimited", price: 95 },
    ],
  },
  {
    id: "heygen",
    name: "HeyGen",
    category: ["video"],
    pricingUrl: "https://www.heygen.com/pricing",
    verifiedDate: "2026-05-21",
    description: "AI video generation with avatars",
    logoEmoji: "👤",
    plans: [
      { name: "Free", price: 0, priceNote: "1 video/month" },
      { name: "Creator", price: 29 },
      { name: "Business", price: 89 },
      { name: "Enterprise", price: "variable" },
    ],
  },

  // ── Audio/Voice ───────────────────────────────────────────────────────────
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: ["audio", "voice"],
    pricingUrl: "https://elevenlabs.io/pricing",
    verifiedDate: "2026-05-21",
    description: "AI voice generation and cloning",
    logoEmoji: "🎤",
    plans: [
      { name: "Free", price: 0, priceNote: "10k chars/month" },
      { name: "Starter", price: 5 },
      { name: "Creator", price: 22 },
      { name: "Pro", price: 99 },
    ],
  },
  {
    id: "murf_ai",
    name: "Murf AI",
    category: ["audio", "voice"],
    pricingUrl: "https://murf.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "AI voiceover studio",
    logoEmoji: "🔊",
    plans: [
      { name: "Free", price: 0, priceNote: "10 min voice/month" },
      { name: "Creator", price: 29 },
      { name: "Business", price: 99 },
      { name: "Enterprise", price: "variable" },
    ],
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    id: "otter_ai",
    name: "Otter.ai",
    category: ["audio", "general"],
    pricingUrl: "https://otter.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "AI meeting transcription and notes",
    logoEmoji: "🦦",
    plans: [
      { name: "Basic", price: 0 },
      { name: "Pro", price: 17 },
      { name: "Business", price: 30, priceNote: "per user" },
      { name: "Enterprise", price: "variable" },
    ],
  },
  {
    id: "zapier_ai",
    name: "Zapier AI",
    category: ["general"],
    pricingUrl: "https://zapier.com/pricing",
    verifiedDate: "2026-05-21",
    description: "AI workflow automation",
    logoEmoji: "⚡",
    plans: [
      { name: "Free", price: 0 },
      { name: "Starter", price: 19 },
      { name: "Professional", price: 49 },
      { name: "Team", price: 299 },
    ],
  },
  {
    id: "copy_ai",
    name: "Copy.ai",
    category: ["writing"],
    pricingUrl: "https://www.copy.ai/pricing",
    verifiedDate: "2026-05-21",
    description: "AI copywriting and marketing content",
    logoEmoji: "📋",
    plans: [
      { name: "Free", price: 0, priceNote: "2,000 words/month" },
      { name: "Pro", price: 49 },
      { name: "Team", price: 249, priceNote: "up to 5 users" },
    ],
  },
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

export function getToolByName(name: string): ToolDef | undefined {
  return TOOLS.find((t) => t.name === name || t.id === name);
}
