"use client";

import { useToast, type ToastVariant } from "@/lib/toast/context";
import { CheckCircle2, XCircle, Info, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface VariantConfig {
  icon: LucideIcon;
  bg: string;
  border: string;
  iconColor: string;
}

const variantConfig: Record<ToastVariant, VariantConfig> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-success-soft",
    border: "border-success-tint",
    iconColor: "text-success-dark",
  },
  error: {
    icon: XCircle,
    bg: "bg-action-soft",
    border: "border-action-tint",
    iconColor: "text-action-dark",
  },
  info: {
    icon: Info,
    bg: "bg-primary-soft",
    border: "border-primary-tint",
    iconColor: "text-primary-dark",
  },
  reward: {
    icon: Sparkles,
    bg: "bg-reward-soft",
    border: "border-reward-tint",
    iconColor: "text-reward-dark",
  },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = variantConfig[toast.variant];
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-2 shadow-lift animate-slide-in-right",
              config.bg,
              config.border
            )}
          >
            <Icon
              className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)}
              strokeWidth={2.5}
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink text-sm">{toast.title}</div>
              {toast.description && (
                <div className="mt-0.5 text-xs text-ink-soft">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 text-ink-muted hover:text-ink transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
