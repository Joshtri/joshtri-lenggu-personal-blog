import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,

  images: {
    domains: ['firebasestorage.googleapis.com'],
  },

  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },

};

export default nextConfig;
