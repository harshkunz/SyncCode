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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

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
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      aria-label="About CodeX"
    >
      <DialogContent className={cn(
        "max-w-md mx-auto p-8 rounded-2xl border border-white/20 shadow-lg backdrop-blur-xl bg-black/90",
        forceDark && "dark"
      )}>
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-white tracking-wide mb-2">
            {SITE_NAME}
          </DialogTitle>
        </DialogHeader>

        <nav className="grid grid-cols-4 gap-4 py-4" aria-label="External links">
          <ExternalLink forceDark={forceDark} />
        </nav>

        <DialogFooter className="flex justify-center mt-6">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className={`
                w-1/2 py-3
                rounded-full
                bg-gradient-to-r from-blue-700 to-purple-600
                text-white font-semibold
                shadow-md
                transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                active:scale-95
                flex items-center justify-center
                relative overflow-hidden
                group
              `}
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
  <Drawer
    open={isOpen}
    onOpenChange={setIsOpen}
    aria-label="About CodeX"
  >
    <DrawerContent className="mx-auto max-w-sm p-6 rounded-2xl border border-white/20 shadow-lg backdrop-blur-xl bg-black/95">
      <DrawerHeader className="text-center pb-2">
        <DrawerTitle className="text-xl font-bold text-white tracking-wide mb-1">
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
            className={`
              w-2/3 py-3
              rounded-full
              bg-gradient-to-r from-blue-700 to-purple-600
              text-white font-semibold
              shadow-md
              transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              active:scale-95
              flex items-center justify-center
              relative overflow-hidden
              group
            `}
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
