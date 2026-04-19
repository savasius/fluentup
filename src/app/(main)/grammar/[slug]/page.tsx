import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge, Button } from "@/components/ui";
import { GrammarQuiz } from "@/components/domain";
import {
  ArrowLeft,
  Lightbulb,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Check,
  X,
} from "lucide-react";
import type {
  CefrLevel,
  GrammarCategory,
  GrammarExample,
  CommonMistake,
  QuizQuestion,
} from "@/lib/supabase/database.types";

interface GrammarTopicRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  cefr_level: CefrLevel;
  category: GrammarCategory;
  explanation: string;
  form_structure: Record<string, string>;
  examples: GrammarExample[];
  common_mistakes: CommonMistake[];
  quiz_questions: QuizQuestion[];
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const levelColor: Record<
  CefrLevel,
  "primary" | "success" | "rare" | "slate"
> = {
  A1: "success",
  A2: "success",
  B1: "primary",
  B2: "primary",
  C1: "rare",
  C2: "rare",
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data } = await supabase
    .from("grammar_topics")
    .select("title, short_description, cefr_level")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) return { title: "Grammar topic not found" };

  const topic = data as {
    title: string;
    short_description: string;
    cefr_level: CefrLevel;
  };

  return {
    title: `${topic.title} — English grammar explained`,
    description: topic.short_description,
    openGraph: {
      title: `${topic.title} — FluentUp English`,
      description: topic.short_description,
      type: "article",
    },
  };
}

/**
 * Markdown-lite renderer: explanation text'i paragraflara ve heading'lere
 * bölüp basit formatter. React-markdown kurmuyoruz — seed data'daki format
 * "## Subtitle" ve **bold** + *italic*. Şimdilik minimal.
 */
function renderExplanation(text: string) {
  const blocks = text.split("\n\n");

  return blocks.map((block, idx) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={idx}
          className="font-display text-lg font-extrabold text-ink mt-6 mb-2"
        >
          {trimmed.slice(3)}
        </h3>
      );
    }

    const parts = trimmed.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return (
      <p key={idx} className="text-ink leading-relaxed mt-3">
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-bold text-ink">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <em key={pIdx} className="italic text-primary-dark">
                {part.slice(1, -1)}
              </em>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </p>
    );
  });
}

export default async function GrammarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: raw, error } = await supabase
    .from("grammar_topics")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !raw) {
    notFound();
  }

  const topic = raw as unknown as GrammarTopicRow;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/grammar"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary transition"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        All grammar topics
      </Link>

      {/* Header */}
      <Card className="p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-tint rounded-full opacity-60" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge color={levelColor[topic.cefr_level]}>
              {topic.cefr_level}
            </Badge>
            <Badge color="slate">{topic.category}</Badge>
          </div>

          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink leading-tight">
            {topic.title}
          </h1>

          <p className="mt-3 text-ink-soft text-[15px] max-w-2xl leading-relaxed">
            {topic.short_description}
          </p>
        </div>
      </Card>

      {/* Explanation */}
      <section>
        <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-primary" strokeWidth={2.3} />
          Explanation
        </h2>
        <Card className="p-6 lg:p-8">
          <div className="prose-content">
            {renderExplanation(topic.explanation)}
          </div>
        </Card>
      </section>

      {/* Form structure */}
      {Object.keys(topic.form_structure).length > 0 && (
        <section>
          <h2 className="font-display text-xl font-extrabold text-ink mb-3">
            Form
          </h2>
          <Card className="p-5 lg:p-6">
            <div className="space-y-3">
              {Object.entries(topic.form_structure).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-line-soft last:border-0"
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-ink-muted sm:w-24 flex-shrink-0">
                    {key}
                  </div>
                  <code className="font-mono text-sm text-primary-dark bg-primary-soft px-3 py-1.5 rounded-lg">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Examples */}
      {topic.examples.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-extrabold text-ink mb-3">
            Examples
          </h2>
          <Card className="p-5 lg:p-6">
            <ul className="space-y-4">
              {topic.examples.map((ex, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 pb-4 border-b border-line-soft last:border-0 last:pb-0"
                >
                  <div className="w-7 h-7 rounded-lg bg-success-soft text-success-dark font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-ink font-medium leading-relaxed">
                      &ldquo;{ex.sentence}&rdquo;
                    </div>
                    {ex.note && (
                      <div className="mt-1 text-xs text-ink-muted">
                        {ex.note}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* Common mistakes */}
      {topic.common_mistakes.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-action" strokeWidth={2.3} />
            Common mistakes
          </h2>
          <div className="space-y-3">
            {topic.common_mistakes.map((mistake, idx) => (
              <Card key={idx} className="p-5 border-action-tint">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-action text-white flex items-center justify-center flex-shrink-0">
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-action-dark">
                      Wrong
                    </div>
                    <div className="mt-0.5 text-ink line-through decoration-action/40 decoration-2">
                      &ldquo;{mistake.wrong}&rdquo;
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-success text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-success-dark">
                      Correct
                    </div>
                    <div className="mt-0.5 text-ink font-medium">
                      &ldquo;{mistake.correct}&rdquo;
                    </div>
                  </div>
                </div>
                <div className="mt-3 pl-9 text-sm text-ink-soft flex items-start gap-2">
                  <Lightbulb
                    className="w-4 h-4 text-reward mt-0.5 flex-shrink-0"
                    strokeWidth={2.3}
                  />
                  <span>{mistake.why}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Quiz */}
      {topic.quiz_questions.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-primary" strokeWidth={2.3} />
            Test yourself
          </h2>
          <GrammarQuiz questions={topic.quiz_questions} />
        </section>
      )}

      {/* CTA */}
      <Card className="p-6 bg-gradient-to-r from-primary-tint to-primary-soft border-primary-tint text-center">
        <h3 className="font-display text-xl font-extrabold text-ink">
          Ready to master {topic.title.toLowerCase()}?
        </h3>
        <p className="mt-1 text-ink-soft text-sm">
          Practice with full lessons, track your progress, earn XP.
        </p>
        <div className="mt-4">
          <Link href="/">
            <Button variant="primary" shape="pill" size="md">
              Start learning free
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
