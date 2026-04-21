import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { GameCard } from "@/components/domain";
import { createServerClient } from "@/lib/supabase";
import {
  Shuffle,
  Link2,
  Gamepad2,
  Trophy,
  Brain,
  Heart,
  Volume2,
  BookOpen,
  Zap,
} from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Games — Learn English while having fun",
  description:
    "Play fun English learning games. Word Scramble, Word Match, and more. Free to play, no sign-up required.",
  openGraph: {
    title: "Games — FluentUp English",
    description:
      "Fun English games: Word Scramble, Word Match. Play free, no sign-up.",
    type: "website",
  },
};

export default async function GamesPage() {
  const supabase = await createServerClient();
  const { count: wordCount } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const statLine =
    wordCount !== null ? `Pulls from ${wordCount}+ published words` : undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
          <Gamepad2 className="w-7 h-7 text-primary" strokeWidth={2.3} />
          Games
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
          Learn English while having fun. Quick, addictive games that help you
          build vocabulary without feeling like study.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GameCard
          href="/games/word-scramble"
          title="Word Scramble"
          description="Unscramble the letters before time runs out. Beat the clock and build your speed."
          icon={Shuffle}
          accentColor="primary"
          estimatedMinutes={3}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/match"
          title="Word Match"
          description="Match each word with its correct meaning. Test your vocabulary recall."
          icon={Link2}
          accentColor="success"
          estimatedMinutes={2}
          difficulty="easy"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/sentence-builder"
          title="Sentence Builder"
          description="Arrange words to form correct English sentences. Master grammar through play."
          icon={Trophy}
          accentColor="reward"
          estimatedMinutes={2}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/memory-match"
          title="Memory Match"
          description="Flip cards and match each word with its meaning from memory."
          icon={Brain}
          accentColor="rare"
          estimatedMinutes={3}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/hangman"
          title="Hangman"
          description="Classic word guessing. Six lives, one hidden word. How many can you solve?"
          icon={Heart}
          accentColor="action"
          estimatedMinutes={3}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/listen-type"
          title="Listen & Type"
          description="Hear a word, type the spelling. Sharpen your ear and fingers in 60 seconds."
          icon={Volume2}
          accentColor="teal"
          estimatedMinutes={2}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/word-chain"
          title="Word Chain"
          description="Link words by last letter and first letter. Beat the clock and build streak XP."
          icon={Link2}
          accentColor="primary"
          estimatedMinutes={2}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/speed-reading"
          title="Speed Reading"
          description="Read a short passage, then answer timed comprehension questions."
          icon={BookOpen}
          accentColor="success"
          estimatedMinutes={4}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/grammar-challenge"
          title="Grammar Challenge"
          description="Random grammar quiz questions with a 60-second clock and streak bonuses."
          icon={Zap}
          accentColor="reward"
          estimatedMinutes={2}
          difficulty="hard"
          available={true}
          statLine={statLine}
        />
      </div>

      <Card className="p-5 lg:p-6 bg-gradient-to-r from-primary-tint to-primary-soft border-primary-tint">
        <h2 className="font-display text-lg font-extrabold text-ink">
          Nine ways to practice
        </h2>
        <p className="mt-1 text-sm text-ink-soft max-w-2xl">
          Vocabulary, grammar, listening, reading — pick a mode that matches
          your mood. All free; sign in to save XP and streaks.
        </p>
      </Card>
    </div>
  );
}
