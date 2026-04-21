"use client";

import { useState, useEffect, useRef, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  BookMarked,
  BookOpen,
  Gamepad2,
  User,
  Sparkles,
  FolderOpen,
  Settings,
  GraduationCap,
  Layers,
  Link2,
  Timer,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { trackEvent } from "@/lib/analytics/events";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  action: () => void;
  group: "Navigate" | "Actions";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) trackEvent("command_palette_opened", {});
          return !o;
        });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const commands: CommandItem[] = [
    {
      id: "home",
      title: "Go to Dashboard",
      icon: Home,
      action: () => router.push("/"),
      group: "Navigate",
    },
    {
      id: "vocab",
      title: "Browse Vocabulary",
      icon: BookMarked,
      action: () => router.push("/vocabulary"),
      group: "Navigate",
    },
    {
      id: "grammar",
      title: "Browse Grammar",
      icon: BookOpen,
      action: () => router.push("/grammar"),
      group: "Navigate",
    },
    {
      id: "lessons",
      title: "Browse lessons",
      icon: GraduationCap,
      action: () => router.push("/lesson"),
      group: "Navigate",
    },
    {
      id: "flashcards",
      title: "Review flashcards",
      icon: Layers,
      action: () => router.push("/flashcards"),
      group: "Navigate",
    },
    {
      id: "games",
      title: "Open Games",
      icon: Gamepad2,
      action: () => router.push("/games"),
      group: "Navigate",
    },
    {
      id: "collections",
      title: "Word Collections",
      icon: FolderOpen,
      action: () => router.push("/collections"),
      group: "Navigate",
    },
    {
      id: "word-of-day",
      title: "Word of the Day Archive",
      icon: Sparkles,
      action: () => router.push("/word-of-the-day"),
      group: "Navigate",
    },
    {
      id: "profile",
      title: "Profile",
      icon: User,
      action: () => router.push("/profile"),
      group: "Navigate",
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      action: () => router.push("/profile/settings"),
      group: "Navigate",
    },
    {
      id: "scramble",
      title: "Play Word Scramble",
      subtitle: "60-second vocabulary game",
      icon: Sparkles,
      action: () => router.push("/games/word-scramble"),
      group: "Actions",
    },
    {
      id: "match",
      title: "Play Word Match",
      subtitle: "Match words with meanings",
      icon: Sparkles,
      action: () => router.push("/games/match"),
      group: "Actions",
    },
    {
      id: "sentence",
      title: "Play Sentence Builder",
      subtitle: "Build correct sentences",
      icon: Sparkles,
      action: () => router.push("/games/sentence-builder"),
      group: "Actions",
    },
    {
      id: "memory",
      title: "Play Memory Match",
      subtitle: "Flip cards, match words",
      icon: Sparkles,
      action: () => router.push("/games/memory-match"),
      group: "Actions",
    },
    {
      id: "hangman",
      title: "Play Hangman",
      subtitle: "Guess the word",
      icon: Sparkles,
      action: () => router.push("/games/hangman"),
      group: "Actions",
    },
    {
      id: "listen",
      title: "Play Listen & Type",
      subtitle: "Listen and spell",
      icon: Sparkles,
      action: () => router.push("/games/listen-type"),
      group: "Actions",
    },
    {
      id: "word-chain",
      title: "Word Chain",
      subtitle: "Link words by last letter",
      icon: Link2,
      action: () => router.push("/games/word-chain"),
      group: "Actions",
    },
    {
      id: "speed-reading",
      title: "Speed Reading",
      subtitle: "Passage + comprehension",
      icon: Timer,
      action: () => router.push("/games/speed-reading"),
      group: "Actions",
    },
    {
      id: "grammar-challenge",
      title: "Grammar Challenge",
      subtitle: "Timed grammar quiz",
      icon: Zap,
      action: () => router.push("/games/grammar-challenge"),
      group: "Actions",
    },
  ];

  const filtered = commands.filter((c) => {
    const needle = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(needle) ||
      (c.subtitle?.toLowerCase().includes(needle) ?? false)
    );
  });

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group]!.push(cmd);
    return acc;
  }, {});

  function handleSelect(cmd: CommandItem) {
    cmd.action();
    setOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Enter") {
        const cmd = filtered[selectedIndex];
        if (cmd) {
          e.preventDefault();
          handleSelect(cmd);
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, selectedIndex]);

  if (!open) return null;

  let runningIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] p-4 bg-ink/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white border-2 border-line rounded-3xl shadow-lift overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-3 border-b border-line">
          <Search
            className="w-5 h-5 text-ink-muted"
            strokeWidth={2.3}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent border-0 outline-none text-ink placeholder:text-ink-muted"
          />
          <kbd className="px-2 py-1 text-xs font-bold bg-line-soft rounded-md text-ink-muted">
            esc
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-ink-muted">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-2">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
                {group}
              </div>
              {items.map((cmd) => {
                const isSelected = runningIndex === selectedIndex;
                const currentIndex = runningIndex;
                runningIndex++;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    onClick={() => handleSelect(cmd)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left",
                      isSelected
                        ? "bg-primary-soft"
                        : "hover:bg-line-soft",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isSelected ? "text-primary" : "text-ink-muted",
                      )}
                      strokeWidth={2.3}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-ink text-sm truncate">
                        {cmd.title}
                      </div>
                      {cmd.subtitle && (
                        <div className="text-xs text-ink-muted truncate">
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 p-2 border-t border-line text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-line-soft rounded text-ink-muted">
              ↑↓
            </kbd>
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 bg-line-soft rounded text-ink-muted">
              ⏎
            </kbd>
            <span>Select</span>
          </div>
          <div>FluentUp</div>
        </div>
      </div>
    </div>
  );
}
