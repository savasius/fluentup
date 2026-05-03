"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  Confetti,
} from "@/components/ui";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Volume2,
  Zap,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTextToSpeech } from "@/lib/tts/useTextToSpeech";
import { useToast } from "@/lib/toast/context";
import type {
  Database,
  LessonQuizQuestion,
} from "@/lib/supabase/database.types";
import {
  startLesson,
  updateLessonStep,
  completeLesson,
} from "@/lib/lessons/actions";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];

export interface LessonWordCard {
  slug: string;
  word: string;
  cefr_level: string;
  phonetic_uk: string | null;
  phonetic_us: string | null;
  part_of_speech: string;
  definition: string;
  example: string | null;
}

interface Props {
  lesson: LessonRow;
  words: LessonWordCard[];
  isAuthenticated: boolean;
  initialStep: number;
  lessonSlug: string;
}

export function LessonPlayer({
  lesson,
  words,
  isAuthenticated,
  initialStep,
  lessonSlug,
}: Props) {
  const { show: showToast } = useToast();
  const { supported, speak } = useTextToSpeech();
  const quizQuestions = (lesson.quiz_questions ?? []) as LessonQuizQuestion[];

  const [step, setStep] = useState(initialStep);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(() =>
    quizQuestions.map(() => null),
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const startedRef = useRef(false);

  const W = words.length;
  const Q = quizQuestions.length;
  const grammarStep = W + 1;
  const quizIntroStep = W + 2;
  const firstQuizStep = W + 3;
  const resultsStep = W + 3 + Q;
  const maxStep = resultsStep;
  const totalSteps = maxStep + 1;

  const progressPct = useMemo(
    () => (maxStep > 0 ? (step / maxStep) * 100 : 0),
    [step, maxStep],
  );

  const syncProgress = useCallback(
    async (s: number) => {
      if (!isAuthenticated) return;
      await updateLessonStep(lessonSlug, s);
    },
    [isAuthenticated, lessonSlug],
  );

  useEffect(() => {
    if (!isAuthenticated || startedRef.current) return;
    startedRef.current = true;
    void startLesson(lessonSlug);
  }, [isAuthenticated, lessonSlug]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const t = window.setTimeout(() => {
      void syncProgress(step);
    }, 400);
    return () => window.clearTimeout(t);
  }, [step, isAuthenticated, syncProgress]);

  useEffect(() => {
    if (step !== resultsStep || xpAwarded || !isAuthenticated) return;
    const correct = quizAnswers.reduce<number>(
      (n, a, i) => n + (a === quizQuestions[i]?.correct_index ? 1 : 0),
      0,
    );
    void (async () => {
      const res = await completeLesson(lessonSlug, correct, Q);
      setXpAwarded(true);
      if (res) {
        setXpGained(res.xpGained);
        setLevelUp(res.levelUp);
        if (res.xpGained > 0) {
          showToast({
            title: `+${res.xpGained} XP`,
            description: res.levelUp
              ? "Level up!"
              : "Lesson complete — great work!",
            variant: "success",
          });
        }
        if (res.levelUp) setConfetti(true);
      }
    })();
  }, [
    step,
    resultsStep,
    xpAwarded,
    isAuthenticated,
    lessonSlug,
    quizAnswers,
    quizQuestions,
    Q,
    showToast,
  ]);

  function goNext() {
    setStep((s) => Math.min(maxStep, s + 1));
  }

  function startQuizFromIntro() {
    setPicked(null);
    setShowExplain(false);
    setStep(quizIntroStep + 1);
  }

  function onPickOption(optIdx: number) {
    if (picked !== null) return;
    const qi = step - firstQuizStep;
    setPicked(optIdx);
    setShowExplain(true);
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[qi] = optIdx;
      return next;
    });
  }

  const correctCount = quizAnswers.reduce<number>(
    (n, a, i) => n + (a === quizQuestions[i]?.correct_index ? 1 : 0),
    0,
  );

  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Link
          href="/lesson"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          All lessons
        </Link>
        <Card className="p-8 text-center">
          <Badge color="primary">{lesson.cefr_level}</Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">
            {lesson.title}
          </h1>
          <p className="mt-3 text-ink-soft text-left">{lesson.intro_text}</p>
          <div className="mt-6">
            <Button
              variant="primary"
              shape="pill"
              size="lg"
              onClick={() => setStep(1)}
            >
              Start lesson →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step >= 1 && step <= W) {
    const word = words[step - 1];
    if (!word) {
      return (
        <div className="max-w-xl mx-auto text-center text-ink-soft">
          Word data missing for this lesson.
        </div>
      );
    }
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-ink-muted">
            Word {step} / {W}
          </span>
          <span className="text-xs text-ink-muted">
            Step {step + 1} / {totalSteps}
          </span>
        </div>
        <ProgressBar value={progressPct} color="primary" showLabel={false} />
        <Card className="p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge color="success" size="sm">
              {word.cefr_level}
            </Badge>
            <Badge color="slate" size="sm">
              {word.part_of_speech}
            </Badge>
          </div>
          <h2 className="font-display text-4xl font-extrabold text-ink">
            {word.word}
          </h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-soft">
            {word.phonetic_uk && (
              <span>
                UK /{word.phonetic_uk}/
                {supported && (
                  <button
                    type="button"
                    className="ml-2 inline-flex text-primary"
                    aria-label="Play UK"
                    onClick={() => speak(word.word, "uk")}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </span>
            )}
            {word.phonetic_us && (
              <span>
                US /{word.phonetic_us}/
                {supported && (
                  <button
                    type="button"
                    className="ml-2 inline-flex text-primary"
                    aria-label="Play US"
                    onClick={() => speak(word.word, "us")}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </span>
            )}
          </div>
          <p className="mt-4 text-ink leading-relaxed">{word.definition}</p>
          {word.example && (
            <p className="mt-3 text-sm text-ink-soft italic border-l-2 border-primary-tint pl-3">
              &ldquo;{word.example}&rdquo;
            </p>
          )}
          <div className="mt-8 flex justify-end">
            <Button variant="primary" shape="pill" onClick={() => goNext()}>
              Got it →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === grammarStep) {
    const examples = lesson.grammar_examples ?? [];
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <ProgressBar value={progressPct} color="primary" showLabel={false} />
        <Card className="p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={2.3} />
            <h2 className="font-display text-xl font-extrabold text-ink">
              Grammar focus
            </h2>
          </div>
          {lesson.grammar_tip && (
            <p className="text-ink leading-relaxed">{lesson.grammar_tip}</p>
          )}
          {examples.length > 0 && (
            <ul className="mt-4 space-y-2">
              {examples.map((ex, i) => (
                <li
                  key={i}
                  className="text-sm text-ink-soft border-l-2 border-success-tint pl-3"
                >
                  {ex}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex justify-end">
            <Button variant="primary" shape="pill" onClick={() => goNext()}>
              Continue →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === quizIntroStep) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <ProgressBar value={progressPct} color="primary" showLabel={false} />
        <Card className="p-8 text-center">
          <h2 className="font-display text-2xl font-extrabold text-ink">
            Quick quiz
          </h2>
          <p className="mt-2 text-ink-soft">
            Let&apos;s check what you learned — {Q} questions.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              shape="pill"
              size="lg"
              onClick={startQuizFromIntro}
            >
              Start quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step >= firstQuizStep && step < resultsStep) {
    const qi = step - firstQuizStep;
    const q = quizQuestions[qi];
    if (!q) return null;

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between text-xs text-ink-muted">
          <span>
            Question {qi + 1} / {Q}
          </span>
          <span>
            Step {step + 1} / {totalSteps}
          </span>
        </div>
        <ProgressBar value={progressPct} color="primary" showLabel={false} />
        <Card className="p-6 lg:p-8">
          <p className="font-display text-lg font-extrabold text-ink mb-4">
            {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correct_index;
              const isPicked = picked === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => onPickOption(idx)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl border-2 transition text-sm font-semibold",
                    picked === null && "border-line hover:border-primary hover:bg-primary-soft",
                    picked !== null &&
                      isCorrect &&
                      "border-success bg-success-soft text-success-dark",
                    picked !== null &&
                      isPicked &&
                      !isCorrect &&
                      "border-action bg-action-soft text-action-dark",
                    picked !== null &&
                      !isPicked &&
                      !isCorrect &&
                      "border-line opacity-60",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {showExplain && q.explanation && (
            <p className="mt-4 text-sm text-ink-soft border-t border-line pt-4">
              {q.explanation}
            </p>
          )}
          {picked !== null && (
            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                shape="pill"
                onClick={() => {
                  if (qi + 1 >= Q) {
                    setStep(resultsStep);
                  } else {
                    setPicked(null);
                    setShowExplain(false);
                    setStep(firstQuizStep + qi + 1);
                  }
                }}
              >
                {qi + 1 >= Q ? "See results" : "Next →"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (step === resultsStep) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {confetti && <Confetti trigger={confetti} />}
        <Card className="p-8 text-center">
          <Trophy className="w-14 h-14 text-reward mx-auto mb-3" strokeWidth={2} />
          <h2 className="font-display text-2xl font-extrabold text-ink">
            Lesson complete!
          </h2>
          <p className="mt-2 text-ink-soft">
            Score: {correctCount} / {Q}
          </p>
          {isAuthenticated && (
            <p className="mt-3 flex items-center justify-center gap-2 text-lg font-extrabold text-primary">
              <Zap className="w-5 h-5 text-reward" strokeWidth={2.5} />
              {xpGained > 0 ? `+${xpGained} XP earned` : "0 XP (try again for more)"}
            </p>
          )}
          {levelUp && (
            <p className="mt-2 text-sm font-bold text-success-dark">
              You leveled up!
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/lesson">
              <Button variant="primary" shape="pill">
                Back to lessons
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" shape="pill">
                Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
