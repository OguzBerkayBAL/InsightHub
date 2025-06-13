import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Newslatter.css';

const NewsletterConfirm = () => {
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const requestSent = useRef(false); // API isteğinin zaten gönderilip gönderilmediğini takip et

    useEffect(() => {
        const confirmSubscription = async () => {
            // Eğer istek zaten gönderildiyse, işlemi durdur
            if (requestSent.current) {
                console.log("Request already sent, skipping duplicate call");
                return;
            }

            // URL'den token'ı al
            const query = new URLSearchParams(location.search);
            const token = query.get('token');

            console.log('Token from URL:', token ? `${token.substring(0, 10)}... (truncated)` : 'No token');

            if (!token) {
                setStatus({
                    message: 'Geçersiz onay bağlantısı. Token sağlanmadı.',
                    type: 'error'
                });
                setIsLoading(false);
                return;
            }

            try {
                // İstek gönderildi olarak işaretle
                requestSent.current = true;

                console.log('Sending confirmation request to API...');
                // Ensure the token is properly handled without double-encoding
                // The token is already encoded in the URL, and axios will encode parameters again
                // So we use a direct URL with the raw token
                const confirmUrl = `/api/newsletter/confirm?token=${token}`;
                console.log('Request URL structure (token truncated):', `/api/newsletter/confirm?token=...${token.substring(0, 10)}...`);

                const response = await axios.get(confirmUrl);
                console.log('API Response:', response.data);

                // Özel durum: Zaten onaylanmış
                if (response.data.status === 'already_confirmed') {
                    setStatus({
                        message: 'Bu abonelik zaten onaylanmış. Tekrar onaylamanıza gerek yok.',
                        type: 'info'
                    });
                } else {
                    setStatus({
                        message: response.data.message || 'Aboneliğiniz başarıyla onaylandı!',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Confirmation error details:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });

                let errorMessage = 'Aboneliğinizi onaylarken bir hata oluştu. Lütfen tekrar deneyin.';

                // Belli başlı hata mesajlarını kullanıcı dostu hale getir
                if (error.response?.status === 404) {
                    if (error.response?.data?.message?.includes('Invalid or expired confirmation token')) {
                        errorMessage = 'Bu onay bağlantısı geçersiz veya süresi dolmuş. Aboneliğiniz zaten onaylanmış olabilir veya yeni bir abonelik oluşturmanız gerekebilir.';
                    }
                } else if (error.response?.status === 400) {
                    if (error.response?.data?.message?.includes('Invalid token format')) {
                        errorMessage = 'Geçersiz token formatı. Lütfen e-postanızdaki bağlantıyı doğrudan tıklayın.';
                    }
                }

                setStatus({
                    message: errorMessage,
                    type: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        confirmSubscription();
    }, [location.search]);

    return (
        <div className="newsletter-container">
            <div className="newsletter-content">
                <div className="newsletter-header">
                    <span className="newsletter-icon">
                        {status.type === 'success' ? '✅' : status.type === 'info' ? 'ℹ️' : '❌'}
                    </span>
                    <h2>Bülten Aboneliği Onayı</h2>
                </div>

                {isLoading ? (
                    <p>Aboneliğiniz doğrulanıyor...</p>
                ) : (
                    <>
                        <div className={`alert ${status.type === 'success' ? 'alert-success' : status.type === 'info' ? 'alert-info' : 'alert-error'}`}>
                            {status.message}
                        </div>

                        <button
                            className="subscribe-button"
                            onClick={() => navigate('/')}
                            style={{ marginTop: '20px' }}
                        >
                            Ana Sayfaya Dön
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterConfirm; 