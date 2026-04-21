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
  type FeaturedGrammarTopic,
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

function mapToPreviewWord(
  w: Pick<
    WordRow,
    "slug" | "word" | "cefr_level" | "rarity" | "part_of_speech" | "meanings"
  >,
): GuestPreviewWord {
  const meanings = w.meanings as WordMeaning[] | null;
  return {
    slug: w.slug,
    word: w.word,
    cefr_level: w.cefr_level as CefrLevel,
    rarity: w.rarity as WordRarity,
    part_of_speech: w.part_of_speech,
    firstMeaning: meanings?.[0]?.definition ?? "",
  };
}

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserWithProfile();
  const userLevel: CefrLevel | undefined = profile?.cefr_level;

  const wordOfDay = await getWordOfTheDay(userLevel);

  const supabase = await createServerClient();

  const [
    { count: wordCount },
    { count: grammarCount },
    { data: recentWordsRaw },
    { data: grammarFeaturedRaw },
  ] = await Promise.all([
    supabase
      .from("words")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("grammar_topics")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("words")
      .select("slug, word, cefr_level, rarity, part_of_speech, meanings")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("grammar_topics")
      .select("slug, title, cefr_level, short_description")
      .eq("published", true)
      .order("cefr_level", { ascending: true })
      .order("title", { ascending: true })
      .limit(4),
  ]);

  const recentRows =
    (recentWordsRaw ?? []) as Pick<
      WordRow,
      "slug" | "word" | "cefr_level" | "rarity" | "part_of_speech" | "meanings"
    >[];
  const recentWords = recentRows.map(mapToPreviewWord);

  const grammarRows =
    (grammarFeaturedRaw ?? []) as Pick<
      Database["public"]["Tables"]["grammar_topics"]["Row"],
      "slug" | "title" | "cefr_level" | "short_description"
    >[];
  const featuredGrammar: FeaturedGrammarTopic[] = grammarRows.map((g) => ({
    slug: g.slug,
    title: g.title,
    cefr_level: g.cefr_level as CefrLevel,
    short_description: g.short_description,
  }));

  if (!user) {
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

    const previewWords: GuestPreviewWord[] = previewRows.map(mapToPreviewWord);

    return (
      <GuestDashboard
        wordOfDay={wordOfDay}
        totalWords={wordCount ?? 0}
        totalGrammar={grammarCount ?? 0}
        previewWords={previewWords}
        recentWords={recentWords}
        featuredGrammar={featuredGrammar}
      />
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyXpEarned =
    profile?.daily_xp_date === today ? profile.daily_xp_earned ?? 0 : 0;

  let inProgressLesson: { slug: string; title: string } | null = null;
  if (user) {
    const { data: prog } = await supabase
      .from("user_lesson_progress")
      .select("lesson_slug")
      .eq("user_id", user.id)
      .eq("status", "in_progress")
      .maybeSingle();

    const slug = (prog as { lesson_slug: string } | null)?.lesson_slug;
    if (slug) {
      const { data: lessonRow } = await supabase
        .from("lessons")
        .select("slug, title")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      const lesson = lessonRow as { slug: string; title: string } | null;
      if (lesson) {
        inProgressLesson = { slug: lesson.slug, title: lesson.title };
      }
    }
  }

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
      totalWords={wordCount ?? 0}
      totalGrammar={grammarCount ?? 0}
      recentWords={recentWords}
      featuredGrammar={featuredGrammar}
      inProgressLesson={inProgressLesson}
    />
  );
}
