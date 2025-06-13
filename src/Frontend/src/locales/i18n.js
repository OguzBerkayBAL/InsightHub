import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './en/translation.json';
import trTranslation from './tr/translation.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    tr: {
        translation: trTranslation,
    },
};

// LocalStorage'dan dil bilgisini al (browser kontrolü ile)
const savedLanguage = typeof window !== 'undefined'
    ? (localStorage.getItem('i18nextLng') || 'en')
    : 'en';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage, // LocalStorage'dan gelen dil
        fallbackLng: 'en',
        debug: false,

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
            lookupQuerystring: 'lng',
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage'],
        },

        react: {
            useSuspense: false,
        },
    });

// Dil değişikliklerini localStorage'a kaydet
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

export default i18n; 