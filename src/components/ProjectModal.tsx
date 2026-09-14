import React, { useEffect, useRef } from 'react';
import type { Project } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { splitMetricSegments } from '../utils/bidi';
import { X, CheckCircle2, ArrowRight, ExternalLink, GitBranch } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { EASE_STANDARD } from '../motion';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t, isRtl } = useLanguage();
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Dialog lifecycle: focus management (trap + restore), ESC to close,
  // and scroll-lock with preservation of the previous scroll state.
  useEffect(() => {
    if (!project) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    previouslyFocusedRef.current = previouslyFocused;

    const root = dialogRef.current;
    // Move focus into the dialog (tabIndex={-1} makes it focusable).
    root?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !root) return;

      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('hidden'));

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  const title = isRtl ? project.titleAr : project.titleEn;
  const subtitle = isRtl ? project.subtitleAr : project.subtitleEn;
  const desc = isRtl ? project.descAr : project.descEn;
  const problem = isRtl ? project.problemAr : project.problemEn;
  const solution = isRtl ? project.solutionAr : project.solutionEn;
  const features = isRtl ? project.featuresAr : project.featuresEn;
  const metrics = isRtl ? project.metricsAr : project.metricsEn;
  const architecture = isRtl ? project.architectureAr : project.architectureEn;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex justify-center p-4 sm:p-6 lg:p-8 bg-black/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.3, ease: EASE_STANDARD }}
        className="relative w-full max-w-4xl rounded-2xl bg-[var(--bg-card-solid)] border border-[var(--border-strong)] p-6 sm:p-10 shadow-2xl my-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 w-11 h-11 flex items-center justify-center p-0 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Pill */}
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] text-[var(--accent-cyan)] text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <span>{project.category.toUpperCase()} PROJECT</span>
        </div>

        {/* Title */}
        <h3
          id="project-modal-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[var(--text-heading)] mb-2"
        >
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[var(--accent-cyan)] font-mono mb-6">
          {subtitle}
        </p>

        {/* Metrics Banner */}
        {metrics && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs mb-6 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-semibold">
              {splitMetricSegments(metrics).map((seg, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="mx-1.5 opacity-60">·</span>}
                  {seg.number ? (
                    <>
                      <bdi dir="ltr">{seg.number}</bdi>
                      {' '}
                      {seg.text}
                    </>
                  ) : (
                    seg.text
                  )}
                </React.Fragment>
              ))}
            </span>
          </div>
        )}

        {/* Description & Details */}
        <div className="space-y-6 text-sm text-[var(--text-secondary)]">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">
              {t.projects.modalOverview}
            </h4>
            <p className="leading-relaxed">{desc}</p>
          </div>

          {problem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                <h5 className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-2 font-bold">
                  {t.projects.modalChallenge}
                </h5>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{problem}</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                <h5 className="text-xs font-mono uppercase tracking-wider text-emerald-500 mb-2 font-bold">
                  {t.projects.modalSolution}
                </h5>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{solution}</p>
              </div>
            </div>
          )}

          {/* Architecture Flow Pills if available */}
          {architecture && architecture.length > 0 && (
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">
                {t.projects.modalPipeline}
              </h4>
              <div className="flex flex-wrap gap-2 items-center">
                {architecture.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-accent)] text-xs font-mono text-[var(--accent-cyan)] font-medium">
                      {step}
                    </span>
                    {idx < architecture.length - 1 && (
                      <span className="text-[var(--text-muted)] text-xs font-mono">{isRtl ? '←' : '→'}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Key Features Bullet Points */}
          {features && features.length > 0 && (
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">
                {t.projects.modalHighlights}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[var(--text-secondary)]">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-cyan)] mt-0.5 shrink-0 rtl:rotate-180" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies Stack */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">
              {t.projects.modalStack}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tName, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-cyan)]"
                >
                  {tName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 min-h-11 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-heading)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.projects.liveDemo}</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 min-h-11 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-heading)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse whitespace-nowrap"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{t.projects.sourceCode}</span>
                </a>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="px-6 py-1.5 min-h-11 rounded-xl bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            {t.projects.closeModal}
          </button>
        </div>
      </m.div>
    </m.div>
  );
};
