import type { Metadata } from "next";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { getCurrentUserMode } from "@/lib/mode/server";
import { createServerClient } from "@/lib/supabase";
import { LessonHub } from "@/components/domain/LessonHub";
import type { Database } from "@/lib/supabase/database.types";

export const metadata: Metadata = {
  title: "Lessons — Structured English learning",
  description:
    "Step-by-step lessons from A1 to B2. Each lesson is 5-8 minutes, with vocabulary, grammar, and a quiz.",
};

export const revalidate = 60;

type LessonListRow = Pick<
  Database["public"]["Tables"]["lessons"]["Row"],
  | "slug"
  | "title"
  | "description"
  | "cefr_level"
  | "order_index"
  | "xp_reward"
  | "estimated_minutes"
>;

export default async function Page() {
  const { user, profile } = await getCurrentUserWithProfile();
  const mode = await getCurrentUserMode();
  const supabase = await createServerClient();

  const { data: lessonsRaw } = await supabase
    .from("lessons")
    .select(
      "slug, title, description, cefr_level, order_index, xp_reward, estimated_minutes",
    )
    .eq("published", true)
    .order("cefr_level", { ascending: true })
    .order("order_index", { ascending: true });

  let lessons = (lessonsRaw ?? []) as LessonListRow[];
  if (mode === "kid") {
    lessons = lessons.filter(
      (l) => l.cefr_level === "A1" || l.cefr_level === "A2",
    );
  }

  let completedSlugs: string[] = [];
  let inProgressSlug: string | null = null;

  if (user) {
    const { data: progressRaw } = await supabase
      .from("user_lesson_progress")
      .select("lesson_slug, status")
      .eq("user_id", user.id);

    const progress = (progressRaw ?? []) as {
      lesson_slug: string;
      status: string;
    }[];

    completedSlugs = progress
      .filter((p) => p.status === "completed")
      .map((p) => p.lesson_slug);

    const inProgress = progress.find((p) => p.status === "in_progress");
    inProgressSlug = inProgress?.lesson_slug ?? null;
  }

  return (
    <LessonHub
      lessons={lessons}
      completedSlugs={completedSlugs}
      inProgressSlug={inProgressSlug}
      userLevel={profile?.cefr_level ?? "A1"}
    />
  );
}
