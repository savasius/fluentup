/**
 * Grammar topics v2.1 seed — adds 15 new topics.
 * Run with: npx tsx scripts/seed-grammar-v2.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "node:path";
import type { Database } from "../src/lib/supabase/database.types";
import { GRAMMAR_V2_SEED_TOPICS } from "./grammar-v2-seed-topics";

config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Seeding requires the service role key (anon key is blocked by RLS). Aborting.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

type GrammarInsert = Database["public"]["Tables"]["grammar_topics"]["Insert"];

function toInsert(topic: (typeof GRAMMAR_V2_SEED_TOPICS)[number]): GrammarInsert {
  const form_structure: Record<string, string> = {};
  for (const r of topic.rules) {
    form_structure[r.title] = r.content;
  }
  const explanation = topic.rules
    .map((r) => `## ${r.title}\n\n${r.content}`)
    .join("\n\n");

  return {
    slug: topic.slug,
    title: topic.title,
    short_description: topic.description,
    cefr_level: topic.cefr_level,
    category: topic.category,
    explanation,
    form_structure,
    examples: topic.examples,
    common_mistakes: [],
    quiz_questions: topic.quiz_questions.map((q) => ({
      question: q.question,
      options: q.options,
      correct_index: q.correct_answer_index,
      explanation: q.explanation,
    })),
    related_topic_ids: [],
    related_word_ids: [],
    published: topic.published,
  };
}

async function seed() {
  console.log(`Seeding ${GRAMMAR_V2_SEED_TOPICS.length} grammar topics...`);
  let inserted = 0;
  let skipped = 0;

  for (const topic of GRAMMAR_V2_SEED_TOPICS) {
    const row = toInsert(topic);
    const { error } = await supabase
      .from("grammar_topics")
      .upsert(row, { onConflict: "slug", ignoreDuplicates: true });

    if (error) {
      console.error(`Error for ${topic.slug}:`, error.message);
      skipped++;
    } else {
      inserted++;
      console.log(`  ✓ ${topic.slug}`);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
