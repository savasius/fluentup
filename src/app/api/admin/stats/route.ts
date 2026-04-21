import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest } from "@/lib/admin/auth";
import type { Database } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const RARITIES = ["common", "rare", "epic"] as const;

export async function GET(req: NextRequest) {
  const { valid, error } = verifyAdminRequest(req);
  if (!valid) return error!;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }

  const supabase = createClient<Database>(url, key);

  const [grammarRes, usersRes, ...wordCounts] = await Promise.all([
    supabase
      .from("grammar_topics")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    ...LEVELS.map((lv) =>
      supabase
        .from("words")
        .select("id", { count: "exact", head: true })
        .eq("published", true)
        .eq("cefr_level", lv),
    ),
    ...RARITIES.map((r) =>
      supabase
        .from("words")
        .select("id", { count: "exact", head: true })
        .eq("published", true)
        .eq("rarity", r),
    ),
  ]);

  const levelResults = wordCounts.slice(0, LEVELS.length);
  const rarityResults = wordCounts.slice(LEVELS.length);

  const wordsTotal = levelResults.reduce((sum, r) => sum + (r.count ?? 0), 0);

  const wordsByLevel: Record<string, number> = {};
  LEVELS.forEach((lv, i) => {
    wordsByLevel[lv] = levelResults[i]?.count ?? 0;
  });

  const wordsByRarity: Record<string, number> = {};
  RARITIES.forEach((r, i) => {
    wordsByRarity[r] = rarityResults[i]?.count ?? 0;
  });

  return NextResponse.json({
    wordsTotal,
    grammarTotal: grammarRes.count ?? 0,
    usersTotal: usersRes.count ?? 0,
    wordsByLevel,
    wordsByRarity,
  });
}
