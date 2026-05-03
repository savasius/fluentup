import { getTranslations } from "next-intl/server";
import { getCurrentUserWithProfile } from "@/lib/auth";

export default async function KidHomePage() {
  const t = await getTranslations("kid.dashboard");
  const { profile } = await getCurrentUserWithProfile();
  const name = profile?.full_name ?? "Friend";

  return (
    <div className="space-y-8 text-lg">
      <h1 className="font-display text-4xl font-extrabold text-ink text-center">
        {t("greeting", { name })}
      </h1>

      <section className="rounded-3xl bg-white border-4 border-kid-sun p-6 shadow-lg">
        <h2 className="font-display text-2xl font-bold text-ink mb-4">
          {t("todayQuest")}
        </h2>
        <ul className="space-y-3 text-ink-soft font-semibold">
          <li>⭐ {t("taskWord")}</li>
          <li>⭐ {t("taskGame")}</li>
          <li>⭐ {t("taskStory")}</li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white border-4 border-kid-mint p-6 shadow-lg text-center">
        <p className="text-sm font-bold text-ink-soft uppercase tracking-wide">
          {t("starsTitle")}
        </p>
        <p className="font-display text-5xl mt-2">⭐⭐⭐</p>
      </section>

      <section className="rounded-3xl bg-white border-4 border-kid-sky p-6 shadow-lg text-center">
        <p className="font-display text-xl font-bold text-ink">{t("figgyCta")}</p>
      </section>

      <section className="rounded-3xl bg-white/80 border-2 border-line p-5">
        <p className="font-bold text-ink text-center">{t("weeklyWords")}</p>
      </section>
    </div>
  );
}
