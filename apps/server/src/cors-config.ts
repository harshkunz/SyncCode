/**
 * CORS configuration for server request handling.
 * Features:
 * - Origin validation
 * - Vercel deployment detection
 * - Header generation
 */

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  process.env.SERVER_URL,
  'http://localhost:3000'
].filter(Boolean) as string[];

const isVercelDeployment = (origin: string): boolean => {
  const VERCEL_PATTERNS = [
    /^https:\/\/synccode(?:-[a-zA-Z0-9-]+)?\.vercel\.app$/,
    /^https:\/\/synccode-client-[a-zA-Z0-9]+-[a-zA-Z0-9-]+\.vercel\.app$/
  ];

  return VERCEL_PATTERNS.some(pattern => pattern.test(origin));
};

const getAllowedOrigin = (origin: string | undefined): string => {
  const fallbackOrigin = ALLOWED_ORIGINS[0] ?? 'http://localhost:3000';

  // For security, avoid returning '*' in production
  if (process.env.NODE_ENV === 'production' && !origin) {
    return fallbackOrigin;
  }

  if (!origin) return '*';

  if (
    ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number]) ||
    isVercelDeployment(origin)
  ) {
    return origin;
  }

  return fallbackOrigin;
};

const getCorsHeaders = (origin: string | undefined) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Methods': 'GET',
  Vary: 'Origin'
});

export { ALLOWED_ORIGINS, getCorsHeaders, isVercelDeployment };
