import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n, t, changeLanguage } = useI18n();

    return (
        <div className="language-switcher">
            <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-select"
            >
                <option value="en">🇺🇸 {t('language.english')}</option>
                <option value="tr">🇹🇷 {t('language.turkish')}</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher; 