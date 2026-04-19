import { Card, Button } from "@/components/ui";
import { Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type ButtonVariant = "primary" | "action" | "success" | "reward" | "teal";

interface PracticeCardProps {
  title: string;
  scene: ReactNode;
  tintClassName: string;
  difficulty: Difficulty;
  xp: number;
  buttonVariant: ButtonVariant;
  buttonLabel: string;
  footer?: string;
  onStart?: () => void;
}

const difficultyColor: Record<Difficulty, string> = {
  EASY: "text-success-dark",
  MEDIUM: "text-reward-dark",
  HARD: "text-action-dark",
};

export function PracticeCard({
  title,
  scene,
  tintClassName,
  difficulty,
  xp,
  buttonVariant,
  buttonLabel,
  footer,
  onStart,
}: PracticeCardProps) {
  return (
    <Card interactive className="p-4 flex flex-col">
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden h-36 mb-4 flex items-center justify-center",
          tintClassName
        )}
      >
        <div className="absolute top-3 left-3 z-10">
          <div className="font-display font-extrabold text-ink text-lg leading-tight">
            {title}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pt-4">
          <div className="w-24 h-24">{scene}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 px-1">
        <span
          className={cn(
            "text-[11px] font-extrabold tracking-[0.12em]",
            difficultyColor[difficulty]
          )}
        >
          {difficulty}
        </span>
        <div className="flex items-center gap-1 text-xs font-extrabold text-reward-dark">
          <Zap className="w-3.5 h-3.5" fill="#F59E0B" strokeWidth={0} />
          +{xp} XP
        </div>
      </div>

      <Button
        variant={buttonVariant}
        shape="pill"
        size="md"
        full
        onClick={onStart}
      >
        {buttonLabel}
      </Button>

      {footer && (
        <div className="text-center mt-2 text-[11px] font-semibold text-ink-soft">
          {footer}
        </div>
      )}
    </Card>
  );
}
