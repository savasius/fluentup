"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Notebook,
  GraduationCap,
  Sparkles,
  User,
  FolderOpen,
  Settings,
  Crown,
  HelpCircle,
  LogOut,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut } from "@/lib/auth/actions";
import type { AppUser } from "./AppShell";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/grammar", label: "Grammar", icon: Notebook },
  { href: "/lesson", label: "Lesson", icon: GraduationCap },
  { href: "/tutor", label: "AI Tutor", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
}

export function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-line z-40",
          "flex flex-col transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-6 py-6 border-b border-line-soft">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-solid-primary">
              <span className="font-display text-white font-extrabold text-lg">
                F
              </span>
            </div>
            <div>
              <div className="font-display font-extrabold text-ink leading-tight">
                FluentUp
              </div>
              <div className="text-[10px] text-ink-muted font-bold tracking-widest uppercase">
                English
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-solid-primary"
                    : "text-ink-soft hover:bg-line-soft"
                )}
              >
                <Icon
                  className="w-[18px] h-[18px]"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user ? (
          <div className="p-3">
            <div className="relative overflow-hidden rounded-2xl border border-primary-tint bg-primary-soft p-4">
              <Crown
                className="absolute top-2 right-2 w-5 h-5 text-primary opacity-70"
                fill="#FBBF24"
                strokeWidth={2}
              />
              <div className="font-display text-xs font-extrabold text-primary-dark">
                Go Premium
              </div>
              <p className="mt-0.5 text-[11px] text-ink-soft font-medium leading-snug mb-2">
                Unlock advanced drills
              </p>
              <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-primary rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <Link
              href="/signup"
              onClick={onClose}
              className="block rounded-2xl bg-primary p-4 text-white shadow-solid-primary hover:-translate-y-0.5 transition"
            >
              <div className="font-display text-sm font-extrabold">
                Join FluentUp
              </div>
              <p className="mt-0.5 text-[11px] opacity-90 leading-snug">
                Free forever. Save your progress.
              </p>
            </Link>
          </div>
        )}

        <div className="px-3 pb-4 pt-3 space-y-1 border-t border-line-soft">
          <Link
            href="/privacy"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-ink-soft hover:bg-line-soft"
          >
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            Help & legal
          </Link>
          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-ink-soft hover:bg-line-soft"
              >
                <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-ink-soft hover:bg-line-soft"
            >
              <LogIn className="w-[18px] h-[18px]" strokeWidth={2} />
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
