import { requireAuth, getCurrentUserWithProfile } from "@/lib/auth";
import { Card, Badge } from "@/components/ui";
import { ProfileForm } from "@/components/domain/ProfileForm";
import {
  User as UserIcon,
  Calendar,
  Flame,
  Zap,
  Trophy,
} from "lucide-react";

export default async function ProfilePage() {
  await requireAuth();
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) return null;

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "recently";

  const fullName = profile?.full_name ?? "FluentUp Learner";
  const cefrLevel = profile?.cefr_level ?? "A1";
  const totalXp = profile?.total_xp ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-tint rounded-full opacity-50" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-3xl bg-primary text-white font-extrabold text-3xl flex items-center justify-center shadow-solid-primary flex-shrink-0">
            {(fullName[0] ?? user.email?.[0] ?? "U").toUpperCase()}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink">
              {fullName}
            </h1>
            <p className="mt-1 text-ink-muted text-sm">{user.email}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge color="primary">{cefrLevel} level</Badge>
              <Badge color="slate" icon={Calendar}>
                Since {joinedDate}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <Zap
            className="w-5 h-5 text-primary mx-auto"
            strokeWidth={2.3}
          />
          <div className="mt-1 font-display text-2xl font-extrabold text-ink tabular-nums">
            {totalXp}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Total XP
          </div>
        </Card>
        <Card className="p-4 text-center">
          <Flame
            className="w-5 h-5 text-reward-dark mx-auto"
            strokeWidth={2.3}
          />
          <div className="mt-1 font-display text-2xl font-extrabold text-ink tabular-nums">
            {currentStreak}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Day streak
          </div>
        </Card>
        <Card className="p-4 text-center">
          <Trophy
            className="w-5 h-5 text-reward-dark mx-auto"
            strokeWidth={2.3}
          />
          <div className="mt-1 font-display text-2xl font-extrabold text-ink tabular-nums">
            {longestStreak}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Best streak
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-extrabold text-ink flex items-center gap-2 mb-4">
          <UserIcon className="w-5 h-5 text-primary" strokeWidth={2.3} />
          Edit profile
        </h2>
        <ProfileForm
          initialFullName={fullName === "FluentUp Learner" ? "" : fullName}
          initialCefrLevel={cefrLevel}
        />
      </Card>
    </div>
  );
}
