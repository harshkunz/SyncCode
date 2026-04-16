/**
 * Welcome message component displayed in shared terminal.
 * Features:
 * - App logo and branding
 * - Usage instructions
 * - Terminal formatting
 *
*
 */

import Image from 'next/image';

const WelcomeMsg = () => (
  <div className="mb-4 ">
    <div className="flex items-center gap-2 text-sm">
      <Image
        src="/images/icon.svg"
        alt="CodeX Logo"
        className="size-5"
        width="16"
        height="16"
        priority
      />
      <span className=''>Terminal</span>
    </div>
    <div className='pt-4 text-xs text-center'>
      Select language via the dropdown in the bottom right corner.
    </div>
  </div>
);

export { WelcomeMsg };
