import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { m, useReducedMotion } from 'framer-motion';

import { CARD_STAGGER as GRID_STAGGER, SCALE_ITEM as GRID_ITEM, TRANSITION_EASE, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { AnimatedProgress, SectionHeader } from '../motion';

// Skill level indicator mapping
const LEVEL_COLORS: Record<string, { dot: string; bar: string; text: string }> = {
  'Production': { dot: 'bg-cyan-500', bar: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400' },
  'بيئة إنتاج': { dot: 'bg-cyan-500', bar: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400' },
  'Advanced': { dot: 'bg-emerald-500', bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  'متقدم': { dot: 'bg-emerald-500', bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  'Expert': { dot: 'bg-amber-500', bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  'خبير': { dot: 'bg-amber-500', bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  'Core Mindset': { dot: 'bg-indigo-500', bar: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
  'منهجية أساسية': { dot: 'bg-indigo-500', bar: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
};

const LEVEL_WIDTH: Record<string, string> = {
  'Production': '90%', 'بيئة إنتاج': '90%',
  'Expert': '95%', 'خبير': '95%',
  'Advanced': '80%', 'متقدم': '80%',
  'Core Mindset': '100%', 'منهجية أساسية': '100%',
};

export const TechnicalMatrix: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(0);

  const levelColors = LEVEL_COLORS;
  const gridContainer = reducedMotion ? NO_MOTION_CONTAINER : GRID_STAGGER;
  const gridItem = reducedMotion ? FADE_ONLY : GRID_ITEM;

  return (
    <section id="engineering" className="py-24 sm:py-28 theme-bg-page relative">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeader
          eyebrow={t.engineering.badge}
          title={t.engineering.title}
          description={t.engineering.subtitle}
          className="mb-12"
        />

        {/* Category Selector Tabs */}
        <m.div
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          {t.engineering.categories.map((cat, idx) => {
            const isSelected = activeCategory === idx;
            return (
              <m.button
                key={idx}
                variants={gridItem}
                onClick={() => setActiveCategory(idx)}
                className={`p-4 sm:p-5 rounded-2xl border text-left rtl:text-right transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-cyan-dim)] border-[var(--accent-cyan)] text-[var(--text-heading)] shadow-lg'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
                id={`matrix-tab-${idx}`}
              >
                <div className="text-[10px] font-mono text-[var(--accent-cyan)] font-bold mb-1 tracking-[0.14em]">
                  {t.engineering.module} 0{idx + 1}
                </div>
                <div className="text-sm font-bold font-display leading-tight text-[var(--text-heading)]">
                  {cat.name}
                </div>
                {isSelected && (
                  <div className="mt-3 w-6 h-0.5 bg-[var(--accent-cyan)] rounded" />
                )}
              </m.button>
            );
          })}
        </m.div>

        {/* Skills Panel */}
        <m.div
          key={activeCategory}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: TRANSITION_EASE }}
          className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-8 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text-heading)] uppercase tracking-wide">
                {t.engineering.categories[activeCategory].name}
              </h3>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                {t.engineering.skillsCountLabel.split('{count}')[0]}
                <bdi dir="ltr">{t.engineering.categories[activeCategory].skills.length}</bdi>
                {t.engineering.skillsCountLabel.split('{count}')[1]}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent-cyan)] px-3 py-1 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.engineering.matrixBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {t.engineering.categories[activeCategory].skills.map((skill, idx) => {
              const colors = levelColors[skill.level] ?? { dot: 'bg-slate-400', bar: 'bg-slate-400', text: 'text-[var(--text-secondary)]' };
              const width = LEVEL_WIDTH[skill.level] ?? '75%';

              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] transition-all duration-200 group"
                  id={`skill-${idx}-${activeCategory}`}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <span className="text-sm font-bold font-display text-[var(--text-heading)] group-hover:text-[var(--accent-cyan)] transition-colors">
                      {skill.name}
                    </span>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] ${colors.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      <span className="text-[10px] font-mono font-semibold tracking-wider">{skill.level}</span>
                    </div>
                  </div>

                  {/* Proficiency Meter */}
                  <AnimatedProgress
                    value={parseFloat(width) / 100 || 0}
                    delay={idx * 0.04}
                    className="mb-2.5"
                    trackClassName="bg-[var(--bg-surface-3)]"
                    barClassName={colors.bar}
                  />

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {skill.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </m.div>

      </div>
    </section>
  );
};
