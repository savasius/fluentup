import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase";
import { COLLECTIONS } from "@/lib/collections/data";

type WordSitemapRow = { slug: string; updated_at: string };
type GrammarSitemapRow = { slug: string; updated_at: string };
type LessonSitemapRow = { slug: string; created_at: string };

const BASE_URL = "https://fluentupenglish.com";

/**
 * Sitemap, Supabase server client üzerinden cookies() çağırıyor (session refresh için).
 * Bu, Next.js static generation ile uyumsuz — force-dynamic ile runtime'da render et.
 * Bot trafiği düşük olduğu için performans etkisi yok.
 */
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "", changeFreq: "daily" as const, priority: 1 },
  { path: "/practice", changeFreq: "weekly" as const, priority: 0.8 },
  { path: "/games", changeFreq: "weekly" as const, priority: 0.7 },
  {
    path: "/games/word-scramble",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  { path: "/games/match", changeFreq: "monthly" as const, priority: 0.7 },
  {
    path: "/games/sentence-builder",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  { path: "/vocabulary", changeFreq: "weekly" as const, priority: 0.9 },
  { path: "/grammar", changeFreq: "weekly" as const, priority: 0.9 },
  { path: "/collections", changeFreq: "weekly" as const, priority: 0.6 },
  { path: "/word-of-the-day", changeFreq: "daily" as const, priority: 0.6 },
  {
    path: "/games/memory-match",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  { path: "/games/hangman", changeFreq: "monthly" as const, priority: 0.7 },
  {
    path: "/games/listen-type",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/games/word-chain",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/games/speed-reading",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/games/grammar-challenge",
    changeFreq: "monthly" as const,
    priority: 0.7,
  },
  { path: "/flashcards", changeFreq: "weekly" as const, priority: 0.5 },
  {
    path: "/profile/certificates",
    changeFreq: "monthly" as const,
    priority: 0.3,
  },
  { path: "/lesson", changeFreq: "weekly" as const, priority: 0.9 },
  { path: "/tutor", changeFreq: "weekly" as const, priority: 0.7 },
  { path: "/profile", changeFreq: "monthly" as const, priority: 0.5 },
  { path: "/login", changeFreq: "yearly" as const, priority: 0.4 },
  { path: "/signup", changeFreq: "yearly" as const, priority: 0.4 },
  { path: "/privacy", changeFreq: "yearly" as const, priority: 0.2 },
  { path: "/terms", changeFreq: "yearly" as const, priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));

  let wordEntries: MetadataRoute.Sitemap = [];
  let grammarEntries: MetadataRoute.Sitemap = [];
  let lessonEntries: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createServerClient();

    const [wordsResult, grammarResult, lessonsResult] = await Promise.all([
      supabase.from("words").select("slug, updated_at").eq("published", true),
      supabase
        .from("grammar_topics")
        .select("slug, updated_at")
        .eq("published", true),
      supabase.from("lessons").select("slug, created_at").eq("published", true),
    ]);

    const words = wordsResult.data as WordSitemapRow[] | null;
    if (words) {
      wordEntries = words.map((w) => ({
        url: `${BASE_URL}/vocabulary/${w.slug}`,
        lastModified: new Date(w.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }

    const topics = grammarResult.data as GrammarSitemapRow[] | null;
    if (topics) {
      grammarEntries = topics.map((t) => ({
        url: `${BASE_URL}/grammar/${t.slug}`,
        lastModified: new Date(t.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }

    const lessonRows = lessonsResult.data as LessonSitemapRow[] | null;
    if (lessonRows) {
      lessonEntries = lessonRows.map((l) => ({
        url: `${BASE_URL}/lesson/${l.slug}`,
        lastModified: new Date(l.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch dynamic entries", err);
  }

  return [
    ...staticEntries,
    ...collectionEntries,
    ...wordEntries,
    ...grammarEntries,
    ...lessonEntries,
  ];
}
