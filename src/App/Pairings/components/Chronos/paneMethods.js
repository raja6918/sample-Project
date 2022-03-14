import store from '../../../../store';
import storage from '../../../../utils/storage';
import {
  updateTimelineKeys,
  removeTimelineKeys,
  setAllTimelineKeyList,
} from '../../../../actions/pairings';
import { services } from './iFlightGantt/core';
import {
  updateDragPane,
  generateRowIds,
  getRowCountFromKeyList,
  toggleSelectAllIcon,
  reDrawPane,
  clearHighlights,
} from './utils';
import { isTreeMode, isSplitMode, TYPE_RENDER_MAP } from './constants';
import { fetchKeyList } from './api';
import { iFlightEventBus } from './iFlightGantt/iflight_event_bus';

const moduleName = 'OPS';

export const getKeyList = async (timelineId, defaultRenderer, match) => {
  try {
    const pairingStore = storage.getItem(`pairingStore`);
    if (pairingStore && pairingStore[timelineId]) {
      const timelineDetails = pairingStore[timelineId];
      const { render } = timelineDetails;
      const keyList = timelineDetails[render];
      const count = getRowCountFromKeyList(keyList);
      store.dispatch(setAllTimelineKeyList(pairingStore));
      return { count };
    } else {
      const { count } = await fetchKeyList(timelineId, defaultRenderer, match);
      return { count };
    }
  } catch (error) {
    throw error;
  }
};

export const paneInitializer = (startDate, endDate, ganttModel, count = 20) => {
  const rowIds = generateRowIds(count);
  ganttModel.rowIds = rowIds;

  const response = {
    expandNodeList: [],
    filterCount: 0,
    loadPeriodEndDate: endDate,
    loadPeriodRowIds: rowIds,
    loadPeriodStartDate: startDate,
    normalMaximumDaySpan: 2,
  };

  services.prepareInitData(response, ganttModel, undefined, false, true);
};

export const setupPane = (
  paneObjectArray,
  isSplitPane,
  isTreeEnabled,
  caller,
  plotLabel,
  props,
  $scope
) => {
  const { startDate, endDate, carryOutStartDate, carryInEndDate } = props;

  $scope.defaultPaneObjArr = paneObjectArray;
  $scope.paneObjArr = paneObjectArray;

  $scope.paneObjArr[0].setYAxisOptions('showLabel', false);
  $scope.paneObjArr[0].setYAxisOptions('labelWidth', '0');
  $scope.paneObjArr[0].updateGanttData({
    rowHeaders: [],
    data: [],
  });

  const CarryInOutPeriods = [
    {
      fromDate: startDate,
      toDate: carryInEndDate,
      color: 'rgba(229, 229, 229,0.4)',
    },
    {
      fromDate: carryOutStartDate,
      toDate: endDate,
      color: 'rgba(229, 229, 229,0.4)',
    },
  ];
  services.highlight(paneObjectArray, CarryInOutPeriods);
};

export const reInitializeZoom = (xmin, xmax, plot, $scope, zoomObject) => {
  const currPaneObj = plot;
  let options;
  const zoomParameters = {
    rowZoomParameter: 1,
    columnZoomParameter: 1.25,
  };
  const newZoomObj = services.setupZoomVariables(
    currPaneObj,
    zoomObject,
    $scope.pageid,
    currPaneObj.getPlotLabel(),
    zoomParameters
  );
  if (!newZoomObj) return;

  zoomObject.zoomRowCount = newZoomObj.zoomRowCount;
  zoomObject.zoomOffset = newZoomObj.zoomOffset;
  zoomObject.minTickHeight = newZoomObj.minTickHeight;

  $scope.zoomOffset = zoomObject.zoomOffset;
  $scope.paneObjArr.forEach((paneObj, key) => {
    options = paneObj.getOptions();
    options.series.gantt.minTickHeight = zoomObject.minTickHeight;
  });
  if ($scope.splitPane && $scope.paneObjArr.length > 1) {
    const isSplitNodeExpanded = services.getSplitNodeExpanded();
    if (isSplitNodeExpanded) {
      services.expandSplitNode($scope);
    }
  } else {
    currPaneObj.setupGrid();
    currPaneObj.draw();
  }
};

export const getZoomOffset = $scope => {
  const ganttConfig = services.getGanttConfiguration(moduleName);
  if ($scope.zoomOffset === undefined) {
    $scope.zoomOffset = 1;
  }
  return ganttConfig.retainMinZoomOffset === 'true' &&
    $scope.zoomOffset < ganttConfig.minZoomOffset
    ? ganttConfig.minZoomOffset
    : $scope.zoomOffset;
};

export const dropItemHandler = (item, $scope, timelineId) => {
  const currPaneObj = services.getCurrentPaneObject(
    $scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  const { currentItem } = item.data;
  const { rowId } = item.data.droppedPosition;
  const modifiedItems = [];
  const items = [];
  if (item.data.dragItemSize === 'SINGLE') {
    const modifiedItem = { ...currentItem, hangarId: rowId };
    modifiedItems.push(modifiedItem);
    items.push({
      id: '' + currentItem.id,
      render: TYPE_RENDER_MAP[currentItem.type],
    });
  } else {
    for (const item of currentItem) {
      const modifiedItem = { ...item, hangarId: rowId };
      modifiedItems.push(modifiedItem);
      items.push({
        id: '' + item.id,
        render: TYPE_RENDER_MAP[item.type],
      });
    }
  }

  const RTUObj = {
    headersToAddOrUpdate: [],
    headersToRemove: [],
    itemsToAddOrUpdate: modifiedItems,
    itemsToRemove: [],
    lwId: undefined,
    plot: currPaneObj,
    status: 'CHANGE',
    updateNeeded: false,
  };

  services.updatePane(RTUObj, $scope, false);
  store.dispatch(updateTimelineKeys(timelineId, rowId, items));
  updateDragPane(item, modifiedItems);
};

export const multipaneDrop = (modifiedItems, $scope, timelineId) => {
  const currPaneObj = services.getCurrentPaneObject(
    $scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  const RTUObj = {
    headersToAddOrUpdate: [],
    headersToRemove: [],
    itemsToAddOrUpdate: [],
    itemsToRemove: modifiedItems,
    lwId: undefined,
    plot: currPaneObj,
    status: 'CHANGE',
    updateNeeded: false,
  };

  services.updatePane(RTUObj, $scope, false);

  const items = [];
  for (const item of modifiedItems) {
    items.push({
      id: '' + item.id,
      render: TYPE_RENDER_MAP[item.type],
    });
  }
  store.dispatch(removeTimelineKeys(timelineId, items));
};

export const applySelectAll = context => {
  if (!context.selectAll) {
    context.selectAll = true;
    clearHighlights(context);
    toggleSelectAllIcon(context);
    reDrawPane(context);
  }
};

export const clearSelectAll = (context, clearData = true) => {
  if (context.selectAll) {
    context.selectAll = false;
    toggleSelectAllIcon(context);
    if (clearData) {
      reDrawPane(context);
    }
  }
};

/**
 * To emit an event to clear select all in all panes.
 *
 * @param {string} plotLabel
 * @param {boolean} clearData - Sometime we don't need to redraw pane ie when we apply or reset filter.
 */
export const emitClearSelectAllEvent = (plotLabel, clearData = true) => {
  iFlightEventBus.emitEvent('clearSelectAllEvent', [plotLabel, clearData]);
};
