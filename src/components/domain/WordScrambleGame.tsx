"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Button, Badge, Confetti } from "@/components/ui";
import {
  Play,
  Shuffle,
  Clock,
  Trophy,
  Zap,
  RotateCcw,
  SkipForward,
  Lightbulb,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ScrambleWord } from "@/app/(main)/games/word-scramble/page";
import type { CefrLevel } from "@/lib/supabase/database.types";
import {
  calculateRoundXp,
  capStreakDisplay,
  readGameStats,
  updateGameStats,
  migrateLegacyStats,
  GAME_STORAGE_KEYS,
  type GameStats,
} from "@/lib/games/economy";
import { awardXp } from "@/lib/economy/actions";
import { XP_REWARDS, levelFromXp } from "@/lib/economy/constants";
import { useToast } from "@/lib/toast/context";

interface WordScrambleGameProps {
  words: ScrambleWord[];
}

type GameState = "idle" | "playing" | "finished";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const ROUND_DURATION = 60;
const HINT_DELAY = 20;

const LEVEL_FILTERS: Record<LevelFilter, CefrLevel[]> = {
  all: ["A1", "A2", "B1", "B2", "C1", "C2"],
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
};

const LEGACY_STORAGE_KEY = "fluentup-word-scramble-best";

function shuffleLetters(word: string): string[] {
  const letters = word.toUpperCase().split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join("") === word.toUpperCase()) {
    return shuffleLetters(word);
  }
  return letters;
}

export function WordScrambleGame({ words }: WordScrambleGameProps) {
  const { show: showToast } = useToast();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    bestScore: 0,
    bestStreak: 0,
    totalGamesPlayed: 0,
    totalXpLifetime: 0,
    lastPlayedAt: 0,
  });
  const [maxStreakThisGame, setMaxStreakThisGame] = useState(0);
  const [xpSyncResult, setXpSyncResult] = useState<{
    newAchievements: string[];
  } | null>(null);
  const [syncAttempted, setSyncAttempted] = useState(false);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [currentWord, setCurrentWord] = useState<ScrambleWord | null>(null);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [hintShown, setHintShown] = useState(false);
  const [roundTimer, setRoundTimer] = useState(0);
  const [justCorrect, setJustCorrect] = useState(false);
  const [wordsPlayed, setWordsPlayed] = useState(0);

  const filteredWords = useMemo(() => {
    const allowed = LEVEL_FILTERS[levelFilter];
    return words.filter((w) => allowed.includes(w.cefr_level));
  }, [words, levelFilter]);

  useEffect(() => {
    migrateLegacyStats(GAME_STORAGE_KEYS.wordScramble, LEGACY_STORAGE_KEY);
    setStats(readGameStats(GAME_STORAGE_KEYS.wordScramble));
  }, []);

  useEffect(() => {
    if (gameState !== "finished" || syncAttempted || score <= 0) return;
    setSyncAttempted(true);
    const cappedXp = Math.min(score, XP_REWARDS.gameMax);
    awardXp(cappedXp, "word-scramble")
      .then((result) => {
        if (!result) return;
        setXpSyncResult({ newAchievements: result.newAchievements });
        const { level: newLevel } = levelFromXp(result.newXp);
        showToast({
          title: `+${cappedXp} XP earned!`,
          description: result.levelUp
            ? `Leveled up to level ${newLevel}!`
            : undefined,
          variant: "reward",
        });
        if (result.newAchievements.length > 0) {
          showToast({
            title: "Achievement unlocked!",
            description: `${result.newAchievements.length} new ${
              result.newAchievements.length === 1 ? "badge" : "badges"
            } earned`,
            variant: "reward",
          });
        }
        if (result.levelUp || result.newAchievements.length > 0) {
          setConfettiTrigger(true);
          window.setTimeout(() => setConfettiTrigger(false), 100);
        }
      })
      .catch(() => {
        // Guest veya network hatası — sessizce yut.
      });
  }, [gameState, syncAttempted, score, showToast]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("finished");
      const updated = updateGameStats(GAME_STORAGE_KEYS.wordScramble, {
        score,
        maxStreak: maxStreakThisGame,
        xpEarned: score,
      });
      setStats(updated);
      return;
    }

    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, score, maxStreakThisGame]);

  useEffect(() => {
    if (gameState !== "playing" || !currentWord) return;
    const t = setTimeout(() => setRoundTimer((r) => r + 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, currentWord, roundTimer]);

  useEffect(() => {
    if (roundTimer >= HINT_DELAY && !hintShown && gameState === "playing") {
      setHintShown(true);
    }
  }, [roundTimer, hintShown, gameState]);

  const pickNewWord = useCallback(() => {
    if (filteredWords.length === 0) return;
    const w = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrentWord(w);
    setScrambled(shuffleLetters(w.word));
    setSelected([]);
    setHintShown(false);
    setRoundTimer(0);
  }, [filteredWords]);

  function startGame() {
    if (filteredWords.length === 0) return;
    setScore(0);
    setStreak(0);
    setMaxStreakThisGame(0);
    setTimeLeft(ROUND_DURATION);
    setWordsPlayed(0);
    setJustCorrect(false);
    setSyncAttempted(false);
    setXpSyncResult(null);
    setGameState("playing");
    pickNewWord();
  }

  const currentAttempt = selected.map((i) => scrambled[i]).join("");
  const targetWord = currentWord?.word.toUpperCase() ?? "";

  useEffect(() => {
    if (
      gameState !== "playing" ||
      !currentWord ||
      justCorrect ||
      targetWord.length === 0 ||
      selected.length !== targetWord.length ||
      currentAttempt !== targetWord
    ) {
      return;
    }

    const earned = calculateRoundXp({
      wordLength: currentWord.word.length,
      streak,
      hintUsed: hintShown,
    });
    const newStreak = streak + 1;

    setScore((s) => s + earned);
    setStreak(newStreak);
    setMaxStreakThisGame((m) => Math.max(m, newStreak));
    setWordsPlayed((w) => w + 1);
    setJustCorrect(true);

    const t = setTimeout(() => {
      setJustCorrect(false);
      pickNewWord();
    }, 600);
    return () => clearTimeout(t);
  }, [
    currentAttempt,
    targetWord,
    gameState,
    currentWord,
    justCorrect,
    selected.length,
    streak,
    hintShown,
    pickNewWord,
  ]);

  function toggleLetter(index: number) {
    if (justCorrect) return;
    if (selected.includes(index)) {
      setSelected((sel) => sel.filter((i) => i !== index));
    } else {
      setSelected((sel) => [...sel, index]);
    }
  }

  function clearSelection() {
    setSelected([]);
  }

  function skipWord() {
    setStreak(0);
    pickNewWord();
  }

  if (gameState === "idle") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          All games
        </Link>

        <Card className="p-8 lg:p-10 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-tint rounded-full opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-reward-tint rounded-full opacity-40" />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary flex items-center justify-center shadow-solid-primary mb-5">
              <Shuffle className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>

            <h1 className="font-display text-4xl font-extrabold text-ink">
              Word Scramble
            </h1>
            <p className="mt-3 text-ink-soft text-[15px] max-w-md mx-auto">
              Letters are mixed up. Tap them in the right order before time
              runs out. Build streaks for bonus XP.
            </p>

            {stats.bestScore > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-reward-soft text-reward-dark rounded-full font-bold">
                <Trophy className="w-4 h-4" strokeWidth={2.5} />
                Best: {stats.bestScore} XP
              </div>
            )}

            {stats.totalGamesPlayed > 0 && (
              <div className="mt-3 text-xs text-ink-muted">
                {stats.totalGamesPlayed} games played · Best streak:{" "}
                {stats.bestStreak}×
              </div>
            )}

            <div className="mt-7">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                Difficulty
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {(Object.keys(LEVEL_FILTERS) as LevelFilter[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold capitalize transition",
                      levelFilter === lvl
                        ? "bg-ink text-white shadow-solid-dark"
                        : "bg-white border border-line text-ink-soft hover:border-ink-muted"
                    )}
                  >
                    {lvl === "all"
                      ? "All levels"
                      : lvl === "beginner"
                      ? "A1-A2"
                      : lvl === "intermediate"
                      ? "B1-B2"
                      : "C1-C2"}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-ink-muted">
                {filteredWords.length} words available
              </div>
            </div>

            <div className="mt-7">
              <Button
                variant="primary"
                shape="pill"
                size="lg"
                icon={Play}
                onClick={startGame}
                disabled={filteredWords.length === 0}
              >
                Play — 60 seconds
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:p-6">
          <h2 className="font-display text-lg font-extrabold text-ink mb-3">
            How to play
          </h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">1.</span>
              <span>Tap scrambled letters in the correct order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">2.</span>
              <span>
                Score <span className="font-bold text-ink">+10 XP</span> per
                word, with streak bonuses up to{" "}
                <span className="font-bold text-ink">+20 XP</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">3.</span>
              <span>
                Stuck? Skip a word (streak resets) or wait 20 seconds for a
                hint
              </span>
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  if (gameState === "finished") {
    const isNewBest = score > 0 && score >= stats.bestScore;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Confetti trigger={confettiTrigger} />
        <Card className="p-8 lg:p-10 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-reward-tint rounded-full opacity-60" />

          <div className="relative z-10">
            <div
              className={cn(
                "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5",
                isNewBest
                  ? "bg-reward shadow-solid-reward"
                  : "bg-primary shadow-solid-primary"
              )}
            >
              <Trophy className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>

            {isNewBest && (
              <div className="inline-block px-3 py-1 bg-reward-soft text-reward-dark rounded-full text-xs font-extrabold uppercase tracking-widest mb-3">
                New best score!
              </div>
            )}

            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
              Time&apos;s up!
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="p-4 bg-white border-2 border-line rounded-2xl">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  Final score
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink">
                  {score}
                </div>
              </div>
              <div className="p-4 bg-white border-2 border-line rounded-2xl">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  Words solved
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink">
                  {wordsPlayed}
                </div>
              </div>
            </div>

            {stats.bestScore > 0 && !isNewBest && (
              <div className="mt-4 text-sm text-ink-muted">
                Best:{" "}
                <span className="font-bold text-ink">{stats.bestScore} XP</span>
              </div>
            )}

            {xpSyncResult && xpSyncResult.newAchievements.length > 0 && (
              <div className="mt-4 mx-auto max-w-sm p-3 bg-reward-soft border border-reward-tint rounded-xl text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-reward-dark mb-1">
                  Achievement unlocked!
                </div>
                <div className="font-display font-extrabold text-ink">
                  {xpSyncResult.newAchievements.length} new{" "}
                  {xpSyncResult.newAchievements.length === 1
                    ? "badge"
                    : "badges"}{" "}
                  earned
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Button
                variant="primary"
                shape="pill"
                size="lg"
                icon={RotateCcw}
                onClick={startGame}
              >
                Play again
              </Button>
              <Link href="/games">
                <Button variant="secondary" shape="pill" size="lg">
                  Back to games
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const timeUrgent = timeLeft <= 10;
  const firstLetterIndex = currentWord
    ? scrambled.findIndex((l) => l === currentWord.word[0].toUpperCase())
    : -1;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* HUD */}
      <div className="grid grid-cols-3 gap-3">
        <Card
          className={cn(
            "p-4 text-center transition",
            timeUrgent && "border-action bg-action-soft animate-pulse"
          )}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted">
            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
            Time
          </div>
          <div
            className={cn(
              "mt-1 font-display text-3xl font-extrabold tabular-nums",
              timeUrgent ? "text-action-dark" : "text-ink"
            )}
          >
            {timeLeft}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted">
            <Trophy className="w-3.5 h-3.5" strokeWidth={2.5} />
            Score
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-ink tabular-nums">
            {score}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted">
            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
            Streak
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-primary-dark tabular-nums">
            {capStreakDisplay(streak)}×
          </div>
        </Card>
      </div>

      {/* Definition clue */}
      {currentWord && (
        <Card className="p-4 bg-primary-soft border-primary-tint">
          <div className="flex items-start gap-3">
            <Badge color="primary" size="sm">
              {currentWord.cefr_level}
            </Badge>
            <p className="text-sm text-ink leading-relaxed flex-1">
              {currentWord.definition}
            </p>
          </div>
        </Card>
      )}

      {/* User's current attempt */}
      <Card
        className={cn(
          "p-6 transition",
          justCorrect && "border-success bg-success-soft"
        )}
      >
        <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 text-center">
          Your answer
        </div>
        <div className="flex items-center justify-center gap-2 min-h-[60px] flex-wrap">
          {selected.length === 0 ? (
            <span className="text-ink-muted text-sm">
              Tap letters below to build the word
            </span>
          ) : (
            selected.map((letterIdx, i) => (
              <div
                key={`sel-${i}`}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center font-display font-extrabold text-lg border-2",
                  justCorrect
                    ? "bg-success text-white border-success shadow-solid-success"
                    : "bg-primary text-white border-primary shadow-solid-primary"
                )}
              >
                {scrambled[letterIdx]}
              </div>
            ))
          )}
          {justCorrect && (
            <Check className="w-8 h-8 text-success ml-2" strokeWidth={3} />
          )}
        </div>
      </Card>

      {/* Scrambled letters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Scrambled letters
          </div>
          {hintShown && (
            <div className="flex items-center gap-1 text-xs font-bold text-reward-dark">
              <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.5} />
              Hint: first letter
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {scrambled.map((letter, i) => {
            const isUsed = selected.includes(i);
            const isHintHighlight = hintShown && i === firstLetterIndex;
            return (
              <button
                key={`scr-${i}`}
                onClick={() => toggleLetter(i)}
                disabled={isUsed || justCorrect}
                className={cn(
                  "w-12 h-12 rounded-xl font-display font-extrabold text-lg transition border-2",
                  isUsed
                    ? "bg-line-soft text-ink-muted border-line cursor-not-allowed"
                    : isHintHighlight
                    ? "bg-reward text-white border-reward shadow-solid-reward hover:-translate-y-0.5"
                    : "bg-white text-ink border-ink hover:-translate-y-0.5 shadow-solid-dark"
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          shape="pill"
          size="md"
          icon={RotateCcw}
          onClick={clearSelection}
          disabled={selected.length === 0 || justCorrect}
        >
          Clear
        </Button>
        <Button
          variant="secondary"
          shape="pill"
          size="md"
          icon={SkipForward}
          onClick={skipWord}
          disabled={justCorrect}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
