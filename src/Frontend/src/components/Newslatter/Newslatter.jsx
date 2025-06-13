import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './Newslatter.css';
import { useAuth } from "../../contexts/AuthContext";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus({
        message: 'Please enter a valid email address.',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      console.log('Submitting form with:', { email, frequency });

      const response = await axios.post('/api/newsletter/subscribe', {
        email,
        frequency
      });

      console.log('Response received:', response.data);

      setStatus({
        message: response.data.message || 'Please check your email to confirm your subscription.',
        type: 'success'
      });

      // Clear the form if successful
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: error.request ? 'Request was made but no response' : 'Request setup error'
      });

      const errorMessage = error.response?.data?.message ||
        'There was an error processing your subscription. Please try again.';

      setStatus({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Eğer kullanıcı giriş yapmamışsa, login/signup mesajı göster
  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 150px)',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
              <span style={{ fontSize: '24px', marginRight: '8px' }}>🔒</span>
              <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: '#333' }}>
                Giriş Yapmanız Gerekiyor
              </h2>
            </div>

            <p style={{ margin: '20px 0', color: '#666', fontSize: '16px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              Bülten aboneliği için giriş yapmanız veya kaydolmanız gerekmektedir.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
              <button
                style={{
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '120px'
                }}
                onClick={() => navigate('/login')}
              >
                Giriş Yap
              </button>
              <button
                style={{
                  backgroundColor: '#34a853',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '120px'
                }}
                onClick={() => navigate('/signup')}
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <div className="newsletter-header">
          <span className="newsletter-icon">📧</span>
          <h2>{t('newsletter.title')}</h2>
        </div>
        <p>{t('newsletter.description')}</p>

        {status.message && (
          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            type="email"
            placeholder={t('newsletter.emailPlaceholder')}
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select
            className="frequency-select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="daily">{t('newsletter.daily')}</option>
            <option value="weekly">{t('newsletter.weekly')}</option>
            <option value="monthly">{t('newsletter.monthly')}</option>
          </select>
          <button
            type="submit"
            className="subscribe-button"
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : t('newsletter.subscribe')}
          </button>
        </form>
        <p className="unsubscribe-text">Unsubscribe anytime.</p>
      </div>
    </div>
  );
};

export default Newsletter;
