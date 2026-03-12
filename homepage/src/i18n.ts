import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zhHK from './locales/zh-HK.json';
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

export const SUPPORTED_LANGS = ['en', 'zh-HK', 'zh-TW', 'zh-CN', 'ja', 'ko'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];

const saved = localStorage.getItem('stoabase_lang') as SupportedLang | null;
const defaultLng: SupportedLang = (saved && SUPPORTED_LANGS.includes(saved)) ? saved : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en:      { translation: en },
    'zh-HK': { translation: zhHK },
    'zh-TW': { translation: zhTW },
    'zh-CN': { translation: zhCN },
    ja:      { translation: ja },
    ko:      { translation: ko },
  },
  lng: defaultLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => localStorage.setItem('stoabase_lang', lng));

export default i18n;
