import store from '../../../../store';
import {
  changeLegsToDeadheads,
  changeDeadheadsToLegs,
} from '../../../../actions/pairings';
import { t } from 'i18next';
import { unmountTooltip } from './tooltip';
import { currentScenario } from '../../../../utils/common';
import { isTreeMode, isSplitMode } from './constants';
import { services } from './iFlightGantt/core';
import { clearDataAndRefetchPane } from './utils';
import { breakPairings, selectAllBreak } from './actions/break';
import { disableJoinMenu, joinActivities, createPairing } from './actions/join';
import { hasEditPermission } from './utils';

import * as pairingService from '../../../../services/Pairings';

const translations = {
  viewAlerts: t('PAIRINGS.contextMenu.menuOptions.viewAlerts'),
  details: t('PAIRINGS.contextMenu.menuOptions.details'),
  break: t('PAIRINGS.contextMenu.menuOptions.break'),
  lock: t('PAIRINGS.contextMenu.menuOptions.lock'),
  unlock: t('PAIRINGS.contextMenu.menuOptions.unlock'),
  editName: t('PAIRINGS.contextMenu.menuOptions.editName'),
  viewName: t('PAIRINGS.contextMenu.menuOptions.viewName'),
  viewTags: t('PAIRINGS.contextMenu.menuOptions.viewTags'),
  editTags: t('PAIRINGS.contextMenu.menuOptions.editTags'),
  editComplement: t('PAIRINGS.contextMenu.menuOptions.editComplement'),
  viewComplement: t('PAIRINGS.contextMenu.menuOptions.viewComplement'),
  suggest: t('PAIRINGS.contextMenu.menuOptions.suggest'),
  impose: t('PAIRINGS.contextMenu.menuOptions.impose'),
  join: t('PAIRINGS.contextMenu.menuOptions.join'),
  internalDeadhead: t('PAIRINGS.contextMenu.menuOptions.internalDeadhead'),
  operatingFlight: t('PAIRINGS.contextMenu.menuOptions.operatingFlight'),
};

const menuOptions = (type, data, readOnly, permissions, { highlights }) => {
  const disabled = !hasEditPermission(permissions);

  let disableJoin = disabled;
  if (
    Array.isArray(highlights) &&
    [
      'multi_flights',
      'multi_pairing_unlocked',
      'mix_pairing_unlocked_flight',
      'multi_dhi',
      'mix_flight_dhi',
    ].includes(type)
  ) {
    disableJoin = disableJoinMenu(highlights) || disabled || readOnly;
  }

  const options = {
    pairing_unlocked: {
      viewAlerts: {
        name: `<span class='left'>${translations.viewAlerts}</span> <span class='right'>A</span>`,
        isHtmlName: true,
        disabled:
          typeof data === 'object' && data !== null && data.alertLevel
            ? false
            : true,
      },
      details: {
        name: `<span class='left'>${translations.details}</span> <span class='right'>D</span>`,
        isHtmlName: true,
      },
      sep1: '---------',
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      sep2: '---------',
      editComplement: {
        name: `<span class='left'>${
          readOnly ? translations.viewComplement : translations.editComplement
        }</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
      // editName: {
      //   name: `<span class='left'>${translations.editName}</span> <span class='right'>N</span>`,
      //   isHtmlName: true,
      //   disabled,
      // },
      editTags: {
        name: `<span class='left'>${
          readOnly ? translations.viewTags : translations.editTags
        }</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    pairing_locked: {
      // For future when lock implemented
      viewAlerts: {
        name: `<span class='left'>${translations.viewAlerts}</span> <span class='right'>A</span>`,
        isHtmlName: true,
        disabled:
          typeof data === 'object' && data !== null && data.alertLevel
            ? false
            : true,
      },
      details: {
        name: `<span class='left'>${translations.details}</span> <span class='right'>D</span>`,
        isHtmlName: true,
      },
      sep1: '---------',
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: true,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      sep2: '---------',
      editComplement: {
        name: `<span class='left'>${translations.viewComplement}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
      // editName: {
      //   name: `<span class='left'>${translations.viewName}</span> <span class='right'>N</span>`,
      //   isHtmlName: true,
      //   disabled,
      // },
      editTags: {
        name: `<span class='left'>${translations.viewTags}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    flight: {
      viewAsInternalDeadhead: {
        name: `<span class='left'>${translations.internalDeadhead}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    multi_flights: {
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: disableJoin,
      },
      viewAsInternalDeadhead: {
        name: `<span class='left'>${translations.internalDeadhead}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    multi_pairing_unlocked: {
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: disableJoin,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: true,
      },
      sep1: '---------',
      editComplement: {
        name: `<span class='left'>${
          readOnly ? translations.viewComplement : translations.editComplement
        }</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
      editTags: {
        name: `<span class='left'>${
          readOnly ? translations.viewTags : translations.editTags
        }</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    multi_pairing_locked: {
      // For future when lock implemented
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: true,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: true,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      sep1: '---------',
      editComplement: {
        name: `<span class='left'>${translations.editComplement}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
      editTags: {
        name: `<span class='left'>${translations.editTags}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
    },
    multi_pairing_locked_unlocked: {
      // For future when lock implemented
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: true,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      sep1: '---------',
      editComplement: {
        name: `<span class='left'>${translations.editComplement}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
      editTags: {
        name: `<span class='left'>${translations.editTags}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
    },
    mix_pairing_unlocked_flight: {
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: disableJoin,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: true,
      },
    },
    mix_pairing_locked_flight: {
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: true,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: true,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
    },
    mix_pairing_locked_unlocked_flight: {
      // For future when lock implemented
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: true,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: disabled || readOnly,
      },
    },
    dhi: {
      viewAsOperatingFlights: {
        name: `<span class='left'>${translations.operatingFlight}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    multi_dhi: {
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: disableJoin,
      },
      viewAsOperatingFlights: {
        name: `<span class='left'>${translations.operatingFlight}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    mix_flight_dhi: {
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: disableJoin,
      },
      viewAsInternalDeadhead: {
        name: `<span class='left'>${translations.internalDeadhead}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
      viewAsOperatingFlights: {
        name: `<span class='left'>${translations.operatingFlight}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled,
      },
    },
    select_all_pairing: {
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: false,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: true, // disabled || readOnly,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: true, // disabled || readOnly,
      },
      sep1: '---------',
      editComplement: {
        name: `<span class='left'>${translations.editComplement}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true, // disabled || readOnly,
      },
      editTags: {
        name: `<span class='left'>${translations.editTags}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true, // disabled || readOnly,
      },
    },
    select_all_mix_pairing_flight_dhi: {
      // For future when lock implemented
      break: {
        name: `<span class='left'>${translations.break}</span> <span class='right'>B</span>`,
        isHtmlName: true,
        disabled: false,
      },
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      lock: {
        name: `<span class='left'>${translations.lock}</span> <span class='right'>L</span>`,
        isHtmlName: true,
        disabled: true, // disabled || readOnly,
      },
      unlock: {
        name: `<span class='left'>${translations.unlock}</span> <span class='right'>U</span>`,
        isHtmlName: true,
        disabled: true, // disabled || readOnly,
      },
    },
    select_all_multi_flights: {
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      viewAsInternalDeadhead: {
        name: `<span class='left'>${translations.internalDeadhead}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
    },
    select_all_multi_dhi: {
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      viewAsOperatingFlights: {
        name: `<span class='left'>${translations.operatingFlight}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
    },
    select_all_mix_flight_dhi: {
      join: {
        name: `<span class='left'>${translations.join}</span> <span class='right'>J</span>`,
        isHtmlName: true,
        disabled: true,
      },
      viewAsInternalDeadhead: {
        name: `<span class='left'>${translations.internalDeadhead}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
      viewAsOperatingFlights: {
        name: `<span class='left'>${translations.operatingFlight}</span> <span class='right'></span>`,
        isHtmlName: true,
        disabled: true,
      },
    },
  };

  return options[type];
};

const menuTitle = t('PAIRINGS.contextMenu.title');
export const getMenuTitle = (
  options,
  $scope,
  { selectAll, pairingsCount, legsCount, dhiCount, cmlCount }
) => {
  if (selectAll) {
    return `${pairingsCount + legsCount + dhiCount + cmlCount} ${menuTitle}`;
  }

  const highlights = $scope.paneObjArr[0]
    ? $scope.paneObjArr[0].getAllGanttHighlights()
    : null;
  if (Array.isArray(highlights) && highlights.length > 1) {
    return `${highlights.length} ${menuTitle}`;
  }

  return null;
};

/**
 * Utility function to get context menu item based on different criteria.
 * Note in future we also need to take care of locked pairings
 *
 * @param {String} type - item | pane | header | time
 * @param {Object} data - pane item
 * @param {Object} $scope
 * @param {boolean} readOnly
 * @param {Object} - {selectAll, pairingsCount, legsCount }
 */
export const getMenuOptions = (
  type,
  data,
  $scope,
  readOnly,
  permissions,
  { selectAll, pairingsCount, legsCount, dhiCount }
) => {
  unmountTooltip();

  const highlights = $scope.paneObjArr[0]
    ? $scope.paneObjArr[0].getAllGanttHighlights()
    : null;

  let optionType;
  if (selectAll) {
    if (pairingsCount > 0 && (legsCount > 0 || dhiCount > 0)) {
      optionType = 'select_all_mix_pairing_flight_dhi';
    } else if (pairingsCount > 0 && (legsCount === 0 || dhiCount === 0)) {
      optionType = 'select_all_pairing';
    } else if (pairingsCount === 0) {
      if (legsCount > 0 && dhiCount === 0) {
        optionType = 'select_all_multi_flights';
      } else if (legsCount === 0 && dhiCount > 0) {
        optionType = 'select_all_multi_dhi';
      } else if (legsCount > 0 && dhiCount > 0) {
        optionType = 'select_all_mix_flight_dhi';
      }
    }
  } else if (Array.isArray(highlights) && highlights.length > 1) {
    let pairings = 0;
    let flights = 0;
    let dhi = 0;
    let locked_pairings = false;
    let unlocked_pairings = false;

    for (const item of highlights) {
      if (item.type === 'PRG') pairings++;
      if (item.type === 'FLT') flights++;
      if (item.type === 'DHI') dhi++;
      if (item.type === 'PRG' && 'isLocked' in item && item.isLocked === true)
        locked_pairings = true;
      if (
        (item.type === 'PRG' && !('isLocked' in item)) ||
        item.isLocked === false
      ) {
        unlocked_pairings = true;
      }
    }
    const locked = locked_pairings ? '_locked' : '';
    const unlocked = unlocked_pairings ? '_unlocked' : '';
    if (pairings === 0 && (flights > 0 || dhi > 0)) {
      if (flights > 0 && dhi === 0) {
        optionType = 'multi_flights';
      } else if (flights === 0 && dhi > 0) {
        optionType = 'multi_dhi';
      } else {
        optionType = 'mix_flight_dhi';
      }
    } else if (pairings > 0 && (flights > 0 || dhi > 0)) {
      optionType = 'mix_pairing' + locked + unlocked + '_flight';
    } else {
      optionType = 'multi_pairing' + locked + unlocked;
    }
  } else {
    if (data) {
      if (data.type === 'PRG') {
        optionType = data.isLocked ? 'pairing_locked' : 'pairing_unlocked';
      }
      if (data.type === 'FLT') {
        optionType = 'flight';
      }
      if (data.type === 'DHI') {
        optionType = 'dhi';
      }
    }
  }

  return menuOptions(optionType, data, readOnly, permissions, {
    highlights,
  });
};

/*********************************  Pane Menu Callbacks  *********************************/

const openPairingDetails = (data, context) => {
  context.setState({ showPairingDetails: true, selectedPairing: data });
};

export const closePairingDetails = context => {
  context.setState({ showPairingDetails: false, selectedPairing: {} });
};

const openPairingAlerts = (data, context) => {
  context.setState({ showPairingAlerts: true, selectedPairing: data });
};

export const closePairingAlerts = context => {
  context.setState({ showPairingAlerts: false, selectedPairing: {} });
};

const openCrewComplement = (data, context) => {
  const highlights = context.$scope.paneObjArr[0]
    ? context.$scope.paneObjArr[0].getAllGanttHighlights()
    : null;
  if (Array.isArray(highlights)) {
    const dataToUpdate = [];
    for (const highlight of highlights) {
      if (highlight.type === 'PRG') {
        dataToUpdate.push(highlight);
      }
    }

    context.setState({
      showCrewComplement: true,
      selectedPairing: dataToUpdate,
    });
  }
};

export const closeCrewComplement = context => {
  context.setState({
    showCrewComplement: false,
    selectedPairing: {},
    isJoinAction: false,
  });
};

const openTags = (data, context) => {
  const highlights = context.$scope.paneObjArr[0]
    ? context.$scope.paneObjArr[0].getAllGanttHighlights()
    : null;
  if (Array.isArray(highlights)) {
    const dataToUpdate = [];
    for (const highlight of highlights) {
      if (highlight.type === 'PRG') {
        dataToUpdate.push(highlight);
      }
    }
    context.setState({
      showTags: true,
      selectedPairing: dataToUpdate,
    });
  }
};

export const closeTags = context => {
  context.setState({ showTags: false, selectedPairing: {} });
};

export const updateCrewComplement = (data, context) => {
  if (data.isJoinAction) {
    for (const crewComposition of data.crewComposition) {
      crewComposition.object = 'positionQuantity';
      crewComposition.quantity =
        crewComposition.quantity === null ? 0 : crewComposition.quantity;
    }

    createPairing(context, data.crewComposition);
  } else {
    clearDataAndRefetchPane(context);
  }
  closeCrewComplement(context);
};

export const updateTags = (data, context) => {
  clearDataAndRefetchPane(context);
  context.setState({ showTags: false, selectedPairing: {} });
};

const updateLock = async (data, context, dataToUpdate) => {
  try {
    const scenario = currentScenario();
    const scenarioID = scenario ? scenario.id : null;
    await pairingService.updatePairings(scenarioID, dataToUpdate);

    const currPaneObj = services.getCurrentPaneObject(
      context.$scope.paneObjArr,
      isTreeMode,
      isSplitMode
    );

    const RTUObj = {
      headersToAddOrUpdate: [],
      headersToRemove: [],
      itemsToAddOrUpdate: data,
      itemsToRemove: [],
      lwId: undefined,
      plot: currPaneObj,
      status: 'CHANGE',
      updateNeeded: false,
    };

    services.updatePane(RTUObj, context.$scope, false);
  } catch (error) {
    if (error.response) {
      context.props.reportError({ error: error });
    } else {
      context.props.reportError({
        errorType: 'Snackbar',
        isHtml: true,
        error: error,
      });
    }
    console.error(error);
  }
};

const lock = (data, context, lock = true) => {
  const highlights = context.$scope.paneObjArr[0]
    ? context.$scope.paneObjArr[0].getAllGanttHighlights()
    : null;
  if (Array.isArray(highlights)) {
    const dataToUpdate = [];
    for (const highlight of highlights) {
      const condition = 'isLocked' in highlight;
      const checkIfLocked = lock ? !condition : condition;

      if (
        (highlight.type === 'PRG' && checkIfLocked) ||
        highlight.isLocked === false
      ) {
        dataToUpdate.push({ id: highlight.id, isLocked: lock });
      }
      highlight.isLocked = lock;
    }
    updateLock(highlights, context, dataToUpdate);
  }
};

const changeToInternalDeadHead = (data, context) => {
  const highlights = context.$scope.paneObjArr[0]
    ? context.$scope.paneObjArr[0].getAllGanttHighlights()
    : null;
  if (Array.isArray(highlights)) {
    // Extraction of flights from highlights
    const legIds = [];
    const itemsToAddOrUpdate = [];
    for (const highlight of highlights) {
      if (highlight.type === 'FLT') {
        legIds.push('' + highlight.id);
        itemsToAddOrUpdate.push({
          ...highlight,
          type: 'DHI',
          ganttItemType: 'sierraFlights',
        });
      }
    }

    // Update pane by calling updatePane method in generic gantt
    const currPaneObj = services.getCurrentPaneObject(
      context.$scope.paneObjArr,
      isTreeMode,
      isSplitMode
    );
    const RTUObj = {
      headersToAddOrUpdate: [],
      headersToRemove: [],
      itemsToAddOrUpdate,
      itemsToRemove: [],
      lwId: undefined,
      plot: currPaneObj,
      status: 'CHANGE',
      updateNeeded: false,
    };
    services.updatePane(RTUObj, context.$scope, false);

    // Update store
    store.dispatch(changeLegsToDeadheads(context.timelineId, legIds));
  }
};

const changeToOperatingFlights = (data, context) => {
  const highlights = context.$scope.paneObjArr[0]
    ? context.$scope.paneObjArr[0].getAllGanttHighlights()
    : null;
  if (Array.isArray(highlights)) {
    // Extraction of flights from highlights
    const dhiIds = [];
    const itemsToAddOrUpdate = [];
    for (const highlight of highlights) {
      if (highlight.type === 'DHI') {
        dhiIds.push('' + highlight.id);
        itemsToAddOrUpdate.push({
          ...highlight,
          type: 'FLT',
          ganttItemType: 'sierraFlights',
        });
      }
    }

    // Update pane by calling updatePane method in generic gantt
    const currPaneObj = services.getCurrentPaneObject(
      context.$scope.paneObjArr,
      isTreeMode,
      isSplitMode
    );
    const RTUObj = {
      headersToAddOrUpdate: [],
      headersToRemove: [],
      itemsToAddOrUpdate,
      itemsToRemove: [],
      lwId: undefined,
      plot: currPaneObj,
      status: 'CHANGE',
      updateNeeded: false,
    };
    services.updatePane(RTUObj, context.$scope, false);

    // Update store
    store.dispatch(changeDeadheadsToLegs(context.timelineId, dhiIds));
  }
};

const handleBreakPairings = context => {
  if (context.selectAll) {
    selectAllBreak(context);
  } else {
    breakPairings(context);
  }
};

export const handleMenuCallback = (menukey, data, context) => {
  switch (menukey) {
    case 'details':
      openPairingDetails(data, context);
      break;
    case 'viewAlerts':
      openPairingAlerts(data, context);
      break;
    case 'editComplement':
      openCrewComplement(data, context);
      break;
    case 'lock':
      lock(data, context, true);
      break;
    case 'unlock':
      lock(data, context, false);
      break;
    case 'editTags':
      openTags(data, context);
      break;
    case 'break':
      handleBreakPairings(context);
      break;
    case 'join':
      joinActivities(context);
      break;
    case 'viewAsInternalDeadhead':
      changeToInternalDeadHead(data, context);
      break;
    case 'viewAsOperatingFlights':
      changeToOperatingFlights(data, context);
      break;
    default:
  }
};
