/**
 * Root layout component that wraps all pages.
 * Provides global configuration and providers including:
 * - Fonts (Geist Sans and Mono)
 * - Metadata and SEO settings
 * - Theme provider
 * - Toast notifications
 * - Analytics
 *
 */

import type { Metadata, Viewport } from 'next';

import { GeistMono } from 'geist/font/mono';


import './globals.css';

// export const runtime = 'edge';

const DEFAULT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://synccode.vercel.app';

export const metadata: Metadata = {}

export const viewport: Viewport = {}

export default function RootLayout({}) {
  return (
    <html>
      <head>
        <meta name="" />
      </head>
      <body className="">
      </body>
    </html>
  );
}
