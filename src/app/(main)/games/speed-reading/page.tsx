import type { Metadata } from "next";
import { SpeedReadingGame } from "@/components/domain/SpeedReadingGame";
import { SPEED_READING_PARAGRAPHS } from "@/lib/games/paragraphs";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Speed Reading — Comprehension game",
  description: "Read a short passage and answer timed questions.",
};

export default function SpeedReadingPage() {
  /** Variation: client picks a random passage on play; hub uses a stable default here. */
  const paragraph = SPEED_READING_PARAGRAPHS[0]!;

  return <SpeedReadingGame paragraph={paragraph} />;
}
