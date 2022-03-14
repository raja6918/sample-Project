import moment from 'moment';
import storage from '../../utils/storage';
import { t } from 'i18next';

export function clearSolverInfoInStorage() {
  storage.removeItem('solverRequestSelected');
  storage.removeItem('solverRequests');
}

export function refreshScenarioInStorage(scenario) {
  const locallyOpenedScenario = storage.getItem('openScenario') || {};
  if (locallyOpenedScenario.id !== scenario.id) {
    /* When user changes scenario, we clear any data related with solver requests*/
    clearSolverInfoInStorage();
  }
  storage.setItem('openScenario', scenario);
  storage.setItem('lastOpenedScenario', '');
}

export const timeModifier = (time = null) => {
  let modifiedTime = null;
  if (time)
    modifiedTime = moment.utc(time).format(t('NOTIFICATION.defaultTimeFormat'));
  return modifiedTime;
};
