import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  GitBranch,
  Users,
  FileCheck2,
  BookOpen,
  LayoutDashboard,
  Code2,
} from 'lucide-react';

import { projectsData, type CaseStudyIcon } from '../data/portfolioData';
import { SECTION_REVEAL, CARD_STAGGER as STAGGER_ITEMS, SLIDE_UP as CHILD_REVEAL, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { AnimatedCounter, SectionHeader, useIsRtl } from '../motion';

const ICON_MAP: Record<CaseStudyIcon, LucideIcon> = {
  Database,
  GitBranch,
  Users,
  FileCheck2,
  BookOpen,
  LayoutDashboard,
  Code2,
};

export const FlagshipCaseStudy: React.FC = () => {
  const { t } = useLanguage();
  const isRtl = useIsRtl();
  const reducedMotion = useReducedMotion();

  const flagship = projectsData.find((p) => p.isFlagship);
  if (!flagship) return null;

  const stats = (isRtl ? flagship.statsAr : flagship.statsEn) ?? [];
  const capabilities = (isRtl ? flagship.capabilitiesAr : flagship.capabilitiesEn) ?? [];
  const security = (isRtl ? flagship.securityAr : flagship.securityEn) ?? [];
  const architecture = (isRtl ? flagship.architectureAr : flagship.architectureEn) ?? [];
  const impact = isRtl ? flagship.impactAr : flagship.impactEn;

  const reveal = reducedMotion ? NO_MOTION_CONTAINER : SECTION_REVEAL;
  const container = reducedMotion ? NO_MOTION_CONTAINER : STAGGER_ITEMS;
  const child = reducedMotion ? FADE_ONLY : CHILD_REVEAL;

  return (
    <section id="case-study" className="py-24 sm:py-28 theme-bg-page relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Atmospheric Ambient Glow (desktop only) */}
      <div
        className="hidden md:block absolute top-1/2 left-0 w-80 sm:w-[36rem] h-80 sm:h-[36rem] -translate-y-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeader
          eyebrow={t.caseStudy.badge}
          title={isRtl ? flagship.titleAr : flagship.titleEn}
          subtitle={isRtl ? flagship.subtitleAr : flagship.subtitleEn}
          description={isRtl ? flagship.descAr : flagship.descEn}
          live
          className="mb-12"
        />

        {/* Verified Platform Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon ? ICON_MAP[stat.icon] : CheckCircle2;
            const isEmphasis = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                variants={child}
                className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-6 relative overflow-hidden shadow-lg"
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${
                    isEmphasis
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                      : 'bg-[var(--accent-cyan-dim)] border-[var(--border-accent)] text-[var(--accent-cyan)]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div
                  className={`text-3xl sm:text-4xl font-display font-black font-mono leading-none ${
                    isEmphasis ? 'text-emerald-500' : 'text-[var(--accent-cyan)]'
                  }`}
                >
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-xs font-semibold text-[var(--text-heading)] mt-2">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Capability Matrix */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12"
        >
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon ? ICON_MAP[cap.icon] : CheckCircle2;
            return (
              <motion.div
                key={idx}
                variants={child}
                className="editorial-card p-6 rounded-xl flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-cyan)] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold font-display uppercase tracking-wide text-[var(--text-heading)]">
                    {cap.title}
                  </h3>
                </div>
                <ul className="space-y-2.5 mt-auto">
                  {cap.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-cyan)] mt-0.5 shrink-0" />
                      <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Architecture Flow Chain */}
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
              <span>{t.caseStudy.verifiedArchitecture}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {architecture.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] transition-colors">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[var(--accent-cyan)]">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] font-mono">
                    {step}
                  </span>
                </div>
                {idx < architecture.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[var(--accent-cyan)] opacity-60 shrink-0 rtl:rotate-180" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Security Engineering */}
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
                {t.caseStudy.securityTitle}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {t.caseStudy.securitySub}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {security.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact & Tech Stack */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {impact && (
            <motion.div variants={child} className="lg:col-span-8 editorial-card p-6 sm:p-7 rounded-xl">
              <h3 className="text-xs font-bold text-[var(--text-heading)] font-mono uppercase tracking-[0.16em] mb-3 pb-3 border-b border-[var(--border-subtle)]">
                {t.caseStudy.impactTitle}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {impact}
              </p>
            </motion.div>
          )}

          <motion.div variants={child} className="lg:col-span-4 editorial-card p-6 rounded-xl">
            <h3 className="text-xs font-bold text-[var(--text-heading)] font-mono uppercase tracking-[0.16em] mb-4 pb-3 border-b border-[var(--border-subtle)]">
              {t.caseStudy.stackTitle}
            </h3>
            <div className="flex flex-wrap gap-2">
              {flagship.tech.map((techName, idx) => (
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