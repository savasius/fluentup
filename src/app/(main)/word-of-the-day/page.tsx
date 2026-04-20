import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import type {
  CefrLevel,
  Database,
  WordMeaning,
  WordRarity,
} from "@/lib/supabase/database.types";
import { cn } from "@/lib/cn";

type WordRow = Database["public"]["Tables"]["words"]["Row"];
type WordOfDayRow = Database["public"]["Tables"]["word_of_the_day"]["Row"];

export const metadata: Metadata = {
  title: "Word of the Day Archive — FluentUp English",
  description:
    "Browse every Word of the Day. Rare and epic English vocabulary, curated daily.",
  openGraph: {
    title: "Word of the Day Archive — FluentUp English",
    description: "Every Word of the Day, all in one place.",
    type: "website",
  },
};

export const revalidate = 3600;

const rarityColor: Record<WordRarity, "slate" | "primary" | "rare"> = {
  common: "slate",
  rare: "primary",
  epic: "rare",
};

const levelColor: Record<CefrLevel, "primary" | "success" | "rare"> = {
  A1: "success",
  A2: "success",
  B1: "primary",
  B2: "primary",
  C1: "rare",
  C2: "rare",
};

interface ArchiveEntry {
  date: string;
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  rarity: WordRarity;
  definition: string;
}

export default async function WordOfTheDayArchivePage() {
  const supabase = await createServerClient();

  const { data: rawRows } = await supabase
    .from("word_of_the_day")
    .select("date, word_id")
    .order("date", { ascending: false })
    .limit(90);

  const rows = (rawRows ?? []) as Pick<WordOfDayRow, "date" | "word_id">[];
  const wordIds = rows.map((r) => r.word_id);

  let entries: ArchiveEntry[] = [];

  if (wordIds.length > 0) {
    const { data: wordRows } = await supabase
      .from("words")
      .select("id, slug, word, cefr_level, rarity, meanings")
      .in("id", wordIds);

    const words = (wordRows ?? []) as unknown as Array<
      Pick<WordRow, "id" | "slug" | "word" | "cefr_level" | "rarity" | "meanings">
    >;
    const wordMap = new Map(words.map((w) => [w.id, w]));

    entries = rows
      .map((r) => {
        const w = wordMap.get(r.word_id);
        if (!w) return null;
        const def = (w.meanings as WordMeaning[])?.[0]?.definition ?? "";
        return {
          date: r.date,
          slug: w.slug,
          word: w.word,
          cefr_level: w.cefr_level,
          rarity: w.rarity,
          definition: def,
        };
      })
      .filter((e): e is ArchiveEntry => e !== null);
  }

  const grouped = groupByMonth(entries);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
          <Calendar className="w-7 h-7 text-reward" strokeWidth={2.3} />
          Word of the Day
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
          A curated English word every day. Browse the archive and revisit
          past words.
        </p>
      </div>

      {entries.length === 0 ? (
        <Card className="p-8 text-center">
          <Sparkles
            className="w-10 h-10 mx-auto text-ink-muted"
            strokeWidth={2}
          />
          <p className="mt-3 font-bold text-ink">No archive yet.</p>
          <p className="text-sm text-ink-soft mt-1">
            Check back soon — your first Word of the Day arrives daily.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ month, items }) => (
            <section key={month}>
              <h2 className="font-display text-lg font-extrabold text-ink mb-3">
                {month}
              </h2>
              <div className="space-y-2">
                {items.map((e) => (
                  <Link key={e.date} href={`/vocabulary/${e.slug}`}>
                    <Card className="p-4 lg:p-5 transition hover:border-primary hover:shadow-soft">
                      <div className="flex items-start gap-4">
                        <div className="w-14 shrink-0 text-center">
                          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                            {formatShortMonth(e.date)}
                          </div>
                          <div className="font-display text-2xl font-extrabold text-ink">
                            {formatDay(e.date)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display text-xl font-extrabold text-ink">
                              {e.word}
                            </h3>
                            <Badge color={levelColor[e.cefr_level]}>
                              {e.cefr_level}
                            </Badge>
                            <Badge color={rarityColor[e.rarity]}>
                              {e.rarity}
                            </Badge>
                          </div>
                          {e.definition && (
                            <p className="mt-1 text-sm text-ink-soft line-clamp-2">
                              {e.definition}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          className={cn(
                            "w-5 h-5 text-ink-muted shrink-0 mt-1",
                          )}
                          strokeWidth={2.3}
                        />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function groupByMonth(entries: ArchiveEntry[]) {
  const map = new Map<string, ArchiveEntry[]>();
  for (const e of entries) {
    const d = new Date(e.date);
    const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([month, items]) => ({ month, items }));
}

function formatShortMonth(date: string): string {
  return new Date(date).toLocaleString("en-US", { month: "short" });
}

function formatDay(date: string): string {
  return new Date(date).getDate().toString();
}
