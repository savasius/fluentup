"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/lib/auth/actions";
import { User, Settings, LogOut } from "lucide-react";
import type { AppUser } from "./AppShell";

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export function UserMenu({ user }: { user: AppUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-xl bg-primary text-white font-extrabold text-sm flex items-center justify-center shadow-solid-primary hover:-translate-y-0.5 transition overflow-hidden"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.fullName}
            width={40}
            height={40}
            className="w-full h-full rounded-xl object-cover"
          />
        ) : (
          getInitials(user.fullName || user.email)
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-line shadow-lift overflow-hidden z-50">
          <div className="p-3 border-b border-line-soft">
            <div className="font-bold text-ink truncate">
              {user.fullName || "FluentUp Learner"}
            </div>
            <div className="text-xs text-ink-muted truncate">{user.email}</div>
          </div>
          <div className="p-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-ink hover:bg-line-soft transition"
              onClick={() => setOpen(false)}
            >
              <User className="w-4 h-4" strokeWidth={2.3} />
              Profile
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-ink hover:bg-line-soft transition"
              onClick={() => setOpen(false)}
            >
              <Settings className="w-4 h-4" strokeWidth={2.3} />
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-action-dark hover:bg-action-soft transition"
              >
                <LogOut className="w-4 h-4" strokeWidth={2.3} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
