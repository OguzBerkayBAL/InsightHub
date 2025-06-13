import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import './Pricing.css';

const Pricing = () => {
  const { t } = useI18n();

  return (
    <div className="pricing-container">
      <h2>{t('pricing.title')}</h2>
      <p></p>
      <div className="plans">
        {/* Free Plan */}
        <div className="plan-card">
          <h3 className="plan-title">{t('pricing.free.title')}</h3>
          <p>{t('pricing.free.description')}</p>
          <p className="plan-price">{t('pricing.free.price')}</p>
          <button className="plan-button">{t('pricing.free.button')}</button>
          <p className="no-card">{t('pricing.noCard')}</p>
          <ul>
            <li>{t('pricing.features.limitedSearches')}</li>
            <li>{t('pricing.features.followUpQuestions')}</li>
            <li>{t('pricing.features.searchHistory')}</li>
            <li>{t('pricing.features.trendingPapers')}</li>
            <li className="disabled">{t('pricing.features.centralizedBilling')}</li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="plan-card">
          <h3 className="plan-title">{t('pricing.pro.title')}</h3>
          <p>{t('pricing.pro.description')}</p>
          <p className="plan-price">{t('pricing.pro.price')}</p>
          <button className="plan-button">{t('pricing.pro.button')}</button>
          <p className="cancel-anytime">{t('pricing.cancelAnytime')}</p>
          <ul>
            <li>{t('pricing.features.unlimitedSearches')}</li>
            <li>{t('pricing.features.followUpQuestions')}</li>
            <li>{t('pricing.features.searchHistory')}</li>
            <li>{t('pricing.features.trendingPapers')}</li>
            <li className="disabled">{t('pricing.features.centralizedBilling')}</li>
          </ul>
        </div>

        {/* Team Plan */}
        <div className="plan-card">
          <h3 className="plan-title">{t('pricing.team.title')}</h3>
          <p>{t('pricing.team.description')}</p>
          <p className="plan-price">{t('pricing.team.price')}</p>
          <button className="plan-button">{t('pricing.team.button')}</button>
          <p className="cancel-anytime">{t('pricing.cancelAnytime')}</p>
          <ul>
            <li>{t('pricing.features.unlimitedSearches')}</li>
            <li>{t('pricing.features.followUpQuestions')}</li>
            <li>{t('pricing.features.searchHistory')}</li>
            <li>{t('pricing.features.trendingPapers')}</li>
            <li>{t('pricing.features.centralizedBilling')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
