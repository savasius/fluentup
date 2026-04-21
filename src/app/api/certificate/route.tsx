import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const milestone = req.nextUrl.searchParams.get("milestone") ?? "10";
  const name = req.nextUrl.searchParams.get("name") ?? "FluentUp Learner";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F8FAFC 0%, #DBEAFE 100%)",
          padding: 80,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#2563EB",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Certificate of Completion
        </div>
        <div style={{ marginTop: 40, fontSize: 24, color: "#475569" }}>
          This certifies that
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 72,
            fontWeight: 900,
            color: "#0F172A",
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 24,
            color: "#475569",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          has successfully completed {milestone} lessons on FluentUp English
        </div>
        <div
          style={{
            marginTop: 60,
            display: "flex",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              background: "#F59E0B",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "white",
            }}
          >
            ★
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: 18, color: "#64748B" }}>
          Awarded on {date}
        </div>
        <div style={{ marginTop: 40, fontSize: 16, color: "#94A3B8" }}>
          fluentupenglish.com
        </div>
      </div>
    ),
    { width: 1200, height: 800 },
  );
}
