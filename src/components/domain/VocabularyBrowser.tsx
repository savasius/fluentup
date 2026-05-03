"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Card, Badge, Button } from "@/components/ui";
import { EmptyStateIllustration } from "@/components/illustrations";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CefrLevel, WordRarity, PartOfSpeech } from "@/lib/supabase/database.types";

interface WordItem {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  rarity: WordRarity;
  part_of_speech: PartOfSpeech;
  firstMeaning: string;
  created_at: string;
}

type SortMode = "alpha" | "newest" | "level";

const LEVELS: (CefrLevel | "all")[] = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];
const RARITIES: (WordRarity | "all")[] = ["all", "common", "rare", "epic"];

const CEFR_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function VocabularyBrowser({ words }: { words: WordItem[] }) {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<CefrLevel | "all">("all");
  const [rarityFilter, setRarityFilter] = useState<WordRarity | "all">("all");
  const [posFilter, setPosFilter] = useState<PartOfSpeech | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("alpha");

  const partOfSpeechOptions = useMemo(() => {
    const set = new Set(words.map((w) => w.part_of_speech));
    return ["all", ...Array.from(set).sort()] as (PartOfSpeech | "all")[];
  }, [words]);

  const filtered = useMemo(() => {
    let result = words;
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.firstMeaning.toLowerCase().includes(q),
      );
    }
    if (levelFilter !== "all") result = result.filter((w) => w.cefr_level === levelFilter);
    if (rarityFilter !== "all") result = result.filter((w) => w.rarity === rarityFilter);
    if (posFilter !== "all") result = result.filter((w) => w.part_of_speech === posFilter);

    if (sortMode === "alpha") {
      result = [...result].sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortMode === "newest") {
      result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));
    } else if (sortMode === "level") {
      result = [...result].sort(
        (a, b) =>
          CEFR_ORDER.indexOf(a.cefr_level) - CEFR_ORDER.indexOf(b.cefr_level),
      );
    }

    return result;
  }, [words, query, levelFilter, rarityFilter, posFilter, sortMode]);

  const hasFilters =
    query.trim().length > 0 ||
    levelFilter !== "all" ||
    rarityFilter !== "all" ||
    posFilter !== "all";

  function clearAll() {
    setQuery("");
    setLevelFilter("all");
    setRarityFilter("all");
    setPosFilter("all");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
            strokeWidth={2.3}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words or meanings..."
            className="w-full pl-10 pr-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="px-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm font-medium text-ink cursor-pointer focus:border-primary focus:outline-none"
        >
          <option value="alpha">A → Z</option>
          <option value="newest">Newest first</option>
          <option value="level">By CEFR level</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Level:
          </span>
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => setLevelFilter(lv)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition",
                levelFilter === lv
                  ? "bg-primary text-white shadow-solid-primary"
                  : "bg-white border border-line text-ink-soft hover:border-ink-muted",
              )}
            >
              {lv === "all" ? "All" : lv}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Rarity:
          </span>
          {RARITIES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRarityFilter(r)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold capitalize transition",
                rarityFilter === r
                  ? r === "epic"
                    ? "bg-rare text-white"
                    : r === "rare"
                      ? "bg-primary text-white"
                      : "bg-ink text-white"
                  : "bg-white border border-line text-ink-soft hover:border-ink-muted",
              )}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Type:
          </span>
          {partOfSpeechOptions.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosFilter(pos)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold capitalize transition",
                posFilter === pos
                  ? "bg-success text-white"
                  : "bg-white border border-line text-ink-soft hover:border-ink-muted",
              )}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-ink-soft">
          Showing <span className="font-bold text-ink">{filtered.length}</span> of{" "}
          {words.length} words
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-bold text-action-dark hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <EmptyStateIllustration variant="no-results" size={120} className="mx-auto mb-3" />
          <div className="font-display text-lg font-extrabold text-ink">No words found</div>
          <p className="mt-1 text-sm text-ink-soft">Try adjusting your filters or search query</p>
          {hasFilters && (
            <Button variant="secondary" shape="pill" size="sm" onClick={clearAll} className="mt-4">
              Clear filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <Link key={w.slug} href={`/vocabulary/${w.slug}`}>
              <Card interactive className="p-5 h-full">
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <Badge color="primary" size="sm">
                    {w.cefr_level}
                  </Badge>
                  {w.rarity !== "common" && (
                    <Badge color={w.rarity === "epic" ? "rare" : "primary"} size="sm">
                      {w.rarity}
                    </Badge>
                  )}
                  <Badge color="slate" size="sm">
                    {w.part_of_speech}
                  </Badge>
                </div>
                <div className="font-display text-xl font-extrabold text-ink">{w.word}</div>
                <p className="mt-2 text-sm text-ink-soft line-clamp-2">{w.firstMeaning}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
