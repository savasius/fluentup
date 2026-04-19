"use client";

import { Menu, Search, Flame, Zap, Bell } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-line">
      <div className="h-16 px-5 lg:px-8 flex items-center gap-3 lg:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-ink-soft hover:bg-line-soft"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Search words, lessons…"
              className="w-full bg-line-soft border border-line rounded-2xl py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-muted focus:outline-none focus:bg-white focus:border-primary transition"
            />
          </div>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Streak + XP + Bell + Avatar */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-1.5 bg-reward-soft border border-reward-tint px-2.5 py-1.5 rounded-xl">
            <Flame
              className="w-4 h-4 text-reward"
              fill="#F59E0B"
              strokeWidth={2.5}
            />
            <span className="font-extrabold text-sm text-reward-dark">12</span>
          </div>

          <div className="flex items-center gap-1.5 bg-primary-soft border border-primary-tint px-2.5 py-1.5 rounded-xl">
            <Zap
              className="w-4 h-4 text-primary"
              fill="#2563EB"
              strokeWidth={2.5}
            />
            <span className="font-extrabold text-sm text-primary-dark">
              2,840
            </span>
          </div>

          <button
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-line-soft text-ink-soft relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={2.5} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-action rounded-full" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-solid-primary">
            AY
          </div>
        </div>
      </div>
    </header>
  );
}
