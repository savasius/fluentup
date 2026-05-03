import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mode =
    typeof body === "object" && body !== null && "mode" in body
      ? (body as { mode: unknown }).mode
      : undefined;

  if (mode !== "adult" && mode !== "kid") {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("mode_preference", mode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
