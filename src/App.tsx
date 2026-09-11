import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProofSection } from './components/ProofSection';
import { FlagshipCaseStudy } from './components/FlagshipCaseStudy';
import { ProjectsSection } from './components/ProjectsSection';
import { TechnicalMatrix } from './components/TechnicalMatrix';
import { EducationSection } from './components/EducationSection';
import { SecurityFlow } from './components/SecurityFlow';
import { BuildProcess } from './components/BuildProcess';
import { SupportTrust } from './components/SupportTrust';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingContactDock } from './components/FloatingContactDock';

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
            <ProofSection />

            {/* 3. FLAGSHIP CASE STUDY (Al-Fath Education) */}
            <FlagshipCaseStudy />

            {/* 4. SELECTED PROJECTS (Web, Android, AI, Security) */}
            <ProjectsSection />

            {/* 5. ENGINEERING MATRIX */}
            <TechnicalMatrix />

            {/* 6. EDUCATION & CREDENTIALS */}
            <EducationSection />

            {/* 7. SECURITY PHILOSOPHY */}
            <SecurityFlow />

            {/* 8. METHODOLOGY & BUILD PROCESS */}
            <BuildProcess />

            {/* 9. POST-DELIVERY GUARANTEE & PLATFORMS */}
            <SupportTrust />

            {/* 10. CONTACT & PROJECT SCOPER */}
            <ContactSection />
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
