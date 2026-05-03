"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { GraduationCap, Baby } from "lucide-react";
import { Mascot } from "@/components/illustrations";

export function ModeSelectionLanding() {
  const t = useTranslations("landing");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pick(mode: "adult" | "kid") {
    startTransition(async () => {
      await fetch("/api/mode-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      router.push("/signup");
    });
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-b from-paper to-primary/5 px-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <Mascot size={120} />
          </div>
          <h1 className="font-display text-5xl font-extrabold text-ink mt-6">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-ink-soft mt-3">{t("heroSubtitle")}</p>
        </div>

        <h2 className="font-display text-2xl font-bold text-center mb-8">
          {t("modeQuestion")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => pick("adult")}
            disabled={pending}
            className="group p-8 bg-white border-2 border-line hover:border-primary rounded-3xl text-left transition-all hover:-translate-y-1 disabled:opacity-60"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div className="font-display text-2xl font-extrabold text-ink mb-2">
              {t("adultMode")}
            </div>
            <div className="text-ink-soft">{t("adultModeDesc")}</div>
          </button>

          <button
            type="button"
            onClick={() => pick("kid")}
            disabled={pending}
            className="group p-8 bg-white border-2 border-line hover:border-reward rounded-3xl text-left transition-all hover:-translate-y-1 disabled:opacity-60"
          >
            <div className="w-16 h-16 bg-reward/20 rounded-2xl flex items-center justify-center mb-4">
              <Baby className="w-8 h-8 text-reward" />
            </div>
            <div className="font-display text-2xl font-extrabold text-ink mb-2">
              {t("kidMode")}
            </div>
            <div className="text-ink-soft">{t("kidModeDesc")}</div>
          </button>
        </div>
      </div>
    </div>
  );
}
