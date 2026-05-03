import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("games");
  const supabase = await createServerClient();
  const { count: wordCount } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const statLine =
    wordCount !== null ? t("hubStatLine", { count: wordCount }) : undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
          <Gamepad2 className="w-7 h-7 text-primary" strokeWidth={2.3} />
          {t("title")}
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GameCard
          href="/games/word-scramble"
          title={t("wordScrambleTitle")}
          description={t("wordScrambleDesc")}
          icon={Shuffle}
          accentColor="primary"
          estimatedMinutes={3}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/match"
          title={t("wordMatchTitle")}
          description={t("wordMatchDesc")}
          icon={Link2}
          accentColor="success"
          estimatedMinutes={2}
          difficulty="easy"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/sentence-builder"
          title={t("sentenceBuilderTitle")}
          description={t("sentenceBuilderDesc")}
          icon={Trophy}
          accentColor="reward"
          estimatedMinutes={2}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/memory-match"
          title={t("memoryMatchTitle")}
          description={t("memoryMatchDesc")}
          icon={Brain}
          accentColor="rare"
          estimatedMinutes={3}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/hangman"
          title={t("hangmanTitle")}
          description={t("hangmanDesc")}
          icon={Heart}
          accentColor="action"
          estimatedMinutes={3}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/listen-type"
          title={t("listenTypeTitle")}
          description={t("listenTypeDesc")}
          icon={Volume2}
          accentColor="teal"
          estimatedMinutes={2}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/word-chain"
          title={t("wordChainTitle")}
          description={t("wordChainDesc")}
          icon={Link2}
          accentColor="primary"
          estimatedMinutes={2}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/speed-reading"
          title={t("speedReadingTitle")}
          description={t("speedReadingDesc")}
          icon={BookOpen}
          accentColor="success"
          estimatedMinutes={4}
          difficulty="medium"
          available={true}
          statLine={statLine}
        />

        <GameCard
          href="/games/grammar-challenge"
          title={t("grammarChallengeTitle")}
          description={t("grammarChallengeDesc")}
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
          {t("hubFooterTitle")}
        </h2>
        <p className="mt-1 text-sm text-ink-soft max-w-2xl">{t("hubFooterDesc")}</p>
      </Card>
    </div>
  );
}
