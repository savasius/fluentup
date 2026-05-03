import { getTranslations } from "next-intl/server";
import { KidStoryList } from "@/components/kid/KidStoryList";
import { KID_STORIES } from "@/lib/kid/stories";

export default async function KidStoriesPage() {
  const t = await getTranslations("kid.stories");

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">{t("title")}</h1>
        <p className="text-ink-soft mt-2">{t("subtitle")}</p>
      </div>
      <KidStoryList stories={KID_STORIES} />
    </div>
  );
}
