import { Link } from "@/i18n/navigation";
import { Mascot } from "@/components/illustrations/Mascot";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="p-4 lg:p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10">
            <Mascot size={40} />
          </div>
          <span className="font-display text-xl font-extrabold text-ink">
            FluentUp
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="p-4 text-center text-xs text-ink-muted">
        <Link href="/privacy" className="hover:text-ink-soft">
          Privacy
        </Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-ink-soft">
          Terms
        </Link>
      </footer>
    </div>
  );
}
