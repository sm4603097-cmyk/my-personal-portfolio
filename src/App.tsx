import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { FloatingContactDock } from './components/FloatingContactDock';
import { isSectionRevealed, subscribeSectionReveal } from './utils/sectionReveal';

// Every section below the fold is code-split AND gated so it only mounts once
// the visitor scrolls near it (IntersectionObserver) or explicitly navigates to
// it. Splitting alone still fires all `import()`s at first render, which only
// adds round-trips on a constrained connection; gating defers the real work
// until it is actually needed.
const ProofSection = lazy(() => import('./components/ProofSection').then((m) => ({ default: m.ProofSection })));
const FlagshipCaseStudy = lazy(() => import('./components/FlagshipCaseStudy').then((m) => ({ default: m.FlagshipCaseStudy })));
const ProjectsSection = lazy(() => import('./components/ProjectsSection').then((m) => ({ default: m.ProjectsSection })));
const TechnicalMatrix = lazy(() => import('./components/TechnicalMatrix').then((m) => ({ default: m.TechnicalMatrix })));
const EducationSection = lazy(() => import('./components/EducationSection').then((m) => ({ default: m.EducationSection })));
const SecurityFlow = lazy(() => import('./components/SecurityFlow').then((m) => ({ default: m.SecurityFlow })));
const BuildProcess = lazy(() => import('./components/BuildProcess').then((m) => ({ default: m.BuildProcess })));
const SupportTrust = lazy(() => import('./components/SupportTrust').then((m) => ({ default: m.SupportTrust })));
const ContactSection = lazy(() => import('./components/ContactSection').then((m) => ({ default: m.ContactSection })));

// All lazy sections are below the fold, so a null fallback avoids a blank
// placeholder flash while the chunk streams in.
const Suspended: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

// A below-the-fold placeholder that mounts its (lazy) child only when the
// visitor scrolls within ~360px of it, or when navigation explicitly reveals
// this section's anchor. The placeholder keeps a token min-height so the page
// keeps its rough proportions (and the footer stays below the fold) before a
// section is loaded.
const LazySection: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  // Without IntersectionObserver support, fall back to eager mounting.
  const [inView, setInView] = useState(
    () => isSectionRevealed(id) || typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    if (inView) return;

    const unsubscribe = subscribeSectionReveal((revealedId) => {
      if (revealedId === id) setInView(true);
    });

    const placeholder = placeholderRef.current;
    if (!placeholder) {
      return unsubscribe;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px 360px 0px' },
    );
    observer.observe(placeholder);

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [id, inView]);

  return (
    <div ref={placeholderRef} className="min-h-[40vh]">
      {inView ? <Suspended>{children}</Suspended> : null}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen theme-bg-page text-[var(--text-primary)] font-sans selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-300">
          {/* Main Navigation */}
          <Navbar />

          {/* Narrative Section Progression */}
          <main>
            {/* 1. IDENTITY & HERO */}
            <HeroSection />

            {/* 2. PROOF (BUILT, NOT CLAIMED) */}
            <LazySection id="proof">
              <ProofSection />
            </LazySection>

            {/* 3. FLAGSHIP CASE STUDY (Al-Fath Education) */}
            <LazySection id="case-study">
              <FlagshipCaseStudy />
            </LazySection>

            {/* 4. SELECTED PROJECTS (Web, Android, AI, Security) */}
            <LazySection id="projects">
              <ProjectsSection />
            </LazySection>

            {/* 5. ENGINEERING MATRIX */}
            <LazySection id="engineering">
              <TechnicalMatrix />
            </LazySection>

            {/* 6. EDUCATION & CREDENTIALS */}
            <LazySection id="education">
              <EducationSection />
            </LazySection>

            {/* 7. SECURITY PHILOSOPHY */}
            <LazySection id="security">
              <SecurityFlow />
            </LazySection>

            {/* 8. METHODOLOGY & BUILD PROCESS */}
            <LazySection id="process">
              <BuildProcess />
            </LazySection>

            {/* 9. POST-DELIVERY GUARANTEE & PLATFORMS */}
            <LazySection id="trust">
              <SupportTrust />
            </LazySection>

            {/* 10. CONTACT & PROJECT SCOPER */}
            <LazySection id="contact">
              <ContactSection />
            </LazySection>
          </main>

          {/* Persistent Quick Contact Dock */}
          <FloatingContactDock />

          {/* Footer */}
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;