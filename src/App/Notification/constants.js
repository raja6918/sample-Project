export const rtnsServiceName = 'ajax';
export const notificationTypes = ['solver', 'generic'];
export const showAbleAlerts = ['SUCCESS', 'ERROR'];
export const alertTypes = {
  INFO: 'info',
  WARNING: '',
  ERROR: 'error',
  SUCCESS: 'success',
  NOTICE: 'info',
};
export const offlineModeCheckURL = window.__APP_CONFIG
  ? window.__APP_CONFIG.NOTIFICATION_API + '/sprout/rtns/client/register'
  : '';
