"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { Card, Button, Confetti } from "@/components/ui";
import {
  Play,
  Trophy,
  ArrowLeft,
  RotateCcw,
  Volume2,
  Check,
  X,
  Clock,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useToast } from "@/lib/toast/context";
import { useTextToSpeech } from "@/lib/tts/useTextToSpeech";
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
import type { ListenTypeWord } from "@/app/[locale]/(main)/games/listen-type/page";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface Props {
  words: ListenTypeWord[];
}

type GameState = "idle" | "playing" | "finished";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";
type Accent = "uk" | "us";

const ROUND_DURATION = 60;
const XP_CORRECT = 10;
const XP_STREAK_BONUS = 2;
const MAX_REPLAYS = 3;

const LEVEL_FILTERS: Record<LevelFilter, CefrLevel[]> = {
  all: ["A1", "A2", "B1", "B2", "C1", "C2"],
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
};

export function ListenAndTypeGame({ words }: Props) {
  const { show: showToast } = useToast();
  const { supported, speak } = useTextToSpeech();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [accent, setAccent] = useState<Accent>("us");
  const [stats, setStats] = useState<GameStats>({
    bestScore: 0,
    bestStreak: 0,
    totalGamesPlayed: 0,
    totalXpLifetime: 0,
    lastPlayedAt: 0,
  });
  const [current, setCurrent] = useState<ListenTypeWord | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [replays, setReplays] = useState(0);
  const [xpSynced, setXpSynced] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const allowed = LEVEL_FILTERS[levelFilter];
    return words.filter((w) => allowed.includes(w.cefr_level));
  }, [words, levelFilter]);

  useEffect(() => {
    setStats(readGameStats(GAME_STORAGE_KEYS.listenAndType));
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState !== "finished" || xpSynced || score <= 0) return;
    setXpSynced(true);
    const cappedXp = Math.min(sanitizeScore(score), XP_REWARDS.gameMax);
    awardXp(cappedXp, "listen-type")
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

  function finishGame() {
    setGameState("finished");
    const updated = updateGameStats(GAME_STORAGE_KEYS.listenAndType, {
      score: sanitizeScore(score),
      maxStreak,
      xpEarned: score,
    });
    setStats(updated);
    trackEvent("game_finish", {
      game: "listen_and_type",
      score: sanitizeScore(score),
      duration_seconds: ROUND_DURATION,
    });
  }

  function pickNext(): ListenTypeWord | null {
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  function startGame() {
    if (filtered.length === 0 || !supported) return;
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(ROUND_DURATION);
    setXpSynced(false);
    setInput("");
    setFeedback(null);
    const next = pickNext();
    setCurrent(next);
    setReplays(0);
    setGameState("playing");
    trackEvent("game_start", { game: "listen_and_type", level: levelFilter });
    if (next) {
      window.setTimeout(() => {
        speak(next.word, accent);
        inputRef.current?.focus();
      }, 150);
    }
  }

  function replay() {
    if (!current) return;
    if (replays >= MAX_REPLAYS) return;
    setReplays((n) => n + 1);
    speak(current.word, accent);
    inputRef.current?.focus();
  }

  function nextQuestion(correct: boolean) {
    if (correct) {
      const bonus = streak > 0 ? streak * XP_STREAK_BONUS : 0;
      setScore((s) => s + XP_CORRECT + bonus);
      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setFeedback(correct ? "correct" : "wrong");
    window.setTimeout(() => {
      setFeedback(null);
      setInput("");
      setReplays(0);
      const next = pickNext();
      setCurrent(next);
      if (next) {
        speak(next.word, accent);
        inputRef.current?.focus();
      }
    }, 900);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || feedback) return;
    const user = input.trim().toLowerCase();
    const answer = current.word.toLowerCase();
    nextQuestion(user === answer);
  }

  if (!supported && gameState === "idle") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Browser not supported
          </h1>
          <p className="mt-2 text-ink-soft">
            This game needs browser Text-to-Speech. Try Chrome, Safari, or Edge.
          </p>
          <Link href="/games" className="inline-block mt-4">
            <Button variant="secondary" shape="pill">
              Back to games
            </Button>
          </Link>
        </Card>
      </div>
    );
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
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal-tint rounded-full opacity-50" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-teal flex items-center justify-center shadow-soft mb-5">
              <Volume2 className="w-10 h-10 text-white" strokeWidth={2.3} />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-ink">
              Listen &amp; Type
            </h1>
            <p className="mt-3 text-ink-soft text-[15px] max-w-md mx-auto">
              Hear the word, type the spelling. Train your ear and your
              fingers. 60 seconds per round.
            </p>

            {stats.bestScore > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-reward-soft text-reward-dark rounded-full font-bold">
                <Trophy className="w-4 h-4" strokeWidth={2.5} />
                Best: {stats.bestScore}
              </div>
            )}

            <div className="mt-7">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                Accent
              </div>
              <div className="inline-flex rounded-full border border-line bg-white p-1">
                {(["us", "uk"] as Accent[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAccent(a)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-bold rounded-full uppercase transition",
                      accent === a ? "bg-ink text-white" : "text-ink-soft",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
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
                Start — 60s
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
                Best streak
              </div>
              <div className="mt-1 font-display text-3xl font-extrabold text-ink">
                {maxStreak}
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

  if (!current) return null;
  const timeUrgent = timeLeft <= 10;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
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
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Score
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-ink tabular-nums">
            {score}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Streak
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-reward-dark tabular-nums">
            {streak}
          </div>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <button
          type="button"
          onClick={replay}
          disabled={replays >= MAX_REPLAYS}
          className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center transition",
            replays >= MAX_REPLAYS
              ? "bg-line text-ink-muted cursor-not-allowed"
              : "bg-primary shadow-solid-primary hover:translate-y-0.5 hover:shadow-none text-white cursor-pointer",
          )}
          aria-label="Play audio"
        >
          <Volume2 className="w-12 h-12" strokeWidth={2.3} />
        </button>
        <div className="mt-2 text-xs font-bold uppercase tracking-widest text-ink-muted">
          {replays >= MAX_REPLAYS
            ? "No replays left"
            : `${MAX_REPLAYS - replays} replay${MAX_REPLAYS - replays === 1 ? "" : "s"} left`}
        </div>

        <form onSubmit={submit} className="mt-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type what you hear..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={feedback !== null}
            className={cn(
              "w-full max-w-sm mx-auto block text-center font-display text-2xl font-extrabold px-5 py-4 rounded-2xl border-2 transition",
              feedback === "correct" &&
                "border-success bg-success-soft text-success-dark",
              feedback === "wrong" &&
                "border-action bg-action-soft text-action-dark",
              !feedback && "border-line focus:border-primary focus:outline-none",
            )}
          />
          {feedback === "wrong" && current && (
            <p className="mt-3 text-sm text-ink-soft">
              Correct:{" "}
              <span className="font-display font-extrabold text-ink">
                {current.word}
              </span>
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              type="submit"
              variant="primary"
              shape="pill"
              icon={Check}
              disabled={input.length === 0 || feedback !== null}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="secondary"
              shape="pill"
              icon={SkipForward}
              onClick={() => nextQuestion(false)}
              disabled={feedback !== null}
            >
              Skip
            </Button>
          </div>
        </form>

        {feedback === "correct" && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-success-soft text-success-dark rounded-full text-sm font-bold">
            <Check className="w-4 h-4" strokeWidth={2.5} /> Correct!
          </div>
        )}
        {feedback === "wrong" && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-action-soft text-action-dark rounded-full text-sm font-bold">
            <X className="w-4 h-4" strokeWidth={2.5} /> Not quite
          </div>
        )}
      </Card>
    </div>
  );
}
