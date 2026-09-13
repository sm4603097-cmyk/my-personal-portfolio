import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

import { CARD_STAGGER as STAGGER, CARD_ITEM as CERT_ITEM, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { SectionHeader } from '../motion';

export const EducationSection: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();

  const stagger = reducedMotion ? NO_MOTION_CONTAINER : STAGGER;
  const item = reducedMotion ? FADE_ONLY : CERT_ITEM;

  return (
    <section id="education" className="py-24 sm:py-28 theme-bg-surface-1 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Background Ambient (desktop only) */}
      <div
        className="hidden md:block absolute top-1/2 left-1/4 w-80 sm:w-[32rem] h-80 sm:h-[32rem] -translate-y-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeader
          eyebrow={t.education.badge}
          eyebrowIcon={<GraduationCap className="w-3.5 h-3.5" />}
          title={t.education.title}
          description={t.education.subtitle}
          className="mb-12"
        />

        {/* Academic Foundation + Commercial Mindset Banner */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12"
        >
          {/* Academic Foundation Banner */}
          <motion.div
            variants={item}
            className="lg:col-span-7 rounded-2xl border border-[var(--border-accent)] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between bg-[var(--bg-card)] shadow-lg"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[var(--accent-cyan)] bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] px-3 py-1.5 rounded-full font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.education.academicTitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-[var(--text-heading)] leading-tight">
                {t.education.academicDegree}
              </h3>
              <p className="text-sm font-mono text-[var(--accent-cyan)] font-semibold">
                {t.education.academicInstitution}
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                {t.education.academicDesc}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
              {t.education.academicHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${['text-[var(--accent-cyan)]', 'text-emerald-500', 'text-amber-500'][idx] ?? 'text-[var(--accent-cyan)]'}`} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Marketing & UX Acumen */}
          <motion.div
            variants={item}
            className="lg:col-span-5 rounded-2xl border border-amber-500/25 p-6 sm:p-8 flex flex-col justify-between bg-[var(--bg-card)] shadow-lg"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t.education.marketingBadge}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text-heading)] leading-tight">
                {t.education.marketingTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                {t.education.marketingDesc}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-[var(--border-subtle)] text-[11px] font-mono text-amber-600 dark:text-amber-400 font-medium">
              {t.education.marketingCert}
            </div>
          </motion.div>
        </motion.div>

        {/* Certifications Grid */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase tracking-[0.18em]">
            {t.education.certsTitle}
          </h3>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {t.education.certList.map((cert, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="editorial-card p-5 sm:p-6 flex flex-col justify-between group"
                id={`cert-${idx}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-2)] border border-[var(--border-accent)] text-[var(--accent-cyan)] text-[10px] font-mono font-bold">
                      {cert.badge}
                    </span>
                    <Award className="w-4 h-4 text-[var(--accent-cyan)] opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-sm font-bold font-display text-[var(--text-heading)] mb-1 leading-snug">
                    {cert.title}
                  </h4>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] mb-3">
                    {cert.issuer}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {cert.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
