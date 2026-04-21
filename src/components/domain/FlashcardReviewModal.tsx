"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { reviewFlashcard } from "@/lib/flashcards/actions";
import type { FlashcardQuality } from "@/lib/flashcards/sm2";
import { useToast } from "@/lib/toast/context";

interface Props {
  word: string;
  wordSlug: string;
  definition: string;
  open: boolean;
  onClose: () => void;
}

export function FlashcardReviewModal({
  word,
  wordSlug,
  definition,
  open,
  onClose,
}: Props) {
  const { show } = useToast();
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function submit(quality: FlashcardQuality) {
    if (busy) return;
    setBusy(true);
    const res = await reviewFlashcard(wordSlug, quality);
    setBusy(false);
    if (res) {
      const msg =
        res.intervalDays <= 0
          ? "Review again soon."
          : `Next review in about ${res.intervalDays} day${res.intervalDays === 1 ? "" : "s"}.`;
      show({
        title: "Flashcard saved",
        description: msg,
        variant: "success",
      });
    }
    setRevealed(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-labelledby="flashcard-title"
    >
      <Card className="w-full max-w-md p-6 shadow-lift">
        <h2
          id="flashcard-title"
          className="font-display text-2xl font-extrabold text-ink text-center"
        >
          {word}
        </h2>
        {!revealed ? (
          <div className="mt-6 text-center">
            <Button variant="secondary" shape="pill" onClick={() => setRevealed(true)}>
              Show definition
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-ink-soft text-center text-[15px] leading-relaxed">
            {definition}
          </p>
        )}
        {revealed && (
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button
              variant="action"
              shape="pill"
              size="sm"
              disabled={busy}
              onClick={() => void submit(2)}
            >
              Again
            </Button>
            <Button
              variant="reward"
              shape="pill"
              size="sm"
              disabled={busy}
              onClick={() => void submit(3)}
            >
              Hard
            </Button>
            <Button
              variant="primary"
              shape="pill"
              size="sm"
              disabled={busy}
              onClick={() => void submit(4)}
            >
              Good
            </Button>
            <Button
              variant="success"
              shape="pill"
              size="sm"
              disabled={busy}
              onClick={() => void submit(5)}
            >
              Easy
            </Button>
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" shape="pill" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
