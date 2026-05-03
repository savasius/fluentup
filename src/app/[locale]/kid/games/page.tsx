import { getTranslations } from "next-intl/server";
import { GameCard } from "@/components/domain";
import { createServerClient } from "@/lib/supabase";
import { Shuffle, Link2, Brain } from "lucide-react";

export default async function KidGamesPage() {
  const t = await getTranslations("games");
  const tKid = await getTranslations("kid.games");
  const supabase = await createServerClient();
  const { count: wordCount } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const statLine =
    wordCount !== null ? t("hubStatLine", { count: wordCount }) : undefined;

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">
          {t("title")}
        </h1>
        <p className="text-ink-soft mt-2">{tKid("subtitle")}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <GameCard
          href="/games/word-scramble"
          title={t("wordScrambleTitle")}
          description={t("wordScrambleDesc")}
          icon={Shuffle}
          accentColor="primary"
          estimatedMinutes={5}
          difficulty="easy"
          available={true}
          statLine={statLine}
        />
        <GameCard
          href="/games/match"
          title={t("wordMatchTitle")}
          description={t("wordMatchDesc")}
          icon={Link2}
          accentColor="success"
          estimatedMinutes={5}
          difficulty="easy"
          available={true}
          statLine={statLine}
        />
        <GameCard
          href="/games/memory-match"
          title={t("memoryMatchTitle")}
          description={t("memoryMatchDesc")}
          icon={Brain}
          accentColor="rare"
          estimatedMinutes={5}
          difficulty="easy"
          available={true}
          statLine={statLine}
        />
      </div>
    </div>
  );
}
