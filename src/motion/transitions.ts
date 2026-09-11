// Central timing & easing language for the entire portfolio.
// Every primitive and section derives its motion from these tokens so the
// whole site reads as one coherent system.

export type BezierEase = [number, number, number, number];

/** Restrained cinematic ease — the signature curve used across the site. */
export const EASE_PREMIUM: BezierEase = [0.22, 1, 0.36, 1];

/** Softer standard ease for hovers and micro-interactions. */
export const EASE_STANDARD: BezierEase = [0.16, 1, 0.3, 1];

/** Fast eased-out settle for small interactive elements. */
export const EASE_OUT: BezierEase = [0.15, 0.65, 0.5, 1];

// Named durations (seconds). Kept as a single memory token set.
export const DURATION = {
  /** Micro-interactions: hover, tap, tab switches. */
  fast: 0.35,
  /** Standard reveal. */
  base: 0.55,
  /** Structural reveals (cards, blocks). */
  medium: 0.7,
  /** Cinematic moments (headers, hero, timelines). */
  slow: 0.9,
  /** Default stagger gap between sibling items. */
  stagger: 0.09,
  /** Wider stagger gap for slower, more premium sequences. */
  staggerSlow: 0.13,
} as const;

/** Reduced-motion fallback timing — a deliberate, near-instant settle. */
export const REDUCED_TRANSITION = { duration: 0.15 } as const;

export const transitionFor = (duration?: number, ease: BezierEase = EASE_PREMIUM) =>
  ({ duration: duration ?? DURATION.base, ease }) as const;