import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
  cacheLife: {
    halfDay: {
      stale: 60 * 60 * 6, // 6h
      revalidate: 60 * 60 * 12, // 12 h
      expire: 60 * 60 * 24 * 2, // 2d
    },
    max: {
      stale: 60 * 60 * 24 * 7 // 7d
    }
  },
  experimental: {
    globalNotFound: true,
    cssChunking: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
