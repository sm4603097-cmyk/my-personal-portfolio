import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from './transitions';
import { useIsRtl } from './hooks';
import { viewportOnce } from './presets';

export interface DrawLineProps {
  /** Vertical lines draw top→bottom; horizontal lines draw from the reading start. */
  orientation?: 'vertical' | 'horizontal';
  /** Run duration. */
  duration?: number;
  /** Delay before drawing starts. */
  delay?: number;
  /** Intersection threshold (0–1) before triggering. */
  amount?: number;
  className?: string;
}

/**
 * A line that progressively draws itself in view. Transform-only (scaleY /
 * scaleX) with a logical RTL-aware origin, so it never triggers layout.
 */
export const DrawLine: React.FC<DrawLineProps> = ({
  orientation = 'vertical',
  duration = DURATION.medium,
  delay = 0,
  amount = 0.2,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const isRtl = useIsRtl();

  const variants = useMemo<Variants>(() => {
    if (reducedMotion) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { duration: 0.1 } },
      };
    }
    const verticalStyle = {
      hidden: { scaleY: 0 },
      visible: {
        scaleY: 1,
        transition: { duration, ease: EASE_PREMIUM, delay },
      },
    } as const;
    const horizontalStyle = {
      hidden: { scaleX: 0 },
      visible: {
        scaleX: 1,
        transition: { duration, ease: EASE_PREMIUM, delay },
      },
    } as const;
    return orientation === 'vertical' ? (verticalStyle as unknown as Variants) : (horizontalStyle as unknown as Variants);
  }, [reducedMotion, orientation, duration, delay]);

  return (
    <motion.div
      style={{
        transformOrigin: orientation === 'vertical' ? 'top center' : isRtl ? 'right center' : 'left center',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce(amount)}
      variants={variants}
      className={className}
      aria-hidden="true"
    />
  );
};