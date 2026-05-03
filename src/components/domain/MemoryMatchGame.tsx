"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, Button, Confetti } from "@/components/ui";
import {
  Play,
  Clock,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { useToast } from "@/lib/toast/context";
import {
  sanitizeScore,
  readGameStats,
  updateGameStats,
  GAME_STORAGE_KEYS,
  type GameStats,
} from "@/lib/games/economy";
import { awardXp } from "@/lib/economy/actions";
import { XP_REWARDS, levelFromXp } from "@/lib/economy/constants";
import { trackEvent } from "@/lib/analytics/events";
import type { MemoryWord } from "@/app/[locale]/(main)/games/memory-match/page";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface Props {
  words: MemoryWord[];
}

type GameState = "idle" | "playing" | "finished";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const CARD_PAIRS = 6;
const ROUND_DURATION = 90;
const XP_PER_MATCH = 5;
const XP_ROUND_BONUS = 20;

const LEVEL_FILTERS: Record<LevelFilter, CefrLevel[]> = {
  all: ["A1", "A2", "B1", "B2", "C1", "C2"],
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
};

interface MemoryCard {
  id: string;
  pairKey: string;
  content: string;
  type: "word" | "meaning";
  cefrLevel: CefrLevel;
  isFlipped: boolean;
  isMatched: boolean;
}

function buildDeck(words: MemoryWord[]): MemoryCard[] {
  const picked = [...words].sort(() => Math.random() - 0.5).slice(0, CARD_PAIRS);
  const cards: MemoryCard[] = [];
  picked.forEach((w) => {
    cards.push({
      id: `w-${w.slug}`,
      pairKey: w.slug,
      content: w.word,
      type: "word",
      cefrLevel: w.cefr_level,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `d-${w.slug}`,
      pairKey: w.slug,
      content: w.shortDefinition,
      type: "meaning",
      cefrLevel: w.cefr_level,
      isFlipped: false,
      isMatched: false,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export function MemoryMatchGame({ words }: Props) {
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
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [xpSynced, setXpSynced] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const filteredPool = useMemo(() => {
    const allowed = LEVEL_FILTERS[levelFilter];
    return words.filter((w) => allowed.includes(w.cefr_level));
  }, [words, levelFilter]);

  useEffect(() => {
    setStats(readGameStats(GAME_STORAGE_KEYS.memoryMatch));
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("finished");
      const updated = updateGameStats(GAME_STORAGE_KEYS.memoryMatch, {
        score: sanitizeScore(score),
        maxStreak: 0,
        xpEarned: score,
      });
      setStats(updated);
      trackEvent("game_finish", {
        game: "memory_match",
        score: sanitizeScore(score),
        duration_seconds: ROUND_DURATION,
      });
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [gameState, timeLeft, score]);

  useEffect(() => {
    if (gameState !== "finished" || xpSynced || score <= 0) return;
    setXpSynced(true);
    const cappedXp = Math.min(sanitizeScore(score), XP_REWARDS.gameMax);
    awardXp(cappedXp, "memory-match")
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

  useEffect(() => {
    if (gameState === "playing" && deck.length > 0 && matches === CARD_PAIRS) {
      setScore((s) => s + XP_ROUND_BONUS);
      setRoundsCompleted((r) => r + 1);
      const t = window.setTimeout(() => {
        setDeck(buildDeck(filteredPool));
        setFlipped([]);
        setMatches(0);
      }, 800);
      return () => window.clearTimeout(t);
    }
  }, [matches, gameState, deck.length, filteredPool]);

  useEffect(() => {
    if (flipped.length < 2) return;
    const [id1, id2] = flipped;
    const card1 = deck.find((c) => c.id === id1);
    const card2 = deck.find((c) => c.id === id2);
    if (!card1 || !card2) return;

    if (card1.pairKey === card2.pairKey && card1.type !== card2.type) {
      setDeck((d) =>
        d.map((c) =>
          c.id === id1 || c.id === id2
            ? { ...c, isMatched: true, isFlipped: true }
            : c,
        ),
      );
      setMatches((m) => m + 1);
      setScore((s) => s + XP_PER_MATCH);
      setFlipped([]);
    } else {
      const t = window.setTimeout(() => {
        setDeck((d) =>
          d.map((c) =>
            c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c,
          ),
        );
        setFlipped([]);
      }, 900);
      return () => window.clearTimeout(t);
    }
  }, [flipped, deck]);

  function startGame() {
    if (filteredPool.length < CARD_PAIRS) return;
    setScore(0);
    setRoundsCompleted(0);
    setTimeLeft(ROUND_DURATION);
    setMatches(0);
    setXpSynced(false);
    setFlipped([]);
    setDeck(buildDeck(filteredPool));
    setGameState("playing");
    trackEvent("game_start", { game: "memory_match", level: levelFilter });
  }

  function flipCard(id: string) {
    if (flipped.length >= 2) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.isMatched || card.isFlipped) return;
    setDeck((d) =>
      d.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
    );
    setFlipped((f) => [...f, id]);
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
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-rare-tint rounded-full opacity-50" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rare flex items-center justify-center shadow-soft mb-5">
              <Trophy className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-ink">
              Memory Match
            </h1>
            <p className="mt-3 text-ink-soft text-[15px] max-w-md mx-auto">
              Flip cards to find words and their meanings. Classic memory game
              with a vocabulary twist.
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
                disabled={filteredPool.length < CARD_PAIRS}
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
                Flip 2 cards — try to find a matching word and meaning pair.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">2.</span>
              <span>
                Each match = {XP_PER_MATCH} XP, complete all 6 pairs for a{" "}
                {XP_ROUND_BONUS} XP bonus.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-extrabold">3.</span>
              <span>
                Non-matching pairs flip back — remember the positions!
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
        <Card className="p-8 lg:p-10 text-center">
          <div
            className={cn(
              "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5",
              isNewBest
                ? "bg-reward shadow-solid-reward"
                : "bg-primary shadow-solid-primary",
            )}
          >
            <Trophy className="w-10 h-10 text-white" strokeWidth={2.3} />
          </div>
          {isNewBest && (
            <div className="inline-block px-3 py-1 bg-reward-soft text-reward-dark rounded-full text-xs font-extrabold uppercase tracking-widest mb-3">
              New best!
            </div>
          )}
          <h1 className="font-display text-3xl font-extrabold text-ink">
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

  const timeUrgent = timeLeft <= 15;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card
          className={cn(
            "p-4 text-center transition",
            timeUrgent && "border-action bg-action-soft animate-pulse",
          )}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted">
            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
            Time
          </div>
          <div
            className={cn(
              "mt-1 font-display text-3xl font-extrabold tabular-nums",
              timeUrgent ? "text-action-dark" : "text-ink",
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
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Matches
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-success-dark tabular-nums">
            {matches}/{CARD_PAIRS}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {deck.map((card) => {
          const showFront = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flipCard(card.id)}
              disabled={card.isFlipped || card.isMatched || flipped.length >= 2}
              className={cn(
                "aspect-[3/4] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center text-center p-3 font-medium",
                card.isMatched && "bg-success-soft border-success opacity-80",
                !card.isMatched &&
                  card.isFlipped &&
                  card.type === "word" &&
                  "bg-primary text-white border-primary shadow-solid-primary",
                !card.isMatched &&
                  card.isFlipped &&
                  card.type === "meaning" &&
                  "bg-white text-ink border-ink shadow-solid-dark",
                !card.isFlipped &&
                  "bg-white border-line hover:border-ink-muted cursor-pointer",
              )}
            >
              {showFront ? (
                <div>
                  {card.type === "word" ? (
                    <div className="font-display font-extrabold text-base">
                      {card.content}
                    </div>
                  ) : (
                    <div className="text-xs leading-snug">{card.content}</div>
                  )}
                  {card.isMatched && (
                    <Check
                      className="w-4 h-4 text-success-dark mx-auto mt-1"
                      strokeWidth={3}
                    />
                  )}
                </div>
              ) : (
                <div className="text-3xl font-display font-extrabold text-ink-muted">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
