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
   * Make a generic request
   *
   * @param {Object} request Request to be made. Must be of the form: {method, url, query [optional]}
   * @param {Function} [callback] Function to be run after the server responds
   * @returns {Promise}
   */
  static makeRequest({ request }) {
    const headers = request.headers || {};

    const params = {
      headers,
      method: request.method || 'GET'
    };
    // Don't set the body if it's a GET request as it will crash on Microsoft Edge
    params.body = request.method !== 'GET' && request.body ? request.body : params.body;
    // Do the API Request

    const _handleResponse = async (response) => {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }

    return fetch(SERVER_URI + request.url, params)
        .then( async (res) => await _handleResponse(res))
        .then((response) => response)
        .catch((err) => {
          console.log('err', err);
          // Detect no internet
          if (err.message === 'Failed to fetch') {
            console.error('No internet connection (or no connection to the server).');
          }
        });
  }

}

export default Actions;
