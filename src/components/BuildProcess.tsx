import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

import { TRANSITION_EASE } from '../motion/variants';
import { SectionHeader, TimelineReveal, TimelineNode } from '../motion';

export const BuildProcess: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-24 sm:py-28 theme-bg-surface-1 relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeader
          eyebrow={t.process.badge}
          title={t.process.title}
          description={t.process.subtitle}
          className="mb-12"
        />

        {/* 7-Step Interactive Pipeline List & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          {/* Step Selector Column */}
          <TimelineReveal
            activeIndex={activeStep}
            className="lg:col-span-5"
            lineClassName="bg-[var(--border-subtle)]"
          >
            {t.process.steps.map((step, idx) => (
              <TimelineNode
                key={idx}
                index={idx}
                active={activeStep === idx}
                reached={idx < activeStep}
                className="mb-2"
              >
                <motion.button
                  onClick={() => setActiveStep(idx)}
                  id={`process-step-${idx}`}
                  className={`w-full p-3.5 sm:p-4 rounded-xl border text-left rtl:text-right transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    activeStep === idx
                      ? 'bg-[var(--accent-cyan-dim)] border-[var(--accent-cyan)] text-[var(--text-heading)] shadow-md'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--accent-cyan)] w-6 shrink-0">
                      {step.num}
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-display text-[var(--text-heading)]">
                      {step.title}
                    </span>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 rtl:rotate-180 transition-all duration-200 ${activeStep === idx ? 'text-[var(--accent-cyan)] translate-x-1 rtl:-translate-x-1' : 'opacity-30'}`} />
                </motion.button>
              </TimelineNode>
            ))}
          </TimelineReveal>

          {/* Active Step Deliverable & Description Panel */}
          <motion.div
            key={activeStep}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: TRANSITION_EASE }}
            className="lg:col-span-7 editorial-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border-subtle)]">
                <span className="text-xl sm:text-2xl font-display font-black text-[var(--accent-cyan)] font-mono tracking-tight">
                  {t.process.phase} {t.process.steps[activeStep].num}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface-2)] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.process.verifiedMilestone}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-heading)] mb-3">
                {t.process.steps[activeStep].title}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans mb-6">
                {t.process.steps[activeStep].desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                  {t.process.deliverableLabel}
                </div>
                <div className="text-xs font-mono font-semibold text-[var(--accent-cyan)]">
                  {t.process.steps[activeStep].deliverable}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};