import type { CefrLevel } from "@/lib/supabase/database.types";

export interface Collection {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  accentColor: "primary" | "action" | "reward" | "success" | "rare" | "teal";
  cefrLevels?: CefrLevel[];
  rarity?: ("common" | "rare" | "epic")[];
  wordSlugs?: string[];
  sort?: "asc" | "desc";
  limit?: number;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "beginner-essentials",
    title: "Beginner essentials",
    description:
      "The first 50 words you need. A1-A2 staples for everyday conversation.",
    emoji: "🌱",
    accentColor: "success",
    cefrLevels: ["A1", "A2"],
    limit: 50,
  },
  {
    slug: "intermediate-core",
    title: "Intermediate core",
    description: "B1-B2 vocabulary that unlocks richer, more nuanced English.",
    emoji: "📘",
    accentColor: "primary",
    cefrLevels: ["B1", "B2"],
    limit: 60,
  },
  {
    slug: "advanced-power",
    title: "Advanced power words",
    description: "C1-C2 words that make writing and speech precise and elegant.",
    emoji: "💎",
    accentColor: "rare",
    cefrLevels: ["C1", "C2"],
    limit: 60,
  },
  {
    slug: "rare-gems",
    title: "Rare gems",
    description: "Uncommon words that make you sound well-read.",
    emoji: "✨",
    accentColor: "reward",
    rarity: ["rare", "epic"],
    limit: 40,
  },
  {
    slug: "epic-only",
    title: "Epic only",
    description: "The rarest, most interesting words in our dictionary.",
    emoji: "🔥",
    accentColor: "action",
    rarity: ["epic"],
    limit: 40,
  },
  {
    slug: "everyday-english",
    title: "Everyday English",
    description: "High-frequency words for daily situations.",
    emoji: "☕",
    accentColor: "teal",
    cefrLevels: ["A1", "A2", "B1"],
    limit: 50,
  },
];

export function getCollectionBySlug(slug: string): Collection | null {
  return COLLECTIONS.find((c) => c.slug === slug) ?? null;
}
