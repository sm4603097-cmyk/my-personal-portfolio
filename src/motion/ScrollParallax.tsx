import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useIsMobile } from './hooks';

export interface ScrollParallaxProps {
  children: ReactNode;
  /** Max vertical travel in px on desktop. */
  distance?: number;
  /** Class applied to the motion wrapper. */
  className?: string;
}

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 768;

/**
 * Restrained scroll-linked vertical parallax built on motion values (no
 * scroll listeners, no React state). Reduced-motion users and mobile
 * viewports (<640px) get no parallax; tablets get half strength.
 */
export const ScrollParallax: React.FC<ScrollParallaxProps> = ({
  children,
  distance = 24,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const isTablet = useIsMobile(TABLET_BREAKPOINT);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  let strength = distance;
  if (reducedMotion || isMobile) strength = 0;
  else if (isTablet) strength = Math.max(0, Math.round(distance * 0.5));

  const y: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};