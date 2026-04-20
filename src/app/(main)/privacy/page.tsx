import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "FluentUp English privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 lg:p-8">
        <h1 className="font-display text-3xl font-extrabold text-ink mb-4">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-ink text-[15px] leading-relaxed">
          <p>Last updated: April 20, 2026</p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            What we collect
          </h2>
          <p>
            When you sign up, we store your email and name. When you use the
            platform, we store your progress (XP, streak, completed lessons) to
            help you learn better.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            How we use data
          </h2>
          <p>
            Your data is used only to provide the learning experience. We
            don&apos;t sell it and don&apos;t share it with third parties for
            advertising.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Cookies
          </h2>
          <p>
            We use cookies for authentication sessions and basic analytics
            (Google Analytics). You can disable them in your browser.
          </p>

          <h2 className="font-display text-xl font-extrabold text-ink mt-6">
            Your rights
          </h2>
          <p>
            You can delete your account anytime. Contact us to request your data
            or deletion.
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
