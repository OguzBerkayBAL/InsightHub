import React from 'react'
import { useI18n } from '../../hooks/useI18n'
import "./Bilgi.css"
const Bilgi = () => {
  const { t } = useI18n();

  return (
    <div className="faq-container">
      <h1>{t('faq.title')}</h1>
      <div className="faq-box">
        <h2>{t('faq.whatIsInsightHub.title')}</h2>
        <p><strong>{t('faq.whatIsInsightHub.name')}</strong> {t('faq.whatIsInsightHub.description')}</p>

        <h3>{t('faq.differences.title')}</h3>
        <ul>
          <li>{t('faq.differences.point1')}</li>
          <li>{t('faq.differences.point2')}</li>
          <li>{t('faq.differences.point3')}</li>
          <li>{t('faq.differences.point4')}</li>
          <li>{t('faq.differences.point5')}</li>
        </ul>

        <h3>{t('faq.questionTypes.title')}</h3>
        <p>{t('faq.questionTypes.description')}</p>

        <h3>{t('faq.suggestions.title')}</h3>
        <p>{t('faq.suggestions.description')}</p>
        <p>{t('faq.suggestions.contact')} <a href="mailto:help@insighthub.com">help@insighthub.com</a>.</p>

        <h3>{t('faq.cost.title')}</h3>
        <p>{t('faq.cost.description')}</p>

        <button className="sign-up-button">{t('faq.signupButton')}</button>
      </div>
    </div>
  )
}

export default Bilgi