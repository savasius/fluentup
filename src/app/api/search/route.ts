import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ words: [], grammar: [] });
  }

  const supabase = await createServerClient();
  const prefix = `${q}%`;
  const contains = `%${q}%`;

  const [wordsRes, grammarRes] = await Promise.all([
    supabase
      .from("words")
      .select("slug, word, cefr_level, part_of_speech")
      .or(`word.ilike.${prefix},word.ilike.${contains}`)
      .eq("published", true)
      .limit(6),
    supabase
      .from("grammar_topics")
      .select("slug, title, cefr_level")
      .or(`title.ilike.${prefix},title.ilike.${contains}`)
      .eq("published", true)
      .limit(4),
  ]);

  return NextResponse.json({
    words: wordsRes.data ?? [],
    grammar: grammarRes.data ?? [],
  });
}
