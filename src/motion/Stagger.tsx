import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { createStaggerVariants, createRevealVariants, NO_MOTION_CONTAINER } from './variants';
import { DURATION } from './transitions';
import { viewportOnce, viewportRepeat } from './presets';

// Pre-created motion tags (stable across renders, Fast-Refresh safe).
const STAGGER_TAGS = {
  div: motion.create('div'),
  li: motion.create('li'),
  span: motion.create('span'),
  section: motion.create('section'),
};
type StaggerTagName = keyof typeof STAGGER_TAGS;

export interface StaggerContainerProps {
  children: ReactNode;
  /** Gap (seconds) between successive items. */
  stagger?: number;
  /** Initial delay before the first item animates. */
  delayChildren?: number;
  /** Intersection threshold (0–1) before the group triggers. */
  amount?: number;
  /** Whether the reveal plays only once (default) or replays on re-entry. */
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Semantic tag. Defaults to `div`. */
  as?: keyof HTMLElementTagNameMap;
}

/**
 * Orchestration container. Children that render `StaggerItem` (or use the
 * `visible`/`hidden` variants) enter sequentially.
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  stagger = DURATION.stagger,
  delayChildren = 0.1,
  amount = 0.15,
  once = true,
  className,
  style,
  as = 'div',
}) => {
  const reducedMotion = useReducedMotion();
  const MotionTag = STAGGER_TAGS[as as StaggerTagName] ?? STAGGER_TAGS.div;

  const variants = useMemo<Variants>(
    () => (reducedMotion ? NO_MOTION_CONTAINER : createStaggerVariants(stagger, delayChildren)),
    [reducedMotion, stagger, delayChildren],
  );

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

export interface StaggerItemProps {
  children: ReactNode;
  /** Entrance style for the item. Defaults to `fade-up`. */
  variant?: 'fade-up' | 'scale';
  /** Travel distance in px. */
  distance?: number;
  className?: string;
  /** Semantic tag. Defaults to `div`. */
  as?: keyof HTMLElementTagNameMap;
}

/**
 * A child entrance. Must live inside a `StaggerContainer` (or any variants
 * orchestrator) to inherit the stagger timing.
 */
export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  variant = 'fade-up',
  distance = 24,
  className,
  as = 'div',
}) => {
  const reducedMotion = useReducedMotion();
  const MotionTag = STAGGER_TAGS[as as StaggerTagName] ?? STAGGER_TAGS.div;

  const variants = useMemo<Variants>(() => {
    if (reducedMotion) return NO_MOTION_CONTAINER;
    return createRevealVariants(variant, { distance });
  }, [reducedMotion, variant, distance]);

  return (
    <MotionTag variants={variants} className={className}>
      {children}
    </MotionTag>
  );
};