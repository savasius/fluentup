"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("profile");

  function go(next: "tr" | "en") {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => go("tr")}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-bold border-2 transition",
          locale === "tr"
            ? "border-primary bg-primary-soft text-primary-dark"
            : "border-line text-ink-soft hover:bg-line-soft",
        )}
      >
        {t("languageTr")}
      </button>
      <button
        type="button"
        onClick={() => go("en")}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-bold border-2 transition",
          locale === "en"
            ? "border-primary bg-primary-soft text-primary-dark"
            : "border-line text-ink-soft hover:bg-line-soft",
        )}
      >
        {t("languageEn")}
      </button>
    </div>
  );
}
