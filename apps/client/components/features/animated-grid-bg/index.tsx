'use client';

import dynamic from 'next/dynamic';

const Galaxy = dynamic(() => import('@/components/features/animated-grid-bg/components/galaxy'), {
  ssr: false
});

export default Galaxy;
