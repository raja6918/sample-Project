'use strict';
import map from 'lodash/map';
import each from 'lodash/each';
import clone from 'lodash/clone';
import values from 'lodash/values';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import { layouts as iflightGanttLayout } from './layout';
import { ds } from './core';
import {
  isFunction,
  isString,
  getGanttTime,
  getDate,
  getUTCDateForTimeInMilliseconds,
  getdefaultGanttForCurrentRole,
  getDefaultDateTimeFormat,
  getDefaultTimeFormat,
  formatDateTime,
  formatMinutesToTime,
  deleteArrayElemByIdx,
  getUserInfo,
  getModule,
  iFlightWorker,
} from './utils';
import { safeConfigEval } from './eval';
import { iFlightMCastEventBus } from './core';

// Temporary fixing iFlightServerConnector dependency
const iFlightServerConnector = {};

// Temporary fixing spinnerService dependency
const spinnerService = {};

// Temporary fixing localization dependency
const localization = {};

/**
 * Assigning alias to libraries
 */
const contains = includes;
const pluck = map;
const jQuery = window.$;
const { $ } = window;

// image icon
let iconImage;

const ganttDependencies = {};

// freezePosition to be used for handling ruler
let freezePos = 0;

const paneZoomConfigs = {};

let ganttLayout = [];

// iFlightMetaData
function iFlightScreenMetaData() {
  this.mode = null;
  this.pageid = null;
  this.lwId = null;
  this.lwMode = null;
  this.isCB = null;
  this.cbId = null;
}

// valid list of  fetch tokens
const validTokenList = [];

// for drag and drop functionality
let dragPane = null;

// used for handling ganttViews
let ganttViews = [];

// used to handle multi-pane drag and single drop
let selectedItems = {};

// for handling tooltips across panes
let prevTip = {};

let referenceData = {
  OPS: {},
  CTS: {},
};

let ganttSubTasks = [];
const splitPaneStatus = {};
let rulerData = null;
let viewPlaceholder = null;
let paneMinHeight = 1;
const customZoomObject = {};
const polledComponents = {};
let isSplitNodeExpanded = false;

/**
 * rowList should be of format:
 * { rowId : itemList }
 */

function doubleLineConfig() {
  this.norRowList = {};
  this.treeRowList = {};
}

const doubleLineRows = {};

/**
 * for managing dataload on layout init
 */
function ganttLayoutConfig() {
  this.init = true;
  this.reload = false;
}

/**
 * Zoom configurations for each pane
 */
function gantPaneZoomConfig() {
  this.minTickHeight = 0;
  this.zoomOffset = 1;
  this.zoomLevel = 0;
  this.zoomRowCount = 0;
  this.zoomTo = 'days';
}

/**
 * Need description
 *
 * @param {string} pageid
 * @returns {*} localWorldContext[pageid]
 */
function getCurrLWId(pageid) {
  const localWorldContext = ds.getData('app', 'localWorldContext', null, {
    id: this.pageId,
  });
  return localWorldContext[pageid];
}

/**
 * Need description
 * @param {String} simData
 */
function getSimGanttPage(simData) {
  const getSimGanttPage = ds.getData('app', 'getSimGanttPage', null, {
    id: this.pageId,
  });
  return getSimGanttPage(simData);
}

/**
 * Need description
 * @param {String} simId
 */
function getSimDataById(simId) {
  const localWorldMaster = ds.getData('app', 'localWorldMaster', null, {
    id: this.pageId,
  });
  return localWorldMaster[simId];
}

/**
 * Need description
 * @param {String} simId
 * @param {String} simName
 */
function renameSimTab(simId, simName) {
  const localWorldMaster = ds.getData('app', 'localWorldMaster', null, {
    id: this.pageId,
  });
  localWorldMaster[simId].name = simName;
}

/**
 * Same pane will be splitted
 *
 * @param {string} pageid
 */
function updateSplitPaneHeight(plotArray) {
  let splitElement;
  let element;
  let splitPaneObject;
  let totalHeight = 0;
  for (let i = 0; i < plotArray.length; i++) {
    if (plotArray[i].getPlaceholder()[0].id.includes('split')) {
      splitElement = plotArray[i].getPlaceholder();
      splitPaneObject = plotArray[i];
    } else {
      element = plotArray[i].getPlaceholder();
    }
    totalHeight += plotArray[i].height();
  }
  if (splitPaneObject) {
    const minTickHeight = splitPaneObject.getOptions().series.gantt;
    const splitHeight =
      ((minTickHeight + splitPaneObject.getSeries().xaxis.labelHeight) * 100) /
      totalHeight;
    ds.addData('app', 'singleRowSplitResizeApplied', pageId, true);
    splitElement.parent().css('height', `${splitHeight}%`);
  }
  element.parent().resize();
}

/**
 * Need description
 * @param {Object} cbData
 * @param {Object} currentData
 */
function checkDuplicatesAndAddDataInClipboard(cbData, currentData) {
  var cbDataResultList = []; // This list will contain only the items that are added excluding duplicates, if any, and is returned to the calling function.
  for (var addIdx = 0; addIdx < cbData.length; addIdx++) {
    var addedCbData = cbData[addIdx];
    var cbDataToAdd = [];
    cbDataToAdd.push(addedCbData);
    cbDataResultList.push(addedCbData);
    for (var currIdx = 0; currIdx < currentData.cbData.length; currIdx++) {
      var currentCbData = currentData.cbData[currIdx];
      if (
        addedCbData.paneId === currentCbData.paneId &&
        addedCbData.isHeader === currentCbData.isHeader &&
        addedCbData.lwId === currentCbData.lwId
      ) {
        cbDataToAdd.pop();
        cbDataResultList.pop();
        var itemsToAdd = [];
        for (
          var addedDataIdx = 0;
          addedDataIdx < addedCbData.data.length;
          addedDataIdx++
        ) {
          var item = addedCbData.data[addedDataIdx];
          var duplicateFlag = false;
          // itemsToAdd.push(addedCbData.data[addedDataIdx]);
          for (
            var currDataIdxvar = 0;
            currDataIdxvar < currentCbData.data.length;
            currDataIdxvar++
          ) {
            if (
              currentCbData.data[currDataIdxvar].id ===
              addedCbData.data[addedDataIdx].id
            ) {
              item.isDuplicated = true;
              item.clipBoardDuplicateIndex = getDate().getTime();
              duplicateFlag = true;
              break;
            }
          }
          if (!duplicateFlag) {
            item.isDuplicated = false;
            item.clipBoardDuplicateIndex = null;
          }
          itemsToAdd.push(item);
          if (!item.isDuplicated) {
            currentCbData.data.push(item);
          }
        }

        if (itemsToAdd.length > 0) {
          cbDataResultList.push({
            paneId: addedCbData.paneId,
            isHeader: addedCbData.isHeader,
            lwId: addedCbData.lwId,
            data: itemsToAdd,
          });
        }

        break;
      }
    }

    for (var i = 0; i < cbDataToAdd.length; i++) {
      currentData.cbData.push(cbDataToAdd[i]);
    }
  }

  return cbDataResultList;
}

/**
 * Need description
 * @param {Object} cbData
 * @param {Object} currentData
 */
function removeDataFromClipboard(cbData, currentData) {
  for (var remIdx = 0; remIdx < cbData.length; remIdx++) {
    var removedCbData = cbData[remIdx];
    var idxToRemove = [];
    for (var currIdx = 0; currIdx < currentData.cbData.length; currIdx++) {
      var currentCbData = currentData.cbData[currIdx];
      var dataIdxToRemove = [];
      if (
        removedCbData.paneId === currentCbData.paneId &&
        removedCbData.isHeader === currentCbData.isHeader &&
        removedCbData.lwId === currentCbData.lwId
      ) {
        for (
          var removedDataIdx = 0;
          removedDataIdx < removedCbData.data.length;
          removedDataIdx++
        ) {
          for (
            var currDataIdxvar = 0;
            currDataIdxvar < currentCbData.data.length;
            currDataIdxvar++
          ) {
            if (
              currentCbData.data[currDataIdxvar].id ===
              removedCbData.data[removedDataIdx].id
            ) {
              dataIdxToRemove.push(currDataIdxvar);
              break;
            }
          }
        }

        if (dataIdxToRemove.length > 0) {
          currentCbData.data = deleteArrayElemByIdx(
            currentCbData.data,
            dataIdxToRemove
          );

          if (currentCbData.data.length === 0) {
            idxToRemove.push(currIdx);
          }
        }
        break;
      }
    }
  }

  if (idxToRemove.length > 0) {
    currentData.cbData = deleteArrayElemByIdx(currentData.cbData, idxToRemove);
  }
}

/**
 * Need description
 * @param {Object} timeModeData
 * @param {Object} dtoType
 * @param {Object} opType
 * @param {Object} dto
 * @param {Object} callBack
 * @param {Object} scope
 * @param {Object} componentID
 */
// Method to be called by gantt operation success handlers for immediately updating gantt rather than
// waiting for RTU
function checkFiltersAndDraw(
  timeModeData,
  dtoType,
  opType,
  dto,
  callBack,
  scope,
  componentID
) {
  const pagesconfig = ds.getData('app', 'pagesconfig', null, {
    id: this.pageId,
  });
  if (!pagesconfig.activepage) {
    console.log('ERROR : Active page is not available');
    return;
  }

  // TODO accept scope variable and us pageid from that
  var contextId = scope.pageid;
  const localWorldContext = ds.getData('app', 'localWorldContext', null, {
    id: contextId,
  });
  var localWorldId = localWorldContext[contextId];
  const realWorldContext = ds.getData('app', 'realWorldContext', null, {
    id: contextId,
  });
  var rwGanttTabIds = realWorldContext.ganttTabIds;

  const filterApplied = ds.getData('app', 'filterApplied', null, {
    id: this.pageId,
  });
  // If filter applied for RW or LW
  if (
    (rwGanttTabIds.indexOf(contextId) !== -1 &&
      filterApplied['RW'] &&
      filterApplied['RW'][componentID.toLowerCase()]) ||
    (filterApplied[localWorldId] &&
      filterApplied[localWorldId][componentID.toLowerCase()])
  ) {
    var realTimeFilterDTO = {
      userId: getUserInfo().userName,
      lwID: localWorldId,
      componentID: componentID,
      timeModeData: timeModeData,
      businessDTOType: dtoType,
      operationType: opType,
      businessDTOsStr: JSON.stringify(dto),
    };

    iFlightServerConnector.send(
      scope,
      'applyFilterForRTUpdate',
      { realTimeFilterDTOList: [realTimeFilterDTO] },
      function(response) {
        var dto = [];
        response.realTimeFilterDTOList.forEach(function(obj, index) {
          dto = dto.concat(obj.businessDTOs);
        });
        callBack(dto);
      }
    );
  } else {
    callBack(dto);
  }
}

/**
 * Need description
 *
 * @param {*} scrollbar
 */
function scrollBarRenderer(scrollbar) {
  const scrollCanvas = scrollbar.getScrollbarCanvas();
  const scrollCtx = scrollCanvas.getContext('2d');
  const { startX } = scrollbar;
  const { startY } = scrollbar;
  const { scrollBarHeight } = scrollbar;
  const { scrollBarWidth } = scrollbar;
  const { scrollbarStartX } = scrollbar;
  const { scrollbarStartY } = scrollbar;
  const { actualScrollBarLength } = scrollbar;

  scrollCtx.fillStyle = '#F2F2F2';

  scrollCtx.lineWidth = 1;
  scrollCtx.strokeStyle = '#F2F2F2'; // draw border
  if (scrollbar.scrollDirection === 'horizontal') {
    scrollCtx.fillRect(
      startX,
      startY,
      startX + scrollBarHeight,
      startY + scrollBarWidth
    );
    scrollCtx.strokeRect(
      scrollbarStartX,
      scrollbarStartY,
      actualScrollBarLength,
      scrollBarWidth
    );
  } else if (scrollbar.scrollDirection === 'vertical') {
    scrollCtx.fillRect(
      startX,
      startY,
      startX + scrollBarWidth,
      startY + scrollBarHeight
    );
    scrollCtx.strokeRect(
      scrollbarStartX,
      scrollbarStartY,
      scrollBarWidth,
      actualScrollBarLength
    );
  }
  scrollCtx.stroke();
}

/**
 * Need description
 *
 * @param {*} arrowBox
 */
function arrowBoxRenderer(arrowBox) {
  let firstArrowContext;
  let firstArrowBox;
  if (arrowBox.left) {
    // eslint-disable-next-line no-unused-expressions
    (firstArrowContext = arrowBox.left.scrollCtx),
      (firstArrowBox = arrowBox.left);
    firstArrowContext.fillStyle = '#FAFAFA';
    firstArrowContext.fillRect(
      firstArrowBox.startX,
      firstArrowBox.startY,
      firstArrowBox.boxWidth,
      firstArrowBox.boxHeight
    );
    firstArrowContext.lineWidth = 1;
    firstArrowContext.strokeStyle = '#A6A6A6'; // draw border
    firstArrowContext.strokeRect(
      firstArrowBox.startX,
      firstArrowBox.startY,
      firstArrowBox.boxWidth,
      firstArrowBox.boxHeight
    );
    firstArrowContext.stroke();
    // draw left arrow
    firstArrowContext.beginPath();
    firstArrowContext.moveTo(
      firstArrowBox.startX + 2,
      firstArrowBox.startY + firstArrowBox.boxHeight / 2
    );
    firstArrowContext.lineTo(
      firstArrowBox.startX + firstArrowBox.boxWidth - 2,
      firstArrowBox.startY + 2
    );
    firstArrowContext.lineTo(
      firstArrowBox.startX + firstArrowBox.boxWidth - 2,
      firstArrowBox.startY + firstArrowBox.boxHeight - 2
    );
    firstArrowContext.closePath();
  } else {
    // eslint-disable-next-line no-unused-expressions
    (firstArrowContext = arrowBox.top.scrollCtx),
      (firstArrowBox = arrowBox.top);
    firstArrowContext.fillStyle = 'white';
    firstArrowContext.fillRect(
      firstArrowBox.startX,
      firstArrowBox.startY,
      firstArrowBox.boxWidth,
      firstArrowBox.boxHeight
    );
    firstArrowContext.lineWidth = 1;
    firstArrowContext.strokeStyle = 'grey'; // draw border
    firstArrowContext.strokeRect(
      firstArrowBox.startX,
      firstArrowBox.startY,
      firstArrowBox.boxWidth,
      firstArrowBox.boxHeight
    );
    firstArrowContext.stroke();
    // draw top arrow
    firstArrowContext.beginPath();
    firstArrowContext.moveTo(
      firstArrowBox.startX + firstArrowBox.boxWidth / 2,
      firstArrowBox.startY + 2
    );
    firstArrowContext.lineTo(
      firstArrowBox.startX + 2,
      firstArrowBox.startY + firstArrowBox.boxHeight - 3
    );
    firstArrowContext.lineTo(
      firstArrowBox.startX + firstArrowBox.boxWidth - 2,
      firstArrowBox.startY + firstArrowBox.boxHeight - 3
    );
    firstArrowContext.closePath();
  }
  firstArrowContext.fillStyle = '#000000';
  firstArrowContext.fill();
  let secondArrowContext;
  let secondArrowBox;
  if (arrowBox.left) {
    // eslint-disable-next-line no-unused-expressions
    (secondArrowContext = arrowBox.right.scrollCtx),
      (secondArrowBox = arrowBox.right);
    secondArrowContext.fillStyle = '#FAFAFA';
    secondArrowContext.fillRect(
      secondArrowBox.startX,
      secondArrowBox.startY,
      secondArrowBox.boxWidth,
      secondArrowBox.boxHeight
    );
    secondArrowContext.lineWidth = 1;
    secondArrowContext.strokeStyle = '#A6A6A6'; // draw border
    secondArrowContext.strokeRect(
      secondArrowBox.startX,
      secondArrowBox.startY,
      secondArrowBox.boxWidth,
      secondArrowBox.boxHeight
    );
    secondArrowContext.stroke();
    // draw right arrow
    secondArrowContext.beginPath();
    secondArrowContext.moveTo(
      secondArrowBox.startX + 2,
      secondArrowBox.startY + 2
    );
    secondArrowContext.lineTo(
      secondArrowBox.startX + 2,
      secondArrowBox.startY + secondArrowBox.boxHeight - 2
    );
    secondArrowContext.lineTo(
      secondArrowBox.startX + secondArrowBox.boxWidth - 2,
      secondArrowBox.startY + secondArrowBox.boxHeight / 2
    );
    secondArrowContext.closePath();
  } else {
    // eslint-disable-next-line no-unused-expressions
    (secondArrowContext = arrowBox.bottom.scrollCtx),
      (secondArrowBox = arrowBox.bottom);
    secondArrowContext.fillStyle = 'white';
    secondArrowContext.fillRect(
      secondArrowBox.startX,
      secondArrowBox.startY,
      secondArrowBox.boxWidth,
      secondArrowBox.boxHeight
    );
    secondArrowContext.lineWidth = 1;
    secondArrowContext.strokeStyle = 'grey'; // draw border
    secondArrowContext.strokeRect(
      secondArrowBox.startX,
      secondArrowBox.startY,
      secondArrowBox.boxWidth,
      secondArrowBox.boxHeight
    );
    secondArrowContext.stroke();
    // draw bottom arrow
    secondArrowContext.beginPath();
    secondArrowContext.moveTo(
      secondArrowBox.startX + 2,
      secondArrowBox.startY + 2
    );
    secondArrowContext.lineTo(
      secondArrowBox.startX + secondArrowBox.boxWidth - 2,
      secondArrowBox.startY + 2
    );
    secondArrowContext.lineTo(
      secondArrowBox.startX + secondArrowBox.boxWidth / 2,
      secondArrowBox.startY + secondArrowBox.boxHeight - 2
    );
    secondArrowContext.closePath();
  }
  secondArrowContext.fillStyle = '#000000';
  secondArrowContext.fill();
}

/**
 * Need description
 *
 * @param {*} scrollbox
 */
function horzScrollBoxRenderer(scrollbox) {
  const { scrollCtx } = scrollbox;
  const { scrollBoxStartX } = scrollbox;
  const scrollBoxStartY = 1;
  const { scrollBoxLength } = scrollbox;
  const scrollBoxWidth = 6;
  const cornerRadius = 6;
  scrollCtx.strokeStyle = '#D8D8D8';
  scrollCtx.fillStyle = '#D8D8D8';
  scrollCtx.lineJoin = 'round';
  scrollCtx.lineWidth = cornerRadius;
  scrollCtx.strokeRect(
    scrollBoxStartX + cornerRadius / 2,
    scrollBoxStartY + cornerRadius / 2 + 3,
    scrollBoxLength - cornerRadius,
    scrollBoxWidth - cornerRadius
  );
  scrollCtx.imageSmoothingEnabled = true;
  // scrollCtx.fillRect(
  //   scrollBoxStartX + 1,
  //   scrollBoxStartY + 1,
  //   scrollBoxLength - 1,
  //   scrollBoxWidth - 2
  // );
}

function vertScrollBoxRenderer(scrollbox) {
  const { scrollCtx } = scrollbox;
  const scrollBoxStartX = 1;
  const { scrollBoxStartY } = scrollbox;
  const { scrollBoxLength } = scrollbox;
  const scrollBoxWidth = 7;
  const cornerRadius = 6;
  scrollCtx.strokeStyle = '#999';
  scrollCtx.fillStyle = '#999';
  scrollCtx.lineJoin = 'round';
  scrollCtx.lineWidth = cornerRadius;
  scrollCtx.strokeRect(
    scrollBoxStartX + cornerRadius / 2 + 3,
    scrollBoxStartY + cornerRadius / 2,
    scrollBoxWidth - cornerRadius + 2,
    scrollBoxLength - cornerRadius
  );
  // scrollCtx.fillRect(
  //   scrollBoxStartX + 1,
  //   scrollBoxStartY + 0.5,
  //   scrollBoxWidth - 2,
  //   scrollBoxLength - 1
  // );
}

/**
 * Need description
 * @param {String} pageid
 */
function checkOPSpage(pageid) {
  const moduleConfig = ds.getData('app', 'moduleConfig', null, { id: pageid });
  return moduleConfig.OPS.indexOf(pageid) != -1 ? true : false;
}

/**
 * Need description
 * @param {String} pageid
 */
function checkCTSpage(pageid) {
  const moduleConfig = ds.getData('app', 'moduleConfig', null, { id: pageid });
  return moduleConfig.CTS.indexOf(pageid) != -1 ? true : false;
}

/**
 * Need description
 * @param {Object} dependencies
 * @param {String} moduleName
 */
function setGanttDependencies(dependencies, moduleName) {
  ganttDependencies[moduleName] = dependencies;
}

/**
 * Need description
 * @param {String} moduleName
 */
function getGanttDependencies(moduleName) {
  return ganttDependencies[moduleName];
}

/**
 * Function to return log value with base 10.
 */
function getLog(value) {
  return Math.log(value) / Math.log(10);
}

/**
 * Need description
 * @param {Object} zoomObject
 * @param {Object} zoomParameters
 */
function calculateCurrentZoomCount(zoomObject, zoomParameters) {
  return zoomObject.zoomOffset === 1
    ? 0
    : getLog(zoomObject.zoomOffset) / getLog(zoomParameters.rowZoomParameter);
}

/**
 * @description
 *
 * Function that will clean up the developer given chronos overriden options,
 * means that it will merge the overridong options with custom options also default options that service provided.
 *
 * initPane function will invoke this
 * It is required in iFlight and Sierra
 *
 * @param {Object} customOptions - it is the same customoptios object that passed from initPane function
 * @param {number} totalNoOfItems - It is not used, will remove in the refactor task
 * @param {Object} ganttDateRange
 *  fromDate(in milliSeconds) - this is the start date of the gantt period not the visible area start date.
 *  toDate(in milliSeconds) - this is the end date of the gantt period not the visible area end date.
 * @param {Object} overridingOptions - developer given chronos overriding options
 * @param {Object} normalMaximumDaySpan - normal pairing duration, default value is 2.
 * @returns {Object} paneOptions - By doing some modification this function will return proper paneOptions object which can be used in initpane for creating paneObject.
 */
function setPaneConfigurations(
  customOptions,
  totalNoOfItems,
  ganttDateRange,
  overridingOptions,
  normalMaximumDaySpan
) {
  const ganttConfigs = ds.getData('app', 'ganttConfiguration', null, {
    id: this.pageId,
  });
  const tempDate = new Date(ganttDateRange.startDate);
  const xVisibleRange = customOptions.xAxisVisibleRange;
  const ganttConfiguration = ganttConfigs[customOptions.moduleName];
  const oneDay = 24 * 3600 * 1000; // timeInMilliSeconds for one day
  const defaultExtraFetchFactor = 0.5;
  const minZoomInDays = this.getMinZoomInLevel(customOptions.moduleName); // min days per ganttconfiguration
  const maxZoomOutDays = this.getMaxZoomOutLevel(customOptions.moduleName); // max days per ganttconfiguration
  const horExtraFetch =
    parseFloat(ganttConfiguration.horExtraFetch) || defaultExtraFetchFactor;
  const verExtraFetch =
    parseFloat(ganttConfiguration.verExtraFetch) || defaultExtraFetchFactor;
  const isAutoLW = ds.getData('app', 'isAutoLW', null, { id: this.pageId });
  const color2 =
    this.getCurrentLWId(customOptions.pageid) !== undefined &&
    !isAutoLW(customOptions.pageid)
      ? `#${ganttConfiguration.lwBackground}`
      : `#${ganttConfiguration.background2}`;
  const labelWidth =
    overridingOptions.plotOptions.yaxis &&
    overridingOptions.plotOptions.yaxis.labelWidth
      ? overridingOptions.plotOptions.yaxis.labelWidth
      : this.paneOptions.plotOptions.yaxis.labelWidth;
  const defaultOptions = {
    plotOptions: {
      xaxis: {
        zoomRange: [oneDay * minZoomInDays, oneDay * maxZoomOutDays], // min and max days per ganttconfiguration
        scrollRange: [ganttDateRange.startDate, ganttDateRange.endDate],
        min: xVisibleRange[0],
        max: xVisibleRange[1],
        tickStyle: {
          tickColor: `#${ganttConfiguration.gridLines}`,
        },
        multiLineTimeHeader: {
          displayWeek: {
            enable: ganttConfiguration.displayWeek === 'true',
            weekFirstDay: parseInt(ganttConfiguration.weekFirstDay, 10),
          },
          majorTickStyle: {
            tickColor: `#${ganttConfiguration.dayChangeLines}`, // dayChangeLines
          },
        },
      },
      yaxis: {
        scrollRange: [0, totalNoOfItems],
        min: customOptions.yAxisVisibleRange[0],
        max: customOptions.yAxisVisibleRange[1],
        defaultMarkings: {
          alternateRowColor: [`#${ganttConfiguration.background1}`, color2],
        },
      },
      mouseTracker: {
        lineColor: `#${ganttConfiguration.ruler}`,
      },
      taskTracker: {
        lineColor: `#${ganttConfiguration.ruler}`,
      },
      series: {
        gantt: {
          normalMaximumDaySpan,
          viewRangeChangedCallback: customOptions.scrollRangeChangeCallback,
        },
      },
      interaction: {
        extraFetchFactor: {
          horizontal: horExtraFetch, // in percentage of the view area 1=> 100% means full View horizontally will be fetched
          vertical: verExtraFetch, // in percentage of the view area 1=> 100% means full View vertically will be fetched
        },
      },
      multiScreenFeature: customOptions.multiScreenFeature,
      zoom: {
        zoomPoint: 'left',
      },
    },
  };

  // UI FW to use JQuery drag and drop instead of HTML5 drag and drop if IE11
  // as IE11 has accuracy issues in capturing mouse x and y values on drag start
  if (window.isIE11) {
    defaultOptions.plotOptions.interaction = {
      eventType: 'JQUERY_DRAG',
    };
  }

  if (customOptions.isTree) {
    $.extend(true, defaultOptions.plotOptions.yaxis, {
      treeNode: {
        nodeLimit: 1,
        nodeRenderer: customOptions.treeHandler.treeNodeRenderer,
        initialyCollapsed: !!customOptions.treeHandler.initialyCollapsed,
        openMultiple: !!customOptions.treeHandler.openMultiple,
        eventCallback: !!(
          customOptions.multiScreenFeature &&
          customOptions.multiScreenFeature.enabled
        ),
      },
      multiColumnLabel: {
        columns: [
          {
            width: labelWidth,
            cellRenderer: customOptions.labelRenderer,
            cellProperty: customOptions.treeHandler.cellProperty,
            nodeLevel: 2,
            minWidth: 20,
            border: {
              width: 0,
            },
          },
        ],
        border: {
          width: 0,
        },
        header: {
          backgroundColor: '#ededed',
          resizable: false,
        },
      },
    });
    // overridingOptions.plotOptions.series.gantt.wrappedRows.enabled = false;
  } else {
    $.extend(true, defaultOptions.plotOptions.yaxis, {
      labelRenderer: customOptions.labelRenderer,
    });
  }
  $.extend(true, defaultOptions.plotOptions.xaxis.multiLineTimeHeader, {
    majorTickFormatter(val, axis) {
      const timeUnitSize = {
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        month: 2592000000,
        year: 31556952000,
      };
      const t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]]; // size * unitSize[unit]
      const fmt =
        // eslint-disable-next-line no-nested-ternary
        t < timeUnitSize.day
          ? customOptions.majorTickFormat
            ? customOptions.majorTickFormat
            : '%D %b %Y %W'
          : '%b %y';
      return $.chronos.formatDate(new Date(val), fmt, null);
    },
  });
  const editedPaneOptions = $.extend(
    true,
    {},
    defaultOptions,
    overridingOptions
  );
  const paneOptions = $.extend(true, {}, this.paneOptions, editedPaneOptions);
  const startDateCallback =
    paneOptions.plotOptions.series.gantt.startDateAttribute;
  const startDateAttribute = function(eachTask) {
    const startDate = startDateCallback(eachTask);
    if (typeof eachTask[startDate] !== 'number') {
      eachTask[startDate] = getGanttTime(eachTask[startDate]);
    }
    return startDate;
  };
  paneOptions.plotOptions.series.gantt.startDateAttribute = startDateAttribute;
  const endDateCallback = paneOptions.plotOptions.series.gantt.endDateAttribute;
  const endDateAttribute = function(eachTask) {
    const endDate = endDateCallback(eachTask);
    if (typeof eachTask[endDate] !== 'number') {
      eachTask[endDate] = getGanttTime(eachTask[endDate]);
    }
    return endDate;
  };
  paneOptions.plotOptions.series.gantt.endDateAttribute = endDateAttribute;
  return paneOptions;
}

/**
 * @description
 *
 * Used to invocate chronos scrollBar method by injecting user defined properties if any.
 *
 * @param {string} horizontalScrollBarId - html element id to which we need to append scrollbar.
 * @param {Object} options
 * @returns {Object} horizontalScrollBar options returned by chronos
 */
function createHorizontalScollBar(horizontalScrollBarId, options) {
  const { scrollOptions } = options;
  if (scrollOptions) {
    if (scrollOptions.scrollOffset) {
      $.extend(
        this.paneOptions.hScrollOptions.scrollOffset,
        scrollOptions.scrollOffset
      );
    }
  }

  const iflightHorizontalScrollbar = document.querySelector(
    'iflight-horizontal-bar'
  ).shadowRoot;
  const placeholder = iflightHorizontalScrollbar.querySelector(
    `#${horizontalScrollBarId}`
  );

  // function that creates horizontal scrollbar object
  const horizontalScrollBar = $.scrollBar(
    placeholder,
    this.paneOptions.hScrollOptions
  );
  return horizontalScrollBar;
}

/**
 * For getting the dragPane object
 *
 * @returns {Object} dragPane object
 */
function getDragPane() {
  return dragPane;
}

/**
 * For setting the dragPane object
 *
 * @param {Object} plotLabel
 */
function setDragPane(plotLabel) {
  dragPane = plotLabel;
}

/**
 * For getting the ganttViews array - when you use multiple tabs
 *
 * @returns {Array} ganttViews array
 */
function getGanttViews() {
  return ganttViews;
}

/**
 * For adding new views in ganttView array
 *
 * @param {Object} view
 */
function addGanttView(view) {
  ganttViews[view.key] = view;
}

/**
 * For removing a view from ganttView array
 *
 * @param {Object} view
 */
function removeGanttView(key) {
  if (typeof key !== 'string') {
    key = key.key;
  }
  if (ganttViews[key]) {
    delete ganttViews[key];
  }
}

/**
 * Need description
 * @param {String} dateVal
 */
function getTimeOnDST(dateVal) {
  let dateValMS = null;
  if (dateVal instanceof Date) {
    if (dateVal.isDSTCutOver) {
      dateValMS = dateVal.getTime();
    } else {
      dateValMS = dateVal.getTime() - dateVal.getTimezoneOffset() * 1000 * 60;
    }
  } else {
    dateValMS = dateVal;
  }
  return dateValMS;
}

/**
 * To get visible area x and y cordinates
 *
 * @param {Object} plot - chronos plot object
 * @returns {Object}
 */
function getCurrentVisibleArea(plot) {
  if (plot && plot.constructor.name === 'Chronos') {
    const currentVisibleData = plot;
    let displayYValueMin = Math.ceil(currentVisibleData.yValueMin);
    const displayYValueMax = Math.floor(currentVisibleData.yValueMax);
    let actualYValueMin = plot.getSeries().displayedRowIds[displayYValueMin];
    const actualYValueMax = plot.getSeries().displayedRowIds[displayYValueMax];

    if (currentVisibleData.yValueMin === -1) {
      displayYValueMin = 0;
      actualYValueMin = 0;
    }

    const displayXValueMin = currentVisibleData.fromDate;
    const displayXValueMax = currentVisibleData.toDate;
    const actualXValueMin = plot.resetViewPortTime(displayXValueMin);
    const actualXValueMax = plot.resetViewPortTime(displayXValueMax);

    return {
      xaxis: {
        min: displayXValueMin,
        max: displayXValueMax,
        actual: {
          min: actualXValueMin,
          max: actualXValueMax,
        },
      },
      yaxis: {
        min: displayYValueMin,
        max: displayYValueMax,
        actual: {
          min: actualYValueMin,
          max: actualYValueMax,
        },
      },
    };
  }
  return null;
}

/**
 * To toggle between tree view
 *
 * @param {Array} allPlot
 * @param {Object} ganttModel
 * @param {boolean} isTree
 * @param {boolean} isSplitMode
 */
function toggleTreeView(allPlot, ganttModel, isTree, isSplitMode) {
  let uniqueID = ganttModel.paneId.substring(0, ganttModel.paneId.length - 15);
  const pagesconfig = ds.getData('app', 'pagesconfig', null, {
    id: this.pageId,
  });
  const topPane = this.getTopPane(pagesconfig.activepage.id);
  const enableTreeMode = ganttModel.customOptions.treeHandler;
  for (let i = 0; i < allPlot.length; i++) {
    let plot = allPlot[i];
    const placeHolderId = plot.getPlaceholder().attr('id');
    uniqueID =
      placeHolderId.indexOf('_split') !== -1 ? `${uniqueID}_split` : uniqueID;
    const isSplitNotDone = !!(
      !isSplitMode && ganttModel.customOptions.isSplitEnabled
    );
    if (isTree) {
      plot = allPlot[i + 1];
      if (isSplitNotDone) {
        plot.getOptions().mouseTracker.enable = true;
        plot.getOptions().mouseTracker.direction = 'horizontal';
      } else {
        plot.getOptions().mouseTracker.enable = false;
      }
      if (plot.getOptions().multiScreenFeature.enabled) {
        const customData = plot.getOptions().multiScreenFeature;
        const screenId = $.multiScreenScroll.getCurrScreenId(customData.key);
        if (
          screenId === 0 &&
          `${topPane}ui-gantt_holder_tree` ===
            plot.getPlaceholder().attr('id') &&
          allPlot[i + 1].getXAxes()[0].showLabel
        ) {
          plot.setXAxisOptions('showLabel', true);
        } else if (window.linkage === 'horizontal') {
          plot.setXAxisOptions('showLabel', true);
        } else if (window.linkage === 'vertical') {
          plot.setXAxisOptions('showLabel', false);
        }
      } else if (!isSplitMode) {
        if (
          `${topPane}ui-gantt_holder_tree` ===
            plot.getPlaceholder().attr('id') ||
          allPlot[i + 1].getXAxes()[0].showLabel
        ) {
          plot.setXAxisOptions('showLabel', true);
        } else {
          plot.setXAxisOptions('showLabel', false);
        }
      }
      if (!enableTreeMode) {
        if (!isSplitMode) {
          plot.initialyCollapsed = plot.getOptions().yaxis.treeNode.initialyCollapsed;
        } else if (isSplitMode && isSplitNodeExpanded) {
          plot.initialyCollapsed = plot.getOptions().yaxis.treeNode.initialyCollapsed;
        }
      }
      $(`#${uniqueID}ui-ganttArea-container`).hide();
      $(`#${uniqueID}ui-ganttArea-container_tree`).show();
    } else {
      if (isSplitNotDone) {
        plot.getOptions().mouseTracker.enable = true;
        plot.getOptions().mouseTracker.direction = 'horizontal';
      } else {
        plot.getOptions().mouseTracker.enable = false;
      }
      if (plot.getOptions().multiScreenFeature.enabled) {
        const customData = plot.getOptions().multiScreenFeature;
        const screenId = $.multiScreenScroll.getCurrScreenId(customData.key);
        if (
          screenId === 0 &&
          `${topPane}ui-gantt_holder` === plot.getPlaceholder().attr('id') &&
          allPlot[i + 1].getXAxes()[0].showLabel
        ) {
          plot.setXAxisOptions('showLabel', true);
        } else if (
          window.linkage === 'horizontal' &&
          `${topPane}ui-gantt_holder` === plot.getPlaceholder().attr('id')
        ) {
          plot.setXAxisOptions('showLabel', true);
        } else if (window.linkage === 'vertical') {
          plot.setXAxisOptions('showLabel', false);
        }
      } else if (!isSplitMode) {
        if (
          `${topPane}ui-gantt_holder` === plot.getPlaceholder().attr('id') ||
          allPlot[i + 1].getXAxes()[0].showLabel
        ) {
          plot.setXAxisOptions('showLabel', true);
        } else {
          plot.setXAxisOptions('showLabel', false);
        }
      }
      $(`#${uniqueID}ui-ganttArea-container_tree`).hide();
      $(`#${uniqueID}ui-ganttArea-container`).show();
    }
    if (isSplitMode && uniqueID.indexOf('_split') !== -1) {
      plot.setXAxisOptions('showLabel', true);
    } else if (isSplitMode && uniqueID.indexOf('_split') === -1) {
      plot.setXAxisOptions('showLabel', false);
    }
    plot.clearDataAndRefetchData();
    this.resizePane(plot);
    i += 1;
  }
}

/**
 * Need description
 * @param {Object} pane
 * @param {String} pageId
 */
function getPaneDomId(pane, pageId) {
  var domId = '',
    domIdPrio = '';
  if (pane == 'AircraftPane') {
    domId =
      'chronos_base' +
      pageId +
      '_gantt_placeholder_aircraftPaneWidgetui-gantt_holder';
    domIdPrio =
      'chronos_priority' +
      pageId +
      '_gantt_placeholder_aircraftPaneWidgetui-gantt_holder';
  } else if (pane == 'UnassignedPane') {
    domId =
      'chronos_base' +
      pageId +
      '_gantt_placeholder_unassigned_unassignedPaneWidgetui-gantt_holder';
  } else if (pane == 'HangarPane') {
    domId =
      'chronos_base' +
      pageId +
      '_gantt_placeholder_hangar_hangarPaneWidgetui-gantt_holder';
  }
  return [domId, domIdPrio];
}

/**
 * @description
 *
 * Webcomponent first call ganttOptions.initializer. This function fetch data range and initial total rows. After initializer init pane is called.
 *
 * createAirCraftPaneResponseHandler call this function after it get create gantt API response. ie data range and row ids.
 *
 * Primary task of this function to set initData in ganttModal. When initData us updated it will trigger web component watcher (oberver) which inturn call initPane in services.
 *
 * Configurations are injected to web component from controller by attaching it to webComponentRef.scope
 *
 * @param {Object} response - API response
 * @param {Object} ganttModel
 * @param {Object} splitHeaderId - undefined - To slip gantt into 2 parts. If split applied it has a header id and a flag to identify whether this is a tree or not.
 * @param {Object} isTreeMode
 * @param {*Object ignoreLoadPeriod
 */
function prepareInitData(
  response,
  ganttModel,
  splitHeaderId,
  isTreeMode,
  ignoreLoadPeriod
) {
  // function to convert server response to gantt model init-data
  let splitHeaderIdPosition;
  const groupedHeaderItems = {};
  const headerIds = [];
  if (splitHeaderId && isTreeMode) {
    // eslint-disable-next-line guard-for-in
    for (const index in response.loadPeriodRowIds) {
      const item = response.loadPeriodRowIds[index];
      if (item[1] === splitHeaderId) {
        splitHeaderIdPosition = index;
      }
      if (!groupedHeaderItems[item[0]]) {
        groupedHeaderItems[item[0]] = [];
      }
      groupedHeaderItems[item[0]].push(item[1]);
      if (headerIds.indexOf(item[0]) === -1) {
        headerIds.push(item[0]);
      }
    }
    const splitHeader = response.loadPeriodRowIds[splitHeaderIdPosition][0];
    const splitHeaderIndex = headerIds.indexOf(splitHeader);
    if (splitHeaderIndex !== headerIds.length) {
      headerIds.splice(headerIds.indexOf(splitHeader) + 1);
    }

    response.loadPeriodRowIds = filter(response.loadPeriodRowIds, function(
      item
    ) {
      const index = headerIds.indexOf(item[0]);
      if (splitHeaderId === item[1]) {
        headerIds.splice(index, 1);
      }
      return index !== -1;
    });
  } else if (splitHeaderId) {
    splitHeaderIdPosition =
      indexOf(pluck(response.loadPeriodRowIds, 1), splitHeaderId) + 1;
    if (splitHeaderIdPosition === 0) {
      splitHeaderIdPosition = 1;
    }
    response.loadPeriodRowIds.splice(
      -1 * (response.loadPeriodRowIds.length - splitHeaderIdPosition),
      response.loadPeriodRowIds.length - splitHeaderIdPosition
    );
  }
  let fromDate;
  let toDate;
  if (ignoreLoadPeriod) {
    fromDate = response.loadPeriodStartDate;
    toDate = response.loadPeriodEndDate;
  } else {
    const loadPeriodEndDate = ds.getData('app', 'loadPeriodEndDate', null, {
      id: this.pageId,
    });
    const loadPeriodStartDate = ds.getData('app', 'loadPeriodStartDate', null, {
      id: this.pageId,
    });
    fromDate = this.getTimeOnDST(loadPeriodStartDate);
    toDate = this.getTimeOnDST(loadPeriodEndDate);
  }

  ganttModel.initData = {
    fromDate,
    toDate,
    rowIds: response.loadPeriodRowIds,
    normalMaximumDaySpan: response.normalMaximumDaySpan,
  };
}

/**
 * @description
 *
 * Used to call iFlightWorker to transform the API response data.
 * This function set ganttData in gantModel which inturn trigger updates then webcomponent call plot.updateGanttData
 *
 * In case of Sirra the response only need ganttHeader and ganttData. The ganttHeader only need rowIds.
 *
 *
 * @param {Object} response - Response from API - must contain ganttHeader(array of objs - list of headers) and ganttData (obj that container a key with array of data. This key is defined in configuration as ganttItemType)
 * @param {Object} ganttModel - Webcomponent's data model
 * @param {string} headerType - Key name of ganttHeader - you can give any dummy string
 * @param {string} plotLabel - each plot or timeline should have unique name. This should match with plotLabel in ganttoptions
 * @param {string} pageId - can we any dummy value in case of Sierra.
 * @param {Object} skipTokenCheck - true
 * @param {Object} updateDataObject - can set to null - called when data is iterated.
 * @param {Object} callback - called after data is iterated.
 */
/*
 *  updateCurrentGanttData is a callback for updating current gantt data with old data map item.
 */
function modifyForGantt(
  response,
  ganttModel,
  headerType,
  plotLabel,
  pageId,
  skipTokenCheck,
  updateDataObject,
  callback
) {
  // function to convert server response to gantt-data
  var isLastestRes = true; // this.isLatestToken(plotLabel, pageId, parseInt(response.responseToken));
  if (ganttModel && (isLastestRes || skipTokenCheck)) {
    var context = plotLabel + pageId,
      interationRestrictMap,
      updateDataObject = updateDataObject || {};
    if (ganttModel && ganttModel.customOptions) {
      interationRestrictMap = ganttModel.customOptions.interationRestrictMap;
      updateDataObject.taskIdProviderCallBack =
        ganttModel.customOptions.ganttOptions.taskIdProviderCallBack;
    }

    iFlightWorker.call(
      'modifyForGantt',
      [response, interationRestrictMap, headerType, plotLabel, pageId],
      function(masterGanttData) {
        var updateDataObjectDefined = false;
        if (
          updateDataObject &&
          updateDataObject.data &&
          updateDataObject.callback &&
          isFunction(updateDataObject.callback)
        ) {
          updateDataObjectDefined = true;
        }
        var interationRestrictCallbackDefined =
          interationRestrictMap &&
          filter(interationRestrictMap, function(interationRestrict, key) {
            return (
              masterGanttData.ganttItemTypeList.indexOf(key) != -1 &&
              interationRestrict.callback &&
              isFunction(interationRestrict.callback)
            );
          }).length > 0;
        delete masterGanttData.ganttItemTypeList;
        if (updateDataObjectDefined || interationRestrictCallbackDefined) {
          each(masterGanttData[response.ganttDataType].data, function(newData) {
            var key = newData.ganttItemType;
            // set interation Restrictions
            if (
              interationRestrictCallbackDefined &&
              interationRestrictMap.hasOwnProperty(key)
            ) {
              var callback = interationRestrictMap[key].callback,
                actions = interationRestrictMap[key].actions;
              var callbackDefined = callback && isFunction(callback);
              if (callbackDefined) {
                if (
                  contains(actions, 'dragOrDrop') &&
                  callback(newData, 'dragOrDrop') &&
                  !newData.modifyPermission
                ) {
                  newData.draggable = true;
                }
                if (
                  contains(actions, 'itemResize') &&
                  callback(newData, 'itemResize') &&
                  !newData.modifyPermission
                ) {
                  newData.resizable = true;
                }
                if (
                  contains(actions, 'overlap') &&
                  callback(newData, 'overlap')
                ) {
                  newData.wrappable = true;
                }
              }
            }
            if (
              updateDataObjectDefined &&
              updateDataObject.taskIdProviderCallBack
            ) {
              var oldData =
                updateDataObject.data[
                  updateDataObject.taskIdProviderCallBack(newData)
                ];
              if (oldData && updateDataObject.callback) {
                updateDataObject.callback(oldData, newData);
              }
            }
          });
        }

        ganttModel.ganttData = masterGanttData;
        if (callback && isFunction(callback)) {
          callback();
        }
      },
      context
    );
  }
  return skipTokenCheck ? skipTokenCheck : isLastestRes;
}

/**
 * Need description
 * @param {string} pageid
 * @param {object} norRowList
 * @param {object} treeRowList
 */
function setDoubleLineRows(pageid, norRowList, treeRowList) {
  if (!doubleLineRows[pageid]) {
    doubleLineRows[pageid] = new doubleLineConfig();
  }
  doubleLineRows[pageid].norRowList = norRowList || {};
  doubleLineRows[pageid].treeRowList = treeRowList || {};
  return doubleLineRows[pageid];
}

/**
 * Need description
 * @param {string} pageid
 */
function getDoubleLineRows(pageid) {
  if (!doubleLineRows[pageid]) {
    doubleLineRows[pageid] = new doubleLineConfig();
  }
  return doubleLineRows[pageid];
}

/**
 * Need description
 * @param {string} pageid
 */
function removeDoubleLineRows(pageid) {
  delete doubleLineRows[pageid];
}

/**
 * Need description
 * @param {String} pageid
 * @param {Object} dataMap
 * @param {Object} doubleLineTypes
 * @param {Object} paneObjArr
 */
function createDoubleLines(pageid, dataMap, doubleLineTypes, paneObjArr) {
  const doubleLineRows = getDoubleLineRows(pageid);
  const oldRows = [];
  const getDoubleLines = function(plot, rowList) {
    if (!plot || Object.keys(plot).length === 0) {
      return {
        rowList,
        newRows: [],
      };
    }

    const newRows = [];
    const series = plot.getSeries();
    const seriesGantt = series.gantt;
    const tasks = dataMap || series.dataMap;
    let taskId;
    const dataRowIdMap = {};
    let row;
    let index;
    // eslint-disable-next-line guard-for-in
    for (row in rowList) {
      const itemList = rowList[row];
      for (index = 0; index < itemList.length; index++) {
        dataRowIdMap[itemList[index]] = row;
      }
    }
    // eslint-disable-next-line guard-for-in
    for (taskId in tasks) {
      const task = tasks[taskId];
      if (contains(doubleLineTypes, task.ganttItemType)) {
        let { rowId } = task;
        if (!rowId) {
          const { rowIdAttributeInTask } = seriesGantt;
          const rowIdProviderCallBackFunction =
            seriesGantt.rowIdProviderCallBack;
          // eslint-disable-next-line vars-on-top
          // eslint-disable-next-line no-var
          var { taskIdProviderCallBack } = seriesGantt;
          if (rowIdAttributeInTask != null) {
            rowId = task[rowIdAttributeInTask];
          } else if (
            rowIdProviderCallBackFunction != null &&
            isFunction(rowIdProviderCallBackFunction)
          ) {
            rowId = rowIdProviderCallBackFunction(task);
          }
        }
        if (typeof rowId === 'string' && rowId.endsWith('^')) {
          rowId = rowId.slice(0, -1);
        }
        if (!rowList[rowId]) {
          rowList[rowId] = [];
          newRows.push(rowId);
        }
        if (!task.chronosId) {
          task.chronosId = taskIdProviderCallBack(task);
        }
        if (rowList[rowId].indexOf(task.chronosId) === -1) {
          rowList[rowId].push(task.chronosId);
          task.rowId = `${rowId}^`;
          const oldRow = dataRowIdMap[task.chronosId];
          if (oldRow) {
            rowList[oldRow].splice(rowList[oldRow].indexOf(task.chronosId), 1);
            if (rowList[oldRow].length === 0) {
              oldRows.push(`${oldRow}^`);
            }
          }
        }
      }
    }
    return {
      rowList,
      newRows,
    };
  };
  const norRowList = getDoubleLines(paneObjArr[0], doubleLineRows.norRowList);
  const treeRowList = getDoubleLines(paneObjArr[1], doubleLineRows.treeRowList);
  return {
    norRowList: norRowList.rowList,
    treeRowList: treeRowList.rowList,
    norNewRows: norRowList.newRows,
    treeNewRows: treeRowList.newRows,
    oldRows,
  };
}

/**
 * To get the row id when double line mode is enabled.
 *
 * @param {Object} ganttModel
 * @param {Object} item
 * @param {number} rowId
 * @returns {number} currRowId
 */
function getRowIdForDoubleLine(ganttModel, item, rowId) {
  const doubleLineOptions = ganttModel.customOptions.doubleLine;
  let currRowId;
  if (
    doubleLineOptions &&
    doubleLineOptions.itemTypes.length > 0 &&
    contains(doubleLineOptions.itemTypes, item.ganttItemType)
  ) {
    currRowId = !item.rowId ? `${rowId}^` : item.rowId;
  }
  return currRowId || rowId;
}

function getOpenSimulations() {
  const localWorldMaster = ds.getData('app', 'localWorldMaster', null, {
    id: this.pageId,
  });
  return values(localWorldMaster);
}

/**
 * Need description
 * @param {String} moduleName
 */
function getRealWorldTabId(moduleName) {
  var ganttTabId;
  const realWorldContext = ds.getData('app', 'realWorldContext', null, {
    id: this.pageId,
  });
  var existingGanttTabIds = realWorldContext.ganttTabIds;
  const moduleConfig = ds.getData('app', 'moduleConfig', null, {
    id: this.pageId,
  });
  if (existingGanttTabIds) {
    if (moduleName) {
      // Find gantt id by comparing items in realWorldContext.ganttTabIds with moduleConfig[moduleName]
      for (var i = 0; i < existingGanttTabIds.length; i++) {
        if (moduleConfig[moduleName].indexOf(existingGanttTabIds[i]) !== -1) {
          ganttTabId = existingGanttTabIds[i];
          break;
        }
      }
    }
    // TODO remove this once developers have handled this method call correctly by passing module name
    else {
      ganttTabId = existingGanttTabIds.length > 0 && existingGanttTabIds[0];
    }
  }
  return ganttTabId;
}

/**
 * @description
 *
 * Used to call iFlightWorker to transform the API response data for headerless panes.
 * This function set ganttData in gantModel which inturn trigger updates then webcomponent call plot.updateGanttData
 *
 * This method can be used by Sierra instead of modifyForGantt since we don't need to look ganttHeader in API response.
 *
 * @param {Object} response
 * @param {Object} ganttModel
 * @param {Object} headerType
 * @param {Object} headerCallback - If this is not passed this function will create dummy objects.
 * @param {String} plotLabel
 * @param {String} pageId
 * @param {Boolean} skipTokenCheck
 */
function modifyForUnassignedGantt(
  response,
  ganttModel,
  headerType,
  headerCallback,
  plotLabel,
  pageId,
  skipTokenCheck
) {
  // function to convert server response to gantt-data
  var isLastestRes = true; // this.isLatestToken(plotLabel, pageId, parseInt(response.responseToken));
  if (ganttModel && (isLastestRes || skipTokenCheck)) {
    var ganttHeader = [],
      context = plotLabel + pageId,
      interationRestrictMap = ganttModel.customOptions.interationRestrictMap,
      triggerHeaderCallback =
        headerCallback && isFunction(headerCallback) ? true : false;
    $.each(ganttModel.rowIds, function(index, value) {
      var item;
      if (triggerHeaderCallback) {
        item = headerCallback(value, headerType);
      } else {
        item = {
          rowId: value,
          ganttItemType: headerType,
        };
      }
      if (item && Object.keys(item).length > 0) {
        ganttHeader.push(item);
      }
    });

    iFlightWorker.call(
      'modifyForUnassignedGantt',
      [response, interationRestrictMap, ganttHeader, plotLabel, pageId],
      function(masterGanttData) {
        var interationRestrictCallbackDefined =
          interationRestrictMap &&
          filter(interationRestrictMap, function(interationRestrict, key) {
            return (
              masterGanttData.ganttItemTypeList.indexOf(key) != -1 &&
              interationRestrict.callback &&
              isFunction(interationRestrict.callback)
            );
          }).length > 0;
        delete masterGanttData.ganttItemTypeList;
        if (interationRestrictCallbackDefined) {
          each(masterGanttData[response.ganttDataType].data, function(item) {
            var key = item.ganttItemType;
            if (
              interationRestrictCallbackDefined &&
              interationRestrictMap.hasOwnProperty(key)
            ) {
              var callback = interationRestrictMap[key].callback,
                actions = interationRestrictMap[key].actions;
              var callbackDefined = callback && isFunction(callback);
              if (callbackDefined) {
                if (
                  contains(actions, 'dragOrDrop') &&
                  callback(item, 'dragOrDrop') &&
                  !item.modifyPermission
                ) {
                  item.draggable = true;
                }
                if (
                  contains(actions, 'itemResize') &&
                  callback(item, 'itemResize') &&
                  !item.modifyPermission
                ) {
                  item.resizable = true;
                }
                if (contains(actions, 'overlap') && callback(item, 'overlap')) {
                  item.wrappable = true;
                }
              }
            }
          });
        }

        ganttModel.ganttData = JSON.parse(JSON.stringify(masterGanttData));
      },
      context
    );
  }
  return skipTokenCheck ? skipTokenCheck : isLastestRes;
}

/**
 * @description
 *
 * Function that will return chronos $plot pane object
 * who invocake? - web component which fn
 * The purpose of this function is to create chronos pane object by using the parameter values.
 * did any other fn we need to invoke before we call this fn?
 * It is required in iFlight and Sierra
 *
 * @param {Object} plotInitData
 *  fromDate(in milliSeconds) - this is the start date of the gantt period not the visible area start date.
 *  toDate(in milliSeconds) - this is the end date of the gantt period not the visible area end date.
 *  normalMaximumDaySpan - normal pairing duration, default value is 2.
 *  rowIds - Array of sequential numbers, entire rowIds of gantt with out pagination.
 * @param {Object} verticalScrollBarElement -  HTML element reference which is passed from iflight gantt web component, by using this will create scrollbar object and will attach to the pane.
 * @param {Object} horizontalScrollBar -  It is a chronos scrollbar reference object not the web component scrollbar object.
 * @param {Object} panePlaceHolderElement -  It is the pane placeholder dive element reference from web component.
 * @param {Object} customOptions -  set of options provided by webcomponent or developer, not the chronos options.
 * @param {Object} overridingOptions -  chronos options will given by developer which will merge with chronos options in the webcomponent.
 * @returns {Object} paneObject - By using all parameter values (placeholder, rowIds, dateRange etc) will create paneObject(chronos plot object).
 */
function initPane(
  plotInitData,
  verticalScrollBarElement,
  horizontalScrollBar,
  panePlaceHolderElement,
  customOptions,
  overridingOptions
) {
  this.pageId = customOptions.pageid;
  let treeContainer;
  let treeNode;
  let headersIds;
  let totalNoOfItems;
  let paneObject;
  const ganttDateRange = {
    startDate: plotInitData.fromDate,
    endDate: plotInitData.toDate,
  };
  // Create chart
  const paneOptions = this.setPaneConfigurations(
    customOptions,
    totalNoOfItems,
    ganttDateRange,
    overridingOptions,
    plotInitData.normalMaximumDaySpan
  );
  if (
    customOptions.treeHandler !== undefined ||
    customOptions.treeHandler != null
  ) {
    treeContainer = this.createGanttTree(plotInitData.rowIds);
    if (plotInitData.rowIds !== undefined && plotInitData.rowIds.length > 0) {
      treeNode = treeContainer.treeNode;
    }
    headersIds = treeContainer.arrLeafNodes;
    totalNoOfItems = headersIds.length - 1;
    if (customOptions.isTree) {
      paneObject = $.chronos(
        panePlaceHolderElement,
        {
          label: '',
          rootTreeNode: treeNode,
          columnDataRange: ganttDateRange,
          callBackFunction: customOptions.dataLoader, // call back function provided by user to fetch data
          taskRenderer: customOptions.itemRenderer,
          plotId: `${customOptions.plotLabel}_tree`,
          screenId: customOptions.screenId,
        },
        paneOptions.plotOptions
      );
    } else {
      paneObject = $.chronos(
        panePlaceHolderElement,
        {
          label: '',
          rowHeaderIds: headersIds,
          columnDataRange: ganttDateRange,
          callBackFunction: customOptions.dataLoader, // call back function provided by user to fetch data
          taskRenderer: customOptions.itemRenderer,
          plotId: customOptions.plotLabel,
          screenId: customOptions.screenId,
        },
        paneOptions.plotOptions
      );
    }
  } else {
    headersIds = plotInitData.rowIds;
    totalNoOfItems = headersIds.length - 1;
    paneObject = $.chronos(
      panePlaceHolderElement,
      {
        label: '',
        rowHeaderIds: headersIds,
        columnDataRange: ganttDateRange,
        callBackFunction: customOptions.dataLoader, // call back function provided by user to fetch data
        taskRenderer: customOptions.itemRenderer,
        plotId: customOptions.plotLabel,
        screenId: customOptions.screenId,
      },
      paneOptions.plotOptions
    );
  }

  if (horizontalScrollBar && Object.keys(horizontalScrollBar).length > 0) {
    horizontalScrollBar.SCROLL_RESTRICT = 0.3;
    paneObject.setHorizontalScrollBar(horizontalScrollBar);
  }
  if (paneObject.getOptions().restrictVerticalScrollbar != true) {
    const verticalScrollBar = $.scrollBar(
      verticalScrollBarElement,
      paneOptions.vScrollOptions
    );
    verticalScrollBar.SCROLL_RESTRICT = 0.3;
    paneObject.setVerticalScrollBar(verticalScrollBar);
  }
  const ganttPanes = ds.getData('app', 'ganttPanes', null, { id: this.pageId });
  const isVisible =
    ganttPanes[customOptions.moduleName][customOptions.plotLabel];
  const elementID = $($(`#${customOptions.pageid} .pane_h`)[0])
    .find('.layout_wrapper')
    .attr('id');

  if (
    isVisible &&
    elementID === customOptions.uniqueID &&
    paneObject.setXAxisOptions
  ) {
    paneObject.setXAxisOptions('showLabel', true);
  }

  if (paneObject.getPlotLabel() == 'ColumnHeader') {
    iflightGanttLayout.setTimebarHeight(
      customOptions.pageid,
      paneObject.getSeries().xaxis.labelHeight
    );
  }

  if (
    isVisible &&
    elementID === customOptions.uniqueID &&
    paneObject.setXAxisOptions
  ) {
    this.initLayout(customOptions.pageid, null, true);
  }
  paneObject.getGanttFromPlot = function() {
    let placeholderId = this.getPlaceholder().attr('id');
    let ganttComponentId = placeholderId.split('ui-gantt_holder')[0];
    return document.getElementById(ganttComponentId);
  };

  if (
    window.ganttLayoutComplete &&
    window.ganttLayoutComplete[customOptions.pageid] &&
    !customOptions.hidden
  ) {
    /**
     * Call the dataloader we defined in individual controller.
     * Once ajax call is completed they call modifyForGantt or modifyForUnassignedGantt method in service to render actuall pairings.
     */
    paneObject.callFetchDataIfRequired();
  }

  paneObject.EXTRA_FETCH_FACTOR = 0.3;
  paneObject.FETCH_RESTRICT = 0.3;

  verticalScrollBarElement = null;
  panePlaceHolderElement = null;
  return paneObject;
}

/**
 * Function to find available space before any given gantt item
 *
 * @param {Object} plot
 * @param {Object} task
 * @returns {Array} spaceAvailable
 */
function spaceBeforeItem(plot, task) {
  if (Object.keys(plot).length > 0) {
    const s = plot.getSeries();
    const tasksMap = s.dataMap;
    let time = plot.resetViewPortTime(task.start);
    const rowIndexMap = s.rowMap;
    const columnIndexMap = s.columnMap;
    const dataMapRowIndex = rowIndexMap[task.rowId];
    let dataMapColumnIndex = columnIndexMap[time];
    const longRangeTaskArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex);

    const oneDayInMilliSecs = 86400000; // 24*3600*1000
    let { normalMaximumDaySpan } = s.gantt;
    let spaceAvailable = 0;
    const availableSpaces = [];
    time -= (normalMaximumDaySpan - 1) * oneDayInMilliSecs;
    let taskArray = longRangeTaskArray;
    while (normalMaximumDaySpan >= 0) {
      if (taskArray != null) {
        for (let i = 0; i < taskArray.length; i++) {
          const taskObj = tasksMap[taskArray[i]];
          if (taskObj !== undefined && taskObj.end < task.start) {
            spaceAvailable = task.start - taskObj.end;
            availableSpaces.push(spaceAvailable);
          }
        }
      }
      dataMapColumnIndex = columnIndexMap[time];
      if (dataMapRowIndex !== undefined || dataMapRowIndex != null) {
        taskArray = plot.getNormalTaskIdArray(
          s,
          dataMapRowIndex,
          dataMapColumnIndex
        );
      }
      time += oneDayInMilliSecs;
      normalMaximumDaySpan--;
    }
    spaceAvailable = plot.getCanvasPixelForTimeWidth(
      // eslint-disable-next-line prefer-spread
      Math.min.apply(Math, availableSpaces)
    );
    return spaceAvailable;
  }
  return null;
}

/**
 * @description
 *
 * It will invoke the ganttLayout function which is inside the layout file,
 * this ganttLayout function is responsible for the working of multiple pane, minimize, maximize toolbar grid layout structure.
 * initPane will invoke this function
 * It is required in both Sierra and iFlight
 *
 * @param {string} pageid - will pass the pageid which will get from the customOptions in initPane function. eg- "W1"
 * @param {boolean} isReload - It is a boolean value
 * @param {boolean} isCustomClose - It is a boolean value that will decide whether the particular pane should dispaly or not based on reading the configurations
 */
function initLayout(pageid, isReload, isCustomClose) {
  // Handle reload scenario with isReload flag
  if (!ganttLayout[pageid]) {
    // eslint-disable-next-line new-cap
    ganttLayout[pageid] = new ganttLayoutConfig();
  }
  if (isReload) {
    ganttLayout[pageid].init = true;
  }
  if (ganttLayout[pageid].init) {
    ganttLayout[pageid].init = false;
    iflightGanttLayout.ganttLayout(pageid, null, isCustomClose);
    /* iflightGanttLayout.ganttLayout(pageid, function(pageid) {
             if (window.ganttLayoutComplete && window.ganttLayoutComplete[pageid]){
               $(window).trigger('resize');
             }
           }); */

    iflightGanttLayout.setDisplay(pageid); /* IFNBAIMPL-3100 */
    iflightGanttLayout.custDropDown(pageid); /* IFNBAIMPL-3100 */
  }
}

/**
 * To remove pane
 *
 * @param {string} pageid
 */
function clearLayout(pageid) {
  if (ganttLayout[pageid]) {
    ganttLayout[pageid] = null;
  }
  if (window.ganttLayoutComplete) {
    if (window.ganttLayoutComplete[pageid]) {
      delete window.ganttLayoutComplete[pageid];
    }
    if (Object.keys(window.ganttLayoutComplete).length <= 0) {
      window.ganttLayoutComplete = null;
    }
  }
}

/**
 * To send a unique token with all requests
 *
 * @param {string} pane
 * @param {string} pageid
 * @returns {Object} validTokenList
 */
function getFetchToken(pane, pageid) {
  if (!validTokenList[pageid]) {
    validTokenList[pageid] = [];
  }
  validTokenList[pageid][pane] = new Date().getTime();
  return validTokenList[pageid][pane];
}

/**
 * Need description
 *
 * @param {string} pane
 * @param {string} pageid
 * @param {string} token
 * @returns {string}
 */
function isLatestToken(pane, pageid, token) {
  return validTokenList[pageid][pane] === token;
}

/**
 * Need description
 *
 * @param {string} pageid
 */
function clearToken(pageid) {
  if (validTokenList[pageid]) {
    delete validTokenList[pageid];
  }
}

/**
 * Search and highlight any task
 *
 * @param {Object} plot - chronos plot object
 * @param {Object} filters
 * @param {Function} serverFindCallback
 * @param {*} ganttItemType
 * @param {boolen|null|undefined} restrictClientSearch
 * @returns {Object} plot gantt item
 */
function findItem(
  plot,
  filters,
  serverFindCallback,
  ganttItemType,
  restrictClientSearch
) {
  const ganttData = plot.getDataMap();
  let found = false;
  let data;
  let item;
  if (restrictClientSearch === undefined || restrictClientSearch == null) {
    restrictClientSearch = false;
  }
  if (!restrictClientSearch) {
    const minDateValue = plot.horizontalScrollBar.getViewValues().minViewValue;
    // eslint-disable-next-line guard-for-in
    for (const key in ganttData) {
      found = true;
      item = ganttData[key];
      if (
        ganttItemType === item.ganttItemType &&
        item[plot.getGanttStartDateAttribute(item)] > minDateValue
      ) {
        // eslint-disable-next-line guard-for-in
        for (const filterId in filters) {
          let { property } = filters[filterId];
          let { value } = filters[filterId];
          if (value != null && value !== undefined && value !== '') {
            let mapValue = item[property];
            if (filters[filterId].type === 'date') {
              value = new Date(value).getTime();
              value = plot.resetViewPortTime(value);
              mapValue = plot.resetViewPortTime(mapValue);
              if (value > mapValue) {
                found = false;
              }
            } else if (value !== mapValue) {
              found = false;
            }
            property = null;
            value = null;
            mapValue = null;
          }
        }
        if (found) {
          data = item;
        }
      }
    }
  }

  const moveToItem = function(task, ganttModel) {
    let rowId;
    let start;
    const series = plot.getSeries();
    const { rowIdAttributeInTask } = series.gantt;
    const rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack;
    if (rowIdAttributeInTask != null) {
      rowId = task[rowIdAttributeInTask];
    } else if (
      rowIdProviderCallBackFunction != null &&
      isFunction(rowIdProviderCallBackFunction)
    ) {
      rowId = rowIdProviderCallBackFunction(task);
    }
    if (contains(series.rowHeaderIds, `${rowId}`)) {
      start = plot.getGanttStartDateAttribute(task);
      const item = {
        rowId,
        chronosId: ganttModel
          ? ganttModel.customOptions.ganttOptions.taskIdProviderCallBack(task)
          : task.chronosId,
      };
      if (jQuery.type(task[start]) === 'date') {
        plot.scrollToTimeAndItemRowOnTop(task[start].getTime(), item);
      } else {
        plot.scrollToTimeAndItemRowOnTop(task[start], item);
      }
      if (plot.getTaskById(task.id + task.ganttItemType)) {
        plot.highlightAnEntity(task.id + task.ganttItemType);
        plot.highlightARow(task.rowId);
      } else {
        ganttModel.setHighlightEntity(task.id + task.ganttItemType);
        ganttModel.setHighlightHeader(task.rowId);
      }
    }
  };
  if (data == null || data === undefined) {
    if (isFunction(serverFindCallback)) {
      serverFindCallback(moveToItem);
    }
  } else {
    moveToItem(data);
  }
  return data;
}

/**
 * Need description
 *
 * @param {Object} plot - chronos plot object
 * @param {Object} filters
 * @param {Function} serverFindCallback
 * @param {boolean|null|undefined} restrictClientSearch
 */
function findHeader(plot, filters, serverFindCallback, restrictClientSearch) {
  const itemsMap = plot.getRowHeaderArray();
  let found = false;
  let data;

  if (restrictClientSearch === undefined || restrictClientSearch == null) {
    restrictClientSearch = false;
  }

  if (!restrictClientSearch) {
    each(itemsMap, function(item) {
      found = true;
      // eslint-disable-next-line guard-for-in
      for (const filterId in filters) {
        let { property } = filters[filterId];
        let { value } = filters[filterId];
        if (value != null && value !== undefined && value !== '') {
          let mapValue = item[property];
          if (filters[filterId].type === 'date') {
            value = new Date(value).getTime();
            value = plot.resetViewPortTime(value);
            mapValue = plot.resetViewPortTime(mapValue);
          }
          if (value !== mapValue) {
            found = false;
          }
          property = null;
          value = null;
          mapValue = null;
        }
      }
      if (found) {
        data = item;
      }
    });
  }

  const moveToHeader = function(task, ganttModel) {
    let rowId;
    let start;
    const series = plot.getSeries();
    const { rowIdAttribute } = series.gantt;
    if (rowIdAttribute != null) {
      rowId = task[rowIdAttribute];
    }
    if (contains(series.rowHeaderIds, `${rowId}`)) {
      start = plot.horizontalScrollBar.getViewValues().minViewValue;
      plot.clearAllRowhighlights();
      let headerObj = plot.getRowHeaderObject(rowId);
      if (headerObj == null) {
        // eslint-disable-next-line guard-for-in
        for (const index in series.rowHeaderObjects) {
          const eachHeaderObject = series.rowHeaderObjects[index];
          if (eachHeaderObject.rowId === rowId) {
            headerObj = eachHeaderObject;
            break;
          }
        }
      }
      const parentNode = headerObj ? headerObj.parentNode : null;
      if (
        (parentNode && !parentNode.isExpanded) ||
        plot.scrollToPosition(start, rowId) === -1
      ) {
        const parentId = parentNode.rowId;
        if (!series.rowMap[parentId]) {
          plot.scrollToPosition(start, parentId);
        }
        plot.expandNodeWithRowId(parentNode.rowId);
      }
      ganttModel.setHighlightHeader(rowId);
      setTimeout(function() {
        start = plot.horizontalScrollBar.getViewValues().minViewValue;
        plot.scrollToPosition(start, rowId);
      }, 750);
      if (plot.getRowHeaderObject(rowId)) {
        plot.highlightARow(rowId);
      } else {
        ganttModel.setHighlightHeader(rowId);
      }
    }
  };

  if (data == null || data === undefined) {
    if (isFunction(serverFindCallback)) {
      serverFindCallback(moveToHeader);
    }
  } else {
    moveToHeader(data);
  }

  return data;
}

/**
 * To determine how much mouse scroll we needed
 *
 * @param {Object} plot - chronos plot object
 * @param {string} zoomLevel
 */
function setTimeScrollUnit(plot, zoomLevel) {
  let scrollUnit = 0;
  const hourInMillis = 60 * 60 * 1000;
  switch (zoomLevel) {
    case 'hours':
      scrollUnit = hourInMillis;
      break;
    case 'days':
      scrollUnit = 24 * hourInMillis;
      break;
    case 'weeks':
      scrollUnit = 7 * 24 * hourInMillis;
      break;
    case 'months':
      scrollUnit = 30 * 24 * hourInMillis;
      break;
    default:
  }
  plot.horizontalScrollBar.setScrollUnit(scrollUnit);
}

/**
 * Function to get tooltip state
 *
 * @returns {Object} prevTip
 */
function getPrevTip() {
  return prevTip;
}

/**
 * Function to keep tooltip state
 *
 * @param {Object} currTip
 */
function setPrevTip(currTip) {
  prevTip = currTip;
}

/**
 * @description
 *
 * this function will highlight the gantt area for selected date range with particular color
 * pane controller  will invoke this (in iflight it is gantt toolbar controller)
 * It will redraw the gantt based on the markings option
 *
 * @param {​​​​​​​​object} ​​​​​​​​allPlot - It is the plot object of particular pane which is created in initPane
 * @param {​​​​​​​​object} ​​​​​​​​ganttMarkings - It is object that contains the date range for selected period and color to be applied
 */
function highlight(allPlot, ganttMarkings) {
  each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      if (Object.keys(plot).length > 0) {
        plot.clearColumnHeaderSelection();
        plot.drawHighLightOverlay();
        const options = plot.getOptions();
        const performHightlight = function(axes) {
          const markings = [];
          each(ganttMarkings, function(ganttMarking, key) {
            const fromDate = ganttMarking.fromDate;
            const toDate = ganttMarking.toDate;
            markings.push({
              xaxis: {
                from: fromDate,
                to: toDate,
              },
              color: ganttMarking.color,
            });
          });
          return markings;
        };
        options.grid.markings.markingsArray = performHightlight;
        options.grid.markings.drawOnTop = true;
        plot.draw();
      }
    }
  });
}

/**
 * This function gets a list of items if a start or an end of a task is present in that time range
 *
 * @param dataMapRowIndex - the actual yValue of the row
 * @param startTime - the actual time in milliseconds where the day starts
 * @param endTime - the actual time in milliseconds where the day ends
 * @param gantItemTypes - the gantt item types to consider
 * @returns {Array} itemList
 */
function getAllItemsInRange(
  plot,
  dataMapRowIndex,
  startTime,
  endTime,
  gantItemTypes,
  overlap
) {
  const currentSeries = plot.getSeries();
  const oneDayMillis = 24 * 60 * 60 * 1000;
  let dataMapColumnIndex;
  const itemList = [];
  let taskObjectIdArray;
  let taskObjectId; // , displayedRowIds;
  const rowYvalueMap = currentSeries;
  const rowIndexMap = currentSeries.rowMap;
  const columnIndexMap = currentSeries.columnMap;
  const dataMap = currentSeries;
  let resetStartTime = plot.resetViewPortTime(startTime);
  const resetEndTime = plot.resetViewPortTime(endTime);

  const normalSpanMillis =
    (currentSeries.gantt.normalMaximumDaySpan + 1) * oneDayMillis; // to check the ending tasks also in the open view range
  resetStartTime -= normalSpanMillis; // fetching normalDaySpan buckets ahead

  for (
    let dayMilliSeconds = resetStartTime;
    dayMilliSeconds <= resetEndTime;

  ) {
    dataMapColumnIndex = columnIndexMap[dayMilliSeconds];
    if (dataMapColumnIndex) {
      taskObjectIdArray = plot.getNormalTaskIdArray(
        currentSeries,
        dataMapRowIndex,
        dataMapColumnIndex
      );
      if (taskObjectIdArray) {
        for (let taskID = 0; taskID < taskObjectIdArray.length; taskID++) {
          taskObjectId = taskObjectIdArray[taskID];
          const eachTask = dataMap[taskObjectId];
          if (
            eachTask &&
            gantItemTypes.indexOf(eachTask.ganttItemType) > -1 &&
            ((eachTask.start >= startTime && eachTask.start < endTime) ||
              (eachTask.end <= endTime && eachTask.end > startTime))
          ) {
            itemList.push(eachTask);
          }
          if (
            overlap &&
            eachTask.start <= startTime &&
            eachTask.end >= endTime
          ) {
            itemList.push(eachTask);
          }
        }
      }
    }
    dayMilliSeconds += oneDayMillis;
  } // for
  // longRangeData drawing for this particular yLabels is handled here
  if (currentSeries.longRangeDataMap !== undefined) {
    taskObjectIdArray = plot.getLongRangeTaskIdArray(
      currentSeries,
      dataMapRowIndex
    );
    // console.log("LONG Task object Id array ", taskObjectIdArray);
    if (taskObjectIdArray !== undefined) {
      for (let taskID = 0; taskID < taskObjectIdArray.length; taskID++) {
        taskObjectId = taskObjectIdArray[taskID];
        // console.log("LONG ID retrieved ... " + taskObjectId);
        const eachTask = dataMap[taskObjectId];
        if (
          gantItemTypes.indexOf(eachTask.ganttItemType) > -1 &&
          ((eachTask.start >= startTime && eachTask.start < endTime) ||
            (eachTask.end <= endTime && eachTask.end > startTime))
        ) {
          itemList.push(eachTask);
        }
        if (overlap && eachTask.start <= startTime && eachTask.end >= endTime) {
          itemList.push(eachTask);
        } // else
      } // for
    }
  }
  return itemList;
}

/**
 * @description
 *
 * Used to draw tree inside pairing gantt ie to group rows. You can see the demo by visiting activity pane and click on tree view icon.
 *
 * This function is called by initPane in service.
 *
 * Since Sierra Gantt doen't group rows we don't need to call this function.
 * Ie when we call initPane they can set customOptions.treeHandler = null so that we don't invocate this function.
 *
 * @param {Array} rowIds - [[group, value]] Eg [["ADM", "ADM-612"], ["ADM", "ADM-613"], ["CDM", "CDM-612"]]
 * @returns {Object} that contain  array child nodes - in the format required by chronos
 */
function createGanttTree(rowIds) {
  function childNodeConfig() {
    this.childNodes = [];
    this.data = null;
    this.rowId = null;
  }
  const arrLeafNodes = [];
  const arrChildNodes = [];
  let childPos;
  let leafPos;

  const treeExpandList = [];

  const duplicateLeafNodes = [];

  const hasChildNode = function(childNodeVal) {
    childPos = -1;
    for (let j = 0; j < arrChildNodes.length; j++) {
      if (arrChildNodes[j] === childNodeVal) {
        childPos = j;
        break;
      }
    }
    return childPos;
  };

  const hasLeafNode = function(leafNodeVal) {
    leafPos = -1;
    for (let j = 0; j < arrLeafNodes.length; j++) {
      if (arrLeafNodes[j] === leafNodeVal) {
        leafPos = j;
        break;
      }
    }
    return leafPos;
  };

  // eslint-disable-next-line new-cap
  const treeNodeValue = new childNodeConfig();
  for (let i = 0; i < rowIds.length; i++) {
    // eslint-disable-next-line new-cap
    const leafNodeData = new childNodeConfig();
    const childPosition = hasChildNode(rowIds[i][0]);
    const leafPosition = hasLeafNode(rowIds[i][1]);
    if (childPosition > -1) {
      if (leafPosition === -1) {
        leafNodeData.childNodes = null;
        leafNodeData.rowId = `${rowIds[i][1]}`;
        treeNodeValue.childNodes[childPosition].childNodes.push(leafNodeData);
        arrLeafNodes.push(rowIds[i][1]);
      } else {
        duplicateLeafNodes.push(rowIds[i][1]);
      }
    } else if (leafPosition === -1) {
      leafNodeData.childNodes = null;
      leafNodeData.rowId = `${rowIds[i][1]}`;
      // eslint-disable-next-line new-cap
      const childNodeData = new childNodeConfig();
      childNodeData.childNodes.push(leafNodeData);
      arrLeafNodes.push(rowIds[i][1]);
      childNodeData.rowId = `${rowIds[i][0]}Sub`;
      childNodeData.data = {
        name: rowIds[i][0],
      };
      treeNodeValue.childNodes.push(childNodeData);
      arrChildNodes.push(rowIds[i][0]);
    } else {
      duplicateLeafNodes.push(rowIds[i][1]);
    }
  }

  return {
    treeNode: JSON.parse(JSON.stringify(treeNodeValue)),
    arrLeafNodes,
  };
}

/**
 * Used in RTU
 *
 * @param {Array} data
 * @param {string} ganttItemType
 * @param {Object} ganttDataResponse
 * @param {Object} plot - chronos plot object
 * @returns {Array}
 */
function prepareLatestData(data, ganttItemType, ganttDataResponse, plot) {
  const newArray = [];
  const taskIdProviderCallBackFunction = plot.getSeries().gantt
    .taskIdProviderCallBack;
  let id;

  each(data, function(item, key) {
    if (item !== undefined) {
      item.ganttItemType = ganttItemType;
      if (
        taskIdProviderCallBackFunction != null &&
        isFunction(taskIdProviderCallBackFunction)
      ) {
        id = taskIdProviderCallBackFunction(item);
      } else if (item.id != null) {
        id = item.id;
      }
      item.chronosId = id;
      const interationRestrictMap = ganttDataResponse.customOptions;
      // eslint-disable-next-line no-prototype-builtins
      if (interationRestrictMap.hasOwnProperty(ganttItemType)) {
        const callback = interationRestrictMap[ganttItemType];
        const actions = interationRestrictMap[ganttItemType];
        if (contains(actions, 'dragOrDrop')) {
          item.draggable = false;
          if (isFunction(callback) && callback(item, 'dragOrDrop')) {
            item.draggable = true;
          }
        }
        if (contains(actions, 'itemResize')) {
          item.resizable = false;
          if (isFunction(callback) && callback(item, 'itemResize')) {
            item.resizable = true;
          }
        }
        if (contains(actions, 'overlap')) {
          item.wrappable = false;
          if (isFunction(callback) && callback(item, 'overlap')) {
            item.wrappable = true;
          }
        }
      }
    }
    if (item.modifyPermission === false) {
      item.draggable = false;
      item.resizable = false;
    }
    newArray.push(item);
  });
  return newArray;
}

/**
 * Function to toggle between pan and rectangle selection - called when clicked on Pan/Rectangle Select button
 *
 * @param {Array} allPlot
 * @param {*} panMode
 */
function togglePanMode(allPlot, panMode) {
  each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      if (Object.keys(plot).length > 0) {
        const rectangleMode = !panMode;
        plot.enableRectangleSelectMode(rectangleMode);
        plot.enablePanMode(panMode);
      }
    }
  });
}

/**
 * Function to draw current time line
 *
 * @param {Object} plot - chronos plot object
 * @param {Function} callback
 * @param {Function} varianceCallback
 */
function drawCurrentTimeline(plot, callback, varianceCallback) {
  if (plot && Object.keys(plot).length > 0) {
    let currentDate = getDate();
    currentDate = currentDate.getTime();
    if (isFunction(varianceCallback)) {
      const timeModeVariance = varianceCallback(plot);
      if (timeModeVariance && timeModeVariance !== 0) {
        currentDate += timeModeVariance;
      }
    }
    plot.setTimeMarker(currentDate);
    plot.drawHighLightOverlay();

    if (isFunction(callback)) {
      callback();
    }
  }
}

/**
 * Function to draw circle inside canvas
 *
 * @param {string} fillColor
 * @param {string} borderColor
 * @param {Object} context - chronos canvas context
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @param {number} zoomOffset
 */
function drawCircle(
  fillColor,
  borderColor,
  context,
  centerX,
  centerY,
  radius,
  zoomOffset
) {
  if (radius * zoomOffset > 0) {
    context.beginPath();
    context.arc(centerX, centerY, radius * zoomOffset, 0, 2 * Math.PI);
    if (fillColor != null) {
      context.fillStyle = fillColor;
      context.fill();
    }
    if (borderColor != null) {
      context.strokeStyle = borderColor;
      context.stroke();
    }
  }
}

/**
 * @description
 *
 * Function that vertical line indicator for each item if required(it will draw outside of task bar).
 * drawTimeBasedIndicators will invoke this.
 * It is required in both iFlight and Sierra
 *
 * @param {​​​​​​​​string}​​​​​​​​ lineColor - color of the line getting from configurations
 * @param {​​​​​​​​Object} ​​​​​​​​context - The object from contextHolder given by chronos
 * @param {​​​​​​​​number}​​​​​​​​ startX - start position
 * @param {​​​​​​​​number} ​​​​​​​​startY - top position
 * @param {​​​​​​​​number} ​​​​​​​​length - context height
 */
function drawVerticalLine(lineColor, context, startX, startY, length) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(startX, startY + length);
  context.strokeStyle = lineColor;
  context.stroke();
}

/**
 * @description
 *
 * Function that triangle indicator for item if required(it will draw outside of task bar).
 * drawTimeBasedIndicators will invoke this.
 * It is required in both iFlight and Sierra
 *
 * @param {string} fillColor - color of the line getting from configurations
 * @param {string} borderColor - bordercolor
 * @param {Object} context - The object from contextHolder given by chronos
 * @param {number} startX - start position of first line of triangle
 * @param {number} startY - end position of first line of triangle
 * @param {number} toX - start position of second line of triangle
 * @param {number} toY - end position of second line of triangle
 * @param {number} endX - start position of third line of triangle
 * @param {number} endY - end position of third line of triangle
 * @param {number} zoomOffset - default zoomOffset
 * @param {boolean} isTimeBased - Need description
 */
function drawTriangle(
  fillColor,
  borderColor,
  context,
  startX,
  startY,
  toX,
  toY,
  endX,
  endY,
  zoomOffset,
  isTimeBased
) {
  if (zoomOffset) {
    startY *= zoomOffset;
    endY *= zoomOffset;
    if (!isTimeBased) {
      toY *= zoomOffset;
    }
  }
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(toX, toY);
  context.lineTo(endX, endY);
  context.closePath();
  if (fillColor != null) {
    context.fillStyle = fillColor;
    context.fill();
  }
  if (borderColor != null) {
    context.strokeStyle = borderColor;
    context.stroke();
  }
}

/**
 * @description
 *
 * Function that rectangle indicator for item if required(it will draw outside of task bar).
 * drawTimeBasedIndicators will invoke this.
 * It is required in both iFlight and Sierra
 *
 * @param {​​​​​​​​string} ​​​​​​​​fillColor - color of the line getting from configurations
 * @param {​​​​​​​​string} ​​​​​​​​borderColor - border color getting from configurations
 * @param {​​​​​​​​Object} ​​​​​​​​context - The object from contextHolder given by chronos
 * @param {​​​​​​​​number}​​​​​​​​ startX - start position
 * @param {​​​​​​​​number} ​​​​​​​​startY - end position
 * @param {​​​​​​​​number} ​​​​​​​​width - width of rectangle
 * @param {​​​​​​​​number} ​​​​​​​​height - height of rectangle
 * @param {​​​​​​​​number}​​​​​​​​ zoomOffset - default zoomOffset
 */
function drawRectangle(
  fillColor,
  borderColor,
  context,
  startX,
  startY,
  width,
  height,
  zoomOffset
) {
  context.beginPath();
  context.rect(startX, startY, width * zoomOffset, height * zoomOffset);
  if (fillColor != null) {
    context.fillStyle = fillColor;
    context.fill();
  }
  if (borderColor != null) {
    context.strokeStyle = borderColor;
    context.stroke();
  }
}

/**
 * Function to draw diamond inside canvas
 *
 * @param {string} fillColor
 * @param {string} borderColor
 * @param {Object} context - chronos canvas context
 * @param {number} startX
 * @param {number} startY
 * @param {number} width
 * @param {number} height
 */
function drawDiamond(
  fillColor,
  borderColor,
  context,
  startX,
  startY,
  width,
  height
) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(startX + width / 2, startY + height / 2);
  context.lineTo(startX, startY + height);
  context.lineTo(startX - width / 2, startY + height / 2);
  context.closePath();
  if (fillColor != null) {
    context.fillStyle = fillColor;
    context.fill();
  }
  if (borderColor != null) {
    context.strokeStyle = borderColor;
    context.stroke();
  }
}

/**
 * Need description
 *
 * @param {Object} plot - chronos plot object
 * @param {Object} task
 * @returns {boolean}
 */
function isExpandable(plot, task) {
  const series = plot.getSeries();
  const rowId = task[series.gantt.rowIdAttribute];
  const isExpandable = false;
  return plot.hasWrappedRows(rowId);
}

/**
 *
 * @param {Object} data
 * @param {String} key
 * @param {String} moduleName
 */
function prepareTooltipData(data, key, moduleName) {
  var ganttCommonService = this;
  const ganttPopupConfiguration = ds.getData(
    'app',
    'ganttPopupConfiguration',
    null,
    { id: this.pageId }
  );
  var popupConfig = ganttPopupConfiguration[moduleName][key];
  return ganttCommonService.getLocalizedToolTip(
    this.safeConfigEval(popupConfig, data)
  );
}

/**
 *
 * @param {String} toolTipMessage
 */
function getLocalizedToolTip(toolTipMessage) {
  if (toolTipMessage != undefined) {
    var extractedString = toolTipMessage.split('~');
    for (var i = 1; i < extractedString.length; i += 2) {
      var localizedString = localization.getMessage(extractedString[i]);
      toolTipMessage = toolTipMessage.replace(
        '~' + extractedString[i] + '~',
        localizedString
      );
    }
    return toolTipMessage;
  }
}

/**
 * Need description
 *
 * @param {Object} item
 * @param {Object} position
 * @param {Object} data
 * @param {Object} iconImage
 * @returns {Object} configObj
 */
function getConfigObject(item, position, data, iconImage) {
  const configObj = {
    text: safeConfigEval(item.text, data),
    position,
    fontStyle: item.fontStyle,
    color: `#${item.color}`,
    hemColor: `#${item.hemColor}`,
    icon: item.icon,
    iconDimensions: {
      width: item.iconWidth,
      height: item.iconHeight,
      vOffset: item.iconvOffset || 0,
      hOffset: item.iconhOffset || 0,
    },
    override: item.override,
    spotId: item.spotId,
  };
  // eslint-disable-next-line no-prototype-builtins
  if (item.icon && iconImage && iconImage.hasOwnProperty(item.icon)) {
    const dim = iconImage[item.icon].split(',');
    // eslint-disable-next-line prefer-destructuring
    configObj.iconDimensions.x = dim[0];
    // eslint-disable-next-line prefer-destructuring
    configObj.iconDimensions.y = dim[1];
    // eslint-disable-next-line prefer-destructuring
    configObj.iconDimensions.sw = dim[2];
    // eslint-disable-next-line prefer-destructuring
    configObj.iconDimensions.sh = dim[3];
  }
  return configObj;
}

/**
 * @description
 *
 * Called by getConfiguration.
 *
 * @param {string} moduleName
 * @returns {Object}
 */
function getGanttConfiguration(moduleName, pageid) {
  const page = pageid ? pageid : this.pageId;
  const ganttConfiguration = ds.getData('app', 'ganttConfiguration', null, {
    id: page,
  });
  return ganttConfiguration[moduleName];
}

/**
 * @description
 * Function to returns bar configuration object.
 *
 * Called by developer before we render each bar.
 * In configuration we defined itemRenderer which is wrapper of taskRenderer in chronos option which refer which function is called by chronos when it render bar.
 * labelRenderer is also called to render ganttHeader.
 *
 * In case of Neo, the developer call loadGantt in iFlight-app which internally call loadGanttConfiguration.
 * loadGanttConfiguration call API to fetch configurations and append it to ganttConfiguration.
 *
 * @param {Object} data - Each bar data
 * @param {string} moduleName
 * @returns {object} configObject
 */
function getConfiguration(data, moduleName) {
  const configObject = {
    bar: {},
    label: {},
    outLeftLabel: {},
    outRightLabel: {},
    timeBased: {},
  };
  const ganttCommonService = this;
  const ganttConfiguration = ds.getData('app', 'ganttConfiguration', null, {
    id: this.pageId,
  })[moduleName];
  // eslint-disable-next-line no-prototype-builtins
  if (ganttConfiguration.hasOwnProperty(data.ganttItemType)) {
    const configForItem = ganttConfiguration[data.ganttItemType];
    const { priority } = configForItem;
    for (const configurationType in configForItem) {
      if (
        configurationType !== 'priority' &&
        // eslint-disable-next-line no-prototype-builtins
        configForItem.hasOwnProperty(configurationType)
      ) {
        const configurationItems = configForItem[configurationType];
        let key;
        let len;
        switch (configurationType) {
          case 'borderColor':
            {
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (
                  configObject.bar.borderColor != null ||
                  configObject.bar.borderColor !== undefined
                ) {
                  break;
                } else if (
                  (configurationItem.condition === 'DEFAULT' ||
                    safeConfigEval(configurationItem.condition, data)) &&
                  configurationItem.item.color
                ) {
                  configObject.bar.borderColor = `#${configurationItem.item.color}`;
                }
              }
            }
            break;

          case 'borderColor2':
            {
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (
                  configObject.bar.borderColor2 !== null ||
                  configObject.bar.borderColor2 !== undefined
                ) {
                  break;
                } else if (
                  (configurationItem.condition === 'DEFAULT' ||
                    ganttCommonService.safeConfigEval(
                      configurationItem.condition,
                      data
                    )) &&
                  configurationItem.item.color
                ) {
                  configObject.bar.borderColor2 = `#${configurationItem.item.color}`;
                }
              }
            }
            break;

          case 'fillColor':
            {
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (
                  configObject.bar.fillColor != null ||
                  configObject.bar.fillColor !== undefined
                ) {
                  break;
                } else if (
                  (configurationItem.condition === 'DEFAULT' ||
                    safeConfigEval(configurationItem.condition, data)) &&
                  configurationItem.item.color
                ) {
                  configObject.bar.fillColor = configurationItem.item.color;
                }
              }
            }
            break;

          case 'borderWidth':
            {
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (
                  configObject.bar.borderWidth != null ||
                  configObject.bar.borderWidth !== undefined
                ) {
                  break;
                } else if (
                  (configurationItem.condition === 'DEFAULT' ||
                    safeConfigEval(configurationItem.condition, data)) &&
                  configurationItem.item.width
                ) {
                  configObject.bar.borderWidth = configurationItem.item.width;
                }
              }
            }
            break;

          case 'BOTTOM_LEFT':
            {
              const pos = priority.indexOf('BOTTOM_LEFT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'BOTTOM_LEFT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'BOTTOM_RIGHT':
            {
              const pos = priority.indexOf('BOTTOM_RIGHT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'BOTTOM_RIGHT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'BOTTOM_CENTER':
            {
              const pos = priority.indexOf('BOTTOM_CENTER');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'BOTTOM_CENTER',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'TOP_LEFT':
            {
              const pos = priority.indexOf('TOP_LEFT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'TOP_LEFT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'TOP_RIGHT':
            {
              const pos = priority.indexOf('TOP_RIGHT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'TOP_RIGHT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'TOP_CENTER':
            {
              const pos = priority.indexOf('TOP_CENTER');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'TOP_CENTER',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'CENTER_LEFT':
            {
              const pos = priority.indexOf('CENTER_LEFT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'CENTER_LEFT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'CENTER_RIGHT':
            {
              const pos = priority.indexOf('CENTER_RIGHT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'CENTER_RIGHT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'CENTER':
            {
              const pos = priority.indexOf('CENTER');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.label[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'CENTER',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.label[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'OUT_TOP_LEFT':
            {
              const pos = priority.indexOf('OUT_TOP_LEFT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.outLeftLabel[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'OUT_TOP_LEFT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.outLeftLabel[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'OUT_CENTER_LEFT':
            {
              const pos = priority.indexOf('OUT_CENTER_LEFT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.outLeftLabel[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'OUT_CENTER_LEFT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.outLeftLabel[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'OUT_BOTTOM_LEFT':
            {
              const pos = priority.indexOf('OUT_BOTTOM_LEFT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.outLeftLabel[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'OUT_BOTTOM_LEFT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.outLeftLabel[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'OUT_TOP_RIGHT':
            {
              const pos = priority.indexOf('OUT_TOP_RIGHT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.outRightLabel[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'OUT_TOP_RIGHT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.outRightLabel[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'OUT_CENTER_RIGHT':
            {
              const pos = priority.indexOf('OUT_CENTER_RIGHT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.outRightLabel[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'OUT_CENTER_RIGHT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.outRightLabel[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'OUT_BOTTOM_RIGHT':
            {
              const pos = priority.indexOf('OUT_BOTTOM_RIGHT');
              for (key = 0, len = configurationItems.length; key < len; key++) {
                const configurationItem = configurationItems[key];
                if (configObject.outRightLabel[pos]) {
                  break;
                } else if (
                  configurationItem.condition === 'DEFAULT' ||
                  safeConfigEval(configurationItem.condition, data)
                ) {
                  const currConfig = ganttCommonService.getConfigObject(
                    configurationItem.item,
                    'OUT_BOTTOM_RIGHT',
                    data,
                    ganttConfiguration.iconImage
                  );
                  if (
                    (currConfig.text && currConfig.text !== '') ||
                    (currConfig.icon && currConfig.icon !== '')
                  ) {
                    configObject.outRightLabel[pos] = currConfig;
                  }
                }
              }
            }
            break;

          case 'INSTANT':
            {
              for (let key in configurationItems) {
                // eslint-disable-next-line no-prototype-builtins
                if (configurationItems.hasOwnProperty(key)) {
                  const configurationItem = configurationItems[key];
                  for (
                    let itemKey = 0, len = configurationItem.length;
                    itemKey < len;
                    itemKey++
                  ) {
                    const timeConfig = configurationItem[itemKey];
                    if (configObject.timeBased[key] !== undefined) {
                      break;
                    } else if (
                      (timeConfig.condition === 'DEFAULT' ||
                        safeConfigEval(timeConfig.condition, data)) &&
                      ((timeConfig.item.text && timeConfig.item.text !== '') ||
                        (timeConfig.item.icon && timeConfig.item.icon !== ''))
                    ) {
                      configObject.timeBased[key] = {};
                      configObject.timeBased[key].color = timeConfig.item.color;
                      configObject.timeBased[key].property =
                        timeConfig.item.text;
                      configObject.timeBased[key].icon = timeConfig.item.icon;
                      configObject.timeBased[key].iconHeight =
                        timeConfig.item.iconHeight;
                      configObject.timeBased[key].iconWidth =
                        timeConfig.item.iconWidth;
                    }
                  }
                }
              }
            }
            break;

          case 'STATIC':
            {
              for (const key in configurationItems) {
                // eslint-disable-next-line no-prototype-builtins
                if (configurationItems.hasOwnProperty(key)) {
                  const configurationItem = configurationItems[key];
                  if (
                    safeConfigEval(configurationItem[1], data) &&
                    configurationItem[0]
                  ) {
                    configObject[key] = {};
                    // eslint-disable-next-line prefer-destructuring
                    configObject[key].color = configurationItem[0];
                  }
                }
              }
            }
            break;

          case 'barExtendLabel':
            {
              configObject.enableExtendLabel = configurationItems === 'true';
            }
            break;
        }
      }
    }
  }
  return configObject;
}

/**
 * Need description
 *
 * @param {Object} icon
 * @returns {Oject} iconDimensions object
 */
function getIconDimensions(configuration) {
  const iconDefaultVal = 15;
  const iconDimensions = {};
  const dim = configuration.iconDimensions;
  if (dim.height && dim.width) {
    iconDimensions.width = dim.width;
    iconDimensions.height = dim.height;
  } else {
    iconDimensions.width = iconDefaultVal;
    iconDimensions.height = iconDefaultVal;
  }
  iconDimensions.x = parseInt(dim.x, 10);
  iconDimensions.y = parseInt(dim.y, 10);
  iconDimensions.sw = parseInt(dim.sw, 10);
  iconDimensions.sh = parseInt(dim.sh, 10);
  return iconDimensions;
}

/**
 * Need description
 *
 * @param {Object, Integer, Date, String, Object}
 * @returns {boolean}
 */
function isLatestGanttObj(plot, id, timeStamp, pos, ganttItemType) {
  let currDTO;
  let isLatest = false;
  if (pos === 'pane') {
    currDTO = plot.getTaskById(id + ganttItemType);
  } else if (pos === 'header') {
    currDTO = plot.getRowHeaderObject(id);
  }
  if (currDTO && currDTO.timeStamp >= timeStamp) {
    isLatest = true;
  }
  return isLatest;
}

/**
 * @description
 *
 * To calculate zoomOffset in zoom object.
 *
 * Called from overAllZoom
 *
 * @param {Object} zoomObject
 * @param {string} pageId - Eg W1
 * @param {string} plotLabel - Eg AircarftPane
 * @param {Object} zoomParameters
 * @returns {number} zoomOffset
 */
function calcZoomOffset(zoomObject, pageId, plotLabel, zoomParameters) {
  if (zoomParameters.rowZoomParameter === 1) {
    return 1;
  }

  const baseZoomConfig = this.getZoomConfig(pageId, plotLabel);

  if (baseZoomConfig === null || baseZoomConfig === undefined) {
    return;
  }
  if (!zoomObject.zoomRowCount) {
    zoomObject.zoomRowCount = baseZoomConfig.zoomRowCount;
  }
  /**
   * zoomCount = log(baseZoomRowCount / currentZoomRowCount) / log(rowZoomParameter)
   * ZoomOffset = rowZoomParameter^(zoomCount + <already applied zoomCount>);
   */
  // eslint-disable-next-line no-restricted-properties
  const zoomOffset = Math.pow(
    zoomParameters.rowZoomParameter,
    getLog(baseZoomConfig.zoomRowCount / zoomObject.zoomRowCount) /
      getLog(zoomParameters.rowZoomParameter) +
      calculateCurrentZoomCount(zoomObject, zoomParameters)
  );
  // eslint-disable-next-line no-nested-ternary
  return !isNaN(zoomOffset)
    ? zoomOffset
    : baseZoomConfig.zoomOffset
    ? baseZoomConfig.zoomOffset
    : 1;
}

/**
 * @description
 *
 * Done plot Zoom when user click on zoom buttons and also return zoom configuration object which is needed to pass to draw bar.
 *
 * Trigger by overallZoomEvent which invoke updateOverAllView method in controller which in turn call this function.
 * iFlight gantt zoomin and zoomout functionality worked on overallZoomEvent
 *
 * @param {Array} allPlot - Both Tree pane and non tree pane - length - 2 since iFlight only just hide tree pane not completely remove it
 *                        - Since Sierra does't has tree view its length will be 1
 * @param {number} currentPlotIndex - index of above pane array which call this ie 0 or 1 - in case of Sierra it will be 0
 * @param {Object} zoomParameters - {zoomDirection: "ZoomOut", rowZoomParameter: 1.1, columnZoomParameter: 1.25, metaInFo: "W16..."}
 * @param {Object} zoomObject - current zoom Object - Zoom Object has zoomRowCount ie row count of each pane
 *                            - zoomObject is initialized as empty object in controller
 * @param {string} pageId - Since iFlight has different pages like "W1"
 * @param {string} module - Since iFlight has different modules like "OPS"
 * @param {*} isSingleRowSplit - undefined
 * @returns {Object} zoom
 */
function overallZoom(
  allPlot,
  currentPlotIndex,
  zoomParameters,
  zoomObject,
  pageId,
  module,
  isSingleRowSplit
) {
  /**
   * MetaInfo is set for uniquely identifying overallZoom events.
   * zoomRowCount and Offset calculations are needed only once for every open panes.
   */

  /** Check whether event emitted from a hidden or minimized pane */
  let canProceed = true;
  const minZoomInColumnLevel = this.getMinZoomInLevel(module); // In days
  const maxZoomOutColumnLevel = this.getMaxZoomOutLevel(module); // in days

  // eslint-disable-next-line consistent-return
  allPlot.forEach(function(plot, index) {
    const paneStatus = iflightGanttLayout.getPaneStatus(
      pageId,
      plot.getUniqueId(plot.getGanttFromPlot())
    );
    if (paneStatus && (paneStatus.hidden || paneStatus.isMinimized)) {
      canProceed = false;
      return false;
    }
  });
  if (!canProceed || !zoomParameters.metaInfo || currentPlotIndex < 0) return;

  /** Initializations begin */
  const zoom = {};
  const plotLabel = allPlot[currentPlotIndex].getPlotLabel();
  const scrollableObjects =
    allPlot[currentPlotIndex].horizontalScrollBar.scrollableObjectsCollection;
  let totalRowCount = 0;
  const customZoomObj = customZoomObject[pageId];
  const ganttCommonService = this;
  const displayWeek = allPlot[currentPlotIndex].getOptions().xaxis
    .multiLineTimeHeader.displayWeek.enable;
  let zoomOffset = 1;
  let overrideFlag = false;
  let zoomLevel = zoomObject.zoomLevel;
  let zoomTo = zoomObject.zoomTo;
  /** Initializations end */
  zoom.dateVal = getUTCDateForTimeInMilliseconds(
    allPlot[currentPlotIndex].horizontalScrollBar.getViewValues().minViewValue,
    false
  );
  zoom.zoomTo = zoomObject.zoomTo;
  /** Set total row Count */
  if (customZoomObj) {
    totalRowCount = customZoomObj.zoomRowCount;
    zoomOffset = customZoomObj.zoomOffset ? customZoomObj.zoomOffset : 1;
    zoomLevel = customZoomObj.zoomLevel
      ? customZoomObj.zoomLevel
      : zoomObject.zoomLevel;
    zoomTo = customZoomObj.zoomTo;
    if (
      customZoomObj.metaInfo &&
      customZoomObj.metaInfo === zoomParameters.metaInfo
    ) {
      overrideFlag = true;
    }
  } else {
    const polledObjects = [];
    $.each(scrollableObjects, function(index, plot) {
      const paneStatus = iflightGanttLayout.getPaneStatus(
        pageId,
        plot.getUniqueId(plot.getGanttFromPlot())
      );
      const options = plot.getOptions();
      let labelMarginOffset = 0;
      if (plot.getSeries().xaxis.labelHeight > 0) {
        labelMarginOffset = plot.getOptions().grid.labelMargin * 2; // taken twice to consider labelMargin and extraLabelMargin
      }
      if (
        paneStatus &&
        !paneStatus.hidden &&
        // Sierra Fix - when maximize 2nd pane and zoom in and close 2nd pane then the row height slightly increases
        // !paneStatus.isMinimized &&
        options.series.gantt.minTickHeight > 0 &&
        plot.height() > 0 &&
        plot.getPlaceholder().height() > 0 &&
        polledObjects.indexOf(plot.getUniqueId(plot.getGanttFromPlot())) === -1
      ) {
        totalRowCount +=
          (plot.height() + labelMarginOffset) /
          options.series.gantt.minTickHeight;
        polledObjects.push(plot.getUniqueId(plot.getGanttFromPlot()));
      }
    });
  }
  /** Adjust total row count and zoom level begin */
  if (!overrideFlag) {
    if (zoomParameters.zoomDirection === 'ZoomIn') {
      totalRowCount /= zoomParameters.rowZoomParameter;
      zoomLevel /= zoomParameters.columnZoomParameter;
      if (zoomTo === 'months') {
        if (zoomLevel < minZoomInColumnLevel / 30) {
          zoomLevel = minZoomInColumnLevel / 30;
        }
        if (zoomLevel <= 1) {
          zoomLevel *= 30;
          if (displayWeek && zoomLevel > 7) {
            zoomLevel /= 7;
            zoomTo = 'weeks';
          } else {
            zoomTo = 'days';
          }
        }
      } else if (zoomTo === 'weeks') {
        if (zoomLevel < minZoomInColumnLevel / 7) {
          zoomLevel = minZoomInColumnLevel / 7;
        }
        if (zoomLevel <= 1) {
          zoomLevel *= 7;
          zoomTo = 'days';
        }
      } else if (zoomTo === 'days') {
        if (zoomLevel < minZoomInColumnLevel) {
          zoomLevel = minZoomInColumnLevel;
        }
        if (zoomLevel <= 1) {
          zoomLevel *= 24;
          zoomTo = 'hours';
        }
      } else if (zoomTo === 'hours' && zoomLevel < minZoomInColumnLevel * 24) {
        zoomLevel = minZoomInColumnLevel * 24;
      }
    } else if (zoomParameters.zoomDirection === 'ZoomOut') {
      totalRowCount *= zoomParameters.rowZoomParameter;
      zoomLevel *= zoomParameters.columnZoomParameter;
      if (zoomTo === 'hours') {
        if (zoomLevel > maxZoomOutColumnLevel * 24) {
          zoomLevel = maxZoomOutColumnLevel * 24;
        }
        if (zoomLevel >= 24) {
          zoomLevel /= 24;
          if (zoomLevel > 30) {
            zoomLevel /= 30;
            zoomTo = 'months';
          } else if (displayWeek && zoomLevel > 7) {
            zoomLevel /= 7;
            zoomTo = 'weeks';
          } else {
            zoomTo = 'days';
          }
        }
      } else if (zoomTo === 'days') {
        if (zoomLevel > maxZoomOutColumnLevel) {
          zoomLevel = maxZoomOutColumnLevel;
        }
        if (zoomLevel >= 30) {
          zoomLevel /= 30;
          zoomTo = 'months';
        } else if (displayWeek && zoomLevel >= 7) {
          zoomLevel /= 7;
          zoomTo = 'weeks';
        }
      } else if (zoomTo === 'weeks') {
        if (zoomLevel > maxZoomOutColumnLevel / 7) {
          zoomLevel = maxZoomOutColumnLevel / 7;
        }
        if (zoomLevel >= 4) {
          zoomLevel *= 7 / 30;
          zoomTo = 'months';
        }
      } else if (
        zoomTo === 'months' &&
        zoomLevel > maxZoomOutColumnLevel / 30
      ) {
        zoomLevel = maxZoomOutColumnLevel / 30;
      }
    }
  }
  /** Adjust total row count and zoom level end */
  /** Calculate zoom offset begin */
  if (zoomParameters.rowZoomParameter === 1) {
    zoom.zoomRowCount = zoomObject.zoomRowCount;
  } else {
    zoom.zoomRowCount = this.getPaneZoomRowCount(
      allPlot[currentPlotIndex],
      totalRowCount,
      pageId
    );
  }
  zoom.zoomOffset = zoomOffset;
  zoom.zoomLevel = zoomLevel;
  zoom.zoomTo = zoomTo;
  /** Zoom offset calculation w.r.to old row count */
  if (!overrideFlag) {
    const newZoomOffset = ganttCommonService.calcZoomOffset(
      zoom,
      pageId,
      plotLabel,
      zoomParameters
    );
    if (newZoomOffset) {
      zoom.zoomOffset = newZoomOffset;
    }
  }
  /** Calculate zoom offset end */

  let singleRowSplit = false;
  if (isSingleRowSplit) {
    singleRowSplit = isSingleRowSplit;
  }

  ganttCommonService.zoomCalc(allPlot, zoom, null, pageId);
  ganttCommonService.verticalZoom(allPlot, zoom, pageId, singleRowSplit);
  if (
    !overrideFlag &&
    !(zoom.zoomTo === 'months' && zoom.zoomLevel >= maxZoomOutColumnLevel) &&
    totalRowCount > 0
  ) {
    this.setCustomZoomObject(
      zoom.dateVal,
      zoom.zoomTo,
      zoom.zoomLevel,
      totalRowCount,
      zoom.zoomOffset,
      pageId,
      zoomParameters.metaInfo
    );
  }
  // eslint-disable-next-line consistent-return
  return zoom;
}

/**
 * @description
 *
 * To create initial zoom object. This zoom object will be used in later zoom operation when user click zoom bn
 *
 * Called from paneController - ie by setPaneObject (plotObjectConsumer configuration in controller). This function only invoked once.
 *
 * Webcomponent first call ganttOptions.initializer. This function fetch data range and total no of rows ids.
 * Response handler of initializer updated initData in ganttModal. When initData us updated it will trigger web component watcher (oberver) which in turn call initPane in services.
 * After initPane create pane, The webcomponent call plotObjectConsumer and this plotObjectConsumer is calling setupRootZoomVariables.
 *
 * @param {Object} plot - Chronos plot
 * @param {string} pageId
 * @param {string} plotLabel
 * @returns {object} curZoomObject
 */
function setupRootZoomVariables(plot, pageId, plotLabel) {
  const options = plot.getOptions();
  const viewValue = plot.horizontalScrollBar.getViewValues();
  const curZoomObject = new gantPaneZoomConfig();
  curZoomObject.zoomLevel =
    (viewValue.maxViewValue - viewValue.minViewValue) / 86400000;
  curZoomObject.minTickHeight = options.series.gantt.minTickHeight;
  curZoomObject.zoomRowCount =
    (plot.height() - plot.getAxes().xaxis.labelHeight) /
    curZoomObject.minTickHeight;
  curZoomObject.paneHeight = plot.height();
  curZoomObject.paneId = plot.getUniqueId(plot.getGanttFromPlot());
  this.setZoomConfig(curZoomObject, pageId, plotLabel);
  return curZoomObject;
}

/**
 * @description
 *
 * Called from paneController - ie by setPaneObject
 *
 * Instead of calling directly plot.zoom and plot.zoomOut, Here we update the zoomConfiguration.
 * User can set the number of rows that need to displayed ie set zoom level. ie unlike Sierra no of rows is not constant.
 *
 * @param {Object} plot - chronos plot object
 * @param {Object} zoomObject
 * @param {string} pageId
 * @param {string} plotLabel
 * @param {Object} zoomParameters
 * @returns {Object} zoom
 */
function setupZoomVariables(
  plot,
  zoomObject,
  pageId,
  plotLabel,
  zoomParameters
) {
  const options = plot.getOptions();
  const maxHeight = $(`#${pageId} .h_pane_wrapper`).height();
  const paneId = plot.getUniqueId(plot.getGanttFromPlot());
  const paneStatus = iflightGanttLayout.getPaneStatus(pageId, paneId);
  let zoomRowCount;
  let zoomOffset = 1;
  let customZoom;
  let minTickHeight;
  if (
    plot.height() > 0 &&
    paneStatus &&
    !paneStatus.hidden &&
    !paneStatus.isMinimized
  ) {
    customZoom = this.getCustomZoomObject(pageId);
    if (customZoom) {
      zoomRowCount = this.getPaneZoomRowCount(
        plot,
        customZoom.zoomRowCount,
        pageId
      );
      zoomOffset = customZoom.zoomOffset;
      minTickHeight = plot.height() / zoomRowCount;
    } else if (
      plot.height() / options.series.gantt.minTickHeight <
      options.series.gantt.maxTotalRows
    ) {
      zoomRowCount = plot.height() / options.series.gantt.minTickHeight;
      minTickHeight = options.series.gantt.minTickHeight;
    } else {
      zoomRowCount = options.series.gantt.maxTotalRows;
      minTickHeight = plot.height() / zoomRowCount;
    }
    const zoom = {
      zoomRowCount,
      zoomOffset,
      minTickHeight,
      paneHeight: plot.getPlaceholder().height(),
    };
    this.setZoomConfig($.extend(zoomObject, zoom), pageId, plotLabel);
    return zoom;
  }
  return this.getZoomConfig(pageId, plotLabel);

  /* var returnObject = {
             zoomLevel : zoomObject.zoomLevel,
             zoomRowCount : zoomObject.zoomRowCount,
             zoomTo : zoomObject.zoomTo,
             zoomOffset : zoomObject.zoomOffset,
             minTickHeight : plot.height() / zoomObject.zoomRowCount,
             paneHeight : plot.height(),
             paneId : plot.getUniqueId()
        } */
}

/**
 *
 * @param {Object} zoomConfig
 * @param {string} pageId
 * @param {string} plotLabel
 */
function setZoomConfig(zoomConfig, pageId, plotLabel) {
  if (paneZoomConfigs && !paneZoomConfigs[pageId]) {
    paneZoomConfigs[pageId] = {};
  }
  if (paneZoomConfigs && paneZoomConfigs[pageId]) {
    paneZoomConfigs[pageId][plotLabel] = JSON.parse(JSON.stringify(zoomConfig));
  }
}

/**
 * Need description
 *
 * @param {Integer}
 * @param {Integer, String}
 * @returns {Object}
 */
function getZoomConfig(pageId, plotLabel) {
  if (paneZoomConfigs && paneZoomConfigs[pageId]) {
    return JSON.parse(JSON.stringify(paneZoomConfigs[pageId][plotLabel]));
  }
  return null;
}

/**
 * Need description
 *
 * @param {Integer}
 * @returns {Object}
 */
function getAllZoomConfig(pageId) {
  return JSON.parse(JSON.stringify(paneZoomConfigs[pageId]));
}

/**
 * Need description
 *
 * @param {Integer, Integer}
 * @returns {Object}
 */
function getZoomConfigFromPaneid(pageId, paneId) {
  let index = null;
  let config = null;
  if (paneZoomConfigs[pageId]) {
    // eslint-disable-next-line consistent-return
    $.each(paneZoomConfigs[pageId], function(plotLabel, element) {
      if (element.paneId === paneId) {
        index = plotLabel;
        return false;
      }
    });
    if (index) {
      config = JSON.parse(JSON.stringify(paneZoomConfigs[pageId][index]));
    }
  }
  return config;
}

/**
 * Need description
 *
 * @param {Integer}
 */
function clearZoomConfig(pageId) {
  if (paneZoomConfigs[pageId]) {
    paneZoomConfigs[pageId] = null;
  }
}

/**
 * Need description
 *
 * @param {Object}
 * @returns {Object}
 */
// eslint-disable-next-line consistent-return
function getCurrentViewArea(plot) {
  if (plot && plot.height() > 1) {
    return {
      xaxis: plot.horizontalScrollBar.viewArea,
      yaxis: plot.verticalScrollBar.viewArea,
    };
  }
}

/**
 * Need description
 *
 * @param {Integer}
 */
function setFreezePosition(pos) {
  freezePos = pos;
}

/**
 * Need description
 *
 * @returns {Integer}
 */
function getFreezePosition() {
  return freezePos;
}

/**
 * Need description
 *
 * @param {Object, Boolean}
 */
function toggleAutoScrollOnTaskDrag(plot, enableAutoScroll) {
  if (plot && Object.keys(plot).length > 0) {
    const options = plot.getOptions();
    if (enableAutoScroll) {
      options.taskDrag.autoScrollTimer = 100;
      options.taskDrag.autoScrollPixel = 20;
    } else {
      options.taskDrag.autoScrollTimer = 0;
      options.taskDrag.autoScrollPixel = 0;
    }
  }
}

/**
 * Need description
 *
 * @param {Object, Integer}
 * @returns {Object}
 */
function getTextOffset(configFontStyle, zoomOffset) {
  let textPixel;
  let fontStylePart1;

  const fontStylePart2 = configFontStyle.slice(
    configFontStyle.indexOf('px'),
    configFontStyle.length
  );
  if (configFontStyle.indexOf(' ') < configFontStyle.indexOf('px')) {
    // does not start with pixel value
    textPixel =
      parseInt(
        configFontStyle.substring(
          configFontStyle.indexOf(' ') + 1,
          configFontStyle.indexOf('px')
        ),
        10
      ) * zoomOffset;
    fontStylePart1 = configFontStyle.slice(0, configFontStyle.indexOf(' ') + 1);
    configFontStyle = fontStylePart1
      .concat(textPixel.toString())
      .concat(fontStylePart2);
  } else {
    // starts with pixel value
    textPixel =
      parseInt(
        configFontStyle.substring(0, configFontStyle.indexOf('px')),
        10
      ) * zoomOffset;
    configFontStyle = textPixel.toString().concat(fontStylePart2);
  }
  return configFontStyle;
}

/**
 * Need description
 *
 * @param {Object, Object, Object}
 * @returns {Object}
 */
// eslint-disable-next-line consistent-return
function isNotWrap(plot, position, task) {
  if (
    plot &&
    plot.constructor.name == 'Chronos' &&
    task &&
    Object.keys(task).length > 0
  ) {
    const s = plot.getSeries();
    let taskIdArray = null;
    let dataMapRowIndex;
    let dataMapColumnIndex;
    let eachObject;
    const rowIndexMap = s.rowMap;
    const columnIndexMap = s.columnMap;
    const dataMap = s.dataMap;
    const currentRowId = task.rowId;
    const dateTimeStampVal = position == 'left' ? task.start : task.end;
    const currId = task.chronosId;
    const yValue = task.yValue;
    const oneDayMillis = 24 * 3600 * 1000;
    const normalMaximumDaySpanMinusOne = s.gantt.normalMaximumDaySpan - 1;
    const scrollRange = plot.getOptions().xaxis.scrollRange;
    let notWrapFlag = true;
    dataMapRowIndex = rowIndexMap[currentRowId];
    if (dataMapRowIndex != null || dataMapRowIndex != undefined) {
      for (
        let time = plot.resetViewPortTime(
          scrollRange[0] - normalMaximumDaySpanMinusOne * oneDayMillis
        );
        time <= plot.resetViewPortTime(scrollRange[1]);

      ) {
        dataMapColumnIndex = columnIndexMap[time];
        if (dataMapColumnIndex != null || dataMapColumnIndex != undefined) {
          taskIdArray = plot.getNormalTaskIdArray(
            s,
            dataMapRowIndex,
            dataMapColumnIndex
          );
          if (
            taskIdArray != null &&
            taskIdArray != undefined &&
            taskIdArray.length > 0
          ) {
            for (let i = 0; i < taskIdArray.length; i++) {
              let taskObjectId = taskIdArray[i];
              eachObject = dataMap[taskObjectId];
              if (
                currId != taskObjectId &&
                eachObject &&
                eachObject.start <= dateTimeStampVal &&
                eachObject.end >= dateTimeStampVal &&
                eachObject.yValue == yValue
              ) {
                notWrapFlag = false;
              }
            }
            break;
          }
        }
        time = time + oneDayMillis;
      }

      if (notWrapFlag && s.longRangeDataMap != undefined) {
        taskIdArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex);
        if (
          taskIdArray != null &&
          taskIdArray != undefined &&
          taskIdArray.length > 0
        ) {
          for (let i = 0; i < taskIdArray.length; i++) {
            const taskObjectId = taskIdArray[i];
            const eachObject = dataMap[taskObjectId];
            if (
              currId != taskObjectId &&
              eachObject &&
              eachObject.start <= dateTimeStampVal &&
              eachObject.end >= dateTimeStampVal &&
              eachObject.yValue == yValue
            ) {
              notWrapFlag = false;
              break;
            }
          }
        }
      }
    }
    return notWrapFlag;
  }
}

/**
 * Need description
 *
 * @param {Object, Integer, Integer, Date, String}
 * @returns {Object}
 */
function isTaskOverlapping(plot, id, rowId, timeStamp, ganttItemType) {
  const s = plot.getSeries();
  let taskIdArray = null;
  let dataMapColumnIndex;
  //  let eachObject;
  const rowIndexMap = s.rowMap;
  const columnIndexMap = s.columnMap;
  const dataMap = s.dataMap;
  const oneDayMillis = 24 * 3600 * 1000;
  const normalMaximumDaySpanMinusOne = s.gantt.normalMaximumDaySpan - 1;
  let isOverlapping = false;
  let overlapTask;
  const dataMapRowIndex = rowIndexMap[rowId];
  if (dataMapRowIndex != null || dataMapRowIndex !== undefined) {
    for (
      let time = plot.resetViewPortTime(
        timeStamp - normalMaximumDaySpanMinusOne * oneDayMillis
      );
      time <=
      plot.resetViewPortTime(
        timeStamp + normalMaximumDaySpanMinusOne * oneDayMillis
      );

    ) {
      dataMapColumnIndex = columnIndexMap[time];
      if (dataMapColumnIndex != null || dataMapColumnIndex !== undefined) {
        taskIdArray = plot.getNormalTaskIdArray(
          s,
          dataMapRowIndex,
          dataMapColumnIndex
        );
        if (
          taskIdArray != null &&
          taskIdArray !== undefined &&
          taskIdArray.length > 0
        ) {
          for (let i = 0; i < taskIdArray.length; i++) {
            const taskObjectId = taskIdArray[i];
            const eachObject = dataMap[taskObjectId];
            if (
              eachObject.chronosId !== id &&
              eachObject.start <= timeStamp &&
              eachObject.end >= timeStamp &&
              eachObject.ganttItemType === ganttItemType
            ) {
              isOverlapping = true;
              overlapTask = eachObject;
            }
          }
        }
      }
      time += oneDayMillis;
    }
  }
  if (!isOverlapping && s.longRangeDataMap !== undefined) {
    taskIdArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex);
    if (
      taskIdArray != null &&
      taskIdArray !== undefined &&
      taskIdArray.length > 0
    ) {
      for (let i = 0; i < taskIdArray.length; i++) {
        const taskObjectId = taskIdArray[i];
        const eachObject = dataMap[taskObjectId];
        if (
          eachObject.chronosId !== id &&
          eachObject.start <= timeStamp &&
          eachObject.end >= timeStamp &&
          eachObject.ganttItemType === ganttItemType
        ) {
          isOverlapping = true;
          overlapTask = eachObject;
        }
      }
    }
  }
  return isOverlapping ? overlapTask : null;
}

/**
 * @description
 *
 * Function that display different indicators for each item in the gantt
 * drawBar function will invoke this function
 * It is required in both iFlight and Sierra
 *
 * @param {Object} context - It is the modified contextHolder object from drwaBar(that is created in pane controller by modifying the context data given by chronos).
 * @param {Object} configuration - It is the same configuration object passed from drwaBar function.
 * @param {Object} plot - It is the initPane created chronos plot object passed from drawBar function.
 * @param {String} zoomOffset - It is the default zoomOffset getting from contextHolder
 */
function drawTimeBasedIndicators(context, configuration, plot, zoomOffset) {
  const contextHolder = context.dataToDraw;
  const task = contextHolder.eachTask;
  const ganttCommonService = this;
  const cTop = 0;
  const cHeight = 0;
  const ganttConfiguration = ds.getData('app', 'ganttConfiguration', null, {
    id: this.pageId,
  });
  if (
    (configuration.timeBased != null ||
      configuration.timeBased !== undefined) &&
    Object.keys(configuration.timeBased).length > 0
  ) {
    each(configuration.timeBased, function(timeBasedConfiguration, index) {
      let fillColor = `#${timeBasedConfiguration.color}`;
      const properties = timeBasedConfiguration.property.split('.');
      let value;
      let tempTask = task;
      if (contextHolder.mode === 'HOVER') {
        if (context.moduleName) {
          fillColor =
            ganttConfiguration[context.moduleName].timeBasedHoverColor;
        }
      }
      each(properties, function(property, index) {
        if (tempTask !== undefined || tempTask != null) {
          value = tempTask[property];
          tempTask = value;
        }
      });
      const top = context.top ? context.top : 0;
      const timePos =
        plot.getSeries().xaxis.p2c(value) - contextHolder.leftCordinate;
      if (timePos !== undefined && timePos != null && !isNaN(timePos)) {
        switch (timeBasedConfiguration.icon) {
          case 'neo_vLine':
            {
              ganttCommonService.drawVerticalLine(
                fillColor,
                contextHolder.drawingContext,
                timePos,
                top,
                context.height
              );
            }
            break;

          case 'neo_triangle':
            {
              ganttCommonService.drawTriangle(
                fillColor,
                null,
                contextHolder.drawingContext,
                timePos - timeBasedConfiguration.iconWidth / 2 - top,
                timeBasedConfiguration.iconHeight / 2 + top,
                timePos,
                top,
                timePos + timeBasedConfiguration.iconWidth / 2 + top,
                timeBasedConfiguration.iconHeight / 2 + top,
                2,
                true
              );
            }
            break;

          case 'neo_rectangle':
            {
              ganttCommonService.drawRectangle(
                fillColor,
                null,
                contextHolder.drawingContext,
                timePos,
                top,
                context.width - (timePos - context.left),
                context.height,
                1
              );
            }
            break;
        }
      }
    });
  }
}

/**
 * @description
 *
 * Function that render the items on the gantt.
 * pane controller (Angular or React controller) will invoke this function.
 * chronos will trigger the redererFunction that will trigger the webcomponent render function (eg labelRenderer) ->
 * that will trigger pane controller (Angular or React controller) ->
 * thet will trigger call to the darwBar in gantt services.
 * It is required in both iFlight and Sierra
 *
 * @param {​​​​​​​​Object} ​​​​​​​​contextHolder - It is a object that is created in pane controller by modifying  the context data given by chronos.
 * @param {​​​​​​​​Object} ​​​​​​​​configuration - It is a configuration object passed from pane controller by calling gantt service function getConfiguration
 * @param {​​​​​​​​Object} ​​​​​​​​plot - It is the initPane created chronos plot object passed from pane controller
 * @param {​​​​​​​​Object} ​​​​​​​​scope - It is  global object which includes the necessary data
 * @param {​​​​​​​​Object} ​​​​​​​​onDrawBarComplete - It is not used, most of the time it is coming as undefined
 * @param {​​​​​​​​Object} ​​​​​​​​pObj - It is not used, most of the time it is coming as undefined
 * @param {​​​​​​​​Object}​​​​​​​​ nObj - It is not used, most of the time it is coming as undefined
 */
function drawBar(
  contextHolder,
  configuration,
  plot,
  scope,
  onDrawBarComplete,
  pObj,
  nObj
) {
  // Adjustment to make task bar rendering visually better
  if (contextHolder.dataToDraw.eachTask) {
    contextHolder.top += contextHolder.height * 0.075; // reduce render top by 7.5% [half of height reduction]
    contextHolder.height -= contextHolder.height * 0.15; // reduce height by 15%
  }

  const { context } = contextHolder;
  const { top } = contextHolder;
  const { left } = contextHolder;
  const { width } = contextHolder;
  const { height } = contextHolder;
  const { mode } = contextHolder;
  context.save();
  if (configuration.bar.fillColor !== 'transparent') {
    const colorsArr =
      configuration.bar.fillColor && configuration.bar.fillColor.split(',');
    if (Array.isArray(colorsArr) && colorsArr.length > 1) {
      // temporary fix for Sierra
      if (Number.isFinite(height)) {
        strokeStyle = context.createLinearGradient(0, 0, 0, height);
        for (let i = 0; i < colorsArr.length; i = i + 2) {
          const color = colorsArr[i];
          const pos = colorsArr[i + 1];
          strokeStyle.addColorStop(pos / 100, `#${color}`);
          context.fillStyle = strokeStyle;
          context.fillRect(left, top, width, height);
        }
      }
    } else {
      context.fillStyle = `#${configuration.bar.fillColor}`;
      context.fillRect(left, top, width, height);
    }
  }
  context.lineWidth = configuration.bar.borderWidth;
  let strokeStyle = configuration.bar.borderColor;
  if (strokeStyle) {
    if (configuration.bar.borderColor2) {
      strokeStyle = context.createLinearGradient(left, 0, left + width, 0);
      strokeStyle.addColorStop(0.5, configuration.bar.borderColor);
      strokeStyle.addColorStop(0.5, configuration.bar.borderColor2);
    }
    context.strokeStyle = strokeStyle;
    context.strokeRect(left, top, width, height);
  }
  contextHolder.label = configuration.label;
  contextHolder.leftOuterLabel = configuration.outLeftLabel;
  contextHolder.rightOuterLabel = configuration.outRightLabel;
  contextHolder.widthSpacingFactor = 1;
  contextHolder.moduleName = scope ? scope.module : '';
  this.drawTimeBasedIndicators(
    contextHolder,
    configuration,
    plot,
    contextHolder.zoomOffset
  );

  const viewValue = plot.horizontalScrollBar.getViewValues();
  const { p2c } = plot.getSeries().xaxis;
  const max = p2c(viewValue.maxViewValue);
  const min = p2c(viewValue.minViewValue);
  const leftCoordinate = contextHolder.dataToDraw.leftCordinate;
  if (
    leftCoordinate + contextHolder.left < min &&
    !(leftCoordinate + contextHolder.left + contextHolder.width < min)
  ) {
    const prevLeft = contextHolder.left;
    contextHolder.left = min - leftCoordinate;
    contextHolder.width = contextHolder.width - contextHolder.left + prevLeft;
    if (configuration.enableExtendLabel) {
      contextHolder.leftFlag = true;
    }
  }
  if (leftCoordinate + contextHolder.width > max) {
    contextHolder.width = max - leftCoordinate;
    if (configuration.enableExtendLabel) {
      contextHolder.rightFlag = true;
    }
  }
  const maxWidth = max - min;
  if (contextHolder.width > maxWidth) {
    contextHolder.width = maxWidth;
    if (configuration.enableExtendLabel) {
      contextHolder.rightFlag = true;
    }
  }

  if (onDrawBarComplete && isFunction(onDrawBarComplete)) {
    onDrawBarComplete(contextHolder);
  }

  this.drawLabels(contextHolder, context, plot);
  if (contextHolder.dataToDraw.eachTask) {
    this.drawOuterLeftLabels(contextHolder, context, plot, pObj);
    this.drawOuterRightLabels(
      contextHolder,
      context,
      plot,
      nObj,
      scope ? scope.module : ''
    );
  }
  context.restore();
}

/**
 * @description
 *
 * Function that decide the text or icon(label) should render on task based on the zoom level based on the available space.
 * drawBar will invoke drawLabels which will invoke getLabelDimensions
 * did any other fn we need to invoke before we call this fn?
 * It is required in both iFlight and Sierra
 *
 * @param {​​​​​​​​Object}​​​​​​​​ container - It is a object which contains the configuration details like position, context, preference, barheight, barwidth, spacing etc.
 * @param {​​​​​​​​Object}​​​​​​​​ top - top position details
 * @param {​​​​​​​​Object}​​​​​​​​ center - center position details
 * @param {​​​​​​​​Object} ​​​​​​​​bottom - bottom position details
 * @param {​​​​​​​​Object}​​​​​​​​ leftHeight - leftHeight position
 * @param {​​​​​​​​Object} ​​​​​​​​middleHeight - middleHeight position
 * @param {​​​​​​​​Object} ​​​​​​​​rightHeight - rightHeight Position
 * @param {​​​​​​​​number}​​​​​​​​ zoomOffset - default zoomOffset getting from contextHolder
 * @param {​​​​​​​​Object} ​​​​​​​​cellPadding - cellPadding details
 * @return It returns object that include available height and width and whether is drawable or not
 */
function getLabelDimensions(
  container,
  top,
  center,
  bottom,
  leftHeight,
  middleHeight,
  rightHeight,
  zoomOffset,
  cellPadding
) {
  let reqWidth = 0;
  let reqHeight = 0;
  let textHeight = 0;
  let iconHeight = 0;
  let allowText;
  let allowIcon;
  const ganttCommonService = this;
  let drawable = true;
  const configuration = container.configuration;
  container.context.font =
    zoomOffset !== 1
      ? ganttCommonService.getTextOffset(configuration.fontStyle, zoomOffset)
      : configuration.fontStyle;
  if (container.preference === 'both') {
    allowText = true;
    allowIcon = true;
  } else {
    allowText = !configuration.override;
    allowIcon = !!configuration.override;
  }

  if (
    allowText &&
    configuration.text !== undefined &&
    configuration.text != null &&
    configuration.text !== ''
  ) {
    const fontArgs = container.context.font.split(' ');
    const length = fontArgs.length;
    let fontPxIndex = -1;
    for (let i = 0; i < length; i++) {
      const value = fontArgs[i];
      if (value.indexOf('px') > -1) {
        fontPxIndex = i;
        break;
      }
    }
    const fontPx = fontArgs[fontPxIndex].split('px');
    configuration.textWidth = container.context.measureText(
      configuration.text
    ).width;
    configuration.textHeight = parseInt(fontPx[0], 10);
    reqWidth += configuration.textWidth;
    textHeight += configuration.textHeight;
  }
  if (
    allowIcon &&
    configuration.icon !== undefined &&
    configuration.icon != null &&
    configuration.icon !== ''
  ) {
    const iconDimensions = this.getIconDimensions(configuration);
    reqWidth += iconDimensions.width * zoomOffset;
    iconHeight += iconDimensions.height * zoomOffset;
  }
  reqHeight += Math.max(textHeight, iconHeight);
  reqWidth += container.widthSpacingFactor;
  reqHeight += container.heightSpacingFactor;

  switch (configuration.position) {
    case 'TOP_LEFT':
      // eslint-disable-next-line no-lone-blocks
      {
        top.left = reqWidth;
        leftHeight.topHeight = reqHeight;
        if (
          top.middle > 0 &&
          top.left > container.barWidth / 2 - top.middle / 2
        ) {
          drawable = false;
        }
        if (
          leftHeight.topHeight > 0 &&
          leftHeight.topHeight +
            leftHeight.centerHeight +
            leftHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            center.middle,
            bottom.middle,
            center.right,
            bottom.right
          );
          const refHeight = Math.max(
            middleHeight.centerHeight,
            rightHeight.centerHeight,
            middleHeight.bottomHeight,
            rightHeight.bottomHeight
          );
          if (
            top.left +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            leftHeight.topHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'CENTER_LEFT':
      {
        center.left = reqWidth;
        leftHeight.centerHeight = reqHeight;
        if (
          center.middle > 0 &&
          center.left > container.barWidth / 2 - center.middle / 2
        ) {
          drawable = false;
        }
        const availHeight =
          leftHeight.topHeight > leftHeight.bottomHeight
            ? leftHeight.topHeight
            : leftHeight.bottomHeight;
        if (
          leftHeight.centerHeight > 0 &&
          leftHeight.topHeight +
            leftHeight.centerHeight +
            leftHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            top.middle,
            bottom.middle,
            top.right,
            bottom.right
          );
          const refHeight = Math.max(
            middleHeight.topHeight,
            rightHeight.topHeight,
            middleHeight.bottomHeight,
            rightHeight.bottomHeight
          );
          if (
            center.left +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            leftHeight.centerHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'BOTTOM_LEFT':
      {
        bottom.left = reqWidth;
        leftHeight.bottomHeight = reqHeight;
        if (
          bottom.middle > 0 &&
          bottom.left > container.barWidth / 2 - bottom.middle / 2
        ) {
          drawable = false;
        }
        if (
          leftHeight.bottomHeight > 0 &&
          leftHeight.topHeight +
            leftHeight.centerHeight +
            leftHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            top.middle,
            center.middle,
            top.right,
            center.right
          );
          const refHeight = Math.max(
            middleHeight.topHeight,
            rightHeight.topHeight,
            middleHeight.centerHeight,
            rightHeight.centerHeight
          );
          if (
            bottom.left +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            leftHeight.bottomHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'TOP_CENTER':
      {
        top.middle = reqWidth;
        middleHeight.topHeight = reqHeight;
        const availWidth = top.left > top.right ? top.left : top.right;
        if (
          availWidth > 0 &&
          availWidth + top.middle / 2 > container.barWidth / 2
        ) {
          drawable = false;
        }
        if (
          middleHeight.topHeight > 0 &&
          middleHeight.topHeight +
            middleHeight.centerHeight +
            middleHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            center.left,
            bottom.left,
            center.right,
            bottom.right
          );
          const refHeight = Math.max(
            leftHeight.centerHeight,
            rightHeight.centerHeight,
            leftHeight.bottomHeight,
            rightHeight.bottomHeight
          );
          if (
            top.middle +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            middleHeight.topHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'CENTER':
      {
        center.middle = reqWidth;
        middleHeight.centerHeight = reqHeight;
        const availWidth =
          center.left > center.right ? center.left : center.right;
        const availHeight =
          middleHeight.topHeight > middleHeight.bottomHeight
            ? middleHeight.topHeight
            : middleHeight.bottomHeight;
        if (
          availWidth > 0 &&
          availWidth + center.middle / 2 > container.barWidth / 2
        ) {
          drawable = false;
        }
        if (
          middleHeight.centerHeight > 0 &&
          middleHeight.topHeight +
            middleHeight.centerHeight +
            middleHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            top.left,
            bottom.left,
            top.right,
            bottom.right
          );
          const refHeight = Math.max(
            leftHeight.topHeight,
            rightHeight.topHeight,
            leftHeight.bottomHeight,
            rightHeight.bottomHeight
          );
          if (
            center.middle +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            middleHeight.centerHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'BOTTOM_CENTER':
      {
        bottom.middle = reqWidth;
        middleHeight.bottomHeight = reqHeight;
        const availWidth =
          bottom.left > bottom.right ? bottom.left : bottom.right;
        if (
          availWidth > 0 &&
          availWidth + bottom.middle / 2 > container.barWidth / 2
        ) {
          drawable = false;
        }
        if (
          middleHeight.bottomHeight > 0 &&
          middleHeight.topHeight +
            middleHeight.centerHeight +
            middleHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            top.left,
            center.left,
            top.right,
            center.right
          );
          const refHeight = Math.max(
            leftHeight.topHeight,
            rightHeight.topHeight,
            leftHeight.centerHeight,
            rightHeight.centerHeight
          );
          if (
            bottom.middle +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            middleHeight.bottomHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'TOP_RIGHT':
      {
        top.right = reqWidth;
        rightHeight.topHeight = reqHeight;
        if (
          top.middle > 0 &&
          top.right > container.barWidth / 2 - top.middle / 2
        ) {
          drawable = false;
        }
        if (
          rightHeight.topHeight > 0 &&
          rightHeight.topHeight +
            rightHeight.centerHeight +
            rightHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            center.left,
            bottom.left,
            center.middle,
            bottom.middle
          );
          const refHeight = Math.max(
            leftHeight.centerHeight,
            middleHeight.centerHeight,
            leftHeight.bottomHeight,
            middleHeight.bottomHeight
          );
          if (
            top.right +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            rightHeight.topHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'CENTER_RIGHT':
      {
        center.right = reqWidth;
        rightHeight.centerHeight = reqHeight;
        if (
          center.middle > 0 &&
          center.right > container.barWidth / 2 - center.middle / 2
        ) {
          drawable = false;
        }

        if (
          rightHeight.centerHeight > 0 &&
          rightHeight.topHeight +
            rightHeight.centerHeight +
            rightHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            top.left,
            bottom.left,
            top.middle,
            bottom.middle
          );
          const refHeight = Math.max(
            leftHeight.topHeight,
            middleHeight.topHeight,
            leftHeight.bottomHeight,
            middleHeight.bottomHeight
          );
          if (
            center.right +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            rightHeight.centerHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    case 'BOTTOM_RIGHT':
      {
        bottom.right = reqWidth;
        rightHeight.bottomHeight = reqHeight;
        if (
          bottom.middle > 0 &&
          bottom.right > container.barWidth / 2 - bottom.middle / 2
        ) {
          drawable = false;
        }
        if (
          rightHeight.bottomHeight > 0 &&
          rightHeight.topHeight +
            rightHeight.centerHeight +
            rightHeight.bottomHeight >
            container.barHeight
        ) {
          drawable = false;
        } else {
          const refWidth = Math.max(
            top.left,
            center.left,
            top.middle,
            center.middle
          );
          const refHeight = Math.max(
            leftHeight.topHeight,
            middleHeight.topHeight,
            leftHeight.centerHeight,
            middleHeight.centerHeight
          );
          if (
            bottom.right +
              refWidth +
              cellPadding * 2 +
              container.widthSpacingFactor >
              container.barWidth &&
            rightHeight.bottomHeight + refHeight + cellPadding * 2 >
              container.barHeight
          ) {
            drawable = false;
          }
        }
      }
      break;
    default:
  }

  const totalTopWidth = top.left + top.middle + top.right;
  const totalCenterWidth = center.left + center.middle + center.right;
  const totalBottomWidth = bottom.left + bottom.middle + bottom.right;
  const totalLeftHeight =
    leftHeight.topHeight + leftHeight.centerHeight + leftHeight.bottomHeight;
  const totalMiddleHeight =
    middleHeight.topHeight +
    middleHeight.centerHeight +
    middleHeight.bottomHeight;
  const totalRightHeight =
    rightHeight.topHeight + rightHeight.centerHeight + rightHeight.bottomHeight;
  const maxWidth = Math.max(totalTopWidth, totalCenterWidth, totalBottomWidth);
  const maxHeight = Math.max(
    totalLeftHeight,
    totalMiddleHeight,
    totalRightHeight
  );
  return {
    width: maxWidth,
    height: maxHeight,
    drawable,
  };
}

/**
 * @description
 *
 * this function will remove the label space which is allocated during getLabelDimension function call from the total available bar space if it is not fit into the avilable space
 * drawLables will invoke this function.
 * this is used to avoid unused space allocation.
 * It is required in both iFlight and Sierra
 *
 * @param {​​​​​​​​object} ​​​​​​​​configuration - It is a object which contains the configuration details like position, context, preference, barheight, barwidth, spacing etc.
 * @param {​​​​​​​​number}​​​​​​​​ widthSpacingFactor - widthSpacingFactor from data object
 * @param {​​​​​​​​number}​​​​​​​​ heightSpacingFactor - heightSpacingFactor from data object
 * @param {​​​​​​​​object} ​​​​​​​​top - top position
 * @param {​​​​​​​​object} ​​​​​​​​center - center position
 * @param {​​​​​​​​object}​​​​​​​​ bottom - bottom position
 * @param {​​​​​​​​object}​​​​​​​​ leftHeight - leftHeight position
 * @param {​​​​​​​​object}​​​​​​​​ middleHeight -middleHeight position
 * @param {​​​​​​​​object}​​​​​​​​ rightHeight - rightHeight position
 * @param {​​​​​​​​object} ​​​​​​​​zoomOffset - default zoomOffset getting from contextHolder
 */
function removeLabelDimensions(
  configuration,
  widthSpacingFactor,
  heightSpacingFactor,
  top,
  center,
  bottom,
  leftHeight,
  middleHeight,
  rightHeight,
  zoomOffset
) {
  const reqWidth = configuration.textWidth + widthSpacingFactor;
  const reqHeight = configuration.textHeight + heightSpacingFactor;

  switch (configuration.position) {
    case 'TOP_LEFT':
      {
        top.left -= reqWidth;
        leftHeight.topHeight -= reqHeight;
      }
      break;
    case 'CENTER_LEFT':
      {
        center.left -= reqWidth;
        leftHeight.centerHeight -= reqHeight;
      }
      break;
    case 'BOTTOM_LEFT':
      {
        bottom.left -= reqWidth;
        leftHeight.bottomHeight -= reqHeight;
      }
      break;
    case 'TOP_CENTER':
      {
        top.middle -= reqWidth;
        middleHeight.topHeight -= reqHeight;
      }
      break;
    case 'CENTER':
      {
        center.middle -= reqWidth;
        middleHeight.centerHeight -= reqHeight;
      }
      break;
    case 'BOTTOM_CENTER':
      {
        bottom.middle -= reqWidth;
        middleHeight.bottomHeight -= reqHeight;
      }
      break;
    case 'TOP_RIGHT':
      {
        top.right -= reqWidth;
        rightHeight.topHeight -= reqHeight;
      }
      break;
    case 'CENTER_RIGHT':
      {
        center.right -= reqWidth;
        rightHeight.centerHeight -= reqHeight;
      }
      break;
    case 'BOTTOM_RIGHT':
      {
        bottom.right -= reqWidth;
        rightHeight.bottomHeight -= reqHeight;
      }
      break;
    default:
  }
}

/**
 * To get outer label dimensions to check whether we have enough width and height to render outer labels.
 *
 * @param {Object} container - {configuration, context, preference, widthSpacingFactor, heightSpacingFactor}
 * @param {Object} top - {outLeft, outRight}
 * @param {Object} center - {outLeft, outRight}
 * @param {Object} bottom - {outLeft, outRight}
 * @param {number} topHeight
 * @param {number} centerHeight
 * @param {number} bottomHeight
 * @param {number} zoomOffset
 * @returns {Object} label width and height
 */
function getOuterLabelDimensions(
  container,
  top,
  center,
  bottom,
  topHeight,
  centerHeight,
  bottomHeight,
  zoomOffset
) {
  let reqHeight = 0;
  let reqWidth = 0;
  let allowText;
  let allowIcon;
  const ganttCommonService = this;
  const configuration = container.configuration;
  container.context.font =
    zoomOffset !== 1
      ? ganttCommonService.getTextOffset(configuration.fontStyle, zoomOffset)
      : configuration.fontStyle;
  if (container.preference === 'both') {
    allowText = true;
    allowIcon = true;
  } else {
    allowText = !configuration.override;
    allowIcon = !!configuration.override;
  }

  if (
    allowText &&
    configuration.text !== undefined &&
    configuration.text != null &&
    configuration.text !== ''
  ) {
    const fontArgs = container.context.font.split(' ');
    const fontPx = fontArgs[fontArgs.length - 2].split('px');
    configuration.textWidth = container.context.measureText(
      configuration.text
    ).width;
    configuration.textHeight = parseInt(fontPx[0], 10);
    reqWidth += configuration.textWidth;
    reqHeight += configuration.textHeight;
  }
  if (
    allowIcon &&
    configuration.icon !== undefined &&
    configuration.icon != null &&
    configuration.icon !== ''
  ) {
    const iconDimensions = ganttCommonService.getIconDimensions(configuration);
    reqWidth +=
      iconDimensions.width * zoomOffset + configuration.iconDimensions.hOffset;
    reqHeight +=
      iconDimensions.height * zoomOffset + configuration.iconDimensions.vOffset;
  }
  reqWidth += container.widthSpacingFactor;
  reqHeight += container.heightSpacingFactor;

  switch (configuration.position) {
    case 'OUT_TOP_LEFT':
      {
        if (top.outLeft < reqWidth) {
          top.outLeft = reqWidth;
        }
        if (topHeight < reqHeight) {
          topHeight = reqHeight;
        }
      }
      break;
    case 'OUT_CENTER_LEFT':
      {
        if (center.outLeft < reqWidth) {
          center.outLeft = reqWidth;
        }
        if (centerHeight < reqHeight) {
          centerHeight = reqHeight;
        }
      }
      break;
    case 'OUT_BOTTOM_LEFT':
      {
        if (bottom.outLeft < reqWidth) {
          bottom.outLeft = reqWidth;
        }
        if (bottomHeight < reqHeight) {
          bottomHeight = reqHeight;
        }
      }
      break;
    case 'OUT_TOP_RIGHT':
      {
        if (top.outRight < reqWidth) {
          top.outRight = reqWidth;
        }
        if (topHeight < reqHeight) {
          topHeight = reqHeight;
        }
      }
      break;
    case 'OUT_CENTER_RIGHT':
      {
        if (center.outRight < reqWidth) {
          center.outRight = reqWidth;
        }
        if (centerHeight < reqHeight) {
          centerHeight = reqHeight;
        }
      }
      break;
    case 'OUT_BOTTOM_RIGHT':
      {
        if (bottom.outRight < reqWidth) {
          bottom.outRight = reqWidth;
        }
        if (bottomHeight < reqHeight) {
          bottomHeight = reqHeight;
        }
      }
      break;
    default:
  }

  const maxLeftWidth = Math.max(top.outLeft, center.outLeft, bottom.outLeft);
  const maxRightWidth = Math.max(
    top.outRight,
    center.outRight,
    bottom.outRight
  );
  const maxHeight = topHeight + centerHeight + bottomHeight;
  return {
    leftWidth: maxLeftWidth,
    rightWidth: maxRightWidth,
    height: maxHeight,
  };
}

/**
 * Need description
 *
 * @param {Object}
 */
function setIconImage(image) {
  iconImage = image;
}

/**
 * Need description
 *
 * @param {Object}
 */
function drawImage(context, icon, startX, startY, zoomOffset) {
  const dim = context.iconDimensions;
  const width = dim.width * zoomOffset;
  const height = dim.height * zoomOffset;
  const x = startX / zoomOffset;
  const y = startY / zoomOffset;
  if (iconImage) {
    context.drawImage(
      iconImage,
      dim.x,
      dim.y,
      dim.sw,
      dim.sh,
      startX,
      startY,
      width,
      height
    );
  }
}

/**
 * Utility function to draw icons inside bar.
 *
 * @param {Object} context - canvas context
 * @param {Enum} icon - [neo_triangle, neo_leftTriangle, neo_rightTriangle, neo_rectangle, neo_circle]
 * @param {number} startX
 * @param {number} startY
 * @param {number} zoomOffset
 */
function drawIcon(context, icon, startX, startY, zoomOffset) {
  if (icon && icon !== '') {
    switch (icon) {
      case 'neo_triangle':
        {
          this.drawTriangle(
            context.fillStyle,
            context.strokeStyle,
            context,
            startX,
            startY - context.iconDimensions.height,
            startX + context.iconDimensions.width,
            startY + context.iconDimensions.height,
            startX - context.iconDimensions.width,
            startY + context.iconDimensions.height,
            zoomOffset
          );
        }
        break;
      case 'neo_leftTriangle':
        {
          this.drawTriangle(
            context.fillStyle,
            context.strokeStyle,
            context,
            startX - context.iconDimensions.width,
            startY - context.iconDimensions.height,
            startX - context.iconDimensions.width,
            startY + context.iconDimensions.height,
            startX,
            startY,
            zoomOffset
          );
        }
        break;
      case 'neo_rightTriangle':
        {
          this.drawTriangle(
            context.fillStyle,
            context.strokeStyle,
            context,
            startX,
            startY,
            startX + context.iconDimensions.width,
            startY + context.iconDimensions.height,
            startX + context.iconDimensions.width,
            startY - context.iconDimensions.height,
            zoomOffset
          );
        }
        break;
      case 'neo_rectangle':
        {
          this.drawRectangle(
            context.fillStyle,
            context.strokeStyle,
            context,
            startX - 2,
            startY - 2,
            context.iconDimensions.width,
            context.iconDimensions.height,
            zoomOffset
          );
        }
        break;
      case 'neo_circle':
        {
          this.drawCircle(
            context.fillStyle,
            context.strokeStyle,
            context,
            startX,
            startY,
            context.iconDimensions.width / 2,
            zoomOffset
          );
        }
        break;
      default: {
        this.drawImage(context, icon, startX, startY, zoomOffset);
      }
    }
  }
}

/**
 * Utility function to draw labels inside bar based on the space available and position priority.
 *
 *
 * @param {Object} data - data has priority
 * @param {Object} context - Canvas context
 * @param {Object} plot - chronos plot
 */
function drawLabels(data, context, plot) {
  // function to configure entity label positions
  const label = data.label;
  const cellPadding = data.skipCellPadding ? 0 : 3;
  let barWidth = data.width - cellPadding * 2;
  let barHeight = data.height - cellPadding * 2;
  const ganttCommonService = this;
  let maxLabelDimensions;
  let currentPreference = 'both';
  const draw = true;
  context.save();
  context.translate(data.left + cellPadding, data.top + cellPadding);

  if (barWidth < 0) {
    barWidth = -barWidth;
  }
  if (barHeight < 0) {
    barHeight = -barHeight;
  }

  context.fillStyle = '#000000';
  context.font = '8px Arial';
  if (data.leftFlag) {
    const textWidth = context.measureText('<< ').width;
    if (barWidth > textWidth) {
      ganttCommonService.drawText(context, '<< ', 'top', 'start', 0, 0);
    }
    context.translate(textWidth, 0);
    barWidth -= textWidth;
    data.leftFlag = false;
  }

  if (data.rightFlag) {
    const textWidth = context.measureText(' >>').width;
    if (barWidth > textWidth) {
      ganttCommonService.drawText(context, ' >>', 'top', 'end', barWidth, 0);
    }
    barWidth -= textWidth;
    data.rightFlag = false;
  }

  const top = {
    left: 0,
    middle: 0,
    right: 0,
  };
  const center = {
    left: 0,
    middle: 0,
    right: 0,
  };
  const bottom = {
    left: 0,
    middle: 0,
    right: 0,
  };
  const leftHeight = {
    topHeight: 0,
    centerHeight: 0,
    bottomHeight: 0,
  };
  const middleHeight = {
    topHeight: 0,
    centerHeight: 0,
    bottomHeight: 0,
  };
  const rightHeight = {
    topHeight: 0,
    centerHeight: 0,
    bottomHeight: 0,
  };

  const spotsArray = [];

  // eslint-disable-next-line guard-for-in
  for (const priority in label) {
    const configuration = label[priority];
    maxLabelDimensions = ganttCommonService.getLabelDimensions(
      {
        configuration,
        context,
        preference: currentPreference,
        widthSpacingFactor: data.widthSpacingFactor,
        heightSpacingFactor: 2,
        barWidth,
        barHeight,
      },
      top,
      center,
      bottom,
      leftHeight,
      middleHeight,
      rightHeight,
      data.zoomOffset,
      cellPadding
    );

    if (
      maxLabelDimensions.width >= barWidth ||
      maxLabelDimensions.height >= barHeight
    ) {
      currentPreference = 'anyOne';
      maxLabelDimensions = ganttCommonService.getLabelDimensions(
        {
          configuration,
          context,
          preference: currentPreference,
          widthSpacingFactor: data.widthSpacingFactor,
          heightSpacingFactor: 2,
          barWidth,
          barHeight,
        },
        top,
        center,
        bottom,
        leftHeight,
        middleHeight,
        rightHeight,
        data.zoomOffset,
        cellPadding
      );
    }

    if (
      maxLabelDimensions.drawable &&
      maxLabelDimensions.width < barWidth &&
      maxLabelDimensions.height < barHeight
    ) {
      const text = configuration.text;
      const icon = configuration.icon;
      let allowText;
      let allowIcon;
      if (currentPreference === 'both') {
        allowText = !(text == null || text === undefined || text === '');
        allowIcon = true;
      } else {
        allowText = !(
          configuration.override ||
          text == null ||
          text === undefined ||
          text === ''
        );
        allowIcon = !!configuration.override;
      }
      context.fillStyle = configuration.color || '#000000';
      if (allowIcon) {
        context.strokeStyle = configuration.hemColor || '#000000';
        context.iconDimensions = ganttCommonService.getIconDimensions(
          configuration
        );
      }
      if (
        configuration.textWidth == null ||
        configuration.textWidth === undefined
      )
        configuration.textWidth = 0;
      if (
        configuration.textHeight == null ||
        configuration.textHeight === undefined
      )
        configuration.textHeight = 0;

      let startX = cellPadding;
      let startY = cellPadding;
      const currHeight = Math.max(
        configuration.iconDimensions.height,
        configuration.textHeight
      );
      const currWidth =
        configuration.textWidth + configuration.iconDimensions.width;

      switch (configuration.position) {
        case 'TOP_LEFT':
          {
            if (allowText)
              ganttCommonService.drawText(context, text, 'top', 'start', 0, 0);
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                configuration.textWidth + configuration.iconDimensions.hOffset,
                configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
          }
          break;
        case 'CENTER_LEFT':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'middle',
                'start',
                0,
                Math.floor(barHeight / 2)
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                configuration.textWidth + configuration.iconDimensions.hOffset,
                Math.floor(
                  (barHeight - configuration.iconDimensions.height) / 2
                ) + configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            startY = (barHeight - currHeight) / 2;
          }
          break;
        case 'BOTTOM_LEFT':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'bottom',
                'start',
                0,
                barHeight
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                configuration.textWidth + configuration.iconDimensions.hOffset,
                barHeight -
                  configuration.iconDimensions.height +
                  configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            startY = barHeight - currHeight;
          }
          break;
        case 'TOP_CENTER':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'top',
                'center',
                barWidth / 2,
                0
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                barWidth / 2 +
                  configuration.textWidth +
                  configuration.iconDimensions.hOffset,
                configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            startX = barWidth / 2;
          }
          break;
        case 'CENTER':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'middle',
                'center',
                barWidth / 2,
                Math.floor(barHeight / 2)
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                barWidth / 2 +
                  configuration.textWidth +
                  configuration.iconDimensions.hOffset,
                Math.floor(
                  (barHeight - configuration.iconDimensions.height) / 2
                ) + configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            // eslint-disable-next-line no-unused-expressions
            // eslint-disable-next-line no-sequences
            (startX = barWidth / 2), (startY = (barHeight - currHeight) / 2);
          }
          break;
        case 'BOTTOM_CENTER':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'bottom',
                'center',
                barWidth / 2,
                barHeight
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                barWidth / 2 +
                  configuration.textWidth +
                  configuration.iconDimensions.hOffset,
                barHeight -
                  configuration.iconDimensions.height +
                  configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            // eslint-disable-next-line no-unused-expressions
            // eslint-disable-next-line no-sequences
            (startX = barWidth / 2), (startY = barHeight - currHeight);
          }
          break;
        case 'TOP_RIGHT':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'top',
                'end',
                barWidth,
                0
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                barWidth -
                  (configuration.textWidth +
                    configuration.iconDimensions.width) +
                  configuration.iconDimensions.hOffset,
                configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            startX = barWidth - currWidth;
          }
          break;
        case 'CENTER_RIGHT':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'middle',
                'end',
                barWidth,
                Math.floor(barHeight / 2)
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                barWidth -
                  (configuration.textWidth +
                    configuration.iconDimensions.width) +
                  configuration.iconDimensions.hOffset,
                Math.floor(
                  (barHeight - configuration.iconDimensions.height) / 2
                ) + configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            // eslint-disable-next-line no-unused-expressions
            // eslint-disable-next-line no-sequences
            (startX = barWidth - currWidth),
              (startY = (barHeight - currHeight) / 2);
          }
          break;
        case 'BOTTOM_RIGHT':
          {
            if (allowText)
              ganttCommonService.drawText(
                context,
                text,
                'bottom',
                'end',
                barWidth,
                barHeight
              );
            if (allowIcon)
              ganttCommonService.drawIcon(
                context,
                icon,
                barWidth -
                  (configuration.textWidth +
                    configuration.iconDimensions.width) +
                  configuration.iconDimensions.hOffset,
                barHeight -
                  configuration.iconDimensions.height +
                  configuration.iconDimensions.vOffset,
                data.zoomOffset
              );
            startX = barWidth - currWidth;
            startY = barHeight - currHeight;
          }
          break;
        default:
      }
      if (
        configuration.spotId &&
        configuration.spotId !== '' &&
        (data.dataToDraw.eachTask || data.dataToDraw.labelInfo)
      ) {
        spotsArray.push({
          spotId: configuration.spotId,
          startX,
          endX: startX + currWidth * data.zoomOffset,
          startY,
          endY: startY + currHeight * data.zoomOffset,
        });
      }
    } else {
      ganttCommonService.removeLabelDimensions(
        configuration,
        data.widthSpacingFactor,
        0,
        top,
        center,
        bottom,
        leftHeight,
        middleHeight,
        rightHeight,
        data.zoomOffset
      );
    }
  }
  const taskData = data.dataToDraw.eachTask
    ? data.dataToDraw.eachTask
    : data.dataToDraw.labelInfo;
  if (spotsArray.length > 0 && taskData) {
    let assignSpots = true;
    if (taskData.spots && isEqual(taskData.spots, spotsArray)) {
      assignSpots = false;
    }
    if (assignSpots) {
      taskData.spots = spotsArray;
    }
  }
  context.restore();
}

/**
 * Utility function to draw outer left labels to bar based on space availibility.
 *
 * @param {Object} data
 * @param {Object} context - Canvas Context
 * @param {Object} plot - Chronos plot
 * @param {Object} pObj - previous object
 */
function drawOuterLeftLabels(data, context, plot, pObj) {
  // function to configure entity label positions
  if (!Object.keys(data.leftOuterLabel).length) {
    return;
  }
  const label = data.leftOuterLabel;
  let barWidth = data.width;
  let barHeight = data.height;
  const ganttCommonService = this;
  const plotVal = plot;
  let maxLabelDimensions;
  let currentPreference = 'both';
  const draw = true;
  const currentTask = data.dataToDraw.eachTask;
  context.save();
  context.translate(data.left, data.top);

  if (barWidth < 0) {
    barWidth = -barWidth;
  }
  if (barHeight < 0) {
    barHeight = -barHeight;
  }

  let previousObj = null;
  const nextObj = null;
  let prevSpace = 999;
  const nextSpace = 999;

  try {
    plot.focusedItem = currentTask;
    if (pObj) {
      previousObj = pObj;
    } else {
      previousObj = plot.findPreviousObject(
        currentTask.rowId,
        currentTask.start,
        { checkYValue: currentTask.yValue },
        false
      ); // On-demand fetch is not required.
    }
    plot.focusedItem = null;
    if (previousObj && previousObj.chronosId === currentTask.chronosId) {
      previousObj = null;
    }

    if (previousObj) {
      prevSpace =
        plot.getCanvasPixelForTimeWidth(currentTask.start) -
        plot.getCanvasPixelForTimeWidth(previousObj.end);
    }

    if (data.left > 0) {
      prevSpace += data.left;
    }

    const top = {
      outLeft: 0,
      outRight: 0,
    };
    const center = {
      outLeft: 0,
      outRight: 0,
    };
    const bottom = {
      outLeft: 0,
      outRight: 0,
    };
    const topHeight = 0;
    const centerHeight = 0;
    const bottomHeight = 0;

    // eslint-disable-next-line guard-for-in
    for (const priority in label) {
      const configuration = label[priority];
      maxLabelDimensions = ganttCommonService.getOuterLabelDimensions(
        {
          configuration,
          context,
          preference: currentPreference,
          widthSpacingFactor: data.widthSpacingFactor,
          heightSpacingFactor: 0,
        },
        top,
        center,
        bottom,
        topHeight,
        centerHeight,
        bottomHeight,
        data.zoomOffset
      );

      if (
        maxLabelDimensions.leftWidth >= prevSpace ||
        maxLabelDimensions.height >= barHeight
      ) {
        currentPreference = 'anyOne';
        maxLabelDimensions = ganttCommonService.getOuterLabelDimensions(
          {
            configuration,
            context,
            preference: currentPreference,
            widthSpacingFactor: data.widthSpacingFactor,
            heightSpacingFactor: 0,
          },
          top,
          center,
          bottom,
          topHeight,
          centerHeight,
          bottomHeight,
          data.zoomOffset
        );
      }

      if (
        maxLabelDimensions.leftWidth < prevSpace &&
        maxLabelDimensions.height < barHeight &&
        ganttCommonService.isNotWrap(plotVal, 'left', currentTask)
      ) {
        const { text } = configuration;
        const { icon } = configuration;
        let allowText;
        let allowIcon;
        if (currentPreference === 'both') {
          // eslint-disable-next-line no-unused-expressions
          // eslint-disable-next-line no-sequences
          (allowText = !(text == null || text === undefined || text === '')),
            (allowIcon = true);
        } else {
          // eslint-disable-next-line no-unused-expressions
          (allowText = !(
            configuration.override ||
            text == null ||
            text === undefined ||
            text === ''
          )),
            // eslint-disable-next-line no-sequences
            (allowIcon = !!configuration.override);
        }
        context.fillStyle = configuration.color || '#000000';
        if (allowIcon) {
          context.strokeStyle = configuration.hemColor || '#000000';
          context.iconDimensions = ganttCommonService.getIconDimensions(
            configuration
          );
        }
        if (
          configuration.textWidth == null ||
          configuration.textWidth === undefined
        )
          configuration.textWidth = 0;
        if (
          configuration.textHeight == null ||
          configuration.textHeight === undefined
        )
          configuration.textHeight = 0;
        switch (configuration.position) {
          case 'OUT_TOP_LEFT':
            {
              if (allowText)
                ganttCommonService.drawText(
                  context,
                  text,
                  'top',
                  'end',
                  0 - 1,
                  0
                );
              if (allowIcon)
                ganttCommonService.drawIcon(
                  context,
                  icon,
                  configuration.textWidth +
                    configuration.iconDimensions.hOffset,
                  configuration.textHeight +
                    configuration.iconDimensions.vOffset,
                  data.zoomOffset
                );
            }
            break;
          case 'OUT_CENTER_LEFT':
            {
              if (allowText)
                ganttCommonService.drawText(
                  context,
                  text,
                  'middle',
                  'end',
                  0 - 1,
                  barHeight / 2
                );
              if (allowIcon)
                ganttCommonService.drawIcon(
                  context,
                  icon,
                  configuration.textWidth +
                    configuration.iconDimensions.hOffset,
                  barHeight / 2 +
                    configuration.textHeight +
                    configuration.iconDimensions.vOffset,
                  data.zoomOffset
                );
            }
            break;
          case 'OUT_BOTTOM_LEFT':
            {
              if (allowText)
                ganttCommonService.drawText(
                  context,
                  text,
                  'bottom',
                  'end',
                  0 - 1,
                  barHeight
                );
              if (allowIcon)
                ganttCommonService.drawIcon(
                  context,
                  icon,
                  configuration.textWidth +
                    configuration.iconDimensions.hOffset,
                  barHeight +
                    configuration.textHeight +
                    configuration.iconDimensions.vOffset,
                  data.zoomOffset
                );
            }
            break;
        }
      }
    }
  } finally {
    context.restore();
  }
}

/**
 * Utility function to draw outer right label.
 *
 * @param {Object} data
 * @param {Object} context - canvas context
 * @param {Object} plot - chronos plot
 * @param {Object} nObj
 * @param {Object} moduleName
 */
function drawOuterRightLabels(data, context, plot, nObj, moduleName) {
  // function to configure entity label positions
  if (!Object.keys(data.rightOuterLabel).length) {
    return;
  }
  const label = data.rightOuterLabel;
  let barWidth = data.width;
  let barHeight = data.height;
  const ganttCommonService = this;
  const plotVal = plot;
  let maxLabelDimensions;
  let currentPreference = 'both';
  const draw = true;
  const currentTask = data.dataToDraw.eachTask;
  context.save();
  context.translate(data.left, data.top);

  if (barWidth < 0) {
    barWidth = -barWidth;
  }
  if (barHeight < 0) {
    barHeight = -barHeight;
  }

  const previousObj = null;
  let nextObj = null;
  const prevSpace = 999;
  let nextSpace = 999;
  let nextObjectConfiguration = null;

  try {
    plot.focusedItem = currentTask;
    if (nObj) {
      nextObj = nObj;
    } else {
      nextObj = plot.findNextObject(
        currentTask.rowId,
        currentTask.end,
        { checkYValue: currentTask.yValue },
        false
      );
    }
    plot.focusedItem = null;
    if (nextObj && nextObj.chronosId === currentTask.chronosId) {
      nextObj = null;
    }
    let nextObjLeftLabelWidth = 0;
    let getNextObjectLeftOuterLabelDimentions = function(
      // eslint-disable-next-line no-shadow
      nextObjectConfiguration,
      obj
    ) {
      const nextObjectLeftLabelWidth = 0;
      const nextTop = {
        outLeft: 0,
        outRight: 0,
      };
      const nextCenter = {
        outLeft: 0,
        outRight: 0,
      };
      const nextBottom = {
        outLeft: 0,
        outRight: 0,
      };
      const nextTopHeight = 0;
      const nextCenterHeight = 0;
      const nextBottomHeight = 0;
      let nextObjLabelDimentions = null;
      if (nextObjectConfiguration) {
        const nextObjectLabel = nextObjectConfiguration.outLeftLabel;
        currentPreference = 'both';
        // eslint-disable-next-line guard-for-in
        for (const priority in nextObjectLabel) {
          const configuration = nextObjectLabel[priority];
          nextObjLabelDimentions = ganttCommonService.getOuterLabelDimensions(
            {
              configuration,
              context,
              preference: currentPreference,
              widthSpacingFactor: data.widthSpacingFactor,
              heightSpacingFactor: 0,
            },
            nextTop,
            nextCenter,
            nextBottom,
            nextTopHeight,
            nextCenterHeight,
            nextBottomHeight,
            data.zoomOffset
          );
        }
      }
      return nextObjLabelDimentions;
    };

    if (nextObj) {
      nextSpace =
        plot.getCanvasPixelForTimeWidth(nextObj.start) -
        plot.getCanvasPixelForTimeWidth(currentTask.end);
      nextObjectConfiguration = ganttCommonService.getConfiguration(
        nextObj,
        moduleName
      );
      const nextObjDimention = getNextObjectLeftOuterLabelDimentions(
        nextObjectConfiguration,
        nextObj
      );
      nextObjLeftLabelWidth = nextObjDimention ? nextObjDimention.leftWidth : 0;
    }

    const top = {
      outLeft: 0,
      outRight: 0,
    };
    const center = {
      outLeft: 0,
      outRight: 0,
    };
    const bottom = {
      outLeft: 0,
      outRight: 0,
    };
    const topHeight = 0;
    const centerHeight = 0;
    const bottomHeight = 0;

    // eslint-disable-next-line guard-for-in
    for (const priority in label) {
      const configuration = label[priority];
      maxLabelDimensions = ganttCommonService.getOuterLabelDimensions(
        {
          configuration,
          context,
          preference: currentPreference,
          widthSpacingFactor: data.widthSpacingFactor,
          heightSpacingFactor: 0,
        },
        top,
        center,
        bottom,
        topHeight,
        centerHeight,
        bottomHeight,
        data.zoomOffset
      );

      if (
        maxLabelDimensions.rightWidth + nextObjLeftLabelWidth >= nextSpace ||
        maxLabelDimensions.height >= barHeight
      ) {
        currentPreference = 'anyOne';
        maxLabelDimensions = ganttCommonService.getOuterLabelDimensions(
          {
            configuration,
            context,
            preference: currentPreference,
            widthSpacingFactor: data.widthSpacingFactor,
            heightSpacingFactor: 0,
          },
          top,
          center,
          bottom,
          topHeight,
          centerHeight,
          bottomHeight,
          data.zoomOffset
        );
      }

      if (
        maxLabelDimensions.rightWidth + nextObjLeftLabelWidth < nextSpace &&
        maxLabelDimensions.height < barHeight &&
        ganttCommonService.isNotWrap(plotVal, 'right', currentTask)
      ) {
        const { text } = configuration;
        const { icon } = configuration;
        let allowText;
        let allowIcon;
        if (currentPreference === 'both') {
          // eslint-disable-next-line no-unused-expressions
          // eslint-disable-next-line no-sequences
          (allowText = !(text == null || text === undefined || text === '')),
            (allowIcon = true);
        } else {
          // eslint-disable-next-line no-unused-expressions
          // eslint-disable-next-line no-sequences
          (allowText = !configuration.override),
            (allowIcon = !!configuration.override);
        }
        context.fillStyle = configuration.color || '#000000';
        if (allowIcon) {
          context.strokeStyle = configuration.hemColor || '#000000';
          context.iconDimensions = ganttCommonService.getIconDimensions(
            configuration
          );
        }
        if (
          configuration.textWidth == null ||
          configuration.textWidth === undefined
        )
          configuration.textWidth = 0;
        if (
          configuration.textHeight == null ||
          configuration.textHeight === undefined
        )
          configuration.textHeight = 0;
        switch (configuration.position) {
          case 'OUT_TOP_RIGHT':
            {
              if (allowText)
                ganttCommonService.drawText(
                  context,
                  text,
                  'top',
                  'start',
                  barWidth + 1,
                  0
                );
              if (allowIcon)
                ganttCommonService.drawIcon(
                  context,
                  icon,
                  configuration.textWidth +
                    barWidth +
                    1 +
                    configuration.iconDimensions.hOffset,
                  configuration.textHeight +
                    configuration.iconDimensions.vOffset,
                  data.zoomOffset
                );
            }
            break;
          case 'OUT_CENTER_RIGHT':
            {
              if (allowText)
                ganttCommonService.drawText(
                  context,
                  text,
                  'middle',
                  'start',
                  barWidth + 1,
                  barHeight / 2
                );
              if (allowIcon)
                ganttCommonService.drawIcon(
                  context,
                  icon,
                  configuration.textWidth +
                    barWidth +
                    1 +
                    configuration.iconDimensions.hOffset,
                  barHeight / 2 +
                    configuration.textHeight +
                    configuration.iconDimensions.vOffset,
                  data.zoomOffset
                );
            }
            break;
          case 'OUT_BOTTOM_RIGHT':
            {
              if (allowText)
                ganttCommonService.drawText(
                  context,
                  text,
                  'bottom',
                  'start',
                  barWidth + 1,
                  barHeight
                );
              if (allowIcon)
                ganttCommonService.drawIcon(
                  context,
                  icon,
                  configuration.textWidth +
                    barWidth +
                    1 +
                    configuration.iconDimensions.hOffset,
                  barHeight +
                    configuration.textHeight +
                    configuration.iconDimensions.vOffset,
                  data.zoomOffset
                );
            }
            break;
        }
      }
    }
  } finally {
    context.restore();
  }
}

/**
 * Need description
 *
 * @param {Object, Object, Object, Object}
 */
function selectEnities(allPlot, rowIds, startTime, endTime) {
  each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      const itemsMap = plot.getDataMap();
      let selectedIds;
      each(itemsMap, function(item, key) {
        if (
          contains(rowIds, item.rowId) &&
          startTime <= item.start &&
          endTime > item.end
        )
          plot.addTaskByUserToHighlightList(item);
      });
      plot.drawHighLightOverlay();
    }
  });
}

/**
 * Utility function used to draw text.
 *
 * @param {Object} context
 * @param {String} text
 * @param {} textBaseline
 * @param {String} textAlign
 * @param {number} left
 * @param {number} top
 */
function drawText(context, text, textBaseline, textAlign, left, top) {
  context.textBaseline = textBaseline;
  context.textAlign = textAlign;
  context.fillText(text, left, top);
}

/**
 * @description
 *
 * Function for vertical zoom
 *
 * From here we actullly invoke chronos setupGrid and draw to redraw the gantt based on updated zoomObject.
 *
 * @param {Array} allPlot
 * @param {Object} zoomObject -Updated zoom object from overallZoom
 * @param {String} pageid
 * @param {boolean} singleRowSplit - false - For split
 */
function verticalZoom(allPlot, zoomObject, pageid, singleRowSplit) {
  const rCount = zoomObject.zoomRowCount;
  const ganttCommonService = this;
  if (!singleRowSplit) {
    each(allPlot, function(plot) {
      if (plot.constructor.name === 'Chronos') {
        if (
          Object.keys(plot).length > 0 &&
          plot.getPlaceholder().height() > 0
        ) {
          let minHeight = 0;
          const height = plot.height();
          const options = plot.getOptions();
          if (height > paneMinHeight) {
            // maximise or minimise action will set paneMinHeight to 1 in layout
            // minHeight = (height + plot.getAxes().xaxis.labelHeight + options.grid.axisMargin) / rCount;
            minHeight = height / rCount;
          } else {
            minHeight = paneMinHeight / rCount;
            /* var prevObject = ganttCommonService.getZoomConfig(pageid, plot.getPlotLabel());
                              if(prevObject) {
                                minHeight = prevObject.paneHeight / rCount;
                              } */
          }
          options.series.gantt.minTickHeight = minHeight;
          // options.series.gantt.maxTotalRows = rCount;
          if (options.multiScreenFeature.enabled) {
            options.multiScreenFeature.zoomDirection = 'vertical';
          }
          if (minHeight > paneMinHeight) {
            zoomObject.minTickHeight = minHeight;
          }
          zoomObject.paneHeight = plot.getPlaceholder().height();
          ganttCommonService.setZoomConfig(
            zoomObject,
            pageid,
            plot.getPlotLabel()
          );
          plot.setupGrid();
          plot.draw();
        }
      }
    });
  } else {
    const totalHeight = allPlot[0].height() + allPlot[1].height();
    let customZoomObject = ganttCommonService.getCustomZoomObject(pageid);
    if (!customZoomObject) {
      return;
    }
    let totalRows = customZoomObject.zoomRowCount;
    const rHeight = totalHeight / totalRows;
    for (let i = 0; i < allPlot.length; i++) {
      const minHeight = rHeight;
      const options = allPlot[i].getOptions();
      options.series.gantt.minTickHeight = minHeight;
      if (options.multiScreenFeature.enabled) {
        options.multiScreenFeature.zoomDirection = 'vertical';
      }
      if (minHeight > paneMinHeight) {
        zoomObject.minTickHeight = minHeight;
      }
      zoomObject.paneHeight = allPlot[i].getPlaceholder().height();
      ganttCommonService.setZoomConfig(
        zoomObject,
        pageid,
        allPlot[i].getPlotLabel()
      );
      allPlot[i].setupGrid();
      allPlot[i].draw();
    }
    ganttCommonService.updateSplitPaneHeight(allPlot);
  }
}

/**
 * Need description
 *
 * @param {Object, Object, Object}
 * @returns {Object}
 */
function drawConnectionLine(plot, inputConnection, mappingObject) {
  const connectionIds = [];
  const connectionsList = [];
  const ganttCommonService = this;
  each(inputConnection, function(connection, key) {
    const nodeList = [];
    let conName = '';
    each(connection.nodes, function(node, nodeKey) {
      conName = `${conName}-${node[mappingObject.id]}`;

      const startDate =
        Number(node[mappingObject.start]) === node[mappingObject.start]
          ? node[mappingObject.start]
          : ganttCommonService.getTimeOnDST(node[mappingObject.start]);
      const endDate =
        Number(node[mappingObject.end]) === node[mappingObject.end]
          ? node[mappingObject.end]
          : ganttCommonService.getTimeOnDST(node[mappingObject.end]);
      nodeList.push({
        taskId: node[mappingObject.id] + mappingObject.ganttItemType,
        shouldDisplayDetail: false,
        drawOnTop: node.drawOnTop,
        taskObjectData: {
          rowId: node[mappingObject.rowId],
          start: startDate,
          end: endDate,
          ganttItemType: mappingObject.ganttItemType,
          dataObject: node,
        },
      });
    });
    const connId = connection[mappingObject.connType] + conName;
    connectionIds.push(connId);
    connectionsList.push({
      id: connId,
      data: connection[mappingObject.nodePos],
      nodes: nodeList,
      status: connection.status,
    });
  });
  plot.addNodeConnections(connectionsList);
  plot.setupGrid();
  plot.draw();
  return connectionIds;
}

/**
 * Need description
 *
 * @param {Object, Object, Object}
 */
function removeConnectionLine(plot, connections, restrictDraw) {
  // eslint-disable-next-line guard-for-in
  for (const id in connections) {
    plot.removeNodeConnections(connections[id]);
  }
  if (!restrictDraw) {
    plot.setupGrid();
    plot.draw();
  }
}

/**
 * Need description
 * @param {Object} extraParams
 */
function addConfigToLocalStore(extraParams) {
  if (extraParams.key && extraParams.key.startsWith('iflight_')) {
    $.putInLocalStore(extraParams.key, extraParams.value, true);
  } else {
    console.error('Invalid key for local store configuration');
  }
}

/**
 * Need description
 * @param {Object} min
 * @param {Object} max
 * @param {Object} customData
 */
function capXaxisInitialViewRangeForMultiscreen(min, max, customData) {
  var obj = [min, max];
  var screens = $.getFromLocalStore('s');
  var sId = $.getFromSessionStore('sId');
  var screenId = sId ? sId[customData.key] : null;
  var config, start, end;
  if ((screenId == undefined || screenId == null) && screens != undefined) {
    var totalConfig = Object.keys(screens).length;
    for (var i = totalConfig; i > 0; i--) {
      var ganttConfig = Object.keys(screens[i - 1]).length;
      for (var j = 0; j < ganttConfig; j++) {
        if (screens[i - 1][j].customData.key == customData.key) {
          config = screens[i - 1][j].dateRange;
          start = config.end;
          end = start + (config.end - config.start);
          obj = [start, end];
        }
      }
    }
  } else if (screenId) {
    var ganttConfig = Object.keys(screens[screenId - 1]).length;
    for (var i = 0; i < ganttConfig; i++) {
      if (screens[screenId - 1][i].customData.key == customData.key) {
        config = screens[screenId - 1][i].dateRange;
        start = config.end;
        end = start + (config.end - config.start);
        obj = [start, end];
      }
    }
  }
  return obj;
}

/**
 * Need description
 * @param {Object} plot
 * @param {Object} dragObject
 */
function dragEndSuccessCallback(plot, dragObject) {
  // This method needs to be permenantly removed later
  const updateTask = { data: dragObject.dragItems };
  // plot.removeTasksFromBucket(updateTask);
}

/**
 * Need description
 * @param {Object} key
 */
function getConfigFromLocalStore(key) {
  var config;
  if (key) {
    config = $.getFromLocalStore('iF' + '_' + key);
  }
  return config;
}

/**
 * Need description
 * @param {Object} extraParams
 */
function putConfigToLocalStore(extraParams) {
  if (extraParams.key) {
    $.putInLocalStore('iF' + '_' + extraParams.key, extraParams.value, true);
  }
}

/**
 * Need description
 * @param {Object} plot
 * @param {String} plotLabel
 * @param {Object} extraParams
 * @param {Object} override
 */
function updateMultiscreen(plot, plotLabel, extraParams, override) {
  var extraParam = $.getFromLocalStore(extraParams.key);
  var currentParam = {};
  if (plot) {
    var customData = plot.getOptions().multiScreenFeature.customData;
    if (extraParam) {
      for (var i = 0; i <= Object.keys(extraParam).length; i++) {
        if (Object.keys(extraParam)[i] == customData.key) {
          currentParam = Object.values(extraParam)[i];
        }
      }
      currentParam[plotLabel] = extraParams.value;
      extraParam[customData.key] = currentParam;
      $.putInLocalStore(extraParams.key, extraParam, override);
    }
  }
}

/**
 * Need description
 * @param {Object} key
 * @param {String} value
 * @param {Object} customData
 * @param {String} plotLabel
 * @param {Object} override
 */
function setGanttExtraParams(key, value, customData, plotLabel, override) {
  if (customData && key && value) {
    var extraParam = {};
    extraParam[plotLabel] = value;
    var extraparams = {};
    extraparams[customData.key] = extraParam;
    $.putInLocalStore(key, extraparams, override);
  }
}

/**
 * Need description
 *
 * @param {Object} allPlot
 */
function goToCurrentDate(allPlot) {
  // fucntion for goto current date feature
  const ganttCommonService = this;
  $.each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      if (Object.keys(plot).length > 0) {
        const dateTimeVal = getDate();
        const dateVal = new Date(
          `${dateTimeVal.getUTCMonth() +
            1}/${dateTimeVal.getUTCDate()}/${dateTimeVal.getUTCFullYear()} 00:00:00`
        );
        const dateValMS = ganttCommonService.getTimeOnDST(dateVal);
        const viewValue = plot.horizontalScrollBar.getViewValues();
        const axisValues = plot.horizontalScrollBar.getAxisValues();
        let startDate;
        let endDate;
        const range = viewValue.maxViewValue - viewValue.minViewValue;
        startDate = dateValMS;
        endDate = startDate + range;
        if (
          startDate >= axisValues.minAxisValue &&
          endDate <= axisValues.maxAxisValue
        ) {
          plot.scrollToDateRangePosition(startDate, endDate);
        } else if (startDate < axisValues.minAxisValue) {
          startDate = axisValues.minAxisValue;
          endDate = startDate + range;
          plot.scrollToDateRangePosition(startDate, endDate);
        } else if (endDate > axisValues.maxAxisValue) {
          endDate = axisValues.maxAxisValue;
          startDate = endDate - range;
          plot.scrollToDateRangePosition(startDate, endDate);
        }
      }
    }
  });
}

/**
 * Need description
 *
 * @param {Object, Object}
 */
function goToAnyDate(allPlot, dateVal) {
  // fucntion for goto any date feature
  const ganttCommonService = this;
  each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      if (Object.keys(plot).length > 0) {
        const dateValMS = ganttCommonService.getTimeOnDST(dateVal);
        const viewValue = plot.horizontalScrollBar.getViewValues();
        const axisValues = plot.horizontalScrollBar.getAxisValues();
        let startDate;
        let endDate;
        const range = viewValue.maxViewValue - viewValue.minViewValue;
        startDate = dateValMS;
        endDate = startDate + range;
        if (
          startDate >= axisValues.minAxisValue &&
          endDate <= axisValues.maxAxisValue
        ) {
          plot.scrollToDateRangePosition(startDate, endDate);
        } else if (startDate < axisValues.minAxisValue) {
          startDate = axisValues.minAxisValue;
          endDate = startDate + range;
          plot.scrollToDateRangePosition(startDate, endDate);
        } else if (endDate > axisValues.maxAxisValue) {
          endDate = axisValues.maxAxisValue;
          startDate = endDate - range;
          plot.scrollToDateRangePosition(startDate, endDate);
        }
      }
    }
  });
}

/**
 * Need description
 * @param {String} moduleName
 */
function isMultiscreenEnabled(moduleName) {
  const ganttConfiguration = ds.getData('app', 'ganttConfiguration', null, {
    id: this.pageId,
  });
  var multiscreenEnabled =
    ganttConfiguration[moduleName].enableMultiScreen.toLowerCase() == 'true'
      ? true
      : false;
  if (window.loadGantt && !window.linkage) {
    multiscreenEnabled = false;
  }
  return multiscreenEnabled;
}

/**
 * Need description
 * @param {Object} paneObjArr
 * @param {Boolean} isTree
 * @param {Boolean} isSplit
 */
function getCurrentPaneObject(paneObjArr, isTree, isSplit) {
  if (paneObjArr == undefined || paneObjArr == null) {
    return;
  }
  var currPlot = isSplit ? paneObjArr[2] : paneObjArr[0];
  if (
    isSplit &&
    paneObjArr[3] &&
    paneObjArr[3].constructor.name == 'Chronos' &&
    isTree
  ) {
    currPlot = paneObjArr[3];
  } else if (
    paneObjArr[1] &&
    paneObjArr[1].constructor.name == 'Chronos' &&
    isTree
  ) {
    currPlot = paneObjArr[1];
  }
  return currPlot;
}
/**
 * Need description
 * @param {String} ngModel
 */
// TODO Check if required
function isSplitPane(ngModel) {
  return ngModel.substr(ngModel.length - 5) == 'split' ? true : false;
}

/**
 * Need description
 * @param {Object} scope
 * @param {Object} ngModel
 * @param {Object} plot
 */
function hideSplitPane(scope, ngModel, plot) {
  // Code to remove split pane
  if (ngModel && Object.keys(ngModel).length > 0) {
    var uniqueID = ngModel.paneId.substring(
      0,
      ngModel.paneId.indexOf('_split')
    );
    ngModel.initData = null;
    if (angular.element("iflight-gantt[id='" + uniqueID + "_split']").scope()) {
      angular
        .element("iflight-gantt[id='" + uniqueID + "_split']")
        .scope()
        .$destroy();
    }
    $("iflight-gantt[id='" + uniqueID + "_split']").remove();
    $('#' + uniqueID + ' div.ui-ganttArea-container').css('height', '100%');
    $('#' + uniqueID + ' div.ui-ganttArea-container').removeClass('split');
    $('#' + uniqueID + ' div.ui-ganttArea-container').resize();
  }
  plot.setXAxisOptions('showLabel', true);
  var key = scope.pageid + '_' + 'isSplitDone';
  if (ganttViews[key]) {
    ganttViews[key].value = false;
  }
  setTimeout(function() {
    scope.$apply();
    plot.setupGrid();
    plot.draw();
  });
}

/**
 * Need description
 * @param {Object} key
 * @param {Object} plot
 */
function getGanttExtraParam(key, plot) {
  if (plot && $.getFromLocalStore(key)) {
    var customData = plot.getOptions().multiScreenFeature.customData;
    var plotLabel = plot.getPlotLabel();
    return $.getFromLocalStore(key)[customData.key][plotLabel];
  }
}

/**
 * Need description
 * @param {Boolean} splitFocused
 * @param {String} pageid
 * @param {String} plotLabel
 */
function setSplitPaneFocused(splitFocused, pageid, plotLabel) {
  if (!splitPaneStatus[pageid]) {
    splitPaneStatus[pageid] = {};
    splitPaneStatus[pageid][plotLabel] = splitFocused;
  } else {
    splitPaneStatus[pageid][plotLabel] = splitFocused;
  }
}

/**
 * Need description
 * @param {String} pageid
 * @param {String} plotLabel
 */
function isSplitPaneFocused(pageid, plotLabel) {
  if (splitPaneStatus[pageid] && splitPaneStatus[pageid][plotLabel]) {
    return splitPaneStatus[pageid][plotLabel];
  } else {
    return false;
  }
}

/**
 * Need description
 *
 * @param {Object}
 * @returns {Object}
 */
function getAllRowIds(plot) {
  const rowIds = $.merge([], plot.getSeries().rowHeaderIds);
  return rowIds;
}

/**
 * Need description
 * @param {Object} RTUObj
 */
function updatePane(RTUObj, scope, doublelineEnabled) {
  const currPaneObj = RTUObj.plot;
  const series = currPaneObj.getSeries();
  const { taskIdProviderCallBack } = series.gantt;
  currPaneObj.startBatchUpdate();
  const headerInsert =
    RTUObj.headersToInsert && Object.keys(RTUObj.headersToInsert).length > 0;
  const headerDelete =
    RTUObj.headersToRemove && RTUObj.headersToRemove.length > 0;
  const headerUpdate =
    RTUObj.headersToAddOrUpdate && RTUObj.headersToAddOrUpdate.length > 0;
  const itemsRemove = RTUObj.itemsToRemove && RTUObj.itemsToRemove.length > 0;
  const itemUpdate =
    RTUObj.itemsToAddOrUpdate && RTUObj.itemsToAddOrUpdate.length > 0;
  if (doublelineEnabled) {
    const doubleLineTypes = currPaneObj.getDoubleLineTypes();
    if (itemUpdate) {
      const dataMap = RTUObj.itemsToAddOrUpdate.reduce(function(map, data) {
        if (contains(doubleLineTypes, data.ganttItemType)) {
          const chronosId = taskIdProviderCallBack(data);
          map[chronosId] = data;
        }
        return map;
      }, {});
      const rowObjMap = {};
      for (let row in RTUObj.headersToInsert) {
        const rowObj = RTUObj.headersToInsert[row];
        rowObjMap[rowObj.rowId] = rowObj;
      }
      const paneArr = series.rootTreeNode ? [{}, currPaneObj] : [currPaneObj];
      const doubleLines = this.createDoubleLines(
        scope.pageid,
        dataMap,
        doubleLineTypes,
        paneArr
      );
      this.setDoubleLineRows(
        scope.pageid,
        doubleLines.norRowList,
        doubleLines.treeRowList
      );
      const rowsToRemoveOnUpdate = doubleLines.oldRows;
      if (rowsToRemoveOnUpdate && rowsToRemoveOnUpdate.length > 0) {
        if (!RTUObj.headersToRemove) {
          RTUObj.headersToRemove = [];
        }
        const headerDelete = true;
        RTUObj.headersToRemove = RTUObj.headersToRemove.concat(
          rowsToRemoveOnUpdate
        );
      }
      const rowsToInsert = series.rootTreeNode
        ? doubleLines.treeNewRows
        : doubleLines.norNewRows;
      let rowObjList = series.rowIdRowObjectMap;
      let headerObj;
      let currHeaderObj;
      $.each(rowsToInsert, function(index, rowId) {
        currHeaderObj = rowObjMap[rowId] || rowObjList[rowId];
        if (currHeaderObj && currHeaderObj.data) {
          currHeaderObj = currHeaderObj.data;
        }
        if (currHeaderObj) {
          headerObj = $.extend({}, currHeaderObj);
          headerObj.rowId = rowId + '^';
          headerObj.doubleLine = true;
          if (!RTUObj.headersToInsert) {
            RTUObj.headersToInsert = {};
          }
          const headerInsert = true;
          RTUObj.headersToInsert[rowId] = headerObj;
        } else {
          console.log('Unable to find row object on pane update for ', rowId);
        }
      });
    }
    const doubleLineRows = this.getDoubleLineRows(scope.pageid);
    const currDoubleLines = series.rootTreeNode
      ? doubleLineRows.treeRowList
      : doubleLineRows.norRowList;
    const removeRows = [];
    if (currDoubleLines && (headerDelete || itemsRemove || headerUpdate)) {
      let dataMap;
      if (itemsRemove) {
        dataMap = RTUObj.itemsToRemove.reduce(function(map, data) {
          if (contains(doubleLineTypes, data.ganttItemType)) {
            const chronosId = taskIdProviderCallBack(data);
            map[chronosId] = data;
          }
          return map;
        }, {});
      }
      for (let rowId in currDoubleLines) {
        const itemIdList = currDoubleLines[rowId];
        const removeItems = [];
        if (headerDelete && RTUObj.headersToRemove.indexOf(rowId) !== -1) {
          RTUObj.headersToRemove.push(rowId + '^');
          removeRows.push(rowId);
        }
        if (headerUpdate) {
          for (
            let index = 0;
            index < RTUObj.headersToAddOrUpdate.length;
            index++
          ) {
            const newHeader = RTUObj.headersToAddOrUpdate[index];
            if (newHeader.rowId === rowId) {
              const headerObj = $.extend(
                {},
                RTUObj.headersToAddOrUpdate.indexOf(rowId)
              );
              headerObj.rowId = rowId + '^';
              RTUObj.headersToAddOrUpdate.push(headerObj);
            }
          }
        }
        if (itemsRemove && dataMap && Object.keys(dataMap).length > 0) {
          if (!RTUObj.headersToRemove) {
            RTUObj.headersToRemove = [];
          }
          for (let index = 0; index < itemIdList.length; index++) {
            const itemId = itemIdList[index];
            if (dataMap[itemId]) {
              removeItems.push(itemId);
            }
          }

          if (removeItems.length > 0) {
            for (let index = 0; index < removeItems.length; index++) {
              const removeItem = removeItems[index];
              const itemIndex = itemIdList.indexOf(removeItem);
              if (itemIndex !== -1) {
                itemIdList.splice(itemIndex, 1);
              }
            }
            if (itemIdList.length === 0) {
              RTUObj.headersToRemove.push(rowId + '^');
              removeRows.push(rowId);
              if (!headerDelete) {
                const headerDelete = true;
              }
            }
            const removeItems = [];
          }
        }
      }
      for (let index = 0; index < removeRows.length; index++) {
        const removeRow = removeRows[index];
        if (currDoubleLines[removeRow]) {
          delete currDoubleLines[removeRow];
        }
      }
      this.setDoubleLineRows(
        scope.pageid,
        doubleLineRows.norRowList,
        doubleLineRows.treeRowList
      );
    }
  }
  if (headerInsert) {
    const isRowHeaders = currPaneObj.getSeries().rowHeaderIds.length > 0;
    if (isRowHeaders) {
      // eslint-disable-next-line guard-for-in
      for (let pos in RTUObj.headersToInsert) {
        const DTO = RTUObj.headersToInsert[pos];
        if (currPaneObj.getSeries().rowHeaderIds.indexOf(DTO.rowId) !== -1) {
          delete currPaneObj.getSeries().rowHeaderIds[pos];
        }
        currPaneObj.insertRowAfter(pos, DTO);
      }
    }
    if (!isRowHeaders) {
      const headerIds = [];
      // eslint-disable-next-line guard-for-in
      for (let pos in RTUObj.headersToInsert) {
        headerIds.push(RTUObj.headersToInsert[pos].rowId);
      }
      const loadPeriodEndDate = ds.getData('app', 'loadPeriodEndDate', null, {
        id: this.pageId,
      });
      const loadPeriodStartDate = ds.getData(
        'app',
        'loadPeriodStartDate',
        null,
        { id: this.pageId }
      );
      currPaneObj.resetRowColumnDataRangeForGantt(headerIds, [
        loadPeriodStartDate,
        loadPeriodEndDate,
      ]);
    }
  }
  if (headerDelete) {
    currPaneObj.deleteRowFromGantt(RTUObj.headersToRemove);
  }

  const addOrUpdateObj = {};
  if (itemUpdate) {
    addOrUpdateObj.data = RTUObj.itemsToAddOrUpdate;
  }
  if (headerUpdate) {
    addOrUpdateObj.rowHeaders = RTUObj.headersToAddOrUpdate;
  }
  if (Object.keys(addOrUpdateObj).length > 0) {
    currPaneObj.addNewTasksAndRowHeadersToBucket(addOrUpdateObj);
  }
  if (itemsRemove) {
    currPaneObj.removeTasksFromBucket({ data: RTUObj.itemsToRemove });
  }
  currPaneObj.endBatchUpdate();
}

/**
 * To resize pane
 *
 * @param {Object}
 */
function resizePane(plot) {
  const resizeScrollbar = function(scrollbar) {
    if (scrollbar) {
      scrollbar.resizeScrollCanvas();
      scrollbar.drawScrollBar();
      scrollbar.redrawScrollBox();
    }
  };
  if (
    plot &&
    plot.constructor.name === 'Chronos' &&
    plot.triggerResize &&
    isFunction(plot.triggerResize)
  ) {
    if (plot.getOptions().multiScreenFeature.enabled) {
      $.putInLocalStore('sUpdtdBy', $.getFromSessionStore('sId'), true);
    }
    plot.triggerResize();
    resizeScrollbar(plot.horizontalScrollBar);
    resizeScrollbar(plot.verticalScrollBar);
  }
}

/**
 * @description
 *
 * To update horizontal zoom
 *
 * @param {Array} allPlot
 * @param {Object} zoomObject -The updated zoom object from overallZom
 * @param {boolean} excludeTime
 * @param {string} pageid
 */
function zoomCalc(allPlot, zoomObject, excludeTime, pageid) {
  // fucntion for horizontal zoom based on zoom level and a value
  const ganttCommonService = this;
  each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      const axisValues = plot.horizontalScrollBar.getAxisValues();
      const year = zoomObject.dateVal.getFullYear();
      const month = zoomObject.dateVal.getMonth();
      const date = zoomObject.dateVal.getDate();
      const hour = zoomObject.dateVal.getHours();
      let start = zoomObject.dateVal;
      if (excludeTime) {
        start.setHours(0, 0, 0, 0);
      }
      let end = new Date(year, month, 1);
      if (!excludeTime) {
        end.setHours(hour);
        end.setMinutes(zoomObject.dateVal.getMinutes());
        end.setSeconds(zoomObject.dateVal.getSeconds());
      }
      ganttCommonService.setTimeScrollUnit(plot, zoomObject.zoomTo);
      if (typeof zoomObject.zoomLevel === 'string') {
        zoomObject.zoomLevel = parseFloat(zoomObject.zoomLevel);
      }
      const getDaysInMonth = function(year, month) {
        const isLeapYear =
          (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        return [
          31,
          isLeapYear ? 29 : 28,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ][month];
      };
      const zoomLevelHours =
        24 * (zoomObject.zoomLevel - Math.floor(zoomObject.zoomLevel));
      if (zoomObject.zoomTo === 'days') {
        end.setDate(date + Math.floor(zoomObject.zoomLevel));
        end.setHours(hour + zoomLevelHours);
      } else if (zoomObject.zoomTo === 'weeks') {
        end.setDate(date + Math.floor(zoomObject.zoomLevel * 7));
      } else if (zoomObject.zoomTo === 'months') {
        const currDate = start.getDate();
        const initMonth = month + Math.floor(zoomObject.zoomLevel);
        const initDays =
          Math.min(
            currDate,
            getDaysInMonth(start.getFullYear(), start.getMonth())
          ) + Math.floor((zoomObject.zoomLevel * 30) % 30);
        if (initDays >= 30) {
          const finMonth = initMonth + Math.floor(initDays / 30);
          const finDays = initDays % 30;
          end.setMonth(finMonth);
          end.setDate(finDays);
        } else {
          end.setMonth(initMonth);
          end.setDate(initDays);
        }
      } else if (zoomObject.zoomTo === 'hours') {
        end.setDate(date);
        end.setHours(hour + zoomObject.zoomLevel);
      }
      start = ganttCommonService.getTimeOnDST(start);
      end = ganttCommonService.getTimeOnDST(end);
      if (start < axisValues.minAxisValue) {
        end += axisValues.minAxisValue - start;
        start = axisValues.minAxisValue;
      }
      if (end > axisValues.maxAxisValue) {
        start -= end - axisValues.maxAxisValue;
        end = axisValues.maxAxisValue;
      }
      zoomObject.paneHeight = plot.getPlaceholder().height();
      ganttCommonService.setZoomConfig(zoomObject, pageid, plot.getPlotLabel());
      plot.scrollToDateRangePosition(start, end);
    }
  });
}

/**
 * Need description
 *
 * @param {Object, Object, Integer}
 */
function dayZoomerCalc(allPlot, zoomObject, pageid) {
  // utility method for day zoom
  const ganttCommonService = this;
  each(allPlot, function(plot) {
    if (plot.constructor.name === 'Chronos') {
      zoomObject.paneHeight = plot.getPlaceholder().height();
      ganttCommonService.horZoomToVisibleRange(plot, zoomObject.zoomLevel);
      ganttCommonService.setZoomConfig(zoomObject, pageid, plot.getPlotLabel());
    }
  });
}

/**
 * Need description
 *
 * @param {Object, Object}
 */
function horZoomToVisibleRange(plot, days) {
  // utility method for horizontal zoom
  if (Object.keys(plot).length > 0) {
    const viewValue = plot.horizontalScrollBar.getViewValues();
    const MILLISECS_IN_A_DAY = 86400000;
    const startDate = viewValue.minViewValue;
    const endDate = startDate + days * MILLISECS_IN_A_DAY;
    plot.scrollToDateRangePosition(startDate, endDate);
  }
}

/**
 * Need description
 *
 * @param {Integer}
 * @returns {Object}
 */
function getSelectedItems(pageId) {
  return selectedItems[pageId];
}

/**
 * Need description
 *
 * @param {Integer, Object, Object}
 */
function setSelectedItems(pageId, pane, selectedList) {
  if (!selectedItems[pageId]) {
    selectedItems[pageId] = {
      data: [],
      multiPane: false,
      currPane: null, // for keeping the last pane
    };
  }
  selectedItems[pageId].data[pane] = selectedList;
  if (
    selectedItems[pageId].currPane !== null &&
    selectedItems[pageId].currPane !== pane
  ) {
    selectedItems[pageId].multiPane = true;
  }
  selectedItems[pageId].currPane = pane;
}

/**
 * Need description
 *
 * @param {Integer}
 */
function clearSelectedItems(pageId) {
  selectedItems[pageId] = null;
}

/**
 * Need description
 * @param {Object} cbData
 * @param {String} pageId
 */
function addToClipboard(cbData, pageId) {
  var cbCtxt = ds.getData('app', 'clipboardContext', null, { id: pageId });
  var currentData = cbCtxt.dataMap[pageId];

  var addedItems;
  // If clipboard have dataMap already
  if (currentData) {
    addedItems = checkDuplicatesAndAddDataInClipboard(cbData, currentData);
  } else {
    // create clipboard dataMap for the gantt
    cbCtxt.dataMap[pageId] = {
      lwId: cbData.lwId,
      cbData: cbData,
    };
    addedItems = cbData;
  }

  // If clipboard is open, notify the clipboard
  var cbPageId = cbCtxt.pageMap[pageId];
  if (cbPageId && addedItems.length > 0) {
    var cbEvent = {
      pageId: cbPageId,
      type: 'Add',
      cbData: addedItems,
    };
    iFlightMCastEventBus.emitEvent('ClipBoardEvent', cbEvent);
  }
}

/**
 * Need description
 * @param {Object} cbData
 * @param {String} pageId
 */
function updateClipboardData(cbData, pageId) {
  var cbCtxt = ds.getData('app', 'clipboardContext', null, { id: pageId });
  var currentData = cbCtxt.dataMap[pageId];
  var addedItems = null;
  if (currentData) {
    addedItems = checkDuplicatesAndAddDataInClipboard(cbData, currentData);
  }
  return addedItems;
}

/**
 * Need description
 * @param {Object} cbData
 * @param {String} pageId
 */
function removeFromClipboard(cbData, pageId) {
  var cbCtxt = ds.getData('app', 'clipboardContext', null, { id: pageId });
  var cbPageId;
  for (var parentPageId in cbCtxt.pageMap) {
    if (cbCtxt.pageMap[parentPageId] === pageId) {
      cbPageId = parentPageId;
      break;
    }
  }
  var currentData = cbCtxt.dataMap[cbPageId];
  removeDataFromClipboard(cbData, currentData);
}

/**
 * Need description
 * @param {String} pageId
 */
function isClipboardPage(pageId) {
  const isClipboard = ds.getData('app', 'isClipboard', null, { id: pageId });
  return isClipboard(pageId);
}

/**
 * Get clipboard page id for the parent gantt
 * @param {String} ganttPageId
 */
function getClipboardPageId(ganttPageId) {
  const clipboardContext = ds.getData('app', 'clipboardContext', null, {
    id: ganttPageId,
  });
  return clipboardContext.pageMap[ganttPageId];
}

/**
 * Get parent gantt page id for a clipboard
 * @param {String} cbPageId
 */
function getClipboardParentPageId(cbPageId) {
  var cbCtxt = ds.getData('app', 'clipboardContext', null, { id: cbPageId });
  for (var pageMapId in cbCtxt.pageMap) {
    if (cbCtxt.pageMap[pageMapId] === cbPageId) {
      return pageMapId;
    }
  }
}

/**
 * Need description
 */
function getRWClipboardPageIds() {
  const clipboardContext = ds.getData('app', 'clipboardContext', null, {
    id: this.pageId,
  });
  return clipboardContext.rwGanttIds;
}

/**
 * Gets data added for the clipboard by passing the page id. If isParentPage arg is true,
 * pageId passed is considered as parent page id;otherwise it is considered as clipboard page id
 * @param {String} pageId
 * @param {String} isParentPage
 */
function getClipboardData(pageId, isParentPage) {
  var cbCtxt = ds.getData('app', 'clipboardContext', null, { id: pageId });
  var parentPageId;
  if (isParentPage) {
    parentPageId = pageId;
  } else {
    for (var id in cbCtxt.pageMap) {
      if (cbCtxt.pageMap[id] === pageId) {
        parentPageId = id;
        break;
      }
    }
  }
  return clipboardContext.dataMap[parentPageId];
}

/**
 * Need description
 * @param {Object} scope
 */
function expandSplitNode(scope) {
  var plotArray = scope.paneObjArr;
  if (plotArray.length > 2) {
    var currPaneObj = this.getCurrentPaneObject(plotArray, true, true);
    if (
      currPaneObj
        .getPlaceholder()
        .attr('id')
        .indexOf('_split') != -1
    ) {
      // var currPaneObj = plotArray[index];
      currPaneObj.setupGrid();
      currPaneObj.draw();
      var rowHeaderObjects = currPaneObj.getSeries().rowHeaderObjects,
        splitRowId =
          rowHeaderObjects[rowHeaderObjects.length - 1].parentNode.rowId;
      currPaneObj.expandNodeWithRowId(splitRowId);
      currPaneObj.scrollToPosition(
        currPaneObj.currentVisibleData.fromDate,
        scope.ganttDataResponse.customOptions.splitRowId
      );
    }
  }
}

/**
 * Need description
 *
 * @param {Object}
 */
function enableRotateCursor(plot) {
  // to enable rotation mode of cursor
  plot.getPlaceholder().css('cursor', 'progress');
}

/**
 * Need description
 *
 * @param {Object}
 */
function disableRotateCursor(plot) {
  // to disable rotation mode of cursor
  plot.setEventMode('NONE');
  plot.getPlaceholder().css('cursor', 'default');
}

/**
 * Need description
 * @param {String} module
 * @returns {Integer}
 */
function getMaxZoomOutLevel(module) {
  const oneDay = 24 * 3600 * 1000; // timeInMilliSeconds for one day
  const ganttConfigs = ds.getData('app', 'ganttConfiguration', null, {
    id: this.pageId,
  });
  const loadPeriodEndDate = ds.getData('app', 'loadPeriodEndDate', null, {
    id: this.pageId,
  });
  const loadPeriodStartDate = ds.getData('app', 'loadPeriodStartDate', null, {
    id: this.pageId,
  });
  const totalDaysInLoadPeriod =
    (loadPeriodEndDate + 1000) / oneDay - loadPeriodStartDate / oneDay; // 1000 millisecond is added to loadPeriodEnd date since the end time given will be 11:59:59,to make it 12:00:00 inorder to get exact number of days in loadPeriod
  const maxZoomOutDays = ganttConfigs[module].maxZoomOutDays
    ? parseInt(ganttConfigs[module].maxZoomOutDays, 10)
    : 30; // 30 days default maximiumZoomOutDays
  return totalDaysInLoadPeriod > maxZoomOutDays
    ? maxZoomOutDays
    : totalDaysInLoadPeriod; // totaldays in the loaded period is taken as maximum zoomout level when configured maxZoomOutDays exceeds totalzoomout level
}

/**
 * Need description
 * @param {String} module
 * @returns {Integer}
 */
function getMinZoomInLevel(module) {
  const minAllowableLimit = 0.25; // 6 hours kept as limit considering clear column header and item label rendering
  const ganttConfigs = ds.getData('app', 'ganttConfiguration', null, {
    id: this.pageId,
  });
  const minZoomInDays = ganttConfigs[module].minZoomInDays
    ? parseFloat(ganttConfigs[module].minZoomInDays)
    : 1; // 1 day default minimumZoomInDay
  if (minZoomInDays < minAllowableLimit) {
    const minZoomInDays = minAllowableLimit;
  }
  return minZoomInDays;
}

/**
 * Need description
 */
function ganttDataFetchErrorHandler() {
  // A wrapper error handler for gantt data fetch
  spinnerService.unblock();
}

/**
 * Gets data to be added to the clipboard by looking at the selected/highlighted items in gantt
 * @param {Object} paneObj
 * @param {Object} data
 * @param {Boolean} isHeader
 * @param {String} pageid
 * @param {Boolean} isSubTask
 */
function getDataSelectedForClipBoard(
  paneObj,
  data,
  isHeader,
  pageid,
  isSubTask
) {
  var dataList = [];
  var selectedItems = isHeader
    ? paneObj.getAllRowHighlights()
    : paneObj.getAllHighlights();
  if (selectedItems) {
    if (isHeader) {
      for (var i = 0; i < selectedItems.length; i++) {
        dataList.push(paneObj.getRowHeaderObject(selectedItems[i]));
      }
    } else {
      dataList = selectedItems;
    }
  }

  // Insert New data id not already present
  var insertNewData = function(
    paneObj,
    data,
    isHeader,
    pageid,
    isSubTask,
    dataList
  ) {
    if (data === Object(data)) {
      var id,
        series = paneObj.getSeries(),
        rowIdAttribute = series.gantt.rowIdAttribute,
        taskIdCallBack = series.gantt.taskIdProviderCallBack;

      if (isHeader) {
        id = data[rowIdAttribute];
        if (id && !paneObj.getRowHeaderObject(id)) {
          dataList.push(data);
        }
      } else if (isSubTask) {
        dataList.push(data);
      } else {
        if (taskIdCallBack) {
          id = taskIdCallBack(data);
        } else {
          id = data.id;
        }
        if (id && !paneObj.getTaskById(id)) {
          dataList.push(data);
        }
      }
    }
  };

  if (Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      var singleItem = data[i];
      insertNewData(paneObj, singleItem, isHeader, pageid, isSubTask, dataList);
    }
  } else {
    insertNewData(paneObj, data, isHeader, pageid, isSubTask, dataList);
  }

  if (!isHeader && isSubTask) {
    var selectedSubTasks = this.getAllGanttSubTasks(
        pageid,
        paneObj.getPlotLabel()
      ),
      changeIdList = [];
    for (var i = 0; i < dataList.length; i++) {
      var item = dataList[i],
        id = item.id;
      if (selectedSubTasks[id]) {
        changeIdList.push(i);
      }
    }
    for (var j = 0; j < changeIdList.length; j++) {
      var pos = changeIdList[j];
      dataList.splice(pos, 1);
    }
  }

  return dataList;
}

/**
 * Need description
 *
 * @param {Integer, Integer, Object, Integer}
 */
function setGanttSubTask(eachTaskId, pageId, pane, taskId) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (!ganttSubTasks[contextId]) {
    ganttSubTasks[contextId] = {};
    ganttSubTasks[contextId][pane] = {};
    ganttSubTasks[contextId][pane][taskId] = [];
  } else if (!ganttSubTasks[contextId][pane]) {
    ganttSubTasks[contextId][pane] = {};
    ganttSubTasks[contextId][pane][taskId] = [];
  } else if (!ganttSubTasks[contextId][pane][taskId]) {
    ganttSubTasks[contextId][pane][taskId] = [];
  }
  const index = ganttSubTasks[contextId][pane][taskId].indexOf(eachTaskId);
  if (index !== -1) {
    delete ganttSubTasks[contextId][pane][taskId][index];
  } else {
    ganttSubTasks[contextId][pane][taskId].push(eachTaskId);
  }
  ds.addData('app', 'ganttSubTasks', this.pageId, ganttSubTasks);
  $.putInLocalStore('g_subT', ganttSubTasks, true);
}

/**
 * Need description
 *
 * @param {Integer}
 * @returns {Array}
 */
// eslint-disable-next-line consistent-return
function getAllSubTasks(pageId) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (ganttSubTasks[contextId]) {
    return ganttSubTasks[contextId];
  }
}

/**
 * Need description
 *
 * @param {Integer, Object}
 * @returns {Array} else null
 */
function getAllGanttSubTasks(pageId, pane) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (ganttSubTasks[contextId] && ganttSubTasks[contextId][pane]) {
    return ganttSubTasks[contextId][pane];
  } else {
    return null;
  }
}

/**
 * Need description
 *
 * @param {Integer, Object}
 * @returns {Array} else null
 */
function getSubTasksSelected(pageId, pane, parentId, context) {
  const contextId = context ? context : this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (
    ganttSubTasks[contextId] &&
    ganttSubTasks[contextId][pane] &&
    ganttSubTasks[contextId][pane][parentId]
  ) {
    return ganttSubTasks[contextId][pane][parentId];
  } else {
    return null;
  }
}

/**
 * Need description
 *
 * @param {Integer, Object, Integer}
 * @returns {Boolean}
 */
function isSubTasksSelected(pageId, pane, parentId) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (
    ganttSubTasks[contextId] &&
    ganttSubTasks[contextId][pane] &&
    ganttSubTasks[contextId][pane][parentId] &&
    ganttSubTasks[contextId][pane][parentId].length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Need description
 *
 * @param {Integer, Object, Integer, Integer}
 * @returns {Boolean}
 */
function isSelectedGanttSubTask(pageId, pane, parentId, childChronosId) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (
    ganttSubTasks[contextId] &&
    ganttSubTasks[contextId][pane] &&
    ganttSubTasks[contextId][pane][parentId] &&
    ganttSubTasks[contextId][pane][parentId].indexOf(childChronosId) !== -1
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Need description
 *
 * @param {Integer, Object, Integer}
 */
function removeSubTasks(pageId, pane, parentId) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (
    ganttSubTasks[contextId] &&
    ganttSubTasks[contextId][pane] &&
    ganttSubTasks[contextId][pane][parentId] &&
    ganttSubTasks[contextId][pane][parentId].length > 0
  ) {
    delete ganttSubTasks[contextId][pane][parentId];
  }
  $.putInLocalStore('g_subT', ganttSubTasks, true);
}

/**
 * Need description
 *
 * @param {Integer, Object}
 */
function clearGanttSubTasks(pageId, pane) {
  const contextId = this.getGanttContext(pageId);
  const subTasks = $.getFromLocalStore('g_subT');
  if (subTasks && subTasks.length > 0) {
    ganttSubTasks = subTasks;
  }
  if (pane && ganttSubTasks[contextId] && ganttSubTasks[contextId][pane])
    ganttSubTasks[contextId][pane] = null;
  else if (!pane) {
    ganttSubTasks[contextId] = null;
  }
  $.putInLocalStore('g_subT', ganttSubTasks, true);
}

/**
 * Need description
 * @param {String} pageID
 * @param {Object} ngModel
 * @returns {Boolean}
 */
function isSinglePane(pageID, ngModel) {
  const paneID = ngModel.customOptions.uniqueID;
  const panes = iflightGanttLayout.getAllPanesStatus(pageID);
  for (const pos in panes) {
    if (!panes[pos].hidden && panes[pos].id !== paneID) {
      return false;
    }
  }
  return true;
}

/**
 * Need description
 * @param {Object} paneObjArr
 */
function removeSplitPaneObjects(paneObjArr) {
  var paneArr = $.grep(paneObjArr, function(element, index) {
    return (
      element
        .getPlaceholder()
        .attr('id')
        .indexOf('_split') == -1
    );
  });
  return paneArr;
}

/**
 * Need description
 */
function getRulerData() {
  return rulerData;
}

/**
 * Need description
 *
 * @param {*} newRulerData
 */
function setRulerData(newRulerData) {
  rulerData = newRulerData;
}

/**
 * Need description
 */
function clearRulerData() {
  rulerData = null;
}

/**
 * Need description
 * @param {Boolean} isExpanded
 */
function setSplitNodeExpanded(isExpanded) {
  isSplitNodeExpanded = isExpanded;
}

/**
 * Need description
 */
function getSplitNodeExpanded() {
  return isSplitNodeExpanded;
}

/**
 * Need description
 * @param {Object} refData
 * @param {String} moduleName
 */
function setReferenceData(refData, moduleName) {
  referenceData[moduleName] = refData;
}

/**
 * Need description
 * @param {String} moduleName
 */
function getReferenceData(moduleName) {
  return referenceData[moduleName];
}

/**
 * Need description
 * @param {String} moduleName
 */
function clearReferenceData(moduleName) {
  referenceData[moduleName] = {};
}

/**
 * Need description
 *
 * @param {Object} scope
 */
function getPageTitle(scope) {
  return scope.pagesconfig.activepage.title;
}

/**
 * Need description
 *
 * @param {*} placeholder
 */
function registerViewPlaceholder(placeholder) {
  viewPlaceholder = placeholder;
}

/**
 * Need description
 *
 * @param {string} pageid
 * @param {string} title
 * @param {boolean} readOnly
 */
function setViewName(pageid, title, readOnly) {
  let element = $(`#${pageid}`).find(`#${viewPlaceholder}`);
  $(element).val(title);
  $(element).attr('title', title);
  if (readOnly !== undefined) {
    $(element).prop('readOnly', readOnly);
  }
  element = null;
}

/**
 * Need description
 *
 * @param {string} pageid
 * @param {string} title
 */
function setViewTitle(pageid, title) {
  $(`#${pageid}`)
    .find(`#${viewPlaceholder}`)
    .attr('title', title);
}

/**
 * Need description
 *
 * @param {string} pageid
 * @returns {string}
 */
function getViewName(pageid) {
  return $(`#${pageid}`)
    .find(`#${viewPlaceholder}`)
    .val();
}

/**
 * Need description
 * @param {String} pageid
 * @returns {Object}
 */
function getTopPane(pageid) {
  const panesStatus = iflightGanttLayout.getAllPanesStatus(pageid);
  let topPaneIndex = -1;
  for (const index in panesStatus) {
    if (panesStatus[index].hidden === false) {
      topPaneIndex = index;
      break;
    }
  }
  if (topPaneIndex !== -1) {
    return panesStatus[topPaneIndex].id;
  }
  return null;
}

/**
 * Need description
 * @param {String} pageId
 */
function getGanttContext(pageId) {
  const localWorldContext = ds.getData('app', 'localWorldContext', null, {
    id: pageId,
  });
  const lwIndex = localWorldContext.lwGanttIds.indexOf(pageId);
  let ganttContext;
  if (lwIndex !== -1) {
    ganttContext = this.getCurrentLWId(pageId);
  } else {
    const realWorldContext = ds.getData('app', 'realWorldContext', null, {
      id: pageId,
    });
    const rwIndex = realWorldContext.ganttTabIds.indexOf(pageId);
    if (rwIndex !== -1) {
      ganttContext = 'RW';
    } else {
      const clipboardContext = ds.getData('app', 'clipboardContext', null, {
        id: pageId,
      });
      const cbLWIndex = clipboardContext.lwGanttIds.indexOf(pageId);
      if (cbLWIndex !== -1) {
        const lwId = this.getCurrentLWId(pageId);
        ganttContext = 'CB_' + lwId;
      } else {
        const cbRWIndex = clipboardContext.rwGanttIds.indexOf(pageId);
        if (cbRWIndex !== -1) {
          ganttContext = 'CB_RW';
        }
      }
    }
  }
  return ganttContext;
}

/**
 * Need description
 * @param {Object} scope
 * @returns {Boolean}
 */
function overrideGanttViews(scope) {
  const currLWId = this.getCurrentLWId(scope.pageid);
  const localWorldContext = ds.getData('app', 'localWorldContext', null, {
    id: scope.pageid,
  });
  if (
    currLWId &&
    localWorldContext &&
    currLWId === localWorldContext.activeLW &&
    !localWorldContext.isExternalLoad
  ) {
    return true;
  }
  return false;
}

/**
 * Need description
 *
 * @param {Object} plot - chronos plot object
 */
function collapseAllRows(plot) {
  plot.collapseAllRows();
  let dateRangeMinValue = plot.horizontalScrollBar.getViewValues().minViewValue;
  let rowRangeMinValue = plot
    .getSeries()
    .yaxis.c2p(plot.currentLoadedData.yValueMin);
  if (plot.getOptions().multiScreenFeature.enabled) {
    const yAxisViewArea = plot.getMultiscreenYaxisViewArea();
    const xAxisViewArea = plot.getMultiscreenXaxisViewArea();
    if (xAxisViewArea) {
      dateRangeMinValue = xAxisViewArea.min;
    }
    if (yAxisViewArea) {
      rowRangeMinValue = yAxisViewArea.min;
    }
  }
  plot.scrollToPosition(dateRangeMinValue, rowRangeMinValue);
}

/**
 * Need description
 *
 * @param {Object} plot - chronos plot object
 */
function expandAllRows(plot) {
  plot.expandAllRows();
  let dateRangeMinValue = plot.horizontalScrollBar.getViewValues().minViewValue;
  let rowRangeMinValue = plot
    .getSeries()
    .yaxis.c2p(plot.currentLoadedData.yValueMin);
  if (plot.getOptions().multiScreenFeature.enabled) {
    const yAxisViewArea = plot.getMultiscreenYaxisViewArea();
    const xAxisViewArea = plot.getMultiscreenXaxisViewArea();
    if (xAxisViewArea) {
      dateRangeMinValue = xAxisViewArea.min;
    }
    if (yAxisViewArea) {
      rowRangeMinValue = yAxisViewArea.min;
    }
  }
  plot.scrollToPosition(dateRangeMinValue, rowRangeMinValue);
}

/**
 * @description
 *
 * To get zoom row count of one pane.
 *
 * @param {Object} plot - chronos plot or pane object
 * @param {Integer} totalZoomRowCount - total row count of visible area - This one is calculated in overAllZoom
 *                                    - If user set customZoomObj.zoomRowCount then it is passed here
 * @param {String} pageId - Eg W1
 * @returns {Integer}
 */
function getPaneZoomRowCount(plot, totalZoomRowCount, pageId) {
  let rowCount = totalZoomRowCount;
  let excludeTabularPane = true;
  let wrapperHeight = iflightGanttLayout.getWrapperHeight(
    pageId,
    null,
    excludeTabularPane
  );
  const scrollableObjects =
    plot.horizontalScrollBar.scrollableObjectsCollection;
  let columnHeaderHeight =
    scrollableObjects[0].getPlotLabel() === 'ColumnHeader'
      ? 0
      : scrollableObjects[0].getSeries().xaxis.labelHeight;
  if (columnHeaderHeight === 0) {
    for (let i = 1; i < scrollableObjects.length; i++) {
      if (
        columnHeaderHeight < scrollableObjects[i].getSeries().xaxis.labelHeight
      ) {
        columnHeaderHeight = scrollableObjects[i].getSeries().xaxis.labelHeight;
        break;
      }
    }
  }
  if (wrapperHeight) {
    const paneHeight =
      (plot.height() -
        plot.getAxes().xaxis.labelHeight +
        plot.getPlotOffset().top) /
      (wrapperHeight - columnHeaderHeight);
    const paneHeightPercent =
      (plot.height() + plot.getPlotOffset().top === wrapperHeight
        ? 1
        : paneHeight) * 100;
    if (totalZoomRowCount) {
      rowCount = totalZoomRowCount * (paneHeightPercent / 100);
    }
  }
  return rowCount;
}

/**
 * Setter function to set customZoomObject
 *
 * In iFlight  user can set date range and total rows to apply custome zoom.
 *
 * This function is used to sync the custome zoom object with the updated zoom object by overAllZoom.
 *
 * @param {string} dateVal
 * @param {number} zoomTo
 * @param {number} zoomLevel
 * @param {number} zoomRowCount
 * @param {number} zoomOffset
 * @param {string} pageId
 * @param {Object} metaInfo
 */
function setCustomZoomObject(
  dateVal,
  zoomTo,
  zoomLevel,
  zoomRowCount,
  zoomOffset,
  pageId,
  metaInfo
) {
  customZoomObject[pageId] = {
    dateVal,
    zoomTo,
    zoomLevel,
    zoomRowCount,
    zoomOffset,
    metaInfo,
  };
}

/**
 * Getter function to fetch customZoomObject
 *
 * @param {string} pageId
 * @returns {Object} customZoomObject
 */
function getCustomZoomObject(pageId) {
  return customZoomObject[pageId];
}

/**
 * @description
 *
 * Function which acn be used for custom zoom by giving specific data range and row or coloumn count
 * pane controller (in iFlight gantt toolbar controller)
 * It is used in iFlight only
 *
 * @param {Array} allPlot - Array of Plot objects of particular pane which is created in initPane
 * @param {number} currentPlotIndex - It is the index of current of allPlot object
 * @param {Object} zoomObject - It is a zoom object includes zoomDirection, rowZoomParameters, columnZoomParameters.
 * @param {String} pageId - eg-"W1"
 * @param {Object} zoomParameters - It us zoom object includes minTickHeight, zoomOffSet, zoomLevel etc
 * @param {boolean} singleRowSplit - It is boolean for Split functionality
 * @returns {Object}a zoomObject
 */
function applyCustomZoom(
  allPlot,
  currentPlotIndex,
  zoomObject,
  pageId,
  zoomParameters,
  singleRowSplit
) {
  let canProceed = true;
  const plotLabel = allPlot[currentPlotIndex].getPlotLabel();
  const zoomOffset = 1;
  // eslint-disable-next-line consistent-return
  $.each(allPlot, function(index, plot) {
    let elem = plot.getGanttFromPlot();
    const paneStatus = iflightGanttLayout.getPaneStatus(
      pageId,
      plot.getUniqueId(elem)
    );
    if (paneStatus && (paneStatus.hidden || paneStatus.isMinimized)) {
      canProceed = false;
      return false;
    }
  });

  if (!canProceed) return;

  const zoom = {};
  const customZoomObj = customZoomObject[pageId];
  zoom.zoomOffset = zoomObject.zoomOffset;
  zoom.zoomLevel = zoomObject.zoomLevel;
  zoom.dateVal = zoomObject.dateVal;
  zoom.zoomTo = zoomObject.zoomTo;
  zoom.paneHeight = allPlot[currentPlotIndex].getPlaceholder().height();

  if (
    (customZoomObj && customZoomObj.zoomRowCount === zoomObject.zoomRowCount) ||
    (customZoomObj && !zoomObject.zoomRowCount)
  ) {
    zoom.zoomRowCount = this.getPaneZoomRowCount(
      allPlot[currentPlotIndex],
      customZoomObj.zoomRowCount,
      pageId
    );
    zoom.zoomOffset = customZoomObj.zoomOffset;
  } else {
    zoom.zoomRowCount = this.getPaneZoomRowCount(
      allPlot[currentPlotIndex],
      zoomObject.zoomRowCount,
      pageId
    );
    zoom.zoomOffset = this.calcZoomOffset(
      zoom,
      pageId,
      plotLabel,
      zoomParameters
    );
  }

  this.zoomCalc(allPlot, zoom, zoomObject.excludeTime, pageId);
  this.goToAnyDate(allPlot, zoom.dateVal);
  this.verticalZoom(allPlot, zoom, pageId, singleRowSplit);
  this.setZoomConfig(zoom, pageId, plotLabel);
  this.setCustomZoomObject(
    zoomObject.dateVal,
    zoomObject.zoomTo,
    zoomObject.zoomLevel,
    zoomObject.zoomRowCount,
    zoom.zoomOffset,
    pageId
  );
  // eslint-disable-next-line consistent-return
  return zoom;
}

/**
 * Need description
 * @param {Object} plot
 * @param {String} pageId
 * @returns {Integer}
 */
function getTotalRowsCount(plot, pageId) {
  let scrollableObjects = plot.horizontalScrollBar.scrollableObjectsCollection;
  let totalRowCount = 0;
  let polledObjects = [];
  $.each(scrollableObjects, function(index, scrollableObject) {
    let elem = scrollableObject.getGanttFromPlot();
    let paneStatus = iflightGanttLayout.getPaneStatus(
      pageId,
      scrollableObject.getUniqueId(elem)
    );
    let options = scrollableObject.getOptions();
    if (
      paneStatus &&
      !paneStatus.hidden &&
      !paneStatus.isMinimized &&
      options.series.gantt.minTickHeight > 0 &&
      scrollableObject.height() > paneMinHeight &&
      scrollableObject.getPlaceholder().height() > 0 &&
      polledObjects.indexOf(scrollableObject.getUniqueId(elem)) === -1
    ) {
      totalRowCount +=
        scrollableObject.height() / options.series.gantt.minTickHeight;
      polledObjects.push(scrollableObject.getUniqueId(elem));
    }
  });
  return totalRowCount;
}

/**
 * Need description
 *
 * @param {string} pageid
 * @param {string} componentId
 * @param {string} type
 */
function pollPaneObject(pageid, componentId, type) {
  if (!polledComponents[pageid]) {
    polledComponents[pageid] = [];
  }
  polledComponents[pageid].push(componentId);
  const numberOfComponents = $(type, `#${pageid}`).length;
  if (polledComponents[pageid].length === numberOfComponents) {
    if (
      $(`#${pageid}`)
        .find('.toolbar.toolbar_top.iflight-cloak')
        .hasClass('iflight-cloak')
    ) {
      $(`#${pageid}`)
        .find('.toolbar.toolbar_top.iflight-cloak')
        .removeClass('iflight-cloak');
    }
  }
}

/**
 * Need description
 *
 * @param {string} pageid
 */
function clearPolledComponents(pageid) {
  if (polledComponents[pageid]) {
    delete polledComponents[pageid];
  }
}

/**
 * Need description
 * @param {Object} module
 * @returns {Object}
 */
function getPriorityGanttScreen(module) {
  const screenConfigs = $.getFromLocalStore('iF-s');
  let priorityScreen = null;
  const ganttDefaults = getdefaultGanttForCurrentRole(module);
  $.each(screenConfigs, function(index, config) {
    if (ganttDefaults && ganttDefaults.defaultGantt === 1) {
      // Local world as default Gantt
      $.each(config.ganttScreens, function(index, ganttScreen) {
        if (
          ganttScreen.lwId != null &&
          ganttScreen.lwMode === ganttDefaults.defaultLwGanttMode
        ) {
          if (config.isMaster) {
            priorityScreen = config;
            return false;
          }
          if (!config.isMaster && priorityScreen == null) {
            priorityScreen = config;
          }
        }
      });
    } else {
      // Real world as default Gantt
      $.each(config.ganttScreens, function(index, ganttScreen) {
        if (ganttScreen.lwId == null) {
          if (config.isMaster) {
            priorityScreen = config;
            return false;
          }
          if (!config.isMaster && priorityScreen == null) {
            priorityScreen = config;
          }
        }
      });
    }
  });
  return priorityScreen;
}

/**
 * Need description
 */
function getGanttPages() {
  var screenConfigs = $.getFromLocalStore('iF-s');
  var ganttList = [];
  var ganttKeys = [];
  $.each(screenConfigs, function(index, screenconfig) {
    if (screenconfig.ganttScreens) {
      $.each(screenconfig.ganttScreens, function(i, config) {
        var ganttPage = {};
        if (
          ganttKeys.indexOf(
            config.lwId != null ? config.lwId : '' + config.name
          ) == -1
        ) {
          ganttPage = $.extend({}, config);
          ganttPage.screenId = index;
          ganttKeys.push(
            config.lwid != null ? config.lwId + config.name : config.name
          );
          ganttList.push(ganttPage);
        }
      });
    }
  });
  return ganttList;
}

/**
 * Need description
 */
function getAutoLWGantt() {
  var screenConfigs = $.getFromLocalStore('iF-s');
  var ganttScreen = null;
  $.each(screenConfigs, function(index, screenconfig) {
    $.each(screenconfig.ganttScreens, function(i, config) {
      if (config.lwMode == 'LW_M_AUTO') {
        ganttScreen = $.extend({}, config);
        ganttScreen.screenId = index;
        return false;
      }
    });
    if (ganttScreen) {
      return false;
    }
  });
  return ganttScreen;
}

/**
 * Need description
 */
function getMasterScreenId() {
  var screenConfigs = $.getFromLocalStore('iF-s');
  var masterScreenId = null;
  $.each(screenConfigs, function(index, config) {
    if (config.isMaster) {
      masterScreenId = config.screenId;
      return false;
    }
  });
  return masterScreenId;
}

/**
 * Need description
 * @param {String} screenId
 */
function getScreenConfig(screenId) {
  var screenConfigs = $.getFromLocalStore('iF-s');
  var screenConfig = null;
  $.each(screenConfigs, function(index, config) {
    if (config.screenId == screenId) {
      screenConfig = config;
      return false;
    }
  });
  return screenConfig;
}

/**
 * Need description
 */
function getCurrentScreenId() {
  var screenId = $.getFromSessionStore('sId');
  return screenId;
}

/**
 * Need description
 * @param {String} lwId
 */
function getLWScreenConfigs(lwId) {
  var screenConfigs = $.getFromLocalStore('iF-s');
  var screenConfig = [];
  $.each(screenConfigs, function(index, screen) {
    $.each(screen.ganttScreens, function(i, config) {
      if (config.lwId != null && config.lwId == lwId) {
        screenConfig.push(screen);
      }
    });
  });
  return screenConfig;
}

/**
 * Need description
 */
function getRWScreenConfigs() {
  var screenConfigs = $.getFromLocalStore('iF-s');
  var screenConfig = [];
  $.each(screenConfigs, function(index, screen) {
    $.each(screen.ganttScreens, function(i, config) {
      if (config.lwId == null) {
        screenConfig.push(screen);
      }
    });
  });
  return screenConfig;
}

/**
 * Need description
 * @param {String} lwId
 * @param {String} mode
 */
function updateLWGanttMode(lwId, mode) {
  var screenConfigs = $.getFromLocalStore('iF-s');
  $.each(screenConfigs, function(index, screenconfig) {
    if (screenconfig.ganttScreens) {
      $.each(screenconfig.ganttScreens, function(i, config) {
        if (config.lwId != null && config.lwId == lwId) {
          config.lwMode = mode;
        }
      });
    }
  });
  $.putInLocalStore('iF-s', screenConfigs, true);
}

/**
 * Need description
 * @param {Object} screenConfig
 * @param {String} lwId
 * @param {String} module
 */
function getPageIdFromScreen(screenConfig, lwId, module) {
  var pageId = null;
  if (screenConfig) {
    $.each(screenConfig.ganttScreens, function(index, ganttScreen) {
      if (lwId != null) {
        if (
          ganttScreen.lwId == lwId &&
          getModule(ganttScreen.pageid) == module
        ) {
          pageId = ganttScreen.pageid;
          return false;
        }
      } else {
        if (
          ganttScreen.lwId == null &&
          getModule(ganttScreen.pageid) == module
        ) {
          pageId = ganttScreen.pageid;
          return false;
        }
      }
    });
  }
  return pageId;
}

/**
 * Need description
 * @param {Object} linkConfiguration
 */
function linkToGantt(linkConfiguration) {
  var currentScreenId = parseInt($.getFromSessionStore('iF-sId'));
  var screenConfigs = $.getFromLocalStore('iF-s');
  var priorityGanttScreenConfig = null;
  /* In case the lw id has given, the corresponding screen ID take over priority */

  if (linkConfiguration.metaData && linkConfiguration.metaData.lwId != null) {
    var lwScreens = this.getLWScreenConfigs(linkConfiguration.metaData.lwId);
    if (lwScreens.length == 1) {
      priorityGanttScreenConfig = lwScreens[0];
    } else if (lwScreens.length > 1) {
      $.each(lwScreens, function(index, screen) {
        if (screen.isMaster) {
          priorityGanttScreenConfig = screen;
          return false;
        }
      });
      priorityGanttScreenConfig =
        priorityGanttScreenConfig == null
          ? lwScreens[0]
          : priorityGanttScreenConfig;
    }
  } else if (linkConfiguration.metaData.mode == 'RW') {
    var rwScreens = this.getRWScreenConfigs();
    if (rwScreens.length == 1) {
      priorityGanttScreenConfig = rwScreens[0];
    } else if (rwScreens.length > 1) {
      $.each(rwScreens, function(index, screen) {
        if (screen.isMaster) {
          priorityGanttScreenConfig = screen;
          return false;
        }
      });
      priorityGanttScreenConfig =
        priorityGanttScreenConfig == null
          ? rwScreens[0]
          : priorityGanttScreenConfig;
    }
  } else {
    priorityGanttScreenConfig = this.getPriorityGanttScreen(
      linkConfiguration.module
    );
  }

  var metaData = null;
  if (priorityGanttScreenConfig != null) {
    //Gantt is present in some screen
    if (linkConfiguration.metaData && linkConfiguration.metaData.lwId != null) {
      metaData = linkConfiguration.metaData;
      metaData.pageid = this.getPageIdFromScreen(
        priorityGanttScreenConfig,
        linkConfiguration.metaData.lwId,
        linkConfiguration.module
      );
    } else if (linkConfiguration.metaData.mode == 'RW') {
      metaData = linkConfiguration.metaData;
      metaData.pageid = this.getPageIdFromScreen(
        priorityGanttScreenConfig,
        linkConfiguration.metaData.lwId,
        linkConfiguration.module
      );
    } else {
      metaData = this.getMetaData(
        priorityGanttScreenConfig.screenId,
        linkConfiguration.module
      );
    }
    if (currentScreenId == priorityGanttScreenConfig.screenId) {
      // Gantt is present in Current Screen
      if (linkConfiguration.internalEventName) {
        iFlightMCastEventBus.emitEvent(linkConfiguration.internalEventName, [
          linkConfiguration.eventData,
          metaData,
        ]);
      }
      linkConfiguration.scope.focusTab(
        this.getPageIdFromScreen(
          priorityGanttScreenConfig,
          metaData.lwId,
          linkConfiguration.module
        )
      );
    } else {
      // Configuration must be applied in another screen
      $.putInLocalStore(
        'iF-link',
        {
          internalEventName: linkConfiguration.internalEventName,
          eventData: linkConfiguration.eventData,
          loadGantt: linkConfiguration.loadGantt,
          module: linkConfiguration.module,
          priorityGanttScreenId: priorityGanttScreenConfig.screenId,
          ganttRequest: linkConfiguration.ganttRequest,
          metaData: metaData,
        },
        true
      );
    }
  } else if (linkConfiguration.loadGantt) {
    // Gantt is not present in any screens.
    if (currentScreenId == this.getMasterScreenId()) {
      // Load in current screen
      var request = null;
      if (
        linkConfiguration.ganttRequest &&
        linkConfiguration.ganttRequest.includeData
      ) {
        if (linkConfiguration.ganttRequest.attrbName) {
          request = {};
          request[linkConfiguration.ganttRequest.attrbName] =
            linkConfiguration.eventData;
        } else {
          request = linkConfiguration.eventData;
        }
      }
      iFlightMCastEventBus.emitEvent('loadGantt', [
        request,
        linkConfiguration.module,
      ]);
    } else {
      //Load in another screen
      if (linkConfiguration.metaData && linkConfiguration.metaData.lwId) {
        metaData = linkConfiguration.metaData;
      } else {
        metaData = this.getMetaData(
          this.getMasterScreenId(),
          linkConfiguration.module
        );
      }
      $.putInLocalStore(
        'iF-link',
        {
          internalEventName: linkConfiguration.internalEventName,
          eventData: linkConfiguration.eventData,
          loadGantt: linkConfiguration.loadGantt,
          module: linkConfiguration.module,
          priorityGanttScreenId: this.getMasterScreenId(),
          ganttRequest: linkConfiguration.ganttRequest,
          metaData: metaData,
        },
        true
      );
    }
  }
}

/**
 * Need description
 * @param {Object} dataToLink
 * @param {Object} scope
 * @param {Object} pageIdToFocus
 */
function handleScreenLink(dataToLink, scope, pageIdToFocus) {
  var currentScreenId = parseInt($.getFromSessionStore('iF-sId'));
  if (
    dataToLink.priorityGanttScreenId != null &&
    dataToLink.priorityGanttScreenId == currentScreenId
  ) {
    var screenConfig = this.getScreenConfig(currentScreenId);
    var isGanttPresent = false;
    if (screenConfig.ganttScreens.length) {
      var ganttDefualts = getdefaultGanttForCurrentRole(dataToLink.module);
      $.each(screenConfig.ganttScreens, function(index, screenConfig) {
        if (
          ganttDefualts.defaultGantt == 1 &&
          ganttDefualts.defaultLwGanttMode == screenConfig.lwMode
        ) {
          isGanttPresent = true;
          return false;
        } else if (
          ganttDefualts.defaultGantt == 0 &&
          screenConfig.lwId == null
        ) {
          isGanttPresent = true;
          return false;
        }
      });
    }
    if (dataToLink.loadGantt && !isGanttPresent) {
      var request = null;
      if (dataToLink.ganttRequest && dataToLink.ganttRequest.includeData) {
        if (dataToLink.ganttRequest.attrbName) {
          request = {};
          request[dataToLink.ganttRequest.attrbName] = dataToLink.eventData;
        } else {
          request = dataToLink.eventData;
        }
      }
      iFlightMCastEventBus.emitEvent('loadGantt', [request, dataToLink.module]);
    } else if (screenConfig.ganttScreens.length) {
      if (dataToLink.internalEventName) {
        if (!dataToLink.metaData.pageid) {
          dataToLink.metaData.pageid = scope.getGanttPageToLink(
            dataToLink.metaData.lwId
          );
        }
        iFlightMCastEventBus.emitEvent(dataToLink.internalEventName, [
          dataToLink.eventData,
          dataToLink.metaData,
        ]);
      }
      scope.focusTab(scope.getGanttPageToLink(dataToLink.metaData.lwId));
    }
  }
  $.deleteFromLocalStore('iF-link');
}

/* iFlight screens meta data */
/**
 * Need description
 * @param {string} screenId
 * @param {Object} module
 */
function getMetaData(screenId, module) {
  var defaults = getdefaultGanttForCurrentRole(module);
  var screenConfig = this.getScreenConfig(screenId);
  var metaData = new iFlightScreenMetaData(); // iFlight screens meta-data
  if (defaults && defaults.defaultGantt == 1) {
    // Localworld as default Gantt
    metaData.mode = 'LW';
    var autoLWId = null;
    var lwId = null;
    var pageid = null;
    if (screenConfig.ganttScreens.length) {
      $.each(screenConfig.ganttScreens, function(index, ganttScreen) {
        if (getModule(ganttScreen.pageid) == module) {
          if (
            ganttScreen.lwId != null &&
            ganttScreen.lwMode == 'LW_M_AUTO' &&
            autoLWId == null
          ) {
            autoLWId = ganttScreen.lwId;
            pageid = ganttScreen.pageid;
            return false;
          } else if (
            ganttScreen.lwId != null &&
            ganttScreen.lwMode == 'LW_M_INIT' &&
            lwId == null
          ) {
            lwId = ganttScreen.lwId;
            pageid = ganttScreen.pageid;
          }
        }
      });
      metaData.pageid = pageid;
      if (autoLWId != null && defaults.defaultLwGanttMode == 'LW_M_AUTO') {
        metaData.lwId = autoLWId;
        metaData.lwMode = 'LW_M_AUTO';
      } else if (lwId != null && defaults.defaultLwGanttMode == 'LW_M_INIT') {
        metaData.lwId = lwId;
        metaData.lwMode = 'LW_M_INIT';
      }
    }
  } else {
    metaData.mode = 'RW';
    $.each(screenConfig.ganttScreens, function(index, ganttScreen) {
      if (ganttScreen.lwId == null && getModule(ganttScreen.pageid) == module) {
        metaData.pageid = ganttScreen.pageid;
        return false;
      }
    });
  }
  return metaData;
}

/**
 * Exporting all public API's in iflight gantt services
 */
export const services = {
  paneOptions: {
    // default configuration for Chronos
    hScrollOptions: {
      axis: {
        arrowScroll: 0, // represent in percentage with respect to view area.
      },
      scroll: {
        interactive: true,
        horizontalIncrement: 'ltr',
        dragIntervalForFetch: 1000,
        direction: 'horizontal',
      },
      scrollBar: {
        arrowBox: {
          display: 'hide',
          arrowBoxRenderer: null,
        },
        renderer: scrollBarRenderer,
        arrowBoxRenderer: null,
      },
      scrollBox: {
        /* fillColor : '#939393',
      borderColor : '#979090', */
        lineWidth: 1,
        renderer: horzScrollBoxRenderer,
      },
      scrollOffset: {
        left: 0, // a space between canvas and scrollbar to be drawn ..5px,
        // left : 0, // Arabic style
        top: 0,
        right: 0,
        // right : 136, // Arabic style
        bottom: 0,
      },
      resize: {
        autoTrigger: false,
      },
      errorHandle: 'ignore',
    },
    vScrollOptions: {
      axis: {
        arrowScrollUnit: 1, // In units of the ticks
      },
      scroll: {
        interactive: true,
        dragIntervalForFetch: 1000,
        direction: 'vertical', // verticalIncrement:'down' //specify the incremntal  direction.  'down' (default) means the vertical axis  value  displayed -  increments from top to  bottom ( eg : 0-50),  'up' means the vertical axis value increments from  bottom to top ( eg :  50 on top- 0 on bottom)
      },
      scrollBar: {
        arrowBox: {
          display: 'hide',
          arrowBoxRenderer: null,
        },
        renderer: scrollBarRenderer,
        arrowBoxRenderer: null,
      },
      scrollBox: {
        /* fillColor : '#939393',
      borderColor : '#979090', */
        lineWidth: 1,
        renderer: vertScrollBoxRenderer,
      },
      scrollOffset: {
        left: 0, // a space between canvas and scrollbar to be drawn ..5px
        top: 0,
        right: 0,
        bottom: 0,
      },
      resize: {
        autoTrigger: false,
      },
      errorHandle: 'ignore',
    },
    plotOptions: {
      xaxis: {
        show: true,
        mode: 'time',
        twelveHourClock: false,
        tickLength: null,
        tickStyle: {
          tickColor: '#b4b4b4',
          dashedLine: true,
          dashedStyle: [2, 2],
          lineWidth: 1,
        },
        zoomRange: null, // zoomRange is a must for zoomIn and zoomOut
        scrollRange: null, // scrollRange is a must for scrolling & panning
        min: null,
        max: null,
        color: '#575f76', // base color, labels, ticks
        tickColor: 'lightblue', // gridLines
        labelBackgroundColor: '#d5d9e2',
        font: {
          size: 12,
          family: 'Arial', // ,
          // variant : "Arial"
        },
        tickFormatter(val, axis) {
          let timeUnitSize = {
            second: 1000,
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            month: 2592000000,
            year: 31556952000,
          };
          let t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]]; // size * unitSize[unit]
          //    	fmt = (t > timeUnitSize.day) ? "%d " : (t < timeUnitSize.day) ? "%h:%M" : "%d %W" ;
          let fmt;
          let isMonthOrWeek = !!(
            axis.majorTickSize[1] === 'month' ||
            axis.majorTickSize[1] === 'week'
          );
          let availableSpace = isFunction(axis.p2c)
            ? axis.p2c(axis.min + axis.tickStep) - axis.p2c(axis.min)
            : 0;
          if (t < timeUnitSize.day) fmt = '%h:%M';
          else if (
            t >= timeUnitSize.day &&
            isMonthOrWeek &&
            this.font.size * 5 < availableSpace
          )
            // To display 3 letter string for weekday [Two digits (1+1) + One Capital letter (1) + Two small letters (0.5 + 0.5) => total font digits 4].Took 5 for readability.
            fmt = '%d %W';
          else if (
            t >= timeUnitSize.day &&
            isMonthOrWeek &&
            this.font.size * 3.5 < availableSpace &&
            availableSpace <= this.font.size * 5
          )
            // To display 2 letter string for weekday [Two digits (1+1) + One Capital letter (1) + One small letter (0.5) => total font digits 3.5]
            fmt = '%d %t';
          else if (
            t >= timeUnitSize.day &&
            isMonthOrWeek &&
            this.font.size * 3 < availableSpace &&
            availableSpace <= this.font.size * 3.5
          )
            // To display single letter string for weekday [Two digits (1+1) + One Capital letter (1) => total font digits 3]
            fmt = '%d %o';
          else if (t >= timeUnitSize.day && isMonthOrWeek) fmt = '%d ';
          else fmt = '%d %W';

          return $.chronos.formatDate(new Date(val), fmt, null);
        },
        tickSizeProvider(viewAreaInTime, viewAreaInPixels) {
          let tickSize = [1, 'day'];
          if (viewAreaInTime <= 86400000) {
            // 2 days
            tickSize = [1, 'hour'];
          } else if (viewAreaInTime > 86400000 && viewAreaInTime <= 259200000) {
            // 3 days
            tickSize = [6, 'hour'];
          } else if (
            viewAreaInTime > 259200000 &&
            viewAreaInTime <= 604800000
          ) {
            // 7 days
            tickSize = [12, 'hour'];
          } else if (
            viewAreaInTime > 604800000 &&
            viewAreaInTime <= 3888000000
          ) {
            // 45 days
            tickSize = [1, 'day'];
          } /* else if (viewAreaInTime > 3888000000 && viewAreaInTime <= 10368000000) { //120 days
                      tickSize = [1, "day"];
                    } */ else {
            return tickSize;
          }
          return tickSize;
        },
        multiLineTimeHeader: {
          enable: true,
          displayWeek: {
            enable: true,
          },
          majorTickStyle: {
            tickColor: '#b4b4b4', // dayChangeLines
            dashedLine: false,
            dashedStyle: [2, 2],
            lineWidth: 2,
            majorTickLength: 'full',
          },
        },
        colorDays: {
          enable: false,
          headerOnly: false,
          colors: [null, null, null, null, null, null, null],
        },
      },
      yaxis: {
        show: true,
        position: 'left',
        labelWidth: 100,
        labelBackgroundColor: 'white',
        labelRenderer: null, // To be provided
        tickLength: 0,
        color: '#D33B24',
        tickColor: 'black',
        /* font : {
        size : 14,
        style : "italic",
        weight : "bold",
        family : "Arial",
        variant : "normal"
      }, */
        scrollRange: [0, 1000],
        verticalScrollExtendunit: 0.5, // the unit to span extra on both sides on vertical axis
        min: 0,
        max: 5,
        defaultMarkings: {
          lineWidth: 1,
          lineColor: '#ededed',
          alternateRowColor: ['#f5f5f5', 'white'],
        },
        transform(v) {
          return -v;
        }, // to view lowestdata on top of y axis
        inverseTransform(v) {
          return -v;
        },
      },
      zoom: {
        interactive: true,
        amount: 1.5,
      },
      scroll: {
        snapRow: true,
      },
      pan: {
        interactive: true,
        cursor: 'move',
        frameRate: 70,
        snapRow: true,
      },
      taskDrag: {
        interactive: true,
        marker: true, // if on, dragging the value markers at both ends of the task to be visible or not
        effectAllowed: 'move', // copy,move
        cursor: 'move',
        autoScrollTimer: 0, // time in milliseconds to redraw the flot after 1 sec when dragging reaches boundary
        autoScrollPixel: 0, // pixel from the boundary border left, right, top, bottom from which dragMoves to the next View area
        draggingEffect: {
          enable: true,
          lineWidth: 1,
          lineColor: '#000',
          fillColor: '#000',
          showTimeLine: false,
          showTime: false,
          dragoverTimeDelay: 200,
        },
      },
      /* headerDrag : { //header drag
      cursor: "move",
      effectAllowed: "move",
      interactive: true,
      shadowEffect: true
    }, */
      columnHeaderDrag: {
        interactive: true,
        selectionStyle: {
          lineWidth: 1,
          lineColor: '#00ff00',
          fillColor: 'rgba(255, 0, 0, 0.2)',
        },
      },
      columnHeaderClick: {
        // column header or time header
        interactive: true, // just trigger the callback on click
        selectionAllowed: true, // true will select major ticks and highlight it for multiline time header, minor ticks for single line time header
        renderer: null,
        selectionStyle: {
          lineWidth: 1,
          lineColor: 'rgba(255, 0, 0, 0.2)',
          fillColor: 'rgba(255, 0, 0, 0.2)',
          type: 'COMPLETE_HEADER', // COMPLETE_HEADER, HEADER_ONLY OR FULL (selection drawn full the plot height)
        },
      },
      mouseTracker: {
        enable: false,
        direction: 'both', // values cab be both,
        // horizontal, vertical
        lineWidth: 1,
        lineColor: '#FF0000',
        dashedLine: true,
        moveOnRowHeader: true,
      },
      taskTracker: {
        enable: false,
        direction: 'both', // values cab be both, horizontal, vertical
        lineWidth: 1,
        lineColor: '#FF0000',
        dashedLine: true,
        followScroll: false,
      },
      keyboardFocus: {
        enable: true,
      },
      series: {
        gantt: {
          show: true,
          lineWidth: 1,
          align: 'center',
          barHeight: 1, // 0.85,
          fontColor: 'white',
          fill: true,
          fillColor: {
            colors: ['#CF2F2F', '#D89999'],
          },
          fontSize: 10, // the size of the font to display inside each task
          normalMaximumDaySpan: 2,
          fullBorderWidth: 0,
          minTickHeight: 35, // height in pixels
          connections: {
            // drawOnPriorityLayer : true,
            node: {
              visibleRangeOnly: false,
            },
          },
          cacheOffset: false,
        },

        color: 'red',
      },
      grid: {
        show: true,
        aboveData: false,
        color: 'black',
        labelMargin: 5,
        backgroundColor: '#FFFFFF', // null for transparent else { colors:["#000", "#999"] }
        borderWidth: 0,
        minBorderMargin: 0,
        tickColor: '#0C3ADD', // color for the ticks
        hoverable: true,
        clickable: true,
        cursor: 'move',
        showCurrentTimeMarker: true, // to display the marker on current time
        timeMarkerStyle: {
          lineWidth: 1,
          lineColor: 'red',
          dashedLine: false,
          showTime: {
            enable: true,
            timeFormat: '%d-%b-%y %h:%M',
          },
        },
        cornerBox: {
          enable: true, // if enabled, Clipping the gantt corners to prevent labels overlapping
          fillColor: '#f3f5f8', // to fill the corner area
          borderColor: '#FFFFFF', // to draw a border for the corner
        },
        draggingEffect: {
          enable: true,
          lineWidth: 1,
          lineColor: '#000',
          fillColor: '#000',
          showTimeLine: false,
          showTime: true,
        },
      },
      interaction: {
        dataOnDemand: true,
        extraViewFetch: false,
        errorHandle: 'ignore',
      },
      plotResize: {
        autoTrigger: false,
      },
      chronosWorker: {
        enabled: true,
      },
    },
  },
  setPaneConfigurations,
  getCurrentLWId: getCurrLWId,
  updateSplitPaneHeight,
  createHorizontalScollBar,
  getDragPane,
  setDragPane,
  getGanttViews,
  addGanttView,
  removeGanttView,
  getCurrentVisibleArea,
  toggleTreeView,
  prepareInitData,
  getRowIdForDoubleLine,
  initPane,
  spaceBeforeItem,
  initLayout,
  clearLayout,
  getFetchToken,
  isLatestToken,
  clearToken,
  findItem,
  findHeader,
  setTimeScrollUnit,
  getPrevTip,
  setPrevTip,
  highlight,
  getAllItemsInRange,
  createGanttTree,
  prepareLatestData,
  togglePanMode,
  drawCurrentTimeline,
  drawCircle,
  drawVerticalLine,
  drawTriangle,
  drawRectangle,
  drawDiamond,
  isExpandable,
  getConfigObject,
  getGanttConfiguration,
  getConfiguration,
  getIconDimensions,
  isLatestGanttObj,
  calcZoomOffset,
  overallZoom,
  setupRootZoomVariables,
  setupZoomVariables,
  setZoomConfig,
  getZoomConfig,
  getAllZoomConfig,
  getZoomConfigFromPaneid,
  clearZoomConfig,
  getCurrentViewArea,
  setFreezePosition,
  getFreezePosition,
  toggleAutoScrollOnTaskDrag,
  getTextOffset,
  isNotWrap,
  isTaskOverlapping,
  drawTimeBasedIndicators,
  drawBar,
  getLabelDimensions,
  removeLabelDimensions,
  getOuterLabelDimensions,
  setIconImage,
  drawImage,
  drawIcon,
  drawLabels,
  drawOuterLeftLabels,
  drawOuterRightLabels,
  selectEnities,
  drawText,
  verticalZoom,
  drawConnectionLine,
  removeConnectionLine,
  goToCurrentDate,
  goToAnyDate,
  getAllRowIds,
  updatePane,
  resizePane,
  zoomCalc,
  dayZoomerCalc,
  horZoomToVisibleRange,
  getSelectedItems,
  setSelectedItems,
  clearSelectedItems,
  enableRotateCursor,
  disableRotateCursor,
  getMaxZoomOutLevel,
  getMinZoomInLevel,
  setGanttSubTask,
  getAllSubTasks,
  getAllGanttSubTasks,
  getSubTasksSelected,
  isSubTasksSelected,
  isSelectedGanttSubTask,
  removeSubTasks,
  clearGanttSubTasks,
  isSinglePane,
  getRulerData,
  setRulerData,
  clearRulerData,
  getPageTitle,
  registerViewPlaceholder,
  setViewName,
  setViewTitle,
  getViewName,
  getTopPane,
  overrideGanttViews,
  collapseAllRows,
  expandAllRows,
  getPaneZoomRowCount,
  setCustomZoomObject,
  getCustomZoomObject,
  applyCustomZoom,
  getTotalRowsCount,
  pollPaneObject,
  clearPolledComponents,
  getPriorityGanttScreen,
  setDoubleLineRows,
  getDoubleLineRows,
  removeDoubleLineRows,
  createDoubleLines,
  getTimeOnDST,
  dragEndSuccessCallback,
  setReferenceData,
  getReferenceData,
  clearReferenceData,
  getGanttContext,
  modifyForGantt,
  modifyForUnassignedGantt,
  prepareTooltipData,
  getLocalizedToolTip,
  getOpenSimulations,
  getRealWorldTabId,
  getGanttPageForLW: getSimGanttPage,
  getSimData: getSimDataById,
  renameSimTab,
  checkFiltersAndDraw,
  isOPSGantt: checkOPSpage,
  isCTSGantt: checkCTSpage,
  setGanttDependencies,
  getGanttDependencies,
  getPaneDomId,
  addConfigToLocalStore,
  capXaxisInitialViewRangeForMultiscreen,
  getConfigFromLocalStore,
  putConfigToLocalStore,
  updateMultiscreen,
  setGanttExtraParams,
  isMultiscreenEnabled,
  getCurrentPaneObject,
  isSplitPane,
  hideSplitPane,
  getGanttExtraParam,
  setSplitPaneFocused,
  isSplitPaneFocused,
  addToClipboard,
  updateClipboardData,
  removeFromClipboard,
  isClipboardPage,
  getClipboardPageId,
  getClipboardParentPageId,
  getRWClipboardPageIds,
  getClipboardData,
  expandSplitNode,
  getDataSelectedForClipBoard,
  removeSplitPaneObjects,
  setSplitNodeExpanded,
  getSplitNodeExpanded,
  getGanttPages,
  getAutoLWGantt,
  getMasterScreenId,
  getScreenConfig,
  getCurrentScreenId,
  getLWScreenConfigs,
  getRWScreenConfigs,
  updateLWGanttMode,
  getPageIdFromScreen,
  linkToGantt,
  handleScreenLink,
};
