import { cn } from "@/lib/cn";

interface Props {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "white" | "ink";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-[3px]",
  lg: "w-10 h-10 border-4",
};

const variantMap = {
  primary: "border-primary/20 border-t-primary",
  white: "border-white/30 border-t-white",
  ink: "border-ink/20 border-t-ink",
};

export function Spinner({
  size = "md",
  variant = "primary",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-full animate-spin shrink-0",
        sizeMap[size],
        variantMap[variant],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
