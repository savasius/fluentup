import type { Metadata } from "next";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { getWordOfTheDay } from "@/lib/word-of-the-day";
import { createServerClient } from "@/lib/supabase";
import type {
  CefrLevel,
  Database,
  WordMeaning,
  WordRarity,
} from "@/lib/supabase/database.types";
import {
  GuestDashboard,
  UserDashboard,
  type GuestPreviewWord,
} from "@/components/domain";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const metadata: Metadata = {
  title: "FluentUp English — Learn English free forever",
  description:
    "Learn English with gamified vocabulary, grammar, and interactive games. Free forever, no ads, CEFR-aligned from A1 to C2.",
};

// Word-of-the-day cache — revalidate every 10 minutes so fresh rows propagate.
export const revalidate = 600;

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserWithProfile();
  const userLevel: CefrLevel | undefined = profile?.cefr_level;

  const wordOfDay = await getWordOfTheDay(userLevel);

  if (!user) {
    const supabase = await createServerClient();
    const { count: wordCount } = await supabase
      .from("words")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    const { data: previewWordsRaw } = await supabase
      .from("words")
      .select("slug, word, cefr_level, rarity, part_of_speech, meanings")
      .eq("published", true)
      .in("rarity", ["rare", "epic"])
      .limit(6);

    const previewRows = (previewWordsRaw ?? []) as Pick<
      WordRow,
      "slug" | "word" | "cefr_level" | "rarity" | "part_of_speech" | "meanings"
    >[];

    const previewWords: GuestPreviewWord[] = previewRows.map((w) => {
      const meanings = w.meanings as WordMeaning[] | null;
      return {
        slug: w.slug,
        word: w.word,
        cefr_level: w.cefr_level as CefrLevel,
        rarity: w.rarity as WordRarity,
        part_of_speech: w.part_of_speech,
        firstMeaning: meanings?.[0]?.definition ?? "",
      };
    });

    return (
      <GuestDashboard
        wordOfDay={wordOfDay}
        totalWords={wordCount ?? 0}
        previewWords={previewWords}
      />
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyXpEarned =
    profile?.daily_xp_date === today ? profile.daily_xp_earned ?? 0 : 0;

  return (
    <UserDashboard
      user={{
        fullName:
          profile?.full_name ?? user.email?.split("@")[0] ?? "there",
      }}
      profile={{
        totalXp: profile?.total_xp ?? 0,
        currentStreak: profile?.current_streak ?? 0,
        longestStreak: profile?.longest_streak ?? 0,
        cefrLevel: (profile?.cefr_level ?? "A1") as CefrLevel,
        dailyGoal: profile?.daily_goal ?? 30,
        dailyXpEarned,
        achievements: Array.isArray(profile?.achievements)
          ? profile.achievements
          : [],
        onboardingCompleted: profile?.onboarding_completed ?? false,
      }}
      wordOfDay={wordOfDay}
    />
  );
}
