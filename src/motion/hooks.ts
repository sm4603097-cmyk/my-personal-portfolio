import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Client-only media query hook. The initial value is derived during render
// (lazy initializer), and changes are applied only through the native `change`
// listener — safe in any render environment and effect-rule friendly.
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

/** True when the viewport is below the given width (default 768px). */
export const useIsMobile = (breakpoint = 768): boolean =>
  useMediaQuery(`(max-width: ${breakpoint - 1}px)`);

/** True when the primary input supports precise hover (mouse / trackpad). */
export const useIsFinePointer = (): boolean =>
  useMediaQuery('(hover: hover) and (pointer: fine)');

/** Current layout direction from the language context (hoisted for motion). */
export const useIsRtl = (): boolean => useLanguage().isRtl;