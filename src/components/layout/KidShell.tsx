"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, BookOpen, Gamepad2, Sparkles, User } from "lucide-react";
import { Mascot } from "@/components/illustrations";
import { cn } from "@/lib/cn";

export function KidShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const tKid = useTranslations("kid.shell");
  const pathname = usePathname();

  const tabs = [
    { href: "/kid", icon: Home, label: t("home") },
    { href: "/kid/words", icon: BookOpen, label: t("vocabulary") },
    { href: "/kid/games", icon: Gamepad2, label: t("games") },
    { href: "/kid/stories", icon: Sparkles, label: t("stories") },
    { href: "/kid/profile", icon: User, label: t("profile") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50">
      <div className="max-w-md mx-auto md:max-w-2xl pb-24 pt-4 px-4">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 bg-reward text-ink text-xs font-bold rounded-full">
            🧒 {tKid("modeBadge")}
          </span>
        </div>
        {children}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-reward shadow-2xl">
        <div className="max-w-md mx-auto md:max-w-2xl flex justify-around py-2">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href ||
              (tab.href !== "/kid" && pathname.startsWith(tab.href));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all",
                  active && "bg-reward/20 scale-110",
                )}
              >
                <Icon
                  className={cn(
                    "w-7 h-7",
                    active ? "text-reward" : "text-ink-soft",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-bold mt-1",
                    active ? "text-ink" : "text-ink-soft",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="fixed bottom-24 right-4 z-40 hidden md:block">
        <Mascot size={80} />
      </div>
    </div>
  );
}
