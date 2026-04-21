import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminBrandLink } from "@/components/admin/AdminChrome";

export const metadata: Metadata = {
  title: "Admin — FluentUp",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Suspense
            fallback={
              <span className="font-display text-xl font-extrabold text-ink">
                FluentUp Admin
              </span>
            }
          >
            <AdminBrandLink className="font-display text-xl font-extrabold text-ink">
              FluentUp Admin
            </AdminBrandLink>
          </Suspense>
          <Link href="/" className="text-sm text-ink-soft hover:text-ink">
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
