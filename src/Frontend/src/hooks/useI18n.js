import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useI18n = () => {
    const { i18n, t } = useTranslation();

    useEffect(() => {
        // Her component mount'ta localStorage'ı kontrol et
        const checkAndSetLanguage = () => {
            if (typeof window !== 'undefined') {
                const savedLanguage = localStorage.getItem('i18nextLng');

                if (savedLanguage && savedLanguage !== i18n.language) {
                    console.log('Setting language from localStorage:', savedLanguage);
                    i18n.changeLanguage(savedLanguage);
                }
            }
        };

        // Immediate check
        checkAndSetLanguage();

        // Route değişimlerini dinle
        const handleRouteChange = () => {
            setTimeout(checkAndSetLanguage, 100);
        };

        // Storage event listener
        const handleStorageChange = (e) => {
            if (e.key === 'i18nextLng' && e.newValue !== i18n.language) {
                i18n.changeLanguage(e.newValue);
            }
        };

        // Event listeners
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [i18n]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };

    return {
        t,
        i18n,
        currentLanguage: i18n.language,
        changeLanguage
    };
}; 