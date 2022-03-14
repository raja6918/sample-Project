import scenariosService from '../../services/Scenarios';
import templateService from '../../services/Templates';

import history from './../../history';
import storage from '../../utils/storage';
import { checkPermission } from '../../utils/common';
import scopes from '../../constants/scopes';

import { EDIT, READ_ONLY, FREE } from './constants';

export const redirectToDataHome = (
  scenarioId,
  scenarioName,
  editMode = false,
  readOnly = false
) => {
  const route = {
    pathname: `/data/${scenarioId}`,
    state: {
      openItemId: scenarioId,
      openItemName: scenarioName,
      editMode,
      readOnly,
    },
  };
  history.push(route);
};

export function findScenarioIndexAndLocation(scenarioId) {
  const scenariosArrays = [
    'scenariosOlder',
    'scenariosToday',
    'scenariosThisMonth',
  ];

  /*
  Find for the scenarioId in one of the scenarios
  arrays and return index and array name
  */
  for (let i = 0; i < scenariosArrays.length; i++) {
    const scenarioArray = scenariosArrays[i];
    const scenarioIndex = this.state[scenarioArray].findIndex(
      scenario => scenario.id === scenarioId
    );
    if (scenarioIndex >= 0) {
      return [scenarioIndex, scenarioArray];
    }
  }

  return [-1, null];
}

export function getStateToProcessItem(source) {
  const stateToUpdate = {
    openLoader: true,
    titleLoader: source.isTemplate
      ? this.props.t('TEMPLATES.opening')
      : this.props.t('SCENARIOS.process.open'),
    subtitleLoader: source.name,
    currentScenario: source,
  };

  if (source.status === EDIT) {
    stateToUpdate.openLoader = false;
    stateToUpdate.titleLoader = '';
    stateToUpdate.subtitleLoader = '';
  }

  if (source.status === READ_ONLY) {
    stateToUpdate.openLoader = false;
  }

  return stateToUpdate;
}

function clearSolverInfoInStorage() {
  storage.removeItem('solverRequestSelected');
  storage.removeItem('solverRequests');
}

function refreshScenarioInStorage(scenario) {
  const locallyOpenedScenario = storage.getItem('openScenario') || {};
  if (locallyOpenedScenario.id !== scenario.id) {
    /* When user changes scenario, we clear any data related with solver requests*/
    clearSolverInfoInStorage();
  }
  storage.setItem('openScenario', scenario);
  storage.setItem('lastOpenedScenario', '');
}

export function openItem(item) {
  if (item.isTemplate) {
    templateService
      .openTemplate(item.id)
      .then(openedScenario => {
        refreshScenarioInStorage(openedScenario);
        redirectToDataHome(
          item.id,
          item.name,
          item.isTemplate,
          item.status === READ_ONLY
        );
      })
      .catch(error => {
        this.setState({ openLoader: false }, this.props.reportError({ error }));
      });
  } else {
    scenariosService
      .openScenario(item.id)
      .then(openedScenario => {
        refreshScenarioInStorage(openedScenario);
        redirectToDataHome(
          item.id,
          item.name,
          item.isTemplate,
          item.status === READ_ONLY
        );
      })
      .catch(error => {
        this.setState({ openLoader: false }, this.props.reportError({ error }));
      });
  }
}

export function closeItem(item) {
  if (item.isTemplate) {
    return templateService.closeTemplate(item.id);
  } else {
    return scenariosService.closeScenario(item.id);
  }
}

export function closeAndOpenItem(itemToClose, itemToOpen) {
  closeItem
    .call(this, itemToClose)
    .then(() => {
      openItem.call(this, itemToOpen);
    })
    .catch(error => {
      this.setState({ openLoader: false }, this.props.reportError({ error }));
    });
}

export async function handleOpenItem(
  item,
  readOnlyHandler,
  hasManagePermission = false
) {
  const stateToUpdate = getStateToProcessItem.call(this, item);
  this.setState(stateToUpdate);

  try {
    const itemDetails = await scenariosService.getScenarioDetails(item.id);
    if (hasManagePermission) {
      switch (itemDetails.status) {
        case FREE: {
          const locallyOpenedScenario = storage.getItem('openScenario');
          if (!locallyOpenedScenario) {
            openItem.call(this, item);
          } else {
            closeAndOpenItem.call(this, locallyOpenedScenario, item);
          }

          break;
        }
        case EDIT: {
          const locallyOpenedScenario = storage.getItem('openScenario');

          if (!!locallyOpenedScenario && locallyOpenedScenario.id !== item.id) {
            await closeItem(locallyOpenedScenario);
            refreshScenarioInStorage(item);
          }

          redirectToDataHome(item.id, item.name, item.isTemplate);
          break;
        }
        case READ_ONLY: {
          readOnlyHandler(itemDetails);
          break;
        }
        default:
          break;
      }
    } else {
      readOnlyHandler(itemDetails);
    }
  } catch (error) {
    this.setState({ openLoader: false }, this.props.reportError({ error }));
  }
}
