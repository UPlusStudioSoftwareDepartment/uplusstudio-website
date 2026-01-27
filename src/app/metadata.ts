import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "UPlus Studio - Mimari Tasarım ve İç Mimarlık",
    template: "%s | UPlus Studio"
  },
  description: "UPlus Studio, İstanbul merkezli mimari tasarım, iç mimarlık ve proje yönetimi hizmetleri sunar. Konut, ticari ve kamusal projelerde yenilikçi çözümler.",
  keywords: [
    "mimari tasarım",
    "iç mimarlık", 
    "proje yönetimi",
    "mimarlık ofisi",
    "istanbul mimar",
    "konut projeleri",
    "ticari mimarlık",
    "modern tasarım",
    "uygulama projeleri",
    "UPlus Studio"
  ],
  authors: [{ name: "UPlus Studio" }],
  creator: "UPlus Studio",
  publisher: "UPlus Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://uplusstudio.com"),
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://uplusstudio.com",
    title: "UPlus Studio - Mimari Tasarım ve İç Mimarlık",
    description: "UPlus Studio, İstanbul merkezli mimari tasarım, iç mimarlık ve proje yönetimi hizmetleri sunar. Konut, ticari ve kamusal projelerde yenilikçi çözümler.",
    siteName: "UPlus Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UPlus Studio - Mimari Tasarım",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPlus Studio - Mimari Tasarım ve İç Mimarlık",
    description: "UPlus Studio, İstanbul merkezli mimari tasarım, iç mimarlık ve proje yönetimi hizmetleri sunar.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};
