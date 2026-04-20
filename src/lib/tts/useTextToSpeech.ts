"use client";

import { useCallback, useEffect, useState } from "react";

export function useTextToSpeech() {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback(
    (text: string, accent: "uk" | "us" = "us") => {
      if (!supported) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const lang = accent === "uk" ? "en-GB" : "en-US";
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      const voice =
        voices.find((v) => v.lang === lang) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);
    },
    [supported, voices],
  );

  return { supported, speak };
}
