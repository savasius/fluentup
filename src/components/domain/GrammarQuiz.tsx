"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Check, X, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";
import type { QuizQuestion } from "@/lib/supabase/database.types";

interface GrammarQuizProps {
  questions: QuizQuestion[];
}

type QuizState = "answering" | "correct" | "wrong" | "finished";

export function GrammarQuiz({ questions }: GrammarQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<QuizState>("answering");
  const [correctCount, setCorrectCount] = useState(0);

  if (questions.length === 0) {
    return null;
  }

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function handleCheck() {
    if (selected === null) return;
    const isCorrect = selected === current.correct_index;
    setState(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    if (isLast) {
      setState("finished");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setState("answering");
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelected(null);
    setState("answering");
    setCorrectCount(0);
  }

  if (state === "finished") {
    const percent = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="p-6 lg:p-8 text-center bg-gradient-to-br from-success-tint to-success-soft border-success-tint">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-soft mb-4">
          <Trophy
            className="w-8 h-8 text-reward"
            fill="#F59E0B"
            strokeWidth={0}
          />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-ink">
          Quiz complete!
        </h3>
        <p className="mt-2 text-ink-soft">
          You got <span className="font-bold text-ink">{correctCount}</span> out
          of <span className="font-bold text-ink">{questions.length}</span>{" "}
          correct —{" "}
          <span className="font-bold text-success-dark">{percent}%</span>
        </p>
        <div className="mt-5">
          <Button
            variant="primary"
            shape="pill"
            size="md"
            icon={RotateCcw}
            onClick={handleReset}
          >
            Try again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 lg:p-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <Badge color="primary" icon={Lightbulb}>
          Question {currentIndex + 1} of {questions.length}
        </Badge>
        <span className="text-xs font-bold text-ink-muted">
          {correctCount} correct so far
        </span>
      </div>

      {/* Question */}
      <h3 className="font-display text-xl lg:text-2xl font-extrabold text-ink leading-snug">
        {current.question}
      </h3>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {current.options.map((opt, i) => {
          const isSelected = selected === i;
          const showCorrect =
            state !== "answering" && i === current.correct_index;
          const showWrong = state === "wrong" && i === selected;

          return (
            <button
              key={i}
              onClick={() => state === "answering" && setSelected(i)}
              disabled={state !== "answering"}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-medium text-ink",
                state === "answering" &&
                  !isSelected &&
                  "border-line hover:border-ink-muted bg-white",
                state === "answering" &&
                  isSelected &&
                  "border-primary bg-primary-soft",
                showCorrect && "border-success bg-success-soft",
                showWrong && "border-action bg-action-soft",
                state !== "answering" && "cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0",
                  showCorrect && "bg-success text-white shadow-solid-success",
                  showWrong && "bg-action text-white shadow-solid-action",
                  !showCorrect &&
                    !showWrong &&
                    isSelected &&
                    "bg-primary text-white shadow-solid-primary",
                  !showCorrect &&
                    !showWrong &&
                    !isSelected &&
                    "bg-line-soft text-ink-soft"
                )}
              >
                {showCorrect ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : showWrong ? (
                  <X className="w-4 h-4" strokeWidth={3} />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </div>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation (after answer) */}
      {state !== "answering" && current.explanation && (
        <div
          className={cn(
            "mt-5 p-4 rounded-2xl border-2 flex items-start gap-3",
            state === "correct"
              ? "border-success bg-success-soft"
              : "border-action bg-action-soft"
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              state === "correct"
                ? "bg-success shadow-solid-success"
                : "bg-action shadow-solid-action"
            )}
          >
            {state === "correct" ? (
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            ) : (
              <X className="w-4 h-4 text-white" strokeWidth={3} />
            )}
          </div>
          <div className="flex-1">
            <div
              className={cn(
                "font-display font-extrabold",
                state === "correct" ? "text-success-dark" : "text-action-dark"
              )}
            >
              {state === "correct" ? "Correct!" : "Not quite"}
            </div>
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed",
                state === "correct" ? "text-success-dark" : "text-action-dark"
              )}
            >
              {current.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Footer buttons */}
      <div className="mt-6 flex justify-end">
        {state === "answering" ? (
          <Button
            variant="primary"
            shape="pill"
            size="md"
            onClick={handleCheck}
            disabled={selected === null}
          >
            Check answer
          </Button>
        ) : (
          <Button
            variant={state === "correct" ? "success" : "action"}
            shape="pill"
            size="md"
            onClick={handleNext}
          >
            {isLast ? "See results" : "Next question"}
          </Button>
        )}
      </div>
    </Card>
  );
}
