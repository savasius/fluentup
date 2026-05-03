"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Card, Button } from "@/components/ui";
import {
  completeKidOnboarding,
  type KidOnboardingState,
} from "@/lib/profile/kid-onboarding";

const initial: KidOnboardingState = {};

export function KidOnboardingForm() {
  const t = useTranslations("onboarding");
  const tErr = useTranslations("errors");
  const [state, formAction, pending] = useActionState(
    completeKidOnboarding,
    initial,
  );

  const err =
    state.error === "name_required"
      ? tErr("required")
      : state.error === "age_invalid" || state.error === "age_range"
        ? tErr("ageInvalid")
        : state.error === "parent_email"
          ? tErr("parentEmailRequired")
          : state.error === "consent"
            ? tErr("required")
            : state.error;

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-extrabold text-ink mb-4">
        {t("welcome")}
      </h1>
      {err ? (
        <p className="text-sm text-action-dark font-bold mb-4">{err}</p>
      ) : null}
      <form action={formAction} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-ink block mb-1">
            {t("namePrompt")}
          </label>
          <input
            name="fullName"
            required
            className="w-full rounded-xl border border-line px-3 py-2"
            placeholder={t("namePlaceholder")}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-ink block mb-1">
            {t("kidAge")}
          </label>
          <input
            name="age"
            type="number"
            min={6}
            max={13}
            required
            className="w-full rounded-xl border border-line px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-ink block mb-1">
            {t("kidParentEmail")}
          </label>
          <p className="text-xs text-ink-soft mb-1">{t("kidParentEmailHelp")}</p>
          <input
            name="parentEmail"
            type="email"
            required
            className="w-full rounded-xl border border-line px-3 py-2"
            autoComplete="email"
          />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input name="consent" type="checkbox" className="mt-1" required />
          <span>{t("kidParentConsent")}</span>
        </label>
        <p className="text-sm font-bold text-ink">
          {t("kidInterestsOptional")}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input name="i_animals" type="checkbox" /> 🐾 {t("interestAnimals")}
          </label>
          <label className="flex items-center gap-2">
            <input name="i_food" type="checkbox" /> 🍎 {t("interestFood")}
          </label>
          <label className="flex items-center gap-2">
            <input name="i_vehicles" type="checkbox" /> 🚗{" "}
            {t("interestVehicles")}
          </label>
          <label className="flex items-center gap-2">
            <input name="i_colors" type="checkbox" /> 🎨 {t("interestColors")}
          </label>
        </div>
        <Button
          type="submit"
          variant="primary"
          shape="pill"
          className="w-full"
          disabled={pending}
        >
          {t("resultCta")}
        </Button>
      </form>
    </Card>
  );
}
