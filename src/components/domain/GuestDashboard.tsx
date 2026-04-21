import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { WordOfTheDayCard } from "./WordOfTheDayCard";
import { Mascot } from "@/components/illustrations";
import {
  Gamepad2,
  BookMarked,
  BookOpen,
  Shuffle,
  Link2,
  Trophy,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import type { WordOfTheDay } from "@/lib/word-of-the-day";
import type { CefrLevel, WordRarity } from "@/lib/supabase/database.types";

export interface GuestPreviewWord {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  rarity: WordRarity;
  part_of_speech: string;
  firstMeaning: string;
}

export interface FeaturedGrammarTopic {
  slug: string;
  title: string;
  cefr_level: CefrLevel;
  short_description: string;
}

interface Props {
  wordOfDay: WordOfTheDay | null;
  totalWords: number;
  totalGrammar: number;
  previewWords: GuestPreviewWord[];
  recentWords: GuestPreviewWord[];
  featuredGrammar: FeaturedGrammarTopic[];
}

const CEFR_LEVELS: {
  level: CefrLevel;
  label: string;
  color: "success" | "primary" | "rare";
}[] = [
  { level: "A1", label: "Beginner", color: "success" },
  { level: "A2", label: "Elementary", color: "success" },
  { level: "B1", label: "Intermediate", color: "primary" },
  { level: "B2", label: "Upper Int.", color: "primary" },
  { level: "C1", label: "Advanced", color: "rare" },
  { level: "C2", label: "Proficient", color: "rare" },
];

export function GuestDashboard({
  wordOfDay,
  totalWords,
  totalGrammar,
  previewWords,
  recentWords,
  featuredGrammar,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Card className="p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 lg:top-8 lg:right-8 hidden md:block">
            <Mascot size={140} />
          </div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-tint rounded-full opacity-50" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-reward-soft text-reward-dark rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              Free forever · No ads
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-ink leading-tight">
              Learn English without the fluff.
            </h1>

            <p className="mt-3 text-ink-soft text-lg max-w-xl">
              {totalWords}+ CEFR-aligned words, interactive grammar, and fun
              games. Try it now &mdash; no sign-up needed.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button
                  variant="primary"
                  shape="pill"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Create free account
                </Button>
              </Link>
              <Link href="/vocabulary">
                <Button variant="secondary" shape="pill" size="lg">
                  Try vocabulary
                </Button>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-ink-soft">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-success" strokeWidth={3} />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-success" strokeWidth={3} />
                <span>CEFR A1 to C2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-success" strokeWidth={3} />
                <span>No ads, ever</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

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

      {/* WORD OF THE DAY */}
      {wordOfDay && (
        <section>
          <WordOfTheDayCard word={wordOfDay} />
        </section>
      )}

      {recentWords.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-ink flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" strokeWidth={2.3} />
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

      {/* GAMES TEASER */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-ink flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" strokeWidth={2.3} />
              Play &amp; learn
            </h2>
            <p className="mt-1 text-ink-soft text-sm">
              No sign-up required &mdash; play immediately
            </p>
          </div>
          <Link
            href="/games"
            className="text-sm font-bold text-primary hover:text-primary-dark"
          >
            All games →
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/games/word-scramble">
            <Card interactive className="p-5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center mb-3">
                <Shuffle
                  className="w-6 h-6 text-primary"
                  strokeWidth={2.3}
                />
              </div>
              <h3 className="font-display text-lg font-extrabold text-ink">
                Word Scramble
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Unscramble letters before time runs out
              </p>
              <div className="mt-3 text-xs font-bold text-primary">
                Play now →
              </div>
            </Card>
          </Link>
          <Link href="/games/match">
            <Card interactive className="p-5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-success-soft flex items-center justify-center mb-3">
                <Link2
                  className="w-6 h-6 text-success-dark"
                  strokeWidth={2.3}
                />
              </div>
              <h3 className="font-display text-lg font-extrabold text-ink">
                Word Match
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Match words with their meanings
              </p>
              <div className="mt-3 text-xs font-bold text-primary">
                Play now →
              </div>
            </Card>
          </Link>
          <Link href="/games/sentence-builder">
            <Card interactive className="p-5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-reward-soft flex items-center justify-center mb-3">
                <Trophy
                  className="w-6 h-6 text-reward-dark"
                  strokeWidth={2.3}
                />
              </div>
              <h3 className="font-display text-lg font-extrabold text-ink">
                Sentence Builder
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Arrange words to form sentences
              </p>
              <div className="mt-3 text-xs font-bold text-primary">
                Play now →
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* BROWSE BY LEVEL */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-ink flex items-center gap-2">
              <BookMarked
                className="w-6 h-6 text-primary"
                strokeWidth={2.3}
              />
              Browse by level
            </h2>
            <p className="mt-1 text-ink-soft text-sm">
              Not sure where to start? Take the placement quiz after sign-up.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CEFR_LEVELS.map((lv) => (
            <Link key={lv.level} href={`/vocabulary?level=${lv.level}`}>
              <Card interactive className="p-4 text-center">
                <Badge color={lv.color} size="md">
                  {lv.level}
                </Badge>
                <div className="mt-2 text-xs font-bold text-ink-soft">
                  {lv.label}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {featuredGrammar.length > 0 && (
        <section>
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-ink mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-success-dark" strokeWidth={2.3} />
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

      {/* PREVIEW WORDS */}
      {previewWords.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-ink flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-rare" strokeWidth={2.3} />
              Rare &amp; advanced
            </h2>
            <Link
              href="/vocabulary?rarity=epic"
              className="text-sm font-bold text-primary hover:text-primary-dark"
            >
              See all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewWords.map((w) => (
              <Link key={w.slug} href={`/vocabulary/${w.slug}`}>
                <Card interactive className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color="rare" size="sm">
                      {w.rarity}
                    </Badge>
                    <Badge color="slate" size="sm">
                      {w.cefr_level}
                    </Badge>
                  </div>
                  <div className="font-display text-xl font-extrabold text-ink">
                    {w.word}
                  </div>
                  <p className="mt-2 text-sm text-ink-soft line-clamp-2">
                    {w.firstMeaning}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section>
        <Card className="p-8 lg:p-10 text-center relative overflow-hidden bg-gradient-to-br from-primary-tint/60 to-primary-soft/60 border-primary-tint">
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-extrabold text-ink">
              Ready to get started?
            </h2>
            <p className="mt-2 text-ink-soft max-w-md mx-auto">
              Create a free account to save progress, track streaks, and
              unlock personalized learning.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/signup">
                <Button variant="primary" shape="pill" size="lg">
                  Sign up free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" shape="pill" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
