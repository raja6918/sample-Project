import store from '../../../../store';
import {
  setTimelineKeyList,
  deleteTimelineKeyList,
} from '../../../../actions/pairings';
import * as pairingService from '../../../../services/Pairings';
import { services } from './iFlightGantt/core';
import {
  flightResponseConvertor,
  generateRowIds,
  pairingResponseConvertor,
  getIdsFromRowIds,
  getFilterPayload,
  getFilterRenderer,
  generateIdRowMap,
  getRowCountFromKeyList,
  generateEmptyKeyList,
} from './utils';
import { PANE_LABELS, isTreeMode, isSplitMode } from './constants';

const plotLabel = PANE_LABELS.PAIRING;

export const resetGanttData = (
  totalDataSize,
  startDate,
  endDate,
  paneObjArr
) => {
  const rowHeaderIds = generateRowIds(totalDataSize);

  const currPaneObj = services.getCurrentPaneObject(
    paneObjArr,
    isTreeMode,
    isSplitMode
  );

  if (currPaneObj) {
    currPaneObj.resetRowColumnDataRange(rowHeaderIds, [startDate, endDate]);
  }
};

/**
 * To clear a timeline/pane when clicking clear option in pane manu.
 *
 * @param {number} timelineId
 * @return {number} count
 */
export const clearTimeline = timelineId => {
  store.dispatch(deleteTimelineKeyList(timelineId));

  const emptyKeyList = generateEmptyKeyList(20);
  const keyList = emptyKeyList;
  store.dispatch(
    setTimelineKeyList(
      timelineId,
      'empty',
      emptyKeyList,
      emptyKeyList,
      {},
      {},
      {},
      emptyKeyList,
      {},
      emptyKeyList,
      {}
    )
  );

  const count = getRowCountFromKeyList(keyList);
  return { count };
};

export const fetchKeyList = async (
  timelineId,
  defaultRenderer,
  match,
  dataMapRenderer
) => {
  try {
    let keyList;
    let idRowMap;
    const filterPayload = getFilterPayload(timelineId);
    const render = getFilterRenderer(
      timelineId,
      defaultRenderer,
      dataMapRenderer
    );
    const scenarioId = match.params.scenarioID || match.params.previewID;

    if (render === 'pairings') {
      const response = await pairingService.getPairingIds(scenarioId, {
        ...filterPayload,
      });
      keyList = response['pairing-key-list'];
      idRowMap = generateIdRowMap(response['pairing-key-list']);
      store.dispatch(
        setTimelineKeyList(
          timelineId,
          render,
          keyList,
          response['active-flt-key-list'],
          idRowMap,
          {},
          {
            filteredPairingNb: response.filteredPairingNb,
            totalPairingNb: response.totalPairingNb,
          },
          response['dhd-flt-key-list'],
          {},
          response['cml-key-list'],
          {}
        )
      );
    } else if (render === 'legs') {
      const response = await pairingService.getFlightIds(scenarioId, {
        ...filterPayload,
      });

      const flightKeyList = response['active-flt-key-list'];
      const flightIdRowMap = generateIdRowMap(flightKeyList);

      const dhiKeyList = response['dhd-flt-key-list'];
      const dhiIdRowMap = generateIdRowMap(dhiKeyList);

      const cmlKeyList = response['cml-key-list'];
      const cmlIdRowMap = generateIdRowMap(cmlKeyList);

      keyList = flightKeyList;

      store.dispatch(
        setTimelineKeyList(
          timelineId,
          render,
          response['pairing-key-list'],
          flightKeyList,
          {},
          flightIdRowMap,
          {
            totalFlightNb:
              response.totalActFltNb +
              response.totalCmlFltNb +
              response.totalDhdFltNb,
            totalActFltNb: response.totalActFltNb,
            totalCmlFltNb: response.totalCmlFltNb,
            totalDhdFltNb: response.totalDhdFltNb,
            filteredFlightNb:
              response.filteredActFltNb +
              response.filteredCmlFltNb +
              response.filteredDhdFltNb,
          },
          dhiKeyList,
          dhiIdRowMap,
          cmlKeyList,
          cmlIdRowMap
        )
      );
    } else {
      store.dispatch(deleteTimelineKeyList(timelineId));

      // We created two seperate 2D array to avoid mutation
      const emptyKeyList = generateEmptyKeyList(20);
      keyList = emptyKeyList;
      store.dispatch(
        setTimelineKeyList(
          timelineId,
          render,
          emptyKeyList,
          emptyKeyList,
          {},
          {},
          {},
          emptyKeyList,
          {},
          emptyKeyList,
          {}
        )
      );
    }

    const count = getRowCountFromKeyList(keyList);
    return { count };
  } catch (error) {
    throw error;
  }
};

const renderPairings = (response, rowIds, dataMap, ganttRef) => {
  const data = pairingResponseConvertor(
    response['pairing-list'],
    rowIds,
    dataMap.idRowMap['pairings']
  );

  const pairingData = {
    ganttHeader: data.rowHeaders,
    normalMaximumDaySpan: 0,
    loadPeriodStartDate: 0,
    loadPeriodEndDate: 0,
    ganttData: {
      sierraPairings: data.data,
    },
    ganttDataType: 'INIT',
    isTree: false,
    responseToken: 1616483043371,
    filterCount: 0,
  };

  const ganttModel = ganttRef.dataModel;
  if (!ganttModel) return;

  services.modifyForUnassignedGantt(
    pairingData,
    ganttModel,
    'sierraPairings',
    undefined,
    plotLabel,
    'W1',
    true
  );
};

const renderFlights = (response, rowIds, dataMap, ganttRef) => {
  const data = flightResponseConvertor(
    [
      ...response['active-flt-list'],
      ...response['dhd-flt-list'],
      ...response['cml-list'],
    ],
    rowIds,
    dataMap.idRowMap['legs'],
    dataMap.idRowMap['dhi'],
    dataMap.idRowMap['cml']
  );

  const pairingData = {
    ganttHeader: data.rowHeaders,
    normalMaximumDaySpan: 0,
    loadPeriodStartDate: 0,
    loadPeriodEndDate: 0,
    ganttData: {
      sierraFlights: data.data,
    },
    ganttDataType: 'INIT',
    isTree: false,
    responseToken: 1616483043371,
    filterCount: 0,
  };

  const ganttModel = ganttRef.dataModel;
  if (!ganttModel) return;

  services.modifyForUnassignedGantt(
    pairingData,
    ganttModel,
    'sierraFlights',
    undefined,
    plotLabel,
    'W1',
    true
  );
};

export const fetchGanttDetails = async (
  rowIds,
  dataMap,
  ganttRef,
  $scope,
  { match }
) => {
  try {
    const scenarioId = match.params.scenarioID || match.params.previewID;
    const [pairingIds, pairingCount] = getIdsFromRowIds(
      dataMap['pairings'],
      rowIds
    );
    const [flightIds, flightCount] = getIdsFromRowIds(dataMap['legs'], rowIds);
    const [deadHeadFlightIds, dhiCount] = getIdsFromRowIds(
      dataMap['dhi'],
      rowIds
    );
    const [cmlFlightIds, cmlCount] = getIdsFromRowIds(dataMap['cml'], rowIds);

    if (Math.max(pairingCount, flightCount, dhiCount, cmlCount) > 0) {
      const response = await pairingService.getGanttDetails(
        scenarioId,
        pairingIds,
        flightIds,
        deadHeadFlightIds,
        cmlFlightIds
      );

      renderPairings(response, rowIds, dataMap, ganttRef);
      renderFlights(response, rowIds, dataMap, ganttRef);
    }
  } catch (error) {
    throw error;
  }
};
