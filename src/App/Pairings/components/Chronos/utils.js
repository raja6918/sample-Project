import moment from 'moment';
import { t } from 'i18next';
import { iFlightEventBus } from './iFlightGantt/iflight_event_bus';
import { services } from './iFlightGantt/core';
import storage from '../../../../utils/storage';
import scopes from '../../../../constants/scopes';
import { checkPermission } from '../../../../utils/common';
import store from '../../../../store';
import { unmountTooltip } from './tooltip';
import { removeTimelineKeys } from '../../../../actions/pairings';
import {
  isTreeMode,
  isSplitMode,
  RELATIVE_DAY_BUFFER,
  TYPE_RENDER_MAP,
  TYPE_GANTT_ITEM_MAP,
} from './constants';

export const isFunction = value => {
  return typeof value === 'function';
};

export const generateLinearGradient = (context, colors = '') => {
  const colorsArr = colors.split(',');
  const gradient = context.createLinearGradient(0, 0, 0, 25);
  gradient.addColorStop(0, colorsArr[0]);
  gradient.addColorStop(1, colorsArr[1]);
  return gradient;
};

/**
 * Utility function to convert time to milliseconds
 *
 * @param {Date} date
 *
 * @returns {number} date in milliseconds
 */
export const convertTime = date => {
  return parseInt(moment.utc(date).format('x'), 10);
};

export const generateRowIds = length => {
  const rowHeaderIds = [];
  for (let i = 1; i <= length; i++) {
    rowHeaderIds.push(i);
  }
  return rowHeaderIds;
};

export const generateRowHeaders = (length, startIndex = 0) => {
  const rowHeaders = [];
  for (let i = startIndex; i < length; i++) {
    rowHeaders.push({
      id: i,
    });
  }
  return rowHeaders;
};

export const pairingResponseConvertor = (pairings, rowIds, idRowMap) => {
  const data = [];
  const startIndex = rowIds[0] > 0 ? rowIds[0] - 1 : rowIds[0];
  const endIndex = rowIds[rowIds.length - 1] + 1;

  for (const pairing of pairings) {
    const hangarId = idRowMap[pairing.id];

    data.push({
      startDate: convertTime(pairing.startDateTime),
      endDate: convertTime(pairing.endDateTime),
      hangarId,
      modifyPermission: true, // To enable drag and drop
      altType: pairing.alertLevel, // We need to change alertLevel since safe eval is removing it to draw border color
      ...pairing,
    });
  }

  const rowHeaders = generateRowHeaders(endIndex, startIndex);

  return {
    rowHeaders,
    data,
  };
};

export const flightResponseConvertor = (
  flights,
  rowIds,
  legsIdRowMap,
  dhiIdRowMap,
  cmlIdRowMap
) => {
  const data = [];
  const startIndex = rowIds[0] > 0 ? rowIds[0] - 1 : rowIds[0];
  const endIndex = rowIds[rowIds.length - 1] + 1;

  for (const flight of flights) {
    let hangarId = legsIdRowMap[flight.id];

    if (!hangarId) {
      hangarId = dhiIdRowMap[flight.id];
      flight.type = 'DHI';
    }

    if (!hangarId) {
      hangarId = cmlIdRowMap[flight.id];
      flight.type = 'CML';
      if (!flight.startDateTime) {
        flight.startDateTime = `${flight.startDate}T${flight.startTime}`;
      }

      if (!flight.endDateTime) {
        flight.endDateTime = `${flight.startDate}T${flight.endTime}`;
      }
    }

    data.push({
      ...flight,
      departureStationCode:
        flight.departureStationCode || flight.departureStation || '',
      arrivalStationCode:
        flight.arrivalStationCode || flight.arrivalStation || '',
      startDate: convertTime(flight.startDateTime),
      endDate: convertTime(flight.endDateTime),
      modifyPermission: true, // To enable drag and drop
      hangarId,
    });
  }

  const rowHeaders = generateRowHeaders(endIndex, startIndex);

  return {
    rowHeaders,
    data,
  };
};

/**
 * To emit an event to update the original pane if the drag pane and drop panes are different
 *
 * @param {Object} item - dropItemCallback parameter
 * @param {Array} modifiedItems
 */
export const updateDragPane = (item, modifiedItems) => {
  if (item.dragDropObj.dragPane !== item.dragDropObj.dropPane) {
    const dragPane = item.dragDropObj.dragPane;
    iFlightEventBus.emitEvent('dropPaneEvent', [dragPane, modifiedItems]);
  }
};

export const getRelativeDay = (val, startDate) => {
  let relativeDay =
    Math.ceil(Math.abs(val - startDate) / (1000 * 60 * 60 * 24)) -
    RELATIVE_DAY_BUFFER;
  if (relativeDay >= 0) relativeDay++;
  return relativeDay;
};

/********************************* Custom Pane Toolbars Utility methods starts from here  *********************************/
const togglePaneIcons = ganttRef => {
  const icons = ganttRef.shadowRoot.querySelectorAll(
    '.gantt_pane_icons_containter li'
  );
  for (let i = 0; i < icons.length; i++) {
    if (icons[i].style.display !== 'none') {
      icons[i].classList.remove('disable-icon');
    } else {
      icons[i].classList.add('disable-icon');
    }
  }
};

const togglePaneContainer = (ganttRef, context) => {
  const container = ganttRef.shadowRoot.querySelector('.gantt-container');
  if (container) {
    const rect = container.getBoundingClientRect();
    if (rect.height <= 40) {
      container.classList.add('minimized');
      context.setState({ minimized: true });
    } else {
      container.classList.remove('minimized');
      context.setState({ minimized: false });
    }
  }
};

/**
 * Since handlePaneToolBarEvent is not handling all the edge cases we called this function in reinitializeZoomVariables method which is called after pane resize.
 * This is to handle scenario where 2nd pane minimized then 3rd pane minimize. If we don't call togglePaneContainer 2nd pane action bar restored.
 */
export const togglePaneToolBar = (ganttRef, context) => {
  try {
    togglePaneIcons(ganttRef);
    togglePaneContainer(ganttRef, context);
  } catch (error) {
    console.error(error);
  }
};

const minimizePaneContainer = (ganttRef, context) => {
  const container = ganttRef.shadowRoot.querySelector('.gantt-container');
  if (container) {
    container.classList.add('minimized');
    context.setState({ minimized: true });
  }
};

const maximizePaneContainer = ganttRef => {
  const container = ganttRef.shadowRoot.querySelector('.gantt-container');
  if (container) {
    container.classList.add('maximized');
  }
};

export const restorePaneContainer = (ganttRef, context) => {
  const container = ganttRef.shadowRoot.querySelector('.gantt-container');
  if (container) {
    container.classList.remove('minimized');
    container.classList.remove('maximized');
    context.setState({ minimized: false });
  }
};

export const toggleSelectAllIcon = context => {
  const element = context.ganttRef
    ? context.ganttRef.shadowRoot.querySelector('.select-all')
    : null;
  if (element) {
    if (context.selectAll === true) {
      element.classList.add('disable-icon');
    } else {
      element.classList.remove('disable-icon');
    }
  }
};

export const disableSelectAllIcon = context => {
  const element = context.ganttRef
    ? context.ganttRef.shadowRoot.querySelector('.select-all')
    : null;
  if (element) {
    element.classList.add('disable-icon');
  }
};

/**
 * Utility function to add gantt_pane_ul_focused class from gantt action bar on pane and item click
 *
 * @param {Object} ganttRef - web-component ref
 */
export const addPaneFocusClass = ganttRef => {
  if (ganttRef) {
    const ulElement = ganttRef.shadowRoot.querySelector(
      `a.gantt_pane_icons_wrap ul`
    );
    if (ulElement) {
      ulElement.classList.add('gantt_pane_ul_focused');
    }
  }
};

/**
 * Utility function to remove gantt_pane_ul_focused class from gantt action bar on pane and item click
 *
 * @param {Object} ganttRef - web-component ref
 */
export const removePaneFocusClass = ganttRef => {
  if (ganttRef) {
    const ulElement = ganttRef.shadowRoot.querySelector(
      `a.gantt_pane_icons_wrap ul`
    );
    if (ulElement) {
      ulElement.classList.remove('gantt_pane_ul_focused');
    }
  }
};

export const handlePaneToolBarEvent = (args, plotLabel, ganttRef, context) => {
  try {
    const [eventName, pageId, pane] = args;
    if (eventName === 'paneMinimize') {
      if (pane === plotLabel) {
        removePaneFocusClass(ganttRef);
        minimizePaneContainer(ganttRef, context);
      } else {
        restorePaneContainer(ganttRef, context);
      }
    }
    if (eventName === 'paneMaximize') {
      if (pane === plotLabel) {
        restorePaneContainer(ganttRef, context);
        maximizePaneContainer(ganttRef);
      } else {
        removePaneFocusClass(ganttRef);
        minimizePaneContainer(ganttRef, context);
      }
    }

    if (eventName === 'paneRestore') {
      if (pane === plotLabel) {
        addPaneFocusClass(ganttRef);
      }
      restorePaneContainer(ganttRef, context);
    }

    if (eventName === 'paneClose') {
      restorePaneContainer(ganttRef, context);

      if (pane === plotLabel) {
        removePaneFocusClass(ganttRef);
        context.selectAll = false;
        toggleSelectAllIcon(context);
        context.handleResetFilter();
      }

      // To fix the know bug in closePane - When we minimize 2nd and 3rd pane and close 2nd pane then 3rd pane is not properly restored since minimized class is not removed.
      const panes = document.querySelectorAll('.pane_h');
      for (let i = 0; i < panes.length; i++) {
        panes[i].classList.remove('minimized');
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const attachSlot = iconContainer => {
  const slotEl = document.createElement('slot');
  slotEl.setAttribute('name', 'timeline-label');
  iconContainer.appendChild(slotEl);
};

const attachDivider = iconContainer => {
  const dividerEl = document.createElement('li');
  dividerEl.setAttribute('class', 'divider');

  const spanEl = document.createElement('span');
  spanEl.setAttribute('class', 'v-line');

  dividerEl.appendChild(spanEl);
  iconContainer.insertBefore(dividerEl, iconContainer.childNodes[3]);
};

const tooltipConfiguration = {
  filter: {
    left: '97%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.filter'),
  },
  clear: {
    left: '84%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.clear'),
  },
  'select-all': {
    left: '71%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.select-all'),
  },
  min: {
    left: '54%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.min'),
  },
  max: {
    left: '41%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.max'),
  },
  restore: {
    left: '28%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.restore'),
  },
  close_icon: {
    left: '15%',
    innerHTML: t('PAIRINGS.paneActionBar.tooltip.close_icon'),
  },
};
const attachToolTips = (ganttRef, iconContainer) => {
  const tooltipEl = document.createElement('div');
  tooltipEl.setAttribute('class', 'tooltip');
  iconContainer.appendChild(tooltipEl);

  const icons = ganttRef.shadowRoot.querySelectorAll(
    '.gantt_pane_icons_containter li'
  );

  for (let i = 0; i < icons.length; i++) {
    icons[i].title = '';
    const config = tooltipConfiguration[icons[i].className.split(' ')[1]];
    let timer;
    if (config) {
      icons[i].addEventListener('mouseover', () => {
        unmountTooltip();
        timer = setTimeout(() => {
          unmountTooltip();
          tooltipEl.style.display = 'block';
          tooltipEl.style.left = config.left;
          tooltipEl.innerHTML = config.innerHTML;
        }, 1000);
      });

      icons[i].addEventListener('mouseout', () => {
        clearTimeout(timer);
        tooltipEl.style.display = 'none';
        tooltipEl.innerHTML = '';
      });
    }
  }
};

export const setupPaneToolBar = ganttRef => {
  try {
    const iconContainer = ganttRef.shadowRoot.querySelector(
      '.gantt_pane_icons_containter ul'
    );

    attachSlot(iconContainer);
    attachDivider(iconContainer);
    attachToolTips(ganttRef, iconContainer);
  } catch (error) {
    console.error(error);
  }
};
/********************************* Custom Pane Toolbars Utility methods end  *********************************/

/**
 * Added as a temporary fix for the chronos bug - when you open muliple panes and apply step zoom immediately the setupTickGeneration is injecting Infinity of toFixed
 */
const resizePane = services.resizePane;
// eslint-disable-next-line func-names
services.resizePane = function() {
  try {
    // eslint-disable-next-line prefer-rest-params
    return resizePane.apply(this, arguments);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Added as a temporary fix for the chronos bug - sometimes when you open contextmenu the rowObject become empty in plot.highlightAnEntity.
 * Unable to reproduce it but added this fix to gracefully handle the situation.
 */
export const highlightAnEntityWithErrorHandler = plot => {
  const highlightAnEntity = plot.highlightAnEntity;
  // eslint-disable-next-line func-names
  plot.highlightAnEntity = function() {
    try {
      // eslint-disable-next-line prefer-rest-params
      return highlightAnEntity.apply(this, arguments);
    } catch (error) {
      console.error(error);
    }
  };
};

/**
 * To get filter payload based on filter data stored in session storage.
 *
 * @param {number} timelineId - 1 | 2 | 3
 */
export const getFilterPayload = timelineId => {
  let payload = {};
  payload = storage.getItem(`timelineFilter${timelineId}`);

  if (payload) {
    return {
      type: payload.type,
      ganttFilterCriteria: payload.filterCriteria,
    };
  }
  return payload;
};

/**
 * To get filter render based on filter data stored in session storage.
 *
 * @param {number} timelineId - 1 | 2 | 3
 * @param {string} defaultRenderer - pairings | legs | empty
 * @param {string} dataMapRenderer - pairings | legs | empty
 */
export const getFilterRenderer = (
  timelineId,
  defaultRenderer,
  dataMapRenderer
) => {
  const payload = storage.getItem(`timelineFilter${timelineId}`);

  if (payload) {
    return payload.render;
  }
  return dataMapRenderer || defaultRenderer;
};

export const removeFilterFromStore = timelineId => {
  storage.removeItem(`timelineFilter${timelineId}`);
  storage.removeItem(`timelineLastFilter${timelineId}`);
};

/********************************* New Pairing/Flight Pagination Utility methods starts from here  *********************************/
export const getRowCountFromKeyList = keyList => {
  let count = 0;
  if (Array.isArray(keyList)) {
    for (let i = 0; i < keyList.length; i++) {
      count++;
    }
  }
  return count;
};

export const generateIdRowMap = keyList => {
  const map = {};
  if (Array.isArray(keyList)) {
    for (let i = 0; i < keyList.length; i++) {
      const row = keyList[i];
      for (let j = 0; j < row.length; j++) {
        map[row[j]] = i + 1;
      }
    }
  }
  return map;
};

export const getIdsFromRowIds = (keyList, rowIds) => {
  const ids = [];
  let count = 0;
  if (Array.isArray(keyList) && Array.isArray(rowIds)) {
    for (let i = 0; i < rowIds.length; i++) {
      const row = keyList[rowIds[i] - 1];
      count += row.length;
      ids.push(row);
    }
  }
  return [ids, count];
};

export const generateEmptyKeyList = length => {
  return Array.from(Array(length), () => []);
};
/********************************* New Pairing/Flight Pagination Utility methods End here  *********************************/

/**
 * Utility function to clear all activities in current pane and refetch data by calling getGanttItems.
 *
 * @param {context} - Pane Component's this context
 */
export const clearDataAndRefetchPane = context => {
  context.ganttRef._prevRequest = {};
  const currPaneObj = services.getCurrentPaneObject(
    context.$scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  currPaneObj.clearDataAndRefetchDataForGantt();
};

/**
 * Utility function to clear all activities in current pane and redraw again without data fetch.
 * This method is much faster than clearDataAndRefetchPane.
 *
 * @param {context} - Pane Component's this context
 */
export const reDrawPane = context => {
  context.ganttRef._prevRequest = {};
  const currPaneObj = services.getCurrentPaneObject(
    context.$scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  currPaneObj.draw();
};

/**
 * Utility function to clear all selected highlights in a pane.
 *
 * @param {context} - Pane Component's this context
 */
export const clearHighlights = context => {
  const currPaneObj = services.getCurrentPaneObject(
    context.$scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );
  currPaneObj.clearAllhighlights();
};

/**
 * To emit an event to clear and refetch in required panes.
 *
 * @param {Array} timelineIds
 */
export const emitClearDataAndRefetchPaneEvent = timelineIds => {
  iFlightEventBus.emitEvent('clearDataAndRefetchPaneEvent', [timelineIds]);
};

/**
 * Utility function to update activities in a pane without refetching it.
 *
 * @param {context} - Pane Component's this context
 * @param {Array} itemsToAddOrUpdate - activities details
 * @param {Array} itemsToRemove - activities details | highlights
 */
export const updatePane = (context, itemsToAddOrUpdate, itemsToRemove) => {
  const currPaneObj = services.getCurrentPaneObject(
    context.$scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  const RTUObj = {
    headersToAddOrUpdate: [],
    headersToRemove: [],
    itemsToAddOrUpdate,
    itemsToRemove,
    lwId: undefined,
    plot: currPaneObj,
    status: 'CHANGE',
    updateNeeded: false,
  };

  services.updatePane(RTUObj, context.$scope, false);
};

/**
 * Utility function to trigger updatePaneEvent event to update all panes after break and join.
 *
 * @param {Array} itemsToAddOrUpdate
 * @param {Array} itemsToRemove
 */
export const triggerPaneUpdateEvent = (itemsToAddOrUpdate, itemsToRemove) => {
  iFlightEventBus.emitEvent('updatePaneEvent', [
    itemsToAddOrUpdate,
    itemsToRemove,
  ]);
};

/**
 * The utility function to filter out the activities that needed to be updated or removed
 * in a particular pane by checking whether it is present in idRowMap of that pane.
 * If any of activity present we call updatePane to update activities in a pane without refetching it.
 *
 * @param {*} context
 * @param {*} itemsToAddOrUpdate
 * @param {*} itemsToRemove
 */
export const filterAndUpdatePane = (
  context,
  itemsToAddOrUpdate,
  itemsToRemove
) => {
  let needUpdate = false;
  const timelineId = context.timelineId;
  const pairingMap = context.props.pairingMap;
  const idRowMap = pairingMap[timelineId]
    ? pairingMap[timelineId].idRowMap
    : null;

  if ((itemsToAddOrUpdate.length > 0 || itemsToRemove.length > 0) && idRowMap) {
    const filteredItemsToAddOrUpdate = [];
    const filteredItemsToRemove = [];
    const itemsToRemoveInStore = [];

    for (const item of itemsToAddOrUpdate) {
      const idRowMapRender = idRowMap[TYPE_RENDER_MAP[item.type]];
      if (idRowMapRender[item.id]) {
        needUpdate = true;
        const updatedItem = {
          ...item,
          hangarId: idRowMapRender[item.id],
          modifyPermission: true,
          altType: item.alertLevel,
          ganttItemType: TYPE_GANTT_ITEM_MAP[item.type],
          startDate: convertTime(item.startDateTime),
          endDate: convertTime(item.endDateTime),
        };
        filteredItemsToAddOrUpdate.push(updatedItem);
      }
    }

    for (const item of itemsToRemove) {
      const idRowMapRender = idRowMap[TYPE_RENDER_MAP[item.type]];
      if (idRowMapRender[item.id]) {
        needUpdate = true;
        const updatedItem = {
          ...item,
          hangarId: idRowMapRender[item.id],
          modifyPermission: true,
          altType: item.alertLevel,
          ganttItemType: TYPE_GANTT_ITEM_MAP[item.type],
          startDate: convertTime(item.startDateTime),
          endDate: convertTime(item.endDateTime),
        };

        itemsToRemoveInStore.push({
          id: '' + item.id,
          render: TYPE_RENDER_MAP[item.type],
        });

        filteredItemsToRemove.push(updatedItem);
      }
    }

    if (itemsToRemoveInStore.length > 0) {
      // Remove old pairings from idRow map of this timeline.
      store.dispatch(
        removeTimelineKeys(context.timelineId, itemsToRemoveInStore)
      );
    }

    if (needUpdate) {
      updatePane(context, filteredItemsToAddOrUpdate, filteredItemsToRemove);
    }
  }
};

/**
 * Utility function to check whether user has edit permission in pairing page.
 *
 * @param {Array} permissions
 */
export const hasEditPermission = permissions => {
  return checkPermission(scopes.scenario.manage, permissions);
};

/**
 * Utility function to remove all gantt_pane_ul_focused class from all gantt action bar on pane and item click.
 */
export const removeAllPaneFocusClass = () => {
  const panes = document.querySelectorAll('iflight-gantt');
  for (const pane of panes) {
    const ulElement = pane.shadowRoot.querySelector(
      `a.gantt_pane_icons_wrap ul`
    );
    if (ulElement) {
      ulElement.classList.remove('gantt_pane_ul_focused');
    }
  }
};
