import { ImageResponse } from "next/og";
import { createServerClient } from "@/lib/supabase";
import type { Database, WordMeaning } from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const runtime = "nodejs";

function rarityAccent(rarity: string): string {
  if (rarity === "epic") return "#8B5CF6";
  if (rarity === "rare") return "#2563EB";
  return "#64748B";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const supabase = await createServerClient();
  const result = await supabase
    .from("words")
    .select("word, cefr_level, meanings, rarity, part_of_speech")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const word = result.data as WordRow | null;

  if (!word) {
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

  const firstDefinition =
    (word.meanings as WordMeaning[])?.[0]?.definition ?? "";
  const definition = firstDefinition.slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F8FAFC 0%, #DBEAFE 100%)",
          padding: "80px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#2563EB",
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
            FluentUp English
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                padding: "8px 20px",
                background: "#2563EB",
                color: "white",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {word.cefr_level}
            </div>
            <div
              style={{
                padding: "8px 20px",
                background: rarityAccent(word.rarity),
                color: "white",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 800,
                textTransform: "capitalize",
              }}
            >
              {word.rarity}
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
              }}
            >
              {word.part_of_speech}
            </div>
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            {word.word}
          </div>
          <div style={{ fontSize: 28, color: "#475569", maxWidth: 1000 }}>
            {definition}
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#64748B" }}>
          fluentupenglish.com / vocabulary / {slug}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
