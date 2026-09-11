// Preset motion configurations reused across sections and primitives.
// These keep scroll-trigger amounts and reveal geometry consistent.

export interface ViewportPreset {
  once: boolean;
  amount: number;
}

/** Strict reveal: requires 25% visible — used for section headers. */
export const VIEWPORT_HEADER: ViewportPreset = { once: true, amount: 0.25 };

/** Standard reveal: 20% visible. */
export const VIEWPORT_STANDARD: ViewportPreset = { once: true, amount: 0.2 };

/** Laid-back reveal: 10% visible — used for grids and tall blocks. */
export const VIEWPORT_LAIDBACK: ViewportPreset = { once: true, amount: 0.1 };

/** Very permissive: 5% visible — used for cards that scroll lazily. */
export const VIEWPORT_PERMISSIVE: ViewportPreset = { once: true, amount: 0.05 };

export const viewportOnce = (amount: number): ViewportPreset => ({ once: true, amount });

/** Viewport trigger that replays when re-entering (does NOT disconnect after first trigger). */
export const viewportRepeat = (amount: number): ViewportPreset => ({ once: false, amount });

/** Default reveal offsets by intent — desktop > tablet > mobile handled in primitives. */
export const REVEAL_DISTANCE = {
  eyebrow: 8,
  heading: 22,
  body: 16,
  card: 24,
} as const;

/** Subtle, restrained parallax delta in pixels. */
export const PARALLAX_DEFAULT = 24;
export const PARALLAX_TABLET = 12;
export const PARALLAX_MOBILE = 0;