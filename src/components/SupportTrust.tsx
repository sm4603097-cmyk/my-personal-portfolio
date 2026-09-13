import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, ExternalLink, BadgeCheck } from 'lucide-react';
import { SECTION_REVEAL, CARD_STAGGER as STAGGER, SLIDE_UP as PLATFORM_ITEM, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { SectionHeader, EASE_STANDARD, useIsFinePointer } from '../motion';
import { siteConfig } from '../data/siteConfig';

export const SupportTrust: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const finePointer = useIsFinePointer();

  const reveal = reducedMotion ? NO_MOTION_CONTAINER : SECTION_REVEAL;
  const stagger = reducedMotion ? NO_MOTION_CONTAINER : STAGGER;
  const item = reducedMotion ? FADE_ONLY : PLATFORM_ITEM;
  const canLift = !reducedMotion && finePointer;

  return (
    <section id="trust" className="py-24 sm:py-28 theme-bg-page relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={t.trust.badge}
          title={t.trust.title}
          description={t.trust.subtitle}
          className="mb-12"
        />

        {/* Commitment Statement Card */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="rounded-2xl border border-[var(--border-accent)] p-6 sm:p-10 mb-12 relative overflow-hidden bg-[var(--bg-card)] shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[var(--accent-cyan)]">
                  "{t.trust.quote1}"
                </span>
                <span className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[var(--text-heading)]">
                  "{t.trust.quote2}"
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                {t.trust.guaranteeDesc}
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-2)] border border-emerald-500/30 text-center w-full shadow-md">
                <BadgeCheck className="w-9 h-9 text-emerald-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-[var(--text-heading)] font-display">
                  {t.trust.engineeringBacking}
                </div>
                <div className="text-xs text-[var(--text-muted)] font-mono mt-1">
                  {t.trust.postDeliverySupport}
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Verified Freelance Platforms Grid */}
        <div className="mb-12">
          <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-[var(--text-muted)] mb-5 font-bold">
            {t.trust.platformsTitle}
          </h3>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {t.trust.platforms.map((plat, idx) => {
              const isLink = plat.link.length > 0;
              const motionProps = {
                variants: item,
                className: `editorial-card p-5 sm:p-6 hover:border-[var(--accent-cyan)] transition-all group flex flex-col justify-between ${isLink ? 'cursor-pointer' : ''}`,
                id: `platform-${idx}`,
              };
              const cardContent = (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-base sm:text-lg font-bold font-display text-[var(--text-heading)] group-hover:text-[var(--accent-cyan)] transition-colors">
                        {plat.name}
                      </span>
                      <ExternalLink className={`w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors ${isLink ? '' : 'opacity-40'}`} />
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-mono mb-4">
                      {plat.role}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{plat.badge}</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </>
              );
              return isLink ? (
                <motion.a
                  key={idx}
                  {...motionProps}
                  href={plat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={canLift ? { y: -3, transition: { duration: 0.25, ease: EASE_STANDARD } } : undefined}
                  whileTap={canLift ? { scale: 0.99 } : undefined}
                >
                  {cardContent}
                </motion.a>
              ) : (
                <motion.div key={idx} {...motionProps}>
                  {cardContent}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* GitHub Engineering Statement */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-11 h-11 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-cyan)] shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-heading)] font-display">
                {t.trust.githubHeadline}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                {t.trust.githubSub}
              </p>
            </div>
          </div>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] text-xs font-mono text-[var(--text-heading)] font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer shrink-0"
          >
            <span>{t.trust.exploreRepos}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
