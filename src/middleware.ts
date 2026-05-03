import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function stripLocale(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname.slice(3) || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname;
}

function withLocalePath(request: NextRequest, path: string): string {
  const p = request.nextUrl.pathname;
  const isEn = p === "/en" || p.startsWith("/en/");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return isEn ? `/en${clean}` : clean;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const token = request.nextUrl.searchParams.get("token");
    const expected = process.env.ADMIN_SECRET_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (
    path.startsWith("/api") ||
    path.startsWith("/auth/") ||
    path.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const response = intlMiddleware(request);

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bare = stripLocale(path);

  let userMode: "adult" | "kid" = "adult";
  if (user) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("mode")
      .eq("id", user.id)
      .maybeSingle();
    const row = prof as { mode?: string } | null;
    if (row?.mode === "kid") {
      userMode = "kid";
    }
  } else {
    userMode =
      request.cookies.get("mode_preference")?.value === "kid"
        ? "kid"
        : "adult";
  }

  const protectedPaths = ["/profile", "/onboarding", "/flashcards"];
  if (
    !user &&
    protectedPaths.some((p) => bare === p || bare.startsWith(`${p}/`))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePath(request, "/login");
    url.searchParams.set("next", bare);
    return NextResponse.redirect(url);
  }

  if (user && userMode === "adult" && bare.startsWith("/kid")) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePath(request, "/");
    return NextResponse.redirect(url);
  }

  if (user && userMode === "kid") {
    if (bare === "/") {
      const url = request.nextUrl.clone();
      url.pathname = withLocalePath(request, "/kid");
      return NextResponse.redirect(url);
    }
    if (
      bare === "/profile" ||
      (bare.startsWith("/profile/") && !bare.startsWith("/kid/"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = withLocalePath(request, "/kid/profile");
      return NextResponse.redirect(url);
    }
    if (bare.startsWith("/tutor")) {
      const url = request.nextUrl.clone();
      url.pathname = withLocalePath(request, "/kid");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
