"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/server";

export type KidOnboardingState = {
  error?: string;
};

export async function completeKidOnboarding(
  _prev: KidOnboardingState,
  formData: FormData,
): Promise<KidOnboardingState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not signed in" };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const ageRaw = Number(formData.get("age"));
  const parentEmail = String(formData.get("parentEmail") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!fullName) {
    return { error: "name_required" };
  }
  if (!Number.isFinite(ageRaw) || ageRaw < 6 || ageRaw > 13) {
    return { error: "age_invalid" };
  }
  if (!parentEmail || !parentEmail.includes("@")) {
    return { error: "parent_email" };
  }
  if (!consent) {
    return { error: "consent" };
  }

  const supabase = await createServerClient();
  const now = new Date().toISOString();

  const interestTags: string[] = [];
  if (formData.get("i_animals") === "on") interestTags.push("animals");
  if (formData.get("i_food") === "on") interestTags.push("food");
  if (formData.get("i_vehicles") === "on") interestTags.push("vehicles");
  if (formData.get("i_colors") === "on") interestTags.push("colors");
  const kidInterests = interestTags.length > 0 ? interestTags : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      age: Math.round(ageRaw),
      parent_email: parentEmail,
      parent_consent: true,
      parent_consent_at: now,
      kid_interests: kidInterests,
      mode: "kid",
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/kid");
}
