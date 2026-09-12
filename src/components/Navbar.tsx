import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotion } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Sun, Moon, PhoneCall } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const Navbar: React.FC = () => {
  const { t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = ['hero', 'proof', 'case-study', 'projects', 'engineering', 'education', 'security', 'process', 'trust', 'contact'];
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        const nextScrolled = window.scrollY > 30;
        setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

        for (const section of [...sections].reverse()) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 260) {
              setActiveSection((prev) => (prev === section ? prev : section));
              break;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'proof', label: t.nav.work },
    { id: 'case-study', label: t.nav.caseStudy },
    { id: 'projects', label: t.nav.proof },
    { id: 'engineering', label: t.nav.engineering },
    { id: 'education', label: t.nav.education },
    { id: 'security', label: t.nav.security },
    { id: 'process', label: t.nav.process },
    { id: 'trust', label: t.nav.trust },
    { id: 'contact', label: t.nav.contact },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--nav-bg)] backdrop-blur-lg border-b border-[var(--nav-border)] py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Identity Brand Mark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
            className="group flex items-center gap-3 cursor-pointer"
            aria-label={`${siteConfig.brandFirstName} ${siteConfig.brandLastName} - Home`}
          >
            <div className="w-8 h-8 rounded-lg border border-[var(--border-strong)] bg-[var(--accent-cyan-dim)] flex items-center justify-center text-[var(--accent-cyan)] font-mono text-xs font-bold group-hover:border-[var(--accent-cyan)] transition-all">
              {siteConfig.monogram}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-[var(--text-heading)] group-hover:text-[var(--accent-cyan)] transition-colors">
                {siteConfig.brandFirstName} {siteConfig.brandLastName}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.nav.brandStatus}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 xl:rtl:gap-0.5 bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-full px-3 py-1.5 backdrop-blur-md shadow-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-3 xl:rtl:px-2 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Controls: Theme Toggle + Language Toggle + Contact Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span>{t.nav.langBtn}</span>
            </button>

            {/* Primary CTA (Contact) */}
            <button
              onClick={() => scrollTo('contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#050608] bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] transition-all shadow-md cursor-pointer"
            >
              <span>{t.nav.contact}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-1)] cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reducedMotion ? { duration: 0.1 } : { duration: 0.25, ease: 'easeInOut' }}
            className="xl:hidden overflow-hidden"
          >
            <div className="bg-[var(--bg-card-solid)] border-b border-[var(--border-strong)] px-4 pt-3 pb-6 mt-3 shadow-2xl">
              <div className="flex flex-col space-y-1.5">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`text-start px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === link.id
                        ? 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                  <button
                    onClick={() => scrollTo('contact')}
                    className="w-full py-3 rounded-xl text-sm font-bold text-[#050608] bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] transition-all text-center flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{t.nav.contact}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};