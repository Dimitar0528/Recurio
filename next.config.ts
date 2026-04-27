import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
  cacheLife: {
    days: {
      stale: 60 * 60 * 6, // 6h
      revalidate: 60 * 60 * 24, // 24h
      expire: 60 * 60 * 24 * 3, // 3d
    },
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
