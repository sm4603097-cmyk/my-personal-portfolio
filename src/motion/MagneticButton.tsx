import { useEffect, useRef, type ReactNode } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { EASE_STANDARD } from './transitions';
import { useIsFinePointer } from './hooks';

// Pre-created m tags (stable across renders, Fast-Refresh safe).
const MotionA = m.create('a');
const MotionButton = m.create('button');

export interface MagneticButtonProps {
  children: ReactNode;
  /** Render as an anchor or a button. */
  as?: 'a' | 'button';
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler;
  id?: string;
  ariaLabel?: string;
  /** Max travel in px. Kept deliberately subtle. */
  strength?: number;
  className?: string;
}

/**
 * A subtle magnetic CTA. The element leans a fraction toward the pointer and
 * settles back on leave. Purely cosmetic (transform-only), disabled for
 * reduced-m visitors and coarse-pointer devices, and deliberately capped
 * at a small travel so buttons never feel unstable.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  as = 'a',
  href,
  target,
  rel,
  type = 'button',
  onClick,
  id,
  ariaLabel,
  strength = 5,
  className,
}) => {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useIsFinePointer();

  const enabled = !reducedMotion && finePointer && strength > 0;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let rect = el.getBoundingClientRect();

    const handleEnter = () => {
      rect = el.getBoundingClientRect();
    };

    const handleMove = (event: PointerEvent) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const factor = Math.min(1, distance / 60);
      x.set(dx * factor * 0.25);
      y.set(dy * factor * 0.25);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    el.addEventListener('pointerenter', handleEnter, { passive: true });
    el.addEventListener('pointermove', handleMove, { passive: true });
    el.addEventListener('pointerleave', handleLeave, { passive: true });
    return () => {
      el.removeEventListener('pointerenter', handleEnter);
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [enabled, strength, x, y]);

  const MotionTag = as === 'a' ? MotionA : MotionButton;

  return (
    <MotionTag
      ref={ref}
      href={as === 'a' ? href : undefined}
      target={as === 'a' ? target : undefined}
      rel={as === 'a' ? rel : undefined}
      type={as === 'button' ? type : undefined}
      onClick={onClick}
      id={id}
      aria-label={ariaLabel}
      style={{ x: enabled ? sx : 0, y: enabled ? sy : 0 }}
      whileTap={enabled ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.25, ease: EASE_STANDARD }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};