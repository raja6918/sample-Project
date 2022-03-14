import { services } from './iFlightGantt/core';
import { convertTime } from './utils';
import { getAlertColor } from '../OnlineValidation/helpers';
import { getZoomOffset } from './paneMethods';
import { unmountTooltip } from './tooltip';

const moduleName = 'OPS';

const iconImage = new Image();
iconImage.src = window.imagePath + '/lock.svg';

export const drawPairingBar = (dataToDraw, data, zoomOffset, $scope, cb) => {
  const context = dataToDraw.drawingContext;
  const gleft = 0;
  const gWidth = 0;
  const barConfiguration = services.getConfiguration(data, moduleName);

  const width = dataToDraw.width - gWidth;
  const plotOffset = $scope.paneObjArr[0].getPlotOffset();
  const contextHolder = {
    context,
    top: 0,
    left: gleft,
    height: dataToDraw.height,
    width: width,
    mode: dataToDraw.mode,
    zoomOffset,
    xOffset: dataToDraw.leftCordinate + plotOffset.left,
    yOffset: dataToDraw.topCordinate + plotOffset.top,
    dataToDraw: dataToDraw,
  };

  context.fillStyle = getAlertColor(data.alertLevel);
  context.font = '12px Roboto';
  const labelWidth = context.measureText(data.name).width;
  if (width > labelWidth) {
    if (data.isLocked) {
      context.fillText(data.name || '', width / 2 - labelWidth / 2 - 5, -2);
      context.drawImage(
        iconImage,
        width / 2 - labelWidth / 2 + labelWidth,
        -15
      );
    } else {
      context.fillText(data.name || '', width / 2 - labelWidth / 2, -2);
    }
  } else {
    if (data.isLocked) {
      context.drawImage(iconImage, width / 2 - 6, -15);
    }
  }

  services.drawBar(
    contextHolder,
    barConfiguration,
    $scope.paneObjArr[0],
    $scope,
    cb
  );
};

export const drawLayover = (dataToDraw, data, zoomOffset, $scope) => {
  data.ganttItemType = data.type;
  const startDate = convertTime(data.startDateTime);
  const endDate = convertTime(data.endDateTime);
  const barConfiguration = services.getConfiguration(data, moduleName);

  let { eachTask } = dataToDraw;
  if (dataToDraw.mode === 'SHADOW') {
    eachTask = dataToDraw.eachTask.draggedTask;
  }

  const eleLeftPos = $scope.paneObjArr[0].getCanvasPixelForTimeWidth(startDate);
  const eleRightPos = $scope.paneObjArr[0].getCanvasPixelForTimeWidth(endDate);
  const setLeftPos = $scope.paneObjArr[0].getCanvasPixelForTimeWidth(
    eachTask.start
  );
  const plotOffset = $scope.paneObjArr[0].getPlotOffset();

  const contextHolder = {
    context: dataToDraw.drawingContext,
    top: 2.5,
    left: eleLeftPos - setLeftPos,
    height: dataToDraw.height - 5,
    width: eleRightPos - eleLeftPos,
    mode: dataToDraw.mode,
    zoomOffset,
    xOffset: dataToDraw.leftCordinate + plotOffset.left,
    yOffset: dataToDraw.topCordinate + plotOffset.top,
    dataToDraw: dataToDraw,
  };

  services.drawBar(
    contextHolder,
    barConfiguration,
    $scope.paneObjArr[0],
    $scope
  );
};

export const drawDuty = (dataToDraw, data, zoomOffset, $scope) => {
  data.ganttItemType = data.type;
  const startDate = convertTime(data.startDateTime);
  const endDate = convertTime(data.endDateTime);
  const barConfiguration = services.getConfiguration(data, moduleName);

  let { eachTask } = dataToDraw;
  if (dataToDraw.mode === 'SHADOW') {
    eachTask = dataToDraw.eachTask.draggedTask;
  }

  const eleLeftPos = $scope.paneObjArr[0].getCanvasPixelForTimeWidth(startDate);
  const eleRightPos = $scope.paneObjArr[0].getCanvasPixelForTimeWidth(endDate);
  const setLeftPos = $scope.paneObjArr[0].getCanvasPixelForTimeWidth(
    eachTask.start
  );
  const plotOffset = $scope.paneObjArr[0].getPlotOffset();

  const contextHolder = {
    context: dataToDraw.drawingContext,
    top: 0,
    left: eleLeftPos - setLeftPos,
    height: dataToDraw.height,
    width: eleRightPos - eleLeftPos,
    mode: dataToDraw.mode,
    zoomOffset,
    xOffset: dataToDraw.leftCordinate + plotOffset.left,
    yOffset: dataToDraw.topCordinate + plotOffset.top,
    dataToDraw: dataToDraw,
  };

  services.drawBar(
    contextHolder,
    barConfiguration,
    $scope.paneObjArr[0],
    $scope
  );
};

export const drawFlightBar = (dataToDraw, data, zoomOffset, $scope) => {
  const context = dataToDraw.drawingContext;
  const gleft = 0;
  const gWidth = 0;
  const barConfiguration = services.getConfiguration(data, moduleName);

  const width = dataToDraw.width - gWidth;
  const plotOffset = $scope.paneObjArr[0].getPlotOffset();
  const contextHolder = {
    context,
    top: 0,
    left: gleft,
    height: dataToDraw.height,
    width: width,
    mode: dataToDraw.mode,
    zoomOffset,
    xOffset: dataToDraw.leftCordinate + plotOffset.left,
    yOffset: dataToDraw.topCordinate + plotOffset.top,
    dataToDraw: dataToDraw,
  };

  services.drawBar(
    contextHolder,
    barConfiguration,
    $scope.paneObjArr[0],
    $scope
  );
};

export const drawGanttItems = (dataToDraw, $scope, selectAll = false) => {
  if (dataToDraw.mode === 'HOVER') {
    return;
  }

  let eachTask = dataToDraw.eachTask;
  if (dataToDraw.mode === 'SHADOW') {
    unmountTooltip();
    eachTask = dataToDraw.eachTask.draggedTask;
  }
  const zoomOffset = getZoomOffset($scope);

  eachTask.selectAll = false;
  if (eachTask.type === 'PRG') {
    drawPairingBar(dataToDraw, eachTask, zoomOffset, $scope, () => {
      if (
        eachTask.activities &&
        Array.isArray(eachTask.activities) &&
        dataToDraw.mode !== 'SELECTION'
      ) {
        eachTask.activities.forEach(activity => {
          if (activity.type === 'LO') {
            activity.isLocked = eachTask.isLocked;
            drawLayover(dataToDraw, activity, zoomOffset, $scope);
          }

          if (
            activity.type === 'DUT' &&
            activity.activities &&
            Array.isArray(activity.activities)
          ) {
            activity.activities.forEach(activity => {
              activity.isLocked = eachTask.isLocked;
              drawDuty(dataToDraw, activity, zoomOffset, $scope);
            });
          }
        });
      }
    });
  }

  if (
    eachTask.type === 'FLT' ||
    eachTask.type === 'DHI' ||
    eachTask.type === 'CML'
  ) {
    eachTask.ganttItemType = eachTask.ganttItemType
      ? eachTask.ganttItemType
      : eachTask.type;
    drawFlightBar(dataToDraw, eachTask, zoomOffset, $scope);
  }

  // If we click selectAll then we need to highlight all the tasks
  if (selectAll && !eachTask.selected) {
    eachTask.selectAll = true;
    if (eachTask.type === 'PRG') {
      drawPairingBar(dataToDraw, eachTask, zoomOffset, $scope, () => {});
    } else if (
      eachTask.type === 'FLT' ||
      eachTask.type === 'DHI' ||
      eachTask.type === 'CML'
    ) {
      eachTask.ganttItemType = eachTask.ganttItemType
        ? eachTask.ganttItemType
        : eachTask.type;
      drawFlightBar(dataToDraw, eachTask, zoomOffset, $scope);
    }
  }
};
