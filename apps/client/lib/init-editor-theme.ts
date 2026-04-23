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

const getMonacoThemeId = (themeKey: string): string => {
  return themeKey === 'light' ? 'vs' : themeKey;
};

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

const getThemeColor = (themeData: MonacoThemeDefinition, key: string, fallback: string): string => {
  const value = themeData.colors[key];
  return typeof value === 'string' && value.length > 0 ? value.slice(0, 7) : fallback;
};

const applyCustomTheme = (themeData: MonacoThemeDefinition) => {
  applyThemeClass(themeData.base);

  const isDark = getMonacoThemeMode(themeData) === 'dark';
  const toolbarBg = getThemeColor(
    themeData,
    'editor.selectionBackground',
    isDark ? '#264f78' : '#add6ff'
  );
  const foreground = getThemeColor(themeData, 'editor.foreground', isDark ? '#d4d4d4' : '#000000');
  const cursor = getThemeColor(
    themeData,
    'editorCursor.foreground',
    isDark ? '#aeafad' : '#000000'
  );
  const background = getThemeColor(themeData, 'editor.background', isDark ? '#1e1e1e' : '#ffffff');

  setCSSVariables({
    '--toolbar-bg-primary': toolbarBg,
    '--toolbar-bg-secondary': toolbarBg,
    '--toolbar-foreground': foreground,
    '--toolbar-accent': cursor,
    '--panel-text-accent': foreground,
    '--panel-background': background,
    '--status-bar-text': foreground
  });
};

// Function to register Monaco
export const registerMonaco = (monaco: Monaco) => {
  globalMonaco = monaco;

  // Apply the current theme to Monaco if it exists
  const savedTheme =
    typeof localStorage !== 'undefined' ? localStorage.getItem('editorTheme') : null;
  if (savedTheme && savedTheme in DEFAULT_THEMES) {
    globalMonaco.editor.setTheme(getMonacoThemeId(savedTheme));
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

  globalMonaco.editor.setTheme(systemPrefersDark ? 'vs-dark' : 'vs');
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
    globalMonaco.editor.setTheme(getMonacoThemeId(theme));
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
export const applyEditorTheme = async (key: string) => {
  localStorage.setItem('editorTheme', key);

  if (key in DEFAULT_THEMES) {
    applyDefaultTheme(key as keyof typeof DEFAULT_THEMES);
    globalMonaco?.editor.setTheme(getMonacoThemeId(key));
    return key === 'vs-dark' ? 'dark' : 'light';
  }

  try {
    const themeData = await loadMonacoThemeData(key);

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
