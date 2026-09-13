// Preset motion configurations reused across sections and primitives.
// These keep scroll-trigger amounts and reveal geometry consistent.

export interface ViewportPreset {
  once: boolean;
  amount: number;
}

// Scroll-triggered entrance animations default to replaying whenever the
// element re-enters the viewport (and reverting to their initial state on
// leave). Pass `viewportOnce(...)` explicitly for the rare one-shot case.

export const viewportOnce = (amount: number): ViewportPreset => ({ once: true, amount });

/** Viewport trigger that replays when re-entering (does NOT disconnect after first trigger). */
export const viewportRepeat = (amount: number): ViewportPreset => ({ once: false, amount });