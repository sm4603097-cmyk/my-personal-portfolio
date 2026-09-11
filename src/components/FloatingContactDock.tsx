import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, Send, Phone, Mail, X, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig } from '../data/siteConfig';

export const FloatingContactDock: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  // IntersectionObserver: hide dock when footer/CTA area is visible
  useEffect(() => {
    const footer = document.getElementById('contact');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearFooter(entry.isIntersecting);
        if (entry.isIntersecting) setIsOpen(false);
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const contactChannels = [
    {
      id: 'whatsapp',
      label: t.contact.ctaWhatsapp,
      icon: MessageCircle,
      href: siteConfig.whatsappLink,
      bgClass: 'bg-emerald-500 hover:bg-emerald-400 text-white',
      badge: siteConfig.phoneDisplay,
    },
    {
      id: 'telegram',
      label: t.contact.ctaTelegram,
      icon: Send,
      href: siteConfig.telegramLink,
      bgClass: 'bg-sky-500 hover:bg-sky-400 text-white',
      badge: siteConfig.telegramHandle,
    },
    {
      id: 'phone',
      label: t.contact.ctaCall,
      icon: Phone,
      href: `tel:${siteConfig.phoneE164}`,
      bgClass: 'bg-cyan-600 hover:bg-cyan-500 text-white',
      badge: siteConfig.phoneDisplay,
    },
    {
      id: 'email',
      label: t.contact.directEmail,
      icon: Mail,
      href: siteConfig.emailLink,
      bgClass: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      badge: siteConfig.email,
    },
  ];

  return (
    <motion.aside
      aria-label={t.contact.dockTitle}
      className="fixed bottom-5 start-5 z-40"
      animate={{
        opacity: nearFooter ? 0 : 1,
        y: nearFooter ? 24 : 0,
        pointerEvents: nearFooter ? ('none' as const) : ('auto' as const),
      }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="relative flex flex-col items-start">
        {/* Expanded Contact Action List */}
        <AnimatePresence>
          {isOpen && !nearFooter && (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-col gap-2 p-2 rounded-2xl bg-[var(--dock-bg)] border border-[var(--border-strong)] shadow-2xl w-60 sm:w-64"
            >
              <div className="px-3 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--accent-cyan)] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t.contact.dockTitle}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {contactChannels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.id}
                    href={ch.href}
                    target={ch.id === 'phone' || ch.id === 'email' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ch.bgClass} shadow-md`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left rtl:text-right">
                        <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                          {ch.label}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {ch.badge}
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Floating Trigger Button — semi-transparent / subtle */}
        <motion.button
          whileHover={reducedMotion || nearFooter ? undefined : { scale: 1.05 }}
          whileTap={reducedMotion || nearFooter ? undefined : { scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={t.contact.dockTitle}
          className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[var(--dock-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-lg hover:border-[var(--accent-cyan)] transition-all cursor-pointer opacity-70 hover:opacity-100"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <span className="text-xs font-display font-bold tracking-wider hidden sm:inline text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
            {t.contact.dockTitle}
          </span>

          {isOpen ? (
            <X className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
};
