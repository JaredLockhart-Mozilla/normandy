const API_ROOT = '/api/v1/';

export default async function apiFetch(url, options = {}) {
  let queryString = '';

  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  headers.append('X-CSRFToken', document.getElementsByTagName('html')[0].dataset.csrf);

  const settings = {
    headers,
    credentials: 'same-origin',
    ...options,
  };

  // Convert `data` to `body` or querystring if necessary.
  if ('data' in settings) {
    if ('body' in settings) {
      throw new Error('Only pass one of `settings.data` and `settings.body`.');
    }

    const method = (settings.method || 'GET').toUpperCase();

    if (method !== 'GET' && method !== 'HEAD') {
      settings.body = JSON.stringify(settings.data);
    } else {
      queryString = '?';
      Object.keys(settings.data).forEach(key => {
        queryString += `${key}=${encodeURIComponent(settings.data[key])}&`;
      });
      queryString.slice(0, -1);
    }

    delete settings.data;
  }

  const response = await fetch(`${API_ROOT}${url}${queryString}`, settings);
  return response.json();
}
