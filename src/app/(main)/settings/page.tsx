import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { Card, Button } from "@/components/ui";
import { Settings, User, Download, Trash2, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DeleteAccountForm, DataExportButton } from "@/components/domain";

export const metadata: Metadata = {
  title: "Settings — FluentUp English",
  description:
    "Manage your account, appearance, export your data, and delete your account.",
};

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-3xl font-extrabold text-ink flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary" strokeWidth={2.3} />
          Settings
        </h1>
        <Card className="p-6 text-center">
          <p className="text-ink-soft">Sign in to manage your account.</p>
          <Link href="/login" className="inline-block mt-4">
            <Button variant="primary" shape="pill" icon={LogIn}>
              Sign in
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary" strokeWidth={2.3} />
          Settings
        </h1>
        <p className="mt-2 text-ink-soft text-[15px]">
          Manage your preferences and account.
        </p>
      </div>

      <Card className="p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-ink-soft" strokeWidth={2.3} />
          <h2 className="font-display text-lg font-extrabold text-ink">
            Account
          </h2>
        </div>
        <dl className="text-sm space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Email</dt>
            <dd className="font-bold text-ink">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">User ID</dt>
            <dd className="font-mono text-xs text-ink-soft">
              {user.id.slice(0, 12)}…
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5 lg:p-6">
        <h2 className="font-display text-lg font-extrabold text-ink mb-3">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-soft">Theme</p>
          <ThemeToggle />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Download className="w-5 h-5 text-ink-soft" strokeWidth={2.3} />
          <h2 className="font-display text-lg font-extrabold text-ink">
            Data export
          </h2>
        </div>
        <p className="text-sm text-ink-soft mb-4">
          Download all your data (profile, progress, stats) as a JSON file.
        </p>
        <DataExportButton />
      </Card>

      <Card className="p-5 lg:p-6 border-action-tint bg-action-soft">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="w-5 h-5 text-action-dark" strokeWidth={2.3} />
          <h2 className="font-display text-lg font-extrabold text-action-dark">
            Delete account
          </h2>
        </div>
        <p className="text-sm text-ink-soft mb-4">
          Permanently delete your profile and learning data. This cannot be
          undone. Type <span className="font-mono font-bold">DELETE</span> to
          confirm.
        </p>
        <DeleteAccountForm />
      </Card>
    </div>
  );
}
