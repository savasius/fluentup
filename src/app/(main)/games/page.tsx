import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { GameCard } from "@/components/domain";
import { Shuffle, Link2, Gamepad2, Trophy } from "lucide-react";

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

export default function GamesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
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

      {/* Game grid */}
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
        />

        <GameCard
          href="/games/sentence-builder"
          title="Sentence Builder"
          description="Arrange words to form correct English sentences. Master grammar through play."
          icon={Trophy}
          accentColor="reward"
          estimatedMinutes={5}
          difficulty="hard"
          available={false}
        />
      </div>

      {/* Info card */}
      <Card className="p-5 lg:p-6 bg-gradient-to-r from-primary-tint to-primary-soft border-primary-tint">
        <h2 className="font-display text-lg font-extrabold text-ink">
          More games coming soon
        </h2>
        <p className="mt-1 text-sm text-ink-soft max-w-2xl">
          We add new games every month. Each one is designed to reinforce a
          different aspect of English — vocabulary, grammar, spelling, or
          listening. All free, no sign-up needed.
        </p>
      </Card>
    </div>
  );
}
