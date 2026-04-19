"use client";

import { Card, Badge, Button } from "@/components/ui";
import {
  RocketScene,
  SwordsScene,
  PuzzleScene,
  HeadphonesScene,
  BookPencilScene,
  ClockScene,
  Mascot,
  QuestScene,
} from "@/components/illustrations";
import { Play, Sparkles } from "lucide-react";

const SCENES = [
  {
    name: "RocketScene",
    tag: "Sprint / speed",
    tint: "bg-primary-tint",
    Component: RocketScene,
  },
  {
    name: "SwordsScene",
    tag: "Duel / battle",
    tint: "bg-action-tint",
    Component: SwordsScene,
  },
  {
    name: "PuzzleScene",
    tag: "Gap fill / match",
    tint: "bg-primary-tint",
    Component: PuzzleScene,
  },
  {
    name: "HeadphonesScene",
    tag: "Listening",
    tint: "bg-reward-tint",
    Component: HeadphonesScene,
  },
  {
    name: "BookPencilScene",
    tag: "Sentence builder",
    tint: "bg-success-tint",
    Component: BookPencilScene,
  },
  {
    name: "ClockScene",
    tag: "Spaced repetition",
    tint: "bg-rare-tint",
    Component: ClockScene,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">
          Illustration System Showcase
        </h1>
        <p className="mt-1 text-ink-soft">
          Aşama 5 kontrol galerisi. 6 scene + Figgy mascot + QuestScene hazır.
          Aşama 6'da Dashboard gerçek içerikle dolacak.
        </p>
      </div>

      {/* ========== PRACTICE SCENES ========== */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-extrabold text-ink">
          Practice scenes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENES.map(({ name, tag, tint, Component }) => (
            <Card key={name} className="p-4">
              <div
                className={`${tint} rounded-2xl h-36 flex items-center justify-center mb-3`}
              >
                <div className="w-24 h-24">
                  <Component />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-extrabold text-ink text-sm">
                    {name}
                  </div>
                  <div className="text-xs text-ink-muted font-medium">
                    {tag}
                  </div>
                </div>
                <Badge color="slate" size="sm">
                  120×120
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========== MASCOT ========== */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-extrabold text-ink">
          Figgy — brand mascot
        </h2>
        <p className="text-sm text-ink-soft">
          Platform genelinde tek karakter. Dashboard hero'da 180-200px, Practice
          header'da 100px, AI Tutor avatar'ında 48px. Aynı SVG, farklı `size`
          prop'u.
        </p>

        <Card className="p-6">
          <div className="flex items-end gap-8 flex-wrap">
            <div className="text-center">
              <div className="bg-primary-soft rounded-2xl p-3 flex items-center justify-center">
                <Mascot size={48} />
              </div>
              <div className="mt-2 text-[10px] text-ink-muted font-bold uppercase tracking-widest">
                48px · avatar
              </div>
            </div>
            <div className="text-center">
              <div className="bg-primary-soft rounded-2xl p-4 flex items-center justify-center">
                <Mascot size={100} />
              </div>
              <div className="mt-2 text-[10px] text-ink-muted font-bold uppercase tracking-widest">
                100px · inline
              </div>
            </div>
            <div className="text-center">
              <div className="bg-primary-soft rounded-3xl p-5 flex items-center justify-center">
                <Mascot size={200} />
              </div>
              <div className="mt-2 text-[10px] text-ink-muted font-bold uppercase tracking-widest">
                200px · hero
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ========== QUEST SCENE ========== */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-extrabold text-ink">
          QuestScene — seasonal banner
        </h2>
        <p className="text-sm text-ink-soft">
          Wide format (400×200) scenic banner. Parent container'ın arka planı
          sky olur (primary-soft/tint gradient), SVG transparent yerleşir.
        </p>

        <Card className="overflow-hidden bg-gradient-to-r from-primary-tint to-primary-soft border-primary-tint">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-6 lg:p-8">
              <Badge color="primary" icon={Sparkles}>
                Seasonal Quest
              </Badge>
              <h3 className="mt-3 font-display text-2xl lg:text-3xl font-extrabold text-ink leading-tight">
                The Tower of Tongues
              </h3>
              <p className="mt-2 text-ink-soft max-w-md">
                Complete all 5 practice modes to unlock a special badge and
                claim{" "}
                <span className="font-bold text-primary-dark">+1,000 XP</span>.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="text-xs font-bold text-primary-dark">
                  Progress: 2 / 5
                </div>
                <Button variant="primary" shape="pill" size="md" icon={Play}>
                  Continue
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 h-40 lg:h-auto min-h-[180px] relative">
              <QuestScene className="absolute inset-0 w-full h-full" />
            </div>
          </div>
        </Card>
      </section>

      {/* ========== COMPOSITION TEST ========== */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-extrabold text-ink">
          Composition: Mascot + primitives
        </h2>
        <p className="text-sm text-ink-soft">
          Mascot'un dashboard hero'daki gibi bir kart içinde, text + CTA ile
          birlikte nasıl durduğunu test etmek için. Aşama 6'da bu hero birebir
          gerçeğe dönüşecek.
        </p>

        <Card className="p-6 lg:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <Badge color="reward">Level 8 · Intermediate</Badge>
              <h3 className="mt-3 font-display text-3xl lg:text-4xl font-extrabold text-ink leading-tight">
                Choose your <span className="text-primary">practice mode</span>
              </h3>
              <p className="mt-2 text-ink-soft text-[15px] max-w-md">
                Sharpen your English in a fun way. Earn XP, level up, keep your
                streak alive.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="action" shape="pill" size="lg">
                  Complete today's goal
                </Button>
                <Button variant="secondary" shape="pill" size="lg">
                  Browse practice
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <Mascot size={200} />
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
