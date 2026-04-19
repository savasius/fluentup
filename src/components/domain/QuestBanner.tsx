"use client";

import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { QuestScene } from "@/components/illustrations";
import { Sparkles, Play } from "lucide-react";

interface QuestBannerProps {
  title: string;
  description: string;
  xpReward: number;
  current: number;
  total: number;
  onContinue?: () => void;
}

export function QuestBanner({
  title,
  description,
  xpReward,
  current,
  total,
  onContinue,
}: QuestBannerProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-primary-tint to-primary-soft border-primary-tint">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 lg:p-8 relative z-10">
          <Badge color="primary" icon={Sparkles}>
            Seasonal Quest
          </Badge>

          <h3 className="mt-3 font-display text-2xl lg:text-3xl font-extrabold text-ink leading-tight">
            {title}
          </h3>

          <p className="mt-2 text-ink-soft max-w-md">
            {description}{" "}
            <span className="font-bold text-primary-dark">
              +{xpReward.toLocaleString()} XP
            </span>
            .
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1 max-w-[200px]">
              <div className="flex justify-between text-xs font-bold text-primary-dark mb-1.5">
                <span>Progress</span>
                <span>
                  {current} / {total}
                </span>
              </div>
              <ProgressBar value={current} max={total} color="primary" />
            </div>
            <Button
              variant="primary"
              shape="pill"
              size="md"
              icon={Play}
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </div>

        <div className="lg:w-1/2 h-40 lg:h-auto min-h-[180px] relative">
          <QuestScene className="absolute inset-0 w-full h-full" />
        </div>
      </div>
    </Card>
  );
}
