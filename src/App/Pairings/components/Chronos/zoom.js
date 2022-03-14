import moment from 'moment';
import get from 'lodash/get';
import { services } from './iFlightGantt/core';
import { getUTCDateForTimeInMilliseconds } from './iFlightGantt/utils';
import {
  CARRY_IN_DAYS,
  CARRY_OUT_DAYS,
  MAX_PERIOD_DAYS,
  isTreeMode,
  isSplitMode,
} from './constants';

/**
 * This correction is added as a temporary fix for 5th level zoom out since at 5th level we change zoomLevel from 0.44032 to 24 hours.
 * This correction break when we apply max and min zoom or header drag zoom.
 */
const zoomCorrection = (
  zoomDirection,
  metaInfo,
  $scope,
  zoomObject,
  prevZooms
) => {
  if (
    zoomDirection === 'ZoomOut' &&
    zoomObject &&
    zoomObject.zoomLevel === 24 &&
    zoomObject.zoomTo === 'hours' &&
    prevZooms.length > 0
  ) {
    const secondLastZoomLevel = prevZooms[prevZooms.length - 1];

    zoomObject.zoomLevel = secondLastZoomLevel.zoomLevel;
    zoomObject.zoomTo = 'days';
    const currPaneObj = services.getCurrentPaneObject(
      $scope.paneObjArr,
      isTreeMode,
      isSplitMode
    );
    const dateVal = new Date(currPaneObj.horizontalScrollBar.minViewValue);
    const customZoom = services.getCustomZoomObject('W1');
    services.setCustomZoomObject(
      dateVal,
      zoomObject.zoomTo,
      zoomObject.zoomLevel,
      customZoom.zoomRowCount, // customZoom.zoomRowCount must be total row count of all panes
      zoomObject.zoomOffset,
      $scope.pageid,
      metaInfo
    );
  }

  const maxZoomReached =
    zoomObject.zoomLevel === 24 && zoomObject.zoomTo === 'hours';
  if (
    zoomDirection === 'ZoomIn' &&
    prevZooms.length < 5 &&
    zoomObject.zoomLevel > 1 &&
    !maxZoomReached
  ) {
    prevZooms.push({ ...zoomObject });
  }

  if (zoomDirection === 'ZoomOut') {
    prevZooms.pop();
  }
};

export const stepZoom = (
  zoomDirection,
  metaInfo,
  zoomParameters,
  $scope,
  zoomObject,
  prevZooms
) => {
  const isSplitPaneFlag = false;
  const currPaneObjIndex = $scope.paneObjArr.indexOf(
    services.getCurrentPaneObject(
      $scope.paneObjArr,
      isTreeMode,
      isSplitPaneFlag
    )
  );

  zoomCorrection(zoomDirection, metaInfo, $scope, zoomObject, prevZooms);

  // const currPaneObjIndex = 0;
  const newZoomObject = services.overallZoom(
    $scope.paneObjArr,
    currPaneObjIndex,
    zoomParameters,
    zoomObject,
    $scope.pageid,
    $scope.module
  );
  window.$.extend(zoomObject, newZoomObject);
  $scope.zoomOffset = zoomObject.zoomOffset;
};

/**
 * This method is added as a temporary fix for applyCustomZoom bug in multipanes. In multipanes the row height are increasing when we zoom out more.
 */
const preventZoomOut = (type, noOfDays, zoomObject) => {
  const totalCarryDays = CARRY_IN_DAYS + CARRY_OUT_DAYS - 1;
  const periodVisibleDays = Math.min(noOfDays, MAX_PERIOD_DAYS);
  const initialTimelineVisibleDays = periodVisibleDays + totalCarryDays;
  if (zoomObject.zoomLevel >= initialTimelineVisibleDays && type === 'out') {
    return true;
  }

  return false;
};

export const customeZoom = (type, noOfDays, $scope, zoomObject, prevZooms) => {
  if (preventZoomOut(type, noOfDays, zoomObject)) return;

  const currPaneObj = services.getCurrentPaneObject(
    $scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  const dateVal = getUTCDateForTimeInMilliseconds(
    currPaneObj.horizontalScrollBar.minViewValue
  );
  const currZoomObject = {
    dateVal,
    level: type === 'out' ? 70 : 1, // Since 70 is the maximum day visible at a time in timeline
    zoomTo: 'days',
  };

  zoomObject.zoomRowCount = services.getTotalRowsCount(
    currPaneObj,
    $scope.pageid
  );

  zoomObject.zoomRowCount = currZoomObject.rowCount
    ? currZoomObject.rowCount
    : zoomObject.zoomRowCount;
  zoomObject.zoomLevel = currZoomObject.level
    ? currZoomObject.level
    : zoomObject.zoomLevel;
  zoomObject.zoomTo = currZoomObject.zoomTo;
  zoomObject.dateVal = currZoomObject.dateVal;
  const zoomParameters = {
    rowZoomParameter: 1,
    columnZoomParameter: 2.5,
  };

  const isSplitPaneFlag = false;
  const currPaneObjIndex = $scope.paneObjArr.indexOf(
    services.getCurrentPaneObject(
      $scope.paneObjArr,
      isTreeMode,
      isSplitPaneFlag
    )
  );

  const newZoomObject = services.applyCustomZoom(
    $scope.paneObjArr,
    currPaneObjIndex,
    zoomObject,
    $scope.pageid,
    zoomParameters
  );

  window.$.extend(zoomObject, newZoomObject);
  $scope.zoomOffset = zoomObject.zoomOffset;
  prevZooms.length = 0;
};

export const dragZoom = (item, $scope, zoomObject, prevZooms) => {
  const currPaneObj = services.getCurrentPaneObject(
    $scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  currPaneObj.clearColumnHeaderSelection();

  const startTime = getUTCDateForTimeInMilliseconds(
    get(item, 'data.columnHeaderSelectionObject.startTime')
  );
  const endTime = getUTCDateForTimeInMilliseconds(
    get(item, 'data.columnHeaderSelectionObject.endTime')
  );
  let diff = moment(endTime).diff(moment(startTime), 'days');

  let dateVal = startTime;
  let hourZoom = false;
  if (diff < 0) {
    dateVal = endTime;
  } else if (diff === 0) {
    diff = moment(endTime).diff(moment(startTime), 'hours');
    hourZoom = true;

    if (Math.abs(diff) < 12) {
      return;
    }
  }

  const currZoomObject = {
    dateVal,
    level: Math.abs(Math.ceil(diff)),
    zoomTo: hourZoom ? 'hours' : 'days',
  };

  zoomObject.zoomRowCount = services.getTotalRowsCount(
    currPaneObj,
    $scope.pageid
  );

  zoomObject.zoomRowCount = currZoomObject.rowCount
    ? currZoomObject.rowCount
    : zoomObject.zoomRowCount;
  zoomObject.zoomLevel = currZoomObject.level
    ? currZoomObject.level
    : zoomObject.zoomLevel;
  zoomObject.zoomTo = currZoomObject.zoomTo;
  zoomObject.dateVal = currZoomObject.dateVal;
  const zoomParameters = {
    rowZoomParameter: 1,
    columnZoomParameter: 2.5,
  };

  const isSplitPaneFlag = false;
  const currPaneObjIndex = $scope.paneObjArr.indexOf(
    services.getCurrentPaneObject(
      $scope.paneObjArr,
      isTreeMode,
      isSplitPaneFlag
    )
  );

  const newZoomObject = services.applyCustomZoom(
    $scope.paneObjArr,
    currPaneObjIndex,
    zoomObject,
    $scope.pageid,
    zoomParameters
  );

  window.$.extend(zoomObject, newZoomObject);
  $scope.zoomOffset = zoomObject.zoomOffset;
  prevZooms.length = 0;
};
