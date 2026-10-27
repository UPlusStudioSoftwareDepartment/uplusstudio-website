import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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

    deviceSizes: [640, 828, 1200, 1920], 
    imageSizes: [16, 32, 48, 64, 96, 128, 256], 
  },

  productionBrowserSourceMaps: false,

  async redirects() {
    return [
      { source: "/:locale(tr|en)/:path(payment|purchase)/:rest*", destination: "/:locale/services", permanent: true },
      { source: "/purchase", destination: "/tr/services", permanent: true },
      { source: "/:locale(tr|en)/faq", destination: "/:locale/contact", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
