import { Mascot } from "@/components/illustrations";
import { Badge } from "./Badge";
import { Sparkles } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

/**
 * Geçici placeholder — henüz inşa edilmemiş sayfaları gösterir.
 * Aşama 6+ geçişte her sayfayı sırayla gerçek içerikle değiştireceğiz.
 */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 lg:py-20 px-4">
      <Mascot size={180} />

      <div className="mt-6 max-w-md">
        <Badge color="primary" icon={Sparkles} size="md">
          Coming soon
        </Badge>

        <h1 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold text-ink">
          {title}
        </h1>

        {description && (
          <p className="mt-3 text-ink-soft text-[15px] leading-relaxed">
            {description}
          </p>
        )}

        <p className="mt-6 text-sm text-ink-muted">
          We're building this page right now. Check back soon — or keep your
          streak alive from the{" "}
          <span className="font-bold text-primary">Dashboard</span>.
        </p>
      </div>
    </div>
  );
}
