import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize JavaScript output for modern browsers
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-label', '@radix-ui/react-slot'],
    // Optimize CSS loading
    optimizeCss: true,
  },

  // Image optimization
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
