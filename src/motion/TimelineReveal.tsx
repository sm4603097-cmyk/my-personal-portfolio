import { Children, useMemo } from 'react';
import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from './transitions';
import { createStaggerVariants, NO_MOTION_CONTAINER } from './variants';
import { useIsRtl } from './hooks';
import { viewportOnce, viewportRepeat } from './presets';

const ACCENT_MARKER = {
  default: 'bg-transparent border border-[var(--border-strong)]',
  reached: 'bg-[var(--accent-cyan)]/50 border border-[var(--accent-cyan)]/60',
  active:
    'bg-[var(--accent-cyan)] border border-[var(--accent-cyan)] shadow-[0_0_12px_-2px_var(--accent-cyan)]',
};

export interface TimelineRevealProps {
  children: ReactNode;
  /** Layout axis for the connector. Defaults to `vertical`. */
  direction?: 'vertical' | 'horizontal';
  /** Container spacing utilities (column layout for vertical timelines). */
  className?: string;
  /** Classes for the base connector line (position + width + color). */
  lineClassName?: string;
  /** Fraction-based progress drive: the overlay fill follows selected index. */
  activeIndex?: number | null;
  /** Intersection threshold (0–1). */
  amount?: number;
  /** Whether the reveal plays only once or replays on re-entry (default). */
  once?: boolean;
}

/**
 * A reusable timeline that draws its connector progressively, staggers its
 * nodes on reveal, and (optionally) grows an accent fill toward the active
 * step — communicating engineering progression, not game-like m.
 */
export const TimelineReveal: React.FC<TimelineRevealProps> = ({
  children,
  direction = 'vertical',
  className,
  lineClassName,
  activeIndex = null,
  amount = 0.1,
  once = false,
}) => {
  const reducedMotion = useReducedMotion();
  const isRtl = useIsRtl();
  const count = useMemo(() => Children.count(children), [children]);

  const containerVariants = useMemo<Variants>(
    () => (reducedMotion ? NO_MOTION_CONTAINER : createStaggerVariants(0.13, 0.15)),
    [reducedMotion],
  );

  const progress =
    activeIndex === null || count <= 1 ? 1 : Math.min(1, Math.max(0, activeIndex / (count - 1)));

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={once ? viewportOnce(amount) : viewportRepeat(amount)}
      variants={containerVariants}
      className={`relative ${className ?? ''}`}
    >
      {/* Base connector — draws itself progressively on reveal. */}
      <m.div
        aria-hidden="true"
        className={`pointer-events-none absolute ${
          direction === 'vertical'
            ? 'inset-y-0 start-[4px] w-[2px]'
            : 'inset-x-0 top-[4px] h-[2px]'
        } ${lineClassName ?? 'bg-[var(--border-subtle)]'}`}
        style={{
          transformOrigin: direction === 'vertical' ? 'top center' : isRtl ? 'right center' : 'left center',
        }}
        initial={reducedMotion ? { scaleX: 1, scaleY: 1 } : direction === 'vertical' ? { scaleY: 0 } : { scaleX: 0 }}
        whileInView={
          reducedMotion
            ? { scaleX: 1, scaleY: 1 }
            : direction === 'vertical'
              ? { scaleY: 1 }
              : { scaleX: 1 }
        }
        viewport={once ? viewportOnce(amount) : viewportRepeat(amount)}
        transition={{ duration: DURATION.medium, ease: EASE_PREMIUM }}
      />

      {/* Active-reach fill overlay. */}
      <m.div
        aria-hidden="true"
        className={`pointer-events-none absolute ${
          direction === 'vertical'
            ? 'inset-y-0 start-[4px] w-[2px]'
            : 'inset-x-0 top-[4px] h-[2px]'
        } bg-[var(--accent-cyan)]/70`}
        style={{
          transformOrigin: direction === 'vertical' ? 'top center' : isRtl ? 'right center' : 'left center',
        }}
        animate={{
          ...(direction === 'vertical' ? { scaleY: progress } : { scaleX: progress }),
        }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
      />

      <div className={direction === 'vertical' ? 'flex flex-col' : 'flex'}>
        {children}
      </div>
    </m.div>
  );
};

export interface TimelineNodeProps {
  /** 0-based index of this node. */
  index: number;
  /** Whether this node is the currently active step. */
  active?: boolean;
  /** Whether this node has already been passed. */
  reached?: boolean;
  /** Extra wrapper spacing, e.g. trailing margin between steps. */
  className?: string;
  /** Marker dot styles during each state. */
  markerClassName?: string;
  children: ReactNode;
}

/**
 * A single timeline node: a marker on the connector + the node content.
 * Must be used inside `TimelineReveal`.
 */
export const TimelineNode: React.FC<TimelineNodeProps> = ({
  index,
  active = false,
  reached = false,
  className,
  markerClassName,
  children,
}) => {
  const reducedMotion = useReducedMotion();

  const itemVariants = useMemo<Variants>(() => {
    if (reducedMotion) return NO_MOTION_CONTAINER;
    return {
      hidden: { opacity: 0, y: 14 },
      visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_PREMIUM } },
    };
  }, [reducedMotion]);

  const markerState = active ? ACCENT_MARKER.active : reached ? ACCENT_MARKER.reached : ACCENT_MARKER.default;

  return (
    <m.div variants={itemVariants} data-index={index} className={`relative ${className ?? ''}`}>
      {/* Node marker aligned with the connector rail. */}
      <m.span
        aria-hidden="true"
        className={`absolute start-0 top-1 z-10 size-[10px] rounded-full ${markerState} ${markerClassName ?? ''}`}
        animate={reducedMotion ? { scale: 1 } : { scale: active ? 1.2 : 1 }}
        transition={{ duration: 0.3, ease: EASE_PREMIUM }}
        style={{
          boxShadow: active && !reducedMotion ? '0 0 14px -2px var(--accent-cyan)' : undefined,
        }}
      />
      <div className="min-w-0 ps-7">{children}</div>
    </m.div>
  );
};