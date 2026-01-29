import "@/app/globals.css";
import I18nProvider from "@/components/I18nProvider";
import { metadata } from "./metadata";
import React from "react";

/* -------------------------------
   STRUCTURED DATA (JSON-LD)
-------------------------------- */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ArchitecturalService",
  "name": "U+ Studio",
  "description": "U+ Studio'da mimari proje, uygulama, iç mekân tasarımı, konsept geliştirme, 3D görselleştirme ve tasarım danışmanlığı tek bir çizgide buluşur. Konut, ticari ve kamusal alanlarda fikri projeye, projeyi kusursuz uygulamaya dönüştürüyoruz.",
  "url": "https://uplusstudio.com.tr",
  "logo": "https://uplusstudio.com.tr/logo/uplusstudioblacklogo.png",
  "image": "https://uplusstudio.com.tr/og-image.jpg",
  "telephone": "+90 545 320 40 07",
  "email": "info@uplusstudio.com.tr",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ankara",
    "addressCountry": "TR"
  },
  "founder": [
    {
      "@type": "Person",
      "name": "Hacer Uyar",
      "jobTitle": "Mimar | Architect | Co-Founder",
      "telephone": "+90 545 320 40 07"
    },
    {
      "@type": "Person",
      "name": "Rıdvan Uyar",
      "jobTitle": "İnşaat Mühendisi | Construction Engineer | Co-Founder",
      "telephone": "+90 553 289 45 75"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/uplu.sstudio"
  ]
};

// Hydration güvenliği
const structuredDataJson = JSON.stringify(structuredData).replace(/</g, "\\u003c");

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* Favicon & Icons */}
        <link
          rel="icon"
          type="image/png"
          href="/logo/uplusstudioblacklogo.png"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          href="/logo/uplusstudioblacklogo.png"
        />
        <link
          rel="apple-touch-icon"
          href="/logo/uplusstudioblacklogo.png"
        />

        {/* Theme */}
        <meta name="theme-color" content="#000000" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: structuredDataJson,
          }}
        />
      </head>

      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
