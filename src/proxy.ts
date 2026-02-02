import createMiddleware from "next-intl/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routing } from "./i18n/routing";
import { auth } from "@clerk/nextjs/server";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:lang/dashboard",
  "/:lang/payments",
]);

const clerk = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
    const { isAuthenticated } = await auth();
    if (isAuthenticated) {
      const pathname = req.nextUrl.pathname;

      const locale = routing.locales.find(
        (locale) => pathname === `/${locale}`,
      );

      if (locale) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = `/${locale}/dashboard`;

        return NextResponse.redirect(redirectUrl);
      }
    }
}, {clockSkewInMs: 8000});

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Let next-intl middleware handle locale detection and redirects FIRST
  const i18nResponse = handleI18nRouting(request);
  if (i18nResponse.headers.has("location")) {
    return i18nResponse;
  }
  // Then run Clerk middlerare
  return clerk(request, event);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
