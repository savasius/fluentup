/**
 * Seed 30 structured lessons (v2.3). Requires migration SQL applied.
 * Run: npx tsx scripts/seed-lessons.ts
 */
import { config } from "dotenv";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/supabase/database.types";
import { LESSONS } from "./lesson-seed-data";

config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

type LessonInsert = Database["public"]["Tables"]["lessons"]["Insert"];

async function seed() {
  console.log(`Seeding ${LESSONS.length} lessons...`);
  let inserted = 0;
  let skipped = 0;

  for (const l of LESSONS) {
    const row: LessonInsert = {
      slug: l.slug,
      title: l.title,
      description: l.description,
      cefr_level: l.cefr_level,
      order_index: l.order_index,
      intro_text: l.intro_text,
      word_slugs: l.word_slugs,
      grammar_topic_slug: l.grammar_topic_slug ?? null,
      grammar_tip: l.grammar_tip ?? null,
      grammar_examples: l.grammar_examples ?? null,
      quiz_questions: l.quiz_questions,
      xp_reward: l.xp_reward,
      estimated_minutes: l.estimated_minutes,
      published: l.published,
    };

    const { error } = await supabase.from("lessons").upsert(row, {
      onConflict: "slug",
    });

    if (error) {
      console.error(`Error ${l.slug}:`, error.message);
      skipped++;
    } else {
      inserted++;
      console.log(`  ✓ ${l.slug}`);
    }
  }

  console.log(`\nDone. Upserted OK: ${inserted}, errors: ${skipped}`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
