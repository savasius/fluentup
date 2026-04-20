"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, ProgressBar } from "@/components/ui";
import { Sparkles } from "lucide-react";
import { savePlacementResult } from "@/lib/auth/onboarding";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface Question {
  id: string;
  question: string;
  options: { text: string; level: CefrLevel }[];
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "How would you greet your teacher in English?",
    options: [
      { text: "Hi!", level: "A1" },
      { text: "Hello, how are you?", level: "A2" },
      { text: "Good morning, I hope you're well.", level: "B1" },
      {
        text: "Good morning, I trust you're having a productive day.",
        level: "C1",
      },
    ],
  },
  {
    id: "q2",
    question: "Which sentence is grammatically correct?",
    options: [
      { text: "I am going to store yesterday.", level: "A1" },
      { text: "I went to the store yesterday.", level: "A2" },
      { text: "I have gone to the store yesterday.", level: "B1" },
      {
        text: "Had I gone to the store, I would have bought milk.",
        level: "C1",
      },
    ],
  },
  {
    id: "q3",
    question: "Choose the correct meaning of 'reluctant':",
    options: [
      { text: "Very happy", level: "A1" },
      { text: "Not wanting to do something", level: "B2" },
      { text: "Easily persuaded", level: "A2" },
      { text: "Strongly agreeing", level: "B1" },
    ],
  },
  {
    id: "q4",
    question: "Which is closest in meaning to 'ubiquitous'?",
    options: [
      { text: "Very rare", level: "A1" },
      { text: "Hidden", level: "A2" },
      { text: "Expensive", level: "B1" },
      { text: "Existing everywhere", level: "C2" },
    ],
  },
  {
    id: "q5",
    question:
      "Read this: 'The proposal was met with a lukewarm reception.' What does lukewarm mean here?",
    options: [
      { text: "Warm and welcoming", level: "A2" },
      { text: "Cold and hostile", level: "B1" },
      { text: "Not very enthusiastic", level: "B2" },
      { text: "Angrily rejected", level: "C1" },
    ],
  },
];

const LEVEL_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function determineLevel(selectedLevels: CefrLevel[]): CefrLevel {
  if (selectedLevels.length === 0) return "A1";
  return selectedLevels.reduce<CefrLevel>((max, lvl) => {
    return LEVEL_ORDER.indexOf(lvl) > LEVEL_ORDER.indexOf(max) ? lvl : max;
  }, "A1");
}

export function PlacementQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CefrLevel[]>([]);
  const [finalLevel, setFinalLevel] = useState<CefrLevel | null>(null);
  const [saving, setSaving] = useState(false);

  function handleAnswer(level: CefrLevel) {
    const newAnswers = [...answers, level];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setFinalLevel(determineLevel(newAnswers));
    }
  }

  async function handleStart() {
    if (!finalLevel) return;
    setSaving(true);
    try {
      await savePlacementResult(finalLevel);
      router.push("/");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (finalLevel) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center shadow-solid-primary mb-4">
          <Sparkles className="w-8 h-8 text-white" strokeWidth={2.3} />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-ink">
          You&apos;re at {finalLevel} level
        </h2>
        <p className="mt-2 text-ink-soft">
          We&apos;ve set your starting level. You can always change this later
          in your profile.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            shape="pill"
            size="lg"
            onClick={handleStart}
            disabled={saving}
          >
            {saving ? "Starting..." : "Start learning"}
          </Button>
        </div>
      </Card>
    );
  }

  const q = QUESTIONS[step];

  return (
    <Card className="p-6 lg:p-8">
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
          <span>
            Question {step + 1} of {QUESTIONS.length}
          </span>
        </div>
        <ProgressBar
          value={(step / QUESTIONS.length) * 100}
          color="primary"
        />
      </div>

      <h2 className="font-display text-xl font-extrabold text-ink leading-snug">
        {q.question}
      </h2>

      <div className="mt-5 space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.level)}
            className="w-full text-left p-4 rounded-2xl border-2 border-line bg-white hover:border-primary hover:bg-primary-soft transition flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-line-soft text-ink-soft font-extrabold text-sm flex items-center justify-center flex-shrink-0">
              {String.fromCharCode(65 + i)}
            </div>
            <span className="flex-1 text-ink font-medium">{opt.text}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
