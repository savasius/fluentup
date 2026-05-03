import type { Metadata } from "next";
import { SentenceBuilderGame } from "@/components/domain";
import { SENTENCE_BANK } from "@/lib/games/sentences";

export const metadata: Metadata = {
  title: "Sentence Builder — English grammar game",
  description:
    "Arrange words to build correct English sentences. Free grammar game for all levels.",
  openGraph: {
    title: "Sentence Builder — FluentUp English",
    description: "Arrange words to build correct sentences.",
    type: "website",
  },
};

export default function SentenceBuilderPage() {
  return <SentenceBuilderGame sentences={SENTENCE_BANK} />;
}
