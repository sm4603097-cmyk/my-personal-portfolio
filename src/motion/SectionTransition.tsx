import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Variants } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from './transitions';
import { SectionEntrance } from './SectionEntrance';
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
 * continuous journey rather than a series of independent entrances. Renders
 * statically on phones and for reduced-motion visitors (SectionEntrance).
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  distance = 18,
  amount = 0.15,
  once = false,
  className,
}) => {
  const variants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_PREMIUM } },
    }),
    [distance],
  );

  const viewportPreset = useMemo(
    () => (once ? viewportOnce(amount) : viewportRepeat(amount)),
    [once, amount],
  );

  return (
    <SectionEntrance
      initial="hidden"
      whileInView="visible"
      viewport={viewportPreset}
      variants={variants}
      className={className}
    >
      {children}
    </SectionEntrance>
  );
};