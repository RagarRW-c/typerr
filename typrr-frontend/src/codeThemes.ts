// Code Themes System
// Professional color schemes for code snippets

export interface CodeTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    text: string;
    cursor: string;
    selection: string;
    keyword: string;
    string: string;
    number: string;
    comment: string;
    function: string;
    operator: string;
    variable: string;
    error: string;
    success: string;
  };
}

export const CODE_THEMES: CodeTheme[] = [
  {
    id: 'vscode-dark',
    name: 'VS Code Dark',
    description: 'Classic VS Code dark theme',
    colors: {
      background: '#1e1e1e',
      text: '#d4d4d4',
      cursor: '#ffffff',
      selection: '#264f78',
      keyword: '#569cd6',
      string: '#ce9178',
      number: '#b5cea8',
      comment: '#6a9955',
      function: '#dcdcaa',
      operator: '#d4d4d4',
      variable: '#9cdcfe',
      error: '#f48771',
      success: '#89d185',
    },
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    description: 'Clean GitHub light theme',
    colors: {
      background: '#ffffff',
      text: '#24292f',
      cursor: '#24292f',
      selection: '#b3d7ff',
      keyword: '#cf222e',
      string: '#0a3069',
      number: '#0550ae',
      comment: '#6e7781',
      function: '#8250df',
      operator: '#24292f',
      variable: '#953800',
      error: '#cf222e',
      success: '#1a7f37',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with purple accents',
    colors: {
      background: '#282a36',
      text: '#f8f8f2',
      cursor: '#f8f8f0',
      selection: '#44475a',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      comment: '#6272a4',
      function: '#50fa7b',
      operator: '#ff79c6',
      variable: '#8be9fd',
      error: '#ff5555',
      success: '#50fa7b',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Vibrant dark theme with warm colors',
    colors: {
      background: '#272822',
      text: '#f8f8f2',
      cursor: '#f8f8f0',
      selection: '#49483e',
      keyword: '#f92672',
      string: '#e6db74',
      number: '#ae81ff',
      comment: '#75715e',
      function: '#a6e22e',
      operator: '#f92672',
      variable: '#66d9ef',
      error: '#f92672',
      success: '#a6e22e',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic, north-bluish color palette',
    colors: {
      background: '#2e3440',
      text: '#d8dee9',
      cursor: '#d8dee9',
      selection: '#434c5e',
      keyword: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      comment: '#616e88',
      function: '#88c0d0',
      operator: '#81a1c1',
      variable: '#8fbcbb',
      error: '#bf616a',
      success: '#a3be8c',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Precision colors for machines and people',
    colors: {
      background: '#002b36',
      text: '#839496',
      cursor: '#839496',
      selection: '#073642',
      keyword: '#268bd2',
      string: '#2aa198',
      number: '#d33682',
      comment: '#586e75',
      function: '#b58900',
      operator: '#859900',
      variable: '#cb4b16',
      error: '#dc322f',
      success: '#859900',
    },
  },
];

// Get theme by ID
export function getTheme(id: string): CodeTheme {
  return CODE_THEMES.find(t => t.id === id) || CODE_THEMES[0];
}

// Get current theme from localStorage
const THEME_STORAGE_KEY = 'typrr_code_theme';

export function getCurrentTheme(): CodeTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return getTheme(stored);
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
  return CODE_THEMES[0]; // Default to VS Code Dark
}

// Save theme to localStorage
export function saveTheme(themeId: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

// Get CSS variables for current theme
export function getThemeCSS(theme: CodeTheme): Record<string, string> {
  return {
    '--code-bg': theme.colors.background,
    '--code-text': theme.colors.text,
    '--code-cursor': theme.colors.cursor,
    '--code-selection': theme.colors.selection,
    '--code-keyword': theme.colors.keyword,
    '--code-string': theme.colors.string,
    '--code-number': theme.colors.number,
    '--code-comment': theme.colors.comment,
    '--code-function': theme.colors.function,
    '--code-operator': theme.colors.operator,
    '--code-variable': theme.colors.variable,
    '--code-error': theme.colors.error,
    '--code-success': theme.colors.success,
  };
}
