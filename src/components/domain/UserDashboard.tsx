import Link from "next/link";
import { Card, ProgressBar, Button, Badge } from "@/components/ui";
import { WordOfTheDayCard } from "./WordOfTheDayCard";
import {
  Flame,
  Zap,
  Target,
  Trophy,
  BookMarked,
  BookOpen,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import type { WordOfTheDay } from "@/lib/word-of-the-day";
import type { CefrLevel } from "@/lib/supabase/database.types";
import { levelFromXp } from "@/lib/economy/constants";
import { getEarnedAchievements } from "@/lib/economy/achievements";
import type { FeaturedGrammarTopic, GuestPreviewWord } from "./GuestDashboard";

interface Props {
  user: { fullName: string };
  profile: {
    totalXp: number;
    currentStreak: number;
    longestStreak: number;
    cefrLevel: CefrLevel;
    dailyGoal: number;
    dailyXpEarned: number;
    achievements: string[];
    onboardingCompleted: boolean;
  };
  wordOfDay: WordOfTheDay | null;
  totalWords: number;
  totalGrammar: number;
  recentWords: GuestPreviewWord[];
  featuredGrammar: FeaturedGrammarTopic[];
}

export function UserDashboard({
  user,
  profile,
  wordOfDay,
  totalWords,
  totalGrammar,
  recentWords,
  featuredGrammar,
}: Props) {
  const { level, progress, nextLevelXp } = levelFromXp(profile.totalXp);
  const dailyProgress = Math.min(
    100,
    (profile.dailyXpEarned / Math.max(1, profile.dailyGoal)) * 100
  );
  const earnedAchievements = getEarnedAchievements(profile.achievements).slice(
    -3
  );
  const isNewUser = profile.totalXp === 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HERO */}
      <Card className="p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-tint rounded-full opacity-50" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-soft text-primary-dark rounded-full text-xs font-extrabold uppercase tracking-widest mb-2">
              <span>Level {level}</span>
              <span>·</span>
              <span>{profile.cefrLevel}</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
              {isNewUser ? "Welcome" : "Welcome back"},{" "}
              <span className="text-primary">{user.fullName}</span>
            </h1>
            <p className="mt-2 text-ink-soft text-[15px] max-w-xl">
              {isNewUser
                ? "Your English journey starts here. Take a quick game or browse vocabulary to earn your first XP."
                : "Pick up where you left off. Every minute counts toward your streak."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[340px]">
            <div className="p-3 bg-white border-2 border-line rounded-2xl text-center">
              <Flame
                className="w-5 h-5 text-reward-dark mx-auto"
                strokeWidth={2.3}
              />
              <div className="mt-1 font-display text-2xl font-extrabold text-ink">
                {profile.currentStreak}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Streak
              </div>
            </div>
            <div className="p-3 bg-white border-2 border-line rounded-2xl text-center">
              <Zap
                className="w-5 h-5 text-primary mx-auto"
                strokeWidth={2.3}
              />
              <div className="mt-1 font-display text-2xl font-extrabold text-ink">
                {profile.totalXp}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Total XP
              </div>
            </div>
            <div className="p-3 bg-white border-2 border-line rounded-2xl text-center">
              <Trophy
                className="w-5 h-5 text-reward-dark mx-auto"
                strokeWidth={2.3}
              />
              <div className="mt-1 font-display text-2xl font-extrabold text-ink">
                {profile.longestStreak}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Best
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-r from-primary-tint/30 to-reward-tint/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-display text-3xl font-extrabold text-primary">{totalWords}+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">Words</div>
          </div>
          <div>
            <div className="font-display text-3xl font-extrabold text-success-dark">{totalGrammar}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Grammar topics
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-extrabold text-reward-dark">6</div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">Games</div>
          </div>
          <div>
            <div className="font-display text-3xl font-extrabold text-rare">CEFR</div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">A1 → C2</div>
          </div>
        </div>
      </Card>

      {/* DAILY GOAL */}
      <Card className="p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" strokeWidth={2.3} />
            <span className="font-display font-extrabold text-ink">
              Today&apos;s goal
            </span>
          </div>
          <span className="text-sm font-bold text-ink">
            {profile.dailyXpEarned} / {profile.dailyGoal} XP
          </span>
        </div>
        <ProgressBar
          value={dailyProgress}
          color={dailyProgress >= 100 ? "success" : "primary"}
          showLabel={false}
        />
        <p className="mt-2 text-xs text-ink-muted">
          {dailyProgress >= 100
            ? "Goal reached! Keep going to extend your lead."
            : `${Math.max(0, profile.dailyGoal - profile.dailyXpEarned)} XP to go — try a quick game.`}
        </p>
      </Card>

      {/* WORD OF THE DAY */}
      {wordOfDay && <WordOfTheDayCard word={wordOfDay} />}

      {recentWords.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={2.3} />
                Fresh additions
              </h2>
              <p className="mt-1 text-ink-soft text-sm">New words just added to the library</p>
            </div>
            <Link
              href="/vocabulary"
              className="text-sm font-bold text-primary hover:text-primary-dark"
            >
              All words →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentWords.map((w) => (
              <Link key={w.slug} href={`/vocabulary/${w.slug}`}>
                <Card interactive className="p-4 h-full">
                  <div className="flex gap-1.5 mb-2">
                    <Badge color="primary" size="sm">
                      {w.cefr_level}
                    </Badge>
                    {w.rarity !== "common" && (
                      <Badge color={w.rarity === "epic" ? "rare" : "primary"} size="sm">
                        {w.rarity}
                      </Badge>
                    )}
                  </div>
                  <div className="font-display text-base font-extrabold text-ink">{w.word}</div>
                  <p className="mt-1 text-xs text-ink-soft line-clamp-2">{w.firstMeaning}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LEVEL PROGRESS */}
      <Card className="p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" strokeWidth={2.3} />
            <span className="font-display font-extrabold text-ink">
              Level {level}
            </span>
          </div>
          <span className="text-sm font-bold text-ink-soft">
            Next level: {nextLevelXp} XP
          </span>
        </div>
        <ProgressBar value={progress} color="primary" showLabel={false} />
        <p className="mt-2 text-xs text-ink-muted">
          {Math.round(progress)}% to level {level + 1}
        </p>
      </Card>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="font-display text-xl font-extrabold text-ink mb-3">
          Quick practice
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/games/word-scramble">
            <Card interactive className="p-5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center mb-3">
                <Gamepad2
                  className="w-6 h-6 text-primary"
                  strokeWidth={2.3}
                />
              </div>
              <h3 className="font-display text-base font-extrabold text-ink">
                Word Scramble
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                60 seconds · Earn up to 100 XP
              </p>
            </Card>
          </Link>
          <Link href="/vocabulary">
            <Card interactive className="p-5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-success-soft flex items-center justify-center mb-3">
                <BookMarked
                  className="w-6 h-6 text-success-dark"
                  strokeWidth={2.3}
                />
              </div>
              <h3 className="font-display text-base font-extrabold text-ink">
                Vocabulary
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                Browse all words · {profile.cefrLevel} level
              </p>
            </Card>
          </Link>
          <Link href="/grammar">
            <Card interactive className="p-5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-reward-soft flex items-center justify-center mb-3">
                <BookOpen
                  className="w-6 h-6 text-reward-dark"
                  strokeWidth={2.3}
                />
              </div>
              <h3 className="font-display text-base font-extrabold text-ink">
                Grammar
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                Rules, examples, quizzes
              </p>
            </Card>
          </Link>
        </div>
      </section>

      {featuredGrammar.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-extrabold text-ink mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-success-dark" strokeWidth={2.3} />
            Master grammar
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredGrammar.map((g) => (
              <Link key={g.slug} href={`/grammar/${g.slug}`}>
                <Card interactive className="p-4 h-full">
                  <Badge color="success" size="sm">
                    {g.cefr_level}
                  </Badge>
                  <h3 className="mt-2 font-display text-base font-extrabold text-ink">{g.title}</h3>
                  <p className="mt-1 text-xs text-ink-soft line-clamp-2">{g.short_description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2">
            <Trophy className="w-5 h-5 text-reward-dark" strokeWidth={2.3} />
            Recent achievements
          </h2>
          {earnedAchievements.length > 0 && (
            <Link
              href="/profile"
              className="text-sm font-bold text-primary hover:text-primary-dark"
            >
              All →
            </Link>
          )}
        </div>
        {earnedAchievements.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="w-12 h-12 text-ink-muted mx-auto mb-3" strokeWidth={2} />
            <div className="font-display text-lg font-extrabold text-ink">No achievements yet</div>
            <p className="mt-1 text-sm text-ink-soft">
              Play a game or learn a word to earn your first badge!
            </p>
            <Link href="/games">
              <Button variant="primary" shape="pill" size="sm" className="mt-4">
                Play a game
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3">
            {earnedAchievements.map((a) => (
              <Card key={a.id} className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-reward-soft flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-reward-dark" strokeWidth={2.3} />
                </div>
                <div>
                  <div className="font-bold text-ink text-sm">{a.title}</div>
                  <div className="text-xs text-ink-muted">{a.description}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
