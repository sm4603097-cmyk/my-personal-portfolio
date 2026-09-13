import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { animate, m, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from './transitions';
import { useIsRtl } from './hooks';

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
 * Sequence: label → bar draws → valueLabel fades in. The bar resets when it
 * leaves the viewport and redraws on re-entry.
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
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const scaleX = useMotionValue(reducedMotion ? clampFraction(value) : 0);
  const valueOpacity = useMotionValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      scaleX.set(clampFraction(value));
      valueOpacity.set(1);
      return;
    }

    // Out of view — reset so the bar redraws from empty on re-entry.
    if (!inView) {
      scaleX.set(0);
      valueOpacity.set(0);
      return;
    }

    const controls = animate(scaleX, clampFraction(value), {
      duration,
      ease: EASE_PREMIUM,
      delay,
    });

    const labelControls = animate(valueOpacity, 1, {
      duration: 0.3,
      ease: EASE_PREMIUM,
      delay: delay + duration * 0.85,
    });

    return () => {
      controls.stop();
      labelControls.stop();
    };
  }, [reducedMotion, inView, value, duration, delay, scaleX, valueOpacity]);

  return (
    <div ref={ref} className={className}>
      {label && <div className="mb-1.5">{label}</div>}
      <div className={`w-full ${heightClassName} overflow-hidden rounded-full ${trackClassName ?? ''}`}>
        <m.div
          className={`h-full rounded-full ${barClassName ?? ''}`}
          style={{
            scaleX,
            transformOrigin: isRtl ? 'right center' : 'left center',
          }}
        />
      </div>
      {valueLabel && (
        <m.div style={{ opacity: valueOpacity }}>{valueLabel}</m.div>
      )}
    </div>
  );
};

const clampFraction = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};