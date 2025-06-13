import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './Search.css'; // CSS dosyasını import ediyoruz

const Search = () => {
  return (
    
    <div>
    <h2>AI Research Assistant for Computer Scientists</h2>
    <div className="search-bar-container">
      <div className="relative max-w-lg">
        {/* Arama İkonu */}
        <div className="icon-left">
          <FontAwesomeIcon icon={faSearch} className="icon" />
        </div>
        {/* Giriş Alanı */}
        <input 
          type="text" 
          placeholder="Research any comp sci topic"
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
        <div className="oval-item">DPO vs PPO</div>
        <div className="oval-item">What is double descent?</div>
        <div className="oval-item">Listwise vs pairwise ranking</div>
        <div className="oval-item">How is AI used in agriculture?</div>
        <div className="oval-item">Implement Backpropagation in Python</div>
        <div className="oval-item">什么是注意力?</div>
        <div className="oval-item">Attention Is All You Need</div>
        <div className="oval-item">KAN: Kolmogorov-Arnold Networks</div>
        <div className="oval-item">Summarize 2410.01201 in 3 bullet points</div>
        <div className="oval-item">Yann LeCun</div>
      </div>
    </div>
  </div>
  
  
  );
}

export default Search;
