import notificationService from '../services/notificationService';
import { getAuthToken, isTokenExpired } from '../utils/tokenUtils';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;

// build url corect + query params
function buildUrl(path = "", query) {
  let url = `${SERVER_URI.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  if (query) {
    const qs = typeof query === "string"
        ? query
        : new URLSearchParams(query).toString();

    url += (url.includes('?') ? '&' : '?') + qs;
  }

  return url;
}

class Actions {

  static get(url, query) {
    return this.makeRequest({
      request: {
        method: 'GET',
        url,
        query,
      }
    });
  }

  static post(data, url) {
    return this.makeRequest({
      request: {
        method: 'POST',
        url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }
    });
  }

  static patch(data, url) {
    return this.makeRequest({
      request: {
        method: 'PATCH',
        url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }
    });
  }

  static put(data, url) {
    return this.makeRequest({
      request: {
        method: 'PUT',
        url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }
    });
  }

  static deleteExtraNumbers(setId, userId) {
    return this.post({ setId, userId }, '/remove-extra-numbers');
  }

  static makeRequest({ request }) {

    const headers = { ...(request.headers || {}) };

    const token = getAuthToken();

    if (token && isTokenExpired(token)) {
      localStorage.removeItem('auth');
      localStorage.removeItem('collector-data');

      notificationService.error(
          'Your session has expired. Please log in again. Refreshing...',
          { duration: 3000 }
      );

      setTimeout(() => window.location.reload(), 3000);

      return Promise.reject({ sessionExpired: true, handled: true });
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No auth token found for request:', request.url);
    }

    const params = {
      method: request.method || 'GET',
      headers,
    };

    if (request.method !== 'GET' && request.body) {
      params.body = request.body;
    }

    const finalUrl = buildUrl(request.url, request.query);

    return fetch(finalUrl, params)
        .then(async (res) => {

          if (res.status === 401) {
            localStorage.removeItem('auth');
            localStorage.removeItem('collector-data');

            notificationService.error(
                'Your session has expired. Please log in again. Refreshing...',
                { duration: 3000 }
            );

            setTimeout(() => window.location.reload(), 3000);

            const err = new Error("Session expired");
            err.sessionExpired = true;
            err.handled = true;
            throw err;
          }

          const text = await res.text();
          return text ? JSON.parse(text) : {};
        })
        .catch((err) => {

          if (err.handled) return Promise.reject(err);

          if (err.message === 'Failed to fetch') {
            notificationService.error(
                'No internet connection or server unreachable.',
                { duration: 5000 }
            );
          }

          throw err;
        });
  }
}

export default Actions;