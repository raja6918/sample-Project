import { t } from 'i18next';
import store from '../../../../../store';
import { TYPE_RENDER_MAP, TYPE_GANTT_ITEM_MAP } from './../constants';
import { currentScenario } from '../../../../../utils/common';
import * as pairingService from '../../../../../services/Pairings';
import {
  clearHighlights,
  updatePane,
  triggerPaneUpdateEvent,
  convertTime,
  toggleSelectAllIcon,
} from '../utils';
import {
  bulkUpdateTimelineKeys,
  removeTimelineKeys,
  removeKeys,
} from '../../../../../actions/pairings';

const extractPairingIds = highlights => {
  const pairingIds = [];

  for (const highlight of highlights) {
    if (highlight.type === 'PRG') {
      pairingIds.push('' + highlight.id);
    }
  }

  return pairingIds;
};

const updateCurrentTimelineKeyList = (
  timelineId,
  highlights,
  activitiesIds
) => {
  const itemToAdd = [];

  for (const highlight of highlights) {
    // Some of pairings may not be broken. So we need to ensure that id is there inside response.ids
    if (highlight.type === 'PRG' && activitiesIds[highlight.id]) {
      const activeFltKeyList = activitiesIds[highlight.id]['act-flt-key-list'];
      const deadHeadFltKeyList =
        activitiesIds[highlight.id]['dhd-flt-key-list'];
      const cmlFltKeyList = activitiesIds[highlight.id]['cml-key-list'];

      for (const flightId of activeFltKeyList) {
        itemToAdd.push({
          id: '' + flightId,
          render: TYPE_RENDER_MAP['FLT'],
          rowId: highlight.rowId,
        });
      }

      for (const deadHeadId of deadHeadFltKeyList) {
        itemToAdd.push({
          id: '' + deadHeadId,
          render: TYPE_RENDER_MAP['DHI'],
          rowId: highlight.rowId,
        });
      }

      for (const cmlId of cmlFltKeyList) {
        itemToAdd.push({
          id: '' + cmlId,
          render: TYPE_RENDER_MAP['CML'],
          rowId: highlight.rowId,
        });
      }
    }
  }

  store.dispatch(bulkUpdateTimelineKeys(timelineId, itemToAdd));
};

const getFilteredItems = (highlights, unBrokenPairings) => {
  const itemsToRemove = [];
  const filteredHighlights = [];

  for (const highlight of highlights) {
    const id = '' + highlight.id;
    if (highlight.type === 'PRG' && !unBrokenPairings.includes(id)) {
      filteredHighlights.push(highlight);
      itemsToRemove.push({
        id,
        render: TYPE_RENDER_MAP[highlight.type],
      });
    }
  }

  return { itemsToRemove, filteredHighlights };
};

const getDuplicateFlights = (context, details) => {
  const filteredflights = [];
  const pairingMap = context.props.pairingMap;
  const idRowMap = pairingMap[context.timelineId]
    ? pairingMap[context.timelineId].idRowMap
    : null;

  if (details && idRowMap) {
    if (Array.isArray(details['act-flt-list'])) {
      for (const item of details['act-flt-list']) {
        const idRowMapRender = idRowMap[TYPE_RENDER_MAP['FLT']];
        if (idRowMapRender[item.id]) {
          const updatedItem = {
            ...item,
            chronosId: `${item.id}_${TYPE_GANTT_ITEM_MAP['FLT']}_FLT`,
            hangarId: idRowMapRender[item.id],
            modifyPermission: true,
            altType: item.alertLevel,
            ganttItemType: TYPE_GANTT_ITEM_MAP['FLT'],
            startDate: convertTime(item.startDateTime),
            endDate: convertTime(item.endDateTime),
          };
          filteredflights.push(updatedItem);
        }
      }
    }

    if (Array.isArray(details['dhd-flt-list'])) {
      for (const item of details['dhd-flt-list']) {
        const idRowMapRender = idRowMap[TYPE_RENDER_MAP['DHI']];
        if (idRowMapRender[item.id]) {
          const updatedItem = {
            ...item,
            chronosId: `${item.id}_${TYPE_GANTT_ITEM_MAP['DHI']}_DHI`,
            hangarId: idRowMapRender[item.id],
            modifyPermission: true,
            altType: item.alertLevel,
            ganttItemType: TYPE_GANTT_ITEM_MAP['DHI'],
            startDate: convertTime(item.startDateTime),
            endDate: convertTime(item.endDateTime),
          };
          filteredflights.push(updatedItem);
        }
      }
    }

    if (Array.isArray(details['cml-list'])) {
      for (const item of details['cml-list']) {
        const idRowMapRender = idRowMap[TYPE_RENDER_MAP['CML']];
        if (idRowMapRender[item.id]) {
          const updatedItem = {
            ...item,
            chronosId: `${item.id}_${TYPE_GANTT_ITEM_MAP['CML']}_CML`,
            hangarId: idRowMapRender[item.id],
            modifyPermission: true,
            altType: item.alertLevel,
            ganttItemType: TYPE_GANTT_ITEM_MAP['CML'],
            startDate: convertTime(item.startDateTime),
            endDate: convertTime(item.endDateTime),
          };
          filteredflights.push(updatedItem);
        }
      }
    }
  }

  return filteredflights;
};

/**
 * To change type of internal and commercial deadhead from FLT to DHI or CML
 */
const getModifiedList = (list, type) => {
  return list.map(item => ({ ...item, type: type }));
};

/**
 * The main method that call break API, process response and update pane.
 *
 * @param {Object} context - this context of individual pane component
 * @param {Array} highlights - array of selected activities. In case of select all array of pairings
 * @param {number} scenarioId
 * @param {Array} pairingIds
 */
const processBreak = async (context, highlights, scenarioId, pairingIds) => {
  // Disable context menu to prevent double break operation
  context.disableContextMenu = true;

  context.openLoader(t('PAIRINGS.break.loader'));

  const response = await pairingService.breakPairings(scenarioId, pairingIds);

  // On Success
  const { details } = response;
  const activitiesIds = response.ids;
  const unBrokenPairings = response['list-of-unbroken-trips'];

  // triggerRefetch if we are not getting details attribute or null details attribute
  const triggerRefetch = details && pairingIds.length < 50 ? false : true;

  // Since for now we cannot have duplicate flights in a timeline we need to filter out old flights
  const duplicateFlights = getDuplicateFlights(context, details);

  // Add new flight ids to idRowMap of current timeline
  updateCurrentTimelineKeyList(context.timelineId, highlights, activitiesIds);

  // We need to filter out pairings that need to remove from all timeline as some pairings may not be broken
  const { itemsToRemove, filteredHighlights } = getFilteredItems(
    highlights,
    unBrokenPairings
  );

  if (triggerRefetch) {
    // Remove old pairings from idRow map of all timelines
    // and trigger clearDataAndRefetchPaneEvent event to refresh all timeline that contains ids.
    store.dispatch(removeKeys(itemsToRemove, context.timelineId, true));
  } else {
    // Remove old pairings from idRow map of current timeline only without refreshing
    store.dispatch(removeTimelineKeys(context.timelineId, itemsToRemove));
  }

  // clear old highlights
  clearHighlights(context);

  // if unBrokenPairings count is greater than 0
  if (unBrokenPairings.length) {
    const toastMsg = t('PAIRINGS.break.unBrokenPairingsMessage', {
      numberOfPairingsBroken: pairingIds.length - unBrokenPairings.length,
      numberOfPairingsNotBroken: unBrokenPairings.length,
    });
    context.setSnackBar(toastMsg, 'info');
  }

  // New performance improvement part if details present
  if (!triggerRefetch) {
    const modifiedDHIList = getModifiedList(details['dhd-flt-list'], 'DHI');
    const modifiedCMLList = getModifiedList(details['cml-list'], 'CML');
    const itemsToAddOrUpdate = [
      ...details['pairing-list'],
      ...details['act-flt-list'],
      ...modifiedDHIList,
      ...modifiedCMLList,
    ];
    // Remove pairings that is broken from current timeline
    updatePane(context, [], [...filteredHighlights, ...duplicateFlights]);
    // Since break operation may affect flights and pairing in other timelines we need to update all timelines
    triggerPaneUpdateEvent(itemsToAddOrUpdate, filteredHighlights);
  }
};

/**
 * The method to break multiple pairings.
 *
 * @param {Object} context - this context of individual pane component
 */
export const breakPairings = async context => {
  try {
    const scenario = currentScenario();
    const scenarioId = scenario ? scenario.id : null;
    const highlights = context.$scope.paneObjArr[0]
      ? context.$scope.paneObjArr[0].getAllGanttHighlights()
      : null;

    if (scenarioId && Array.isArray(highlights) && highlights.length > 0) {
      // Extract pairingIds from highlights
      const pairingIds = extractPairingIds(highlights);

      await processBreak(context, highlights, scenarioId, pairingIds);
    }
  } catch (error) {
    context.props.reportError({
      isCustomError: true,
      message: t('ERRORS.GANTT_OPERATIONS.break'),
    });

    console.error(error);
  } finally {
    // re-enable contextMenu
    context.disableContextMenu = false;
    // Remove any opened loader
    context.closeLoader();
  }
};

/**
 * When we apply select all operation we don't have anything in chronos highlight array.
 * So we need to manually create highlight array.
 */
const generateHighlight = pairingIdRowMap => {
  return Object.keys(pairingIdRowMap).map(pairingId => ({
    type: 'PRG',
    id: pairingId,
    rowId: pairingIdRowMap[pairingId],
    chronosId: `${pairingId}_sierraPairings_PRG`,
    hangarId: pairingIdRowMap[pairingId],
    modifyPermission: true,
    ganttItemType: 'sierraPairings',
  }));
};

/**
 * The method to handle select all and break operation.
 *
 * @param {Object} context - this context of individual pane component
 */
export const selectAllBreak = async context => {
  try {
    const scenario = currentScenario();
    const scenarioId = scenario ? scenario.id : null;
    const countMap = context.props.pairingMap
      ? context.props.pairingMap[context.timelineId]
      : {};
    const pairingIdRowMap = countMap.idRowMap
      ? countMap.idRowMap.pairings
      : null;

    if (scenarioId && pairingIdRowMap) {
      // Extract pairingIds from pairingIdRowMap
      const pairingIds = Object.keys(pairingIdRowMap);

      const highlights = generateHighlight(pairingIdRowMap);

      await processBreak(context, highlights, scenarioId, pairingIds);
    }
  } catch (error) {
    context.props.reportError({
      isCustomError: true,
      message: t('ERRORS.GANTT_OPERATIONS.break'),
    });

    console.error(error);
  } finally {
    // re-enable contextMenu
    context.disableContextMenu = false;
    // disable selectAll and enable select all icon
    context.selectAll = false;
    toggleSelectAllIcon(context);
    // Remove any opened loader
    context.closeLoader();
  }
};
