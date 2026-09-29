import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // What is actually applied
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch {
      /* storage blocked (private mode, strict privacy settings) */
    }
    return 'system';
  });

  // Resolve up front so the 3D scene doesn't render once in the wrong theme and rebuild.
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() =>
    theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
  );

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('portfolio-theme', newTheme);
    } catch {
      /* theme just won't persist */
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: 'light' | 'dark') => {
      if (mode === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      setActualTheme(mode);
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const listener = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      };
      
      // Safari < 14 only has the legacy addListener API
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
