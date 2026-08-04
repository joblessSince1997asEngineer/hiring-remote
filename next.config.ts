import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ This tells Next.js to completely ignore TypeScript errors during the build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
