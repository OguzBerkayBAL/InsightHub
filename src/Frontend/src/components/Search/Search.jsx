import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from '../../hooks/useI18n';
import './Search.css'; // CSS dosyasını import ediyoruz

const Search = () => {
  const { t } = useI18n();

  return (

    <div>
      <h2>{t('home.title')}</h2>
      <div className="search-bar-container">
        <div className="relative max-w-lg">
          {/* Arama İkonu */}
          <div className="icon-left">
            <FontAwesomeIcon icon={faSearch} className="icon" />
          </div>
          {/* Giriş Alanı */}
          <input
            type="text"
            placeholder={t('home.searchPlaceholder')}
            className="search-input"
          />
          {/* Aşağı Ok İkonu */}
          <div className="icon-right">
            <FontAwesomeIcon icon={faArrowDown} className="icon" />
          </div>
        </div>
      </div>
      <div className='oval'>
        <div className="oval-container">
          <div className="oval-item">{t('home.topics.dpoVsPpo')}</div>
          <div className="oval-item">{t('home.topics.doubleDescent')}</div>
          <div className="oval-item">{t('home.topics.ranking')}</div>
          <div className="oval-item">{t('home.topics.aiAgriculture')}</div>
          <div className="oval-item">{t('home.topics.backpropagation')}</div>
          <div className="oval-item">{t('home.topics.attention')}</div>
          <div className="oval-item">{t('home.topics.attentionPaper')}</div>
          <div className="oval-item">{t('home.topics.kan')}</div>
          <div className="oval-item">{t('home.topics.summarize')}</div>
          <div className="oval-item">{t('home.topics.yannLecun')}</div>
        </div>
      </div>
    </div>


  );
}

export default Search;
