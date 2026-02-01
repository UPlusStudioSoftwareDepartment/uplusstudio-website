import { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "U+ Studio",
  title: {
    default: "U+ Studio | Mimarlık & Tasarım & Mühendislik",
    template: "%s | U+ Studio",
  },
  description:
    "U+ Studio'da mimari proje, uygulama, iç mekân tasarımı, konsept geliştirme, 3D görselleştirme ve tasarım danışmanlığı tek bir çizgide buluşur. Konut, ticari ve kamusal alanlarda fikri projeye, projeyi kusursuz uygulamaya dönüştürüyoruz. Her detay bilinçli. Her mekân güçlü. U+",
  metadataBase: new URL("https://uplusstudio.com.tr"),
  category: "architecture",
  referrer: "origin-when-cross-origin",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  keywords: [
    "ankara mimarlık ofisi",
    "ankara iç mimarlık",
    "mimari tasarım",
    "proje yönetimi",
    "konut mimarisi",
    "ticari mimarlık",
    "uygulama projeleri",
    "uplus studio",
    "u+ studio mimarlık",
    "iç mekân tasarımı",
    "konsept geliştirme",
    "3D görselleştirme",
    "tasarım danışmanlığı",
    "kamusal alanlar",
    "mimari proje",
    "Hacer Uyar",
    "Rıdvan Uyar",
  ],

  authors: [
    { name: "Hacer Uyar", url: "https://uplusstudio.com.tr" },
    { name: "Rıdvan Uyar", url: "https://uplusstudio.com.tr" },
  ],
  creator: "U+ Studio",
  publisher: "U+ Studio",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/tr",
      "en-US": "/en",
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://uplusstudio.com.tr",
    siteName: "U+ Studio",
    title: "U+ Studio | Mimarlık & Tasarım",
    description:
      "U+ Studio'da mimari proje, uygulama, iç mekân tasarımı, konsept geliştirme, 3D görselleştirme ve tasarım danışmanlığı tek bir çizgide buluşur. Konut, ticari ve kamusal alanlarda hizmet veriyoruz.",
    images: [
      {
        url: "https://uplusstudio.com.tr/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "U+ Studio Mimarlık & Tasarım",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "U+ Studio | Mimarlık & Tasarım",
    description:
      "U+ Studio'da mimari proje, uygulama, iç mekân tasarımı, konsept geliştirme, 3D görselleştirme ve tasarım danışmanlığı hizmetleri sunar.",
    images: ["https://uplusstudio.com.tr/og-image.jpg"],
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
};
