import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase";

type WordSitemapRow = { slug: string; updated_at: string };

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
  { path: "/vocabulary", changeFreq: "weekly" as const, priority: 0.9 },
  { path: "/lesson", changeFreq: "weekly" as const, priority: 0.8 },
  { path: "/tutor", changeFreq: "weekly" as const, priority: 0.7 },
  { path: "/profile", changeFreq: "monthly" as const, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));

  let wordEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createServerClient();
    const result = await supabase
      .from("words")
      .select("slug, updated_at")
      .eq("published", true);

    const words = result.data as WordSitemapRow[] | null;

    if (words) {
      wordEntries = words.map((w) => ({
        url: `${BASE_URL}/vocabulary/${w.slug}`,
        lastModified: new Date(w.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch words", err);
  }

  return [...staticEntries, ...wordEntries];
}
