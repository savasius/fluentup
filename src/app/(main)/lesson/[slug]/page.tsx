import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { LessonPlayer } from "@/components/domain/LessonPlayer";
import type {
  Database,
  LessonQuizQuestion,
  WordMeaning,
} from "@/lib/supabase/database.types";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("lessons")
    .select("title, description")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const row = data as Pick<LessonRow, "title" | "description"> | null;
  if (!row) return { title: "Lesson" };
  return { title: row.title, description: row.description };
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: lessonRaw } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!lessonRaw) notFound();

  const lesson = lessonRaw as LessonRow;
  const wordSlugs = lesson.word_slugs ?? [];

  const { data: wordsRaw } = await supabase
    .from("words")
    .select(
      "slug, word, cefr_level, phonetic_uk, phonetic_us, part_of_speech, meanings",
    )
    .in("slug", wordSlugs);

  const bySlug = new Map(
    (wordsRaw ?? []).map((w) => [w.slug, w as Database["public"]["Tables"]["words"]["Row"]]),
  );
  type W = Database["public"]["Tables"]["words"]["Row"];
  const words = wordSlugs
    .map((s) => bySlug.get(s))
    .filter((w): w is W => w !== undefined)
    .map((w) => {
      const meanings = w.meanings as WordMeaning[];
      return {
        slug: w.slug,
        word: w.word,
        cefr_level: w.cefr_level,
        phonetic_uk: w.phonetic_uk,
        phonetic_us: w.phonetic_us,
        part_of_speech: w.part_of_speech,
        definition: (meanings?.[0]?.definition ?? "").slice(0, 150),
        example: meanings?.[0]?.examples?.[0] ?? null,
      };
    });

  const user = await getCurrentUser();

  const quizQuestions = (lesson.quiz_questions ?? []) as LessonQuizQuestion[];
  const totalStepCount =
    words.length + quizQuestions.length + 4;

  let initialStep = 0;
  if (user) {
    const { data: prog } = await supabase
      .from("user_lesson_progress")
      .select("current_step, status")
      .eq("user_id", user.id)
      .eq("lesson_slug", slug)
      .maybeSingle();

    const p = prog as {
      current_step: number;
      status: string;
    } | null;

    if (p?.status === "in_progress") {
      initialStep = Math.max(
        0,
        Math.min(p.current_step ?? 0, totalStepCount - 1),
      );
    }
  }

  return (
    <LessonPlayer
      lesson={lesson}
      words={words}
      isAuthenticated={!!user}
      initialStep={initialStep}
      lessonSlug={slug}
    />
  );
}
