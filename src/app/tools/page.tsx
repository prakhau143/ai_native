"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Search, ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// ── Tool database ─────────────────────────────────────────────────────────────
type ToolRecord = {
  id: string;
  name: string;
  vendor: string;
  category: string;
  freeTier: boolean;
  startingPrice: number | null;
  pricingModel: "per-seat" | "usage" | "flat" | "free";
  bestFor: string;
  topAlternative: string;
  wasteRisk: "low" | "medium" | "high";
  url: string;
  emoji: string;
};

const TOOLS: ToolRecord[] = [
  // ── General AI ──────────────────────────────────────────────────────────────
  { id: "chatgpt", name: "ChatGPT Plus", vendor: "OpenAI", category: "General AI", freeTier: true, startingPrice: 20, pricingModel: "flat", bestFor: "Writing, coding, research", topAlternative: "Claude Pro", wasteRisk: "medium", url: "https://chat.openai.com", emoji: "🤖" },
  { id: "claude", name: "Claude Pro", vendor: "Anthropic", category: "General AI", freeTier: true, startingPrice: 20, pricingModel: "flat", bestFor: "Long-form writing, coding, analysis", topAlternative: "ChatGPT Plus", wasteRisk: "low", url: "https://claude.ai", emoji: "🧠" },
  { id: "gemini", name: "Gemini Advanced", vendor: "Google", category: "General AI", freeTier: true, startingPrice: 20, pricingModel: "flat", bestFor: "Google Workspace integration", topAlternative: "Claude Pro", wasteRisk: "medium", url: "https://gemini.google.com", emoji: "♊" },
  { id: "grok", name: "Grok", vendor: "xAI", category: "General AI", freeTier: true, startingPrice: 8, pricingModel: "flat", bestFor: "Real-time X/Twitter data & wit", topAlternative: "ChatGPT Plus", wasteRisk: "medium", url: "https://grok.x.ai", emoji: "⚡" },
  { id: "copilot_ms", name: "Microsoft Copilot", vendor: "Microsoft", category: "General AI", freeTier: true, startingPrice: 30, pricingModel: "per-seat", bestFor: "Microsoft 365 + Office AI", topAlternative: "Gemini Advanced", wasteRisk: "high", url: "https://copilot.microsoft.com", emoji: "🪟" },
  { id: "meta_ai", name: "Meta AI", vendor: "Meta", category: "General AI", freeTier: true, startingPrice: null, pricingModel: "free", bestFor: "WhatsApp/Instagram assistant", topAlternative: "ChatGPT (free)", wasteRisk: "low", url: "https://ai.meta.com", emoji: "🔵" },

  // ── Coding ───────────────────────────────────────────────────────────────────
  { id: "cursor", name: "Cursor", vendor: "Anysphere", category: "Coding", freeTier: true, startingPrice: 20, pricingModel: "per-seat", bestFor: "AI-native code editor", topAlternative: "Windsurf", wasteRisk: "low", url: "https://cursor.sh", emoji: "⚡" },
  { id: "copilot", name: "GitHub Copilot", vendor: "Microsoft", category: "Coding", freeTier: false, startingPrice: 10, pricingModel: "per-seat", bestFor: "GitHub-integrated AI coding", topAlternative: "Cursor", wasteRisk: "high", url: "https://github.com/features/copilot", emoji: "🐙" },
  { id: "windsurf", name: "Windsurf", vendor: "Codeium", category: "Coding", freeTier: true, startingPrice: 15, pricingModel: "per-seat", bestFor: "Agentic coding with free tier", topAlternative: "Cursor", wasteRisk: "low", url: "https://windsurf.ai", emoji: "🏄" },
  { id: "tabnine", name: "Tabnine", vendor: "Tabnine", category: "Coding", freeTier: true, startingPrice: 12, pricingModel: "per-seat", bestFor: "Privacy-first code completion", topAlternative: "Codeium", wasteRisk: "medium", url: "https://tabnine.com", emoji: "💡" },
  { id: "amazon_q", name: "Amazon Q Developer", vendor: "AWS", category: "Coding", freeTier: true, startingPrice: 19, pricingModel: "per-seat", bestFor: "AWS-native code & cloud tasks", topAlternative: "GitHub Copilot", wasteRisk: "high", url: "https://aws.amazon.com/q/developer", emoji: "☁️" },
  { id: "replit_ai", name: "Replit AI", vendor: "Replit", category: "Coding", freeTier: true, startingPrice: 20, pricingModel: "flat", bestFor: "Browser-based AI coding & deploy", topAlternative: "Cursor", wasteRisk: "medium", url: "https://replit.com/ai", emoji: "🔄" },
  { id: "codeium", name: "Codeium", vendor: "Codeium", category: "Coding", freeTier: true, startingPrice: 12, pricingModel: "per-seat", bestFor: "Free autocomplete in any IDE", topAlternative: "Tabnine", wasteRisk: "low", url: "https://codeium.com", emoji: "🆓" },

  // ── API / Infrastructure ──────────────────────────────────────────────────────
  { id: "openai_api", name: "OpenAI API", vendor: "OpenAI", category: "API", freeTier: false, startingPrice: null, pricingModel: "usage", bestFor: "GPT-4o, embeddings, vision", topAlternative: "Anthropic API", wasteRisk: "high", url: "https://platform.openai.com", emoji: "🔌" },
  { id: "anthropic_api", name: "Anthropic API", vendor: "Anthropic", category: "API", freeTier: false, startingPrice: null, pricingModel: "usage", bestFor: "Claude 3.5 Sonnet, long context", topAlternative: "Groq API", wasteRisk: "high", url: "https://console.anthropic.com", emoji: "🔌" },
  { id: "groq_api", name: "Groq API", vendor: "Groq", category: "API", freeTier: true, startingPrice: null, pricingModel: "usage", bestFor: "Ultra-fast Llama inference", topAlternative: "Anthropic API", wasteRisk: "low", url: "https://console.groq.com", emoji: "⚡" },
  { id: "mistral_api", name: "Mistral API", vendor: "Mistral AI", category: "API", freeTier: true, startingPrice: null, pricingModel: "usage", bestFor: "EU-hosted open models, low cost", topAlternative: "Groq API", wasteRisk: "low", url: "https://console.mistral.ai", emoji: "🌪️" },
  { id: "together_ai", name: "Together AI", vendor: "Together AI", category: "API", freeTier: true, startingPrice: null, pricingModel: "usage", bestFor: "50+ open-source models, fine-tuning", topAlternative: "Replicate", wasteRisk: "low", url: "https://together.ai", emoji: "🤝" },
  { id: "replicate", name: "Replicate", vendor: "Replicate", category: "API", freeTier: true, startingPrice: null, pricingModel: "usage", bestFor: "Run any ML model via API", topAlternative: "Together AI", wasteRisk: "medium", url: "https://replicate.com", emoji: "🔁" },
  { id: "cohere_api", name: "Cohere API", vendor: "Cohere", category: "API", freeTier: true, startingPrice: null, pricingModel: "usage", bestFor: "Enterprise RAG & embeddings", topAlternative: "OpenAI API", wasteRisk: "medium", url: "https://cohere.com", emoji: "🔗" },

  // ── Research ──────────────────────────────────────────────────────────────────
  { id: "perplexity", name: "Perplexity Pro", vendor: "Perplexity", category: "Research", freeTier: true, startingPrice: 20, pricingModel: "flat", bestFor: "Cited web research & search", topAlternative: "ChatGPT + browsing", wasteRisk: "medium", url: "https://perplexity.ai", emoji: "🔍" },
  { id: "you_com", name: "You.com Pro", vendor: "You.com", category: "Research", freeTier: true, startingPrice: 15, pricingModel: "flat", bestFor: "AI search with source citations", topAlternative: "Perplexity Pro", wasteRisk: "medium", url: "https://you.com", emoji: "🔎" },
  { id: "elicit", name: "Elicit", vendor: "Elicit", category: "Research", freeTier: true, startingPrice: 10, pricingModel: "usage", bestFor: "Academic paper synthesis & review", topAlternative: "Perplexity Pro", wasteRisk: "low", url: "https://elicit.com", emoji: "📚" },

  // ── Image Gen ─────────────────────────────────────────────────────────────────
  { id: "midjourney", name: "Midjourney", vendor: "Midjourney", category: "Image Gen", freeTier: false, startingPrice: 10, pricingModel: "flat", bestFor: "High-quality artistic images", topAlternative: "DALL-E 3", wasteRisk: "medium", url: "https://midjourney.com", emoji: "🎨" },
  { id: "dalle3", name: "DALL-E 3", vendor: "OpenAI", category: "Image Gen", freeTier: false, startingPrice: null, pricingModel: "usage", bestFor: "Prompt-accurate image generation", topAlternative: "Midjourney", wasteRisk: "medium", url: "https://openai.com/dall-e-3", emoji: "🖼️" },
  { id: "stability_ai", name: "Stability AI", vendor: "Stability AI", category: "Image Gen", freeTier: true, startingPrice: 20, pricingModel: "usage", bestFor: "Stable Diffusion API & fine-tuning", topAlternative: "Midjourney", wasteRisk: "low", url: "https://stability.ai", emoji: "🌌" },
  { id: "adobe_firefly", name: "Adobe Firefly", vendor: "Adobe", category: "Image Gen", freeTier: true, startingPrice: 9, pricingModel: "flat", bestFor: "Commercial-safe generative art", topAlternative: "Midjourney", wasteRisk: "medium", url: "https://firefly.adobe.com", emoji: "🦋" },
  { id: "ideogram", name: "Ideogram", vendor: "Ideogram", category: "Image Gen", freeTier: true, startingPrice: 8, pricingModel: "flat", bestFor: "Text-in-image generation", topAlternative: "DALL-E 3", wasteRisk: "low", url: "https://ideogram.ai", emoji: "🅰️" },

  // ── Video ──────────────────────────────────────────────────────────────────────
  { id: "runway", name: "Runway Gen-3", vendor: "Runway", category: "Video", freeTier: true, startingPrice: 15, pricingModel: "usage", bestFor: "AI video generation & editing", topAlternative: "HeyGen", wasteRisk: "medium", url: "https://runwayml.com", emoji: "🎬" },
  { id: "heygen", name: "HeyGen", vendor: "HeyGen", category: "Video", freeTier: true, startingPrice: 29, pricingModel: "flat", bestFor: "AI avatar video creation", topAlternative: "Synthesia", wasteRisk: "medium", url: "https://heygen.com", emoji: "📹" },
  { id: "synthesia", name: "Synthesia", vendor: "Synthesia", category: "Video", freeTier: false, startingPrice: 29, pricingModel: "flat", bestFor: "Enterprise AI avatar training videos", topAlternative: "HeyGen", wasteRisk: "high", url: "https://synthesia.io", emoji: "🎭" },
  { id: "pika", name: "Pika Labs", vendor: "Pika", category: "Video", freeTier: true, startingPrice: 8, pricingModel: "flat", bestFor: "Short-form AI video clips", topAlternative: "Runway Gen-3", wasteRisk: "low", url: "https://pika.art", emoji: "✨" },

  // ── Audio ──────────────────────────────────────────────────────────────────────
  { id: "elevenlabs", name: "ElevenLabs", vendor: "ElevenLabs", category: "Audio", freeTier: true, startingPrice: 5, pricingModel: "usage", bestFor: "Realistic voice cloning & TTS", topAlternative: "Murf AI", wasteRisk: "low", url: "https://elevenlabs.io", emoji: "🔊" },
  { id: "murf_ai", name: "Murf AI", vendor: "Murf", category: "Audio", freeTier: true, startingPrice: 19, pricingModel: "flat", bestFor: "Studio-quality voiceovers", topAlternative: "ElevenLabs", wasteRisk: "medium", url: "https://murf.ai", emoji: "🎙️" },
  { id: "otter_ai", name: "Otter.ai", vendor: "Otter.ai", category: "Audio", freeTier: true, startingPrice: 10, pricingModel: "flat", bestFor: "Real-time meeting transcription", topAlternative: "Fireflies.ai", wasteRisk: "medium", url: "https://otter.ai", emoji: "📝" },

  // ── Writing ────────────────────────────────────────────────────────────────────
  { id: "jasper", name: "Jasper", vendor: "Jasper", category: "Writing", freeTier: false, startingPrice: 49, pricingModel: "flat", bestFor: "Marketing copy & brand voice", topAlternative: "Claude Pro + prompts", wasteRisk: "high", url: "https://jasper.ai", emoji: "✍️" },
  { id: "grammarly", name: "Grammarly Premium", vendor: "Grammarly", category: "Writing", freeTier: true, startingPrice: 30, pricingModel: "flat", bestFor: "Grammar, style, plagiarism", topAlternative: "Claude / ChatGPT", wasteRisk: "high", url: "https://grammarly.com", emoji: "✅" },
  { id: "copy_ai", name: "Copy.ai", vendor: "Copy.ai", category: "Writing", freeTier: true, startingPrice: 49, pricingModel: "flat", bestFor: "Marketing copy workflows", topAlternative: "ChatGPT + prompts", wasteRisk: "high", url: "https://copy.ai", emoji: "📋" },
  { id: "writesonic", name: "Writesonic", vendor: "Writesonic", category: "Writing", freeTier: true, startingPrice: 16, pricingModel: "flat", bestFor: "SEO blog posts & ad copy", topAlternative: "Jasper", wasteRisk: "high", url: "https://writesonic.com", emoji: "🖊️" },
  { id: "rytr", name: "Rytr", vendor: "Rytr", category: "Writing", freeTier: true, startingPrice: 9, pricingModel: "flat", bestFor: "Budget AI writing for solopreneurs", topAlternative: "Copy.ai", wasteRisk: "medium", url: "https://rytr.me", emoji: "📌" },

  // ── Productivity ───────────────────────────────────────────────────────────────
  { id: "notion_ai", name: "Notion AI", vendor: "Notion", category: "Productivity", freeTier: true, startingPrice: 10, pricingModel: "per-seat", bestFor: "In-doc AI writing & summaries", topAlternative: "Claude (free)", wasteRisk: "medium", url: "https://notion.so", emoji: "📝" },
  { id: "zapier_ai", name: "Zapier AI", vendor: "Zapier", category: "Productivity", freeTier: true, startingPrice: 19, pricingModel: "usage", bestFor: "AI-powered workflow automation", topAlternative: "Make + LLM node", wasteRisk: "low", url: "https://zapier.com/ai", emoji: "⚙️" },
  { id: "mem_ai", name: "Mem AI", vendor: "Mem", category: "Productivity", freeTier: false, startingPrice: 14, pricingModel: "flat", bestFor: "AI-powered note memory & search", topAlternative: "Notion AI", wasteRisk: "medium", url: "https://mem.ai", emoji: "🧩" },
  { id: "fireflies", name: "Fireflies.ai", vendor: "Fireflies", category: "Productivity", freeTier: true, startingPrice: 10, pricingModel: "per-seat", bestFor: "Meeting recording, summaries & search", topAlternative: "Otter.ai", wasteRisk: "low", url: "https://fireflies.ai", emoji: "🔥" },
  { id: "canva_ai", name: "Canva AI", vendor: "Canva", category: "Productivity", freeTier: true, startingPrice: 15, pricingModel: "flat", bestFor: "AI design, presentation & docs", topAlternative: "Adobe Firefly", wasteRisk: "medium", url: "https://canva.com/ai", emoji: "🎨" },
];

const CATEGORIES = ["All", "General AI", "Coding", "API", "Research", "Image Gen", "Video", "Audio", "Writing", "Productivity"] as const;
const WASTE_COLOR = { low: "#34d399", medium: "#f59e0b", high: "#f87171" } as const;
const WASTE_LABEL = { low: "Low risk", medium: "Medium", high: "High waste" } as const;

const glassCard: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--card-border)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [wasteFilter, setWasteFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.vendor.toLowerCase().includes(search.toLowerCase()) ||
        t.bestFor.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || t.category === category;
      const matchWaste = wasteFilter === "all" || t.wasteRisk === wasteFilter;
      return matchSearch && matchCat && matchWaste;
    });
  }, [search, category, wasteFilter]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#67e8f9" }}>
            🛠️ AI Tool Intelligence Database — Updated May 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
            45 AI Tools — Pricing, Waste Risk &amp; Alternatives
          </h1>
          <p className="text-base" style={{ color: "var(--foreground)", opacity: 0.5 }}>
            Compare every major AI tool on pricing model, overlap risk, and best alternatives. Updated monthly.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--foreground)", opacity: 0.35 }} />
            <input
              type="text"
              placeholder="Search tools, vendors, use cases…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1"
              style={{
                ...glassCard,
                color: "var(--foreground)",
              }}
            />
          </div>

          {/* Waste filter */}
          <div className="flex gap-2">
            {(["all", "low", "medium", "high"] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWasteFilter(w)}
                className="rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all"
                style={{
                  ...glassCard,
                  color: wasteFilter === w
                    ? (w === "all" ? "#67e8f9" : WASTE_COLOR[w])
                    : "var(--foreground)",
                  opacity: wasteFilter === w ? 1 : 0.55,
                  borderColor: wasteFilter === w
                    ? (w === "all" ? "rgba(6,182,212,0.4)" : `${WASTE_COLOR[w]}60`)
                    : "var(--card-border)",
                }}
              >
                {w === "all" ? "All" : WASTE_LABEL[w]}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: category === c ? "rgba(6,182,212,0.15)" : "var(--card)",
                border: category === c ? "1px solid rgba(6,182,212,0.4)" : "1px solid var(--card-border)",
                color: category === c ? "#67e8f9" : "var(--foreground)",
                opacity: category === c ? 1 : 0.6,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs mb-5" style={{ color: "var(--foreground)", opacity: 0.35 }}>
          {filtered.length} tool{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Tool grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={glassCard}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{tool.name}</h3>
                    <p className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>{tool.vendor}</p>
                  </div>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0"
                  style={{
                    background: `${WASTE_COLOR[tool.wasteRisk]}14`,
                    color: WASTE_COLOR[tool.wasteRisk],
                    border: `1px solid ${WASTE_COLOR[tool.wasteRisk]}40`,
                  }}
                >
                  {WASTE_LABEL[tool.wasteRisk]}
                </span>
              </div>

              {/* Category + pricing */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8" }}>
                  {tool.category}
                </span>
                <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.55 }}>
                  {tool.pricingModel === "usage" ? "Pay-as-you-go"
                    : tool.startingPrice === null ? "Free"
                    : `From $${tool.startingPrice}/mo`}
                </span>
                {tool.freeTier && (
                  <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
                    Free tier
                  </span>
                )}
              </div>

              {/* Best for */}
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                <span className="font-semibold">Best for:</span> {tool.bestFor}
              </p>

              {/* Alternative */}
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--foreground)", opacity: 0.45 }}>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span>Top alternative: <span className="font-semibold">{tool.topAlternative}</span></span>
              </div>

              {/* Visit link */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-100"
                style={{ color: "#67e8f9", opacity: 0.7 }}
              >
                <ExternalLink className="h-3 w-3" />
                Visit {tool.vendor}
              </a>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold" style={{ color: "var(--foreground)" }}>No tools found</p>
            <p className="text-sm mt-1" style={{ color: "var(--foreground)", opacity: 0.4 }}>Try a different search or filter</p>
          </div>
        )}
      </main>
    </div>
  );
}
