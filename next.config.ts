import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    globalNotFound: true,
    cssChunking: true,
  },
};

export default nextConfig;
