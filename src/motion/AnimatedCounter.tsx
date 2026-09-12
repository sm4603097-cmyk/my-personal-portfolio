import { useEffect, useMemo, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { animate } from 'framer-motion';
import { EASE_PREMIUM } from './transitions';
import { formatCount, parseNumericValue } from './utils';

export interface AnimatedCounterProps {
  /**
   * The REAL data value — a number or a decorated string such as "30+",
   * "441 / 441". Non-numeric values ("Native") render statically.
   */
  value: string | number;
  /** Total run duration. */
  duration?: number;
  /** Delay before counting starts. */
  delay?: number;
  /** Decimal places to render. */
  decimals?: number;
  /** Fully overrides how the current count is rendered. */
  format?: (current: number, final: number) => string;
  /**
   * Overrides the static text shown for non-numeric or reduced-motion states.
   * Defaults to the parsed/rendered final value.
   */
  staticText?: string;
  className?: string;
  /** BCP-47 tag used for digit grouping. */
  locale?: string;
}

/**
 * Animates a metric from 0 toward its real value each time it scrolls into
 * view. Counter resets to its start value when it leaves the viewport so it
 * replays 0 → value on re-entry, uses transform/opacity-free numeric tweening
 * directly on the text node (no React re-render per frame), and renders the
 * final value immediately for reduced-motion visitors.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.1,
  delay = 0,
  decimals = 0,
  format,
  staticText,
  className,
  locale = 'en-US',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: false, amount: 0.6 });

  const parsed = parseNumericValue(value);
  const finalValue = parsed.number;

  // Fully rendered final text for static / reduced-motion states.
  const finalText = useMemo<string>(() => {
    if (finalValue === null) return parsed.raw;
    if (format) return format(finalValue, finalValue);
    return `${parsed.prefix}${formatCount(finalValue, locale, decimals)}${parsed.suffix}`;
  }, [finalValue, format, parsed.raw, parsed.prefix, parsed.suffix, locale, decimals]);

  useEffect(() => {
    const el = ref.current;
    if (!el || finalValue === null) return;

    // Fully rendered start text ("0 …") used for the initial paint and resets.
    const startText =
      format ? format(0, finalValue)
      : `${parsed.prefix}${formatCount(0, locale, decimals)}${parsed.suffix}`;

    // Reduced motion — jump straight to the final value and stay static.
    if (reducedMotion) {
      el.textContent = staticText ?? finalText;
      return;
    }

    // Out of view — restore the start value so re-entry replays from 0.
    if (!inView) {
      el.textContent = startText;
      return;
    }

    let formatter: Intl.NumberFormat | null = null;
    try {
      formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals > 0 ? decimals : 0,
        maximumFractionDigits: decimals,
      });
    } catch {
      // fallback: no formatter
    }

    el.textContent = startText;

    const controls = animate(0, finalValue, {
      duration,
      ease: EASE_PREMIUM,
      delay,
      onUpdate: (current) => {
        if (!el) return;
        el.textContent = format
          ? format(current, finalValue)
          : `${parsed.prefix}${formatter ? formatter.format(Math.round((current + Number.EPSILON) * 10 ** decimals) / 10 ** decimals) : String(Math.round(current))}${parsed.suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, reducedMotion, finalValue, duration, delay, format, parsed.prefix, parsed.suffix, locale, decimals, staticText, finalText]);

  // Non-numeric values render their source string directly.
  if (finalValue === null) {
    return <span ref={ref} className={className}>{parsed.raw}</span>;
  }

  return <span ref={ref} className={className} aria-label={staticText ?? finalText} />;
};