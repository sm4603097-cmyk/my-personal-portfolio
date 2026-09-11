// Pure helpers shared by motion primitives. No DOM access — safe anywhere.

/** Clamp a number between min and max. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export interface ParsedNumericValue {
  raw: string;
  /** Numeric head of the value, or null when the value is non-numeric. */
  number: number | null;
  /** Trailing string after the numeric head (e.g. "+", "/", "%"). */
  suffix: string;
  /** Leading string before the numeric head (e.g. "$"). */
  prefix: string;
}

/**
 * Split a value like "30+", "441 / 441" or "$12k" into a countable number and
 * its surrounding decoration. Non-numeric values ("Native", "Zero-Trust")
 * return `number: null` and should render statically.
 */
export const parseNumericValue = (value: string | number): ParsedNumericValue => {
  if (typeof value === 'number') {
    const numeric = isFinite(value) ? value : null;
    return { raw: String(value), number: numeric, suffix: '', prefix: '' };
  }

  let rest = value.trim();
  let prefix = '';

  // Preserve a leading "+" as a display marker (Arabic renders "+30").
  if (rest.startsWith('+')) {
    prefix = '+';
    rest = rest.slice(1).trim();
  }

  const match = rest.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return { raw: value, number: null, suffix: '', prefix: value };

  prefix = `${prefix}${match[1]}`;
  const numeric = parseFloat(match[2].replace(',', '.'));
  const suffix = match[3].trim();
  if (!isFinite(numeric)) return { raw: value, number: null, suffix: '', prefix: value };

  return { raw: value, number: numeric, suffix, prefix };
};

/** Format a count using the visitor's locale with grouped digits. */
export const formatCount = (
  value: number,
  locale: string,
  decimals = 0,
): string => {
  const rounded = Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals > 0 ? decimals : 0,
      maximumFractionDigits: decimals,
    }).format(rounded);
  } catch {
    return String(rounded);
  }
};