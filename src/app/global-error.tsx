"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          color: "#0F172A",
          background: "#FAFAF9",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 560, margin: "4rem auto" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Something went wrong
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#475569" }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.625rem 1.25rem",
              borderRadius: 999,
              background: "#2563EB",
              color: "white",
              border: 0,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
