import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, Badge } from "@/components/ui";
import { verifyAdminPageToken } from "@/lib/admin/auth";
import { BookMarked, BookOpen, Users } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminStatsPayload {
  wordsTotal: number;
  grammarTotal: number;
  usersTotal: number;
  wordsByLevel: Record<string, number>;
  wordsByRarity: Record<string, number>;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!verifyAdminPageToken(token)) {
    redirect("/");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const res = await fetch(`${proto}://${host}/api/admin/stats`, {
    headers: { "x-admin-token": token! },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/");
  }

  const stats = (await res.json()) as AdminStatsPayload;
  const { wordsTotal, grammarTotal, usersTotal, wordsByLevel, wordsByRarity } =
    stats;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <BookMarked className="w-6 h-6 text-primary mb-2" strokeWidth={2.3} />
          <div className="font-display text-3xl font-extrabold text-ink">
            {wordsTotal}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Words published
          </div>
        </Card>
        <Card className="p-5">
          <BookOpen className="w-6 h-6 text-success-dark mb-2" strokeWidth={2.3} />
          <div className="font-display text-3xl font-extrabold text-ink">
            {grammarTotal}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Grammar topics
          </div>
        </Card>
        <Card className="p-5">
          <Users className="w-6 h-6 text-reward-dark mb-2" strokeWidth={2.3} />
          <div className="font-display text-3xl font-extrabold text-ink">
            {usersTotal}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Registered users
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-extrabold text-ink mb-4">
          Words by CEFR level
        </h2>
        <div className="space-y-2">
          {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lv) => {
            const count = wordsByLevel[lv] ?? 0;
            const pct = wordsTotal > 0 ? (count / wordsTotal) * 100 : 0;
            return (
              <div key={lv} className="flex items-center gap-3">
                <Badge
                  color={
                    lv.startsWith("A")
                      ? "success"
                      : lv.startsWith("B")
                        ? "primary"
                        : "rare"
                  }
                  size="sm"
                >
                  {lv}
                </Badge>
                <div className="flex-1 h-6 bg-line-soft rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-ink w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg font-extrabold text-ink mb-4">
          Words by rarity
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {(["common", "rare", "epic"] as const).map((r) => (
            <div
              key={r}
              className="p-4 bg-paper rounded-2xl border border-line text-center"
            >
              <Badge
                color={r === "epic" ? "rare" : r === "rare" ? "primary" : "slate"}
                size="sm"
              >
                {r}
              </Badge>
              <div className="mt-2 font-display text-2xl font-extrabold text-ink">
                {wordsByRarity[r] ?? 0}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-primary-soft border-primary-tint">
        <h2 className="font-display text-lg font-extrabold text-ink mb-2">
          Quick actions
        </h2>
        <ul className="space-y-2 text-sm text-ink">
          <li>
            → Add words: POST to{" "}
            <code className="px-2 py-1 bg-white rounded text-xs">
              /api/admin/words/import
            </code>{" "}
            with header{" "}
            <code className="px-2 py-1 bg-white rounded text-xs">
              x-admin-token
            </code>
          </li>
          <li>
            → Enrich from API:{" "}
            <code className="px-2 py-1 bg-white rounded text-xs">
              npx tsx scripts/enrich-words-from-api.ts
            </code>
          </li>
          <li>
            → Seed grammar:{" "}
            <code className="px-2 py-1 bg-white rounded text-xs">
              npx tsx scripts/seed-grammar-v2.ts
            </code>
          </li>
        </ul>
      </Card>
    </div>
  );
}
