import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, Mail, Phone, Send, Loader2, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { SectionHeader, SectionTransition, HoverLift } from '../motion';

type ContactErrorKey = 'submitError' | 'rateLimit';

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'flexible' | 'compact';
  appearance?: 'always' | 'execute' | 'interaction-only';
  execution?: 'render' | 'execute';
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (errorCode: string) => void;
};

interface TurnstileApi {
  render(container: HTMLElement | string, options: TurnstileRenderOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
  execute(container?: HTMLElement | string): void;
}

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileScriptPromise: Promise<void> | null = null;

function turnstileApi(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

function loadTurnstileScript(): Promise<void> {
  const api = turnstileApi();
  if (api) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error('Turnstile script failed to load'));
    };
    document.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

const SOCIAL_COLORS: Record<string, string> = {
  facebook: 'hover:border-blue-500/50 hover:text-blue-500',
  instagram: 'hover:border-pink-500/50 hover:text-pink-500',
  tiktok: 'hover:border-cyan-500/50 hover:text-cyan-500',
  telegram: 'hover:border-sky-500/50 hover:text-sky-500',
};

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>(t.contact.types[0]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>(t.contact.budgets[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<ContactErrorKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileSectionRef = useRef<HTMLElement | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const turnstilePendingSubmitRef = useRef(false);
  const submitWithTokenRef = useRef<(token: string) => void>(() => {});

  const resetTurnstile = useCallback(() => {
    const widgetId = turnstileWidgetIdRef.current;
    if (widgetId) {
      try {
        turnstileApi()?.reset(widgetId);
      } catch {
        // The widget may already be removed; a clean local token reset is enough.
      }
    }
    setTurnstileToken(null);
  }, []);

  const onTurnstileSuccess = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      if (turnstilePendingSubmitRef.current) {
        turnstilePendingSubmitRef.current = false;
        submitWithTokenRef.current(token);
      }
    },
    [],
  );

  const onTurnstileExpired = useCallback(() => {
    turnstilePendingSubmitRef.current = false;
    setTurnstileToken(null);
  }, []);

  const performSubmission = async (token: string) => {
    setSubmitting(true);
    setErrorKey(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          projectType: selectedType,
          timeline: selectedTimeline,
          honeypot,
          turnstileToken: token,
        }),
      });

      if (!res.ok) {
        setErrorKey(res.status === 429 ? 'rateLimit' : 'submitError');
        return;
      }

      setSubmitted(true);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        const { default: confetti } = await import('canvas-confetti');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
    } catch {
      setErrorKey('submitError');
    } finally {
      // Every consumed token is single-use, so the widget is reset after each
      // attempt. A fresh token replaces it via the success callback.
      resetTurnstile();
      setSubmitting(false);
    }
  };

  useEffect(() => {
    submitWithTokenRef.current = performSubmission;
  });

  // Lazy-load Turnstile only when the contact section approaches the viewport.
  useEffect(() => {
    const section = turnstileSectionRef.current;
    const container = turnstileContainerRef.current;
    if (!section || !container) return;

    let disposed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (disposed || !entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        loadTurnstileScript()
          .then(() => {
            if (disposed || !turnstileContainerRef.current) return;
            const api = turnstileApi();
            if (!api) return;

            const widgetId = api.render(turnstileContainerRef.current, {
              sitekey: siteConfig.turnstileSiteKey,
              theme: 'auto',
              size: 'flexible',
              appearance: 'interaction-only',
              callback: onTurnstileSuccess,
              'expired-callback': onTurnstileExpired,
              'error-callback': onTurnstileExpired,
            });
            turnstileWidgetIdRef.current = widgetId;
          })
          .catch(() => {
            // Turnstile unavailable: the server still enforces verification.
          });
      },
      { rootMargin: '400px 0px 0px 0px' },
    );

    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      const widgetId = turnstileWidgetIdRef.current;
      if (widgetId) {
        try {
          turnstileApi()?.remove(widgetId);
        } catch {
          // widget not rendered yet
        }
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [onTurnstileSuccess, onTurnstileExpired]);

  const triggerWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Alhassan Mohamed,\n\nI want to discuss a project:\n- Type: ${selectedType}\n- Timeline: ${selectedTimeline}\n- Name: ${name || 'Client'}\n- Message: ${message || 'Interested in building a serious product.'}`
    );
    window.open(`${siteConfig.whatsappLink}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const triggerCall = () => {
    window.location.href = `tel:${siteConfig.phoneE164}`;
  };

  const triggerEmail = () => {
    window.location.href = siteConfig.emailLink;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (turnstileToken) {
      await performSubmission(turnstileToken);
      return;
    }

    // No token yet (or it expired): request a fresh challenge. If a token
    // arrives, the success callback completes the pending submission.
    const api = turnstileApi();
    if (api) {
      turnstilePendingSubmitRef.current = true;
      api.execute(turnstileWidgetIdRef.current ?? undefined);

      window.setTimeout(() => {
        if (turnstilePendingSubmitRef.current) {
          turnstilePendingSubmitRef.current = false;
          setErrorKey('submitError');
        }
      }, 8000);
      return;
    }

    setErrorKey('submitError');
  };

  return (
    <section id="contact" ref={turnstileSectionRef} className="py-24 sm:py-28 theme-bg-surface-1 border-t border-[var(--border-subtle)] relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-[35rem] h-80 sm:h-[35rem] bg-[var(--accent-cyan-dim)] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Statement */}
        <SectionHeader
          align="center"
          eyebrow={t.contact.badge}
          title={t.contact.title}
          description={t.contact.subtitle}
          titleClassName="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[var(--text-heading)] tracking-tight leading-tight"
          className="mb-14"
        />

        {/* Contact Layout: Scoper Form + Direct Channels & Social Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          
          {/* Interactive Project Scoper */}
          <SectionTransition
            once={false}
            className="lg:col-span-7 editorial-card p-6 sm:p-8 rounded-2xl shadow-xl"
          >
            <h3 className="text-base sm:text-lg font-bold font-display text-[var(--text-heading)] mb-6 uppercase tracking-wide border-b border-[var(--border-subtle)] pb-3">
              {t.contact.scoperTitle}
            </h3>

            {submitted ? (
              <div className="p-6 sm:p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-xl font-bold font-display text-[var(--text-heading)]">
                  {t.contact.inquiryTitle}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {t.contact.inquiryDesc}
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={triggerWhatsApp}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050608] font-bold text-xs font-mono transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.contact.ctaWhatsapp}</span>
                  </button>
                  <a
                    href={siteConfig.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-[#050608] font-bold text-xs font-mono transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.ctaTelegram}</span>
                  </a>
                  <button
                    onClick={triggerCall}
                    className="px-5 py-2.5 rounded-xl bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] text-[#050608] font-bold text-xs font-mono transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t.contact.ctaCall}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} aria-busy={submitting} className="space-y-5 sm:space-y-6">

                {/* Honeypot: hidden field, legitimate users never fill this */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
                  <label htmlFor="contact-honeypot">Leave this field empty</label>
                  <input
                    id="contact-honeypot"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Step 1: Project Type Selection */}
                <div>
                  <label className="block text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-bold mb-2.5">
                    {t.contact.step1Title}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {t.contact.types.map((type, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                          selectedType === type
                            ? 'bg-[var(--accent-cyan-dim)] border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-bold shadow-sm'
                            : 'bg-[var(--bg-surface-2)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Timeline Selection */}
                <div>
                  <label className="block text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-bold mb-2.5">
                    {t.contact.step2Title}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {t.contact.budgets.map((time, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedTimeline(time)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                          selectedTimeline === time
                            ? 'bg-[var(--accent-cyan-dim)] border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-bold shadow-sm'
                            : 'bg-[var(--bg-surface-2)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Direct Details */}
                <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Sarah Johnson"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-sm text-[var(--text-heading)] focus:border-[var(--accent-cyan)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., sarah@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-sm text-[var(--text-heading)] focus:border-[var(--accent-cyan)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                      {t.contact.messageLabel}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Brief overview of project requirements or technical scope..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-sm text-[var(--text-heading)] focus:border-[var(--accent-cyan)] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Turnstile anti-bot verification. Rendered invisibly by the
                    widget itself (appearance: interaction-only) and lazy-loaded
                    when the section approaches the viewport. */}
                <div ref={turnstileContainerRef} />

                <button
                  type="submit"
                  disabled={submitting}
                  aria-disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] text-[#050608] font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent-cyan)]"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{submitting ? t.contact.submittingLabel : t.contact.submitLabel}</span>
                </button>

                {errorKey && (
                  <p
                    role="alert"
                    className="text-xs font-mono text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center"
                  >
                    {t.contact[errorKey]}
                  </p>
                )}

              </form>
            )}

          </SectionTransition>

          {/* Direct Instant Channels & Social Hub */}
          <SectionTransition
            once={false}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            
            <div className="editorial-card p-6 sm:p-8 rounded-2xl space-y-5 shadow-xl">
              <h3 className="text-base font-bold font-display text-[var(--text-heading)] uppercase tracking-wider">
                {t.contact.directContact}
              </h3>

              {/* Direct Channels */}
              <div className="space-y-3">
                <HoverLift lift={3} className="w-full">
                  <button
                    onClick={triggerWhatsApp}
                    className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="text-left rtl:text-right">
                        <div className="text-sm font-bold font-display text-[var(--text-heading)]">
                          {t.contact.whatsappInstant}
                        </div>
                        <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                          {siteConfig.phoneDisplay}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </button>
                </HoverLift>

                <HoverLift lift={3} className="w-full">
                  <a
                    href={siteConfig.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:border-sky-500 text-sky-600 dark:text-sky-400 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-500">
                        <Send className="w-5 h-5" />
                      </div>
                      <div className="text-left rtl:text-right">
                        <div className="text-sm font-bold font-display text-[var(--text-heading)]">
                          {t.contact.telegramDirect}
                        </div>
                        <div className="text-xs font-mono text-sky-600 dark:text-sky-400">
                          {siteConfig.telegramDisplay}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </a>
                </HoverLift>

                <HoverLift lift={3} className="w-full">
                  <button
                    onClick={triggerCall}
                    className="w-full p-4 rounded-xl bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] hover:border-[var(--accent-cyan)] text-[var(--accent-cyan)] transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan-dim)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-cyan)]">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="text-left rtl:text-right">
                        <div className="text-sm font-bold font-display text-[var(--text-heading)]">
                          {t.contact.directCall}
                        </div>
                        <div className="text-xs font-mono text-[var(--accent-cyan)]">
                          {siteConfig.phoneDisplay}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </button>
                </HoverLift>

                <HoverLift lift={3} className="w-full">
                  <button
                    onClick={triggerEmail}
                    className="w-full p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left rtl:text-right">
                        <div className="text-sm font-bold font-display text-[var(--text-heading)]">
                          {t.contact.directEmail}
                        </div>
                        <div className="text-xs font-mono text-[var(--text-muted)]">
                          {t.contact.sendEmail}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </button>
                </HoverLift>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono space-y-1">
                <div>{t.contact.availability}</div>
                <div>{t.contact.phoneAndWhatsapp}</div>
              </div>
            </div>

            {/* Social Hub Grid */}
            <div className="editorial-card p-5 sm:p-6 rounded-2xl shadow-xl">
              <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold mb-3">
                {t.contact.socialTitle}
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {siteConfig.socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-mono transition-all flex items-center justify-between group ${SOCIAL_COLORS[social.name] ?? ''}`}
                  >
                    <span>{social.name.charAt(0).toUpperCase() + social.name.slice(1)}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

          </SectionTransition>

        </div>

      </div>
    </section>
  );
};