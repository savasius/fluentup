import { Link } from "@/i18n/navigation";
import { Card, Badge, Button } from "@/components/ui";
import { PronunciationButton } from "./PronunciationButton";
import { Sparkles, ArrowRight } from "lucide-react";
import type { WordOfTheDay } from "@/lib/word-of-the-day";

const rarityColor: Record<WordOfTheDay["rarity"], "slate" | "primary" | "rare"> = {
  common: "slate",
  rare: "primary",
  epic: "rare",
};

export function WordOfTheDayCard({ word }: { word: WordOfTheDay }) {
  return (
    <Card className="p-6 lg:p-8 relative overflow-hidden bg-gradient-to-br from-reward-tint/40 to-primary-tint/40">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-reward-tint rounded-full opacity-60" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-tint rounded-full opacity-40" />

      <div className="relative z-10">
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-reward text-white rounded-full text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Word of the day
          </div>
          <Badge color={rarityColor[word.rarity]} size="sm">
            {word.rarity}
          </Badge>
          <Badge color="slate" size="sm">
            {word.cefr_level}
          </Badge>
          <Badge color="slate" size="sm">
            {word.part_of_speech}
          </Badge>
        </div>

        <div className="mt-1">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-ink">
            {word.word}
          </h2>

          <div className="mt-2 flex items-center flex-wrap gap-4 text-ink-soft">
            {word.phonetic_uk && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase text-ink-muted">
                  UK
                </span>
                <span className="text-sm font-medium">/{word.phonetic_uk}/</span>
                <PronunciationButton text={word.word} accent="uk" />
              </div>
            )}
            {word.phonetic_us && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase text-ink-muted">
                  US
                </span>
                <span className="text-sm font-medium">/{word.phonetic_us}/</span>
                <PronunciationButton text={word.word} accent="us" />
              </div>
            )}
          </div>
        </div>

        {word.definition && (
          <p className="mt-4 text-ink text-[15px] leading-relaxed max-w-2xl">
            {word.definition}
          </p>
        )}

        {word.exampleSentence && (
          <div className="mt-3 pl-3 border-l-2 border-primary text-ink-soft italic text-sm">
            &ldquo;{word.exampleSentence}&rdquo;
          </div>
        )}

        <div className="mt-5">
          <Link href={`/vocabulary/${word.slug}`}>
            <Button
              variant="primary"
              shape="pill"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
            >
              Learn this word
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
