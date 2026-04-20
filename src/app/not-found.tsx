import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { Mascot } from "@/components/illustrations/Mascot";
import { Home, Search } from "lucide-react";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <Card className="p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-tint rounded-full opacity-50" />
          <div className="relative z-10">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <Mascot size={128} mood="thinking" />
            </div>
            <div className="font-display text-7xl font-extrabold text-primary mb-2">
              404
            </div>
            <h1 className="font-display text-2xl font-extrabold text-ink">
              Page not found
            </h1>
            <p className="mt-2 text-ink-soft">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/">
                <Button variant="primary" shape="pill" icon={Home}>
                  Go home
                </Button>
              </Link>
              <Link href="/vocabulary">
                <Button variant="secondary" shape="pill" icon={Search}>
                  Browse vocabulary
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
