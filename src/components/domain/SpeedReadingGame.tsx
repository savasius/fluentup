"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, Button, Confetti } from "@/components/ui";
import { ArrowLeft, Clock, Zap, Trophy, RotateCcw } from "lucide-react";
import { useToast } from "@/lib/toast/context";
import type { SpeedParagraph } from "@/lib/games/paragraphs";
import { awardXp } from "@/lib/economy/actions";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/cn";

const READ_SECONDS = 45;
const QUESTION_SECONDS = 15;
const XP_CORRECT = 15;

interface Props {
  paragraph: SpeedParagraph;
}

type Phase = "intro" | "read" | "questions" | "done";

export function SpeedReadingGame({ paragraph }: Props) {
  const { show } = useToast();
  const [phase, setPhase] = useState<Phase>("intro");
  const [readLeft, setReadLeft] = useState(READ_SECONDS);
  const [qIndex, setQIndex] = useState(0);
  const [qLeft, setQLeft] = useState(QUESTION_SECONDS);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    paragraph.questions.map(() => null),
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [xpTotal, setXpTotal] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const readTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qIndexRef = useRef(0);

  useEffect(() => {
    qIndexRef.current = qIndex;
  }, [qIndex]);

  const stopRead = useCallback(() => {
    if (readTimerRef.current) {
      clearInterval(readTimerRef.current);
      readTimerRef.current = null;
    }
  }, []);

  const stopQuestion = useCallback(() => {
    if (qTimerRef.current) {
      clearInterval(qTimerRef.current);
      qTimerRef.current = null;
    }
  }, []);

  const goToQuestions = useCallback(() => {
    stopRead();
    setPhase("questions");
    setQIndex(0);
    setPicked(null);
  }, [stopRead]);

  useEffect(
    () => () => {
      stopRead();
      stopQuestion();
    },
    [stopRead, stopQuestion],
  );

  function startGame() {
    trackEvent("game_start", { game: "speed_reading" });
    setPhase("read");
    setReadLeft(READ_SECONDS);
    stopRead();
    readTimerRef.current = setInterval(() => {
      setReadLeft((t) => {
        if (t <= 1) {
          stopRead();
          goToQuestions();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  const finishOrNextQuestion = useCallback(
    (afterIndex: number) => {
      if (afterIndex + 1 >= paragraph.questions.length) {
        stopQuestion();
        setPhase("done");
      } else {
        setQIndex(afterIndex + 1);
      }
    },
    [paragraph.questions.length, stopQuestion],
  );

  useEffect(() => {
    if (phase !== "questions") return;
    setPicked(null);
    setQLeft(QUESTION_SECONDS);
    stopQuestion();
    qTimerRef.current = setInterval(() => {
      setQLeft((t) => {
        if (t <= 1) {
          const i = qIndexRef.current;
          setAnswers((prev) => {
            const next = [...prev];
            if (next[i] === null) next[i] = -1;
            return next;
          });
          finishOrNextQuestion(i);
          return QUESTION_SECONDS;
        }
        return t - 1;
      });
    }, 1000);
    return () => stopQuestion();
  }, [phase, qIndex, finishOrNextQuestion, stopQuestion]);

  async function onPick(opt: number) {
    if (picked !== null || phase !== "questions") return;
    setPicked(opt);
    const q = paragraph.questions[qIndex];
    if (!q) return;
    stopQuestion();
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = opt;
      return next;
    });
    if (opt === q.correct_index) {
      const res = await awardXp(XP_CORRECT, "game:speed-reading");
      setXpTotal((x) => x + XP_CORRECT);
      if (res?.levelUp) setConfetti(true);
      show({ title: `+${XP_CORRECT} XP`, variant: "reward" });
    }
    window.setTimeout(() => {
      finishOrNextQuestion(qIndex);
    }, 600);
  }

  const correctCount = paragraph.questions.filter(
    (q, i) => answers[i] === q.correct_index,
  ).length;

  useEffect(() => {
    if (phase !== "done") return;
    trackEvent("game_finish", {
      game: "speed_reading",
      score: correctCount,
    });
  }, [phase, correctCount]);

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
        <h1 className="font-display text-2xl font-extrabold text-ink">Speed Reading</h1>
        <p className="text-sm text-ink-soft mt-1 mb-6">
          Read the paragraph, then answer three questions. +{XP_CORRECT} XP per correct answer.
        </p>

        {phase === "intro" && (
          <div className="text-center py-6">
            <Button variant="primary" shape="pill" size="lg" onClick={startGame}>
              Start
            </Button>
          </div>
        )}

        {phase === "read" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-ink-muted">Reading time</span>
              <span className="flex items-center gap-1 font-bold text-primary">
                <Clock className="w-4 h-4" />
                {readLeft}s
              </span>
            </div>
            <div className="rounded-2xl bg-paper border border-line p-5 text-ink leading-relaxed text-[15px]">
              {paragraph.text}
            </div>
            <Button variant="primary" shape="pill" full onClick={goToQuestions}>
              I&apos;m done reading
            </Button>
          </div>
        )}

        {phase === "questions" && paragraph.questions[qIndex] && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                Question {qIndex + 1} / {paragraph.questions.length}
              </span>
              <span className="flex items-center gap-1 text-ink-muted">
                <Clock className="w-4 h-4" />
                {qLeft}s
              </span>
            </div>
            <p className="font-display text-lg font-extrabold text-ink">
              {paragraph.questions[qIndex]!.question}
            </p>
            <div className="space-y-2">
              {paragraph.questions[qIndex]!.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => void onPick(idx)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl border-2 border-line font-semibold text-sm hover:border-primary hover:bg-primary-soft",
                    picked !== null &&
                      idx === paragraph.questions[qIndex]!.correct_index &&
                      "border-success bg-success-soft",
                    picked !== null &&
                      picked === idx &&
                      idx !== paragraph.questions[qIndex]!.correct_index &&
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
            <h2 className="font-display text-2xl font-extrabold text-ink">Finished</h2>
            <p className="mt-2 text-ink-soft">
              Correct: {correctCount} / {paragraph.questions.length}
            </p>
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
                  setPhase("intro");
                  setAnswers(paragraph.questions.map(() => null));
                  setXpTotal(0);
                  setQIndex(0);
                  setPicked(null);
                  setReadLeft(READ_SECONDS);
                }}
              >
                Again
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
