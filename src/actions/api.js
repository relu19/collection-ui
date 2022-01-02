'use strict';

const SERVER_URI = 'http://localhost:3000/'

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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
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

    return fetch(SERVER_URI + request.url, params)
        .then((res) => res.json())
        .then((response) => {console.log(response)})
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
