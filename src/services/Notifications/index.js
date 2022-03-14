import API from './api';
import { NOTIFICATION_ENDPOINT } from './constants';

export function getNotifications(userId, requestPayload = null) {
  return API.post(
    `${NOTIFICATION_ENDPOINT}/get?userId=${userId}`,
    requestPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function updateNotificationStatus(requestPayload = null) {
  return API.put(`${NOTIFICATION_ENDPOINT}/status`, requestPayload);
}

export function updateAllNotifications(requestPayload = null, userId) {
  return API.put(
    `${NOTIFICATION_ENDPOINT}/updateStatus?userId=${userId}`,
    requestPayload
  );
}
