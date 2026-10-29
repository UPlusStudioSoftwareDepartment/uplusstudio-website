import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { isInMaintenance } from "@/lib/app-config";
import { defaultLocale, isLocaleSupported, locales } from "@/lib/i18n-config";

const intl = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});

// Locale detection is off, so next-intl's redirects (/projects → /tr/projects, /TR → /tr) never vary by visitor:
// send them as permanent so search engines move signals to the prefixed URL.
function permanent(response: NextResponse) {
  const location = response.headers.get("location");
  return response.status === 307 && location ? NextResponse.redirect(location, 308) : response;
}

export default function proxy(request: NextRequest) {
  if (!isInMaintenance) return permanent(intl(request));
  const locale = request.nextUrl.pathname.split("/")[1];
  const target = `/${isLocaleSupported(locale) ? locale : defaultLocale}/maintenance`;
  if (request.nextUrl.pathname === target) return intl(request);
  return NextResponse.rewrite(new URL(target, request.url));
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
