import type { ReactNode } from 'react';
import { DURATION } from './transitions';
import { Reveal, MaskReveal } from './Reveal';

export interface SectionHeaderProps {
  /** The uppercase eyebrow label (e.g. PROOF OF WORK). */
  eyebrow: string;
  /** Optional icon rendered inside the eyebrow pill. */
  eyebrowIcon?: ReactNode;
  /** Renders a live-ping dot inside the eyebrow pill. */
  live?: boolean;
  /** The section title — reveal via mask reveal. */
  title: string;
  /** Accent line beneath the title (cyan mono styling). */
  subtitle?: string;
  /** Supporting paragraph. */
  description?: string;
  /** Header alignment. Defaults to the reading start. */
  align?: 'start' | 'center';
  /** Wrapper spacing utilities (e.g. `mb-12`). */
  className?: string;
  /** Extra title size/weight utilities (overrides the default). */
  titleClassName?: string;
  /** Whether the reveal plays only once (default) or replays on re-entry. */
  once?: boolean;
}

const EYEBROW_PILL =
  'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] text-[var(--accent-cyan)] text-[11px] font-mono font-bold uppercase tracking-[0.18em]';

const TITLE_DEFAULT =
  'text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[var(--text-heading)] tracking-tight leading-tight';

/**
 * The canonical section header. Encodes the portfolio's reveal hierarchy:
 * eyebrow (subtle fade + lift) → heading (mask reveal) → subtitle (accent
 * fade-up) → description (delayed fade-up). Every section uses this to keep
 * the motion language coherent.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  eyebrowIcon,
  live = false,
  title,
  subtitle,
  description,
  align = 'start',
  className,
  titleClassName,
  once = false,
}) => {
  const isCentered = align === 'center';

  const dot = live ? (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
    </span>
  ) : (
    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" />
  );

  return (
    <div
      className={`flex flex-col items-start space-y-3 sm:space-y-4 ${
        isCentered ? 'items-center text-center' : ''
      } ${className ?? ''}`}
    >
      <Reveal variant="fade-up" distance={8} duration={0.45} amount={0.4} once={once}>
        <div className={EYEBROW_PILL}>
          {eyebrowIcon ?? dot}
          <span className="font-semibold">{eyebrow}</span>
        </div>
      </Reveal>

      <MaskReveal as="h2" duration={DURATION.slow} amount={0.4} once={once} className={titleClassName ?? TITLE_DEFAULT}>
        {title}
      </MaskReveal>

      {subtitle && (
        <Reveal variant="fade-up" distance={12} delay={0.1} duration={0.5} amount={0.4} once={once}>
          <p className="text-base sm:text-lg text-[var(--accent-cyan)] font-mono font-semibold">
            {subtitle}
          </p>
        </Reveal>
      )}

      {description && (
        <Reveal variant="fade-up" distance={16} delay={0.16} duration={0.5} amount={0.4} once={once}>
          <p
            className={`text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed ${
              isCentered ? 'mx-auto' : ''
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
};