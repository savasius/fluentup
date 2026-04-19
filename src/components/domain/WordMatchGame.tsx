"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Play,
  Link2,
  Clock,
  Trophy,
  Target,
  RotateCcw,
  ArrowLeft,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { MatchWord } from "@/app/(main)/games/match/page";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface WordMatchGameProps {
  words: MatchWord[];
}

type GameState = "idle" | "playing" | "finished";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const ROUND_DURATION = 60;
const ROUND_SIZE = 6;
const POINTS_PER_ROUND = 10;
const PENALTY_PER_WRONG = 1;

const LEVEL_FILTERS: Record<LevelFilter, CefrLevel[]> = {
  all: ["A1", "A2", "B1", "B2", "C1", "C2"],
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
};

const STORAGE_KEY = "fluentup-word-match-best";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRoundWords(pool: MatchWord[]): MatchWord[] {
  return shuffleArray(pool).slice(0, ROUND_SIZE);
}

export function WordMatchGame({ words }: WordMatchGameProps) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [bestScore, setBestScore] = useState(0);

  const [score, setScore] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);

  const [roundWords, setRoundWords] = useState<MatchWord[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<MatchWord[]>([]);
  const [matchedSlugs, setMatchedSlugs] = useState<Set<string>>(new Set());

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{
    word: string;
    def: string;
  } | null>(null);

  const filteredPool = useMemo(() => {
    const allowed = LEVEL_FILTERS[levelFilter];
    return words.filter((w) => allowed.includes(w.cefr_level));
  }, [words, levelFilter]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) setBestScore(parsed);
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("finished");
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem(STORAGE_KEY, String(score));
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, score, bestScore]);

  const startNewRound = useCallback(() => {
    if (filteredPool.length < ROUND_SIZE) return;
    const picked = pickRoundWords(filteredPool);
    setRoundWords(picked);
    setShuffledDefs(shuffleArray(picked));
    setMatchedSlugs(new Set());
    setSelectedWord(null);
    setWrongPair(null);
  }, [filteredPool]);

  useEffect(() => {
    if (
      gameState === "playing" &&
      matchedSlugs.size === ROUND_SIZE &&
      roundWords.length > 0
    ) {
      setScore((s) => s + POINTS_PER_ROUND);
      setRoundsCompleted((r) => r + 1);
      const t = setTimeout(() => {
        startNewRound();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [matchedSlugs, gameState, roundWords.length, startNewRound]);

  function startGame() {
    if (filteredPool.length < ROUND_SIZE) return;
    setScore(0);
    setRoundsCompleted(0);
    setTimeLeft(ROUND_DURATION);
    setGameState("playing");
    const picked = pickRoundWords(filteredPool);
    setRoundWords(picked);
    setShuffledDefs(shuffleArray(picked));
    setMatchedSlugs(new Set());
    setSelectedWord(null);
    setWrongPair(null);
  }

  function handleWordClick(slug: string) {
    if (matchedSlugs.has(slug)) return;
    if (wrongPair) return;
    setSelectedWord(slug);
  }

  function handleDefClick(slug: string) {
    if (matchedSlugs.has(slug)) return;
    if (!selectedWord) return;
    if (wrongPair) return;

    if (selectedWord === slug) {
      setMatchedSlugs((set) => new Set(set).add(slug));
      setSelectedWord(null);
    } else {
      setWrongPair({ word: selectedWord, def: slug });
      setScore((s) => Math.max(0, s - PENALTY_PER_WRONG));
      setTimeout(() => {
        setWrongPair(null);
        setSelectedWord(null);
      }, 500);
    }
  }

  const progress = matchedSlugs.size;

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
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-success-tint rounded-full opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-tint rounded-full opacity-40" />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-success flex items-center justify-center shadow-solid-success mb-5">
              <Link2 className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>

            <h1 className="font-display text-4xl font-extrabold text-ink">
              Word Match
            </h1>
            <p className="mt-3 text-ink-soft text-[15px] max-w-md mx-auto">
              Match each word with its correct meaning. Complete as many rounds
              as you can in 60 seconds.
            </p>

            {bestScore > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-reward-soft text-reward-dark rounded-full font-bold">
                <Trophy className="w-4 h-4" strokeWidth={2.5} />
                Best: {bestScore} points
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
                {filteredPool.length} words available
              </div>
            </div>

            <div className="mt-7">
              <Button
                variant="success"
                shape="pill"
                size="lg"
                icon={Play}
                onClick={startGame}
                disabled={filteredPool.length < ROUND_SIZE}
              >
                Play — 60 seconds
              </Button>
              {filteredPool.length < ROUND_SIZE && (
                <div className="mt-2 text-xs text-action-dark">
                  Not enough words in this level. Try &ldquo;All levels&rdquo;.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:p-6">
          <h2 className="font-display text-lg font-extrabold text-ink mb-3">
            How to play
          </h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-success font-extrabold">1.</span>
              <span>
                Tap a word on the left, then its meaning on the right
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-extrabold">2.</span>
              <span>
                Match all 6 pairs to complete a round and earn{" "}
                <span className="font-bold text-ink">+10 points</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-extrabold">3.</span>
              <span>
                Wrong match costs{" "}
                <span className="font-bold text-action-dark">-1 point</span> —
                be careful!
              </span>
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  if (gameState === "finished") {
    const isNewBest = score > 0 && score >= bestScore;
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
                  : "bg-success shadow-solid-success"
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
                  Score
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink">
                  {score}
                </div>
              </div>
              <div className="p-4 bg-white border-2 border-line rounded-2xl">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  Rounds
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink">
                  {roundsCompleted}
                </div>
              </div>
            </div>

            {bestScore > 0 && !isNewBest && (
              <div className="mt-4 text-sm text-ink-muted">
                Best:{" "}
                <span className="font-bold text-ink">{bestScore} points</span>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Button
                variant="success"
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

  return (
    <div className="max-w-3xl mx-auto space-y-4">
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
            <Target className="w-3.5 h-3.5" strokeWidth={2.5} />
            Round
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-success-dark tabular-nums">
            {progress}/{ROUND_SIZE}
          </div>
        </Card>
      </div>

      {/* Game grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {/* Words column */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted px-2">
            Words
          </div>
          {roundWords.map((w) => {
            const isMatched = matchedSlugs.has(w.slug);
            const isSelected = selectedWord === w.slug;
            const isWrong = wrongPair?.word === w.slug;
            return (
              <button
                key={w.slug}
                onClick={() => handleWordClick(w.slug)}
                disabled={isMatched}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-left transition flex items-center gap-3",
                  isMatched &&
                    "bg-success-soft border-success opacity-60 cursor-not-allowed",
                  !isMatched &&
                    isSelected &&
                    "bg-primary text-white border-primary shadow-solid-primary",
                  !isMatched &&
                    isWrong &&
                    "bg-action-soft border-action animate-pulse",
                  !isMatched &&
                    !isSelected &&
                    !isWrong &&
                    "bg-white border-line hover:border-ink-muted"
                )}
              >
                <Badge color={isSelected ? "slate" : "primary"} size="sm">
                  {w.cefr_level}
                </Badge>
                <span className="font-display font-extrabold text-lg flex-1">
                  {w.word}
                </span>
                {isMatched && (
                  <Check
                    className="w-5 h-5 text-success-dark"
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Definitions column */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted px-2">
            Meanings
          </div>
          {shuffledDefs.map((d) => {
            const isMatched = matchedSlugs.has(d.slug);
            const isWrong = wrongPair?.def === d.slug;
            const isReadyToMatch = !!selectedWord && !isMatched;
            return (
              <button
                key={d.slug}
                onClick={() => handleDefClick(d.slug)}
                disabled={isMatched || !selectedWord}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-left transition text-sm leading-relaxed",
                  isMatched &&
                    "bg-success-soft border-success opacity-60 cursor-not-allowed line-through",
                  !isMatched &&
                    isWrong &&
                    "bg-action-soft border-action animate-pulse",
                  !isMatched &&
                    !isWrong &&
                    isReadyToMatch &&
                    "bg-white border-line hover:border-primary hover:bg-primary-soft cursor-pointer",
                  !isMatched &&
                    !isWrong &&
                    !isReadyToMatch &&
                    "bg-white border-line opacity-70 cursor-not-allowed"
                )}
              >
                {d.shortDefinition}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      {!selectedWord && progress < ROUND_SIZE && (
        <div className="text-center text-sm text-ink-muted">
          Tap a word first, then tap its meaning
        </div>
      )}
    </div>
  );
}
