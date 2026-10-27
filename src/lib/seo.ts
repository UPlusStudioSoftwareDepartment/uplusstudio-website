import type { Metadata } from "next";
import { defaultLocale, isLocaleSupported, locales, type Locale } from "@/lib/i18n-config";
import { studioInfo } from "@/lib/studio-info";


export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://uplusstudio.com.tr").replace(/\/$/, "");
export const SITE_NAME = "U+ Studio";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const OG_IMAGE: Record<Locale, { url: string; width: number; height: number; alt: string }> = {
  tr: { url: "/og/uplus-studio-tr.jpg", width: 1200, height: 630, alt: "U+ Studio — Mimarlık & İç Mimarlık & Mühendislik, İncek · Gölbaşı / Ankara" },
  en: { url: "/og/uplus-studio-en.jpg", width: 1200, height: 630, alt: "U+ Studio — Architecture & Interior Architecture & Engineering, İncek · Gölbaşı / Ankara" },
};

const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };

export const ADDRESS = {
  street: "İncek Mah. Reyhan Cd. No:3 Merkez İncek Plaza Kat:1 D:2",
  district: "Gölbaşı",
  city: "Ankara",
  postalCode: "06830",
  country: "TR",
  geo: { latitude: 39.8082318, longitude: 32.6972074 },
};

export const GOOGLE_MAPS_CID_URL = "https://www.google.com/maps?cid=2009045103581452115";

export type PageKey = "home" | "about" | "services" | "projects" | "contact" | "faq" | "glossary" | "purchase";

export const PAGE_PATH: Record<PageKey, string> = {
  home: "",
  about: "/about",
  services: "/services",
  projects: "/projects",
  contact: "/contact",
  faq: "/faq",
  glossary: "/glossary",
  purchase: "/purchase",
};

export const SEO_COPY: Record<Locale, Record<PageKey, { title: string; description: string; crumb: string }>> = {
  tr: {
    home: {
      title: "U+ Studio | Mimarlık & İç Mimarlık & Mühendislik · İncek, Gölbaşı / Ankara",
      description:
        "İncek, Gölbaşı / Ankara'da mimarlık & iç mimarlık & mühendislik ofisi. Villa, konut, ofis ve kafe projeleri, tadilat, 3D görselleştirme, anahtar teslim.",
      crumb: "Ana Sayfa",
    },
    about: {
      title: "Hakkımızda: Hacer Uyar ve Rıdvan Uyar · İncek, Ankara",
      description:
        "U+ Studio; Yüksek Mimar Hacer Uyar ve İnşaat Mühendisi Rıdvan Uyar'ın İncek, Gölbaşı / Ankara'daki mimarlık & iç mimarlık & mühendislik ofisi.",
      crumb: "Hakkımızda",
    },
    services: {
      title: "Mimarlık & İç Mimarlık & Mühendislik Hizmetleri, Ankara",
      description:
        "Ankara Gölbaşı İncek'te mimarlık & iç mimarlık & mühendislik: mimari proje, tadilat ve dönüşüm, 3D görselleştirme, proje yönetimi, anahtar teslim uygulama.",
      crumb: "Hizmetler",
    },
    projects: {
      title: "Projeler: Villa, Konut, Ofis & Kafe Tasarımı",
      description:
        "Villa dönüşümü, konut iç mimarisi, ofis yenileme, kafe, pastane ve spor salonu projeleri; öncesi ve sonrası örnekleriyle. U+ Studio, İncek · Gölbaşı / Ankara.",
      crumb: "Projeler",
    },
    contact: {
      title: "İletişim: İncek, Gölbaşı / Ankara",
      description:
        "U+ Studio'ya ulaşın: Merkez İncek Plaza, Reyhan Cd. No:3, İncek · Gölbaşı / Ankara. Telefon ve WhatsApp +90 545 320 40 07, info@uplusstudio.com.tr.",
      crumb: "İletişim",
    },
    faq: {
      title: "Sıkça Sorulan Sorular: Mimari Proje & Tadilat",
      description:
        "Mimari proje, ruhsat, tadilat, anahtar teslim uygulama, süreler ve ödemeler hakkında sık sorulan sorular. U+ Studio — Mimarlık & İç Mimarlık & Mühendislik, Ankara.",
      crumb: "S.S.S.",
    },
    glossary: {
      title: "Mimarlık & İç Mimarlık & Mühendislik Sözlüğü: 500+ Terim",
      description:
        "Mimarlık & iç mimarlık & mühendislik terimlerinin herkesin anlayacağı açıklamaları: A'dan Z'ye 500'den fazla terim. U+ Studio, İncek · Gölbaşı / Ankara.",
      crumb: "Sözlük",
    },
    purchase: {
      title: "Paket Satın Al",
      description: "U+ Studio mimarlık & iç mimarlık & mühendislik hizmet paketleri için satın alma formu.",
      crumb: "Satın Al",
    },
  },
  en: {
    home: {
      title: "U+ Studio | Architecture & Interior Architecture & Engineering · Ankara",
      description:
        "Architecture & interior architecture & engineering studio in İncek, Gölbaşı / Ankara. Villas, homes, offices, cafés — renovation, 3D and turnkey delivery.",
      crumb: "Home",
    },
    about: {
      title: "About: Hacer Uyar and Rıdvan Uyar · İncek, Ankara",
      description:
        "U+ Studio is the architecture & interior architecture & engineering practice of architect Hacer Uyar and civil engineer Rıdvan Uyar in İncek, Gölbaşı / Ankara.",
      crumb: "About",
    },
    services: {
      title: "Architecture & Interior Architecture & Engineering Services",
      description:
        "Architecture & interior architecture & engineering from İncek, Gölbaşı / Ankara: design, renovation, 3D visualisation, project management, turnkey delivery.",
      crumb: "Services",
    },
    projects: {
      title: "Projects: Villas, Homes, Offices & Cafés",
      description:
        "Villa transformation, residential interiors, office renovation, café, patisserie and gym projects, with before/after views. U+ Studio, İncek · Gölbaşı / Ankara.",
      crumb: "Projects",
    },
    contact: {
      title: "Contact: İncek, Gölbaşı / Ankara",
      description:
        "Visit U+ Studio at Merkez İncek Plaza, Reyhan Cd. No:3, İncek · Gölbaşı / Ankara. Phone & WhatsApp +90 545 320 40 07, info@uplusstudio.com.tr. Book a meeting.",
      crumb: "Contact",
    },
    faq: {
      title: "FAQ: Architectural Projects & Renovation",
      description:
        "Answers on architectural projects, permits, renovation, turnkey construction, timelines and payments. U+ Studio — Architecture & Interior Architecture & Engineering, Ankara.",
      crumb: "FAQ",
    },
    glossary: {
      title: "Architecture & Interior Architecture & Engineering Glossary",
      description:
        "Plain-language explanations of 500+ architecture & interior architecture & engineering terms, A to Z. By U+ Studio in İncek, Gölbaşı / Ankara.",
      crumb: "Glossary",
    },
    purchase: {
      title: "Purchase a Package",
      description: "Purchase form for U+ Studio architecture & interior architecture & engineering service packages.",
      crumb: "Purchase",
    },
  },
};

export const resolveLocale = (l: string): Locale => (isLocaleSupported(l) ? l : defaultLocale);

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const localePath = (locale: Locale, path: string) => `/${locale}${path}`;

interface BuildMetadataInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  image?: { url: string; width?: number; height?: number; alt?: string };
  noindex?: boolean;
  type?: "website" | "article";
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle,
  image,
  noindex,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = localePath(locale, path);
  const img = image ?? OG_IMAGE[locale];
  const ogTitle = absoluteTitle ? title : `${SITE_NAME} | ${title}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
        "x-default": localePath("tr", path),
      },
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: img.url, width: img.width, height: img.height, alt: img.alt ?? ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [img.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const copy = SEO_COPY[locale][page];
  return buildMetadata({
    locale,
    path: PAGE_PATH[page],
    title: copy.title,
    description: copy.description,
    absoluteTitle: page === "home",
    noindex: page === "purchase",
  });
}


type JsonLdNode = Record<string, unknown>;

const SERVICES: Record<Locale, string[]> = {
  tr: ["Mimari Tasarım", "İç Mimarlık", "Yenileme & Dönüşüm", "Konut & Villa Projeleri", "Ticari Mekân Tasarımı", "3D Görselleştirme", "Uygulama & Proje Yönetimi"],
  en: ["Architectural Design", "Interior Architecture", "Renovation & Conversion", "Homes & Villas", "Commercial Interiors", "3D Visualisation", "Construction & Project Management"],
};

const ORG_DESCRIPTION: Record<Locale, string> = {
  tr: "İncek, Gölbaşı / Ankara merkezli mimarlık & iç mimarlık & mühendislik ofisi. Mimari tasarım, iç mimarlık, tadilat ve dönüşüm, 3D görselleştirme ve anahtar teslim uygulama.",
  en: "Architecture & interior architecture & engineering studio based in İncek, Gölbaşı / Ankara: architectural design, interiors, renovation, 3D visualisation and turnkey delivery.",
};

export function siteGraph(locale: Locale): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": ORG_ID,
        name: SITE_NAME,
        alternateName: ["U+ Studio Mimarlık & İç Mimarlık & Mühendislik", "Uplus Studio", "U Plus Studio"],
        description: ORG_DESCRIPTION[locale],
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: absoluteUrl("/logo/uplusstudioblacklogo.png") },
        image: [absoluteUrl(OG_IMAGE.tr.url), absoluteUrl("/media/projects/villa-donusumu/after.jpg")],
        telephone: "+905453204007",
        email: studioInfo.email,
        priceRange: "₺₺–₺₺₺",
        currenciesAccepted: "TRY",
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          addressLocality: ADDRESS.district,
          addressRegion: ADDRESS.city,
          postalCode: ADDRESS.postalCode,
          addressCountry: ADDRESS.country,
        },
        geo: { "@type": "GeoCoordinates", ...ADDRESS.geo },
        hasMap: GOOGLE_MAPS_CID_URL,
        areaServed: [
          { "@type": "Place", name: "İncek, Gölbaşı, Ankara" },
          { "@type": "City", name: "Gölbaşı" },
          { "@type": "City", name: "Çankaya" },
          { "@type": "City", name: "Ankara" },
          { "@type": "Country", name: "Türkiye" },
        ],
        founder: [
          { "@type": "Person", name: "Hacer Uyar", jobTitle: locale === "en" ? "Master Architect" : "Yüksek Mimar" },
          { "@type": "Person", name: "Rıdvan Uyar", jobTitle: locale === "en" ? "Civil Engineer" : "İnşaat Mühendisi" },
        ],
        knowsAbout: SERVICES[locale],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: locale === "en" ? "Services" : "Hizmetler",
          itemListElement: SERVICES[locale].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, areaServed: "Ankara" },
          })),
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: studioInfo.googleRating,
          reviewCount: studioInfo.googleReviewCount,
          bestRating: "5",
        },
        sameAs: [
          studioInfo.instagramUrl,
          GOOGLE_MAPS_CID_URL,
          studioInfo.yandexMapsUrl,
          studioInfo.armutUrl,
          studioInfo.peyzajRehberUrl,
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["tr-TR", "en-US"],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbLd(locale: Locale, trail: [string, string][]): JsonLdNode {
  const items: [string, string][] = [[SEO_COPY[locale].home.crumb, ""], ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(localePath(locale, path)),
    })),
  };
}

export function webPageLd(locale: Locale, page: PageKey, type = "WebPage"): JsonLdNode {
  const copy = SEO_COPY[locale][page];
  const url = absoluteUrl(localePath(locale, PAGE_PATH[page]));
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: copy.title,
    description: copy.description,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function servicesLd(locale: Locale): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO_COPY[locale].services.crumb,
    itemListElement: SERVICES[locale].map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name,
        serviceType: name,
        provider: { "@id": ORG_ID },
        areaServed: [
          { "@type": "City", name: "Ankara" },
          { "@type": "Place", name: "Gölbaşı" },
          { "@type": "Place", name: "İncek" },
        ],
      },
    })),
  };
}
