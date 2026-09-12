import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from './transitions';
import { NO_MOTION_CONTAINER } from './variants';
import { viewportOnce, viewportRepeat } from './presets';

export interface SectionTransitionProps {
  children: ReactNode;
  /** Extra vertical travel in px. */
  distance?: number;
  /** Intersection threshold (0–1). */
  amount?: number;
  /** Whether the reveal plays only once or replays on re-entry (default). */
  once?: boolean;
  className?: string;
}

/**
 * A soft, shared "arrival" wrapper used between connected moments of a page.
 * Deliberately subtle (opacity + small translation) so sections feel like one
 * continuous journey rather than a series of independent entrances.
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  distance = 18,
  amount = 0.15,
  once = false,
  className,
}) => {
  const reducedMotion = useReducedMotion();

  const variants = useMemo<Variants>(
    () =>
      reducedMotion
        ? NO_MOTION_CONTAINER
        : {
            hidden: { opacity: 0, y: distance },
            visible: { opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_PREMIUM } },
          },
    [reducedMotion, distance],
  );

  const viewportPreset = useMemo(
    () => (once ? viewportOnce(amount) : viewportRepeat(amount)),
    [once, amount],
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportPreset}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};