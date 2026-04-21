"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { BookMarked } from "lucide-react";
import { FlashcardReviewModal } from "./FlashcardReviewModal";

interface Props {
  word: string;
  wordSlug: string;
  definition: string;
}

export function WordFlashcardButton({ word, wordSlug, definition }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        shape="pill"
        size="md"
        icon={BookMarked}
        onClick={() => setOpen(true)}
      >
        Review as flashcard
      </Button>
      <FlashcardReviewModal
        word={word}
        wordSlug={wordSlug}
        definition={definition}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
