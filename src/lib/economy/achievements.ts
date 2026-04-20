/**
 * Achievement rozetleri. `check` fonksiyonu kullanıcı statlarına bakar,
 * kazanıldıysa true döner. Server action'da eski rozetlerle karşılaştırılır.
 */

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  gamesPlayed: number;
  wordsLearned: number;
  lessonsCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "primary" | "success" | "reward" | "rare" | "action";
  check: (stats: UserStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-xp",
    title: "First Step",
    description: "Earn your first 10 XP",
    icon: "Sparkles",
    color: "primary",
    check: (s) => s.totalXp >= 10,
  },
  {
    id: "xp-100",
    title: "Centurion",
    description: "Reach 100 XP",
    icon: "Zap",
    color: "primary",
    check: (s) => s.totalXp >= 100,
  },
  {
    id: "xp-500",
    title: "Dedicated Learner",
    description: "Reach 500 XP",
    icon: "BookOpen",
    color: "success",
    check: (s) => s.totalXp >= 500,
  },
  {
    id: "xp-1000",
    title: "Vocabulary Master",
    description: "Reach 1000 XP",
    icon: "Crown",
    color: "reward",
    check: (s) => s.totalXp >= 1000,
  },
  {
    id: "streak-3",
    title: "On Fire",
    description: "3-day streak",
    icon: "Flame",
    color: "reward",
    check: (s) => s.currentStreak >= 3,
  },
  {
    id: "streak-7",
    title: "Weekly Warrior",
    description: "7-day streak",
    icon: "Flame",
    color: "action",
    check: (s) => s.currentStreak >= 7,
  },
  {
    id: "streak-30",
    title: "Unstoppable",
    description: "30-day streak",
    icon: "Trophy",
    color: "rare",
    check: (s) => s.longestStreak >= 30,
  },
  {
    id: "games-5",
    title: "Game On",
    description: "Play 5 games",
    icon: "Gamepad2",
    color: "primary",
    check: (s) => s.gamesPlayed >= 5,
  },
  {
    id: "games-25",
    title: "Game Master",
    description: "Play 25 games",
    icon: "Trophy",
    color: "success",
    check: (s) => s.gamesPlayed >= 25,
  },
  {
    id: "words-50",
    title: "Word Collector",
    description: "Learn 50 words",
    icon: "BookMarked",
    color: "success",
    check: (s) => s.wordsLearned >= 50,
  },
];

export function checkNewAchievements(
  stats: UserStats,
  currentAchievementIds: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (a) => a.check(stats) && !currentAchievementIds.includes(a.id)
  );
}

export function getEarnedAchievements(currentIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => currentIds.includes(a.id));
}
