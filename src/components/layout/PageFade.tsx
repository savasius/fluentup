"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function PageFade({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={cn("animate-page-fade-in", className)}>
      {children}
    </div>
  );
}
