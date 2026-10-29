import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { isInMaintenance } from "@/lib/app-config";
import { defaultLocale, isLocaleSupported, locales } from "@/lib/i18n-config";
import { projects } from "@/lib/projects";
import { SERVICE_LANDINGS } from "@/lib/serviceLandings";

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

const PROJECTS = new Set(projects.map((p) => p.slug));
const FILMS = new Set(projects.filter((p) => p.video).map((p) => p.slug));
const SERVICES = new Set(SERVICE_LANDINGS.map((s) => s.slug));

// Pages that would call notFound() themselves. Next 16 answers those with an empty HTML shell that only the browser fills,
// so they are sent to an unmatched path instead, which Next renders in full on the server (header, footer, 404, noindex).
function missingPage(pathname: string): string | null {
  const match = pathname.match(/^\/(tr|en)\/(?:(projects|services)\/([^/]+)(\/video)?|(maintenance))\/?$/);
  if (!match) return null;
  const [, locale, section, slug, film, maintenance] = match;
  const missing = maintenance
    ? !isInMaintenance
    : section === "services"
      ? Boolean(film) || !SERVICES.has(slug)
      : !(film ? FILMS : PROJECTS).has(slug);
  return missing ? locale : null;
}

export default function proxy(request: NextRequest) {
  const missingLocale = missingPage(request.nextUrl.pathname);
  if (missingLocale) {
    const headers = new Headers(request.headers);
    headers.set("X-NEXT-INTL-LOCALE", missingLocale);
    return NextResponse.rewrite(new URL(`/${missingLocale}/__not-found`, request.url), { request: { headers } });
  }
  if (!isInMaintenance) return permanent(intl(request));
  const locale = request.nextUrl.pathname.split("/")[1];
  const target = `/${isLocaleSupported(locale) ? locale : defaultLocale}/maintenance`;
  if (request.nextUrl.pathname === target) return intl(request);
  return NextResponse.rewrite(new URL(target, request.url));
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
