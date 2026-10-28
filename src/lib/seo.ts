import type { Metadata } from "next";
import { STUDIO_SERVICES } from "@/lib/services";
import { defaultLocale, isLocaleSupported, locales, type Locale } from "@/lib/i18n-config";
import { studioInfo } from "@/lib/studio-info";


export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uplusstudio.com.tr").replace(/\/$/, "");
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

export type PageKey = "home" | "about" | "services" | "projects" | "contact" | "glossary" | "privacy";

export const PAGE_PATH: Record<PageKey, string> = {
  home: "",
  about: "/about",
  services: "/services",
  projects: "/projects",
  contact: "/contact",
  glossary: "/glossary",
  privacy: "/kvkk",
};

export const SEO_COPY: Record<Locale, Record<PageKey, { title: string; description: string; crumb: string }>> = {
  tr: {
    home: {
      title: "U+ Studio | Ankara Mimarlık, Tasarım ve Mühendislik · İncek, Gölbaşı",
      description:
        "İncek, Gölbaşı / Ankara'da mimarlık & iç mimarlık & mühendislik ofisi; Türkiye geneline hizmet. Villa, konut, ofis, kafe, tadilat, 3D ve anahtar teslim.",
      crumb: "Ana Sayfa",
    },
    about: {
      title: "Hakkımızda: Hacer Uyar ve Rıdvan Uyar",
      description:
        "U+ Studio; Yüksek Mimar Hacer Uyar ve İnşaat Mühendisi Rıdvan Uyar'ın İncek, Gölbaşı / Ankara'daki mimarlık & iç mimarlık & mühendislik ofisi.",
      crumb: "Hakkımızda",
    },
    services: {
      title: "Mimarlık, İç Mimarlık ve Mühendislik Hizmetleri",
      description:
        "Ankara İncek merkezli, Türkiye geneline mimarlık & iç mimarlık & mühendislik: mimari proje, tadilat ve dönüşüm, 3D, proje yönetimi, anahtar teslim uygulama.",
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
    glossary: {
      title: "Mimarlık Sözlüğü: 500+ Terim ve Anlamı",
      description:
        "Mimarlık & iç mimarlık & mühendislik terimlerinin herkesin anlayacağı açıklamaları: A'dan Z'ye 500'den fazla terim. U+ Studio, İncek · Gölbaşı / Ankara.",
      crumb: "Sözlük",
    },
    privacy: {
      title: "KVKK Aydınlatma Metni",
      description: "U+ Studio iletişim ve randevu formlarıyla ilettiğiniz kişisel verileri nasıl işler: amaçlar, hukuki sebepler, aktarım, saklama süresi ve KVKK kapsamındaki haklarınız.",
      crumb: "KVKK",
    },
  },
  en: {
    home: {
      title: "U+ Studio | Ankara Architecture, Design & Engineering · İncek",
      description:
        "Architecture & interior architecture & engineering studio in İncek, Ankara, working across Türkiye: villas, homes, offices, cafés, renovation, 3D, turnkey.",
      crumb: "Home",
    },
    about: {
      title: "About: Hacer Uyar and Rıdvan Uyar",
      description:
        "U+ Studio is the architecture & interior architecture & engineering practice of architect Hacer Uyar and civil engineer Rıdvan Uyar in İncek, Gölbaşı / Ankara.",
      crumb: "About",
    },
    services: {
      title: "Architecture, Interiors & Engineering Services",
      description:
        "Architecture & interior architecture & engineering from İncek, Ankara, across Türkiye: design, renovation, 3D visualisation, project management, turnkey.",
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
    glossary: {
      title: "Architecture Glossary: 500+ Terms Explained",
      description:
        "Plain-language explanations of 500+ architecture & interior architecture & engineering terms, A to Z. By U+ Studio in İncek, Gölbaşı / Ankara.",
      crumb: "Glossary",
    },
    privacy: {
      title: "Privacy Notice (KVKK)",
      description: "How U+ Studio processes the personal data you send through its contact and appointment forms: purposes, legal basis, transfers, retention and your rights under KVKK.",
      crumb: "Privacy",
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
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
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

const PAGE_IMAGE: Partial<Record<PageKey, { url: string; width: number; height: number; alt: Record<Locale, string> }>> = {
  about: {
    url: "/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg",
    width: 1264,
    height: 842,
    alt: { tr: "Yüksek Mimar Hacer Uyar, U+ Studio ofisinde", en: "Master Architect Hacer Uyar in the U+ Studio office" },
  },
  services: {
    url: "/media/projects/villa-ic-mekan/kitchen-island.jpg",
    width: 1536,
    height: 1024,
    alt: { tr: "Villa iç mekân projesinden adalı açık mutfak", en: "Open kitchen with island from the villa interior project" },
  },
  projects: {
    url: "/media/projects/villa-donusumu/after.jpg",
    width: 1280,
    height: 716,
    alt: { tr: "Villa dönüşümü projesinde yenilenmiş cephe", en: "Renovated façade of the villa transformation project" },
  },
};

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const copy = SEO_COPY[locale][page];
  const image = PAGE_IMAGE[page];
  return buildMetadata({
    locale,
    path: PAGE_PATH[page],
    title: copy.title,
    description: copy.description,
    absoluteTitle: page === "home",
    image: image && { ...image, alt: image.alt[locale] },
  });
}


type JsonLdNode = Record<string, unknown>;

const SERVICES: Record<Locale, string[]> = {
  tr: STUDIO_SERVICES.tr.map((s) => s.title),
  en: STUDIO_SERVICES.en.map((s) => s.title),
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
        alternateName: ["U+ Studio Mimarlık & İç Mimarlık & Mühendislik", "U+ Studio Mimarlık & Tasarım & Mühendislik", "U+ Studio Mimarlık & Mühendislik", "U+Studio", "Uplus Studio", "UplusStudio", "U Plus Studio"],
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
          { "@type": "AdministrativeArea", name: "Gölbaşı" },
          { "@type": "AdministrativeArea", name: "Çankaya" },
          { "@type": "City", name: "Ankara" },
          { "@type": "Country", name: "Türkiye" },
        ],
        founder: [
          {
            "@type": "Person",
            "@id": `${SITE_URL}/#hacer-uyar`,
            name: "Hacer Uyar",
            jobTitle: locale === "en" ? "Master Architect" : "Yüksek Mimar",
            url: absoluteUrl(localePath(locale, PAGE_PATH.about)),
            sameAs: [studioInfo.founderLinkedIn.hacer],
          },
          {
            "@type": "Person",
            "@id": `${SITE_URL}/#ridvan-uyar`,
            name: "Rıdvan Uyar",
            jobTitle: locale === "en" ? "Civil Engineer" : "İnşaat Mühendisi",
            url: absoluteUrl(localePath(locale, PAGE_PATH.about)),
            sameAs: [studioInfo.founderLinkedIn.ridvan],
          },
        ],
        knowsAbout: SERVICES[locale],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: locale === "en" ? "Services" : "Hizmetler",
          itemListElement: SERVICES[locale].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, areaServed: ["Ankara", "Türkiye"] },
          })),
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
        alternateName: ["U+Studio", "U Plus Studio", "Uplus Studio", "uplusstudio", "uplusstudio.com.tr"],
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
          { "@type": "AdministrativeArea", name: "Gölbaşı" },
          { "@type": "Place", name: "İncek" },
          { "@type": "Country", name: "Türkiye" },
        ],
      },
    })),
  };
}
