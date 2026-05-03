"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AnonSignupBanner() {
  const t = useTranslations("vocabulary");

  return (
    <div className="bg-primary text-white px-4 py-2 text-center text-sm rounded-xl mb-4">
      {t.rich("anonBanner", {
        link: (chunks) => (
          <Link href="/signup" className="underline font-bold">
            {chunks}
          </Link>
        ),
      })}
    </div>
  );
}
