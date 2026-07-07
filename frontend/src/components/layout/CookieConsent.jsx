import React, { useEffect, useState } from 'react';
import '../../assets/styles/cookieConsent.css';
import { useLang } from '../../context/LangContext';
import { translations } from '../../i18n/translations';

const GA_ID = import.meta.env.VITE_GA_ID;

const loadAnalytics = () => {
    if (!GA_ID) {
        console.warn("Google Analytics ID is missing.");
        return;
    }
    
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());

    window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied'
    });

    window.gtag('config', GA_ID);
};

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const { lang } = useLang();
    const t = translations[lang].cookieConsent;

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');

        if (!consent) {
            setVisible(true);
        }

        if (consent === 'accepted') {
            loadAnalytics();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');

        window.gtag?.('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'denied'
        });

        loadAnalytics();
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');

        window.gtag?.('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied'
        });

        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner show">
            <div className="cookie-text-section">
                <h4>🍪 {t.title}</h4>
                <p>
                    {t.text}
                </p>
            </div>

            <div className="cookie-actions">
                <button className="cookie-btn cookie-reject" onClick={handleReject}>
                    {t.btnReject}
                </button>
                <button className="cookie-btn cookie-accept" onClick={handleAccept}>
                    {t.btnAccept}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;