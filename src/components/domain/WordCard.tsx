import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { Sparkles } from "lucide-react";
import type {
  CefrLevel,
  WordRarity,
  WordMeaning,
} from "@/lib/supabase/database.types";

interface WordCardProps {
  slug: string;
  word: string;
  phonetic?: string | null;
  cefrLevel: CefrLevel;
  rarity: WordRarity;
  partOfSpeech: string;
  firstMeaning: string;
}

const levelColor: Record<CefrLevel, "primary" | "success" | "rare"> = {
  A1: "success",
  A2: "success",
  B1: "primary",
  B2: "primary",
  C1: "rare",
  C2: "rare",
};

const rarityColor: Record<WordRarity, "slate" | "primary" | "rare"> = {
  common: "slate",
  rare: "primary",
  epic: "rare",
};

export function WordCard({
  slug,
  word,
  phonetic,
  cefrLevel,
  rarity,
  partOfSpeech,
  firstMeaning,
}: WordCardProps) {
  return (
    <Link href={`/vocabulary/${slug}`} className="block">
      <Card interactive className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge color={levelColor[cefrLevel]} size="sm">
              {cefrLevel}
            </Badge>
            <Badge color="slate" size="sm">
              {partOfSpeech}
            </Badge>
          </div>
          {rarity !== "common" && (
            <Badge color={rarityColor[rarity]} size="sm" icon={Sparkles}>
              {rarity}
            </Badge>
          )}
        </div>

        <div className="mt-1">
          <div className="font-display text-2xl font-extrabold text-ink leading-tight">
            {word}
          </div>
          {phonetic && (
            <div className="mt-0.5 text-sm text-ink-muted font-medium">
              /{phonetic}/
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-ink-soft leading-relaxed line-clamp-3 flex-1">
          {firstMeaning}
        </p>

        <div className="mt-4 text-xs font-bold text-primary group-hover:text-primary-dark">
          Read more →
        </div>
      </Card>
    </Link>
  );
}

export function WordCardHelpers() {
  return null;
}

// Helper to extract first meaning from jsonb column
export function extractFirstMeaning(meanings: WordMeaning[] | unknown): string {
  if (!Array.isArray(meanings) || meanings.length === 0) return "";
  const first = meanings[0] as WordMeaning;
  return first?.definition ?? "";
}
