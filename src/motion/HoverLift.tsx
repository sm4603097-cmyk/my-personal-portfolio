import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_STANDARD } from './transitions';
import { useIsFinePointer } from './hooks';

export interface HoverLiftProps {
  children: ReactNode;
  /** Vertical lift in px on hover. */
  lift?: number;
  /** Applied to the wrapper element. */
  className?: string;
}

/**
 * A restrained lift applied on hover. Automatically disabled for
 * reduced-motion visitors and for coarse-pointer (mostly touch) devices.
 */
export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  lift = 4,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const finePointer = useIsFinePointer();

  // Disabled: render children in a plain element so interactivity is untouched.
  if (reducedMotion || !finePointer) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -lift }}
      whileTap={{ y: Math.round(-lift * 0.4) }}
      transition={{ duration: 0.3, ease: EASE_STANDARD }}
      className={className}
    >
      {children}
    </motion.div>
  );
};