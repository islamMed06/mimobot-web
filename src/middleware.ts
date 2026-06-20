import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isPremiumRoute = path.startsWith("/premium");
  const isFichesRoute = path.startsWith("/fiches-pedagogiques");
  const isLessonsRoute = path.startsWith("/lessons");
  const isExercisesRoute = path.startsWith("/exercises");

  if (!user && (isAdminRoute || isPremiumRoute || isFichesRoute || isLessonsRoute || isExercisesRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, user_type")
      .eq("id", user.id)
      .single();

    if (isAdminRoute && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/premium";
      return NextResponse.redirect(url);
    }

    if (isFichesRoute && profile?.user_type === "student") {
      const url = request.nextUrl.clone();
      url.pathname = "/resources";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
