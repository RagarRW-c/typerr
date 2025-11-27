import { useState } from 'react';
import { CODE_THEMES, getCurrentTheme, saveTheme, type CodeTheme } from './codeThemes';

interface ThemeSelectorProps {
  onThemeChange: (theme: CodeTheme) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(getCurrentTheme());
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme: CodeTheme) => {
    setSelectedTheme(theme);
    saveTheme(theme.id);
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button hover-lift"
        aria-label="Select code theme"
      >
        <span className="text-xl">🎨</span>
        <div className="text-left">
          <div className="text-sm font-semibold">{selectedTheme.name}</div>
          <div className="text-xs text-zinc-500">{selectedTheme.description}</div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full mt-2 left-0 w-80 glass-card rounded-2xl p-4 shadow-2xl z-50 animate-fade-in">
            <div className="space-y-2">
              {CODE_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedTheme.id === theme.id
                      ? 'bg-indigo-600 text-white'
                      : 'glass-button hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Theme Preview */}
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 overflow-hidden"
                      style={{ backgroundColor: theme.colors.background }}
                    >
                      <div className="p-2 text-xs font-mono leading-tight">
                        <span style={{ color: theme.colors.keyword }}>const</span>{' '}
                        <span style={{ color: theme.colors.variable }}>x</span>
                        <span style={{ color: theme.colors.text }}> = </span>
                        <span style={{ color: theme.colors.number }}>42</span>
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1">
                      <div className="font-semibold">{theme.name}</div>
                      <div className={`text-xs ${
                        selectedTheme.id === theme.id
                          ? 'text-indigo-100'
                          : 'text-zinc-500'
                      }`}>
                        {theme.description}
                      </div>
                    </div>

                    {/* Selected Check */}
                    {selectedTheme.id === theme.id && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
