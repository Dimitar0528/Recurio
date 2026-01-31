import { Locale } from "next-intl";
import createMiddleware from "next-intl/middleware";
import { NextFetchEvent, NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:lang/dashboard",
  "/:lang/payments",
]);

const clerk = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
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
