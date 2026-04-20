"use client";

import { useTheme, type Theme } from "@/lib/theme/context";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

const OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-xl bg-white border border-line flex items-center justify-center text-ink-soft hover:text-ink transition"
        aria-label="Toggle theme"
      >
        <Icon className="w-4 h-4" strokeWidth={2.3} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-line rounded-2xl shadow-soft p-1 z-50">
          {OPTIONS.map((opt) => {
            const OptIcon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-primary-soft text-primary-dark"
                    : "text-ink hover:bg-line-soft",
                )}
              >
                <OptIcon className="w-4 h-4" strokeWidth={2.3} />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
