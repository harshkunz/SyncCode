/**
 * Editor theme utility that manages Monaco editor themes.
 * Features:
 * - Theme initialization and persistence
 * - Theme application to editor and UI
 * - CSS variable handling for consistent theming
 * - System/dark mode synchronization
 
 */

import type { Monaco } from '@monaco-editor/react';

import {
  DEFAULT_THEMES,
  getMonacoThemeMode,
  loadMonacoThemeData,
  type MonacoThemeDefinition
} from '@/lib/monaco-themes';

const setCSSVariables = (variables: Record<string, string>) => {
  if (typeof document === 'undefined') return; // Check for SSR

  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// Global Monaco instance reference
let globalMonaco: Monaco | null = null;

const applyThemeClass = (themeBase: MonacoThemeDefinition['base']) => {
  if (themeBase === 'vs-dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
};

const applyDefaultTheme = (themeKey: keyof typeof DEFAULT_THEMES) => {
  const themeConfig = DEFAULT_THEMES[themeKey];
  setCSSVariables(themeConfig.variables);
  setCSSVariables({ '--status-bar-text': '#fff' });
  applyThemeClass(themeKey === 'vs-dark' ? 'vs-dark' : 'vs');
};

const applyCustomTheme = (themeData: MonacoThemeDefinition) => {
  applyThemeClass(themeData.base);

  setCSSVariables({
    '--toolbar-bg-primary': themeData.colors['editor.selectionBackground'].slice(0, 7),
    '--toolbar-bg-secondary': themeData.colors['editor.selectionBackground'].slice(0, 7),
    '--toolbar-foreground': themeData.colors['editor.foreground'].slice(0, 7),
    '--toolbar-accent': themeData.colors['editorCursor.foreground'].slice(0, 7),
    '--panel-text-accent': themeData.colors['editor.background'].slice(0, 7),
    '--panel-background': themeData.colors['editor.background'].slice(0, 7),
    '--status-bar-text': getMonacoThemeMode(themeData)
  });
};

// Function to register Monaco
export const registerMonaco = (monaco: Monaco) => {
  globalMonaco = monaco;

  // Apply the current theme to Monaco if it exists
  const savedTheme =
    typeof localStorage !== 'undefined' ? localStorage.getItem('editorTheme') : null;
  if (savedTheme && savedTheme in DEFAULT_THEMES) {
    globalMonaco.editor.setTheme(savedTheme);
    return;
  }

  if (savedTheme) {
    void loadMonacoThemeData(savedTheme).then(themeData => {
      if (!themeData) {
        globalMonaco?.editor.setTheme('vs-dark');
        return;
      }

      globalMonaco?.editor.defineTheme(savedTheme, themeData);
      globalMonaco?.editor.setTheme(savedTheme);
    });
    return;
  }

  const systemPrefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  globalMonaco.editor.setTheme(systemPrefersDark ? 'vs-dark' : 'light');
};

// Function to check system preference for dark mode
const getSystemPreference = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark'; // Default for SSR

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const initEditorTheme = async () => {
  if (typeof window === 'undefined') return; // Skip during SSR

  const savedTheme = localStorage.getItem('editorTheme');

  if (savedTheme) {
    // Apply saved theme variables
    if (savedTheme in DEFAULT_THEMES) {
      applyDefaultTheme(savedTheme as keyof typeof DEFAULT_THEMES);
    } else {
      try {
        const themeData = await loadMonacoThemeData(savedTheme);

        if (themeData) {
          applyCustomTheme(themeData);
          globalMonaco?.editor.defineTheme(savedTheme, themeData);
        } else {
          applyDefaultTheme('vs-dark');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    }
  } else {
    // No saved theme, check system preference and apply appropriate default theme
    const systemPreference = getSystemPreference();
    const defaultTheme = systemPreference === 'dark' ? 'vs-dark' : 'light';

    // Store in localStorage to maintain consistency
    localStorage.setItem('editorTheme', defaultTheme);

    // Apply default theme based on system preference
    applyDefaultTheme(defaultTheme as keyof typeof DEFAULT_THEMES);
  }

  // Apply theme to Monaco if it's available
  if (globalMonaco) {
    const theme =
      localStorage.getItem('editorTheme') ||
      (getSystemPreference() === 'dark' ? 'vs-dark' : 'light');
    globalMonaco.editor.setTheme(theme);
  }
};

// Run initialization immediately
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure this runs after the browser has fully loaded
  setTimeout(() => {
    void initEditorTheme();
  }, 0);
}

// Export a utility function that components can use to apply a theme
export const applyEditorTheme = async (key: string, value: string) => {
  localStorage.setItem('editorTheme', key);

  if (key in DEFAULT_THEMES) {
    applyDefaultTheme(key as keyof typeof DEFAULT_THEMES);
    globalMonaco?.editor.setTheme(key);
    return key === 'vs-dark' ? 'dark' : 'light';
  }

  try {
    const themeData = await loadMonacoThemeData(value);

    if (!themeData) {
      globalMonaco?.editor.setTheme('vs-dark');
      return 'dark';
    }

    globalMonaco?.editor.defineTheme(key, themeData);

    applyCustomTheme(themeData);

    if (globalMonaco) {
      globalMonaco.editor.setTheme(key);
    }

    return getMonacoThemeMode(themeData);
  } catch (error) {
    console.error('Failed to load theme:', error);
    globalMonaco?.editor.setTheme('vs-dark');
    return 'dark';
  }
};
