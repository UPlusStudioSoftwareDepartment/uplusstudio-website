import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import ServiceLandingContent from "@/components/ServiceLandingContent";
import { locales } from "@/lib/i18n-config";
import { ADDRESS, ORG_ID, SEO_COPY, absoluteUrl, breadcrumbLd, buildMetadata, localePath, resolveLocale } from "@/lib/seo";
import { SERVICE_LANDINGS, getServiceLanding } from "@/lib/serviceLandings";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => SERVICE_LANDINGS.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const landing = getServiceLanding(slug);
  if (!landing) return {};
  const c = landing.copy[locale];
  return buildMetadata({ locale, path: `/services/${slug}`, title: c.title, description: c.description });
}

export default async function Page({ params }: Params) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const landing = getServiceLanding(slug);
  if (!landing) notFound();
  const c = landing.copy[locale];
  const url = absoluteUrl(localePath(locale, `/services/${slug}`));
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: c.title,
    description: c.description,
    url,
    serviceType: c.label,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "City", name: "Ankara" },
      { "@type": "AdministrativeArea", name: "Gölbaşı" },
      { "@type": "Place", name: "İncek" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          addressLocality: ADDRESS.district,
          addressRegion: ADDRESS.city,
          postalCode: ADDRESS.postalCode,
          addressCountry: ADDRESS.country,
        },
      },
    },
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
  };
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(locale, [
            [SEO_COPY[locale].services.crumb, "/services"],
            [c.crumb, `/services/${slug}`],
          ]),
          serviceLd,
        ]}
      />
      <ServiceLandingContent slug={slug} locale={locale} />
    </>
  );
}
