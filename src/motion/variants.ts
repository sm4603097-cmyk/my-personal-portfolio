import type { Variants } from 'framer-motion';
import {
  EASE_PREMIUM,
  EASE_STANDARD,
  EASE_OUT,
  DURATION,
  REDUCED_TRANSITION,
  transitionFor,
  type BezierEase,
} from './transitions';

// Shared animation variants for consistent motion across all sections.
// Using typed bezier curves for premium easing.

// Keep the historical export name for backwards compatibility.
export const TRANSITION_EASE: BezierEase = EASE_PREMIUM;

export const SECTION_REVEAL: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionFor(DURATION.medium, EASE_PREMIUM),
  },
};

export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: DURATION.stagger, delayChildren: 0.15 },
  },
};

export const CARD_STAGGER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: DURATION.stagger, delayChildren: 0.1 },
  },
};

export const ITEM_FADE_UP: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitionFor(DURATION.medium, EASE_PREMIUM),
  },
};

export const MASK_REVEAL: Variants = {
  hidden: { y: '105%' },
  visible: {
    y: '0%',
    transition: transitionFor(DURATION.slow, EASE_PREMIUM),
  },
};

export const CARD_ITEM: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitionFor(DURATION.base, EASE_PREMIUM),
  },
};

export const SCALE_ITEM: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionFor(DURATION.base, EASE_STANDARD),
  },
};

export const SLIDE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionFor(DURATION.base, EASE_PREMIUM),
  },
};

// Motion-safe variants used when the visitor prefers reduced motion.
export const FADE_ONLY: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: REDUCED_TRANSITION },
};

export const NO_MOTION_CONTAINER: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: REDUCED_TRANSITION },
};

// ---------------------------------------------------------------------------
// Direction-aware variant factories (with logical RTL handling).
// ---------------------------------------------------------------------------

export type RevealVariant =
  | 'fade'
  | 'fade-up'
  | 'scale'
  | 'slide-start'
  | 'slide-end'
  | 'mask';

export interface RevealOptions {
  distance?: number;
  duration?: number;
  ease?: BezierEase;
}

const revealTransition = (options: RevealOptions) =>
  transitionFor(options.duration ?? DURATION.medium, options.ease ?? EASE_PREMIUM);

/** Variants for a WYSIWYG reveal — RTL handled by passing logical directions. */
export const createRevealVariants = (
  variant: RevealVariant,
  options: RevealOptions = {},
): Variants => {
  switch (variant) {
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: revealTransition(options) },
      };
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0.97 },
        visible: { opacity: 1, scale: 1, transition: revealTransition(options) },
      };
    case 'slide-start':
      return {
        hidden: { opacity: 0, x: -(options.distance ?? 12) },
        visible: { opacity: 1, x: 0, transition: revealTransition(options) },
      };
    case 'slide-end':
      return {
        hidden: { opacity: 0, x: options.distance ?? 12 },
        visible: { opacity: 1, x: 0, transition: revealTransition(options) },
      };
    case 'mask':
      return {
        hidden: { y: '105%' },
        visible: { y: '0%', transition: revealTransition(options) },
      };
    case 'fade-up':
    default:
      return {
        hidden: { opacity: 0, y: options.distance ?? 24 },
        visible: { opacity: 1, y: 0, transition: revealTransition(options) },
      };
  }
};

/** Stagger container factory. */
export const createStaggerVariants = (
  staggerChildren: number = DURATION.stagger,
  delayChildren: number = 0,
): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } },
});

/** Re-export the easing/duration tokens for ergonomic importing. */
export { EASE_PREMIUM, EASE_STANDARD, EASE_OUT, DURATION, REDUCED_TRANSITION, transitionFor };
export type { BezierEase };