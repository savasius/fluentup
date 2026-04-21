/**
 * Enrich Oxford base wordlist using Free Dictionary API.
 * Rate-limited, resumable; writes directly with service role (same as other scripts).
 *
 * Usage: npx tsx scripts/enrich-words-from-api.ts
 */

import { config } from "dotenv";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { OXFORD_BASE } from "./oxford-3000-base";
import type { Database, WordMeaning } from "../src/lib/supabase/database.types";

config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing env vars.");
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE);

type WordInsert = Database["public"]["Tables"]["words"]["Insert"];

interface ApiResponse {
  word: string;
  phonetics: Array<{ text?: string; audio?: string }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{ definition: string; example?: string }>;
    synonyms?: string[];
    antonyms?: string[];
  }>;
}

async function fetchFromApi(word: string): Promise<ApiResponse[] | null> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as ApiResponse[]) : null;
  } catch {
    return null;
  }
}

async function getExistingSlugs(): Promise<Set<string>> {
  const { data } = await supabase.from("words").select("slug");
  const rows = (data ?? []) as { slug: string }[];
  return new Set(rows.map((r) => r.slug));
}

function slugify(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickPhonetic(
  phonetics: ApiResponse["phonetics"],
): { uk: string | null; us: string | null } {
  const withText = phonetics.filter((p) => p.text && p.text.length > 1);
  const cleaned = withText.map((p) => p.text!.replace(/\//g, "").trim());
  return {
    uk: cleaned[0] ?? null,
    us: cleaned[1] ?? cleaned[0] ?? null,
  };
}

function posMatches(apiPos: string, expected: string): boolean {
  const a = apiPos.toLowerCase().split(/[\s-]+/)[0] ?? "";
  return a === expected.toLowerCase();
}

async function enrichOne(
  entry: (typeof OXFORD_BASE)[number],
): Promise<WordInsert | null> {
  const slug = slugify(entry.word);
  const api = await fetchFromApi(entry.word);
  if (!api || api.length === 0) return null;

  const first = api[0];
  const phonetic = pickPhonetic(first.phonetics);

  const matchingMeanings = first.meanings.filter((m) =>
    posMatches(m.partOfSpeech, entry.part_of_speech),
  );
  const sourceMeanings =
    matchingMeanings.length > 0 ? matchingMeanings : first.meanings.slice(0, 1);

  const meanings: WordMeaning[] = sourceMeanings.slice(0, 2).map((m) => ({
    definition: m.definitions[0]?.definition ?? "",
    examples: m.definitions
      .slice(0, 2)
      .map((d) => d.example)
      .filter((x): x is string => Boolean(x)),
  }));

  if (meanings.length === 0 || !meanings[0].definition) return null;

  const synonyms = Array.from(
    new Set(first.meanings.flatMap((m) => m.synonyms ?? []).slice(0, 5)),
  );
  const antonyms = Array.from(
    new Set(first.meanings.flatMap((m) => m.antonyms ?? []).slice(0, 3)),
  );

  return {
    slug,
    word: entry.word.toLowerCase(),
    phonetic_uk: phonetic.uk,
    phonetic_us: phonetic.us,
    audio_url_uk: null,
    audio_url_us: null,
    cefr_level: entry.cefr_level,
    rarity: "common",
    part_of_speech: entry.part_of_speech,
    meanings,
    synonyms,
    antonyms,
    collocations: [],
    search_keywords: [
      entry.word.toLowerCase(),
      `${entry.word} meaning`,
      `${entry.word} definition`,
    ],
    published: true,
  };
}

async function main() {
  console.log(
    `Enriching ${OXFORD_BASE.length} base words from Free Dictionary API...`,
  );
  const existing = await getExistingSlugs();
  console.log(`DB already has ${existing.size} words. Skipping duplicates.`);

  const toEnrich = OXFORD_BASE.filter((e) => !existing.has(slugify(e.word)));
  console.log(`Will enrich ${toEnrich.length} new words.`);

  const batch: WordInsert[] = [];
  let failed = 0;

  for (let i = 0; i < toEnrich.length; i++) {
    const entry = toEnrich[i];
    process.stdout.write(`[${i + 1}/${toEnrich.length}] ${entry.word}... `);
    const result = await enrichOne(entry);
    if (result) {
      batch.push(result);
      console.log("✓");
    } else {
      failed++;
      console.log("✗ (not found)");
    }
    await new Promise((r) => setTimeout(r, 200));

    if (batch.length >= 50) {
      const { error } = await supabase
        .from("words")
        .upsert(batch, { onConflict: "slug", ignoreDuplicates: true });
      if (error) {
        console.error("Upsert error:", error.message);
      } else {
        console.log(`  → Inserted batch of ${batch.length}`);
      }
      batch.length = 0;
    }
  }

  if (batch.length > 0) {
    const { error } = await supabase
      .from("words")
      .upsert(batch, { onConflict: "slug", ignoreDuplicates: true });
    if (error) console.error("Final upsert error:", error.message);
    else console.log(`  → Final batch of ${batch.length} inserted`);
  }

  console.log(`\nDone. Failed: ${failed}/${toEnrich.length}`);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
