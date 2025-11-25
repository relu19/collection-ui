import React, { useState, useEffect } from 'react';
import { getAuthToken, getTokenTimeRemaining } from '../../utils/tokenUtils';
import './style.scss';

const SessionIndicator = () => {
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const updateTimeRemaining = () => {
            const token = getAuthToken();
            if (!token) {
                setTimeRemaining(null);
                setShowWarning(false);
                return;
            }

            const remaining = getTokenTimeRemaining(token);
            setTimeRemaining(remaining);

            // Show warning if less than 24 hours remaining
            const hoursRemaining = remaining / (1000 * 60 * 60);
            setShowWarning(hoursRemaining < 24 && hoursRemaining > 0);
        };

        // Update immediately
        updateTimeRemaining();

        // Update every minute
        const interval = setInterval(updateTimeRemaining, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (!timeRemaining) return null;

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (!showWarning) return null;

    return (
        <div className="session-indicator">
            <span className="session-warning">
                ⚠️ Session expires in {days > 0 ? `${days}d ` : ''}{hours}h
            </span>
        </div>
    );
};

export default SessionIndicator;

