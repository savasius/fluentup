import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WordChainGame } from "@/components/domain/WordChainGame";
import { getRandomChainWord } from "@/lib/games/word-chain-actions";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Word Chain — Vocabulary game",
  description: "Link words by last and first letter. Beat the clock!",
};

export default async function WordChainPage() {
  const w = await getRandomChainWord();
  if (!w) notFound();

  return <WordChainGame initialWord={w.word} />;
}
