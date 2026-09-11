import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

import { SECTION_REVEAL, CARD_STAGGER as STAGGER_ITEMS, SLIDE_UP as CHILD_REVEAL, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { AnimatedCounter, SectionHeader } from '../motion';

export const FlagshipCaseStudy: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const reveal = reducedMotion ? NO_MOTION_CONTAINER : SECTION_REVEAL;
  const container = reducedMotion ? NO_MOTION_CONTAINER : STAGGER_ITEMS;
  const child = reducedMotion ? FADE_ONLY : CHILD_REVEAL;

  return (
    <section id="case-study" className="py-24 sm:py-28 theme-bg-page relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Atmospheric Ambient Glow */}
      <div
        className="absolute top-1/2 left-0 w-80 sm:w-[36rem] h-80 sm:h-[36rem] -translate-y-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeader
          eyebrow={t.caseStudy.badge}
          title={t.caseStudy.title}
          subtitle={t.caseStudy.subtitle}
          description={t.caseStudy.summary}
          live
          className="mb-12"
        />

        {/* Automated Test Verification Results Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12"
        >
          {/* Unit Test Card */}
          <motion.div
            variants={child}
            className="rounded-2xl bg-[var(--bg-card)] border border-emerald-500/30 p-6 sm:p-7 flex items-center gap-5 sm:gap-6 relative overflow-hidden group shadow-lg"
            id="test-unit-card"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-emerald-500 font-mono leading-none">
                <AnimatedCounter value={t.caseStudy.unitTests} />
              </div>
              <div className="text-sm font-semibold text-[var(--text-heading)] mt-1.5">
                {t.caseStudy.unitTestsDesc}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                {t.caseStudy.unitTestsMeta}
              </div>
            </div>
          </motion.div>

          {/* E2E Card */}
          <motion.div
            variants={child}
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-accent)] p-6 sm:p-7 flex items-center gap-5 sm:gap-6 relative overflow-hidden group shadow-lg"
            id="test-e2e-card"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-cyan)] shrink-0">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[var(--accent-cyan)] font-mono leading-none">
                <AnimatedCounter value={t.caseStudy.e2eTests} />
              </div>
              <div className="text-sm font-semibold text-[var(--text-heading)] mt-1.5">
                {t.caseStudy.e2eTestsDesc}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                {t.caseStudy.e2eTestsMeta}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Architecture Flow Chain */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-8 mb-12 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-heading)] font-display uppercase tracking-wide">
                {t.caseStudy.architectureTitle}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {t.caseStudy.architectureSub}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-strong)] text-[var(--accent-cyan)] text-xs font-mono w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.caseStudy.verifiedPipeline}</span>
            </div>
          </div>

          {/* Flow Steps Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-6">
            {t.caseStudy.architectureSteps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 sm:p-4 rounded-xl text-left rtl:text-right transition-all duration-200 cursor-pointer border flex flex-col justify-between min-h-[110px] ${
                    isSelected
                      ? 'bg-[var(--accent-cyan-dim)] border-[var(--accent-cyan)] text-[var(--accent-cyan)] shadow-md'
                      : 'bg-[var(--bg-surface-2)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold tracking-wider">
                      0{idx + 1}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[var(--accent-cyan)]' : 'bg-slate-400 dark:bg-slate-700'}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-display leading-tight text-[var(--text-heading)]">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 line-clamp-2">
                      {step.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Inspector */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-cyan)] shrink-0 font-mono font-bold text-sm">
                0{activeStep + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-heading)] font-display">
                  {t.caseStudy.architectureSteps[activeStep].title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                  {t.caseStudy.architectureSteps[activeStep].desc}
                </p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-[var(--accent-cyan)] px-3 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] shrink-0 font-semibold">
              {t.caseStudy.layerConfirmed}
            </div>
          </div>
        </motion.div>

        {/* Key Features & Tech Stack */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <motion.div variants={child} className="lg:col-span-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-heading)] font-display uppercase tracking-wide">
              {t.caseStudy.keyFeaturesTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.caseStudy.keyFeatures.map((feat, idx) => (
                <div key={idx} className="editorial-card p-5 rounded-xl group">
                  <div className="text-sm font-bold text-[var(--accent-cyan)] font-display mb-2 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    {feat.title}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Verified Tech Stack List */}
          <motion.div variants={child} className="lg:col-span-4 editorial-card p-6 rounded-xl">
            <h3 className="text-xs font-bold text-[var(--text-heading)] font-mono uppercase tracking-[0.16em] mb-4 pb-3 border-b border-[var(--border-subtle)]">
              {t.caseStudy.stackTitle}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React", "TypeScript", "Vite", "Tailwind CSS", "Clerk Auth",
                "PostgreSQL", "Vitest", "Playwright", "Cloudflare Workers", "REST APIs"
              ].map((techName, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-colors"
                >
                  {techName}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};