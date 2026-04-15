/**
 * Configuration constants for environment, URLs, OAuth and application settings.
 * Features:
 * - Environment detection
 * - API endpoint URLs
 * - OAuth credentials
 * - App metadata
 */

export const IS_DEV_ENV =
  (process.env.VERCEL_ENV as string) === 'development' ||
  (process.env.NEXT_PUBLIC_ENV as string) === 'development' ||
  (process.env.NODE_ENV as string) === 'development';

export const BASE_CLIENT_URL = IS_DEV_ENV ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_CLIENT_URL as string);
export const BASE_SERVER_URL = IS_DEV_ENV ? 'http://localhost:3001' : (process.env.NEXT_PUBLIC_SERVER_URL as string);

export const NAME_MAX_LENGTH = 64;

export const SITE_NAME = 'SyncCode';
export const SITE_DESCRIPTION ='SyncCode: Code together, no sign-up needed.';
export const NAME = 'Harsh Pratap';
export const PORTFOLIO_URL = '';
export const CONTACT_URL = '';
export const REPO_URL = 'https://github.com/harshkunz/SyncCode';
export const GITHUB_URL = 'https://github.com/harshkunz';

export const DISABLE_TAILWIND_CDN_WARN = `<script>(()=>{const w=console.warn;console.warn=(...a)=>{typeof a[0]!=="string"||!a[0].includes("Tailwind CSS")?w.apply(console,a):void 0}})();</script>`;

export const PRE_INSTALLED_LIBS = [
  { name: 'Tailwind CSS', version: '4.x' },
  { name: 'Animate.css', version: '4.x' },
  { name: 'AOS', version: '2.x' },
  { name: 'Swiper', version: '11.x' },
  { name: 'HTMX', version: '2.x' },
  { name: 'Lucide Icons', version: '0.x' },
  { name: 'Alpine.js', version: '3.x' },
  { name: 'GSAP', version: '3.x' },
  { name: 'Popper', version: '2.x' },
  { name: 'Tippy.js', version: '6.x' },
  { name: 'React', version: '18.x' },
  { name: 'React DOM', version: '18.x' },
  { name: 'PropTypes', version: '15.x' },
  { name: 'Recharts', version: '2.x' },
  { name: 'Chart.js', version: '4.x' },
  { name: 'Lodash', version: '4.x' },
  { name: 'Day.js', version: '1.x' },
  { name: 'Sortable.js', version: '1.x' }
];
