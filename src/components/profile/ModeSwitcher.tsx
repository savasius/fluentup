"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { switchProfileMode } from "@/lib/profile/actions";

export function ModeSwitcher({
  currentMode,
}: {
  currentMode: "adult" | "kid";
}) {
  const t = useTranslations("profile");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const target = currentMode === "adult" ? "kid" : "adult";

  function onSwitch() {
    setError(null);
    startTransition(async () => {
      const res = await switchProfileMode(target);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-soft">
        {t("modeCurrent", {
          mode:
            currentMode === "adult" ? t("modeAdult") : t("modeKid"),
        })}
      </p>
      <Button
        type="button"
        variant="secondary"
        shape="pill"
        disabled={pending}
        onClick={() => {
          if (target === "adult" && !window.confirm(t("modeConfirmAdult"))) {
            return;
          }
          onSwitch();
        }}
      >
        {currentMode === "adult"
          ? t("modeSwitchAdultToKid")
          : t("modeSwitchKidToAdult")}
      </Button>
      {error ? (
        <p className="text-sm text-action-dark font-semibold">
          {error === "not_signed_in" ? t("notSignedIn") : error}
        </p>
      ) : null}
    </div>
  );
}
