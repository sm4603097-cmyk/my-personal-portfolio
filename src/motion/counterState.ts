// Pure, DOM-free logic for AnimatedCounter. Kept outside the component so the
// counter fix — a measurable observer target and correct enter/leave/re-enter
// replay — is testable in Node without a browser environment.
//
// The component imports this module, so these functions are the single source
// of truth for both the rendered text and the frame behavior.

import { formatCount, parseNumericValue } from './utils.ts';

export interface CounterStateConfig {
  /** Overrides how a current count is rendered. */
  format?: (current: number, final: number) => string;
  /** BCP-47 tag used for digit grouping. */
  locale?: string;
  /** Decimal places to render. */
  decimals?: number;
}

export type CounterBehavior = 'animate' | 'reset' | 'static-final';

/**
 * Decide the current frame behavior:
 * - reduced motion → immediately render the final, static value
 * - out of view → reset to the zero state (so re-entry replays 0 → target)
 * - in view → animate 0 → target
 *
 * Matches the Phase 4A replay semantics: enter animates up, leave resets to
 * zero, re-enter animates up again.
 */
export const counterBehavior = (
  reducedMotion: boolean,
  inView: boolean,
): CounterBehavior => {
  if (reducedMotion) return 'static-final';
  return inView ? 'animate' : 'reset';
};

/** The zero/start state, e.g. "0+". Used for the initial paint and resets. */
export const counterStartText = (
  value: string | number,
  config: CounterStateConfig = {},
): string => {
  const parsed = parseNumericValue(value);
  if (parsed.number === null) return parsed.raw;
  const { format, locale = 'en-US', decimals = 0 } = config;
  return format
    ? format(0, parsed.number)
    : `${parsed.prefix}${formatCount(0, locale, decimals)}${parsed.suffix}`;
};

/** Fully rendered target text, e.g. "30+". Static / reduced-motion value. */
export const counterFinalText = (
  value: string | number,
  config: CounterStateConfig = {},
): string => {
  const parsed = parseNumericValue(value);
  if (parsed.number === null) return parsed.raw;
  const { format, locale = 'en-US', decimals = 0 } = config;
  return format
    ? format(parsed.number, parsed.number)
    : `${parsed.prefix}${formatCount(parsed.number, locale, decimals)}${parsed.suffix}`;
};