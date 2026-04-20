import { requireAuth } from "@/lib/auth";
import { PlacementQuiz } from "@/components/domain/PlacementQuiz";

export default async function OnboardingPage() {
  await requireAuth();
  return <PlacementQuiz />;
}
