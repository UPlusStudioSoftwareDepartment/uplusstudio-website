import { Metadata } from "next";
import { OG_IMAGE, SEO_COPY, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SEO_COPY.tr.home.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_COPY.tr.home.description,
  category: "architecture",
  referrer: "strict-origin-when-cross-origin",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },

  keywords: [
    "mimarlık ofisi ankara",
    "gölbaşı mimarlık ofisi",
    "incek mimarlık ofisi",
    "incek iç mimar",
    "gölbaşı iç mimarlık",
    "ankara iç mimarlık",
    "villa tadilat ankara",
    "ofis iç mimari ankara",
    "kafe tasarımı ankara",
    "anahtar teslim tadilat",
    "mimari proje",
    "3D görselleştirme",
    "Hacer Uyar",
    "Rıdvan Uyar",
  ],

  authors: [{ name: "Hacer Uyar" }, { name: "Rıdvan Uyar" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "tr_TR",
    images: [OG_IMAGE.tr],
  },

  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.tr.url],
  },

  robots: {
    googleBot: {
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    "geo.region": "TR-06",
    "geo.placename": "İncek, Gölbaşı, Ankara",
    "geo.position": "39.8082318;32.6972074",
    ICBM: "39.8082318, 32.6972074",
  },
};
