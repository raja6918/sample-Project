import { alertTypes } from './constants';

const checkEmpty = data => {
  return data && Array.isArray(data) && data.length > 0;
};

/**
 * To get alert type which has highest priority from alerts object.
 *
 * @param {Object} alerts - alerts object inside each pairings
 */
export const getPriorityAlertType = alerts => {
  if (alerts) {
    if (checkEmpty(alerts.errorAlerts)) {
      return 'error';
    }
    if (checkEmpty(alerts.warningAlerts)) {
      return 'warning';
    }
    if (checkEmpty(alerts.cautionAlerts)) {
      return 'caution';
    }
    if (checkEmpty(alerts.infoAlerts)) {
      return 'info';
    }
  }

  return null;
};

/**
 * To get color of alert with highest priority for pairing bar.
 *
 * @param {Object} alerts - alerts object inside each pairings
 * @param {string | null} alertLevel - nullable enum: error|warning|caution|info
 */
export const getPriorityColor = (alerts, alertLevel) => {
  const type = alertLevel || getPriorityAlertType(alerts);
  return alertTypes[type] ? alertTypes[type].color : '#000000';
};

/**
 * To get icon of alert with highest priority for pairings.
 *
 * @param {Object} alerts - alerts object inside each pairings
 * @param {string | null} alertLevel - nullable enum: error|warning|caution|info
 */
export const getPriorityIcon = (alerts, alertLevel) => {
  const type = alertLevel || getPriorityAlertType(alerts);
  return alertTypes[type] ? alertTypes[type].icon : null;
};

/**
 * To get color based on alert type.
 *
 * @param {string} type - alert type
 */
export const getAlertColor = type =>
  alertTypes[type] ? alertTypes[type].color : '#000000';

/**
 * To get icon based on alert type.
 *
 * @param {string} type - alert type
 */
export const getIcon = type =>
  alertTypes[type] ? alertTypes[type].icon : null;
