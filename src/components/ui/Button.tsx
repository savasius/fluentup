import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "action"
  | "success"
  | "reward"
  | "teal"
  | "secondary"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "rounded" | "pill";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  full?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-solid-primary active:translate-y-[2px] active:shadow-[0_1px_0_0_#1E40AF]",
  action:
    "bg-action text-white hover:bg-action-dark shadow-solid-action active:translate-y-[2px] active:shadow-[0_1px_0_0_#B91C1C]",
  success:
    "bg-success text-white hover:bg-success-dark shadow-solid-success active:translate-y-[2px] active:shadow-[0_1px_0_0_#047857]",
  reward:
    "bg-reward text-white hover:bg-reward-dark shadow-solid-reward active:translate-y-[2px] active:shadow-[0_1px_0_0_#B45309]",
  teal: "bg-teal text-white hover:bg-teal-dark shadow-[0_3px_0_0_#0F766E] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0F766E]",
  secondary: "bg-white text-ink border border-line hover:bg-paper",
  ghost: "bg-transparent text-ink-soft hover:bg-line-soft",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const shapeStyles: Record<ButtonShape, string> = {
  rounded: "rounded-2xl",
  pill: "rounded-full",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-[18px] h-[18px]",
};

export function Button({
  variant = "primary",
  size = "md",
  shape = "rounded",
  icon: Icon,
  iconPosition = "left",
  full = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-bold inline-flex items-center justify-center gap-2 tracking-wide transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[shape],
        full && "w-full",
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "left" && (
        <Icon className={iconSizeStyles[size]} strokeWidth={2.5} />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className={iconSizeStyles[size]} strokeWidth={2.5} />
      )}
    </button>
  );
}
