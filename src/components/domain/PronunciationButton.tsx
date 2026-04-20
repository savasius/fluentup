"use client";

import { useTextToSpeech } from "@/lib/tts/useTextToSpeech";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { trackEvent } from "@/lib/analytics/events";

interface Props {
  text: string;
  accent: "uk" | "us";
  className?: string;
}

export function PronunciationButton({ text, accent, className }: Props) {
  const { supported, speak } = useTextToSpeech();

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => {
        speak(text, accent);
        trackEvent("pronunciation_played", { accent });
      }}
      className={cn(
        "w-8 h-8 bg-white hover:bg-primary-soft border border-line rounded-xl flex items-center justify-center text-ink-soft hover:text-primary transition",
        className,
      )}
      aria-label={`Play ${accent.toUpperCase()} pronunciation of ${text}`}
    >
      <Volume2 className="w-3.5 h-3.5" strokeWidth={2.5} />
    </button>
  );
}
