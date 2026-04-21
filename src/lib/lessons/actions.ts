"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { awardXp } from "@/lib/economy";

type ProgressInsert = Database["public"]["Tables"]["user_lesson_progress"]["Insert"];

export async function startLesson(slug: string): Promise<boolean> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const row: ProgressInsert = {
    user_id: user.id,
    lesson_slug: slug,
    status: "in_progress",
    current_step: 0,
    started_at: new Date().toISOString(),
    quiz_score: null,
    quiz_total: null,
    completed_at: null,
  };

  await supabase.from("user_lesson_progress").upsert(row, {
    onConflict: "user_id,lesson_slug",
  });

  revalidatePath("/lesson");
  revalidatePath("/");
  return true;
}

export async function updateLessonStep(
  slug: string,
  step: number,
): Promise<boolean> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("user_lesson_progress")
    .update({ current_step: step })
    .eq("user_id", user.id)
    .eq("lesson_slug", slug)
    .eq("status", "in_progress");

  if (error) return false;
  revalidatePath("/lesson");
  return true;
}

export async function completeLesson(
  slug: string,
  score: number,
  total: number,
): Promise<{ xpGained: number; levelUp: boolean } | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const safeTotal = Math.max(1, total);
  const now = new Date().toISOString();

  const { data: updatedRows } = await supabase
    .from("user_lesson_progress")
    .update({
      status: "completed",
      quiz_score: score,
      quiz_total: safeTotal,
      completed_at: now,
      current_step: 0,
    })
    .eq("user_id", user.id)
    .eq("lesson_slug", slug)
    .select("id");

  if (!updatedRows?.length) {
    await supabase.from("user_lesson_progress").insert({
      user_id: user.id,
      lesson_slug: slug,
      status: "completed",
      quiz_score: score,
      quiz_total: safeTotal,
      started_at: now,
      completed_at: now,
      current_step: 0,
    });
  }

  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("xp_reward")
    .eq("slug", slug)
    .single();

  const xpReward = lessonRow?.xp_reward ?? 30;
  const earnedXp = Math.round(xpReward * (score / safeTotal));

  let levelUp = false;
  if (earnedXp > 0) {
    const result = await awardXp(earnedXp, `lesson:${slug}`);
    levelUp = result?.levelUp ?? false;
  }

  revalidatePath("/");
  revalidatePath("/lesson");
  revalidatePath("/profile");

  return {
    xpGained: earnedXp,
    levelUp,
  };
}
