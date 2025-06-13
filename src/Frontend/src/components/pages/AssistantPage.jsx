import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import './AssistantPage.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AssistantPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Component mount olduğunda yeni bir session oluştur
        setSessionId(generateSessionId());

        // Mesajlara hoşgeldiniz mesajı ekle
        setMessages([
            {
                role: 'assistant',
                content: 'Merhaba! Size nasıl yardımcı olabilirim?',
                timestamp: new Date().toISOString()
            }
        ]);
    }, []);

    // Rastgele bir session ID oluştur
    const generateSessionId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    // Form gönderildiğinde çalışacak fonksiyon
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputValue,
            timestamp: new Date().toISOString()
        };

        // Kullanıcı mesajını ekle
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            // AdaptiveRAG API'sine istek gönder
            const response = await axios.post('http://localhost:8000/query', {
                question: userMessage.content,
                session_id: sessionId
            });

            // API yanıtını ekle
            if (response.data) {
                console.log("API Yanıtı:", response.data);

                // Kaynak dokümanlarını hazırla
                let sourceUrls = [];
                // URL'leri takip etmek için bir Set kullanacağız
                const uniqueUrls = new Set();

                // API'den gelen dokümanları kontrol et
                if (response.data.documents && response.data.documents.length > 0) {
                    console.log("Kaynaklar:", response.data.documents);

                    // Her bir kaynak için içerik ve metadata bilgilerini çıkar
                    sourceUrls = response.data.documents.map((doc, index) => {
                        console.log("Document item:", doc);

                        // Kaynak içeriği (varsa başlık ve yazarları) gösterilecek formatta hazırla
                        let sourceInfo = '';

                        if (doc.metadata && doc.metadata.title) {
                            sourceInfo = doc.metadata.title;
                            if (doc.metadata.authors) {
                                sourceInfo += ` - ${doc.metadata.authors}`;
                            }
                        } else if (doc.content) {
                            // İçeriğin ilk 30 karakterini al
                            sourceInfo = doc.content.substring(0, 30) + '...';
                        } else {
                            sourceInfo = `Kaynak ${index + 1}`;
                        }

                        // URL olarak dönmek için uygun değeri seç
                        let url = '#';
                        if (doc.metadata && doc.metadata.source) {
                            url = doc.metadata.source;
                        } else if (doc.metadata && doc.metadata.url) {
                            url = doc.metadata.url;
                        } else if (doc.metadata && doc.metadata.link) {
                            url = doc.metadata.link;
                        }

                        // URL'nin geçerli olup olmadığını kontrol et
                        try {
                            // URL http:// veya https:// ile başlamalı
                            if (url !== '#' && !url.toLowerCase().startsWith('http')) {
                                url = 'https://' + url; // Basit düzeltme
                            }

                            // URL'yi parse etmeye çalış
                            new URL(url);
                        } catch (e) {
                            // Geçersiz URL ise # kullan
                            console.log("Geçersiz URL:", url);
                            url = '#';
                        }

                        // Her bir kaynak için özel bir nesne dön
                        return {
                            url: url,
                            displayText: sourceInfo
                        };
                    }).filter(item => item.url && item.displayText); // Boş URL veya metinleri filtrele

                    // Tekrar eden URL'leri filtrele
                    sourceUrls = sourceUrls.filter(item => {
                        // URL # ise veya açıkça bir URL değilse yoksay
                        if (item.url === '#' || item.url.length < 5) return false;

                        // URL daha önce görülmüşse, filtreleme
                        if (uniqueUrls.has(item.url)) {
                            return false;
                        }

                        // Yeni URL'yi kaydet
                        uniqueUrls.add(item.url);
                        return true;
                    });

                    console.log("İşlenmiş kaynak listesi:", sourceUrls);
                }

                // Eğer API'den kaynak gelmediyse ve cevap bir akademik yanıt gibi görünüyorsa (uzun bir yanıt)
                if (sourceUrls.length === 0 && response.data.generation && response.data.generation.length > 300) {
                    // Yanıtı kontrol et - akademik veya bilimsel bir yanıt mı?
                    const academicKeywords = ['araştırma', 'çalışma', 'bilimsel', 'akademik', 'makale', 'teori',
                        'deneylerde', 'bilim', 'literature', 'kaynaklar', 'study', 'research'];

                    // Yanıtta akademik anahtar kelimeler var mı?
                    const isAcademicResponse = academicKeywords.some(keyword =>
                        response.data.generation.toLowerCase().includes(keyword));

                    // Soruda akademik anahtar kelimeler var mı?
                    const isAcademicQuestion = academicKeywords.some(keyword =>
                        userMessage.content.toLowerCase().includes(keyword));

                    // Sadece akademik yanıt veya soru ise akademik kaynakları ekle
                    if (isAcademicResponse || isAcademicQuestion) {
                        const searchTerm = encodeURIComponent(userMessage.content);
                        // Akademik arama kaynaklarını hazırla
                        const scholarUrl = `https://scholar.google.com/scholar?q=${searchTerm}`;
                        const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${searchTerm}`;
                        const sciencedirectUrl = `https://www.sciencedirect.com/search?qs=${searchTerm}`;

                        // Varsayılan kaynakları ekle
                        sourceUrls = [
                            {
                                url: scholarUrl,
                                displayText: 'Google Scholar - ' + userMessage.content
                            },
                            {
                                url: pubmedUrl,
                                displayText: 'PubMed - ' + userMessage.content
                            },
                            {
                                url: sciencedirectUrl,
                                displayText: 'ScienceDirect - ' + userMessage.content
                            }
                        ];
                        console.log("Akademik kaynaklar eklendi:", sourceUrls);
                    }
                }

                // İçi boş kaynak URL'lerini temizle
                if (sourceUrls.length === 0) {
                    console.log("Kullanılabilir kaynak bulunamadı");
                }

                const botMessage = {
                    role: 'assistant',
                    content: response.data.generation || 'Üzgünüm, yanıt bulunamadı.',
                    timestamp: new Date().toISOString(),
                    sourceUrls: sourceUrls,
                    detectedLanguage: response.data.detected_language
                };

                setMessages(prev => [...prev, botMessage]);

                // Debug için log
                console.log("Mesaj eklenecek:", botMessage);
            }
        } catch (error) {
            console.error('Error calling API:', error);
            message.error('Sunucuyla iletişim kurulurken bir hata oluştu.');

            // Hata mesajını ekle
            const errorMessage = {
                role: 'assistant',
                content: 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    // URL'yi daha okunabilir hale getir
    const formatUrl = (url) => {
        try {
            // URL'nin domain kısmını bul
            const urlObj = new URL(url);
            const domain = urlObj.hostname.replace('www.', '');

            // Eğer path uzunsa kısalt
            let displayUrl = domain;
            if (urlObj.pathname.length > 30) {
                displayUrl += urlObj.pathname.substring(0, 30) + "...";
            } else {
                displayUrl += urlObj.pathname;
            }

            return displayUrl;
        } catch (e) {
            // URL parse edilemezse orijinal URL'yi kullan
            console.log("URL parse hatası", e);
            return url;
        }
    };

    // Emojileri içeren metni işle ve emojileri vurgula
    const processMessageWithEmojis = (text) => {
        // Emoji regex pattern - tipik emoji aralıklarını içerir
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

        // Eğer emoji yoksa doğrudan metni döndür
        if (!emojiRegex.test(text)) {
            return text;
        }

        // Metni parçalara ayır: emoji olan ve olmayan kısımlar
        const parts = text.split(emojiRegex);
        const matches = text.match(emojiRegex) || [];

        let result = [];
        parts.forEach((part, index) => {
            if (part) {
                result.push(part);
            }
            if (matches[index]) {
                result.push(<span key={`emoji-${index}`} className="emoji">{matches[index]}</span>);
            }
        });

        return result;
    };

    // Mesajları görüntüle
    const renderMessages = () => {
        return messages.map((msg, index) => (
            <div
                key={index}
                className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
            >
                <div className="message-content">
                    {msg.role === 'assistant' ? processMessageWithEmojis(msg.content) : msg.content}
                </div>
                {msg.detectedLanguage && (
                    <div className="language-tag">
                        Dil: {msg.detectedLanguage}
                    </div>
                )}
                {msg.sourceUrls && msg.sourceUrls.length > 0 && (
                    <div className="sources-container">
                        <div className="sources-title">Kaynaklar ({msg.sourceUrls.length})</div>
                        {msg.sourceUrls.map((source, idx) => (
                            <a
                                key={idx}
                                href={source.url && source.url !== '#' ? source.url : 'javascript:void(0)'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-link"
                                data-index={idx + 1}
                            >
                                {source.displayText || formatUrl(source.url)}
                            </a>
                        ))}
                    </div>
                )}
                <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
            </div>
        ));
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
                            Chatbot asistanını kullanmak için giriş yapmanız veya kaydolmanız gerekmektedir.
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
        <div className="assistant-container">
            <div className="assistant-box">
                <div className="chat-header">
                    <h2>AdaptiveRAG Asistan</h2>
                    <div className="header-info">
                        Çok dilli sorguları işleyebilen akıllı asistan
                    </div>
                </div>

                <div className="chat-container">
                    {renderMessages()}
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>

                <div className="chat-input-container">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Bir soru sorun..."
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="send-button"
                                disabled={loading || !inputValue.trim()}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssistantPage; 