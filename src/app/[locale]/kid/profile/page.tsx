import { requireAuth, getCurrentUserWithProfile } from "@/lib/auth";
import { Card } from "@/components/ui";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/profile/LocaleSwitcher";
import { ModeSwitcher } from "@/components/profile/ModeSwitcher";

export default async function KidProfilePage() {
  await requireAuth();
  const { user, profile } = await getCurrentUserWithProfile();
  const t = await getTranslations("profile");

  if (!user) return null;

  const mode =
    profile?.mode === "kid" || profile?.mode === "adult"
      ? profile.mode
      : "kid";

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      <Card className="p-6">
        <h1 className="font-display text-2xl font-extrabold text-ink">
          {t("title")}
        </h1>
        <p className="text-ink-soft text-sm mt-1">{user.email}</p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-display text-lg font-extrabold text-ink">
          {t("modeSwitch")}
        </h2>
        <ModeSwitcher currentMode={mode} />
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-display text-lg font-extrabold text-ink">
          {t("language")}
        </h2>
        <LocaleSwitcher />
      </Card>
    </div>
  );
}
