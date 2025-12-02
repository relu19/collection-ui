'use strict';

import notificationService from '../services/notificationService';

const SERVER_URI = process.env.REACT_APP_SERVER_URI

class Actions {
  /**
   * Make a GET request
   *
   * @param {String} url API url to make request call
   * @param {String} [query] Query string
   * @returns {Promise}
   */
  static get(url, query) {
    const request = {
      method: 'get',
      url,
      query,
    };
    return this.makeRequest({ request });
  }

  /**
   * Make a POST JSON request
   *
   * @param {Object} data The data to be inserted
   * @param {string} url path
   * @returns {Promise}
   */
  static post(data, url) {
    const request = {
      method: 'POST',
      url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    return this.makeRequest({ request });
  }

  static patch(data, url) {
    const request = {
      method: 'PATCH',
      url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    return this.makeRequest({ request });
  }

  static put(data, url) {
    const request = {
      method: 'PUT',
      url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return this.makeRequest({ request });
  }

  /**
   * Delete all extra numbers for a set and user
   * @param {number} setId
   * @param {number} userId
   * @returns {Promise}
   */
  static deleteExtraNumbers(setId, userId) {
    return this.post({ setId, userId }, '/remove-extra-numbers');
  }

  /**
   * Get JWT token from localStorage
   * @returns {string|null}
   */
  static getAuthToken() {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      return authData?.token || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if token is expired by decoding it
   * @param {string} token JWT token
   * @returns {boolean} True if expired
   */
  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      
      if (!decoded.exp) return true;
      
      // exp is in seconds, Date.now() is in milliseconds
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      
      return currentTime >= expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Make a generic request
   *
   * @param {Object} request Request to be made. Must be of the form: {method, url, query [optional]}
   * @param {Function} [callback] Function to be run after the server responds
   * @returns {Promise}
   */
  static makeRequest({ request }) {
    const headers = request.headers || {};
    
    // Add Authorization header if token exists
    const token = this.getAuthToken();
    
    // Check if token is expired before making request
    if (token && this.isTokenExpired(token)) {
      console.error('Token expired. Clearing auth data...');
      localStorage.removeItem('auth');
      localStorage.removeItem('collector-data');
      
      // Show nice notification instead of throwing error
      notificationService.error('Your session has expired. Please log in again. Refreshing...', {
        duration: 3000
      });
      
      // Reload page after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
      // Return rejected promise with a flag to prevent further processing
      return Promise.reject({ sessionExpired: true, handled: true });
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No auth token found for request:', request.url);
    }

    const params = {
      headers,
      method: request.method || 'GET'
    };
    // Don't set the body if it's a GET request as it will crash on Microsoft Edge
    params.body = request.method !== 'GET' && request.body ? request.body : params.body;
    // Do the API Request

    return fetch(SERVER_URI + request.url, params)
        .then(async (res) => {
            // Check for authentication errors
            if (res.status === 401) {
              // Token expired or invalid, clear auth data
              localStorage.removeItem('auth');
              localStorage.removeItem('collector-data');
              console.error('Authentication failed. Please log in again.');
              
              // Show nice notification
              notificationService.error('Your session has expired. Please log in again. Refreshing...', {
                duration: 3000
              });
              
              // Reload page after 3 seconds
              setTimeout(() => {
                window.location.reload();
              }, 3000);
              
              throw { sessionExpired: true, handled: true };
            }
            const text = await res.text();
            return text ? JSON.parse(text) : {};
        })
        .catch((err) => {
            // If error was already handled, don't re-throw
            if (err.handled) {
              return Promise.reject(err);
            }
            
            console.log('err', err);
            // Detect no internet
            if (err.message === 'Failed to fetch') {
                console.error('No internet connection (or no connection to the server).');
                notificationService.error('No internet connection. Please check your network.', {
                  duration: 5000
                });
            }
            throw err; // Re-throw to maintain error handling in calling code
        });
  }

}

export default Actions;
