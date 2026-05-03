import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import {
  GrammarChallengeGame,
  type GrammarChallengeItem,
} from "@/components/domain/GrammarChallengeGame";
import type { QuizQuestion } from "@/lib/supabase/database.types";
import { notFound } from "next/navigation";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Grammar Challenge — Timed quiz",
  description: "Answer grammar questions from our topic library before time runs out.",
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export default async function GrammarChallengePage() {
  const supabase = await createServerClient();
  const { data: topics } = await supabase
    .from("grammar_topics")
    .select("slug, quiz_questions")
    .eq("published", true);

  const flat: GrammarChallengeItem[] = [];
  let n = 0;
  for (const row of topics ?? []) {
    const qs = row.quiz_questions as QuizQuestion[] | null;
    if (!qs?.length) continue;
    for (const q of qs) {
      flat.push({
        ...q,
        key: `${row.slug}-${n++}`,
      });
    }
  }

  if (flat.length === 0) notFound();

  const questions = shuffle(flat).slice(0, Math.min(40, flat.length));

  return <GrammarChallengeGame questions={questions} />;
}
