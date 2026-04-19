"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/cn";

const LEVELS = ["all", "A1", "A2", "B1", "B2", "C1", "C2"] as const;
const RARITIES = ["all", "common", "rare", "epic"] as const;

export function VocabularyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLevel = searchParams.get("level") ?? "all";
  const currentRarity = searchParams.get("rarity") ?? "all";

  function updateParam(key: "level" | "rarity", value: string) {
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
      {/* Level filter */}
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

      {/* Rarity filter */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
          Rarity
        </div>
        <div className="flex flex-wrap gap-2">
          {RARITIES.map((rarity) => {
            const active = currentRarity === rarity;
            return (
              <button
                key={rarity}
                onClick={() => updateParam("rarity", rarity)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition",
                  active
                    ? "bg-ink text-white shadow-solid-dark"
                    : "bg-white border border-line text-ink-soft hover:border-ink-muted"
                )}
              >
                {rarity}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
