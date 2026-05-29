import { env } from "@/lib/env";
import { createServerClient } from "@supabase/ssr";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { type NextRequest, NextResponse } from "next/server";

type CookieToSet = { name: string; value: string; options?: Partial<ResponseCookie> };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Routes publiques uniquement (rediriger vers /bibliotheque si déjà connecté)
  const isGuestOnlyRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  // Routes protégées (rediriger vers /login si non connecté)
  const isProtectedRoute =
    pathname.startsWith("/bibliotheque") ||
    pathname.startsWith("/mes-fiches") ||
    pathname.startsWith("/dashboard");

  const isAuthCallback = pathname.startsWith("/auth/callback");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isGuestOnlyRoute && !isAuthCallback) {
    const url = request.nextUrl.clone();
    url.pathname = "/bibliotheque";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
