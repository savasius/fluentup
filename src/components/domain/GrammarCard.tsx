import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { BookOpen } from "lucide-react";
import type { CefrLevel, GrammarCategory } from "@/lib/supabase/database.types";

interface GrammarCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  cefrLevel: CefrLevel;
  category: GrammarCategory;
}

const levelColor: Record<CefrLevel, "primary" | "success" | "rare"> = {
  A1: "success",
  A2: "success",
  B1: "primary",
  B2: "primary",
  C1: "rare",
  C2: "rare",
};

export const GRAMMAR_CATEGORY_LABEL: Record<GrammarCategory, string> = {
  tenses: "Tenses",
  articles: "Articles",
  prepositions: "Prepositions",
  pronouns: "Pronouns",
  modals: "Modal verbs",
  conditionals: "Conditionals",
  passive: "Passive voice",
  "reported-speech": "Reported speech",
  clauses: "Clauses",
  questions: "Questions",
  "word-order": "Word order",
  punctuation: "Punctuation",
};

export function GrammarCard({
  slug,
  title,
  shortDescription,
  cefrLevel,
  category,
}: GrammarCardProps) {
  return (
    <Link href={`/grammar/${slug}`} className="block group">
      <Card interactive className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={2.3} />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <Badge color={levelColor[cefrLevel]} size="sm">
              {cefrLevel}
            </Badge>
          </div>
        </div>

        <div className="mt-1">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            {GRAMMAR_CATEGORY_LABEL[category]}
          </div>
          <h3 className="mt-1 font-display text-lg font-extrabold text-ink leading-tight">
            {title}
          </h3>
        </div>

        <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-2 flex-1">
          {shortDescription}
        </p>

        <div className="mt-4 text-xs font-bold text-primary group-hover:text-primary-dark">
          Learn more →
        </div>
      </Card>
    </Link>
  );
}
