import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition, Transition, Variants } from 'framer-motion';
import { createRevealVariants, FADE_ONLY, type RevealVariant } from './variants';
import { DURATION } from './transitions';
import { viewportOnce, viewportRepeat } from './presets';

// Pre-created motion tags (stable across renders, Fast-Refresh safe).
const REVEAL_TAGS = {
  div: motion.create('div'),
  h1: motion.create('h1'),
  h2: motion.create('h2'),
  h3: motion.create('h3'),
  h4: motion.create('h4'),
  p: motion.create('p'),
  span: motion.create('span'),
  section: motion.create('section'),
};
type RevealTagName = keyof typeof REVEAL_TAGS;

export interface RevealProps {
  children: ReactNode;
  /** Reveal style. Defaults to `fade-up`. */
  variant?: RevealVariant;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Animation duration. */
  duration?: number;
  /** Travel distance in px for directional variants. */
  distance?: number;
  /** Intersection threshold (0–1) before triggering. */
  amount?: number;
  /** Whether the reveal plays only once or replays on re-entry (default). */
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Semantic tag to render. Unknown tags fall back to `div`. */
  as?: keyof HTMLElementTagNameMap;
}

/**
 * The single viewport-triggered reveal primitive. It encodes the site's
 * movement language — transforms + opacity only, no layout animation —
 * and degrades to a quick opacity fade for reduced-motion visitors.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = DURATION.medium,
  distance,
  amount = 0.2,
  once = false,
  className,
  style,
  as = 'div',
}) => {
  const reducedMotion = useReducedMotion();
  const MotionTag = REVEAL_TAGS[as as RevealTagName] ?? REVEAL_TAGS.div;

  const variants = useMemo<Variants>(() => {
    const source = reducedMotion ? FADE_ONLY : createRevealVariants(variant, { distance, duration });
    const target = source.visible as TargetAndTransition;
    const baseTransition = target.transition as Transition | undefined;

    const visible: TargetAndTransition = { ...target };
    if (baseTransition) {
      visible.transition = delay > 0 ? { ...baseTransition, delay } : baseTransition;
    }

    return { hidden: source.hidden, visible };
  }, [reducedMotion, variant, distance, duration, delay]);

  const viewportPreset = useMemo(
    () => (once ? viewportOnce(amount) : viewportRepeat(amount)),
    [once, amount],
  );

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewportPreset}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
};

export interface MaskRevealProps {
  children: ReactNode;
  /** Delay in seconds before the mask lifts. */
  delay?: number;
  /** Animation duration. */
  duration?: number;
  /** Intersection threshold (0–1) before triggering. */
  amount?: number;
  /** Whether the reveal plays only once or replays on re-entry (default). */
  once?: boolean;
  /** Applied to the overflow-hidden mask wrapper. */
  className?: string;
  /** Applied to the animated inner element. */
  innerClassName?: string;
  /** Semantic tag for the mask wrapper. Defaults to `div`. */
  as?: keyof HTMLElementTagNameMap;
}

/**
 * Mask reveal — content is clipped inside an overflow-hidden container and
 * translated up as the mask "opens". Ideal for headings and labels.
 * Degrades to a fast opacity fade for reduced-motion visitors.
 */
export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  delay = 0,
  duration = DURATION.slow,
  amount = 0.25,
  once = false,
  className,
  innerClassName,
  as = 'div',
}) => {
  const reducedMotion = useReducedMotion();

  const variants = useMemo<Variants>(() => {
    if (reducedMotion) return FADE_ONLY;
    return {
      hidden: { y: '110%' },
      visible: {
        y: '0%',
        transition: { duration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
      },
    };
  }, [reducedMotion, duration, delay]);

  const viewportPreset = useMemo(
    () => (once ? viewportOnce(amount) : viewportRepeat(amount)),
    [once, amount],
  );

  const Outer = as as 'div';

  return (
    <Outer className={`overflow-hidden ${className ?? ''}`}>
      <motion.span
        className={`block ${innerClassName ?? ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={viewportPreset}
        variants={variants}
      >
        {children}
      </motion.span>
    </Outer>
  );
};