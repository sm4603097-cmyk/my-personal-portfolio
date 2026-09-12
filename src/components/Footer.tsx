import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig } from '../data/siteConfig';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { href: siteConfig.github, label: 'GitHub' },
    { href: 'https://www.upwork.com', label: 'Upwork' },
    { href: 'https://khamsat.com', label: 'Khamsat' },
    { href: 'https://mostaql.com', label: 'Mostaql' },
  ];

  return (
    <footer className="py-10 theme-bg-page text-[var(--text-muted)] font-mono text-xs border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-6">

          {/* Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-start">
            <div className="w-7 h-7 rounded-lg border border-[var(--border-strong)] bg-[var(--accent-cyan-dim)] flex items-center justify-center text-[var(--accent-cyan)] font-mono text-[10px] font-bold">
              {siteConfig.monogram}
            </div>
            <span className="font-bold text-[var(--text-heading)] font-display text-sm tracking-wider uppercase">
              {siteConfig.brandFirstName} {siteConfig.brandLastName}
            </span>
            <span className="hidden sm:inline text-[var(--border-strong)]">·</span>
            <span className="text-[var(--text-secondary)] text-[11px]">
              {t.footer.tagline}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-5">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors duration-200 text-[11px] tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[var(--border-subtle)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <span>
            © {new Date().getFullYear()} {t.footer.rights}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[var(--text-muted)] opacity-60">
              <span>
                صمم بواسطة <span className="text-[var(--accent-cyan)] font-semibold">SaLaMa_83_77</span>
              </span>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.contact.ctaWhatsapp}
                title={t.contact.ctaWhatsapp}
                className="inline-flex items-center justify-center text-[var(--text-muted)] hover:text-emerald-400 transition-colors duration-200"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </span>
            <span className="hidden sm:inline text-[var(--border-strong)]">·</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--text-secondary)]">{t.footer.availability}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};