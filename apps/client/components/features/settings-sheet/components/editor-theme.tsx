/**
 * Editor theme selector component that manages Monaco editor themes.
 * Features:
 * - Theme synchronization with system/user preference
 * - Theme preview with CSS variable updates
 * - Theme persistence
 *
 *
 */

import { useEffect, useState } from 'react';

import type { Monaco } from '@monaco-editor/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTheme } from 'next-themes';

import { applyEditorTheme, initEditorTheme, registerMonaco } from '@/lib/init-editor-theme';
import { DEFAULT_THEMES, MONACO_THEME_LIST } from '@/lib/monaco-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EditorThemeSettingsProps {
  monaco: Monaco;
}

// Function to detect system color preference
const getSystemTheme = (): 'vs-dark' | 'light' => {
  if (typeof window === 'undefined') return 'vs-dark'; // Default for SSR

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'vs-dark'
    : 'light';
};

const EditorThemeSettings = ({ monaco }: EditorThemeSettingsProps) => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  // Initialize with system preference if no saved theme
  const savedTheme =
    typeof localStorage !== 'undefined' ? localStorage.getItem('editorTheme') : null;
  const initialTheme = savedTheme || getSystemTheme();

  const [editorTheme, setEditorTheme] = useState(initialTheme);

  // Register Monaco when the component mounts
  useEffect(() => {
    if (monaco) {
      registerMonaco(monaco);
    }
  }, [monaco]);

  // Run the init function once and sync with next-themes
  useEffect(() => {
    // Initialize editor theme
    void initEditorTheme();

    // Load saved theme to update the UI
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme) {
      setEditorTheme(savedTheme);

      // Also sync with next-themes
      if (savedTheme === 'vs-dark') {
        setTheme('dark');
      } else if (savedTheme in DEFAULT_THEMES) {
        setTheme('light');
      } else {
        void import('@/lib/monaco-themes').then(({ loadMonacoThemeData }) =>
          loadMonacoThemeData(savedTheme)
            .then(themeData => {
              if (themeData) {
                setTheme(themeData.base === 'vs-dark' ? 'dark' : 'light');
              }
            })
            .catch(error => {
              console.error('Failed to sync theme:', error);
            })
        );
      }
    } else {
      // No saved theme, use system preference
      const systemTheme = getSystemTheme();
      setEditorTheme(systemTheme);
      setTheme(systemTheme === 'vs-dark' ? 'dark' : 'light');
    }
  }, [setTheme]);

  const handleThemeChange = (key: string, value: string) => {
    setEditorTheme(key);
    setOpen(false);

    void applyEditorTheme(key, value).then(nextTheme => {
      setTheme(nextTheme);
    });
  };

  // Combine default and custom themes with explicit typing
  const themes = Object.entries({
    ...DEFAULT_THEMES,
    ...Object.fromEntries(
      Object.entries(MONACO_THEME_LIST).map(([key, value]) => [key, { name: value }])
    )
  });

  return (
    <div className="flex flex-col gap-y-2">
      <Label className="font-normal">Theme</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {themes.find(([key]) => key === editorTheme)?.[1].name || 'Dark (Visual Studio)'}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search theme..." />
            <CommandList>
              <CommandEmpty>No theme found.</CommandEmpty>
              <CommandGroup>
                {themes.map(([key, themeData]) => (
                  <CommandItem
                    key={key}
                    value={key}
                    onSelect={() => handleThemeChange(key, themeData.name)}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        key === editorTheme ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {themeData.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { EditorThemeSettings };
