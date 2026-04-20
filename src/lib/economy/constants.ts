/**
 * FluentUp Economy — constants ve matematik.
 * Level progresyonu, XP ödülleri, streak bonusları.
 */

export const DAILY_GOAL_DEFAULT = 30;

export const XP_REWARDS = {
  wordLearned: 10,
  grammarLessonCompleted: 20,
  quizCorrect: 5,
  dailyLogin: 5,
  gameMin: 10,
  gameMax: 100,
  streakBonusMax: 30,
} as const;

/**
 * Level N'e ulaşmak için gereken toplam XP.
 * Formül: (level - 1) * level * 50
 * Level 2 → 100, Level 3 → 300, Level 4 → 600, Level 5 → 1000, Level 10 → 4500
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round((level - 1) * level * 50);
}

/**
 * Total XP'den level + progress hesapla.
 */
export function levelFromXp(totalXp: number): {
  level: number;
  progress: number;
  nextLevelXp: number;
} {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXp) {
    level++;
    if (level > 100) break;
  }
  const currentLevelXp = xpRequiredForLevel(level);
  const nextLevelXp = xpRequiredForLevel(level + 1);
  const xpInLevel = totalXp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progress =
    xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;
  return { level, progress, nextLevelXp };
}

/**
 * Streak bonus XP (cap'li).
 */
export function streakBonus(streakDays: number): number {
  return Math.min(Math.max(0, streakDays), XP_REWARDS.streakBonusMax);
}
