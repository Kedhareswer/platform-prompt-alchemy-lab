import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { LANGUAGES, DEFAULT_LANGUAGE } from './config';

// Check if we're in development mode (Vite uses import.meta.env.MODE)
const isDevelopment = import.meta.env.MODE === 'development';

// Default namespace
const defaultNS = 'translation';

// Function to find the best matching language
const findBestMatchingLanguage = (language: string): string => {
  // Check exact match
  if (LANGUAGES[language as keyof typeof LANGUAGES]) {
    return language;
  }
  
  // Check language code (e.g., 'en' from 'en-US')
  const languageCode = language.split('-')[0];
  if (LANGUAGES[languageCode as keyof typeof LANGUAGES]) {
    return languageCode;
  }
  
  // Fallback to default language
  return DEFAULT_LANGUAGE;
};

// Get supported language codes
const supportedLngs = Object.keys(LANGUAGES);

// Function to update document attributes when language changes
const updateDocumentAttributes = (lng: string) => {
  const language = lng.split('-')[0] as keyof typeof LANGUAGES;
  const langConfig = LANGUAGES[language] || LANGUAGES[DEFAULT_LANGUAGE];
  
  // Update HTML lang attribute
  document.documentElement.lang = language;
  
  // Update document direction
  document.documentElement.dir = langConfig.rtl ? 'rtl' : 'ltr';
  
  // Update body class for language-specific styling
  document.body.classList.remove(...supportedLngs);
  document.body.classList.add(language);
};

// Configure i18next
export const configureI18n = () => {
  i18n
    // Load translation using http
    .use(Backend)
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      // Enable debug only in development
      debug: isDevelopment,
      // Default language
      fallbackLng: DEFAULT_LANGUAGE,
      // Supported languages and settings
      supportedLngs,
      // Configure React i18next
      react: {
        useSuspense: true,
        bindI18n: 'languageChanged',
        bindI18nStore: ''
      },
      // Interpolation configuration
      interpolation: {
        escapeValue: false, // Not needed for React as it escapes by default
      },
      // Backend configuration
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        // Add version to prevent caching issues in development
        queryStringParams: isDevelopment ? { v: '1.0.0' } : {},
      },
      // Language detection configuration
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        // Convert detected language to our supported format
        convertDetectedLanguage: (lng) => {
          return findBestMatchingLanguage(lng);
        },
      },
      // Improve performance with these settings
      saveMissingTo: 'all',
      parseMissingKeyHandler: (key) => {
        if (isDevelopment) {
          console.warn(`Missing translation: ${key}`);
        }
        return key;
      },
    });

  // Add a custom formatter for numbers, dates, etc.
  i18n.services.formatter?.add('lowercase', (value) => {
    return value.toLowerCase();
  });

  // Log language changes and update document attributes
  i18n.on('languageChanged', (lng) => {
    const language = findBestMatchingLanguage(lng);
    const languageConfig = LANGUAGES[language as keyof typeof LANGUAGES];
    
    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = languageConfig?.rtl ? 'rtl' : 'ltr';
    
    // Add language-specific class to body if needed
    document.body.classList.remove(...Object.keys(LANGUAGES));
    document.body.classList.add(language);
    
    if (isDevelopment) {
      console.log(`Language changed to: ${language}`);
    }
  });

  // Handle loading errors
  i18n.on('failedLoading', (lng, ns, msg) => {
    console.error(`Failed to load ${ns} for ${lng}:`, msg);
  });

  return i18n;
};

// Create and configure the i18n instance
const i18nInstance = configureI18n();

export default i18nInstance;
