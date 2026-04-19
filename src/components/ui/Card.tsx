import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl border border-line",
        interactive &&
          "cursor-pointer hover:border-ink-muted hover:-translate-y-0.5 hover:shadow-lift transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
