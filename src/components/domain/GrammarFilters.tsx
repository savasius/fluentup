"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/cn";

const LEVELS = ["all", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

const CATEGORIES = [
  { value: "all", label: "All topics" },
  { value: "tenses", label: "Tenses" },
  { value: "articles", label: "Articles" },
  { value: "prepositions", label: "Prepositions" },
  { value: "modals", label: "Modals" },
  { value: "conditionals", label: "Conditionals" },
  { value: "passive", label: "Passive voice" },
  { value: "reported-speech", label: "Reported speech" },
  { value: "clauses", label: "Clauses" },
  { value: "word-order", label: "Word order" },
  { value: "pronouns", label: "Pronouns" },
  { value: "questions", label: "Questions" },
  { value: "punctuation", label: "Punctuation" },
] as const;

export function GrammarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLevel = searchParams.get("level") ?? "all";
  const currentCategory = searchParams.get("category") ?? "all";

  function updateParam(key: "level" | "category", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className={cn("space-y-3", isPending && "opacity-60")}>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
          Level
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => {
            const active = currentLevel === level;
            return (
              <button
                key={level}
                onClick={() => updateParam("level", level)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition",
                  active
                    ? "bg-primary text-white shadow-solid-primary"
                    : "bg-white border border-line text-ink-soft hover:border-ink-muted"
                )}
              >
                {level === "all" ? "All" : level}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
          Category
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = currentCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateParam("category", cat.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition",
                  active
                    ? "bg-ink text-white shadow-solid-dark"
                    : "bg-white border border-line text-ink-soft hover:border-ink-muted"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
