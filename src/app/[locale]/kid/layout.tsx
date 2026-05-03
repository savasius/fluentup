import { KidShell } from "@/components/layout/KidShell";

export default function KidRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KidShell>{children}</KidShell>;
}
