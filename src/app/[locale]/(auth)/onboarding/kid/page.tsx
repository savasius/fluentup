import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { KidOnboardingForm } from "@/components/onboarding/KidOnboardingForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function KidOnboardingPage() {
  await requireAuth();
  return (
    <div className="py-8 px-4">
      <KidOnboardingForm />
    </div>
  );
}
