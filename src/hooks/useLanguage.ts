import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from '@/i18n/config';

export const useLanguage = () => {
  const { i18n, ready } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isChanging, setIsChanging] = useState(false);

  // Set initial language when translations are ready
  useEffect(() => {
    if (ready) {
      const detectedLng = i18n.language?.split('-')[0] as LanguageCode;
      const validLang = Object.keys(LANGUAGES).includes(detectedLng) 
        ? detectedLng 
        : DEFAULT_LANGUAGE;
      
      setCurrentLanguage(validLang);
      updateDocumentAttributes(validLang);
    }
  }, [i18n.language, ready]);

  // Update document attributes when language changes
  const updateDocumentAttributes = useCallback((language: LanguageCode) => {
    const languageConfig = LANGUAGES[language];
    if (!languageConfig) return;

    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = languageConfig.rtl ? 'rtl' : 'ltr';
    
    // Update body class for language-specific styling
    document.body.classList.remove(...Object.keys(LANGUAGES));
    document.body.classList.add(language);
  }, []);

  // Change language handler
  const changeLanguage = useCallback(async (language: LanguageCode) => {
    if (language === currentLanguage || isChanging || !LANGUAGES[language]) {
      return;
    }

    try {
      setIsChanging(true);
      
      // Change the language in i18next
      await i18n.changeLanguage(language);
      
      // Update our state
      setCurrentLanguage(language);
      updateDocumentAttributes(language);
      
      // Store preference
      localStorage.setItem('i18nextLng', language);
      
      // Announce change for screen readers
      announceLanguageChange(language);
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  }, [currentLanguage, i18n, isChanging, updateDocumentAttributes]);

  // Announce language change for screen readers
  const announceLanguageChange = useCallback((language: LanguageCode) => {
    const languageName = LANGUAGES[language]?.name || 'English';
    const statusEl = document.createElement('div');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.className = 'sr-only';
    statusEl.textContent = `Language changed to ${languageName}`;
    document.body.appendChild(statusEl);
    setTimeout(() => statusEl.remove(), 1000);
  }, []);

  return {
    currentLanguage,
    isChanging,
    changeLanguage,
    languages: LANGUAGES,
    ready,
  };
};
