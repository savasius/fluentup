import { ImageResponse } from "next/og";
import { createServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const supabase = await createServerClient();
  const result = await supabase
    .from("grammar_topics")
    .select("title, short_description, cefr_level, category")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const topic = result.data as {
    title: string;
    short_description: string;
    cefr_level: string;
    category: string;
  } | null;

  if (!topic) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#F8FAFC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 900, color: "#0F172A" }}>
            FluentUp English
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  const description = topic.short_description.slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F8FAFC 0%, #D1FAE5 100%)",
          padding: "80px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#10B981",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 900,
            }}
          >
            F
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>
            FluentUp English · Grammar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                padding: "8px 20px",
                background: "#10B981",
                color: "white",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {topic.cefr_level}
            </div>
            <div
              style={{
                padding: "8px 20px",
                background: "white",
                color: "#0F172A",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 800,
                border: "2px solid #E2E8F0",
                textTransform: "capitalize",
              }}
            >
              {topic.category.replace("-", " ")}
            </div>
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1.05,
              maxWidth: 1050,
            }}
          >
            {topic.title}
          </div>
          <div style={{ fontSize: 28, color: "#475569", maxWidth: 1000 }}>
            {description}
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#64748B" }}>
          fluentupenglish.com / grammar / {slug}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
