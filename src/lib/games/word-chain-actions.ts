"use server";

import { createServerClient } from "@/lib/supabase";

function lettersOnly(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

function firstLetter(s: string): string | null {
  const L = lettersOnly(s);
  return L.length > 0 ? L[0]! : null;
}

function lastLetter(s: string): string | null {
  const L = lettersOnly(s);
  return L.length > 0 ? L[L.length - 1]! : null;
}

export async function getRandomChainWord(): Promise<{
  word: string;
  slug: string;
} | null> {
  const supabase = await createServerClient();
  const { count } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const n = count ?? 0;
  if (n <= 0) return null;

  const offset = Math.floor(Math.random() * n);
  const { data } = await supabase
    .from("words")
    .select("word, slug")
    .eq("published", true)
    .range(offset, offset)
    .maybeSingle();

  if (!data) return null;
  return { word: data.word, slug: data.slug };
}

export async function validateChainWord(
  previousWord: string,
  typed: string,
): Promise<{ valid: boolean; reason?: string }> {
  const clean = typed.trim();
  if (clean.length < 2) {
    return { valid: false, reason: "Use at least 2 letters." };
  }

  const prevLast = lastLetter(previousWord);
  const nextFirst = firstLetter(clean);
  if (!prevLast || !nextFirst) {
    return { valid: false, reason: "Use letters only." };
  }
  if (prevLast !== nextFirst) {
    return {
      valid: false,
      reason: `Word must start with "${prevLast.toUpperCase()}".`,
    };
  }

  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("words")
    .select("word")
    .eq("published", true);

  const lower = clean.toLowerCase();
  const match = (rows ?? []).find((r) => r.word.toLowerCase() === lower);
  if (!match) {
    return { valid: false, reason: "That word is not in our dictionary yet." };
  }

  return { valid: true };
}
