import { t } from 'i18next';
import store from '../../../../../store';
import { TYPE_RENDER_MAP } from '../constants';
import Sort from '../../../../../utils/sortEngine';
import {
  currentScenario,
  dateRangeOverlaps,
} from '../../../../../utils/common';
import * as pairingService from '../../../../../services/Pairings';
import {
  updateTimelineKeys,
  removeKeys,
  removeTimelineKeys,
} from '../../../../../actions/pairings';
import {
  clearHighlights,
  convertTime,
  updatePane,
  triggerPaneUpdateEvent,
} from '../utils';

/**
 * Utility function to extract flight instance from highlighted pairings and flights.
 *
 * we attach rowId to flight instance since we need rowId to find pairing with the earliest departure time.The new pairing is created on the same row as the pairing with the earliest departure time.
 *
 * @param {Array} highlights
 * @returns {Array} flights
 */
const extractFlights = highlights => {
  const flights = [];

  for (const highlight of highlights) {
    const type = highlight.type;
    if (['FLT', 'DHI', 'CML'].includes(type)) {
      flights.push(highlight);
    }

    if (highlight.type === 'PRG') {
      if (Array.isArray(highlight.activities)) {
        for (const activity of highlight.activities) {
          if (
            activity.type === 'DUT' &&
            activity.activities &&
            Array.isArray(activity.activities)
          ) {
            for (const dutyItem of activity.activities) {
              const type = dutyItem.type;
              if (['FLT', 'DHI', 'CML', 'COTRM'].includes(type)) {
                flights.push({ ...dutyItem, rowId: highlight.rowId });
              }
            }
          }
        }
      }
    }
  }

  return flights;
};

/**
 * Utility function to checkOverlaps between two adjacent flights.
 * Since the items are already sorted we can avoid nested loop comparison.
 *
 * @param {Array} sortedFlights
 * @returns {boolean} - true if there is an overlap
 */
const checkOverlaps = sortedFlights => {
  for (let i = 0; i < sortedFlights.length - 1; i++) {
    if (
      dateRangeOverlaps(
        sortedFlights[i].startDateTime,
        sortedFlights[i].endDateTime,
        sortedFlights[i + 1].startDateTime,
        sortedFlights[i + 1].endDateTime
      )
    ) {
      return true;
    }
  }
  return false;
};

/**
 * You cannot join pairings and flights if there is an overlap between them.
 * This utility will disable the context menu.
 *
 * @param {Array} highlights
 * @return {boolen} true if you want to disable menu
 */
export const disableJoinMenu = highlights => {
  if (highlights.length === 0) {
    return true;
  }

  const flights = extractFlights(highlights);
  const sortedFlights = new Sort(flights, {
    type: 'dateTime',
    direction: 'inc',
    field: 'startDateTime',
  }).sort();
  const hasOverlaps = checkOverlaps(sortedFlights);
  return hasOverlaps;
};

const extractActivitiesIds = activities => {
  const result = { FLT: [], PRG: [], DHI: [], CML: [] };

  for (const activity of activities) {
    const type = activity.type;
    if (result[type]) {
      result[type].push('' + activity.id);
    }
  }

  return result;
};

const generateItemsList = activities => {
  return activities.map(activity => ({
    id: '' + activity.id,
    render: TYPE_RENDER_MAP[activity.type],
  }));
};

const extractCrewComposition = activities => {
  const pairings = [];

  for (const activity of activities) {
    if (activity.type === 'PRG') {
      pairings.push(activity);
    }
  }

  if (pairings.length === 0) {
    return null;
  }

  // If we have pairings in selection then crew composition will be taken from pairings with earlier depature date.
  const sortedPairings = new Sort(pairings, {
    type: 'dateTime',
    direction: 'inc',
    field: 'startDateTime',
  }).sort();

  return sortedPairings[0].crewComposition;
};

/**
 * The method to join multiple activities (flights, internal deadhead and commercial flights) with given crewComposition.
 *
 * @param {Object} context
 * @param {Object} crewComposition
 */
export const createPairing = async (context, crewComposition) => {
  try {
    const scenario = currentScenario();
    const scenarioID = scenario ? scenario.id : null;
    const highlights = context.$scope.paneObjArr[0]
      ? context.$scope.paneObjArr[0].getAllGanttHighlights()
      : null;

    if (scenarioID && Array.isArray(highlights) && highlights.length > 1) {
      const {
        FLT: flightIds,
        PRG: pairingIds,
        DHI: internalDeadHeadIds,
        CML: cmlIds,
      } = extractActivitiesIds(highlights);

      // Disable context menu to prevent double join operation on same pairings
      context.disableContextMenu = true;

      // Call the Join API
      const response = await pairingService.joinPairings(
        scenarioID,
        crewComposition,
        flightIds,
        pairingIds,
        internalDeadHeadIds,
        cmlIds
      );

      // On Success
      const { details } = response;
      const newPairing = response['pairing-details'];

      // triggerRefetch if we are not getting details attribute or null details attribute
      const triggerRefetch = details ? false : true;

      // Find the row with pairing/flight with the earliest departure time.
      const flights = extractFlights(highlights);
      const sortedFlights = new Sort(flights, {
        type: 'dateTime',
        direction: 'inc',
        field: 'startDateTime',
      }).sort();
      const rowId = sortedFlights[0].rowId;

      const itemsToRemove = generateItemsList(highlights);
      if (triggerRefetch) {
        // Remove old pairings and flights from idRow map of current timeline and pairings from other timelines
        store.dispatch(removeKeys(itemsToRemove, context.timelineId));
      } else {
        // Remove old pairings and flights from idRow map of current timeline only.
        store.dispatch(removeTimelineKeys(context.timelineId, itemsToRemove));
      }

      // Add new pairing id in idRow map
      const itemsToUpdate = [
        {
          id: '' + newPairing.id,
          render: TYPE_RENDER_MAP[newPairing.type],
        },
      ];
      store.dispatch(
        updateTimelineKeys(context.timelineId, rowId, itemsToUpdate)
      );

      // clear old highlights
      clearHighlights(context);

      // Update newly created pairing in current timeline
      // And remove all highlights from current timeline
      const itemsToAddOrUpdate = [
        {
          ...newPairing,
          hangarId: rowId,
          modifyPermission: true,
          altType: newPairing.alertLevel,
          ganttItemType: 'sierraPairings',
          startDate: convertTime(newPairing.startDateTime),
          endDate: convertTime(newPairing.endDateTime),
        },
      ];
      updatePane(context, itemsToAddOrUpdate, highlights);

      // New performance improvement part if details present
      if (!triggerRefetch) {
        // We only want to remove pairings from other timelines
        const filteredHighlights = highlights.filter(
          highlight => highlight.type === 'PRG'
        );
        triggerPaneUpdateEvent(
          [...details['act-flt-list'], ...details['pairing-list']],
          filteredHighlights
        );
      }
    }
  } catch (error) {
    context.props.reportError({
      isCustomError: true,
      message: t('ERRORS.GANTT_OPERATIONS.join'),
    });

    console.error(error);
  } finally {
    // re-enable contextMenu
    context.disableContextMenu = false;
  }
};

/**
 * The method to initiate join operation of multiple activities (pairings, flights, internal deadhead and commercial flights).
 *
 * @param {Object} context
 */
export const joinActivities = context => {
  const scenario = currentScenario();
  const scenarioID = scenario ? scenario.id : null;
  const highlights = context.$scope.paneObjArr[0]
    ? context.$scope.paneObjArr[0].getAllGanttHighlights()
    : null;

  if (scenarioID && Array.isArray(highlights) && highlights.length > 1) {
    const crewComposition = extractCrewComposition(highlights);

    if (crewComposition) {
      createPairing(context, crewComposition);
    } else {
      context.setState({
        showCrewComplement: true,
        isJoinAction: true,
        selectedPairing: [],
      });
    }
  }
};
