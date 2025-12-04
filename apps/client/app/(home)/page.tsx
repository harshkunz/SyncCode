/**
 * Home page component that displays the landing page with:
 * - Room access form
 * - Animated background
 * - Feature showcase grid
 * - About and latency test buttons
 * - Server status indicator

 */

import { Suspense } from 'react';
import { LatencyTestButton } from '@/components/latency-test-button';
import { RoomAccessForm } from '@/components/room-access-form';

import { Status } from '@/components/status';
import Galaxy from '@/components/animated-grid-bg/galaxy';

export default async function Page({ searchParams }: PageProps<'/'>) {
  const params = await searchParams;
  const roomId = params.room?.toString() || '';

  return (
    <>
      {/* Background layers */}
      <div aria-hidden="true" role="presentation" className="fixed inset-0 -z-10 bg-black" />
      <div aria-hidden="true" role="presentation" className="fixed inset-0 -z-10 bg-black" />
      <div className="dark fixed inset-0 -z-10">
        <Galaxy 
          speed={1} 
          squareSize={40}
          direction='diagonal'
          borderColor='#271E37'
          hoverFillColor='#222'
        />
      </div>

      {/* Main layout */}
      <main className="dark relative flex min-h-full w-full flex-col overflow-hidden">

        {/* Left Section - Centered Form */}
        <div
          className="my-2 flex min-h-[700px] w-full flex-col justify-center items-center p-4 min-[560px]:p-8 mt-8"
        >
          <div className="w-full max-w-xl">

            <div className="mb-10 flex flex-col items-center text-center space-y-2 sm:space-y-1">
              {/* Logo and Title */}
              <div className="flex flex-col items-center gap-2 sm:gap-2 mb-4">
                <h1 className="text-2xl sm:text-3xl tracking-tight text-foreground">
                  Build Together <span className='text-3xl bg-gradient-to-r from-[#fb568a] to-[#e456fb]  bg-clip-text text-transparent'>with <span className="text-white/30">SyncCode</span> </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-center text-xs sm:text-xs text-white/90 font-mono">
                Your collaborative coding space, reimagined. Start now, no sign-up required.  
              </p>
              <p className="text-center text-xs sm:text-xs text-white/90 font-mono">
                Connect, code, and create with others in real-time.
              </p>
            </div>

            <Suspense fallback={null}>
              <RoomAccessForm roomId={roomId} />
            </Suspense>
          </div>
        </div>
        {/* Bottom buttons */}
        <div className="dark fixed bottom-2.5 right-4 flex items-center gap-x-4 scale-90">
          <Status />
          <LatencyTestButton />
        </div>
      </main>
    </>

  );
}
