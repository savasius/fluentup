import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface GameCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: "primary" | "action" | "reward" | "success" | "rare" | "teal";
  estimatedMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  available: boolean;
}

const accentBg: Record<GameCardProps["accentColor"], string> = {
  primary: "bg-primary-soft",
  action: "bg-action-soft",
  reward: "bg-reward-soft",
  success: "bg-success-soft",
  rare: "bg-rare-soft",
  teal: "bg-teal-soft",
};

const accentIconColor: Record<GameCardProps["accentColor"], string> = {
  primary: "text-primary",
  action: "text-action-dark",
  reward: "text-reward-dark",
  success: "text-success-dark",
  rare: "text-rare-dark",
  teal: "text-teal-dark",
};

const difficultyColor: Record<
  GameCardProps["difficulty"],
  "success" | "primary" | "action"
> = {
  easy: "success",
  medium: "primary",
  hard: "action",
};

export function GameCard({
  href,
  title,
  description,
  icon: Icon,
  accentColor,
  estimatedMinutes,
  difficulty,
  available,
}: GameCardProps) {
  const content = (
    <Card
      interactive={available}
      className={cn(
        "p-6 h-full flex flex-col transition",
        !available && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
            accentBg[accentColor]
          )}
        >
          <Icon
            className={cn("w-7 h-7", accentIconColor[accentColor])}
            strokeWidth={2.3}
          />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge color={difficultyColor[difficulty]} size="sm">
            {difficulty}
          </Badge>
          <span className="text-xs font-bold text-ink-muted">
            {estimatedMinutes} min
          </span>
        </div>
      </div>

      <h3 className="font-display text-xl font-extrabold text-ink leading-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed flex-1">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        {available ? (
          <span className="text-sm font-bold text-primary">Play now</span>
        ) : (
          <span className="text-sm font-bold text-ink-muted">Coming soon</span>
        )}
        {available && (
          <ArrowRight className="w-4 h-4 text-primary" strokeWidth={2.5} />
        )}
      </div>
    </Card>
  );

  if (!available) {
    return <div>{content}</div>;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
