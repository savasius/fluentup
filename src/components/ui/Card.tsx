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
          "cursor-pointer hover:border-ink-muted transition-all duration-200 hover:-translate-y-1.5 hover:shadow-soft-xl active:translate-y-0 active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
