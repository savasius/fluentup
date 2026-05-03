import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function KidWordsPage() {
  const t = await getTranslations("kid.words");

  const cats = [
    { key: "animals", emoji: "🐾", href: "?category=animals", color: "border-kid-coral bg-kid-coral/10" },
    { key: "food", emoji: "🍎", href: "?category=food", color: "border-kid-sun bg-kid-sun/30" },
    { key: "home", emoji: "🏠", href: "?category=home", color: "border-kid-grape bg-kid-grape/15" },
    { key: "school", emoji: "🎒", href: "?category=school", color: "border-kid-sky bg-kid-sky/20" },
    { key: "colors", emoji: "🎨", href: "?category=colors", color: "border-kid-mint bg-kid-mint/20" },
    { key: "numbers", emoji: "🔢", href: "?category=numbers", color: "border-kid-sun bg-orange-100" },
  ] as const;

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">{t("title")}</h1>
        <p className="text-ink-soft mt-2">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cats.map((c) => (
          <Link
            key={c.key}
            href={`/kid/words${c.href}`}
            className={`rounded-3xl border-4 p-6 text-left transition hover:scale-[1.02] ${c.color}`}
          >
            <div className="text-4xl mb-2">{c.emoji}</div>
            <div className="font-display text-xl font-extrabold text-ink">
              {t(c.key)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
