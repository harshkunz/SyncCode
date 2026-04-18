/**
 * About dialog component that provides information about the application.
 * Features:
 * - Responsive dialog/drawer based on screen size
 * - Project description
 * - Preview image with loading state
 * - External links
 *
 *
 */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Image from 'next/image';

import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

import { ExternalLink } from './components/external-link';

interface AboutDialogRef {
  openDialog: () => void;
  closeDialog: () => void;
}

interface AboutDialogProps {
  forceDark?: boolean;
}

const AboutDialog = forwardRef<AboutDialogRef, AboutDialogProps>(({ forceDark = false }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  // Expose openDialog and closeDialog to the parent component
  useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog
  }));

  useEffect(() => {
    if (isOpen) {
      setIsImgLoaded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsImgLoaded(false);
  }, [isDesktop]);

  // Desktop Modal
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen} aria-label="About syncCode">
        <DialogContent
          className={cn(
            'mx-auto max-w-md rounded-2xl border border-white/20 bg-black/90 p-8 shadow-lg backdrop-blur-xl',
            forceDark && 'dark'
          )}
        >
          <DialogHeader className="pb-4 text-center">
            <DialogTitle className="mb-2 text-2xl font-bold tracking-wide text-white">
              {SITE_NAME}
            </DialogTitle>
          </DialogHeader>

          <nav className="grid grid-cols-4 gap-4 py-4" aria-label="External links">
            <ExternalLink forceDark={forceDark} />
          </nav>

          <DialogFooter className="mt-6 flex justify-center">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className={`group relative flex w-1/2 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r
                  from-blue-700 to-purple-600 py-3 font-semibold text-white shadow-md transition-all duration-300
                  hover:scale-105 hover:shadow-2xl active:scale-95`}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile Drawer
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} aria-label="About syncCode">
      <DrawerContent className="mx-auto max-w-sm rounded-2xl border border-white/20 bg-black/95 p-6 shadow-lg backdrop-blur-xl">
        <DrawerHeader className="pb-2 text-center">
          <DrawerTitle className="mb-1 text-xl font-bold tracking-wide text-white">
            {SITE_NAME}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-3 py-4">
          <nav className="grid grid-cols-2 gap-3" aria-label="External links">
            <ExternalLink forceDark={forceDark} />
          </nav>
        </div>

        <DrawerFooter className="flex justify-center pt-4">
          <DrawerClose asChild>
            <Button
              variant="secondary"
              className={`group relative flex w-2/3 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r
                from-blue-700 to-purple-600 py-3 font-semibold text-white shadow-md transition-all duration-300
                hover:scale-105 hover:shadow-2xl active:scale-95`}
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

AboutDialog.displayName = 'OpenPromptDialog';

export { AboutDialog, type AboutDialogRef };
