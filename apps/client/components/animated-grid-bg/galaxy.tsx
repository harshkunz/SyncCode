'use client';
import dynamic from 'next/dynamic';

const Galaxy = dynamic(() => import('@/components/animated-grid-bg/index'), {
  ssr: false,
});

export default Galaxy;