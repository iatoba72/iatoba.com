import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Keep React Compiler
  reactCompiler: true,

  // Add trailing slashes for better compatibility
  trailingSlash: true,
};

export default nextConfig;
