/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint errors blocking build (warnings are fine)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors blocking build during CI
  typescript: {
    ignoreBuildErrors: true,
  },
  // Images config (for external sources if needed)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
