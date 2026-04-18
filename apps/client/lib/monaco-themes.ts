export interface MonacoThemeDefinition {
  base: 'vs' | 'vs-dark';
  inherit: boolean;
  rules: Array<{
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
  }>;
  colors: Record<string, string>;
}

export const DEFAULT_THEMES = {
  'vs-dark': {
    name: 'Dark (Visual Studio)',
    variables: {
      '--toolbar-bg-secondary': '#3c3c3c',
      '--panel-background': '#1e1e1e',
      '--toolbar-foreground': '#fff',
      '--toolbar-bg-primary': '#2678ca',
      '--toolbar-accent': '#2678ca',
      '--panel-text-accent': '#fff'
    }
  },
  light: {
    name: 'Light (Visual Studio)',
    variables: {
      '--toolbar-bg-secondary': '#dddddd',
      '--panel-background': '#fffffe',
      '--toolbar-foreground': '#000',
      '--toolbar-bg-primary': '#2678ca',
      '--toolbar-accent': '#2678ca',
      '--panel-text-accent': '#fff'
    }
  }
} as const;

export const MONACO_THEME_LIST = {
  active4d: 'Active4D',
  'all-hallows-eve': 'All Hallows Eve',
  amy: 'Amy',
  'birds-of-paradise': 'Birds of Paradise',
  blackboard: 'Blackboard',
  'brilliance-black': 'Brilliance Black',
  'brilliance-dull': 'Brilliance Dull',
  'chrome-devtools': 'Chrome DevTools',
  'clouds-midnight': 'Clouds Midnight',
  clouds: 'Clouds',
  cobalt: 'Cobalt',
  cobalt2: 'Cobalt2',
  dawn: 'Dawn',
  dracula: 'Dracula',
  dreamweaver: 'Dreamweaver',
  eiffel: 'Eiffel',
  'espresso-libre': 'Espresso Libre',
  'github-dark': 'GitHub Dark',
  'github-light': 'GitHub Light',
  github: 'GitHub',
  idle: 'IDLE',
  katzenmilch: 'Katzenmilch',
  'kuroir-theme': 'Kuroir Theme',
  lazy: 'LAZY',
  'magicwb--amiga-': 'MagicWB (Amiga)',
  'merbivore-soft': 'Merbivore Soft',
  merbivore: 'Merbivore',
  'monokai-bright': 'Monokai Bright',
  monokai: 'Monokai',
  'night-owl': 'Night Owl',
  nord: 'Nord',
  'oceanic-next': 'Oceanic Next',
  'pastels-on-dark': 'Pastels on Dark',
  'slush-and-poppies': 'Slush and Poppies',
  'solarized-dark': 'Solarized-dark',
  'solarized-light': 'Solarized-light',
  spacecadet: 'SpaceCadet',
  sunburst: 'Sunburst',
  'textmate--mac-classic-': 'Textmate (Mac Classic)',
  'tomorrow-night-blue': 'Tomorrow-Night-Blue',
  'tomorrow-night-bright': 'Tomorrow-Night-Bright',
  'tomorrow-night-eighties': 'Tomorrow-Night-Eighties',
  'tomorrow-night': 'Tomorrow-Night',
  tomorrow: 'Tomorrow',
  twilight: 'Twilight',
  'upstream-sunburst': 'Upstream Sunburst',
  'vibrant-ink': 'Vibrant Ink',
  'xcode-default': 'Xcode_default',
  zenburnesque: 'Zenburnesque',
  iplastic: 'iPlastic',
  idlefingers: 'idleFingers',
  krtheme: 'krTheme',
  monoindustrial: 'monoindustrial'
} as const;

export const getMonacoThemeLabel = (key: string): string => {
  if (key in DEFAULT_THEMES) {
    return DEFAULT_THEMES[key as keyof typeof DEFAULT_THEMES].name;
  }

  return MONACO_THEME_LIST[key as keyof typeof MONACO_THEME_LIST] || key;
};

export const getMonacoThemeMode = (themeData: MonacoThemeDefinition): 'dark' | 'light' => {
  return themeData.base === 'vs-dark' ? 'dark' : 'light';
};

const themeCache = new Map<string, MonacoThemeDefinition>();

export const loadMonacoThemeData = async (key: string): Promise<MonacoThemeDefinition | null> => {
  if (key in DEFAULT_THEMES) {
    return null;
  }

  const cachedTheme = themeCache.get(key);
  if (cachedTheme) {
    return cachedTheme;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const response = await fetch(`/api/editor-theme/${encodeURIComponent(key)}`);
    if (!response.ok) {
      return null;
    }

    const themeData = (await response.json()) as MonacoThemeDefinition;
    themeCache.set(key, themeData);
    return themeData;
  } catch (error) {
    console.error('Failed to load Monaco theme:', error);
    return null;
  }
};
