"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Play,
  Clock,
  Trophy,
  Zap,
  RotateCcw,
  SkipForward,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getShuffledWords, type SentenceData } from "@/lib/games/sentences";
import {
  calculateBaseXp,
  calculateStreakBonus,
  capStreakDisplay,
  sanitizeScore,
  readGameStats,
  updateGameStats,
  GAME_STORAGE_KEYS,
  type GameStats,
} from "@/lib/games/economy";
import { awardXp } from "@/lib/economy/actions";
import { XP_REWARDS } from "@/lib/economy/constants";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface Props {
  sentences: SentenceData[];
}

type GameState = "idle" | "playing" | "finished";
type LevelFilter = "all" | "beginner" | "intermediate";

const ROUND_DURATION = 90;

const LEVEL_FILTERS: Record<LevelFilter, CefrLevel[]> = {
  all: ["A1", "A2", "B1", "B2", "C1"],
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
};

export function SentenceBuilderGame({ sentences }: Props) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [stats, setStats] = useState<GameStats>({
    bestScore: 0,
    bestStreak: 0,
    totalGamesPlayed: 0,
    totalXpLifetime: 0,
    lastPlayedAt: 0,
  });

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [sentencesSolved, setSentencesSolved] = useState(0);

  const [currentSentence, setCurrentSentence] = useState<SentenceData | null>(
    null
  );
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [justCorrect, setJustCorrect] = useState(false);
  const [xpSyncResult, setXpSyncResult] = useState<{
    newAchievements: string[];
  } | null>(null);
  const [syncAttempted, setSyncAttempted] = useState(false);

  const filteredSentences = useMemo(() => {
    const allowed = LEVEL_FILTERS[levelFilter];
    return sentences.filter((s) => allowed.includes(s.cefrLevel));
  }, [sentences, levelFilter]);

  useEffect(() => {
    setStats(readGameStats(GAME_STORAGE_KEYS.sentenceBuilder));
  }, []);

  useEffect(() => {
    if (gameState !== "finished" || syncAttempted || score <= 0) return;
    setSyncAttempted(true);
    const cappedXp = Math.min(sanitizeScore(score), XP_REWARDS.gameMax);
    awardXp(cappedXp, "sentence-builder")
      .then((result) => {
        if (result) {
          setXpSyncResult({ newAchievements: result.newAchievements });
        }
      })
      .catch(() => {
        // Guest veya network hatası.
      });
  }, [gameState, syncAttempted, score]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("finished");
      const safeScore = sanitizeScore(score);
      const updated = updateGameStats(GAME_STORAGE_KEYS.sentenceBuilder, {
        score: safeScore,
        maxStreak,
        xpEarned: safeScore,
      });
      setStats(updated);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, score, maxStreak]);

  const pickNewSentence = useCallback(() => {
    if (filteredSentences.length === 0) return;
    const s =
      filteredSentences[Math.floor(Math.random() * filteredSentences.length)];
    setCurrentSentence(s);
    setShuffledWords(getShuffledWords(s.sentence));
    setSelectedOrder([]);
  }, [filteredSentences]);

  function startGame() {
    if (filteredSentences.length === 0) return;
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(ROUND_DURATION);
    setSentencesSolved(0);
    setJustCorrect(false);
    setSyncAttempted(false);
    setXpSyncResult(null);
    setGameState("playing");
    pickNewSentence();
  }

  const currentAttempt = selectedOrder.map((i) => shuffledWords[i]).join(" ");
  const target = currentSentence?.sentence ?? "";

  useEffect(() => {
    if (
      gameState !== "playing" ||
      !currentSentence ||
      justCorrect ||
      target.length === 0 ||
      selectedOrder.length !== shuffledWords.length ||
      currentAttempt !== target
    ) {
      return;
    }

    const wordCount = target.split(" ").length;
    const base = calculateBaseXp(wordCount * 2);
    const bonus = calculateStreakBonus(streak);
    const earned = base + bonus;
    const newStreak = streak + 1;

    setScore((s) => s + earned);
    setStreak(newStreak);
    setMaxStreak((m) => Math.max(m, newStreak));
    setSentencesSolved((n) => n + 1);
    setJustCorrect(true);

    const t = setTimeout(() => {
      setJustCorrect(false);
      pickNewSentence();
    }, 700);
    return () => clearTimeout(t);
  }, [
    currentAttempt,
    target,
    gameState,
    currentSentence,
    justCorrect,
    selectedOrder.length,
    shuffledWords.length,
    streak,
    pickNewSentence,
  ]);

  function toggleWord(index: number) {
    if (justCorrect) return;
    if (selectedOrder.includes(index)) {
      setSelectedOrder((o) => o.filter((i) => i !== index));
    } else {
      setSelectedOrder((o) => [...o, index]);
    }
  }

  function clearSelection() {
    setSelectedOrder([]);
  }

  function skipSentence() {
    setStreak(0);
    pickNewSentence();
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
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-reward-tint rounded-full opacity-50" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-reward flex items-center justify-center shadow-solid-reward mb-5">
              <Trophy className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-ink">
              Sentence Builder
            </h1>
            <p className="mt-3 text-ink-soft text-[15px] max-w-md mx-auto">
              Arrange words to build the correct English sentence. Learn grammar
              through play.
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
                      ? "All"
                      : lvl === "beginner"
                      ? "A1-A2"
                      : "B1-B2"}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-ink-muted">
                {filteredSentences.length} sentences available
              </div>
            </div>

            <div className="mt-7">
              <Button
                variant="primary"
                shape="pill"
                size="lg"
                icon={Play}
                onClick={startGame}
                disabled={filteredSentences.length === 0}
              >
                Play — 90 seconds
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
              <span>
                Tap words in the correct order to build the sentence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">2.</span>
              <span>
                Earn XP per correct sentence + bonus for long streaks
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">3.</span>
              <span>Skip if stuck (streak resets)</span>
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
                New best!
              </div>
            )}
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
              Time&apos;s up!
            </h1>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="p-4 bg-white border-2 border-line rounded-2xl">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  Score
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink tabular-nums">
                  {score}
                </div>
              </div>
              <div className="p-4 bg-white border-2 border-line rounded-2xl">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  Sentences
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink tabular-nums">
                  {sentencesSolved}
                </div>
              </div>
            </div>

            {stats.bestScore > 0 && !isNewBest && (
              <div className="mt-4 text-sm text-ink-muted">
                Best:{" "}
                <span className="font-bold text-ink">
                  {stats.bestScore} XP
                </span>
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

  const timeUrgent = timeLeft <= 15;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
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

      {currentSentence && (
        <Card className="p-4 bg-primary-soft border-primary-tint">
          <div className="flex items-center gap-3">
            <Badge color="primary" size="sm">
              {currentSentence.cefrLevel}
            </Badge>
            <p className="text-sm text-ink">Build the correct sentence</p>
          </div>
        </Card>
      )}

      <Card
        className={cn(
          "p-6 transition",
          justCorrect && "border-success bg-success-soft"
        )}
      >
        <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 text-center">
          Your sentence
        </div>
        <div className="flex items-center justify-center gap-2 min-h-[60px] flex-wrap">
          {selectedOrder.length === 0 ? (
            <span className="text-ink-muted text-sm">
              Tap words below to build the sentence
            </span>
          ) : (
            selectedOrder.map((idx, i) => (
              <div
                key={`sel-${i}`}
                className={cn(
                  "px-3 py-2 rounded-xl font-display font-extrabold border-2",
                  justCorrect
                    ? "bg-success text-white border-success shadow-solid-success"
                    : "bg-primary text-white border-primary shadow-solid-primary"
                )}
              >
                {shuffledWords[idx]}
              </div>
            ))
          )}
          {justCorrect && (
            <Check className="w-8 h-8 text-success ml-2" strokeWidth={3} />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">
          Words
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {shuffledWords.map((word, i) => {
            const isUsed = selectedOrder.includes(i);
            return (
              <button
                key={`w-${i}`}
                onClick={() => toggleWord(i)}
                disabled={isUsed || justCorrect}
                className={cn(
                  "px-3 py-2 rounded-xl font-display font-extrabold transition border-2",
                  isUsed
                    ? "bg-line-soft text-ink-muted border-line cursor-not-allowed"
                    : "bg-white text-ink border-ink hover:-translate-y-0.5 shadow-solid-dark"
                )}
              >
                {word}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          shape="pill"
          size="md"
          icon={RotateCcw}
          onClick={clearSelection}
          disabled={selectedOrder.length === 0 || justCorrect}
        >
          Clear
        </Button>
        <Button
          variant="secondary"
          shape="pill"
          size="md"
          icon={SkipForward}
          onClick={skipSentence}
          disabled={justCorrect}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
