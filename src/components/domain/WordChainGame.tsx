"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Card, Button, Confetti } from "@/components/ui";
import { ArrowLeft, Clock, Zap, Trophy, RotateCcw } from "lucide-react";
import { useToast } from "@/lib/toast/context";
import { validateChainWord } from "@/lib/games/word-chain-actions";
import { awardXp } from "@/lib/economy/actions";
import { trackEvent } from "@/lib/analytics/events";

const ROUND_SECONDS = 60;
const XP_PER_WORD = 10;
const XP_STREAK_BONUS = 2;

interface Props {
  initialWord: string;
}

export function WordChainGame({ initialWord }: Props) {
  const { show } = useToast();
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [currentWord, setCurrentWord] = useState(initialWord);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [xpSynced, setXpSynced] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  function startRound() {
    trackEvent("game_start", { game: "word_chain" });
    setPhase("playing");
    setCurrentWord(initialWord);
    setInput("");
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setXpSynced(0);
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    window.setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function submitWord() {
    if (phase !== "playing" || !input.trim()) return;
    const res = await validateChainWord(currentWord, input);
    if (!res.valid) {
      setFeedback(res.reason ?? "Try again.");
      setStreak(0);
      setInput("");
      return;
    }
    setFeedback(null);
    const newStreak = streak + 1;
    setStreak(newStreak);
    setMaxStreak((m) => Math.max(m, newStreak));
    const bonus = Math.min(newStreak - 1, 5) * XP_STREAK_BONUS;
    const gained = XP_PER_WORD + (newStreak > 1 ? bonus : 0);
    setScore((s) => s + 1);
    const xpResult = await awardXp(gained, "game:word-chain");
    if (xpResult) {
      setXpSynced((x) => x + gained);
      if (xpResult.levelUp) setConfetti(true);
    }
    show({
      title: `+${gained} XP`,
      description: newStreak > 1 ? `Streak ${newStreak}!` : "Nice word!",
      variant: "reward",
    });
    setCurrentWord(input.trim());
    setInput("");
  }

  useEffect(() => {
    if (phase === "done") {
      trackEvent("game_finish", {
        game: "word_chain",
        score,
        duration_seconds: ROUND_SECONDS,
      });
    }
  }, [phase, score, maxStreak]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        All games
      </Link>

      {confetti && <Confetti trigger={confetti} />}

      <Card className="p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">Word Chain</h1>
            <p className="text-sm text-ink-soft mt-1">
              Type a word from our dictionary that starts with the last letter of the previous word.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-ink-muted uppercase">Score</div>
            <div className="font-display text-2xl font-extrabold text-primary">{score}</div>
          </div>
        </div>

        {phase === "idle" && (
          <div className="text-center py-8">
            <p className="text-ink-soft mb-4">You have {ROUND_SECONDS} seconds. Ready?</p>
            <p className="font-display text-xl font-extrabold text-ink mb-6">
              Start word: <span className="text-primary">{initialWord}</span>
            </p>
            <Button variant="primary" shape="pill" size="lg" onClick={startRound}>
              Start
            </Button>
          </div>
        )}

        {phase === "playing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-ink-muted">
                <Clock className="w-4 h-4" />
                {timeLeft}s
              </span>
              <span className="flex items-center gap-1 font-bold text-reward">
                <Zap className="w-4 h-4" />
                Streak {streak}
              </span>
            </div>
            <div className="rounded-2xl bg-primary-soft border border-primary-tint p-4 text-center">
              <div className="text-xs font-bold uppercase text-primary-dark">Current word</div>
              <div className="font-display text-3xl font-extrabold text-ink mt-1">{currentWord}</div>
            </div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitWord();
              }}
              placeholder="Your word…"
              className="w-full px-4 py-3 rounded-2xl border-2 border-line text-ink font-semibold outline-none focus:border-primary"
              autoComplete="off"
              autoCapitalize="off"
            />
            {feedback && <p className="text-sm text-action-dark font-semibold">{feedback}</p>}
            <Button variant="primary" shape="pill" full onClick={() => void submitWord()}>
              Submit word
            </Button>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center py-6">
            <Trophy className="w-14 h-14 text-reward mx-auto mb-3" strokeWidth={2} />
            <h2 className="font-display text-2xl font-extrabold text-ink">Time&apos;s up!</h2>
            <p className="mt-2 text-ink-soft">
              Words: {score} · Best streak: {maxStreak}
            </p>
            {xpSynced > 0 && (
              <p className="mt-2 text-primary font-extrabold flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" />
                {xpSynced} XP from this round
              </p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="primary" shape="pill" icon={RotateCcw} onClick={startRound}>
                Play again
              </Button>
              <Link href="/games">
                <Button variant="secondary" shape="pill">
                  Games hub
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
