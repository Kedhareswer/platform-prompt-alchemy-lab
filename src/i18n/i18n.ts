
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { LANGUAGES, DEFAULT_LANGUAGE } from './config';

// Check if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development';

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

// Update document attributes when language changes
const updateDocumentAttributes = (language: string) => {
  const languageConfig = LANGUAGES[language as keyof typeof LANGUAGES];
  
  if (typeof document !== 'undefined' && languageConfig) {
    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = languageConfig.rtl ? 'rtl' : 'ltr';
    
    // Update body class for language-specific styling
    document.body.classList.remove(...supportedLngs);
    document.body.classList.add(language);
  }
};

// Configure and initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: isDevelopment,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs,
    
    // Ensure we load the default namespace
    defaultNS: 'translation',
    ns: ['translation'],
    
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      queryStringParams: isDevelopment ? { v: Date.now().toString() } : {},
      crossDomain: false,
      requestOptions: {
        cache: 'no-cache',
      },
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      convertDetectedLanguage: (lng) => findBestMatchingLanguage(lng),
    },
    
    // Better error handling
    saveMissing: false,
    parseMissingKeyHandler: (key) => {
      if (isDevelopment) {
        console.warn(`Missing translation key: ${key}`);
      }
      return key;
    },
  });

// Handle language changes - attach to the i18n instance directly
i18n.on('languageChanged', (lng) => {
  const language = findBestMatchingLanguage(lng);
  updateDocumentAttributes(language);
  
  if (isDevelopment) {
    console.log(`Language changed to: ${language}`);
  }
});

// Handle loading errors
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed to load ${ns} for ${lng}:`, msg);
  
  // Fallback to default language if loading fails
  if (lng !== DEFAULT_LANGUAGE) {
    console.log(`Falling back to ${DEFAULT_LANGUAGE}`);
    i18n.changeLanguage(DEFAULT_LANGUAGE);
  }
});

// Handle initialization
i18n.on('initialized', () => {
  if (isDevelopment) {
    console.log('i18n initialized successfully');
  }
});

export default i18n;
