import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { useIsMobile } from './hooks';

export interface SectionEntranceProps extends MotionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Scroll-reveal container. On phones (<=767px) and for reduced-motion visitors
 * it renders as a plain element: sections below the fold appear instantly
 * instead of paying for an IntersectionObserver callback + per-frame style
 * writes while the page is being scrolled (measured in Lighthouse
 * TBT / Style & Layout on throttled mobile). Desktop keeps the entrance.
 */
export const SectionEntrance: React.FC<SectionEntranceProps> = ({
  id,
  className,
  children,
  ...motionProps
}) => {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  if (reducedMotion || isMobile) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div id={id} className={className} {...motionProps}>
      {children}
    </m.div>
  );
};