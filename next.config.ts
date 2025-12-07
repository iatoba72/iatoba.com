import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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

export default withNextIntl(nextConfig);
