import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui";
import { FolderOpen, ArrowRight } from "lucide-react";
import { COLLECTIONS } from "@/lib/collections/data";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Collections — Curated vocabulary lists",
  description:
    "Hand-picked English vocabulary collections by level and theme. Start from essentials and work up to rare words.",
  openGraph: {
    title: "Collections — FluentUp English",
    description: "Curated vocabulary lists by level and theme.",
    type: "website",
  },
};

const accentStyles: Record<string, string> = {
  primary: "bg-primary-tint border-primary-soft",
  action: "bg-action-soft border-action-tint",
  reward: "bg-reward-soft border-reward-tint",
  success: "bg-success-soft border-success-tint",
  rare: "bg-rare-tint border-rare-soft",
  teal: "bg-teal-tint border-teal-soft",
};

export default function CollectionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
          <FolderOpen className="w-7 h-7 text-primary" strokeWidth={2.3} />
          Collections
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
          Curated vocabulary lists grouped by level, rarity, and theme. Pick a
          collection and study one focused set at a time.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="group"
          >
            <Card
              className={cn(
                "p-5 lg:p-6 h-full transition hover:-translate-y-0.5 hover:shadow-soft border-2",
                accentStyles[c.accentColor],
              )}
            >
              <div className="text-4xl" aria-hidden>
                {c.emoji}
              </div>
              <h2 className="mt-3 font-display text-xl font-extrabold text-ink">
                {c.title}
              </h2>
              <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                {c.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink group-hover:text-primary transition">
                Explore
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition"
                  strokeWidth={2.5}
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
