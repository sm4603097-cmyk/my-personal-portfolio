import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import type { Language, TranslationContent } from '../data/translations';
import { translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationContent;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'portfolio_lang';

const applyLanguageToDocument = (lang: Language) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const rtl = lang === 'ar';
  root.lang = lang;
  root.dir = rtl ? 'rtl' : 'ltr';
  root.classList.toggle('rtl-active', rtl);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    // Apply the direction/lang attributes synchronously on the click path,
    // before React commits, so RTL flips in one pass with no post-paint flash.
    applyLanguageToDocument(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const isRtl = language === 'ar';

  // Pre-paint sync for the initial mount and any external state change. The
  // action handlers already applied the document attributes synchronously.
  useLayoutEffect(() => {
    applyLanguageToDocument(language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
        isRtl
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
