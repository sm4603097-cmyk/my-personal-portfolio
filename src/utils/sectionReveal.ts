// Cross-cutting signal for IntersectionObserver-gated sections. A gated section
// has no layout until it mounts, so fixed/anchor navigation (navbar, hero CTAs)
// cannot rely on `document.getElementById(...)` alone — the target doesn't exist
// yet. Navigation calls `scrollToSection(id)` which reveals (mounts) the target
// before scrolling; sections subscribe here so they render the moment a reveal
// is requested for their anchor.
const revealed = new Set<string>();
const listeners = new Set<(id: string) => void>();

export const isSectionRevealed = (id: string): boolean => revealed.has(id);

export const revealSection = (id: string) => {
  if (revealed.has(id)) return;
  revealed.add(id);
  for (const listener of listeners) listener(id);
};

export const subscribeSectionReveal = (callback: (id: string) => void): (() => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

/**
 * Reveal (mount) the section carrying the given anchor id, then scroll to it.
 * A gated section mounts inside `<Suspense fallback={null}>`, so its anchor may
 * not be in the DOM the instant a reveal is requested — the chunk resolves
 * asynchronously first. We therefore poll for the element and scroll the moment
 * it appears, rather than gambling on a fixed delay.
 */
export const scrollToSection = (id: string, smooth = true) => {
  revealSection(id);

  const go = (element: Element, immediate: boolean) => {
    element.scrollIntoView({ behavior: immediate || !smooth ? 'auto' : 'smooth' });
  };

  const existing = document.getElementById(id);
  if (existing) {
    go(existing, false);
    return;
  }

  const timer = window.setInterval(() => {
    const element = document.getElementById(id);
    if (!element) return;
    window.clearInterval(timer);

    // The chunk only just resolved; the anchor exists now. Use an instant
    // jump: the target's geometry is stable because we skip the intermediate
    // gated sections (they never mount during an instant jump), so the scroll
    // cannot undershoot. A corrective pass after layout settles covers any
    // remaining drift.
    go(element, true);
    window.setTimeout(() => {
      const settled = document.getElementById(id);
      go(settled ?? element, false);
    }, 350);
  }, 25);
  // Safety valve: stop polling if the section never mounts.
  window.setTimeout(() => window.clearInterval(timer), 5000);
};