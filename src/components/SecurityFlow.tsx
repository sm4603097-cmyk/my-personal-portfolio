import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { m, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Shield, Play, Check } from 'lucide-react';

import { SECTION_REVEAL, CARD_STAGGER as STAGGER, SCALE_ITEM as STEP_ITEM, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { SectionHeader, useIsRtl } from '../motion';

export const SecurityFlow: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const isRtl = useIsRtl();
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const stepsCount = t.security.flowSteps.length;
  const stepProgress = stepsCount > 1 ? activeStep / (stepsCount - 1) : 0;
  const packetSpring = useSpring(0, { stiffness: 90, damping: 22 });
  const packetPct = useTransform(packetSpring, (v) => `${2.5 + v * 95}%`);

  useEffect(() => {
    packetSpring.set(stepProgress);
  }, [stepProgress, packetSpring]);

  const reveal = reducedMotion ? NO_MOTION_CONTAINER : SECTION_REVEAL;
  const stagger = reducedMotion ? NO_MOTION_CONTAINER : STAGGER;
  const item = reducedMotion ? FADE_ONLY : STEP_ITEM;

  const runSimulation = () => {
    if (reducedMotion) {
      setActiveStep(t.security.flowSteps.length - 1);
      return;
    }
    setIsSimulating(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < t.security.flowSteps.length) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 800);
  };

  return (
    <section id="security" className="py-24 sm:py-28 theme-bg-page relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Atmospheric Ambient Glows (desktop only) */}
      <div
        className="hidden md:block absolute top-1/3 right-0 w-80 sm:w-[32rem] h-80 sm:h-[32rem] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="hidden md:block absolute bottom-1/4 left-0 w-72 sm:w-[26rem] h-72 sm:h-[26rem] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-2) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeader
          eyebrow={t.security.badge}
          eyebrowIcon={<Shield className="w-3.5 h-3.5" />}
          title={t.security.headline}
          description={t.security.subheadline}
          className="mb-12"
        />

        {/* Zero-Trust Principle Banner & Live Simulator Trigger */}
        <m.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="rounded-2xl border border-[var(--border-accent)] p-6 sm:p-8 mb-12 relative overflow-hidden bg-[var(--bg-card)] shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-[0.18em] font-bold">
                {t.security.principleTitle}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans max-w-xl">
                {t.security.principleDesc}
              </p>
              {/* Core Security Principles */}
              <div className="flex flex-wrap gap-3 pt-2">
                {t.security.principles.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)]">
                    <Check className="w-3 h-3 text-[var(--accent-cyan)]" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                id="security-simulate-btn"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[#050608] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
              >
                <Play className="w-4 h-4" />
                <span>{isSimulating ? t.security.simulatingLabel : t.security.simulateLabel}</span>
              </button>
            </div>
          </div>
        </m.div>

        {/* Interactive Flow Pipeline */}
        <m.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-8 shadow-xl relative"
          >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)] gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text-heading)] uppercase tracking-wide">
                {t.security.flowTitle}
              </h3>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                {t.security.flowSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface-2)] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.security.auditBadge}</span>
            </div>
          </div>

          {/* Request Progress Rail + Packet Indicator */}
          <div className="relative mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.16em] mb-2.5">
              <span>{t.security.progressLabel}</span>
              <span className="text-[var(--accent-cyan)] font-bold">
                {activeStep + 1}/{stepsCount}
              </span>
            </div>
            <div className="relative h-1.5 rounded-full bg-[var(--bg-surface-3)] overflow-visible">
              {/* Progress fill */}
              <m.div
                aria-hidden="true"
                className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-emerald-500"
                style={{
                  scaleX: packetSpring,
                  transformOrigin: isRtl ? 'right center' : 'left center',
                }}
              />
              {/* Packet indicator */}
              <m.div
                aria-hidden="true"
                className="absolute -top-[5px] size-3.5 rounded-full bg-[var(--accent-cyan)] border-2 border-[var(--bg-card)] shadow-[0_0_14px_-2px_var(--accent-cyan)]"
                style={{
                  left: isRtl ? undefined : packetPct,
                  right: isRtl ? packetPct : undefined,
                  transform: isRtl ? 'translateX(50%)' : 'translateX(-50%)',
                }}
              />
            </div>
          </div>

          {/* Steps Grid */}
          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6"
          >
            {t.security.flowSteps.map((stepItem, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <m.button
                  key={idx}
                  variants={item}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-xl text-left rtl:text-right transition-all duration-200 cursor-pointer border flex flex-col justify-between min-h-[130px] ${
                    isActive
                      ? 'bg-[var(--accent-cyan-dim)] border-[var(--accent-cyan)] text-[var(--text-heading)] shadow-md'
                      : isPast
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--text-secondary)]'
                      : 'bg-[var(--bg-surface-2)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                  }`}
                  id={`security-step-${idx}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-cyan)] tracking-wider">
                      {stepItem.step}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--accent-cyan)] shadow-sm animate-ping'
                          : isPast
                          ? 'bg-emerald-500'
                          : 'bg-slate-400 dark:bg-slate-700'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold font-display text-[var(--text-heading)] leading-tight mb-1">
                      {stepItem.title}
                    </div>
                    <div className={`text-[10px] font-mono leading-tight ${
                      isActive ? 'text-[var(--accent-cyan)] font-semibold' : isPast ? 'text-emerald-500 font-medium' : 'text-[var(--text-muted)]'
                    }`}>
                      {stepItem.status}
                    </div>
                  </div>
                </m.button>
              );
            })}
          </m.div>

          {/* Active Step Details */}
          <m.div
            key={activeStep}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-bold">
                STEP {t.security.flowSteps[activeStep].step} — {t.security.flowSteps[activeStep].title}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
                {t.security.flowSteps[activeStep].desc}
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-accent)] text-[var(--accent-cyan)] text-xs font-mono font-bold shrink-0">
              STATUS: {t.security.flowSteps[activeStep].status}
            </div>
          </m.div>

        </m.div>

      </div>
    </section>
  );
};
