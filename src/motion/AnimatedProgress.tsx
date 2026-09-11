import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from './transitions';
import { useIsRtl } from './hooks';
import { viewportOnce } from './presets';

export interface AnimatedProgressProps {
  /** Fraction 0–1 of the track that should fill (use real existing data). */
  value: number;
  /** Optional short label rendered above the bar. */
  label?: ReactNode;
  /** Optional value marker revealed once the bar draws. */
  valueLabel?: ReactNode;
  /** Run duration. */
  duration?: number;
  /** Delay before the bar draws. */
  delay?: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  /** Height utility for the track, e.g. "h-1". Defaults to `h-1`. */
  heightClassName?: string;
}

/**
 * A GPU-friendly progress bar. The fill uses `scaleX` from the track start
 * (correct in both LTR and RTL) instead of layout-heavy width animation.
 * Sequence: label → bar draws → valueLabel fades in.
 */
export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  label,
  valueLabel,
  duration = DURATION.medium,
  delay = 0,
  className,
  trackClassName,
  barClassName,
  heightClassName = 'h-1',
}) => {
  const reducedMotion = useReducedMotion();
  const isRtl = useIsRtl();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce(0.5));
  const scaleX = useMotionValue(reducedMotion ? clampFraction(value) : 0);
  const [valueRevealed, setValueRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      scaleX.set(clampFraction(value));
      return;
    }
    if (!inView) return;

    const controls = animate(scaleX, clampFraction(value), {
      duration,
      ease: EASE_PREMIUM,
      delay,
    });

    const revealTimer = window.setTimeout(
      () => setValueRevealed(true),
      (delay + duration * 0.85) * 1000,
    );

    return () => {
      controls.stop();
      window.clearTimeout(revealTimer);
    };
  }, [reducedMotion, inView, value, duration, delay, scaleX]);

  return (
    <div ref={ref} className={className}>
      {label && <div className="mb-1.5">{label}</div>}
      <div className={`w-full ${heightClassName} overflow-hidden rounded-full ${trackClassName ?? ''}`}>
        <motion.div
          className={`h-full rounded-full ${barClassName ?? ''}`}
          style={{
            scaleX,
            transformOrigin: isRtl ? 'right center' : 'left center',
          }}
        />
      </div>
      {valueLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: reducedMotion || valueRevealed ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {valueLabel}
        </motion.div>
      )}
    </div>
  );
};

const clampFraction = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};