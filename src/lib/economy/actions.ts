"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { checkNewAchievements, type UserStats } from "./achievements";
import { levelFromXp, XP_REWARDS } from "./constants";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export interface AwardXpResult {
  newXp: number;
  levelUp: boolean;
  streakContinued: boolean;
  newAchievements: string[];
}

const ISO_DATE_LEN = 10;

function todayIso(): string {
  return new Date().toISOString().slice(0, ISO_DATE_LEN);
}

function yesterdayIso(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, ISO_DATE_LEN);
}

/**
 * Kullanıcıya XP ekle, streak'i ilerlet, achievements kontrol et.
 * Guest ise `null`. Sanity limiti aşılırsa `null`.
 * Server action — idempotent değil. Client'ta tek çağrı garantisi lazım.
 */
export async function awardXp(
  xp: number,
  _reason: string
): Promise<AwardXpResult | null> {
  const maxAllowed = XP_REWARDS.gameMax + XP_REWARDS.streakBonusMax;
  if (!Number.isFinite(xp) || xp <= 0 || xp > maxAllowed) return null;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as ProfileRow | null;
  if (!profile) return null;

  const today = todayIso();
  const lastActiveDate = profile.last_active_at
    ? new Date(profile.last_active_at).toISOString().slice(0, ISO_DATE_LEN)
    : null;

  let newStreak = profile.current_streak ?? 0;
  let streakContinued = false;
  if (lastActiveDate === today) {
    streakContinued = true;
  } else if (lastActiveDate === yesterdayIso()) {
    newStreak += 1;
    streakContinued = true;
  } else {
    newStreak = 1;
  }

  const dailyXpDate = profile.daily_xp_date ?? today;
  const previousDailyXp =
    dailyXpDate === today ? profile.daily_xp_earned ?? 0 : 0;

  const newTotalXp = (profile.total_xp ?? 0) + xp;
  const newDailyXp = previousDailyXp + xp;
  const newLongestStreak = Math.max(profile.longest_streak ?? 0, newStreak);

  const currentAchievements: string[] = Array.isArray(profile.achievements)
    ? profile.achievements
    : [];
  const stats: UserStats = {
    totalXp: newTotalXp,
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    gamesPlayed: 0,
    wordsLearned: 0,
    lessonsCompleted: 0,
  };
  const newAchievements = checkNewAchievements(stats, currentAchievements);
  const updatedAchievements = [
    ...currentAchievements,
    ...newAchievements.map((a) => a.id),
  ];

  const { level: oldLevel } = levelFromXp(profile.total_xp ?? 0);
  const { level: newLevel } = levelFromXp(newTotalXp);
  const levelUp = newLevel > oldLevel;

  const patch: ProfileUpdate = {
    total_xp: newTotalXp,
    current_streak: newStreak,
    longest_streak: newLongestStreak,
    last_active_at: new Date().toISOString(),
    daily_xp_earned: newDailyXp,
    daily_xp_date: today,
    achievements: updatedAchievements,
  };

  await supabase.from("profiles").update(patch).eq("id", user.id);

  revalidatePath("/");
  revalidatePath("/profile");

  return {
    newXp: newTotalXp,
    levelUp,
    streakContinued,
    newAchievements: newAchievements.map((a) => a.id),
  };
}

/**
 * Günlük hedefi güncelle. 10 ≤ goal ≤ 200.
 */
export async function updateDailyGoal(goal: number): Promise<boolean> {
  if (!Number.isFinite(goal) || goal < 10 || goal > 200) return false;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const patch: ProfileUpdate = { daily_goal: Math.round(goal) };
  await supabase.from("profiles").update(patch).eq("id", user.id);

  revalidatePath("/");
  revalidatePath("/profile");
  return true;
}
