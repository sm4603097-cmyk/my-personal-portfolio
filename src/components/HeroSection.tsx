import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { m, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowDown, Shield, Cpu, Smartphone, Code2, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { STAGGER_CONTAINER, ITEM_FADE_UP, MASK_REVEAL, TRANSITION_EASE, FADE_ONLY, NO_MOTION_CONTAINER } from '../motion/variants';
import { MagneticButton } from '../motion';
import { useIsMobile } from '../motion/hooks';
import { siteConfig } from '../data/siteConfig';
import { scrollToSection } from '../utils/sectionReveal';

const CAPABILITY_ICONS = [Code2, Smartphone, Cpu, Shield];
const CAPABILITY_COLORS = ['text-cyan-500', 'text-emerald-500', 'text-amber-500', 'text-indigo-500'];

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax only pays for itself on fine pointers / larger viewports; smaller
  // screens keep the transforms inert so the scroll handler stays idle work.
  const parallax = !reducedMotion && !isMobile;

  // Parallax transforms for natural depth (disabled for reduced m / mobile)
  const imageY = useTransform(scrollY, [0, 600], [0, parallax ? 60 : 0]);
  const textY = useTransform(scrollY, [0, 600], [0, parallax ? -30 : 0]);

  useEffect(() => {
    if (!t.hero.roles?.length) return;
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setActiveRoleIndex((prev) => (prev + 1) % t.hero.roles.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [t.hero.roles, reducedMotion]);

  const capabilities = t.hero.capabilities.map((label, idx) => ({
    icon: CAPABILITY_ICONS[idx] ?? Code2,
    label,
    color: CAPABILITY_COLORS[idx] ?? 'text-cyan-500',
  }));

  const staggerContainer = reducedMotion ? NO_MOTION_CONTAINER : STAGGER_CONTAINER;
  const itemFade = reducedMotion ? FADE_ONLY : ITEM_FADE_UP;
  const nameReveal = reducedMotion ? FADE_ONLY : MASK_REVEAL;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-svh pt-24 sm:pt-28 pb-16 flex items-center justify-center overflow-hidden theme-bg-page"
    >
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* Atmospheric Ambient Glows (desktop only — large blur filters are the
          #1 Style & Layout cost on mobile) */}
      <div
        className="hidden md:block absolute top-1/4 left-[8%] w-80 sm:w-[32rem] h-80 sm:h-[32rem] rounded-full pointer-events-none animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="hidden md:block absolute bottom-1/4 right-[5%] w-72 sm:w-[28rem] h-72 sm:h-[28rem] rounded-full pointer-events-none animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow-2) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '2.5s',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ─── LEFT COLUMN: Value Proposition & Identity ─── */}
          <m.div
            style={{ y: textY }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Live System Availability Badge */}
            <m.div variants={itemFade} className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border-accent)] bg-[var(--accent-cyan-dim)] backdrop-blur-none md:backdrop-blur-md text-[var(--accent-cyan)] text-[11px] font-mono tracking-[0.16em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold">{t.hero.systemStatus}</span>
              </div>
            </m.div>

            {/* NAME Reveal */}
            <div className="mb-4 sm:mb-5">
              <div className="overflow-hidden">
                <m.h1
                  variants={nameReveal}
                  className="text-[clamp(2.5rem,7vw,5.5rem)] font-display font-black tracking-[-0.03em] leading-[0.95] text-[var(--text-heading)] uppercase"
                >
                  {t.hero.nameFirstName}
                </m.h1>
              </div>
              <div className="overflow-hidden mt-1">
                <m.h1
                  variants={nameReveal}
                  className="text-[clamp(2.5rem,7vw,5.5rem)] font-display font-black tracking-[-0.03em] leading-[0.95] uppercase"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan-hover) 50%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t.hero.nameLastName}
                </m.h1>
              </div>
            </div>

            {/* Dynamic Role Rotator */}
            <m.div variants={itemFade} className="mb-6">
              <div className="flex items-center gap-3 text-sm sm:text-lg font-mono font-semibold text-[var(--text-secondary)]">
                <span className="text-[var(--accent-cyan)] font-mono tracking-widest opacity-70">——</span>
                <div className="relative overflow-hidden h-7 min-w-[260px] sm:min-w-[320px]">
                  <AnimatePresence mode="wait">
                    <m.span
                      key={activeRoleIndex}
                      initial={reducedMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reducedMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
                      transition={{ duration: 0.35, ease: TRANSITION_EASE }}
                      className="absolute left-0 rtl:left-auto rtl:right-0 font-mono font-bold text-[var(--accent-cyan)] tracking-wider"
                    >
                      {t.hero.roles[activeRoleIndex]}
                    </m.span>
                  </AnimatePresence>
                </div>
              </div>
            </m.div>

            {/* Headline Statement */}
            <m.h2
              variants={itemFade}
              className="mb-4 text-lg sm:text-2xl font-display font-bold text-[var(--text-heading)] leading-snug max-w-xl"
            >
              {t.hero.headline}
            </m.h2>

            {/* Subheadline Detail */}
            <m.p
              variants={itemFade}
              className="mb-8 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed font-sans"
            >
              {t.hero.subheadline}
            </m.p>

            {/* Primary & Secondary Action CTAs */}
            <m.div variants={itemFade} className="mb-8 flex flex-wrap gap-3 sm:gap-4 items-center w-full sm:w-auto">
              <MagneticButton
                as="a"
                href="#proof"
                id="hero-cta-primary"
                strength={5}
                className="btn-primary flex-1 sm:flex-initial text-center"
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  scrollToSection('proof', !reducedMotion);
                }}
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowDown className="w-4 h-4 shrink-0" />
              </MagneticButton>
              <a
                href="#contact"
                className="btn-ghost flex-1 sm:flex-initial text-center"
                id="hero-cta-secondary"
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  scrollToSection('contact', !reducedMotion);
                }}
              >
                <span>{t.hero.ctaSecondary}</span>
              </a>
            </m.div>

            {/* Immediate Direct Contact Quick-Chips */}
            <m.div variants={itemFade} className="mb-8 flex flex-wrap gap-2 items-center">
              <a
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500/50 hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-emerald-500 text-xs font-mono transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.hero.whatsappLabel}: {siteConfig.phoneDisplay}</span>
              </a>
              <a
                href={`tel:${siteConfig.phoneE164}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/50 hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-cyan-500 text-xs font-mono transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-500" />
                <span>{t.hero.callLabel}</span>
              </a>
            </m.div>

            {/* Engineering Capabilities Strip */}
            <m.div
              variants={itemFade}
              className="w-full border-t border-[var(--border-subtle)] pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono tracking-wide group">
                  <cap.icon className={`w-4 h-4 shrink-0 ${cap.color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="leading-tight">{cap.label}</span>
                </div>
              ))}
            </m.div>
          </m.div>

          {/* ─── RIGHT COLUMN: Studio Portrait Integration ─── */}
          {/* The portrait is the LCP element on every form factor. It is eager
              (fetchpriority="high", loading="eager" preloaded in <head>), so it
              must NOT be gated behind an opacity/scale entrance animation —
              that delays its first paint and inflates element-render-delay.
              Parallax (desktop only) is preserved via the inert y transform,
              but visibility starts at 1, not 0. */}
          <m.div
            style={{ y: imageY }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Seamless Composition: Backing Studio Glow */}
            <div className="relative w-full max-w-sm sm:max-w-md">

              {/* Top Status Pill Overlay (raised above the portrait, breathing room below) */}
              <div className="absolute -top-2 sm:-top-3 left-3 rtl:left-auto rtl:right-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)]/80 border border-[var(--border-strong)] backdrop-blur-none md:backdrop-blur-md shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-[10px] font-mono text-[var(--accent-cyan)] font-bold tracking-wider">
                  {t.hero.metaLat}
                </span>
              </div>

              {/* Backing Ambient Halo (desktop only) */}
              <div
                className="hidden md:block absolute inset-0 rounded-full opacity-60 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 40%, var(--hero-glow-1) 0%, var(--hero-glow-2) 45%, transparent 70%)',
                  filter: 'blur(24px)',
                  transform: 'scale(1.15)',
                }}
              />

              {/* Integrated Portrait Frame (soft organic silhouette, no rigid card border) */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[var(--bg-card)] to-transparent border border-[var(--border-subtle)] shadow-2xl p-2 sm:p-3">

                {/* Image Viewport: Focused framing on torso/chest up */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[var(--bg-surface-2)]">
                  <picture>
                    <source type="image/avif" srcSet="/assets/alhassan_mohamed.avif" />
                    <source type="image/webp" srcSet="/assets/alhassan_mohamed.webp" />
                    <img
                      src="/assets/alhassan_mohamed.jpg"
                      alt="Alhassan Mohamed — Full-Stack & Security Engineer"
                      width="768"
                      height="1024"
                      className="w-full h-full object-cover object-[center_12%] scale-105"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      style={{
                      filter: 'contrast(1.03) brightness(0.98)',
                      transition: reducedMotion ? 'none' : 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (reducedMotion) return;
                      (e.target as HTMLImageElement).style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
                    }}
                  />
                  </picture>

                  {/* Soft Vignette & Editorial Gradient Fade at Bottom */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, var(--bg-card-solid) 0%, rgba(0,0,0,0.15) 30%, transparent 60%)',
                    }}
                  />

                  {/* Bottom Integrated Identity Caption */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 p-3 rounded-xl bg-[var(--bg-card)]/90 border border-[var(--border-subtle)] backdrop-blur-none md:backdrop-blur-md shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-heading)] font-display tracking-wide">
                        {t.hero.portraitLabel}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                        {t.hero.portraitSub}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t.hero.verifiedBadge}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Verified Test Metric Badge */}
              <div
                className="hidden sm:flex absolute -bottom-3 -right-3 rtl:-right-auto rtl:-left-3 px-3.5 py-2 rounded-xl bg-[var(--bg-card-solid)] border border-[var(--border-strong)] shadow-xl items-center gap-2.5 z-30"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-bold text-[var(--text-heading)]">
                    <bdi dir="ltr">{t.caseStudy.unitTests}</bdi> {t.hero.testsBadgeUnit}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">
                    {t.hero.testsBadgeSub}
                  </span>
                </div>
              </div>

            </div>
          </m.div>

        </div>

        {/* Scroll Hint indicator */}
        <m.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-14 sm:mt-16 flex flex-col items-center text-[var(--text-muted)] font-mono text-[10px] tracking-[0.22em] uppercase gap-2"
        >
          <span>{t.hero.scrollHint}</span>
          <ArrowDown className="w-3.5 h-3.5 text-[var(--accent-cyan)] animate-bounce" />
        </m.div>

      </div>
    </section>
  );
};