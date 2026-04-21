"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, Button, Confetti } from "@/components/ui";
import { ArrowLeft, Clock, Zap, Trophy, RotateCcw } from "lucide-react";
import { useToast } from "@/lib/toast/context";
import type { QuizQuestion } from "@/lib/supabase/database.types";
import { awardXp } from "@/lib/economy/actions";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/cn";

const GAME_SECONDS = 60;
const PER_QUESTION_SECONDS = 10;
const XP_CORRECT = 10;
const STREAK_BONUS = 3;

export type GrammarChallengeItem = QuizQuestion & { key: string };

interface Props {
  questions: GrammarChallengeItem[];
}

type Phase = "idle" | "playing" | "done";

export function GrammarChallengeGame({ questions }: Props) {
  const { show } = useToast();
  const [phase, setPhase] = useState<Phase>("idle");
  const [gameLeft, setGameLeft] = useState(GAME_SECONDS);
  const [qLeft, setQLeft] = useState(PER_QUESTION_SECONDS);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [xpTotal, setXpTotal] = useState(0);
  const [confetti, setConfetti] = useState(false);

  const gameRef = useRef(GAME_SECONDS);
  const qRef = useRef(PER_QUESTION_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (phase !== "done") return;
    trackEvent("game_finish", {
      game: "grammar_challenge",
      score: scoreRef.current,
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    stop();
    timerRef.current = setInterval(() => {
      gameRef.current -= 1;
      qRef.current -= 1;
      setGameLeft(gameRef.current);
      setQLeft(qRef.current);

      if (gameRef.current <= 0) {
        stop();
        setPhase("done");
        return;
      }

      if (qRef.current <= 0) {
        setStreak(0);
        setPicked(null);
        setQIndex((i) => {
          if (i + 1 >= questions.length) {
            stop();
            setPhase("done");
            return i;
          }
          qRef.current = PER_QUESTION_SECONDS;
          setQLeft(PER_QUESTION_SECONDS);
          return i + 1;
        });
      }
    }, 1000);

    return () => stop();
  }, [phase, questions.length, stop]);

  function startGame() {
    trackEvent("game_start", { game: "grammar_challenge" });
    gameRef.current = GAME_SECONDS;
    qRef.current = PER_QUESTION_SECONDS;
    setGameLeft(GAME_SECONDS);
    setQLeft(PER_QUESTION_SECONDS);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
    setXpTotal(0);
    setPhase("playing");
  }

  const advanceAfterAnswer = useCallback(() => {
    setPicked(null);
    qRef.current = PER_QUESTION_SECONDS;
    setQLeft(PER_QUESTION_SECONDS);
    setQIndex((i) => {
      if (i + 1 >= questions.length) {
        stop();
        setPhase("done");
        return i;
      }
      return i + 1;
    });
  }, [questions.length, stop]);

  async function onPick(opt: number) {
    if (picked !== null || phase !== "playing") return;
    const q = questions[qIndex];
    if (!q) return;
    setPicked(opt);
    const correct = opt === q.correct_index;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? STREAK_BONUS : 0;
      const gained = XP_CORRECT + bonus;
      const res = await awardXp(gained, "game:grammar-challenge");
      setScore((sc) => sc + 1);
      setXpTotal((x) => x + gained);
      if (res?.levelUp) setConfetti(true);
      show({
        title: `+${gained} XP`,
        description: bonus > 0 ? "Streak bonus!" : "Correct!",
        variant: "reward",
      });
    } else {
      setStreak(0);
    }

    window.setTimeout(() => {
      advanceAfterAnswer();
    }, 450);
  }

  const q = questions[qIndex];

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
        <h1 className="font-display text-2xl font-extrabold text-ink">Grammar Challenge</h1>
        <p className="text-sm text-ink-soft mt-1 mb-6">
          Answer as many as you can in {GAME_SECONDS}s. Each question has up to {PER_QUESTION_SECONDS}s
          before it skips. +{XP_CORRECT} XP per correct; +{STREAK_BONUS} XP after 3 in a row.
        </p>

        {phase === "idle" && (
          <div className="text-center py-8">
            <Button variant="primary" shape="pill" size="lg" onClick={startGame}>
              Start
            </Button>
          </div>
        )}

        {phase === "playing" && q && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-1 font-bold text-primary">
                <Clock className="w-4 h-4" />
                Game {gameLeft}s
              </span>
              <span className="flex items-center gap-1 text-ink-muted">
                <Clock className="w-4 h-4" />
                Question {qLeft}s
              </span>
              <span className="flex items-center gap-1 font-bold text-reward">
                <Zap className="w-4 h-4" />
                {score} correct · streak {streak}
              </span>
            </div>
            <p className="font-display text-lg font-extrabold text-ink">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => void onPick(idx)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl border-2 border-line font-semibold text-sm hover:border-primary hover:bg-primary-soft",
                    picked !== null &&
                      idx === q.correct_index &&
                      "border-success bg-success-soft",
                    picked !== null &&
                      picked === idx &&
                      idx !== q.correct_index &&
                      "border-action bg-action-soft",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center py-6">
            <Trophy className="w-14 h-14 text-reward mx-auto mb-3" strokeWidth={2} />
            <h2 className="font-display text-2xl font-extrabold text-ink">Round over</h2>
            <p className="mt-2 text-ink-soft">Correct answers: {score}</p>
            {xpTotal > 0 && (
              <p className="mt-2 font-extrabold text-primary flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" />
                {xpTotal} XP earned
              </p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="primary"
                shape="pill"
                icon={RotateCcw}
                onClick={() => {
                  setPhase("idle");
                }}
              >
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
