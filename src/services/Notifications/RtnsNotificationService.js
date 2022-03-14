import axios from 'axios';

export const baseURL = window.__APP_CONFIG.NOTIFICATION_API || null;
const notificationService = options => {
  const params = {};
  params['headers'] = {};
  params['url'] = options['url'];
  params['method'] = options['type'];
  params['baseURL'] = baseURL;
  if (options['contentType'] !== null && options['contentType'] !== '') {
    params['headers']['Content-Type'] = options['contentType'];
  }
  if (options['dataType'] !== null && options['dataType'] !== '') {
    params['headers']['dataType'] = options['dataType'];
  }
  if (options['data'] !== null && options['data'] !== '') {
    params['data'] = options['data'];
  }
  // Assuming ajax is name the provided by the application
  axios(params)
    .then(r => {
      options['success'](r.data);
    })
    .catch(e => {
      options['error'](e);
    });
};

export default notificationService;
