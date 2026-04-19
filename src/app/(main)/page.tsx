import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { PracticeCard, QuestBanner } from "@/components/domain";
import {
  RocketScene,
  SwordsScene,
  PuzzleScene,
  HeadphonesScene,
  BookPencilScene,
  ClockScene,
  Mascot,
} from "@/components/illustrations";
import { Crown, ChevronRight, Sparkles, BookMarked } from "lucide-react";
import { DbHealthCheck } from "@/components/dev/DbHealthCheck";

const USER = {
  name: "Ayşe",
  level: 8,
  xp: 2840,
  streak: 12,
};

const PRACTICE_MODES = [
  {
    title: "Sprint",
    Scene: RocketScene,
    tintClassName: "bg-primary-tint",
    difficulty: "HARD" as const,
    xp: 85,
    buttonVariant: "action" as const,
    buttonLabel: "START",
  },
  {
    title: "Word Duel",
    Scene: SwordsScene,
    tintClassName: "bg-action-tint",
    difficulty: "MEDIUM" as const,
    xp: 120,
    buttonVariant: "primary" as const,
    buttonLabel: "BATTLE",
    footer: "3,343 players today",
  },
  {
    title: "Fill the Gap",
    Scene: PuzzleScene,
    tintClassName: "bg-primary-tint",
    difficulty: "EASY" as const,
    xp: 40,
    buttonVariant: "primary" as const,
    buttonLabel: "START",
  },
  {
    title: "Listening",
    Scene: HeadphonesScene,
    tintClassName: "bg-reward-tint",
    difficulty: "EASY" as const,
    xp: 45,
    buttonVariant: "primary" as const,
    buttonLabel: "START",
  },
  {
    title: "Sentence Builder",
    Scene: BookPencilScene,
    tintClassName: "bg-success-tint",
    difficulty: "MEDIUM" as const,
    xp: 120,
    buttonVariant: "reward" as const,
    buttonLabel: "START",
  },
  {
    title: "Repetition",
    Scene: ClockScene,
    tintClassName: "bg-rare-tint",
    difficulty: "EASY" as const,
    xp: 55,
    buttonVariant: "teal" as const,
    buttonLabel: "START",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ============ HERO ============ */}
      <Card className="p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <Badge color="reward" icon={Crown}>
              Level {USER.level} · Intermediate
            </Badge>

            <h1 className="mt-3 font-display text-3xl lg:text-4xl font-extrabold text-ink leading-tight">
              Welcome back,{" "}
              <span className="text-primary">{USER.name}</span>
            </h1>

            <p className="mt-2 text-ink-soft text-[15px] max-w-md">
              Pick a practice mode to keep your streak alive. You&apos;re{" "}
              <span className="font-bold text-ink">3 lessons</span> away from
              unlocking Advanced Conversations.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/lesson">
                <Button variant="action" shape="pill" size="lg">
                  Complete today&apos;s goal
                </Button>
              </Link>
              <Link href="/practice">
                <Button variant="secondary" shape="pill" size="lg">
                  Browse practice
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Mascot size={180} />
          </div>
        </div>
      </Card>

      {/* ============ CONTINUE PRACTICING ============ */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2">
            Continue practicing
            <Sparkles
              className="w-5 h-5 text-reward"
              fill="#F59E0B"
              strokeWidth={0}
            />
          </h2>
          <Link
            href="/practice"
            className="flex items-center gap-1 text-sm font-bold text-action hover:text-action-dark transition"
          >
            View all <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRACTICE_MODES.map((mode) => {
            const { Scene, ...rest } = mode;
            return (
              <PracticeCard
                key={mode.title}
                {...rest}
                scene={<Scene />}
              />
            );
          })}
        </div>
      </section>

      {/* ============ SEASONAL QUEST ============ */}
      <QuestBanner
        title="The Tower of Tongues"
        description="Complete all 5 practice modes to unlock a special badge and claim"
        xpReward={1000}
        current={2}
        total={5}
      />

      {/* ============ VOCABULARY PREVIEW ============ */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2">
            <BookMarked
              className="w-5 h-5 text-primary"
              strokeWidth={2.3}
            />
            Vocabulary collection
          </h2>
          <Link
            href="/vocabulary"
            className="flex items-center gap-1 text-sm font-bold text-action hover:text-action-dark transition"
          >
            Open <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
        <p className="text-ink-soft mb-4">
          Collect and master new words as you progress.
        </p>

        <Card className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-reward-tint flex items-center justify-center font-display font-extrabold text-xl text-reward-dark flex-shrink-0">
              A
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-ink">Alex</div>
              <div className="mt-1 text-sm text-ink-soft">
                Have you practiced{" "}
                <span className="font-bold text-primary-dark">
                  celebrations
                </span>{" "}
                vocabulary yet? Let&apos;s review how to talk about holidays
                together.
              </div>
              <div className="mt-3">
                <Link href="/tutor">
                  <Button variant="primary" shape="pill" size="sm">
                    Start conversation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <DbHealthCheck />
    </div>
  );
}
