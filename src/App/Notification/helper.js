/**
 * @function createRequest - Used to create  request to register different notifcation types
 * @param {string} type
 * @param {object} filterCriteria
 */

import { alertTypes, showAbleAlerts } from './constants';
import storage from '../../utils/storage';
import SolverLinkCreatorComp from './SolverLinkCreator';
import PairingLinkCreator from './PairingLinkCreator';

export const createRequest = (type, filterCriteria) => {
  const request = {
    notificationType: type,
    filterCriteria: filterCriteria,
  };
  return request;
};

export const notificationCreator = (notification, t) => {
  let response = { snackType: '', message: null };
  switch (notification.eventType) {
    case 'solver': {
      if (notification['status'] !== 'Done-stopped') {
        // don't show ERROR toast when stopped by the user.
        response = {
          ...response,
          autoHideDuration:
            notification['alertType'] === 'ERROR' ? 3600000 : 5000,
          snackType: alertTypes[notification['alertType']],
          message: t(`NOTIFICATIONS.solver.${notification['alertType']}`, {
            solverRequestName: notification['solverName'],
            scenarioId: notification['scenarioName'],
            urlObject: `/solver/${notification['scenarioId']}/${notification['solverId']}`,
          }),
          key: notification['eventId'],
          renderers: {
            link: SolverLinkCreatorComp,
            paragraph: 'span',
          },
        };
      }
      break;
    }
    case 'pairing': {
      response = {
        ...response,
        autoHideDuration: 3600000,
        snackType: 'warning',
        message: t(`NOTIFICATIONS.pairing`),
        key: `pairing`,
        renderers: {
          link: PairingLinkCreator,
          paragraph: 'span',
        },
      };
      break;
    }
    default:
  }
  return response;
};

export const filterResponse = (response, t) => {
  const updatedResponse = response['payload']['data'];
  const alertType = updatedResponse['alertType'];
  const currentUser = storage.getItem(`loggedUser`);
  let notify = false;
  if (alertType && currentUser) {
    notify =
      showAbleAlerts.includes(alertType) &&
      currentUser.id.toString() === updatedResponse[`jobOwner`];
  }
  return {
    ...updatedResponse,
    notify,
    notifyObject: notificationCreator(updatedResponse, t),
  };
};
