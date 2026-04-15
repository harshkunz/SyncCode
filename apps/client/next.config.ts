/**
 * Next.js configuration for the client application.
 * Features:
 * - Sentry error tracking
 * - Package optimization
 * - Image domains
 * - Turbo config
 */

import type { NextConfig } from 'next';

import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  reactCompiler: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
  }
};

