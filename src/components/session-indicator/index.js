import React, { useState, useEffect, useRef } from 'react';
import { getAuthToken } from '../../utils/tokenUtils';
import './style.scss';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;

const SessionIndicator = () => {
    const lastActivityRef = useRef(Date.now());
    const isRefreshingRef = useRef(false);

    useEffect(() => {
        const refreshToken = async () => {
            if (isRefreshingRef.current) return;
            
            const authData = localStorage.getItem('auth');
            if (!authData) return;

            try {
                isRefreshingRef.current = true;
                const auth = JSON.parse(authData);
                
                const response = await fetch(`${SERVER_URI}/auth/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.token) {
                        localStorage.setItem('auth', JSON.stringify({
                            token: data.token,
                            user: auth.user
                        }));
                    }
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
            } finally {
                isRefreshingRef.current = false;
            }
        };

        const handleActivity = () => {
            const now = Date.now();
            // Only refresh if 5+ minutes since last activity
            if (now - lastActivityRef.current > 5 * 60 * 1000) {
                lastActivityRef.current = now;
                refreshToken();
            }
        };

        // Track activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, []);

    return null;
};

export default SessionIndicator;

