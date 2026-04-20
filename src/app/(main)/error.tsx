"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 lg:p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-action-soft flex items-center justify-center mb-4">
          <AlertCircle
            className="w-8 h-8 text-action-dark"
            strokeWidth={2.3}
          />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-ink">
          Something went wrong
        </h2>
        <p className="mt-2 text-ink-soft">
          We hit a snag loading this page. Try again, or head home.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-ink-muted font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="primary"
            shape="pill"
            onClick={reset}
            icon={RotateCcw}
          >
            Try again
          </Button>
          <Link href="/">
            <Button variant="secondary" shape="pill" icon={Home}>
              Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
