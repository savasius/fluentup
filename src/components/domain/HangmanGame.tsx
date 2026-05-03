"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { Card, Button, Confetti } from "@/components/ui";
import {
  Play,
  Trophy,
  ArrowLeft,
  RotateCcw,
  Heart,
  HeartCrack,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useToast } from "@/lib/toast/context";
import {
  readGameStats,
  updateGameStats,
  sanitizeScore,
  GAME_STORAGE_KEYS,
  type GameStats,
} from "@/lib/games/economy";
import { awardXp } from "@/lib/economy/actions";
import { XP_REWARDS, levelFromXp } from "@/lib/economy/constants";
import { trackEvent } from "@/lib/analytics/events";
import type { HangmanWord } from "@/app/[locale]/(main)/games/hangman/page";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface Props {
  words: HangmanWord[];
}

type GameState = "idle" | "playing" | "finished";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const MAX_LIVES = 6;
const XP_WIN = 15;
const XP_LIVES_BONUS = 3;

const LEVEL_FILTERS: Record<LevelFilter, CefrLevel[]> = {
  all: ["A1", "A2", "B1", "B2", "C1", "C2"],
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function HangmanGame({ words }: Props) {
  const { show: showToast } = useToast();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [stats, setStats] = useState<GameStats>({
    bestScore: 0,
    bestStreak: 0,
    totalGamesPlayed: 0,
    totalXpLifetime: 0,
    lastPlayedAt: 0,
  });
  const [currentWord, setCurrentWord] = useState<HangmanWord | null>(null);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(MAX_LIVES);
  const [wordsWon, setWordsWon] = useState(0);
  const [score, setScore] = useState(0);
  const [xpSynced, setXpSynced] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const filtered = useMemo(() => {
    const allowed = LEVEL_FILTERS[levelFilter];
    return words.filter((w) => allowed.includes(w.cefr_level));
  }, [words, levelFilter]);

  useEffect(() => {
    setStats(readGameStats(GAME_STORAGE_KEYS.hangman));
  }, []);

  const wordLetters = useMemo(
    () => (currentWord ? new Set(currentWord.word.split("")) : new Set<string>()),
    [currentWord],
  );

  const won = useMemo(() => {
    if (!currentWord) return false;
    return [...wordLetters].every((l) => guessed.has(l));
  }, [currentWord, wordLetters, guessed]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (won) {
      const xp = XP_WIN + lives * XP_LIVES_BONUS;
      setScore((s) => s + xp);
      setWordsWon((n) => n + 1);
      setRevealed(true);
      const t = window.setTimeout(() => {
        nextWord();
      }, 1400);
      return () => window.clearTimeout(t);
    }
    if (lives <= 0) {
      setRevealed(true);
      finishGame(score);
    }
  }, [won, lives, gameState]);

  useEffect(() => {
    if (gameState !== "finished" || xpSynced || score <= 0) return;
    setXpSynced(true);
    const cappedXp = Math.min(sanitizeScore(score), XP_REWARDS.gameMax);
    awardXp(cappedXp, "hangman")
      .then((r) => {
        if (!r) return;
        const { level: newLevel } = levelFromXp(r.newXp);
        showToast({
          title: `+${cappedXp} XP earned!`,
          description: r.levelUp
            ? `Leveled up to level ${newLevel}!`
            : undefined,
          variant: "reward",
        });
        if (r.newAchievements.length > 0) {
          showToast({
            title: "Achievement unlocked!",
            description: `${r.newAchievements.length} new ${
              r.newAchievements.length === 1 ? "badge" : "badges"
            } earned`,
            variant: "reward",
          });
        }
        if (r.levelUp || r.newAchievements.length > 0) {
          setConfettiTrigger(true);
          window.setTimeout(() => setConfettiTrigger(false), 100);
        }
      })
      .catch(() => {});
  }, [gameState, xpSynced, score, showToast]);

  function pickNext(): HangmanWord | null {
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  function startGame() {
    if (filtered.length === 0) return;
    setScore(0);
    setLives(MAX_LIVES);
    setGuessed(new Set());
    setWordsWon(0);
    setXpSynced(false);
    setRevealed(false);
    setCurrentWord(pickNext());
    setGameState("playing");
    trackEvent("game_start", { game: "hangman", level: levelFilter });
  }

  function nextWord() {
    setGuessed(new Set());
    setLives(MAX_LIVES);
    setRevealed(false);
    setCurrentWord(pickNext());
  }

  function finishGame(finalScore: number) {
    setGameState("finished");
    const updated = updateGameStats(GAME_STORAGE_KEYS.hangman, {
      score: sanitizeScore(finalScore),
      maxStreak: wordsWon,
      xpEarned: finalScore,
    });
    setStats(updated);
    trackEvent("game_finish", {
      game: "hangman",
      score: sanitizeScore(finalScore),
    });
  }

  function guessLetter(letter: string) {
    if (revealed || !currentWord || guessed.has(letter)) return;
    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);
    if (!wordLetters.has(letter)) {
      setLives((l) => l - 1);
    }
  }

  useEffect(() => {
    if (gameState !== "playing") return;
    function onKey(e: KeyboardEvent) {
      if (revealed) return;
      const k = e.key.toLowerCase();
      if (k.length === 1 && /[a-z]/.test(k)) guessLetter(k);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-action-soft rounded-full opacity-50" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-action flex items-center justify-center shadow-solid-action mb-5">
              <Heart className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-ink">
              Hangman
            </h1>
            <p className="mt-3 text-ink-soft text-[15px] max-w-md mx-auto">
              Classic word guessing game. You have 6 lives. Each wrong guess
              costs one. Solve as many words as possible.
            </p>

            {stats.bestScore > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-reward-soft text-reward-dark rounded-full font-bold">
                <Trophy className="w-4 h-4" strokeWidth={2.5} />
                Best: {stats.bestScore}
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
                    type="button"
                    onClick={() => setLevelFilter(lvl)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold capitalize transition",
                      levelFilter === lvl
                        ? "bg-ink text-white shadow-solid-dark"
                        : "bg-white border border-line text-ink-soft hover:border-ink-muted",
                    )}
                  >
                    {lvl === "all"
                      ? "All"
                      : lvl === "beginner"
                        ? "A1-A2"
                        : lvl === "intermediate"
                          ? "B1-B2"
                          : "C1-C2"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <Button
                variant="primary"
                shape="pill"
                size="lg"
                icon={Play}
                onClick={startGame}
                disabled={filtered.length === 0}
              >
                Start game
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === "finished") {
    const isNewBest = score > 0 && score >= stats.bestScore;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Confetti trigger={confettiTrigger} />
        <Card className="p-8 lg:p-10 text-center">
          <div
            className={cn(
              "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5",
              isNewBest
                ? "bg-reward shadow-solid-reward"
                : "bg-action shadow-solid-action",
            )}
          >
            <HeartCrack className="w-10 h-10 text-white" strokeWidth={2.3} />
          </div>
          {isNewBest && (
            <div className="inline-block px-3 py-1 bg-reward-soft text-reward-dark rounded-full text-xs font-extrabold uppercase tracking-widest mb-3">
              New best!
            </div>
          )}
          <h1 className="font-display text-3xl font-extrabold text-ink">
            Game over
          </h1>
          {currentWord && (
            <p className="mt-2 text-ink-soft text-sm">
              The word was{" "}
              <span className="font-display font-extrabold text-ink">
                {currentWord.word}
              </span>
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="p-4 bg-white border-2 border-line rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                Score
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
                {wordsWon}
              </div>
            </div>
          </div>
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
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  const wrongLetters = [...guessed].filter((g) => !wordLetters.has(g));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Lives
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-action-dark tabular-nums">
            {lives}/{MAX_LIVES}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Score
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-ink tabular-nums">
            {score}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Solved
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-success-dark tabular-nums">
            {wordsWon}
          </div>
        </Card>
      </div>

      <Card className="p-6 lg:p-8 text-center">
        <div className="flex items-center justify-center gap-1 mb-4">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} aria-hidden>
              {i < lives ? (
                <Heart
                  className="w-6 h-6 text-action fill-action"
                  strokeWidth={2}
                />
              ) : (
                <HeartCrack
                  className="w-6 h-6 text-ink-muted opacity-40"
                  strokeWidth={2}
                />
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {currentWord.word.split("").map((letter, idx) => {
            const show = guessed.has(letter) || revealed;
            const isMissed = revealed && !guessed.has(letter);
            return (
              <div
                key={idx}
                className={cn(
                  "w-10 h-12 sm:w-12 sm:h-14 border-b-4 rounded-sm flex items-center justify-center font-display text-2xl sm:text-3xl font-extrabold uppercase",
                  show ? "border-primary" : "border-ink-muted",
                  isMissed ? "text-action" : "text-ink",
                )}
              >
                {show ? letter : ""}
              </div>
            );
          })}
        </div>

        {currentWord.definition && (
          <p className="mt-5 text-sm text-ink-soft italic max-w-md mx-auto">
            Hint: {currentWord.definition.slice(0, 120)}
            {currentWord.definition.length > 120 ? "…" : ""}
          </p>
        )}

        {wrongLetters.length > 0 && (
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
            Wrong: {wrongLetters.join(", ")}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
        {ALPHABET.map((letter) => {
          const isGuessed = guessed.has(letter);
          const isHit = isGuessed && wordLetters.has(letter);
          const isMiss = isGuessed && !wordLetters.has(letter);
          return (
            <button
              key={letter}
              type="button"
              onClick={() => guessLetter(letter)}
              disabled={isGuessed || revealed}
              className={cn(
                "aspect-square rounded-lg font-display font-extrabold uppercase text-base sm:text-lg transition",
                !isGuessed &&
                  "bg-white border-2 border-line hover:border-primary hover:bg-primary-tint text-ink cursor-pointer",
                isHit && "bg-success text-white",
                isMiss && "bg-action-soft text-action-dark",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          variant="secondary"
          shape="pill"
          size="sm"
          onClick={() => finishGame(score)}
        >
          Give up
        </Button>
      </div>
    </div>
  );
}
