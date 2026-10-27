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
  
  experimental: {
    optimizeCss: true,
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uplusstudio.com.tr",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], 
    minimumCacheTTL: 31536000, 
    dangerouslyAllowSVG: true,
    
    deviceSizes: [640, 828, 1200, 1920], 
    imageSizes: [16, 32, 48, 64, 96, 128, 256], 
    
    unoptimized: false,
  },

  productionBrowserSourceMaps: false,

  async redirects() {
    return [
      { source: "/:locale(tr|en)/:path(payment|purchase)/:rest*", destination: "/:locale/services", permanent: true },
      { source: "/purchase", destination: "/tr/services", permanent: true },
      { source: "/:locale(tr|en)/faq", destination: "/:locale/contact", permanent: false },
    ];
  },
  
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      config.devtool = 'source-map';
      
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: '//# sourceMappingURL=[file].map',
          entryOnly: false,
          raw: false,
        })
      );
      
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
