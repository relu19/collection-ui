'use strict';

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
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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
              // Optionally redirect to login or refresh page
              console.error('Authentication failed. Please log in again.');
              throw new Error('Authentication required');
            }
            const text = await res.text();
            return text ? JSON.parse(text) : {};
        })
        .catch((err) => {
            console.log('err', err);
            // Detect no internet
            if (err.message === 'Failed to fetch') {
                console.error('No internet connection (or no connection to the server).');
            }
            throw err; // Re-throw to maintain error handling in calling code
        });
  }

}

export default Actions;
