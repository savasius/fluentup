import { NextRequest, NextResponse } from "next/server";

export function verifyAdminRequest(req: NextRequest): {
  valid: boolean;
  error?: NextResponse;
} {
  const token =
    req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  const expected = process.env.ADMIN_SECRET_TOKEN;

  if (!expected) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: "Admin not configured" },
        { status: 500 },
      ),
    };
  }

  if (token !== expected) {
    return {
      valid: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { valid: true };
}

export function verifyAdminPageToken(tokenParam: string | undefined): boolean {
  const expected = process.env.ADMIN_SECRET_TOKEN;
  if (!expected) return false;
  return tokenParam === expected;
}
