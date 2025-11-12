import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../../storage';
import './style.scss';

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const cookieConsent = getStorageItem('cookie-consent');
        if (!cookieConsent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        setStorageItem('cookie-consent', true);
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="cookie-banner">
            <div className="cookie-banner-content">
                <p>
                    We use cookies and localStorage to ensure the best experience on Collectors Hub. 
                    By continuing to use the site, you accept our{' '}
                    <a href="/privacy">Privacy Policy</a> and{' '}
                    <a href="/terms">Terms of Service</a>.
                </p>
                <button className="cookie-accept-btn" onClick={handleAccept}>
                    Got it
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;

