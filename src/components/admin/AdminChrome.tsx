"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function AdminBrandLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const token = useSearchParams().get("token");
  const href = token ? `/admin?token=${encodeURIComponent(token)}` : "/admin";
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
