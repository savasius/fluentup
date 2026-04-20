import { getCurrentUserWithProfile } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUserWithProfile();

  return (
    <AppShell
      user={
        user
          ? {
              id: user.id,
              email: user.email ?? "",
              fullName:
                profile?.full_name ??
                user.email?.split("@")[0] ??
                "",
              avatarUrl: profile?.avatar_url ?? null,
              totalXp: profile?.total_xp ?? 0,
              currentStreak: profile?.current_streak ?? 0,
              cefrLevel: profile?.cefr_level ?? "A1",
            }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
