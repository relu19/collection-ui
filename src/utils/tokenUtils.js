/**
 * Decode JWT token without verification (for reading expiration time)
 * @param {string} token JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Check if JWT token is expired
 * @param {string} token JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    
    // Add 1 minute buffer to avoid edge cases
    return currentTime >= expirationTime - 60000;
};

/**
 * Get time remaining until token expires
 * @param {string} token JWT token
 * @returns {number} Milliseconds until expiration, or 0 if expired
 */
export const getTokenTimeRemaining = (token) => {
    if (!token) return 0;
    
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;
    
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const remaining = expirationTime - currentTime;
    
    return remaining > 0 ? remaining : 0;
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null if not found
 */
export const getAuthToken = () => {
    try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        return authData?.token || null;
    } catch (e) {
        return null;
    }
};

/**
 * Check if user session is valid
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = () => {
    const token = getAuthToken();
    return token && !isTokenExpired(token);
};

