/**
 * FluentUp Game Economy
 *
 * Tüm oyunlar için ortak puanlama ve limit sistemi.
 * localStorage-based persistence (auth gelince DB'ye taşınacak).
 */

export interface GameStats {
  bestScore: number;
  bestStreak: number;
  totalGamesPlayed: number;
  totalXpLifetime: number;
  lastPlayedAt: number;
}

const MAX_STREAK_DISPLAY = 99;
const MAX_STREAK_BONUS = 10;

/**
 * Kelime uzunluğuna göre base XP hesapla.
 */
export function calculateBaseXp(wordLength: number): number {
  if (wordLength <= 4) return 5;
  if (wordLength <= 7) return 10;
  return 15;
}

/**
 * Streak'e göre bonus XP (cap'li).
 */
export function calculateStreakBonus(streak: number): number {
  if (streak < 3) return 0;
  if (streak < 5) return 2;
  if (streak < 10) return 5;
  return MAX_STREAK_BONUS;
}

/**
 * Hint kullanımı varsa XP yarıya düşer.
 */
export function applyHintPenalty(xp: number, hintUsed: boolean): number {
  return hintUsed ? Math.floor(xp / 2) : xp;
}

/**
 * Toplam XP hesapla (bir round için).
 */
export function calculateRoundXp(options: {
  wordLength: number;
  streak: number;
  hintUsed: boolean;
}): number {
  const base = calculateBaseXp(options.wordLength);
  const bonus = calculateStreakBonus(options.streak);
  return applyHintPenalty(base + bonus, options.hintUsed);
}

/**
 * Streak'i display için cap'le (20860× gibi saçmalıkları önle).
 */
export function capStreakDisplay(streak: number): number {
  if (!Number.isFinite(streak) || streak < 0) return 0;
  return Math.min(Math.floor(streak), MAX_STREAK_DISPLAY);
}

/**
 * Score'u makul sınırlarda tut (paranoid güvence).
 * 60 saniye × 15 kelime × 25 XP = max 375 per game.
 * 9999 bir generic üst sınır, hack'li tarayıcı state'ini bastırmak için.
 */
export function sanitizeScore(score: number): number {
  if (!Number.isFinite(score) || score < 0) return 0;
  return Math.min(Math.floor(score), 9999);
}

/**
 * LocalStorage keys per game.
 */
export const GAME_STORAGE_KEYS = {
  wordScramble: "fluentup-word-scramble-stats",
  wordMatch: "fluentup-word-match-stats",
  sentenceBuilder: "fluentup-sentence-builder-stats",
  memoryMatch: "fluentup-memory-match-stats",
  hangman: "fluentup-hangman-stats",
  listenAndType: "fluentup-listen-and-type-stats",
} as const;

function emptyStats(): GameStats {
  return {
    bestScore: 0,
    bestStreak: 0,
    totalGamesPlayed: 0,
    totalXpLifetime: 0,
    lastPlayedAt: 0,
  };
}

/**
 * Generic stats reader.
 */
export function readGameStats(storageKey: string): GameStats {
  if (typeof window === "undefined") {
    return emptyStats();
  }
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw);
    return {
      bestScore: sanitizeScore(parsed.bestScore ?? 0),
      bestStreak: capStreakDisplay(parsed.bestStreak ?? 0),
      totalGamesPlayed: Math.max(0, Math.floor(parsed.totalGamesPlayed ?? 0)),
      totalXpLifetime: Math.max(0, Math.floor(parsed.totalXpLifetime ?? 0)),
      lastPlayedAt: parsed.lastPlayedAt ?? 0,
    };
  } catch {
    return emptyStats();
  }
}

/**
 * Generic stats writer. Round bittiğinde çağrılır.
 */
export function updateGameStats(
  storageKey: string,
  roundResult: {
    score: number;
    maxStreak: number;
    xpEarned: number;
  }
): GameStats {
  const current = readGameStats(storageKey);
  const updated: GameStats = {
    bestScore: Math.max(current.bestScore, sanitizeScore(roundResult.score)),
    bestStreak: Math.max(
      current.bestStreak,
      capStreakDisplay(roundResult.maxStreak)
    ),
    totalGamesPlayed: current.totalGamesPlayed + 1,
    totalXpLifetime:
      current.totalXpLifetime + Math.max(0, Math.floor(roundResult.xpEarned)),
    lastPlayedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // quota exceeded or privacy mode — stats will be in-memory only
    }
  }
  return updated;
}

/**
 * Geriye dönük uyum: eski storage key'leri oku, yeni format'a migrate et.
 */
export function migrateLegacyStats(
  newKey: string,
  legacyScoreKey: string
): void {
  if (typeof window === "undefined") return;
  try {
    const hasNew = localStorage.getItem(newKey);
    if (hasNew) return;
    const legacy = localStorage.getItem(legacyScoreKey);
    if (!legacy) return;
    const parsed = parseInt(legacy, 10);
    if (isNaN(parsed)) return;
    updateGameStats(newKey, {
      score: parsed,
      maxStreak: 0,
      xpEarned: 0,
    });
    localStorage.removeItem(legacyScoreKey);
  } catch {
    // localStorage unavailable — ignore
  }
}
