import "@/app/globals.css";
import I18nProvider from "@/components/I18nProvider";
import { metadata } from "./metadata";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ArchitecturalDesign",
  "name": "UPlus Studio",
  "description": "UPlus Studio, İstanbul merkezli mimari tasarım, iç mimarlık ve proje yönetimi hizmetleri sunar.",
  "url": "https://uplusstudio.com",
  "telephone": "+90 212 555 0123",
  "email": "info@uplusstudio.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Levent",
    "addressLocality": "İstanbul",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "41.0814",
    "longitude": "29.0125"
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "sameAs": [
    "https://instagram.com/uplusstudio",
    "https://linkedin.com/company/uplusstudio"
  ]
};

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredDataJson = JSON.stringify(structuredData);
  
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/png" href="/logo/uplusstudioblacklogo.png" />
        <link rel="shortcut icon" href="/logo/uplusstudioblacklogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/uplusstudioblacklogo.png" />
        <meta name="theme-color" content="#000000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: structuredDataJson.replace(/</g, '\\u003c') 
          }}
        />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
