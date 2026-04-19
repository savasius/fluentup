import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

type BadgeColor =
  | "primary"
  | "action"
  | "reward"
  | "success"
  | "rare"
  | "slate";

type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: LucideIcon;
}

const colorStyles: Record<BadgeColor, string> = {
  primary: "bg-primary-soft text-primary-dark",
  action: "bg-action-soft text-action-dark",
  reward: "bg-reward-soft text-reward-dark",
  success: "bg-success-soft text-success-dark",
  rare: "bg-rare-soft text-rare-dark",
  slate: "bg-line-soft text-ink-soft",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5 rounded-lg",
  md: "text-xs px-2.5 py-1 rounded-lg",
};

const iconSizeStyles: Record<BadgeSize, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
};

export function Badge({
  color = "primary",
  size = "md",
  icon: Icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "font-semibold inline-flex items-center gap-1 tracking-wide",
        colorStyles[color],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={iconSizeStyles[size]} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
