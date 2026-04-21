import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest } from "@/lib/admin/auth";
import type { Database, PartOfSpeech, WordMeaning } from "@/lib/supabase/database.types";

export const runtime = "nodejs";
export const maxDuration = 60;

type WordInsert = Database["public"]["Tables"]["words"]["Insert"];

const PARTS: PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "pronoun",
  "conjunction",
  "determiner",
  "interjection",
  "phrase",
];

function isPartOfSpeech(s: string): s is PartOfSpeech {
  return (PARTS as readonly string[]).includes(s);
}

interface ImportWord {
  slug: string;
  word: string;
  phonetic_uk?: string | null;
  phonetic_us?: string | null;
  cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  rarity?: "common" | "rare" | "epic";
  part_of_speech: string;
  meanings: Array<{ definition: string; examples?: string[] }>;
  synonyms?: string[];
  antonyms?: string[];
  search_keywords?: string[];
  published?: boolean;
}

function normalizeMeanings(
  meanings: ImportWord["meanings"],
): WordMeaning[] {
  return meanings.map((m) => ({
    definition: m.definition,
    examples: m.examples ?? [],
  }));
}

export async function POST(req: NextRequest) {
  const { valid, error } = verifyAdminRequest(req);
  if (!valid) return error!;

  let body: { words: ImportWord[] };
  try {
    body = (await req.json()) as { words: ImportWord[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.words) || body.words.length === 0) {
    return NextResponse.json({ error: "words array required" }, { status: 400 });
  }

  if (body.words.length > 500) {
    return NextResponse.json(
      { error: "Max 500 words per request" },
      { status: 400 },
    );
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }

  const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE);

  const rows: WordInsert[] = [];
  for (const w of body.words) {
    const pos = w.part_of_speech.toLowerCase().trim();
    if (!isPartOfSpeech(pos)) {
      return NextResponse.json(
        { error: `Invalid part_of_speech for slug ${w.slug}: ${w.part_of_speech}` },
        { status: 400 },
      );
    }
    rows.push({
      slug: w.slug.toLowerCase().trim(),
      word: w.word.trim(),
      phonetic_uk: w.phonetic_uk ?? null,
      phonetic_us: w.phonetic_us ?? null,
      audio_url_uk: null,
      audio_url_us: null,
      cefr_level: w.cefr_level,
      rarity: w.rarity ?? "common",
      part_of_speech: pos,
      meanings: normalizeMeanings(w.meanings),
      synonyms: w.synonyms ?? [],
      antonyms: w.antonyms ?? [],
      collocations: [],
      search_keywords: w.search_keywords ?? [w.word.toLowerCase()],
      published: w.published ?? true,
    });
  }

  const { data, error: upsertError } = await supabase
    .from("words")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
    .select("slug");

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const inserted = data?.length ?? 0;
  return NextResponse.json({
    inserted,
    skipped: rows.length - inserted,
    total_requested: rows.length,
  });
}
