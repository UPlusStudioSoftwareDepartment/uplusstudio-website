import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const csp = ["frame-ancestors 'self'", "base-uri 'self'", "form-action 'self'", "object-src 'none'", ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : [])].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: __dirname,
  },

  compress: true,
  poweredByHeader: false,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  images: {
    formats: ["image/avif", "image/webp"], 
    minimumCacheTTL: 31536000, 

    deviceSizes: [640, 828, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-Release", value: process.env.VERCEL_GIT_COMMIT_SHA ?? "local" },
        ],
      },
      {
        source: "/:locale(tr|en)/:page(randevu-kart|randevu-yanit)/:rest*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/", destination: "/tr", permanent: true },
      { source: "/:locale(tr|en)/:path(payment|purchase)/:rest*", destination: "/:locale/services", permanent: true },
      { source: "/purchase", destination: "/tr/services", permanent: true },
      { source: "/:locale(tr|en)/faq", destination: "/:locale/contact", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
