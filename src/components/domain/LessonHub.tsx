"use client";

import { Link } from "@/i18n/navigation";
import { Card, Badge, Button } from "@/components/ui";
import { BookOpen, Clock, Zap, Check, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CefrLevel } from "@/lib/supabase/database.types";

interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  cefr_level: CefrLevel;
  order_index: number;
  xp_reward: number;
  estimated_minutes: number;
}

interface Props {
  lessons: LessonMeta[];
  completedSlugs: string[];
  inProgressSlug: string | null;
  userLevel: string;
}

export function LessonHub({
  lessons,
  completedSlugs,
  inProgressSlug,
  userLevel,
}: Props) {
  const byLevel: Partial<Record<CefrLevel, LessonMeta[]>> = {};
  for (const l of lessons) {
    if (!byLevel[l.cefr_level]) byLevel[l.cefr_level] = [];
    byLevel[l.cefr_level]!.push(l);
  }

  const ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const stats = {
    total: lessons.length,
    completed: completedSlugs.length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" strokeWidth={2.3} />
          Lessons
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
          Structured 5-minute lessons. Learn new words, master grammar, and
          test yourself.
        </p>
      </div>

      <Card className="p-5 bg-gradient-to-r from-primary-tint/20 to-success-soft/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Your progress
            </div>
            <div className="mt-1 font-display text-2xl font-extrabold text-ink">
              {stats.completed} / {stats.total} lessons
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Your level
            </div>
            <div className="mt-1">
              <Badge color="primary" size="md">
                {userLevel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all"
            style={{
              width: `${
                stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
              }%`,
            }}
          />
        </div>
      </Card>

      {inProgressSlug && (
        <Card className="p-5 border-primary bg-primary-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-dark">
                Continue
              </div>
              <div className="mt-1 font-display text-lg font-extrabold text-ink">
                You have a lesson in progress
              </div>
            </div>
            <Link href={`/lesson/${inProgressSlug}`}>
              <Button variant="primary" shape="pill" icon={Play}>
                Resume
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {ORDER.filter((l) => byLevel[l]?.length).map((level) => (
        <section key={level}>
          <h2 className="font-display text-xl font-extrabold text-ink mb-3 flex items-center gap-2">
            <Badge
              color={
                level.startsWith("A")
                  ? "success"
                  : level.startsWith("B")
                    ? "primary"
                    : "rare"
              }
              size="md"
            >
              {level}
            </Badge>
            {level === "A1" && "Beginner"}
            {level === "A2" && "Elementary"}
            {level === "B1" && "Intermediate"}
            {level === "B2" && "Upper Intermediate"}
            {level === "C1" && "Advanced"}
            {level === "C2" && "Proficient"}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {byLevel[level]!.map((lesson) => {
              const isCompleted = completedSlugs.includes(lesson.slug);
              const isInProgress = inProgressSlug === lesson.slug;

              return (
                <Link key={lesson.slug} href={`/lesson/${lesson.slug}`}>
                  <Card
                    interactive
                    className={cn(
                      "p-5 h-full relative",
                      isCompleted && "bg-success-soft border-success",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs font-bold text-ink-muted">
                        Lesson {lesson.order_index}
                      </div>
                      {isCompleted && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-success text-white rounded-full text-xs font-bold">
                          <Check className="w-3 h-3" strokeWidth={3} />
                          Done
                        </div>
                      )}
                      {isInProgress && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-primary text-white rounded-full text-xs font-bold">
                          <Play className="w-3 h-3" strokeWidth={3} />
                          Active
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-extrabold text-ink">
                      {lesson.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft line-clamp-2">
                      {lesson.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={2.5} />
                        {lesson.estimated_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-reward" strokeWidth={2.5} />
                        {lesson.xp_reward} XP
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
