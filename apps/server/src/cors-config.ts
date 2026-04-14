
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  process.env.SERVER_URL,
  'http://localhost:3000'
] as const;

const getCorsHeaders = (origin: string | undefined) => ({
  'Access-Control-Allow-Methods': 'GET',
  Vary: 'Origin'
});

export { ALLOWED_ORIGINS };