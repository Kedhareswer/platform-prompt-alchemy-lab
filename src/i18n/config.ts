// Supported languages configuration
export const LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    rtl: false,
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
  },
  // Add more languages as needed
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

// Default language
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

// List of supported language codes
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as LanguageCode[];

// Get language name by code
export const getLanguageName = (code: LanguageCode): string => {
  return LANGUAGES[code]?.name || code;
};

// Check if a language is RTL
export const isRTL = (code: LanguageCode): boolean => {
  return LANGUAGES[code]?.rtl || false;
};
