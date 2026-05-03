import type { Metadata } from "next";
import { requireAuth, getCurrentUserWithProfile } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { Card, Button } from "@/components/ui";
import { Award, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Download certificates for lesson milestones.",
};

export default async function CertificatesPage() {
  await requireAuth();
  const { user, profile } = await getCurrentUserWithProfile();
  if (!user || !profile) return null;

  const supabase = await createServerClient();
  const { count: completedCount } = await supabase
    .from("user_lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const total = completedCount ?? 0;
  const milestones = [10, 20, 30, 50, 100];
  const earned = milestones.filter((m) => total >= m);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Certificates</h1>

      {earned.length === 0 ? (
        <Card className="p-8 text-center">
          <Award className="w-12 h-12 text-ink-muted mx-auto mb-3" strokeWidth={2} />
          <h2 className="font-display text-lg font-extrabold text-ink">No certificates yet</h2>
          <p className="mt-1 text-ink-soft">
            Complete 10 lessons to earn your first certificate.
          </p>
          <p className="mt-3 text-sm text-primary font-bold">{total} / 10 lessons completed</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {earned.map((m) => (
            <Card
              key={m}
              className="p-6 text-center bg-gradient-to-br from-reward-tint/40 to-primary-tint/40"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-reward flex items-center justify-center shadow-solid-reward mb-3">
                <Award className="w-8 h-8 text-white" strokeWidth={2.3} />
              </div>
              <h3 className="font-display text-xl font-extrabold text-ink">{m} Lessons</h3>
              <p className="mt-1 text-sm text-ink-soft">Certificate of completion</p>
              <div className="mt-4">
                <a
                  href={`/api/certificate?milestone=${m}&name=${encodeURIComponent(profile.full_name ?? "Learner")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" shape="pill" size="sm" icon={Download}>
                    Download PNG
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
