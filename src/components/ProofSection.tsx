import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Check, ArrowRight } from 'lucide-react';

import { SECTION_REVEAL, CARD_STAGGER, CARD_ITEM, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { AnimatedCounter, SectionHeader, SectionTransition } from '../motion';
import { scrollToSection } from '../utils/sectionReveal';

type FilterKey = 'all' | 'auth' | 'android' | 'security';

const FILTER_ITEM_IDS: Record<FilterKey, readonly string[]> = {
  all: ['projects', 'velocity', 'android', 'security'],
  auth: ['projects'],
  android: ['android'],
  security: ['security'],
};

export const ProofSection: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FilterKey>('all');

  const container = reducedMotion ? NO_MOTION_CONTAINER : CARD_STAGGER;
  const item = reducedMotion ? FADE_ONLY : CARD_ITEM;

  const visibleItems = t.proof.items.filter((item) =>
    FILTER_ITEM_IDS[activeTab].includes(item.id)
  );

  return (
    <section id="proof" className="py-24 sm:py-28 theme-bg-surface-1 relative overflow-hidden">
      {/* Section Divider Line */}
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Atmospheric Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 0%, var(--hero-glow-1) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <SectionHeader
          eyebrow={t.proof.badge}
          title={t.proof.title}
          description={t.proof.subtitle}
          className="mb-12 sm:mb-14"
        />

        {/* Filter Navigation Tabs */}
        <motion.div
          variants={reducedMotion ? NO_MOTION_CONTAINER : SECTION_REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[var(--border-subtle)]"
        >
          {t.proof.filters.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterKey)}
                aria-pressed={isActive}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)] shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Proof Cards Grid */}
        <motion.div
          key={activeTab}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {visibleItems.map((itemData) => (
            <motion.div
              key={itemData.id}
              variants={item}
              className="editorial-card p-6 flex flex-col justify-between group relative overflow-hidden"
              id={`proof-card-${itemData.id}`}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-emerald)] to-[var(--accent-cyan)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Metric Counter & Highlight */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-display font-black text-[var(--accent-cyan)] font-mono leading-none tracking-tight">
                    <AnimatedCounter value={itemData.value} />
                  </span>
                  <span className="mt-1 px-2 py-0.5 rounded bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-secondary)] leading-tight max-w-[110px] text-right rtl:text-left">
                    {itemData.highlight}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-base font-bold text-[var(--text-heading)] mb-2 font-display leading-snug">
                  {itemData.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
                  {itemData.desc}
                </p>
              </div>

              {/* Stack Pills */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-[0.16em] mb-2">
                  {t.proof.verifiedStack}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {itemData.tech.map((tName, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--accent-cyan)]"
                    >
                      {tName}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Deep Architectural Highlight Box */}
        <SectionTransition once={false} className="mt-12 rounded-2xl border border-[var(--border-accent)] p-6 sm:p-8 relative overflow-hidden bg-[var(--bg-card)] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="tracking-wider uppercase">{t.proof.proofBadge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-heading)] leading-snug">
                "{t.proof.quote}"
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.proof.detailDesc}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-[var(--text-secondary)] pt-2">
                {t.proof.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${['text-cyan-500', 'text-emerald-500', 'text-amber-500'][i] ?? 'text-cyan-500'}`} />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href="#case-study"
                className="btn-primary w-full sm:w-auto text-center"
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  scrollToSection('case-study', !reducedMotion);
                }}
              >
                <span>{t.nav.caseStudy}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </SectionTransition>

      </div>
    </section>
  );
};