import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "FluentUp English terms of service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 lg:p-8">
        <h1 className="font-display text-3xl font-extrabold text-ink mb-4">
          Terms of Service
        </h1>
        <div className="space-y-4 text-ink text-[15px] leading-relaxed">
          <p>Last updated: April 20, 2026</p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Using FluentUp
          </h2>
          <p>
            An account is required to save progress. The free tier is unlimited
            and permanent — no hidden paywalls on core lessons, vocabulary, or
            games.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Acceptable use
          </h2>
          <p>
            Don&apos;t abuse the service: no automated scraping, no attempts to
            break or overload our systems, no sharing of illegal content. We can
            suspend accounts that do.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Content
          </h2>
          <p>
            FluentUp content (lessons, explanations, illustrations, mascot) is
            provided as-is. We aim for accuracy but don&apos;t guarantee it.
            User-generated content (e.g. profile name) belongs to you; you
            grant us a license to display it back to you.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Changes
          </h2>
          <p>
            We can update these terms. Material changes will be announced in-app
            or by email.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Governing law
          </h2>
          <p>
            These terms are governed by the laws of the Republic of Türkiye.
            Disputes are handled in Istanbul courts.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Contact
          </h2>
          <p>
            Questions? Email:{" "}
            <a
              href="mailto:hello@fluentupenglish.com"
              className="text-primary font-bold hover:underline"
            >
              hello@fluentupenglish.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
