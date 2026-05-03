"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui";
import type { KidStory } from "@/lib/kid/stories";
export function KidStoryList({ stories }: { stories: KidStory[] }) {
  const tCommon = useTranslations("common");
  const [openId, setOpenId] = useState<string | null>(stories[0]?.id ?? null);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  }, []);

  return (
    <div className="space-y-4">
      {stories.map((story) => {
        const open = openId === story.id;
        return (
          <div
            key={story.id}
            className="rounded-3xl border-4 border-kid-sky bg-white p-5 shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : story.id)}
              className="w-full text-left"
            >
              <p className="text-sm font-bold text-ink-soft">{story.level}</p>
              <h2 className="font-display text-2xl font-extrabold text-ink">
                {story.title}
              </h2>
              <p className="text-ink-soft text-base mt-1">{story.titleTr}</p>
            </button>
            {open && (
              <div className="mt-4 space-y-4 border-t border-line pt-4">
                {story.sentences.map((s, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xl font-bold text-ink leading-relaxed">
                      {s.en}
                    </p>
                    <p className="text-base text-ink-soft">{s.tr}</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      shape="pill"
                      className="mt-1"
                      onClick={() => speak(s.en)}
                    >
                      <Volume2 className="w-4 h-4 inline mr-1" />
                      {tCommon("readAloud")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
