import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Newslatter.css';

const NewsletterUnsubscribe = () => {
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = async () => {
            // URL'den email'i al
            const query = new URLSearchParams(location.search);
            const email = query.get('email');

            if (!email) {
                setStatus({
                    message: 'Invalid unsubscribe link. No email provided.',
                    type: 'error'
                });
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/api/newsletter/unsubscribe?email=${email}`);

                setStatus({
                    message: response.data.message || 'You have been unsubscribed successfully.',
                    type: 'success'
                });
            } catch (error) {
                console.error('Unsubscribe error:', error);

                const errorMessage = error.response?.data?.message ||
                    'There was an error processing your request. Please try again.';

                setStatus({
                    message: errorMessage,
                    type: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        unsubscribe();
    }, [location.search]);

    return (
        <div className="newsletter-container">
            <div className="newsletter-content">
                <div className="newsletter-header">
                    <span className="newsletter-icon">{status.type === 'success' ? '✓' : '✗'}</span>
                    <h2>Newsletter Unsubscribe</h2>
                </div>

                {isLoading ? (
                    <p>Processing your request...</p>
                ) : (
                    <>
                        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                            {status.message}
                        </div>

                        {status.type === 'success' && (
                            <p>We're sorry to see you go. You can always subscribe again if you change your mind.</p>
                        )}

                        <button
                            className="subscribe-button"
                            onClick={() => navigate('/')}
                            style={{ marginTop: '20px' }}
                        >
                            Back to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterUnsubscribe; 