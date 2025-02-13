import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      }
    }
  }
};

export default nextConfig;