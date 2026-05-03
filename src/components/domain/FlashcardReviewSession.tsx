"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import type { WordMeaning } from "@/lib/supabase/database.types";
import { reviewFlashcard } from "@/lib/flashcards/actions";
import type { FlashcardQuality } from "@/lib/flashcards/sm2";
import { useToast } from "@/lib/toast/context";
import { Link } from "@/i18n/navigation";

interface WordItem {
  slug: string;
  word: string;
  phonetic_uk: string | null;
  phonetic_us: string | null;
  meanings: WordMeaning[];
}

interface Props {
  words: WordItem[];
}

export function FlashcardReviewSession({ words }: Props) {
  const router = useRouter();
  const { show } = useToast();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  if (sessionDone) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">Session complete</h1>
          <p className="mt-2 text-ink-soft">Nice work — your next reviews are scheduled.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button variant="primary" shape="pill">
                Dashboard
              </Button>
            </Link>
            <Button variant="secondary" shape="pill" onClick={() => router.refresh()}>
              Check for more
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const current = words[idx];
  const def = current.meanings[0]?.definition ?? "";

  async function submit(quality: FlashcardQuality) {
    if (busy) return;
    setBusy(true);
    const res = await reviewFlashcard(current.slug, quality);
    setBusy(false);
    if (res) {
      const msg =
        res.intervalDays <= 0
          ? "Scheduled for review soon."
          : `Scheduled for review in about ${res.intervalDays} day${res.intervalDays === 1 ? "" : "s"}.`;
      show({ title: "Saved", description: msg, variant: "success" });
    }
    setRevealed(false);
    if (idx + 1 >= words.length) {
      setSessionDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="text-xs font-bold text-ink-muted text-center">
        Card {idx + 1} / {words.length}
      </div>
      <Card className="p-8 text-center">
        <h2 className="font-display text-4xl font-extrabold text-ink">{current.word}</h2>
        <div className="mt-2 text-sm text-ink-soft">
          {current.phonetic_uk && <span>UK /{current.phonetic_uk}/ </span>}
          {current.phonetic_us && <span>US /{current.phonetic_us}/</span>}
        </div>
        {!revealed ? (
          <div className="mt-8">
            <Button variant="primary" shape="pill" onClick={() => setRevealed(true)}>
              Show definition
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-ink-soft text-left text-[15px] leading-relaxed">{def}</p>
        )}
        {revealed && (
          <div className="mt-8 grid grid-cols-2 gap-2 max-w-sm mx-auto">
            <Button variant="action" shape="pill" size="sm" disabled={busy} onClick={() => void submit(2)}>
              Again
            </Button>
            <Button variant="reward" shape="pill" size="sm" disabled={busy} onClick={() => void submit(3)}>
              Hard
            </Button>
            <Button variant="primary" shape="pill" size="sm" disabled={busy} onClick={() => void submit(4)}>
              Good
            </Button>
            <Button variant="success" shape="pill" size="sm" disabled={busy} onClick={() => void submit(5)}>
              Easy
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
