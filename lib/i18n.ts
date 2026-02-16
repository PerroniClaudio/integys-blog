import i18n from 'i18next';

// Import translations
import itCommon from '../public/locales/it/common.json';
import enCommon from '@/public/locales/en/common.json';

export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

export const resources = {
  it: {
    translation: itCommon,
  },
  en: {
    translation: enCommon,
  },
};

export default i18n;