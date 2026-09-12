import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'portfolio-theme';

const THEME_COLORS: Record<Theme, string> = {
  dark: '#050608',
  light: '#f8fafc',
};

const applyThemeToDocument = (nextTheme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Suppress the color-transition cascade for a single frame while the theme
  // classes swap. Without this, every element carrying a transition
  // (transition-all, transition-colors, cards) animates its colors in
  // parallel, keeping the page in a long style-recalc storm. The class is
  // removed after the swap-paint so regular hover transitions keep working.
  root.classList.add('theme-switching');
  root.classList.remove('dark', 'light');
  root.classList.add(nextTheme);
  root.setAttribute('data-theme', nextTheme);

  // Keep the mobile browser chrome in sync with the active theme.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', THEME_COLORS[nextTheme]);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });
  });
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Persists the theme and keeps the document in sync. The action handlers
  // already apply the class synchronously on the click path, so this runs as
  // an idempotent safety net + persistence sink.
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeToDocument(theme);
  }, [theme]);

  // Listen for system theme changes if user hasn't explicitly set preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (!saved) {
        const nextTheme: Theme = e.matches ? 'dark' : 'light';
        applyThemeToDocument(nextTheme);
        setThemeState(nextTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    // Apply the theme class synchronously on the click path — before the React
    // commit — so the page recolors in one pass with no post-paint flip.
    applyThemeToDocument(nextTheme);
    setThemeState(nextTheme);
  };

  const setTheme = (newTheme: Theme) => {
    applyThemeToDocument(newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
