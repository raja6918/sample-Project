'use strict';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import difference from 'lodash/difference';
import { ds } from '../data';
import { services } from '../services';
import { iFlightEventBus } from '../iflight_event_bus';
import { layouts } from '../layout';
import { createiFlightModelObject as createObject } from '../iflight_object_observer';
import { isFunction } from '../utils';
import { getUTCDateForTimeInMilliseconds } from '../utils';

const currentTimeCallBacks = [];

/**
 * Webcomponent implementation of iFlight Gantt.
 * This is a replacement for iflight_gantt_directives
 */
export class IflightGantt extends HTMLElement {
  /**
		Attributes to be observed from <iflight-canvas> tag to be mentioned here. The attributeChangedCallback will be invoked for the
		below mentioned attributes if value changes.
	*/
  static get observedAttributes() {
    return ['id'];
  }

  constructor() {
    super();
    //TODO check and use private fields based on the current html living draft. Currentlynot supported in safari
    this._config = {};
    this._hScrollBar = [];
    this._dataModel = null;
    this._treeEnabled = false; //(this.hasAttribute("enabletree")) ? true : false;
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    if (
      this._paneObject === undefined ||
      typeof this._paneObject === 'undefined'
    ) {
      this._paneObject = {};
    }
    if (this._treeEnabled) {
      if (
        this._paneObjectTree === undefined ||
        typeof this._paneObjectTree === 'undefined'
      ) {
        this._paneObjectTree = {};
      }
    }
    this._customData = 'OPS_F_N_F';
    this._timeModeVariance = null;
    this._splitPaneEnabled = false;
    const splitPaneModel = this.id;
    const lastfive = splitPaneModel.substr(splitPaneModel.length - 5);
    this._splitActive =
      lastfive == 'split' || this._splitPaneEnabled ? true : false;

    this._prevRequest = {};
    this._currFetchRequest = {};
    this._prevFetchRequest = {};
    this._firstFetch = true;
    this._enableRuler = false;
    this._rulerMode = 'crosshair';
    this._freezeBoth = false;
    this._count = [];
    this._restrictTooltip = false;
    this._allowTooltipDisplay = false;
    this._prevTip;
    this._tooltipTimer;
    this.dragTimer = null;
    this._dragTimer = null;
    this._prevId;
    this._prevRowId;
    this._prioritySelectionInvoked = false;
    this._dragMode = 'copy';
    this._userRulerArea = null;
    this._dragAndDropObj = {};
    this.paneHidden = false;
    this.ganttInitDataCallbackTimer = null;
    this._paneIcon = 'paneIconSprite.png';
    this._preventContextMenu = null;
  }

  get config() {
    return this._configProxy;
  }

  set config(newConfigObj) {
    this._configProxy = createObject({
      objectWatcher: this.configModelChangeCallback,
      callerContext: this,
      deepWatch: false,
    });
    this._configProxy.configModel = newConfigObj;
    this.applyConfiguration();
  }

  get dataModel() {
    return this._dataModel;
  }

  get paneIcon() {
    return this._paneIcon;
  }

  set paneIcon(icon) {
    this._paneIcon = icon;
  }

  initializeGanttTemplate() {
    /**
			Dynamic template start
		 */
    const templateNode = document.createElement('template');
    let uniqueID = this.id;

    let containerClass = 'ui-ganttArea-container gantt-container';
    if (this.getAttribute('columnHeader') === 'true') {
      containerClass += ' column-header';
    }

    let normalDiv = `<style>
      .ui-gantt_holder{
        position: absolute;
        background: white;
        left: -5px;
        right: 0px;
        top: 0;
        bottom: 0;
      }
    </style>
    <style>
			@import "${window.location.protocol}//${window.location.host}${mtResourceUrl}/css/gantt/gantt.common.css";
		</style>
		<div id=\"${uniqueID}ui-ganttArea-container\"class=\"${containerClass}\" >
			<div id=\"${uniqueID}ui-gantt_holder\" class=\"ui-gantt_holder ui-gantt\" chronosresize="true"><!-- Gantt Pane Holder --></div>
			<div id=\"${uniqueID}ui-scrollBarVertical\" class=\"ui-scrollBarVertical\" chronosresize="true"><!-- Vertical Scrollbar --></div>
		</div>`;
    let treeDiv;
    if (this._treeEnabled) {
      treeDiv = `<div id=\"${uniqueID}ui-ganttArea-container_tree\" class=\"ui-ganttArea-container gantt-container_tree\" >
				<div id=\"${uniqueID}ui-gantt_holder_tree\" class=\"ui-gantt_holder ui-gantt_tree\" chronosresize="true"><!-- Gantt Pane Holder --></div>
				<div id=\"${uniqueID}ui-scrollBarVertical_tree\" class=\"ui-scrollBarVertical\" chronosresize="true"><!-- Vertical Scrollbar --></div>
			</div>`;
    }
    templateNode.innerHTML = this._treeEnabled
      ? `${normalDiv}${treeDiv}`
      : `${normalDiv}`;

    /**
			Dynamic template end
		 */

    const _canvasTmplMaster = templateNode.content;
    const _canvasTmpl = _canvasTmplMaster.cloneNode(true);
    this._shadowRoot.appendChild(_canvasTmpl);
    this._dataModel = createObject({
      objectWatcher: this.dataModelChangeCallback,
      callerContext: this,
      deepWatch: false,
    });
  }
  connectedCallback() {
    console.log('connectedCallback');

    this.parentElement.style.height = '100%';
    this.parentElement.style.width = '100%';
    this.style.height = '100%';
    this.style.width = '100%';
  }

  disconnectedCallback() {
    //Cleanup code on instance destroy goes here
    const plot = this.getCurrentObjCallback();
    if (plot && isFunction(plot.shutdown)) {
      plot.shutdown();
    }

    this._dataModel = null;
    this._configProxy = null;
    const pageIdRef = this.pageId;
    const placeHolderId = this.id + 'ui-gantt_holder';
    this.unBindGanttEvents();
    services.clearLayout(pageIdRef);
    services.clearZoomConfig(pageIdRef);
    services.clearToken(pageIdRef);
    layouts.clearPaneStatus(pageIdRef);
    services.clearGanttSubTasks(pageIdRef);
    layouts.deRegisterDragCallback(this.paneDragged, pageIdRef, placeHolderId);
    services.clearPolledComponents(pageIdRef);

    clearTimeout(this.ganttInitDataCallbackTimer);
  }
  getTimeModeVariance(plot) {
    let elem = this || plot.getGanttFromPlot();
    return elem.timeModeVariance;
  }
  addCurrentTimeCallBack(currentTimeCallBack, context) {
    if (currentTimeCallBack && isFunction(currentTimeCallBack)) {
      currentTimeCallBacks[context] = currentTimeCallBack;
    }
  }
  destroyEnableTimeModeVariance(newValue, caller) {
    let ganttOptions = caller._configProxy.configModel;
    if (newValue !== undefined && newValue !== null) {
      caller._timeModeVariance = newValue;

      services.drawCurrentTimeline(
        caller._paneObject,
        ganttOptions.currentTimeline,
        caller.getTimeModeVariance
      );
      if (caller._paneObject.constructor.name == 'Chronos') {
        caller._paneObject.drawHighLightOverlay();
      }

      if (caller._treeEnabled) {
        services.drawCurrentTimeline(
          caller._paneObjectTree,
          ganttOptions.currentTimeline,
          caller.getTimeModeVariance
        );
        if (caller._paneObjectTree.constructor.name == 'Chronos') {
          caller._paneObjectTree.drawHighLightOverlay();
        }
      }
    }
  }

  getCurrentObjCallback() {
    let ganttOptions = this._configProxy.configModel;
    let currPlot = this._paneObject;
    if (
      this._treeEnabled &&
      this._paneObjectTree &&
      this._paneObjectTree.constructor.name == 'Chronos' &&
      ganttOptions.treeHandler.enabled()
    ) {
      currPlot = this._paneObjectTree;
    }
    return currPlot;
  }

  destroyEnableSplitPane(newData, caller) {
    let ganttOptions = caller._configProxy.configModel;
    if (ganttOptions.enableSplitPane) {
      caller._splitPaneEnabled = newData;
      caller._dataModel.customOptions.isSplitEnabled = caller._splitPaneEnabled;
      let plot = caller.getCurrentObjCallback();
      if (Object.keys(plot).length > 0) {
        let options = plot.getOptions();
        if (!newData) {
          services.setSplitNodeExpanded(false);
          options.mouseTracker.enable = false;
          caller._paneObject.drawHighLightOverlay();
        } else if (
          newData &&
          caller._splitPaneEnabled &&
          $('#' + caller.id + '_split').length == 0
        ) {
          options.mouseTracker.enable = true;
          options.mouseTracker.direction = 'horizontal';
        }
      }
    }
  }

  createPaneToolbarTemplate(placeHolderId) {
    let ganttOptions = this._configProxy.configModel;
    const paneToolbarTemplateNode = document.createElement('div');
    if (ganttOptions.showPaneToolbar) {
      let paneToolbar = `<a href="javascript:;" class=\"gantt_pane_icons_wrap\"> <span><!-- To avoid jspx minimization --></span> <ul id=\"${placeHolderId}ganttPaneIcons\" class=\"iconsHolder\">`;
      if (
        ganttOptions.customPaneToolbar &&
        ganttOptions.customPaneToolbar.isEnabled
      ) {
        let icons = ganttOptions.customPaneToolbar.icons;
        for (let index in icons) {
          let iconConfig = icons[index];
          paneToolbar += `<li id=\"${placeHolderId}${iconConfig.id}\" class=\"icon_sprite ${iconConfig.class}\" title=\"${iconConfig.title}\"><img src=\"${imagePath}/${iconConfig.icon}\"></li>`;
        }
      }
      paneToolbar +=
        `<li id=\"${placeHolderId}minimize\" class=\"icon_sprite min\" title=\"minimize\"><img src=\"${imagePath}/${this.paneIcon}\"></li>` +
        `<li id=\"${placeHolderId}maximize\" class=\"icon_sprite max\" title=\"maximize\"><img src=\"${imagePath}/${this.paneIcon}\"></li>` +
        `<li id=\"${placeHolderId}restore\" class=\"icon_sprite restore\" style=\"display:none;\" title=\"restore\"><img src=\"${imagePath}/${this.paneIcon}\"></li>` +
        `<li id=\"${placeHolderId}close\" class=\"icon_sprite close_icon\" title=\"close\"><img src=\"${imagePath}/${this.paneIcon}\"></li>` +
        `</ul> </a>`;
      paneToolbarTemplateNode.id = placeHolderId + 'ganttPaneIconsDiv';
      paneToolbarTemplateNode.classList.add('gantt_pane_icons_containter');
      paneToolbarTemplateNode.style.visibility = 'hidden';
      paneToolbarTemplateNode.innerHTML = paneToolbar;
    }
    return paneToolbarTemplateNode;
  }

  customPaneToolbarHandler(callback) {
    let ganttOptions = this._configProxy.configModel;
    if (
      ganttOptions.customPaneToolbar &&
      ganttOptions.customPaneToolbar.isEnabled &&
      isFunction(callback)
    ) {
      callback(ganttOptions.plotLabel);
    }
  }

  attachCustomToolbarsEvents(placeHolderId) {
    let ganttOptions = this._configProxy.configModel;
    if (
      ganttOptions.customPaneToolbar &&
      ganttOptions.customPaneToolbar.isEnabled
    ) {
      let icons = ganttOptions.customPaneToolbar.icons;
      for (let index in icons) {
        let iconConfig = icons[index];
        this.shadowRoot.querySelector(
          `#${placeHolderId}${iconConfig.id}`
        ).onclick = () => this.customPaneToolbarHandler(iconConfig.callback);
      }
    }
  }

  initializePaneToolbarTemplate() {
    let placeHolderId = this.id + 'ui-gantt_holder';
    let paneToolbar = this.createPaneToolbarTemplate(placeHolderId);
    let paneToolbarTree;
    if (this._treeEnabled) {
      paneToolbarTree = this.createPaneToolbarTemplate(placeHolderId + '_tree');
    }
    //invoke this after all initialization is completed
    let childElementsCount = this._shadowRoot.childNodes.length;
    for (let i = 4; i < childElementsCount; i++) {
      let childElement = this._shadowRoot.childNodes[i];
      if (childElement.id.search('_tree') != -1) {
        childElement.append(paneToolbarTree);
      } else {
        childElement.append(paneToolbar);
      }
    }

    this.attachCustomToolbarsEvents(placeHolderId);
  }

  applyConfiguration() {
    this.initializePaneToolbarTemplate();
    this.bindGanttEvents();
    let ganttOptions = this._configProxy.configModel;
    this.ganttActionsObj = {
      updateRulerArea: this.updateRulerArea,
      closePane: this.paneCloseHandler,
      minimizePane: this.paneMinimizeHandler,
      maximizePane: this.paneMaximizeHandler,
      restorePane: this.paneRestoreHandler,
      //getBusinessConfig : businessConfigProvider,--- todo
      //splitPane: splitPane  --- todo
    };
    if (ganttOptions.showPaneToolbar) {
      const pageId = ds.getData('app', 'activeTabID');
      const module = ds.getData('app', 'module', null, { id: pageId });
      const ganttPanes = ds.getData('app', 'ganttPanes', null, { id: pageId });
      if (module && ganttPanes) {
        var isVisible = ganttPanes[module][ganttOptions.plotLabel];
        if (isVisible && isVisible == 'false') {
          let placeHolderId = this.id + 'ui-gantt_holder';
          layouts.hidePane(placeHolderId + 'close', pageId);
          this.paneHidden = true;
        }
      }
    }
    if (
      ganttOptions &&
      ganttOptions.ganttActionsCallbackSetter &&
      _(ganttOptions.ganttActionsCallbackSetter) &&
      !this._splitActive
    ) {
      eval(ganttOptions.ganttActionsCallbackSetter(this.ganttActionsObj));
    }
    this._dataModel.customOptions = {
      interationRestrictMap: ganttOptions.interationRestrictMap,
      doubleLine: ganttOptions.doubleLine,
      ganttOptions: ganttOptions.paneOptions.plotOptions.series.gantt,
      uniqueID: this.id,
      plotLabel: ganttOptions.plotLabel,
    };
    this._dataModel.paneId = this.id + 'ui-gantt_holder';
    eval(this._configProxy.configModel.initializer).call(
      this,
      false,
      this.splitHeaderId
    ); //eval to be replaced with safeConfigEval
    this._dataModel.setHighlightEntity = function(id) {
      this.highlightEntity = id;
    };

    this._dataModel.setHighlightHeader = function(rowId) {
      this.highlightHeader = rowId;
    };
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName == 'id' && !newVal.toString().startsWith('{{')) {
      this.initializeGanttTemplate();
    }
  }

  _isReqRepeated(fetchList1, fetchList2) {
    var isRepeat = false;
    if (fetchList1 && fetchList2 && fetchList1.length == fetchList2.length) {
      for (var int = 0; int < fetchList1.length; int++) {
        var fetchDataRange1 = fetchList1[int],
          fetchDataRange2 = fetchList2[int];
        if (
          fetchDataRange1.fromDate == fetchDataRange2.fromDate &&
          fetchDataRange1.toDate == fetchDataRange2.toDate
        ) {
          var rowIds1 = JSON.stringify(fetchDataRange1.rowIds),
            rowIds2 = JSON.stringify(fetchDataRange2.rowIds);
          if (rowIds1 == rowIds2) {
            isRepeat = true;
          }
        }
      }
    }
    return isRepeat;
  }

  _fetchData(fetchDataRequest, isTree) {
    fetchDataRequest.fetchDataRangeList.forEach(function(fetchDataRange) {
      var rowIds = fetchDataRange.rowIds,
        remIds = [];
      for (var int = 0; int < rowIds.length; int++) {
        var value = rowIds[int];
        if (typeof value === 'string' && value.slice(-1) === '^') {
          remIds.push(value);
        }
      }
      fetchDataRange.rowIds = difference(rowIds, remIds);
      fetchDataRange.toDate += 86400000; //added a day for end date check <=
    });

    fetchDataRequest.fetchDataRangeList = filter(
      fetchDataRequest.fetchDataRangeList,
      function(fetchDataRange) {
        return fetchDataRange.rowIds.length > 0;
      }
    );

    var isRepeated = this._isReqRepeated(
      fetchDataRequest.fetchDataRangeList,
      this._prevRequest.fetchDataRangeList
    );

    if (!isRepeated && fetchDataRequest.fetchDataRangeList.length > 0) {
      this._prevRequest = fetchDataRequest;
      var isSplit = this.splitHeaderId ? true : false;
      fetchDataRequest.fetchToken = services.getFetchToken(
        this._configProxy.configModel.plotLabel,
        this.pageId
      );
      /*if (windowSwitched) {
				spinnerService.block();
			}*/
      if (this._configProxy.configModel.dataLoader) {
        eval(this._configProxy.configModel.dataLoader).call(
          this,
          fetchDataRequest,
          isTree,
          isSplit
        ); //eval to be replaced with safeConfigEval
      }
    }
  }

  _mergeDataRange(range1, range2) {
    var dataRange = {};
    dataRange.fromDate = Math.min(range1.fromDate, range2.fromDate);
    dataRange.toDate = Math.max(range1.toDate, range2.toDate);

    //Avoiding Duplicates
    dataRange.rowIds = range1.rowIds;
    for (var i = 0; i < range2.rowIds.length; i++) {
      if (range1.rowIds.indexOf(range2.rowIds[i]) == -1) {
        range1.rowIds.push(range2.rowIds[i]);
      }
    }
    return dataRange;
  }

  _throttleOnDemandFetch() {
    var request = {
      fetchDataRangeList: [],
      windowDataRange: {},
    };
    if (
      this._prevFetchRequest &&
      Object.keys(this._prevFetchRequest).length > 0
    ) {
      if (this._isReqRepeated(this._prevFetchRequest, this._currFetchRequest)) {
        for (
          var i = 0;
          i < this._prevFetchRequest.fetchDataRangeList.length;
          i++
        ) {
          request.fetchDataRangeList[i] = this._mergeDataRange(
            this._prevFetchRequest.fetchDataRangeList[i],
            this._currFetchRequest.fetchDataRangeList[i]
          );
        }
      } else if (
        this._prevFetchRequest.fetchDataRangeList.length == 1 &&
        this._currFetchRequest.fetchDataRangeList.length == 1 &&
        this._prevFetchRequest.fetchDataRangeList[0].fromDate ==
          this._currFetchRequest.fetchDataRangeList[0].fromDate &&
        this._prevFetchRequest.fetchDataRangeList[0].toDate ==
          this._currFetchRequest.fetchDataRangeList[0].toDate
      ) {
        this._currFetchRequest.fetchDataRangeList[0].rowIds.forEach(
          (value, index) => {
            if (
              this._prevFetchRequest.fetchDataRangeList[0].rowIds.indexOf(
                value
              ) == -1
            ) {
              this._prevFetchRequest.fetchDataRangeList[0].rowIds.push(value);
            }
          }
        );
        request.fetchDataRangeList = this._prevFetchRequest.fetchDataRangeList;
      } else {
        request.fetchDataRangeList = this._prevFetchRequest.fetchDataRangeList.concat(
          this._currFetchRequest.fetchDataRangeList
        );
      }
      request.windowDataRange = this._mergeDataRange(
        this._prevFetchRequest.windowDataRange,
        this._currFetchRequest.windowDataRange
      );
    } else {
      request = this._currFetchRequest;
    }
    this._fetchData(request, this._currFetchRequest.isTree);
    this._prevFetchRequest = this._currFetchRequest = null;
    /*if( timeOut ) {
			clearTimeout(timeOut);
			timeOut = null;
		}*/
  }

  _dataLoader(fetchDataRequest, isTree) {
    //if (!paneHidden) {
    if (
      this._firstFetch ||
      (this._currFetchRequest && this._currFetchRequest.isTree != isTree)
    ) {
      this._fetchData(fetchDataRequest, isTree);
      this._firstFetch = false;
    } else {
      this._prevFetchRequest = JSON.parse(
        JSON.stringify(this._currFetchRequest)
      );
      this._currFetchRequest = JSON.parse(JSON.stringify(fetchDataRequest));
      this._currFetchRequest.isTree = isTree;
      this._throttleOnDemandFetch();
      /*if(!timeOut) {
					timeOut = setTimeout(throttleOnDemandFetch, 0);
				}*/
    }
    //}
  }

  dataLoader(fetchDataRequest) {
    let allowFetch = true;
    const gantt = this.getGanttFromPlot();
    if (gantt._configProxy) {
      const ganttOptions = gantt._configProxy.configModel;
      if (ganttOptions.treeHandler && ganttOptions.treeHandler.enabled()) {
        allowFetch = false;
      }
      if (allowFetch) {
        gantt._dataLoader(fetchDataRequest, false);
      }
    }
  }

  dataLoaderTree() {
    const gantt = this.getGanttFromPlot();
    if (gantt._configProxy) {
      const ganttOptions = gantt._configProxy.configModel;
      if (ganttOptions.treeHandler && ganttOptions.treeHandler.enabled()) {
        this._prevRequest = {};
        this._firstFetch = true;
        gantt.dataLoader(fetchDataRequest, true);
      }
    }
  }

  itemRenderer(dataToDraw, plot) {
    let gantt = plot.getGanttFromPlot(),
      ganttOptions = gantt._configProxy.configModel;

    var eachTask = dataToDraw.eachTask,
      draw = true,
      completedItemsType = ganttOptions.completedItems.itemTypes;
    eachTask.selected = dataToDraw.mode == 'SELECTION' ? true : false;
    eachTask.focused = dataToDraw.mode == 'FOCUS' ? true : false;
    eachTask.hovered = dataToDraw.mode == 'HOVER' ? true : false;

    /*if (_(ganttOptions.completedItems.enable)) {
			showCompleted = getScope().$eval(ganttOptions.completedItems.enable);
		}*/

    if (
      ganttOptions.interationRestrictMap.hasOwnProperty(eachTask.ganttItemType)
    ) {
      var interationRestrict =
        ganttOptions.interationRestrictMap[eachTask.ganttItemType];
      var callback = interationRestrict.callback,
        actions = interationRestrict.actions,
        mode = dataToDraw.mode;
      if (includes(actions, 'dragOrDrop') && mode == 'SHADOW') {
        draw = false;
        if (_(callback) && callback(eachTask, 'dragOrDrop')) {
          draw = true;
        }
      }
      if (includes(actions, 'itemResize') && mode == 'TASK_RESIZE') {
        draw = false;
        if (_(callback) && callback(eachTask, 'itemResize')) {
          draw = true;
        }
      }
      if (
        (includes(actions, 'itemClick') || includes(actions, 'itemMenu')) &&
        mode == 'SELECTION'
      ) {
        draw = false;
        if (_(callback)) {
          if (callback(eachTask, 'itemClick')) {
            draw = true;
          }
          if (callback(eachTask, 'itemMenu')) {
            draw = true;
          }
        }
      }
      if (includes(actions, 'itemHover') && mode == 'HOVER') {
        draw = false;
        if (_(callback) && callback(eachTask, 'itemHover')) {
          draw = true;
        }
      }
    }
    if (_(ganttOptions.itemRenderer) && draw) {
      if (
        completedItemsType !== null &&
        completedItemsType !== undefined &&
        typeof completedItemsType !== 'undefined'
      ) {
        completedItemsType.forEach(function(itemType, key) {
          if (itemType == eachTask.ganttItemType && !showCompleted) {
            if (_(ganttOptions.completedItems.itemProviderCallback)) {
              if (!ganttOptions.completedItems.itemProviderCallback(eachTask)) {
                draw = false;
              }
            } else {
              var showDate = iFlightUtils.getDate();
              showDate = services.getTimeOnDST(showDate);
              if (showDate >= eachTask.end) {
                draw = false;
              }
            }
          }
        });
      }
      if (draw && isFunction(ganttOptions.itemRenderer)) {
        //scope.$eval(ganttOptions.itemRenderer(dataToDraw));
        eval(ganttOptions.itemRenderer).call(this, dataToDraw);
      }
    }
  }

  labelRenderer(actualDataToDraw, plot) {
    let gantt = plot.getGanttFromPlot(),
      ganttOptions = gantt._configProxy.configModel;
    var dataToDraw = $.extend({}, actualDataToDraw);
    if (dataToDraw.labelInfo != undefined) {
      if (dataToDraw.labelInfo.parentNode != undefined) {
        dataToDraw.wrapInfo = dataToDraw.labelInfo.wrapInfo;
        dataToDraw.labelInfo = dataToDraw.labelInfo.data;
        dataToDraw.labelInfo.expanded = actualDataToDraw.labelInfo.expanded;
        dataToDraw.labelInfo.isExpanded = actualDataToDraw.labelInfo.isExpanded;
      }
      dataToDraw.labelInfo.selected = actualDataToDraw.selected;
      //getScope().$eval(ganttOptions.labelRenderer(dataToDraw));
      eval(ganttOptions.labelRenderer).call(this, dataToDraw);
      if (dataToDraw.selected) {
        var ctx = dataToDraw.drawingContext,
          areaBox = dataToDraw.areaBox;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.strokeRect(
          areaBox.left,
          areaBox.top,
          areaBox.width + 5,
          areaBox.height
        );
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(
          areaBox.left,
          areaBox.top,
          areaBox.width + 5,
          areaBox.height
        );
      }
    }
  }

  additionalFetchWrapper(args, additionalFetch) {
    if (this._configProxy) {
      let ganttOptions = this._configProxy.configModel;
      let plot = this.getCurrentObjCallback();
      const additionalFetchWrapperCallback =
        ganttOptions.paneOptions.plotOptions.series.gantt
          .additionalViewRangeCallback;
      if (additionalFetchWrapperCallback && additionalFetch != true) {
        const bufferRowCountPercentage = services.getGanttConfiguration(
          this.module
        ).bufferRowCountPercentage;
        let tasksList;
        let bufferRowCount;
        if (bufferRowCountPercentage && args) {
          const totalVisibleRows = args.yValueMax - args.yValueMin;
          bufferRowCount = Math.round(
            (totalVisibleRows * bufferRowCountPercentage) / 100
          );
        } else {
          bufferRowCount = 10;
        }
        if (isFunction(plot.getAllViewAreaTasksWithBufferRows)) {
          tasksList = plot.getAllViewAreaTasksWithBufferRows(bufferRowCount);
        }
        if (tasksList && tasksList.length > 0) {
          eval(additionalFetchWrapperCallback(tasksList));
        }
      }
    }
  }

  scrollRangeChangeWrapper(
    args,
    additionalFetch,
    ganttHeaders,
    beforeUpdateGanttData
  ) {
    if (this._configProxy) {
      let currentVisibleData = args.currentVisibleData;
      if (beforeUpdateGanttData != true) {
        this.additionalFetchWrapper(currentVisibleData, additionalFetch);
      }
      if (args.triggeredFrom == 'scroll' || args.triggeredFrom == undefined) {
        let ganttOptions = this._configProxy.configModel;
        const dateRangeChangedCallback =
          ganttOptions.paneOptions.plotOptions.series.gantt
            .dateRangeChangedCallback;
        if (dateRangeChangedCallback && isFunction(dateRangeChangedCallback)) {
          let rowHeaderObjects = [];
          let plot = this.getCurrentObjCallback();
          const updateDateTime = plot.resetViewPortTime(
            currentVisibleData.fromDate
          );

          //rowheaders to be updated on date range change calculated here
          if (ganttHeaders && ganttHeaders.length > 0) {
            for (let index in ganttHeaders) {
              if (
                ganttHeaders[index] !== null &&
                (ganttHeaders[index].updateDateTime == undefined ||
                  ganttHeaders[index].updateDateTime !== updateDateTime)
              ) {
                //rowheaders to be updated on date range change calculated here
                ganttHeaders[index].updateDateTime = updateDateTime;
                rowHeaderObjects.push(ganttHeaders[index]);
              }
            }
          } else {
            let rowHeaderMap = plot.getSeries().rowHeaderMap;
            let rowIdRowObjectMap = plot.getSeries().rowIdRowObjectMap;
            for (let index in rowHeaderMap) {
              if (rowHeaderMap[index] !== null) {
                let rowId = rowHeaderMap[index].id;
                if (
                  rowIdRowObjectMap[rowId].updateDateTime == undefined ||
                  rowIdRowObjectMap[rowId].updateDateTime !== updateDateTime
                ) {
                  rowIdRowObjectMap[rowId].updateDateTime = updateDateTime;
                  rowHeaderObjects.push(rowIdRowObjectMap[rowId]);
                }
              }
            }
          }

          if (rowHeaderObjects && rowHeaderObjects.length > 0) {
            eval(dateRangeChangedCallback(rowHeaderObjects));
          }
        }
      }
    }
  }

  isPaneOpen() {
    let panes = layouts.getAllPanesStatus(this.pageId);
    let isOpen = false;
    for (var index in panes) {
      let pane = panes[index];
      if (pane.id == this.id) {
        isOpen = !pane.hidden;
        break;
      }
    }
    return isOpen;
  }

  addOtherAPIs(plot) {
    plot.clearDataAndRefetchData = () => {
      this._prevRequest = {};
      this._firstFetch = true;
      plot.clearDataAndRefetchDataForGantt();
    };

    plot.clearAllColumnSelections = () => {
      plot.clearAllTickHighlights();
      iFlightEventBus.emitEvent('clearColSel', [
        this.pageId,
        ganttOptions.plotLabel,
      ]);
    };

    plot.getPaneDataMap = function() {
      var dataMap = plot.getDataMap(),
        newMap = [];
      for (var index in dataMap) {
        newMap[index] = JSON.parse(JSON.stringify(dataMap[index]));
      }
      return newMap;
    };
    plot.getAllPaneHighlights = function() {
      return JSON.parse(JSON.stringify(plot.getAllHighlights()));
    };
    plot.getHeaderObject = function(rowid) {
      return $.extend({}, plot.getRowHeaderObject(rowid));
    };
    plot.getTaskObject = function(id) {
      return $.extend({}, plot.getTaskById(id));
    };

    plot.getAllGanttHighlights = () => {
      var ganttChildTasks = services.getAllGanttSubTasks(
        this.pageId,
        plot.getPlotLabel()
      );
      var selectedItems = plot.getAllHighlights();
      for (var index in ganttChildTasks) {
        var ganttChildTask = ganttChildTasks[index];
        var taskIndex = $.findObjectIndex(selectedItems, {
          id: parseInt(index),
        });
        if (taskIndex != -1) {
          selectedItems[taskIndex] = $.extend(
            true,
            {},
            selectedItems[taskIndex]
          ); // cloning object
          selectedItems[taskIndex].selectedSubTasks = {};
          for (var sIndex in ganttChildTask) {
            var data = ganttChildTask[sIndex].split('_');
            var taskId = data[0],
              taskType = data[1];
            if (!selectedItems[taskIndex].selectedSubTasks[taskType]) {
              selectedItems[taskIndex].selectedSubTasks[taskType] = [];
            }
            selectedItems[taskIndex].selectedSubTasks[taskType].push(taskId);
          }
        }
      }
      return selectedItems;
    };

    plot.deleteRowFromGantt = headersToRemove => {
      this._prevRequest = {};
      this._firstFetch = true;
      $.each(headersToRemove, function(index, rowId) {
        plot.deleteRow(rowId);
      });
    };
    //plot.isPaneOpen = isPaneOpen;

    plot.getUniqueId = function(caller) {
      let uniqueId = caller ? caller.id : null;
      return uniqueId;
    };
    //plot.splitPane = splitPane;

    plot.getDoubleLineTypes = function() {
      return ganttOptions.doubleLine.itemTypes;
    };
    plot.updateDataAndDraw = function(ganttData) {
      let ganttOptions = plot.getGanttFromPlot()._configProxy.configModel;
      if (ganttOptions.updateDataMapHandler) {
        let rowIdRowObjectMap = plot.getSeries().rowIdRowObjectMap;
        if (ganttData.rowHeaders) {
          ganttData.rowHeaders.forEach(function(row) {
            if (rowIdRowObjectMap[row.id]) {
              let setGanttDTOAttribute = true;
              if (
                ganttOptions.updateDataMapHandler.callback &&
                _(ganttOptions.updateDataMapHandler.callback)
              ) {
                setGanttDTOAttribute = ganttOptions.updateDataMapHandler.callback(
                  rowIdRowObjectMap[row.id],
                  row
                );
              }
              if (setGanttDTOAttribute) {
                let ganttDTOAttribute =
                  ganttOptions.updateDataMapHandler.ganttDTOMap[
                    row.ganttItemType
                  ];
                rowIdRowObjectMap[row.id][ganttDTOAttribute] =
                  row[ganttDTOAttribute];
              }
            }
          });
        }
        let idTaskMap = plot.getDataMap();
        if (ganttData.data) {
          let taskIdProviderCallBackFunction = plot.getSeries().gantt
            .taskIdProviderCallBack;
          let id; //= task.id;
          ganttData.data.forEach(function(task) {
            id = task.id;
            if (taskIdProviderCallBackFunction != null) {
              id = taskIdProviderCallBackFunction(task);
            }
            if (idTaskMap[id]) {
              let setGanttDTOAttribute = true;
              if (
                ganttOptions.updateDataMapHandler.callback &&
                _(ganttOptions.updateDataMapHandler.callback)
              ) {
                setGanttDTOAttribute = ganttOptions.updateDataMapHandler.callback(
                  idTaskMap[id],
                  task
                );
              }
              if (setGanttDTOAttribute) {
                let ganttDTOAttribute =
                  ganttOptions.updateDataMapHandler.ganttDTOMap[
                    task.ganttItemType
                  ];
                idTaskMap[id][ganttDTOAttribute] = task[ganttDTOAttribute];
              }
            }
          });
        }
      }
      plot.draw();
    };
  }

  //minimize code
  paneMinimizeHandler(updateMultiscreen) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    layouts.minimizePane(elem, elem.pageId);
    iFlightEventBus.emitEvent('paneToolbarEvent', [
      'paneMinimize',
      elem.pageId,
      ganttOptions.plotLabel,
      updateMultiscreen == true ? true : false,
    ]);
  }

  //maximize code
  paneMaximizeHandler(updateMultiscreen) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    layouts.maximizePane(elem, elem.pageId);
    if (services.getTopPane(elem.pageId) === uniqueId) {
      layouts.hideMaxPaneLabelCallBack(null);
    } else {
      layouts.hideMaxPaneLabelCallBack(this.hidePaneLabel);
    }
    iFlightEventBus.emitEvent('paneToolbarEvent', [
      'paneMaximize',
      elem.pageId,
      ganttOptions.plotLabel,
      updateMultiscreen == true ? true : false,
    ]);
  }

  //restore code
  paneRestoreHandler(updateMultiscreen) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    layouts.restorePane(elem, elem.pageId);
    iFlightEventBus.emitEvent('paneToolbarEvent', [
      'paneRestore',
      elem.pageId,
      ganttOptions.plotLabel,
      updateMultiscreen == true ? true : false,
    ]);
  }

  //close code
  paneCloseHandler(isCustomClose) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (
      ganttOptions.multiScreen &&
      ganttOptions.multiScreen.enabled &&
      Object.keys(plot).length > 0 &&
      plot.getOptions().multiScreenFeature
    ) {
      let customData = plot.getOptions().multiScreenFeature.customData;
      $.multiScreenScroll.removePane(
        plot.getScreenId(),
        ganttOptions.multiScreen.extraParams,
        ganttOptions.plotLabel,
        customData
      );
      if (treeEnabled) {
        $.multiScreenScroll.removePane(
          plot.getScreenId(),
          ganttOptions.multiScreen.extraParams,
          ganttOptions.plotLabel + '_tree',
          customData
        );
      }
    }
    if (!layouts.getPaneStatus(elem.pageId, uniqueId).hidden) {
      layouts.closePane(elem, elem.pageId, uniqueId, isCustomClose);
    }
    this.paneHidden = true;
    iFlightEventBus.emitEvent('paneToolbarEvent', [
      'paneClose',
      elem.pageId,
      ganttOptions.plotLabel,
    ]);
  }

  handlePaneLeave() {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback();
    let shadowItem = plot.getShadowItem();
    if (shadowItem && !plot.getTaskById(shadowItem.chronosId)) {
      plot.setShadowItem(null);
      if (!elem._prioritySelectionInvoked) {
        plot.drawHighLightOverlay();
      }
    }

    elem.hideAndResetTooltip();
    elem.clearPrioritySelected();
  }

  selectSubtasks(event, pos, data, isRightClick) {
    let plot = this.getCurrentObjCallback();
    const ganttOptions = this._configProxy.configModel;
    let childTask = ganttOptions.subTaskSelectionMode.subTaskSetter(
      pos.x,
      pos.y,
      data
    );
    if (!event.originalEvent.ctrlKey && !isRightClick) {
      services.clearGanttSubTasks(this.pageId, ganttOptions.plotLabel);
    }
    if (childTask) {
      if (
        !services.isSelectedGanttSubTask(
          this.pageId,
          ganttOptions.plotLabel,
          data.id,
          childTask
        ) &&
        isRightClick
      ) {
        services.clearGanttSubTasks(this.pageId, ganttOptions.plotLabel);
        services.setGanttSubTask(
          childTask,
          this.pageId,
          ganttOptions.plotLabel,
          data.id
        );
      } else if (!isRightClick) {
        services.setGanttSubTask(
          childTask,
          this.pageId,
          ganttOptions.plotLabel,
          data.id
        );
      }
      plot.highlightAnEntity(data.chronosId);
      plot.drawHighLightOverlay();
    } else if (
      event.originalEvent.ctrlKey &&
      services.isSubTasksSelected(this.pageId, ganttOptions.plotLabel, data.id)
    ) {
      services.removeSubTasks(this.pageId, ganttOptions.plotLabel, data.id);
      plot.highlightAnEntity(data.chronosId);
    }
  }

  ganttInitDataCallback(newData, caller) {
    if (newData && Object.keys(newData).length !== 0) {
      let ganttOptions = this._configProxy.configModel;
      let multiScreenEnabled = ganttOptions.multiScreen
        ? ganttOptions.multiScreen.enabled
        : false;
      if (Object.keys(this._paneObject).length != 0) {
        this._paneObject = {};
      }
      this.module = ds.getData('app', 'module', null, { id: this.pageId });
      let screenId = 0;
      let paneObjRef = {};
      let customOptions = {
        dataLoader: this.dataLoader,
        itemRenderer: this.itemRenderer,
        labelRenderer: this.labelRenderer,
        scrollRangeChangeCallback: this.scrollRangeChangeWrapper.bind(this),
        yAxisVisibleRange: ganttOptions.yAxisVisibleRange,
        xAxisVisibleRange: ganttOptions.xAxisVisibleRange,
        plotLabel: ganttOptions.plotLabel,
        screenId: screenId,
        multiScreenFeature: {
          enabled: multiScreenEnabled,
          linkage: ganttOptions.multiScreen
            ? ganttOptions.multiScreen.linkage
            : 'horizontal',
          customData: this._customData,
        },
        isTree: false,
        moduleName: this.module,
        pageid: this.pageId,
        //hidden: paneHidden,
        uniqueID: this.id,
      };

      if (this._treeEnabled) {
        customOptions.treeHandler = ganttOptions.treeHandler;
      }
      if (ganttOptions.timeHeader && ganttOptions.timeHeader.majorTickFormat) {
        customOptions.majorTickFormat = iFlightUtils.iflightJavaToChronosFormatter(
          ganttOptions.timeHeader.majorTickFormat
        );
      }
      const paneResizeCallback =
        ganttOptions.paneOptions.plotOptions.plotResize.resizeCallback;
      const paneResizeCallbackWrapper = function(xmin, xmax, plot) {
        if (paneResizeCallback) {
          paneResizeCallback(xmin, xmax, plot);
        }
        this.additionalFetchWrapper(plot.currentVisibleData);
      }.bind(this);

      ganttOptions.paneOptions.plotOptions.plotResize.resizeCallback = paneResizeCallbackWrapper;
      paneObjRef = services.initPane(
        newData,
        this._shadowRoot.querySelector('.ui-scrollBarVertical'),
        ds.getData('app', 'page', null, { id: this.pageId }).hScrollBar,
        this._shadowRoot.querySelector('.ui-gantt'),
        customOptions,
        ganttOptions.paneOptions
      );
      //creating ContextMenu
      this.setupContextMenu();
      if (paneObjRef && Object.keys(paneObjRef).length != 0) {
        services.pollPaneObject(this.pageId, this.id, 'iflight-gantt');
      }
      this._paneObject = paneObjRef;
      if (
        ganttOptions.splitPane &&
        ganttOptions.splitPane.singleRowSplit == true &&
        this.id.endsWith('_split')
      ) {
        paneObjRef.getOptions().series.gantt.maxTotalRows = 1;
      }
      if (this._paneObject.getPlotLabel() == 'ColumnHeader') {
        this._paneObject.setXAxisOptions('showLabel', true);
      } else {
        this._paneObject.setXAxisOptions('showLabel', false);
      }
      if (
        ganttOptions.currentTimeline !== undefined ||
        typeof ganttOptions.currentTimeline !== 'undefined'
      ) {
        services.drawCurrentTimeline(
          this._paneObject,
          ganttOptions.currentTimeline,
          this.getTimeModeVariance,
          caller
        );
        let selector =
          this._splitPaneEnabled || this._splitActive
            ? ganttOptions.plotLabel + '_split_' + this.pageId
            : ganttOptions.plotLabel + '_' + this.pageId;
        this.addCurrentTimeCallBack(function() {
          services.drawCurrentTimeline(
            this._paneObject,
            ganttOptions.currentTimeline,
            this.getTimeModeVariance,
            caller
          );
        }, selector);
      }

      if (multiScreenEnabled) {
        let lablWdth = {};
        if ($.getFromSessionStore('sId')[this._customData.key] == 0) {
          if ($.getFromLocalStore('g_lablWdth') != undefined) {
            labelWidth = $.getFromLocalStore('g_lablWdth')[
              this._customData.key
            ];
          }
          if (labelWidth == undefined) {
            labelWidth = {};
          }
          labelWidth[
            this._paneObject.getPlotLabel()
          ] = this._paneObject.getOptions().yaxis.labelWidth;
          lablWdth[this._customData.key] = labelWidth;
          $.putInLocalStore('g_lablWdth', lablWdth, true);
        }
        if ($.getFromSessionStore('sId')[this._customData.key] != 0) {
          let linkage = $.getFromLocalStore('linkage')
            ? $.getFromLocalStore('linkage')[this._customData.key]
            : null;
          if (window.linkage == 'horizontal' || linkage == 'horizontal') {
            this._paneObject.setYAxisOptions('showLabel', false);
            this._paneObject.setYAxisOptions('labelWidth', '0');
          }
          if (window.linkage == 'vertical' || linkage == 'vertical') {
            this._paneObject.setXAxisOptions('showLabel', false);
          }
        }
        this._paneObject.setupGrid();
        $.multiScreenScroll.setPaneObject(this._paneObject, false);
        layouts.setCustomKeyMap(this.pageid, this._customData.key);
      }

      if (this._treeEnabled) {
        customOptions.dataLoader = this.dataLoaderTree;

        if (Object.keys(this._paneObjectTree).length != 0) {
          this._paneObjectTree = {};
        }
        customOptions.isTree = true;
        this._paneObjectTree = services.initPane(
          newData,
          this._shadowRoot.querySelector('.ui-scrollBarVertical'),
          this._hScrollBar[this.id],
          this._shadowRoot.querySelector('.ui-gantt_tree'),
          customOptions,
          ganttOptions.paneOptions
        );
        if (
          this._paneObjectTree.getPlotLabel() == 'ColumnHeader' &&
          this._paneObjectTree.setXAxisOptions
        ) {
          this._paneObjectTree.setXAxisOptions('showLabel', true);
        } else {
          this._paneObjectTree.setXAxisOptions('showLabel', false);
        }

        if (
          ganttOptions.currentTimeline !== undefined ||
          typeof ganttOptions.currentTimeline !== 'undefined'
        ) {
          services.drawCurrentTimeline(
            this._paneObjectTree,
            ganttOptions.currentTimeline,
            this.getTimeModeVariance,
            caller
          );
          let selector = this._splitPaneEnabled
            ? ganttOptions.plotLabel + '_split_tree_' + this._pageIdRef
            : ganttOptions.plotLabel + '_tree_' + this._pageIdRef;
          this.addCurrentTimeCallBack(function() {
            services.drawCurrentTimeline(
              this._paneObjectTree,
              ganttOptions.currentTimeline,
              this.getTimeModeVariance,
              caller
            );
          }, selector);
        }

        if (multiScreenEnabled) {
          if ($.getFromSessionStore('sId')[this._customData.key] != 0) {
            var linkage = $.getFromLocalStore('linkage')
              ? $.getFromLocalStore('linkage')[this._customData.key]
              : null;
            if (window.linkage == 'horizontal' || linkage == 'horizontal') {
              this._paneObject.setYAxisOptions('showLabel', false);
              this._paneObject.setYAxisOptions('labelWidth', '0');
            }
            if (window.linkage == 'vertical' || linkage == 'vertical') {
              this._paneObject.setXAxisOptions('showLabel', false);
            }
          }
          this._paneObjectTree.setupGrid();
          $.multiScreenScroll.setPaneObject(this._paneObjectTree, true);
        }
      }

      if (
        this._treeEnabled &&
        ganttOptions.treeHandler.enableTreeAsDefault &&
        ganttOptions.treeHandler.enabled()
      ) {
        //this._shadowRoot.querySelector(".gantt-container_tree").show();
        //this._shadowRoot.querySelector(".gantt-container").hide();
      } else {
        //this._shadowRoot.querySelector(".gantt-container_tree").hide();
        //this._shadowRoot.querySelector(".gantt-container").show();
      }

      let paneHolder = this._shadowRoot.querySelector('.ui-gantt_holder');

      if (_(ganttOptions.plotObjectConsumer)) {
        let paneObjArr = [this._paneObject];
        this._paneObject.resetRowColumnDataRange = (
          rowHeaderIds,
          columnDataRange
        ) => {
          this._prevRequest = {};
          this._firstFetch = true;
          services.removeDoubleLineRows(this.pageid);
          this._paneObject.resetRowColumnDataRangeForGantt(
            rowHeaderIds,
            columnDataRange
          );
          if (this.splitHeaderId) {
            let start = this._paneObject.horizontalScrollBar.getViewValues()
              .minViewValue;
            this._paneObject.scrollToPosition(start, this.splitHeaderId);
          }
        };

        this.addOtherAPIs(this._paneObject);

        $(paneHolder)
          .get()[0]
          .addEventListener('dragleave', this.handlePaneLeave);

        if (this._treeEnabled) {
          paneObjArr.push(this._paneObjectTree);
          this._paneObjectTree.resetRootTreeNodeAndColumnRange = (
            rootTreeNode,
            columnDataRange
          ) => {
            this._prevRequest = {};
            this._firstFetch = true;
            services.removeDoubleLineRows(this.pageid);
            this._paneObjectTree.resetRootTreeNodeAndColumnRangeForGantt(
              rootTreeNode,
              columnDataRange
            );
            let start = this._paneObjectTree.horizontalScrollBar.getViewValues()
              .minViewValue;
            if (this.splitHeaderId) {
              let start = this._paneObjectTree.horizontalScrollBar.getViewValues()
                .minViewValue;
              this._paneObjectTree.scrollToPosition(start, this.splitHeaderId);
            }
          };
          this.addOtherAPIs(this._paneObjectTree);
          //$(paneHolder).get()[1].addEventListener('dragleave', this.handlePaneLeave);  check later
        }

        if (this._splitActive) {
          ganttOptions.plotObjectConsumer(paneObjArr, true, this._treeEnabled);
          let plot = getCurrentObjCallback();
          let isSplitEnabled =
            this.id.substr(this.id.length - 5) == 'split' ? true : false;
          if (ganttOptions.treeHandler && ganttOptions.treeHandler.enabled()) {
            services.toggleTreeView(
              paneObjArr,
              this._dataModel,
              this._treeEnabled,
              isSplitEnabled
            );
          }
        } else {
          ganttOptions.plotObjectConsumer(
            paneObjArr,
            false,
            this._treeEnabled,
            caller
          );
          /*if(ganttOptions.multiScreen.enabled){
                    	var localStoreParams = $.getAllFromLocalStore();
                    	var plot = getCurrentObjCallback();
                    	var customData = plot.getOptions().multiScreenFeature.customData
                    	if(localStoreParams && ganttOptions.multiScreen.callback && $.multiScreenScroll.getCurrScreenId(scope.customData.key) != 0){
                    		var extraParamsList = Object.keys(localStoreParams).map(function(key) {
                    			return [key, localStoreParams[key]];
                    			});
                    		$.each(extraParamsList, function(index, extraParam) {
                    			var multiscreenData = $.multiScreenScroll.getMultiscreenCurrentData(customData.key,extraParam[0]);
                    			if(multiscreenData){
                    				var label = this._paneObject.getPlotLabel();
                    				var params = {
                    						key : extraParam[0],
                    						data :  multiscreenData[label]
                    				}
                    				ganttOptions.multiScreen.callback(params);
                    			}
          		  			});
                    	}
                    }*/
        }
      }

      paneHolder = null; //clear DOM reference

      // Unhide pane toolbar once all panes are properly rendered
      const paneIconContainer = this._shadowRoot.querySelector(
        `.gantt_pane_icons_containter`
      );
      if (paneIconContainer) paneIconContainer.style.visibility = 'visible';
    }
  }
  ganttDataCallback(newData, caller) {
    if (
      newData &&
      this.dataModel &&
      typeof newData === 'object' &&
      this._paneObject != undefined &&
      this._paneObject.constructor.name == 'Chronos'
    ) {
      var isTree = false,
        plot,
        updateDataMap = newData.updateDataMap;
      if (
        this._treeEnabled &&
        this._paneObjectTree != undefined &&
        this._paneObjectTree.constructor.name == 'Chronos' &&
        newData.isTree
      ) {
        plot = this._paneObjectTree;
        isTree = true;
      } else {
        plot = this._paneObject;
      }
      delete newData.isTree;
      delete newData.updateDataMap;
      const uniqueId = this.id.split('ui-')[0];
      const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
      let highlightHeader = this.dataModel.highlightHeader;
      let highlightEntity = this.dataModel.highlightEntity;
      let scrollRangeChangeWrapperCallback = this.scrollRangeChangeWrapper.bind(
        this
      );
      Object.entries(newData).forEach(function(ganttDataObject, key) {
        key = ganttDataObject[0];
        var ganttData = ganttDataObject[1];
        switch (key) {
          case 'INIT': {
            if (false && this.doublelineEnabled) {
              var taskIdProviderCallBack = plot.getSeries().gantt
                .taskIdProviderCallBack;
              var doubleLineTypes = ganttOptions.doubleLine.itemTypes;
              var dataMap = ganttData.data.reduce(function(map, data) {
                if (includes(doubleLineTypes, data.ganttItemType)) {
                  var chronosId = taskIdProviderCallBack(data);
                  map[chronosId] = data;
                }
                return map;
              }, {});
              var rowObjectMap = ganttData.rowHeaders.reduce(function(
                map,
                data
              ) {
                map[data.rowId] = data;
                return map;
              },
              {});
              var doubleLines = services.createDoubleLines(
                this.pageid,
                dataMap,
                doubleLineTypes,
                [this._paneObject, this._paneObjectTree]
              );
              services.setDoubleLineRows(
                this.pageid,
                doubleLines.norRowList,
                doubleLines.treeRowList
              );
              var addDoubleLines = function(plot, rowList) {
                if (!rowList || (rowList && rowList.length == 0)) {
                  return;
                }
                var rowObjList = plot.getSeries().rowIdRowObjectMap,
                  headerObj,
                  currHeaderObj;
                plot.startBatchUpdate();
                $.each(rowList, function(index, rowId) {
                  currHeaderObj = rowObjectMap[rowId] || rowObjList[rowId];
                  if (currHeaderObj && currHeaderObj.data) {
                    currHeaderObj = currHeaderObj.data;
                  }
                  if (currHeaderObj) {
                    headerObj = $.extend({}, currHeaderObj);
                    headerObj.rowId = rowId + '^';
                    headerObj.doubleLine = true;
                    plot.insertRowAfter(rowId + '', headerObj);
                  } else {
                    console.log(
                      'Unable to find row object on data load for ',
                      rowId
                    );
                  }
                });
                plot.endBatchUpdate();
              };
              addDoubleLines(this._paneObject, doubleLines.norNewRows);
              if (
                elem._treeEnabled &&
                this._paneObjectTree != undefined &&
                Object.keys(this._paneObjectTree).length != 0
              ) {
                addDoubleLines(this._paneObjectTree, doubleLines.treeNewRows);
              }

              var currDoubleLines =
                  plot === this._paneObjectTree
                    ? doubleLines.treeRowList
                    : doubleLines.norRowList,
                currDoubleLineRowIds = Object.keys(currDoubleLines),
                newHeaderObjList = [];
              $.each(ganttData.rowHeaders, function(index, rowHeader) {
                var currIndex = currDoubleLineRowIds.indexOf(
                  rowHeader.rowId + ''
                );
                if (currIndex != -1) {
                  var headerObj = $.extend({}, rowHeader);
                  headerObj.rowId = rowHeader.rowId + '^';
                  headerObj.doubleLine = true;
                  newHeaderObjList.push(headerObj);
                }
              });
              ganttData.rowHeaders = $.merge(
                ganttData.rowHeaders,
                newHeaderObjList
              );
            }
            let args = { currentVisibleData: plot.currentVisibleData };
            scrollRangeChangeWrapperCallback(
              args,
              ganttData.additionalFetch,
              ganttData.rowHeaders,
              true
            );
            for (let i = 0; i < ganttData.data.length; i++) {
              ganttData.data[i].additionalFetch = ganttData.additionalFetch
                ? true
                : false;
            }
            if (updateDataMap) {
              plot.updateDataAndDraw(ganttData);
            } else {
              plot.updateGanttData(ganttData);
            }
            if (highlightHeader && plot.getRowHeaderObject(highlightHeader)) {
              plot.highlightARow(highlightHeader);
              if (highlightEntity && plot.getTaskById(highlightEntity)) {
                var item = {
                  rowId: highlightHeader,
                  chronosId: highlightEntity,
                };
                plot.scrollToTimeAndItemRowOnTop(null, item);
              } else {
                plot.scrollToPosition(null, highlightHeader);
              }
              highlightHeader = null;
            }
            if (highlightEntity && plot.getTaskById(highlightEntity)) {
              plot.highlightAnEntity(highlightEntity);
              highlightEntity = null;
            }
            /*if(splitCompletedSuccess != true && ganttOptions.splitPane != undefined && ganttOptions.splitPane.enableDefault && attrs.id.endsWith("_split") == false) {
    		                splitPane(ganttOptions.splitPane.pos);
    		                splitCompletedSuccess = true;
    	                }
						if (windowSwitched) {
							windowSwitched = false;
							spinnerService.unblock();
						}
                        if (_(ganttOptions.ganttLoadComplete)) {
                            scope.$eval(ganttOptions.ganttLoadComplete(isTree));
                        }*/
            break;
          }
          case 'NEW':
          case 'CHANGE': {
            plot.addNewTasksAndRowHeadersToBucket(ganttData);
            break;
          }
          case 'DELETE': {
            plot.removeTasksFromBucket(ganttData);
            break;
          }
        }
      });
    }
  }
  /**
		Logic to execute before invoking dataModelChangeCallbackFn.
	 */
  preRender(caller) {}

  /**
		Logic to execute after attributes of object(proxy) is changed.
		This will be called after the completion of dataModelChangeCallbackFn.
	 */
  postRender() {
    //Logic to execute after object callback is triggered
  }

  configModelChangeCallback(changeModel, caller) {
    if (changeModel.prop === 'timeModeVariance') {
      destroyEnableTimeModeVariance(changeModel.val, caller);
    }
    if (changeModel.prop === 'splitPane') {
      destroyEnableSplitPane(changeModel.val, caller);
    }
  }

  dataModelChangeCallback(changeModel, caller) {
    caller.preRender();

    if (changeModel.prop === 'initData') {
      caller.ganttInitDataCallbackTimer = setTimeout(() => {
        caller.ganttInitDataCallback(changeModel.val, caller);
      }, 500);
    }
    if (changeModel.prop === 'ganttData') {
      caller.ganttDataCallback(changeModel.val);
    }
    if (typeof caller._config.dataModelChangeCallbackFn === 'function') {
      caller._config.dataModelChangeCallbackFn(changeModel);
    }

    caller.postRender();
  }
  updateFocusedElement() {
    let ganttOptions = this._configProxy.configModel;
    if (this.id.indexOf('_split') != -1) {
      services.setSplitPaneFocused(true, this.pageId, ganttOptions.plotLabel);
    } else {
      services.setSplitPaneFocused(false, this.pageId, ganttOptions.plotLabel);
    }
  }

  hideAndResetTooltip() {
    this._allowTooltipDisplay = false;
    $('#' + this.pageId + '-tooltip').hide();
    this._prevTip = {
      id: null,
      state: null,
      pane: null,
    };
    services.setPrevTip(this._prevTip);
    if (this._tooltipTimer != null || this._tooltipTimer != undefined) {
      clearTimeout(this._tooltipTimer);
      this._tooltipTimer = null;
    }
  }

  paneLeaveHandler(event) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    elem.hideAndResetTooltip();
    if (ganttOptions.leaveGantt != undefined) {
      eval(ganttOptions.leaveGantt());
    }
  }

  setupContextMenu() {
    const uniqueID = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueID];
    let ganttOptions = this._configProxy.configModel;
    if (
      ganttOptions.menuHandler &&
      _(ganttOptions.menuHandler.callback) &&
      _(ganttOptions.menuHandler.options)
    ) {
      var contextMenuObj = {
        zIndex: 3,
        reposition: false,
        build: function($trigger, event) {
          var allowMenu = true,
            plot;
          if (
            allowMenu &&
            elem._paneObject &&
            elem._paneObject.constructor.name == 'Chronos'
          ) {
            plot = elem._paneObject;
            if (this._treeEnabled && ganttOptions.treeHandler.enabled()) {
              plot = elem._paneObjectTree;
            }
            var offset = plot.offset(),
              plotOffset = plot.getPlotOffset(),
              newCanvasX = event.pageX - offset.left - plotOffset.left,
              newCanvasY = event.pageY - offset.top - plotOffset.top,
              hoverItem,
              type,
              pos = {};
            var hoveredArea = plot.findHoveredArea(event),
              hoveredAreaLabel =
                hoveredArea && hoveredArea.label ? hoveredArea.label : '';
            if (hoveredAreaLabel === 'PLOT_BODY') {
              hoverItem = plot.findItemOnGantt(newCanvasX, newCanvasY);
              pos = plot.c2p({ left: newCanvasX, top: newCanvasY });
              if (pos.y) {
                pos.rowId = plot.retrieveActualRowId(Math.round(pos.y));
              }
              var rowHeaderObject = plot.getSeries().rowIdRowObjectMap[
                pos.rowId
              ];
              if (rowHeaderObject && rowHeaderObject.isLeafNode == false) {
                type = 'header';
                hoverItem = rowHeaderObject.data;
              } else if (hoverItem == null || hoverItem == undefined) {
                type = 'pane';
              } else {
                type = 'item';
                hoverItem = hoverItem.details;
              }
            } else if (hoveredAreaLabel === 'ROW_HEADER_ITEM') {
              type = 'header';
              var series = plot.getSeries();
              var rowId = plot.retrieveActualRowId(
                Math.round(series.yaxis.c2p(newCanvasY))
              );
              hoverItem = series.rowIdRowObjectMap[rowId];
              if (plot == elem._paneObjectTree) {
                hoverItem = hoverItem.data;
              }
            } else if (
              hoveredAreaLabel === 'COLUMN_HEADER_AREA' &&
              ganttOptions.menuHandler.allowTime
            ) {
              type = 'time';
              hoverItem = hoveredArea;
            } else {
              return false;
            }
            if (hoverItem) {
              if (hoverItem.chronosId) {
                var highlightedItems = plot.getAllHighlights(),
                  isHighlighted = false;
                if (highlightedItems.length > 1) {
                  highlightedItems.forEach(function(currentItem) {
                    if (currentItem.chronosId == hoverItem.chronosId) {
                      isHighlighted = true;
                      return;
                    }
                  });
                  if (!isHighlighted) {
                    plot.clearAllhighlights();
                  }
                } else {
                  plot.clearAllhighlights();
                }
                plot.highlightAnEntity(hoverItem.chronosId);
              } else {
                //Row object
                var rowIdProp = plot.getSeries().gantt.rowIdAttribute;
                if (hoverItem[rowIdProp]) {
                  var highlightedRows = plot.getAllRowHighlights(),
                    isHighlighted = false;
                  if (highlightedRows.length > 1) {
                    highlightedRows.forEach(function(currentRow) {
                      if (parseInt(currentRow) == hoverItem[rowIdProp]) {
                        isHighlighted = true;
                        return;
                      }
                    });
                    if (!isHighlighted) {
                      plot.clearAllRowhighlights();
                    }
                  } else {
                    plot.clearAllRowhighlights();
                  }
                  if (ganttOptions.avoidRightClickHighlight !== true) {
                    plot.highlightARow(hoverItem[rowIdProp]);
                  }
                }
              }
            } else {
              // Sierra Fix - to prevent deselection of selected items on right click outside pane items
              // plot.clearAllhighlights();
            }
            plot.drawHighLightOverlay();

            var callBackWrapper = function(menukey, options) {
              ganttOptions.menuHandler.callback(
                menukey,
                options,
                hoverItem,
                pos
              );
            };

            var retObj = {
              callback: callBackWrapper,
              items: ganttOptions.menuHandler.options(
                type,
                hoverItem,
                event,
                pos
              ),
            };
            return retObj;
          }
        },
      };
      contextMenuObj.selector = '#' + elem.id;
      contextMenuObj.className = 'iflight_gantt_context_menu';
      let contextMenuTimer;
      contextMenuObj.events = {
        show: options => {
          if (ganttOptions.menuHandler.title) {
            const mode = ganttOptions.menuHandler.title.mode || 'selection';
            const title = isFunction(ganttOptions.menuHandler.title.callback)
              ? ganttOptions.menuHandler.title.callback(options)
              : '';
            const element = document.querySelector(
              '.iflight_gantt_context_menu'
            );

            if (title && element) {
              let menuTitle;
              if (mode === 'selection') {
                const plot = this.getCurrentObjCallback();
                const selectedItems = plot.getAllGanttHighlights();
                const selectedItemsCount = selectedItems
                  ? selectedItems.length
                  : 0;
                if (selectedItemsCount > 1) {
                  menuTitle = `${selectedItemsCount} ${title}`;
                  element.classList.add('context-menu-title');
                  element.setAttribute('data-menutitle', menuTitle);
                }
              } else {
                menuTitle = title;
                element.classList.add('context-menu-title');
                element.setAttribute('data-menutitle', menuTitle);
              }
              contextMenuTimer = setTimeout(() => {
                const element = document.querySelector(
                  '.iflight_gantt_context_menu'
                );
                if (
                  menuTitle &&
                  element &&
                  !element.classList.contains('context-menu-title')
                ) {
                  element.classList.add('context-menu-title');
                  element.setAttribute('data-menutitle', menuTitle);
                }
              }, 50);
            }
          }
        },
        hide: options => {
          clearTimeout(contextMenuTimer);
          if (ganttOptions.menuHandler.title) {
            const element = document.querySelector(
              '.iflight_gantt_context_menu'
            );
            if (element) element.classList.remove('context-menu-title');
          }
        },
      };

      $.contextMenu(contextMenuObj);
      this._preventContextMenu = function() {
        return false;
      };
    }
  }

  columnHeaderSelectingHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    iFlightEventBus.emitEvent('colHeadSelecting', [
      elem.pageId,
      ganttOptions.plotLabel,
      data.columnHeaderSelectionObject,
    ]);
  }

  taskTrackerMovedHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    iFlightEventBus.emitEvent('taskTrackerMoved', [
      elem.pageId,
      ganttOptions.plotLabel,
      data.trackedTaskForMarking,
      elem.getPlaceholderId(),
    ]);
  }

  mouseTrackerMovedHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    iFlightEventBus.emitEvent('mouseTrackerMoved', [
      elem.pageId,
      ganttOptions.plotLabel,
      data.currentMousePosition,
      elem.getPlaceholderId(),
    ]);
  }

  getPlaceholderId() {
    if (this._treeEnabled && this._paneObjectTree) {
      return this._paneObjectTree.getPlaceholder().attr('id');
    } else {
      return this._paneObject.getPlaceholder().attr('id');
    }
  }

  // multiScreenChangeEvent event handler
  multiScreenChangeEventHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let key = data.key,
      newData = JSON.parse(data.value),
      customData = elem.paneObject.getOptions().multiScreenFeature.customData;
    if (newData) {
      newData = newData[customData.key];
      let item = {
        event: event,
        key: key,
        data: newData ? newData[elem.paneObject.getPlotLabel()] : {},
        isTree: data.treeEnabled ? true : false,
      };
      if (_(ganttOptions.multiScreen.callback)) {
        ganttOptions.multiScreen.callback(item);
      }
    }
  }

  multiScreenScreenOpenHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback();
    if (
      $.inArray(ganttOptions.plotLabel, data.openedPanes) != -1 &&
      !plot.isPaneOpen() &&
      ganttOptions.multiScreen &&
      ganttOptions.multiScreen.callback
    ) {
      let item = {
        action: 'paneOpen',
        event: event,
      };
      ganttOptions.multiScreen.callback(item);
    }
  }

  clearAllExtraParams() {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (ganttOptions.multiScreen) {
      for (let paramName in ganttOptions.multiScreen.extraParams) {
        $.deleteFromLocalStore(paramName);
      }
    }
  }

  // multiScreenScreenClose event handler
  multiScreenScreenCloseHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback();
    if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
      if (
        data &&
        $.inArray(ganttOptions.plotLabel, data.closedPanes) != -1 &&
        plot.isPaneOpen() &&
        ganttOptions.multiScreen.callback
      ) {
        elem.paneCloseHandler();
      } /*else if(!data && $.getFromLocalStore ('nOfS') < 2) {
	                        	 Triggered on browser refresh/close
	                        	clearAllExtraParams();
	                        }*/
    }
    let customData = plot.getOptions().multiScreenFeature.customData;
    let screenId = $.getFromSessionStore('sId')[customData.key];
    let topPane = services.getTopPane(pageIdRef);
    if (screenId == 0) {
      if (window.linkage == 'horizontal') {
        plot.setYAxisOptions('showLabel', true);
        plot.setYAxisOptions(
          'labelWidth',
          $.getFromLocalStore('g_lablWdth')[customData.key][plot.getPlotLabel()]
        );
      }
      if (
        window.linkage == 'vertical' &&
        topPane &&
        topPane === uniqueID &&
        plot
      ) {
        //plot.setXAxisOptions('showLabel', true);
      }
      plot.setupGrid();
      plot.draw(true);
    }
  }

  emptyPlotclickHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    if (elem._splitPaneEnabled) {
      let message = localization.getMessage('SPLIT_EMPTY_PLOTCLICK');
      iFlightUIMessaging.showWarningMessage(elem, elem.pageid, message);
    }
  }

  // mouseButtonRightClick event handler
  mouseButtonRightClickHandler(event, pos, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    elem.updateFocusedElement();
    if (data && data.ganttItemType) {
      elem._restrictTooltip = true;
      let restrict = false;
      let completedItemsType = ganttOptions.completedItems.itemTypes;
      if (
        completedItemsType !== null &&
        completedItemsType !== undefined &&
        typeof completedItemsType !== 'undefined'
      ) {
        completedItemsType.forEach(function(itemType, key) {
          if (itemType == data.ganttItemType) {
            if (!showCompleted) {
              if (_(ganttOptions.completedItems.itemProviderCallback)) {
                let show = ganttOptions.completedItems.itemProviderCallback(
                  data
                );
                if (!show) {
                  restrict = true;
                }
              } else {
                let showDate = iFlightUtils.getDate();
                showDate = ganttCommonService.getTimeOnDST(showDate);
                if (showDate >= data.end) {
                  restrict = true;
                }
              }
            }
          }
        });
      }
      if (
        ganttOptions.interationRestrictMap.hasOwnProperty(data.ganttItemType)
      ) {
        let interationRestrict =
          ganttOptions.interationRestrictMap[data.ganttItemType];
        let callback = interationRestrict.callback,
          actions = interationRestrict.actions;
        if (_.contains(actions, 'itemMenu')) {
          restrict = false;
          if (_(callback) && callback(data, 'itemMenu')) {
            restrict = true;
          }
        }
      }

      if (!restrict) {
        let item = {
          data: data,
          event: event,
          pos: pos,
          dragDropObj: {},
        };

        if (
          ganttOptions.subTaskSelectionMode &&
          ganttOptions.subTaskSelectionMode.isEnabled() &&
          _(ganttOptions.subTaskSelectionMode.subTaskSetter)
        ) {
          elem.selectSubtasks(event, pos, data, true);
        }

        if (ganttOptions.itemMenu && _(ganttOptions.itemMenu)) {
          eval(ganttOptions.itemMenu(item));
        }
      }
    } else {
      let item = {
        data: {},
        event: event,
        pos: pos,
        dragDropObj: {},
      };
      if (ganttOptions.paneMenu && _(ganttOptions.paneMenu)) {
        eval(ganttOptions.paneMenu(item));
      }
    }
  }

  plotzoomHandler(event, data, args) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback(),
      options = plot.getOptions(),
      viewValue = plot.horizontalScrollBar.getViewValues(),
      totalRowCount = services.getTotalRowsCount(plot, elem.pageId),
      zoomConfig = services.getZoomConfig(
        elem.pageId,
        elem._paneObject.getPlotLabel()
      ),
      zoomTo = zoomConfig ? zoomConfig.zoomTo : null,
      zoomLevel,
      displayWeek = elem._paneObject.getOptions().xaxis.multiLineTimeHeader
        .displayWeek.enable,
      minZoomInColumnLevel = services.getMinZoomInLevel(elem.module), // In days
      maxZoomOutColumnLevel = services.getMaxZoomOutLevel(elem.module); // In days
    let zoomParameters = {
      rowZoomParameter: 1,
      columnZoomParameter: 2,
    };
    let curZoomObject = {
      minTickHeight: 0,
      zoomOffset: 1,
      zoomLevel: 0,
      zoomRowCount: 0,
      zoomTo: 'days',
    };
    let labelMarginOffset = 0;
    if (plot.getSeries().xaxis.labelHeight > 0) {
      labelMarginOffset = plot.getOptions().grid.labelMargin * 2; // taken twice to consider labelMargin and extraLabelMargin
    }
    curZoomObject.zoomLevel =
      (viewValue.maxViewValue - viewValue.minViewValue) / 86400000;
    curZoomObject.minTickHeight = options.series.gantt.minTickHeight;
    curZoomObject.zoomRowCount =
      (plot.height() + labelMarginOffset) / curZoomObject.minTickHeight;
    curZoomObject.paneHeight = plot.height();
    curZoomObject.paneId = plot.getUniqueId(plot.getGanttFromPlot());
    curZoomObject.dateVal = getUTCDateForTimeInMilliseconds(
      viewValue.minViewValue,
      false
    );
    if (args.direction == 'zoomOut') {
      totalRowCount = totalRowCount * zoomParameters.rowZoomParameter;
      zoomLevel = curZoomObject.zoomLevel * zoomParameters.columnZoomParameter;
      if (zoomTo == 'hours' && zoomLevel > 24 * maxZoomOutColumnLevel) {
        zoomLevel = zoomLevel / 24;
        zoomTo = 'days';
      } else if (zoomTo == 'days' && zoomLevel > maxZoomOutColumnLevel) {
        zoomLevel = maxZoomOutColumnLevel;
        if (displayWeek && zoomLevel >= 7) {
          zoomLevel = zoomLevel / 7;
          zoomTo = 'weeks';
        } else if (zoomLevel >= 30) {
          zoomLevel = zoomLevel / 30;
          zoomTo = 'months';
        }
      } else if (zoomTo == 'weeks' && zoomLevel > maxZoomOutColumnLevel / 7) {
        zoomLevel = maxZoomOutColumnLevel / 7;
        if (displayWeek && zoomLevel >= 4) {
          zoomTo = 'weeks';
        } else {
          zoomTo = 'days';
        }
      } else if (zoomTo == 'months' && zoomLevel > maxZoomOutColumnLevel / 30) {
        zoomLevel = maxZoomOutColumnLevel / 30;
      }
    } else {
      totalRowCount = totalRowCount / zoomParameters.rowZoomParameter;
      zoomLevel = curZoomObject.zoomLevel / zoomParameters.columnZoomParameter;
      if (zoomTo == 'months' && zoomLevel < minZoomInColumnLevel / 30) {
        zoomLevel = minZoomInColumnLevel;
        if (displayWeek && minZoomInColumnLevel >= 7) {
          zoomLevel = zoomLevel / 7;
          zoomTo = 'weeks';
        } else {
          zoomTo = 'days';
        }
      } else if (zoomTo == 'weeks' && zoomLevel < minZoomInColumnLevel / 7) {
        zoomLevel = minZoomInColumnLevel;
        zoomTo = 'days';
      } else if (zoomTo == 'days' && zoomLevel < minZoomInColumnLevel) {
        zoomLevel = minZoomInColumnLevel;
        if (minZoomInColumnLevel >= 24) zoomTo = 'days';
        else {
          zoomLevel = minZoomInColumnLevel * 24;
          zoomTo = 'hours';
        }
      } else if (zoomTo == 'hours' && zoomLevel < minZoomInColumnLevel * 24) {
        zoomLevel = minZoomInColumnLevel;
        if (minZoomInColumnLevel >= 24) zoomTo = 'days';
        else {
          zoomLevel = minZoomInColumnLevel * 24;
          zoomTo = 'hours';
        }
      }
    }
    curZoomObject.zoomTo = zoomTo;
    curZoomObject.zoomLevel = zoomLevel;
    services.setZoomConfig(
      curZoomObject,
      elem.pageId,
      elem._paneObject.getPlotLabel()
    );
    services.setCustomZoomObject(
      curZoomObject.dateVal,
      curZoomObject.zoomTo,
      curZoomObject.zoomLevel,
      totalRowCount,
      curZoomObject.zoomOffset,
      elem.pageId
    );
  }

  // rowHeaderDoubleClick event handler
  rowHeaderDoubleClickHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    elem.updateFocusedElement();
    if (data != undefined || data != null) {
      elem._restrictTooltip = true;
      let restrict = false;
      if (
        ganttOptions.interationRestrictMap.hasOwnProperty(data.ganttItemType)
      ) {
        let interationRestrict =
          ganttOptions.interationRestrictMap[data.ganttItemType];
        let callback = interationRestrict.callback,
          actions = interationRestrict.actions;
        if (_.contains(actions, 'headerDClick')) {
          restrict = false;
          if (_(callback) && callback(data, 'headerDClick')) {
            restrict = true;
          }
        }
      }

      if (
        data.rowHeaderInfo &&
        data.rowHeaderInfo.spots &&
        data.rowHeaderInfo.spots.length > 0
      ) {
        let plot = elem.getCurrentObjCallback();
        let pos = {
          x: data.currentPosition.x,
          y: data.currentPosition.y,
        };
        data.activeSpot = getSelectedSpot(pos, data.rowHeaderInfo, plot);
      }

      if (!restrict) {
        let item = {
          data: data,
          event: event,
          dragDropObj: {},
        };
        if (ganttOptions.headerDClick && _(ganttOptions.headerDClick)) {
          eval(ganttOptions.headerDClick(item));
        }
      }
    }
  }

  // rectangleSelectionEnd event handler
  plotDoubleclickHandler(event, pos, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    elem.updateFocusedElement();
    let item = {
      data: data,
      event: event,
      pos: pos,
      dragDropObj: null,
    };
    if (ganttOptions.paneDClick && _(ganttOptions.paneDClick)) {
      eval(ganttOptions.paneDClick(item));
    }
  }

  // objectDoubleclick event handler
  objectDoubleclickHandler(event, pos, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    elem.updateFocusedElement();
    if (data != undefined || data != null) {
      elem.restrictTooltip = true;
      let restrict = false;
      let completedItemsType = ganttOptions.completedItems.itemTypes;
      if (
        completedItemsType !== null &&
        completedItemsType !== undefined &&
        typeof completedItemsType !== 'undefined'
      ) {
        completedItemsType.forEach(function(itemType, key) {
          if (itemType == data.ganttItemType) {
            if (!showCompleted) {
              if (_(ganttOptions.completedItems.itemProviderCallback)) {
                let show = ganttOptions.completedItems.itemProviderCallback(
                  data
                );
                if (!show) {
                  restrict = true;
                }
              } else {
                let showDate = iFlightUtils.getDate();
                showDate = services.getTimeOnDST(showDate);
                if (showDate >= data.end) {
                  restrict = true;
                }
              }
            }
          }
        });
      }
      if (
        ganttOptions.interationRestrictMap.hasOwnProperty(data.ganttItemType)
      ) {
        let interationRestrict =
          ganttOptions.interationRestrictMap[data.ganttItemType];
        let callback = interationRestrict.callback,
          actions = interationRestrict.actions;
        if (_.contains(actions, 'itemDClick')) {
          restrict = false;
          if (_(callback) && callback(data, 'itemDClick')) {
            restrict = true;
          }
        }
      }

      if (data.spots && data.spots.length > 0) {
        let plot = getCurrentObjCallback();
        let offset = plot.offset(),
          plotOffset = plot.getPlotOffset();
        let selectedPosition = {
          x: event.originalEvent.pageX - offset.left - plotOffset.left,
          y: event.originalEvent.pageY - offset.top - plotOffset.top,
        };
        data.activeSpot = getSelectedSpot(selectedPosition, data, plot);
      }

      if (!restrict) {
        let item = {
          data: data,
          event: event,
          pos: pos,
          dragDropObj: {},
        };
        if (ganttOptions.itemDClick && _(ganttOptions.itemDClick)) {
          eval(ganttOptions.itemDClick(item));
        }
      }
    }
  }

  // rectangleSelectionEnd event handler
  rectangleSelectionEndHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let item = {
      data: data,
      event: event,
      dragDropObj: null,
    };
    if (ganttOptions.rectSelEnd && _(ganttOptions.rectSelEnd)) {
      eval(ganttOptions.rectSelEnd(item));
    }
  }

  // columnHeaderClick event handler
  columnHeaderClickHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (data != undefined || data != null) {
      let plot = elem.getCurrentObjCallback();
      let item = {
        data: data,
        event: event,
        selectDays: plot.getAllTickHighlights(),
      };
      let isDayNotMajorTick =
        plot.getSeries().xaxis.majorTickSize[1] == 'week' ||
        plot.getSeries().xaxis.majorTickSize[1] == 'month';
      let day = 86400000;
      let tickDetailsList;
      if (plot.getAllTickHighlights().length == 1) {
        tickDetailsList = [];
      }
      for (let key in plot.tickHighlights) {
        let tick = plot.tickHighlights[key];
        if (tick.type == 'MAJOR_TICK' && isDayNotMajorTick) {
          for (
            let currDay = tick.startTick + day;
            currDay < tick.endTick;
            currDay += day
          ) {
            item.selectDays.push(currDay + '');
          }
        }
        tickDetailsList.push(tick);
      }
      if (ganttOptions.timeBarClick && _(ganttOptions.timeBarClick)) {
        item.data.currentTime = Math.floor(item.data.currentTime);
        eval(ganttOptions.timeBarClick(item));
      }
      plot.drawHighLightOverlay();
      iFlightEventBus.emitEvent('colHeadClick', [
        elem.pageId,
        ganttOptions.plotLabel,
        item,
      ]);
      if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
        $.deleteFromLocalStore('g_hlClmn');
        highlightedColumn[elem._paneObject.getPlotLabel()] = tickDetailsList;
        let hlColumn = {};
        hlColumn[elem._customData.key] = highlightedColumn;
        $.putInLocalStore('g_hlClmn', hlColumn);
      }
    }
  }

  // rowHeaderClick event handler
  rowHeaderClickHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback();
    let key = elem.pageid + '_' + 'isSplitDone';
    let isSplitDone = services.getGanttViews()[key]
      ? services.getGanttViews()[key].value
      : false;
    let isSplitEnabled = elem._splitPaneEnabled;
    if (
      isSplitEnabled &&
      ganttOptions.treeHandler &&
      !ganttOptions.treeHandler.enabled() &&
      !isSplitDone
    ) {
      plot.getPlaceholder().data('preventDefault', true);
      let pos = {
        x: data.currentPosition.x,
        y: data.currentPosition.y,
      };
      elem.splitId = data.rowHeaderInfo.rowId + '';
      splitPane(pos);
      let view = {
        key: [key],
        value: true,
      };
      services.addGanttView(view);
    } else {
      elem._restrictTooltip = true;
      elem.updateFocusedElement();
      plot.triggerHeaderClickableAction(event.originalEvent);
      plot.getPlaceholder().data('preventDefault', true);
      if (
        data.rowHeaderInfo &&
        data.rowHeaderInfo.spots &&
        data.rowHeaderInfo.spots.length > 0
      ) {
        let plot = elem.getCurrentObjCallback();
        let pos = {
          x: data.currentPosition.x,
          y: data.currentPosition.y,
        };
        data.activeSpot = getSelectedSpot(pos, data.rowHeaderInfo, plot);
      }
      let item = {
        data: data,
        event: event,
        dragDropObj: null,
      };
      if (ganttOptions.headerClick && _(ganttOptions.headerClick)) {
        eval(ganttOptions.headerClick(item));
      }
      if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
        $.deleteFromLocalStore('g_hlRw');
        highlightedRow[
          elem._paneObject.getPlotLabel()
        ] = plot.getAllRowHighlights();
        let hlRow = {};
        hlRow[elem._customData.key] = highlightedRow;
        $.putInLocalStore('g_hlRw', hlRow);
        if (
          ganttOptions.treeHandler &&
          ganttOptions.treeHandler.enabled() &&
          _(ganttOptions.treeCollapseActionHandler)
        ) {
          ganttOptions.treeCollapseActionHandler(event, data.rowHeaderInfo);
        }
      }
    }
  }

  mousemoveHandler(event) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (elem.paneObject && elem.paneObject.constructor.name == 'Chronos') {
      var plot = elem.paneObject;
      var hideTooltip = function(plot) {
        if (plot.constructor.name == 'Chronos') {
          var offset = plot.offset(),
            plotOffset = plot.getPlotOffset(),
            canvasX = event.pageX - offset.left,
            canvasY = event.pageY - offset.top,
            plotWidth = plot.width(),
            plotHeight = plot.height();
          if (
            !(
              canvasX > plotOffset.left &&
              canvasX < plotOffset.left + plotWidth &&
              canvasY > plotOffset.top &&
              canvasY < plotOffset.top + plotHeight
            )
          ) {
            elem.hideAndResetTooltip();
          }
        }
      };
      if (
        elem._treeEnabled &&
        elem.paneObjectTree &&
        elem.paneObject.constructor.name == 'Chronos' &&
        ganttOptions.treeHandler.enabled()
      ) {
        plot = elem.paneObjectTree;
      }
      hideTooltip(plot);
    }
  }

  mouseleaveHandler(event) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    $('#' + elem.pageId + '-tooltip').hide();
    if (elem._tooltipTimer != null || elem._tooltipTimer != undefined) {
      clearTimeout(elem._tooltipTimer);
      elem._tooltipTimer = null;
    }
  }

  // rowHeaderMouseButtonRightClick event handler
  rowHeaderMouseButtonRightClickHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback();
    elem.updateFocusedElement();
    elem._restrictTooltip = true;
    let item = {
      data: data,
      event: event,
      dragDropObj: null,
    };
    if (ganttOptions.headerMenu && _(ganttOptions.headerMenu)) {
      eval(ganttOptions.headerMenu(item));
    }
  }

  allowTreeNodeToggleHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let plot = elem.getCurrentObjCallback();
    if (
      elem._splitPaneEnabled &&
      !elem._splitActive &&
      $('#' + elem.id + '_split').length == 0 &&
      elem.id.substr(elem.id.length - 5) != 'split'
    ) {
      plot.getPlaceholder().data('allowToggle', false); // doesn't allow the expanded node to collapse
      elem.splitOnTreeNodeClickHandler(event, data);
    } else {
      plot.getPlaceholder().data('allowToggle', true); // allow the collapsed node to expand
    }
  }

  updateRulerArea(rulerArea) {
    if (this._enableRuler && rulerArea) {
      this._userRulerArea = rulerArea;
      let plot = this.getCurrentObjCallback();
      let ganttOptions = this._configProxy.configModel;
      let itemFrom = {
        end: this._userRulerArea.start,
      };
      let itemTo = {
        start: this._userRulerArea.end,
      };
      plot.setTrackedArea(itemFrom.end, itemTo.start);
      iFlightEventBus.emitEvent('taskTrackerMoved', [
        this.pageId,
        ganttOptions.plotLabel,
        plot.getTrackedTask(),
        this.getPlaceholderId(),
      ]);
    } else {
      this._userRulerArea = null;
    }
  }

  plothoverHandler(event, pos, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (elem._userRulerArea) {
      elem._userRulerArea = null;
    } else {
      let plot = elem.getCurrentObjCallback();
      let rulerData = services.getRulerData();
      if (rulerData && rulerData.data && !plot.getTrackedTask()) {
        plot.drawTaskTrackerOnMouseMove(rulerData.data);
      }
    }
    if (data != undefined || data != null) {
      elem._restrictTooltip = false;
      let restrict = false;
      let completedItemsType = ganttOptions.completedItems.itemTypes;
      if (
        completedItemsType !== null &&
        completedItemsType !== undefined &&
        typeof completedItemsType !== 'undefined'
      ) {
        completedItemsType.forEach(function(itemType, key) {
          if (itemType == data.ganttItemType) {
            if (!showCompleted) {
              if (_(ganttOptions.completedItems.itemProviderCallback)) {
                let show = ganttOptions.completedItems.itemProviderCallback(
                  data
                );
                if (!show) {
                  restrict = true;
                }
              } else {
                let showDate = iFlightUtils.getDate();
                showDate = services.getTimeOnDST(showDate);
                if (showDate >= data.end) {
                  restrict = true;
                }
              }
            }
          }
        });
      }
      if (
        ganttOptions.interationRestrictMap.hasOwnProperty(data.ganttItemType)
      ) {
        let interationRestrict =
          ganttOptions.interationRestrictMap[data.ganttItemType];
        let callback = interationRestrict.callback,
          actions = interationRestrict.actions;
        if (_.contains(actions, 'itemHover')) {
          restrict = false;
          if (_(callback) && callback(data, 'itemHover')) {
            restrict = true;
          }
        }
      }

      if (!restrict) {
        let item = {
          data: data,
          pos: pos,
          event: event,
          dragDropObj: {},
        };
        if (ganttOptions.itemHover && _(ganttOptions.itemHover)) {
          eval(ganttOptions.itemHover(item));
        }
      }
      if (ganttOptions.toolTipDataLoader) {
        elem._prevTip = services.getPrevTip();
        if (elem._prevTip.id != data.id) {
          elem.hideAndResetTooltip();
        }
        if (_(ganttOptions.toolTipDataLoader.getData)) {
          let showTip = function(text) {
            let activeTabId = ds.getData('app', 'activeTabID', null, {
              id: elem.pageId,
            });
            if (
              activeTabId == elem.pageId &&
              elem._allowTooltipDisplay &&
              !elem._restrictTooltip
            ) {
              let offset = $('#' + elem.pageId)
                  .find('.graph_box')
                  .offset(),
                extraPad = 50;
              let top = pos.pageY - offset.top + 25,
                left = pos.pageX - offset.left + 5,
                right = 'auto',
                bottom = 'auto';
              $('#' + elem.pageId + '-tooltip')
                .html(text)
                .css({
                  top: top,
                  left: left,
                  right: right,
                });
              if (
                left + $('#' + elem.pageId + '-tooltip').width() + extraPad >=
                $('#' + elem.pageId)
                  .find('.graph_box')
                  .width()
              ) {
                right = 0;
                left = 'auto';
              }
              $('#' + elem.pageId + '-tooltip').css({
                left: left,
                right: right,
              });
              if (
                top + $('#' + elem.pageId + '-tooltip').height() + extraPad >=
                $('#' + elem.pageId)
                  .find('.graph_box')
                  .height()
              ) {
                top =
                  top - $('#' + elem.pageId + '-tooltip').height() - extraPad;
              }
              $('#' + elem.pageId + '-tooltip')
                .css({
                  top: top,
                  bottom: bottom,
                })
                .fadeIn(200);
            }
          };
          if (!elem._tooltipTimer) {
            let currState;
            let currData = JSON.parse(JSON.stringify(data));
            elem._prevTip = services.getPrevTip();
            if (
              ganttOptions.toolTipDataLoader.getItemtype &&
              _(ganttOptions.toolTipDataLoader.getItemtype)
            ) {
              currState = ganttOptions.toolTipDataLoader.getItemtype(
                currData,
                event.originalEvent
              );
              if (elem._prevTip.state != currState) {
                elem.hideAndResetTooltip();
              }
            }
            if (elem._prevTip.id != currData.id) {
              if (elem._prevTip.pane != ganttOptions.plotLabel) {
                elem.hideAndResetTooltip();
              }
              elem._tooltipTimer = setTimeout(function() {
                elem._tooltipTimer = null;
                elem._prevTip = {
                  id: currData.id,
                  state: currState,
                  pane: ganttOptions.plotLabel,
                };
                services.setPrevTip(elem._prevTip);
                elem._allowTooltipDisplay = true;
                if (!elem._restrictTooltip) {
                  ganttOptions.toolTipDataLoader.getData(
                    currData,
                    showTip,
                    event.originalEvent,
                    pos
                  );
                }
              }, 500);
            }
          }
        }
      }
    } else {
      elem.hideAndResetTooltip();
      if (ganttOptions.plotHover && _(ganttOptions.plotHover)) {
        eval(ganttOptions.plotHover(event, data));
      }
    }
  }

  columnHeaderHoverHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (ganttOptions.columnHeaderHover && _(ganttOptions.columnHeaderHover)) {
      eval(ganttOptions.columnHeaderHover(event, data));
    }
  }

  // rowHeaderHover event handler
  rowHeaderHoverHandler(event, data, pos) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (data != undefined || data != null) {
      elem._restrictTooltip = false;
      let restrict = false;
      if (
        ganttOptions.interationRestrictMap.hasOwnProperty(data.ganttItemType)
      ) {
        let interationRestrict =
          ganttOptions.interationRestrictMap[data.ganttItemType];
        let callback = interationRestrict.callback,
          actions = interationRestrict.actions;
        if (_.contains(actions, 'headerHover')) {
          restrict = false;
          if (_(callback) && callback(data, 'headerHover')) {
            restrict = true;
          }
        }
      }
      if (!restrict) {
        let item = {
          data: data,
          pos: pos,
          event: event,
        };
        if (ganttOptions.headerHover && _(ganttOptions.headerHover)) {
          eval(ganttOptions.headerHover(item));
        }
      }
      if (ganttOptions.toolTipDataLoader) {
        elem._prevTip = services.getPrevTip();
        if (elem._prevTip.rowId != data.rowHeaderInfo.rowId) {
          elem.hideAndResetTooltip();
        }
        if (_(ganttOptions.toolTipDataLoader.getData)) {
          let showTip = function(text) {
            let activeTabId = ds.getData('app', 'activeTabID', null, {
              id: elem.pageId,
            });
            if (
              activeTabId == elem.pageId &&
              elem._allowTooltipDisplay &&
              !elem._restrictTooltip
            ) {
              let offset = $('#' + elem.pageId)
                  .find('.graph_box')
                  .offset(),
                extraPad = 50;
              let top = pos.pageY - offset.top + 25,
                left = pos.pageX - offset.left + 5,
                right = 'auto',
                bottom = 'auto';
              $('#' + elem.pageId + '-tooltip')
                .html(text)
                .css({
                  top: top,
                  left: left,
                  right: right,
                });
              if (
                top + $('#' + elem.pageId + '-tooltip').height() + extraPad >=
                $('#' + elem.pageId)
                  .find('.graph_box')
                  .height()
              ) {
                top =
                  top - $('#' + elem.pageId + '-tooltip').height() - extraPad;
              }
              $('#' + elem.pageId + '-tooltip')
                .css({
                  top: top,
                  bottom: bottom,
                })
                .fadeIn(200);
            }
          };
          if (!elem._tooltipTimer) {
            let currState;
            if (
              ganttOptions.toolTipDataLoader.getItemtype &&
              _(ganttOptions.toolTipDataLoader.getItemtype) &&
              data.rowHeaderInfo
            ) {
              let toolTipData = data.rowHeaderInfo.parentNode
                ? data.rowHeaderInfo.data
                : data.rowHeaderInfo;
              if (toolTipData) {
                currState = ganttOptions.toolTipDataLoader.getItemtype(
                  toolTipData,
                  event.originalEvent
                );
              }
              if (elem._prevTip.state != currState) {
                elem.hideAndResetTooltip();
              }
            }
            if (elem._prevTip.rowId != data.rowHeaderInfo.rowId) {
              if (elem._prevTip.pane != ganttOptions.plotLabel) {
                elem.hideAndResetTooltip();
              }
              elem._tooltipTimer = setTimeout(function() {
                elem._tooltipTimer = null;
                elem._prevTip = {
                  id: data.rowHeaderInfo.rowId,
                  state: currState,
                  pane: ganttOptions.plotLabel,
                };
                services.setPrevTip(elem._prevTip);
                elem._allowTooltipDisplay = true;
                if (!elem._restrictTooltip) {
                  ganttOptions.toolTipDataLoader.getData(
                    data.rowHeaderInfo.parentNode
                      ? data.rowHeaderInfo.data
                      : data.rowHeaderInfo,
                    showTip,
                    event.originalEvent,
                    pos
                  );
                }
              }, 500);
            }
          }
        }
      }
    } else {
      elem.hideAndResetTooltip();
    }
  }

  columnHeaderSelectionStartHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let item = {
      data: data,
      event: event,
      dragDropObj: null,
    };
    if (ganttOptions.timeBarDrag && _(ganttOptions.timeBarDrag)) {
      eval(ganttOptions.timeBarDrag(item));
    }
  }

  columnHeaderSelectionEndHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let item = {
      data: data,
      event: event,
      dragDropObj: null,
    };
    iFlightEventBus.emitEvent('colHeadSelectEnd', [
      elem.pageId,
      ganttOptions.plotLabel,
      item,
    ]);
    if (ganttOptions.timeBarDrop && _(ganttOptions.timeBarDrop)) {
      eval(ganttOptions.timeBarDrop(item));
    }
  }

  objectDragStartHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let enableDrag = ganttOptions.ruler
      ? eval(ganttOptions.ruler.enableDrag)
      : null;
    if (enableDrag) {
      toggleFreezeRuler(true, data.currentItem, null, event);
      iFlightEventBus.emitEvent('freezeRuler', [
        pageIdRef,
        ganttOptions.plotLabel,
        true,
        elem.getPlaceholderId(),
        true,
      ]);
    }
    elem.updateFocusedElement();
    elem._restrictTooltip = true;
    // objectDragStart event handler
    elem.dragPane = ganttOptions.plotLabel;
    elem.dragRestrict = false;
    services.setDragPane(ganttOptions.plotLabel);
    let isMultiScreenApplied = $.getFromLocalStore('nOfS')
      ? $.getFromLocalStore('nOfS')[elem._customData.key] > 1
        ? true
        : false
      : false;
    if (isMultiScreenApplied) {
      let draggedObj = {};
      let reqData = {};
    }
    let completedItemsType = ganttOptions.completedItems.itemTypes;
    let dragDataHandler = function(item) {
      let restrictDrag = false;
      if (
        completedItemsType !== null &&
        completedItemsType !== undefined &&
        typeof completedItemsType !== 'undefined'
      ) {
        completedItemsType.forEach(function(itemType, key) {
          if (itemType == item.ganttItemType) {
            if (!showCompleted) {
              if (_(ganttOptions.completedItems.itemProviderCallback)) {
                let show = ganttOptions.completedItems.itemProviderCallback(
                  item
                );
                if (!show) {
                  restrictDrag = true;
                }
              } else {
                let showDate = iFlightUtils.getDate();
                showDate = services.getTimeOnDST(showDate);
                if (showDate >= item.end) {
                  restrictDrag = true;
                }
              }
            }
          }
        });
      }
      if (
        ganttOptions.interationRestrictMap.hasOwnProperty(item.ganttItemType)
      ) {
        let interationRestrict =
          ganttOptions.interationRestrictMap[item.ganttItemType];
        let callback = interationRestrict.callback,
          actions = interationRestrict.actions;
        if (_.contains(actions, 'dragOrDrop')) {
          restrictDrag = false;
          if (_(callback) && callback(item, 'dragOrDrop')) {
            restrictDrag = true;
          }
        }
      }
      return restrictDrag;
    };
    if (data.dragItemSize === 'SINGLE') {
      elem.dragRestrict = dragDataHandler(data.currentItem);
    } else if (data.dragItemSize === 'MULTIPLE') {
      for (let index in data.currentItem) {
        let item = data.currentItem[index];
        elem.dragRestrict = dragDataHandler(item);
        if (elem.dragRestrict) {
          break;
        }
      }
    }
    if (!elem.dragRestrict) {
      let plot = elem.getCurrentObjCallback();
      let shadowItems = [];
      let selectedItems = services.getSelectedItems(this.pageId),
        positionDifference = 0;
      if (selectedItems && selectedItems.multiPane) {
        for (let paneLabel in selectedItems.data) {
          elem.wrapAllSelectedSubTasks(
            selectedItems.data[paneLabel],
            paneLabel
          );
          shadowItems = shadowItems.concat(selectedItems.data[paneLabel]);
          if (isMultiScreenApplied) {
            reqData[paneLabel] = selectedItems.data[paneLabel];
          }
        }
        if (isMultiScreenApplied) {
          draggedObj.selectedItems = { data: reqData };
          draggedObj.multiPane = true;
        }
      }

      let item = {
        data: data,
        event: event,
        dragDropObj: {},
      };
      if (isMultiScreenApplied) {
        draggedObj.dragPane = ganttOptions.plotLabel;
        draggedObj.draggedContext = services.getGanttContext(pageIdRef);
        $.putInLocalStore('g_dragObj', draggedObj);
      }
      if (
        data.dragType == 'TASK_ITEM' &&
        ganttOptions.itemDrag &&
        _(ganttOptions.itemDrag)
      ) {
        eval(ganttOptions.itemDrag(item));
      } else if (
        data.dragType == 'ROW_HEADER' &&
        ganttOptions.headerDrag &&
        _(ganttOptions.headerDrag)
      ) {
        eval(ganttOptions.headerDrag(item));
      }

      if (selectedItems && selectedItems.multiPane) {
        data.currentItem = shadowItems;
        data.dragItemSize = 'MULTIPLE';
      }
    }
  }

  clearPrioritySelected() {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (elem._prioritySelectionInvoked) {
      let plot = elem.getCurrentObjCallback();
      let rowIds = plot.getAllRowHighlights(),
        rowObj;
      rowIds.forEach(function(rowId) {
        rowObj = plot.getRowHeaderObject(rowId);
        rowObj.prioritySelected = false;
      });
      plot.draw();
      elem._prioritySelectionInvoked = false;
    }
  }

  objectDraggingHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (!Array.isArray(data)) {
      let task = data.draggedTask;
      elem._restrictTooltip = true;
      //dragging can be allowed only for selected rowIds if rows selected
      let currRowId = elem._paneObject.retrieveActualRowId(
          Math.round(data.yValue)
        ),
        selectedRows = elem._paneObject.getAllRowHighlights(),
        draggingRestrict = elem.dragRestrict;

      if (selectedRows && selectedRows.length > 0) {
        if (!_.contains(selectedRows, currRowId)) {
          draggingRestrict = true;
          if (elem._dragTimer) {
            clearTimeout(elem._dragTimer);
            elem._dragTimer = null;
          }
        } else {
          draggingRestrict = false;
        }
      }

      if (elem._prevRowId && elem._prevRowId != currRowId && elem._dragTimer) {
        clearTimeout(elem._dragTimer);
        elem._dragTimer = null;
        elem._prevId = null;
      }
      elem._prevRowId = currRowId;

      //enable only if alt key pressed
      let altPressed = event.originalEvent.altKey;

      if (
        !draggingRestrict &&
        ganttOptions.dragOver &&
        ganttOptions.dragOver.enable() & altPressed
      ) {
        let hoverMilliseconds = 1000;
        if (
          ganttOptions.dragOver.hoverSeconds &&
          ganttOptions.dragOver.hoverSeconds > 1
        ) {
          hoverMilliseconds *= ganttOptions.dragOver.hoverSeconds;
        }
        let drawOnSuccess = function(isSuccess, task, currRowId) {
          if (isSuccess) {
            let plot = elem.getCurrentObjCallback();
            let rowIds = plot.getAllRowHighlights(),
              rowObj;
            if (rowIds.indexOf(currRowId) == -1) {
              rowIds.push(currRowId);
            }
            rowIds.forEach(function(rowId) {
              rowObj = plot.getRowHeaderObject(rowId);
              rowObj.prioritySelected = true;
            });
            plot.highlightRows(rowIds);
            elem._prioritySelectionInvoked = true;
          }
        };

        if (
          ganttOptions.dragOver.callback &&
          _(ganttOptions.dragOver.callback)
        ) {
          if (elem._prevId) {
            if (task.chronosId == elem._prevId && !elem._dragTimer) {
              elem._dragTimer = setTimeout(function() {
                ganttOptions.dragOver.callback(
                  task,
                  drawOnSuccess,
                  selectedRows,
                  currRowId
                );
              }, hoverMilliseconds);
            } else if (task.chronosId != elem._prevId) {
              if (elem._dragTimer) {
                clearTimeout(elem._dragTimer);
                elem._dragTimer = null;
              }
              elem._prevId = task.chronosId;
            }
          } else {
            elem._prevId = task.chronosId;
          }
        }
      }
    } else {
      //TODO for MULTIPLE drag items
    }
  }

  allowDropEventHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (elem._dragTimer) {
      clearTimeout(elem._dragTimer);
      elem._dragTimer = null;
    }

    let allowDropEventCallback = function(item) {
      let data = item.data,
        allowDrop = true;
      if (data.dragType == 'TASK_ITEM') {
        if (ganttOptions.itemAllowDrop && _(ganttOptions.itemAllowDrop)) {
          allowDrop = ganttOptions.itemAllowDrop(item);
        }
      } else if (data.dragType == 'ROW_HEADER') {
        if (ganttOptions.headerAllowDrop && _(ganttOptions.headerAllowDrop)) {
          allowDrop = ganttOptions.headerAllowDrop(item);
        }
      }
      let plot = elem.getCurrentObjCallback();
      plot.getPlaceholder().data('allowDrop', allowDrop);
    };
    if (data.currentItem) {
      elem.handleDropEvent(event, data, allowDropEventCallback);
    }
  }

  //drop event handler
  handleDropEvent(event, data, callback) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    let draggedTasks = {},
      dragEntityIds = {};
    let draggedTask = data.currentItem,
      targetItem = data.targetItem,
      newPosition = data.droppedPosition;
    elem._dragAndDropObj.dragItems = [];
    elem._dragAndDropObj.dropRowHeaderId = [];
    let isMultiScreenApplied = $.getFromLocalStore('nOfS')
      ? $.getFromLocalStore('nOfS')[elem._customData.key] > 1
        ? true
        : false
      : false;
    //handle dragging events
    if (elem._dragTimer) {
      clearTimeout(elem._dragTimer);
    }

    elem._dropPane = ganttOptions.plotLabel;
    if (!elem._dragRestrict) {
      elem._dragAndDropObj.dragPane = services.getDragPane();
      elem._dragAndDropObj.dropAt = new Date(newPosition.time);
      elem._dragAndDropObj.dropPane = elem._dropPane;
      elem._dragAndDropObj.mode = elem._dragMode;
      elem._dragAndDropObj.dragItems = elem._dragAndDropObj.dragItems.concat(
        draggedTask
      );
      elem._dragAndDropObj.multiDrag =
        data.dragItemSize == 'SINGLE' ? false : true;

      if (targetItem.id != null) {
        elem._dragAndDropObj.dropRowHeaderId.push(targetItem);
      } else {
        let dropItem = $.extend({}, newPosition.rowHeaderObject);
        if (dropItem.parentNode) {
          let tempItem = dropItem.data;
          tempItem.actualStartRowIndex = dropItem.actualStartRowIndex;
          tempItem.expanded = dropItem.expanded;
          tempItem.isExpanded = dropItem.isExpanded;
          tempItem.isLeafNode = dropItem.isLeafNode;
          tempItem.nodeLevel = dropItem.nodeLevel;
          tempItem.startRowIndex = dropItem.startRowIndex;
          tempItem.wrapInfo = dropItem.wrapInfo;
          dropItem = tempItem;
        }
        dropItem.rowId = newPosition.rowId;
        elem._dragAndDropObj.dropRowHeaderId.push(dropItem);
      }

      let selectedItems = services.getSelectedItems(elem.pageId);
      if (isMultiScreenApplied) {
        let draggedObj = $.getFromLocalStore('g_dragObj');
        if (draggedObj) {
          elem._dragAndDropObj.dragPane = draggedObj.dragPane;
          if (!selectedItems && draggedObj.selectedItems) {
            selectedItems = draggedObj.selectedItems;
            selectedItems.multiPane = draggedObj.multiPane;
          }
        }
      }
      if (selectedItems && selectedItems.multiPane) {
        elem._dragAndDropObj.dragItems = [];
        for (let paneLabel in selectedItems.data) {
          elem.wrapAllSelectedSubTasks(
            selectedItems.data[paneLabel],
            paneLabel
          );
          elem._dragAndDropObj.dragItems = elem._dragAndDropObj.dragItems.concat(
            selectedItems.data[paneLabel]
          );
        }
        data.dragItemSize = 'MULTIPLE';
        elem._dragAndDropObj.multiDrag = true;
      } else {
        elem.wrapAllSelectedSubTasks(
          elem._dragAndDropObj.dragItems,
          elem._dragAndDropObj.dragPane
        );
      }

      let item = {
        data: data,
        event: event,
        dragDropObj: elem._dragAndDropObj,
      };

      callback(item);
    }
    elem._dragAndDropObj = {};
  }

  /** Wrapping the selected sub tasks in parent tasks * */
  wrapAllSelectedSubTasks(dragData, plotLabel) {
    for (let index in dragData) {
      let draggedItem = dragData[index];
      draggedItem.selectedSubTasks = {};
      let isMultiScreenApplied = $.getFromLocalStore('nOfS')
        ? $.getFromLocalStore('nOfS')[this._customData.key] > 1
          ? true
          : false
        : false;
      let draggedContext;
      if (isMultiScreenApplied) {
        let draggedObj = $.getFromLocalStore('g_dragObj');
        draggedContext =
          draggedObj && draggedObj.draggedContext
            ? draggedObj.draggedContext
            : undefined;
      }
      let selectedSubTasks = services.getSubTasksSelected(
        this.pageId,
        plotLabel,
        draggedItem.id,
        draggedContext
      );
      if (selectedSubTasks && selectedSubTasks.length > 0) {
        for (let sIndex in selectedSubTasks) {
          let data = selectedSubTasks[sIndex].split('_');
          let taskId = data[0],
            taskType = data[1];
          if (!draggedItem.selectedSubTasks[taskType]) {
            draggedItem.selectedSubTasks[taskType] = [];
          }
          draggedItem.selectedSubTasks[taskType].push(taskId);
        }
      }
    }
  }

  objectDroppedHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    if (elem._dragTimer) {
      clearTimeout(elem._dragTimer);
      elem._dragTimer = null;
    }

    let objectDroppedCallback = function(item) {
      let data = item.data;
      let plot = elem.getCurrentObjCallback();
      if (data.dragType == 'TASK_ITEM') {
        /**
         * Fix for the issue : NEO2-7622
         */
        if (
          ganttOptions.subTaskSelectionMode &&
          ganttOptions.subTaskSelectionMode.isEnabled() &&
          data.dragItemSize === 'SINGLE' &&
          services.isSubTasksSelected(
            elem.pageId,
            ganttOptions.plotLabel,
            data.currentItem.id
          )
        ) {
          plot.highlightAnEntity(data.currentItem.chronosId);
        }

        if (ganttOptions.itemDrop && _(ganttOptions.itemDrop)) {
          eval(ganttOptions.itemDrop(item));
        }
      } else if (data.dragType == 'ROW_HEADER') {
        if (ganttOptions.headerDrop && _(ganttOptions.headerDrop)) {
          eval(ganttOptions.headerDrop(item));
        }
      }
    };
    if (data.currentItem) {
      elem.handleDropEvent(event, data, objectDroppedCallback);
    }
    $.deleteFromLocalStore('g_dragObj');
    services.clearSelectedItems(elem.pageId);
    elem.clearPrioritySelected();
    let enableDrag = ganttOptions.ruler
      ? eval(ganttOptions.ruler.enableDrag)
      : null;
    if (enableDrag) {
      toggleFreezeRuler(false, data.currentItem);
      iFlightEventBus.emitEvent('freezeRuler', [
        elem.pageId,
        ganttOptions.plotLabel,
        false,
        elem.getPlaceholderId(),
        true,
      ]);
    }
  }

  resizeGantt(e, isNotGanttTriggered) {
    if (!isNotGanttTriggered) {
      if (this.id) {
        const uniqueId = this.id.split('ui-')[0];
        const el = document.getElementsByTagName('iflight-gantt')[uniqueId];
        let visiblePanes = document.querySelectorAll(`#${el.pageId} .pane_h`);
        visiblePanes.forEach((element, index) => {
          const plot = element
            .getElementsByTagName('iflight-gantt')[0]
            .getCurrentObjCallback();
          if (plot) {
            services.resizePane(plot);
          }
        });

        const plot = el.getCurrentObjCallback();
        if (
          plot &&
          isFunction(plot.getPlotLabel) &&
          plot.getPlotLabel() === 'ColumnHeader'
        ) {
          services.resizePane(plot);
        }
      }
    }
  }

  hidePaneLabel() {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    var plot = elem.getCurrentObjCallback();
    //plot.setXAxisOptions('showLabel', false);
    this.resizeGantt();
  }

  paneDragged(pageId, doNotResizeGantt) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    if (!doNotResizeGantt || pageId == elem.pageId) {
      let ganttOptions = elem._configProxy.configModel;
      const topPane = services.getTopPane(pageId);
      let plot = elem.getCurrentObjCallback;
      setTimeout(() => {
        this.resizeGantt();
        // if (Object.keys(plot).length > 0 && plot.getXAxes()) {
        //   if (!ganttOptions.multiScreen.enabled) {
        //     if (topPane && topPane === uniqueID) {
        //       if (
        //         !elem._splitPaneEnabled ||
        //         (elem._splitPaneEnabled && uniqueID.search('_split') != -1)
        //       ) {
        //         //plot.setXAxisOptions('showLabel', true);
        //       }
        //     } else if (
        //       ganttOptions.splitPane &&
        //       ganttOptions.splitPane.enableDefault &&
        //       uniqueID.search('_split') != -1
        //     ) {
        //       //plot.setXAxisOptions('showLabel', true);
        //     } else {
        //       //plot.setXAxisOptions('showLabel', false);
        //     }
        //   } else {
        //     var sId = $.multiScreenScroll.getCurrScreenId(elem._customData.key);
        //     if (window.linkage != 'vertical') {
        //       if (topPane && topPane === uniqueID) {
        //         if (
        //           !elem._splitPaneEnabled ||
        //           (elem._splitPaneEnabled && uniqueID.search('_split') != -1)
        //         ) {
        //           //plot.setXAxisOptions('showLabel', true);
        //         }
        //       } else if (
        //         ganttOptions.splitPane &&
        //         ganttOptions.splitPane.enableDefault &&
        //         uniqueID.search('_split') != -1
        //       ) {
        //         //plot.setXAxisOptions('showLabel', true);
        //       } else {
        //         //plot.setXAxisOptions('showLabel', false);
        //       }
        //     } else {
        //       if (sId == 0 && topPane && topPane === uniqueID) {
        //         if (
        //           !elem._splitPaneEnabled ||
        //           (elem._splitPaneEnabled && uniqueID.search('_split') != -1)
        //         ) {
        //           //plot.setXAxisOptions('showLabel', true);
        //         }
        //       } else if (
        //         sId == 0 &&
        //         ganttOptions.splitPane &&
        //         ganttOptions.splitPane.enableDefault &&
        //         uniqueID.search('_split') != -1
        //       ) {
        //         //plot.setXAxisOptions('showLabel', true);
        //       } else {
        //         //plot.setXAxisOptions('showLabel', false);
        //       }
        //     }
        //   }
        // }
      });
    }
  }

  //objectResize event handler
  objectResizeHandler(event, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;

    let dragEntityIds = {};
    elem._dropPane = ganttOptions.plotLabel;
    elem._dragAndDropObj.dragItems = [];
    elem._dragAndDropObj.dropRowHeaderId = [];

    let restrict = false;
    let completedItemsType = ganttOptions.completedItems.itemTypes;
    if (
      completedItemsType !== null &&
      completedItemsType !== undefined &&
      typeof completedItemsType !== 'undefined'
    ) {
      completedItemsType.forEach(function(itemType, key) {
        if (itemType == data.originalObject.ganttItemType) {
          if (!showCompleted) {
            if (_(ganttOptions.completedItems.itemProviderCallback)) {
              let show = ganttOptions.completedItems.itemProviderCallback(
                data.originalObject
              );
              if (!show) {
                restrict = true;
              }
            } else {
              let showDate = iFlightUtils.getDate();
              showDate = services.getTimeOnDST(showDate);
              if (showDate >= data.originalObject.end) {
                restrict = true;
              }
            }
          }
        }
      });
    }
    if (
      ganttOptions.interationRestrictMap.hasOwnProperty(
        data.originalObject.ganttItemType
      )
    ) {
      let interationRestrict =
        ganttOptions.interationRestrictMap[data.originalObject.ganttItemType];
      let callback = interationRestrict.callback,
        actions = interationRestrict.actions;
      if (_.contains(actions, 'itemResize')) {
        restrict = false;
        if (_(callback) && callback(data.originalObject, 'itemResize')) {
          restrict = true;
        }
      }
    }

    if (!restrict) {
      elem._dragAndDropObj.dragPane = elem._dragPane;
      elem._dragAndDropObj.dropPane = elem._dropPane;
      elem._dragAndDropObj.dragItems.push(data.originalObject);
      elem._dragAndDropObj.dropRowHeaderId.push(data.resizedObject);
      elem._dragAndDropObj.multiDrag = false;

      if (data.resizedObject.resizePosition == 'END') {
        elem._dragAndDropObj.mode = 'extEnd';
        elem._dragAndDropObj.dropAt = new Date(data.resizedObject.end);
      } else if (data.resizedObject.resizePosition == 'START') {
        elem._dragAndDropObj.mode = 'extStart';
        elem._dragAndDropObj.dropAt = new Date(data.resizedObject.start);
      }

      let item = {
        data: data,
        event: event,
        dragDropObj: dragAndDropObj,
      };

      if (ganttOptions.itemResize && _(ganttOptions.itemResize)) {
        eval(ganttOptions.itemResize(item));
      }

      elem._dragAndDropObj = {};
    }
  }

  plotPanHandler() {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    elem.updateFocusedElement();
  }

  plotScrollHandler(event) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let plot = elem.getCurrentObjCallback(),
      options = plot.getOptions();
    /**
     * Minor tick enable or disable according to zoom levels
     */

    let tickHighlights = $.extend({}, plot.tickHighlights);
    let xaxis = plot.getSeries().xaxis;
    if (
      Object.keys(plot).length &&
      (plot.getSeries().xaxis.majorTickSize[1] == 'week' ||
        plot.getSeries().xaxis.majorTickSize[1] == 'month')
    ) {
      options.columnHeaderClick.selectionStyle.type = 'HEADER_ONLY';
      if (Object.keys(tickHighlights).length > 0) {
        plot.clearAllTickHighlights();
        for (let index in tickHighlights) {
          let tick = tickHighlights[index];
          tick.type = plot.MINOR_TICK;
          tick.size = xaxis.majorTickSize[0];
          tick.selectionStart = xaxis.endOfMajorTickLabel;
          tick.selectionEnd = xaxis.endOfMinorTickLabel;

          plot.highlightATick(tick);
        }
      }
    } else {
      options.columnHeaderClick.selectionStyle.type = 'COMPLETE_HEADER';
      if (Object.keys(tickHighlights).length > 0) {
        plot.clearAllTickHighlights();
        for (let index in tickHighlights) {
          let tick = tickHighlights[index];
          tick.type = plot.MAJOR_TICK;
          tick.selectionStart =
            xaxis.topHeaderHeight > 0 ? xaxis.topHeaderHeight : 0;
          tick.selectionEnd = xaxis.endOfMinorTickLabel;

          plot.highlightATick(tick);
        }
      }
    }
  }

  clearHighlightOnMenuClick(event) {
    let plot = this.getCurrentObjCallback();
    if (plot && plot.constructor.name == 'Chronos') {
      plot.clearAllhighlights();
    }
  }

  //plot click handler
  plotclickHandler(event, pos, data) {
    const uniqueId = this.id.split('ui-')[0];
    const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    let ganttOptions = elem._configProxy.configModel;
    elem.updateFocusedElement();
    if (
      elem._enableRuler &&
      elem._rulerMode == 'crosshair' &&
      elem._paneObject != undefined &&
      pos.rowId
    ) {
      services.clearRulerData();
      plotClickForRuler(event, pos, data, elem.getPlaceholderId());
      iFlightEventBus.emitEvent('plotClickForRuler', [
        pageIdRef,
        ganttOptions.plotLabel,
        event,
        pos,
        data,
        elem.getPlaceholderId(),
      ]);
    } else if (
      ganttOptions.enableSplitPane &&
      elem._paneObject &&
      elem.splitPaneEnabled &&
      $('#' + elem.id + '_split').length == 0 &&
      elem.id.substr(uniqueID.length - 5) != 'split'
    ) {
      if (pos && !pos.rowId) {
        let message = localization.getMessage('SPLIT_EMPTY_PLOTCLICK');
        // iFlightUIMessaging.showWarningMessage( scope, scope.pageid, message ); todo
        return;
      }
      let plot = elem.getCurrentObjCallback(),
        options = plot.getOptions();
      options.mouseTracker.enable = false;
      elem._paneObject.setXAxisOptions('showLabel', false);
      elem._paneObject.drawHighLightOverlay();
      let start = elem._paneObject.horizontalScrollBar.getViewValues()
        .minViewValue;
      elem.customOptions.splitRowId = pos.rowId;
      let totalRowCount = Math.round(
        plot.currentVisibleData.yValueMax - plot.currentVisibleData.yValueMin
      );
      let visibleRowCount = plot.getSeries().displayedRowIds.length;
      if (
        !ganttOptions.treeHandler.enabled() &&
        totalRowCount > visibleRowCount
      ) {
        plot.getOptions().yaxis.scrollRange[1] =
          visibleRowCount - plot.getOptions().yaxis.verticalScrollExtendunit;
      }
      let splitPaneId = attrs.id + '_split',
        splitNgModel = attrs.ngModel + '_split',
        splitElement = $(elem)
          .clone()
          .attr('id', splitPaneId)
          .attr('split-header-id', pos.rowId)
          .attr('ng-model', splitNgModel)
          .empty(),
        linkFn = $compile(splitElement),
        content = linkFn(scope.$parent);
      $(elem).before(content);
      elem.find('div.ui-ganttArea-container').css('height', '45%');
      elem.find('div.ui-ganttArea-container').addClass('split');
      elem.find('div.ui-ganttArea-container').resize();
      splitElement.find('div.ui-ganttArea-container').css('height', '55%');
      splitElement.find('div.ui-ganttArea-container').addClass('split');
      splitElement = null; //clear DOM reference
      ganttOptions.splitPane.splitPaneSuccessCallback(true, pos.rowId);
      if (
        ganttOptions.treeHandler.enabled() &&
        elem._paneObjectTree &&
        Object.keys(elem._paneObjectTree).length != 0
      ) {
        services.setSplitNodeExpanded(true);
        elem._paneObjectTree.setXAxisOptions('showLabel', false);
        elem._paneObjectTree.drawHighLightOverlay();
        start = elem._paneObjectTree.horizontalScrollBar.getViewValues()
          .minViewValue;
        if (elem._paneObjectTree.areWrapRowsEnabled()) {
          elem._paneObjectTree.updateWrapIndexDisplayMap();
        }
        if (elem._paneObjectTree.retrieveActualRowId(Math.round(pos.y) + 1)) {
          elem._paneObjectTree.scrollToPosition(
            start,
            elem._paneObjectTree.retrieveActualRowId(Math.round(pos.y) + 1)
          );
        } else {
          elem._paneObjectTree.scrollToPosition(
            start,
            elem._paneObjectTree.retrieveActualRowId(Math.round(pos.y))
          );
        }
      } else {
        if (elem._paneObject.retrieveActualRowId(Math.round(pos.y) + 1)) {
          elem._paneObject.scrollToPosition(
            start,
            elem._paneObject.retrieveActualRowId(Math.round(pos.y) + 1)
          );
        } else {
          elem._paneObject.scrollToPosition(
            start,
            elem._paneObject.retrieveActualRowId(Math.round(pos.y))
          );
        }
      }
      let key = elem.pageId + '_' + 'isSplitDone';
      let view = {
        key: [key],
        value: true,
      };
      services.addGanttView(view);
    } else {
      if (
        (data != undefined || data != null) &&
        (data.ganttItemType != undefined || data.ganttItemType != null)
      ) {
        elem._restrictTooltip = true;
        let restrict = false;
        let completedItemsType = ganttOptions.completedItems.itemTypes;
        if (
          completedItemsType !== null &&
          completedItemsType !== undefined &&
          typeof completedItemsType !== 'undefined'
        ) {
          completedItemsType.forEach(function(itemType, key) {
            if (itemType == data.ganttItemType) {
              if (!showCompleted) {
                if (_(ganttOptions.completedItems.itemProviderCallback)) {
                  let show = ganttOptions.completedItems.itemProviderCallback(
                    data
                  );
                  if (!show) {
                    restrict = true;
                  }
                } else {
                  let showDate = iFlightUtils.getDate();
                  showDate = services.getTimeOnDST(showDate);
                  if (showDate >= data.end) {
                    restrict = true;
                  }
                }
              }
            }
          });
        }
        if (
          ganttOptions.interationRestrictMap.hasOwnProperty(data.ganttItemType)
        ) {
          let interationRestrict =
            ganttOptions.interationRestrictMap[data.ganttItemType];
          let callback = interationRestrict.callback,
            actions = interationRestrict.actions;
          if (_.contains(actions, 'itemClick')) {
            restrict = false;
            if (_(callback) && callback(data, 'itemClick')) {
              restrict = true;
            }
          }
        }

        if (!restrict) {
          let plot = elem.getCurrentObjCallback();
          data.shiftPressed = event.originalEvent.shiftKey;
          data.ctrlPressed = event.originalEvent.ctrlKey;
          data.altPressed = event.originalEvent.altKey;

          if (data.shiftPressed) {
            let highlights = plot.getAllHighlights();
            for (let int = 0; int < highlights.length; int++) {
              let highlight = highlights[int];
              if (
                highlight.ctrlPressed !== undefined &&
                !highlight.ctrlPressed &&
                highlight.chronosId != data.chronosId
              ) {
                highlight.shiftPressed = event.originalEvent.shiftKey;
                highlight.ctrlPressed = event.originalEvent.ctrlKey;
                highlight.altPressed = event.originalEvent.altKey;
              }
            }
          }

          let item = {
            data: data,
            event: event,
            pos: pos,
            dragDropObj: {},
          };

          if (
            ganttOptions.subTaskSelectionMode &&
            ganttOptions.subTaskSelectionMode.isEnabled() &&
            _(ganttOptions.subTaskSelectionMode.subTaskSetter)
          ) {
            elem.selectSubtasks(event, pos, data);
          }

          if (data.spots && data.spots.length > 0) {
            let offset = plot.offset(),
              plotOffset = plot.getPlotOffset();
            let selectedPosition = {
              x: event.originalEvent.pageX - offset.left - plotOffset.left,
              y: event.originalEvent.pageY - offset.top - plotOffset.top,
            };
            data.activeSpot = getSelectedSpot(selectedPosition, data, plot);
          }
          if (ganttOptions.itemClick && _(ganttOptions.itemClick)) {
            eval(ganttOptions.itemClick(item));
            if (ganttOptions.enableMultipaneDrag)
              services.setSelectedItems(
                pageIdRef,
                ganttOptions.plotLabel,
                plot.getAllHighlights()
              );
          }
          if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
            $.deleteFromLocalStore('g_hlNtity');
            highlightedEntity[
              elem._paneObject.getPlotLabel()
            ] = plot.getAllHighlights();
            let hlEntity = {};
            hlEntity[elem._customData.key] = highlightedEntity;
            $.putInLocalStore('g_hlNtity', hlEntity);
          }
        }
      } else {
        let item = {
          data: {},
          event: event,
          pos: pos,
          dragDropObj: {},
        };
        let plotLabel = elem._paneObject.getPlotLabel();
        services.clearGanttSubTasks(elem.pageId, ganttOptions.plotLabel);
        if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
          highlightedEntity[plotLabel] = null;
          let hlEntity = {};
          hlEntity[elem._customData.key] = highlightedEntity;
          $.putInLocalStore('g_hlNtity', hlEntity);
        }
        if (ganttOptions.paneClick && _(ganttOptions.paneClick)) {
          eval(ganttOptions.paneClick(item));
        }
        if (data == null || (data && data.isLeafNode !== false)) {
          let scrollableObjects =
            elem._paneObject.horizontalScrollBar.scrollableObjectsCollection;
          $.each(scrollableObjects, function(index, scrollableObject) {
            if (scrollableObject.getAllTickHighlights().length > 0) {
              scrollableObject.clearAllTickHighlights();
              scrollableObject.draw();
              if (
                ganttOptions.multiScreen &&
                ganttOptions.multiScreen.enabled
              ) {
                highlightedColumn[scrollableObject.getPlotLabel()] = null;
                tickDetailsList = [];
                let hlColumn = {};
                hlColumn[elem._customData.key] = highlightedColumn;
                $.putInLocalStore('g_hlClmn', hlColumn);
              }
            }
          });
        }
        if (elem._paneObject.getAllRowHighlights().length > 0) {
          elem._paneObject.clearAllRowhighlights();
          elem._paneObject.draw();
          if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
            highlightedRow[plotLabel] = null;
            let hlRow = {};
            hlRow[elem._customData.key] = highlightedRow;
            $.putInLocalStore('g_hlRw', hlRow);
          }
        }
        if (
          elem._treeEnabled &&
          elem._paneObjectTree != undefined &&
          Object.keys(elem._paneObjectTree).length != 0 &&
          elem._paneObjectTree.getAllRowHighlights().length > 0
        ) {
          elem._paneObjectTree.clearAllRowhighlights();
          elem._paneObjectTree.drawHighLightOverlay();
        }
        let selectedItems = services.getSelectedItems(elem.pageId);
        if (
          selectedItems != undefined &&
          selectedItems.data[plotLabel] &&
          selectedItems.data[plotLabel].length > 0
        ) {
          services.clearSelectedItems(elem.pageId);
        }
      }
    }
    if (
      ganttOptions.multiScreen &&
      ganttOptions.multiScreen.enabled &&
      ganttOptions.treeHandler &&
      ganttOptions.treeHandler.enabled() &&
      data &&
      _(ganttOptions.treeCollapseActionHandler)
    ) {
      ganttOptions.treeCollapseActionHandler(event, data);
    }
  }
  bindGanttEvents() {
    let elem = this._shadowRoot.querySelector('.ui-ganttArea-container');
    let placeHolderId = this.id + 'ui-gantt_holder';

    //Minimize
    if (this.paneMinimizeHandler) {
      $(elem)
        .find(
          '#' + placeHolderId + 'minimize,#' + placeHolderId + 'minimize_tree'
        )
        .off('click')
        .on('click', this.paneMinimizeHandler);
    }

    //Maximize
    if (this.paneMaximizeHandler) {
      $(elem)
        .find(
          '#' + placeHolderId + 'maximize,#' + placeHolderId + 'maximize_tree'
        )
        .off('click')
        .on('click', this.paneMaximizeHandler);
    }

    window.addEventListener('resize', this.resizeGantt);

    const uniqueId = this.id.split('ui-')[0];
    const ganttElem = document.getElementsByTagName('iflight-gantt')[uniqueId];
    const isLayoutWrapped =
      $(ganttElem)
        .attr('class')
        .indexOf('layout_wrapper') != -1
        ? true
        : false;
    const pageId = ds.getData('app', 'activeTabID');
    if (isLayoutWrapped) {
      if (pageId) {
        layouts.registerDragCallback(
          this.paneDragged.bind(this),
          pageId,
          placeHolderId
        );
      }
    }

    //Restore
    if (this.paneRestoreHandler) {
      $(elem)
        .find(
          '#' + placeHolderId + 'restore,#' + placeHolderId + 'restore_tree'
        )
        .off('click')
        .on('click', this.paneRestoreHandler);
    }

    //Close
    if (this.paneCloseHandler) {
      $(elem)
        .find('#' + placeHolderId + 'close,#' + placeHolderId + 'close_tree')
        .off('click')
        .on('click', this.paneCloseHandler);
    }

    //plotclick Handler
    $(elem)
      .off('plotclick')
      .on('plotclick', this.plotclickHandler);

    //clear highlight on menu click -- todo
    $('body')
      .off('click')
      .on(
        'click',
        '#context-menu-layer',
        this.clearHighlightOnMenuClick.bind(this)
      );

    // Event work if mouse click is outside the gantt
    $(elem)
      .off('plotleave')
      .on('plotleave', this.paneLeaveHandler);

    if (this._preventContextMenu) {
      $(elem)
        .off('contextmenu')
        .on('contextmenu', this._preventContextMenu);
    }

    //columnHeaderSelecting Handler
    $(elem)
      .off('columnHeaderSelecting')
      .on('columnHeaderSelecting', this.columnHeaderSelectingHandler);

    //taskTrackerMoved Handler
    $(elem)
      .off('taskTrackerMoved')
      .on('taskTrackerMoved', this.taskTrackerMovedHandler);

    //mouseTrackerMoved Handler
    $(elem)
      .off('mouseTrackerMoved')
      .on('mouseTrackerMoved', this.mouseTrackerMovedHandler);

    //multiScreenChangeEvent Handler
    $(elem)
      .off('multiScreenChangeEvent')
      .on('multiScreenChangeEvent', this.multiScreenChangeEventHandler);

    //multiScreenScreenClose Handler
    $(elem)
      .off('multiScreenScreenClose')
      .on('multiScreenScreenClose', this.multiScreenScreenCloseHandler);

    //multiScreenScreenOpen Handler
    $(elem)
      .off('multiScreenScreenOpen')
      .on('multiScreenScreenOpen', this.multiScreenScreenOpenHandler);

    //rowHeaderClick Handler
    $(elem)
      .off('rowHeaderClick')
      .on('rowHeaderClick', this.rowHeaderClickHandler);

    //empty plotclick Handler
    $(elem)
      .off('emptyPlotclick')
      .on('emptyPlotclick', this.emptyPlotclickHandler);

    //mouseButtonRightClick Handler
    $(elem)
      .off('mouseButtonRightClick')
      .on('mouseButtonRightClick', this.mouseButtonRightClickHandler);

    //plotzoom Handler
    $(elem)
      .off('plotzoom')
      .on('plotzoom', this.plotzoomHandler);

    //rowHeaderDoubleClick Handler
    $(elem)
      .off('rowHeaderDoubleClick')
      .on('rowHeaderDoubleClick', this.rowHeaderDoubleClickHandler);

    //plotDoubleclick Handler
    $(elem)
      .off('plotDoubleclick')
      .on('plotDoubleclick', this.plotDoubleclickHandler);

    //objectDoubleclick Handler
    $(elem)
      .off('objectDoubleclick')
      .on('objectDoubleclick', this.objectDoubleclickHandler);

    //columnHeaderClick Handler
    $(elem)
      .off('columnHeaderClick')
      .on('columnHeaderClick', this.columnHeaderClickHandler);

    //rectangleSelectionEnd Handler
    $(elem)
      .off('rectangleSelectionEnd')
      .on('rectangleSelectionEnd', this.rectangleSelectionEndHandler);

    //allowTreeNodeToggle Handler
    $(elem)
      .off('allowTreeNodeToggle')
      .on('allowTreeNodeToggle', this.allowTreeNodeToggleHandler);

    //rowHeaderMouseButtonRightClick Handler
    $(elem)
      .off('rowHeaderMouseButtonRightClick')
      .on(
        'rowHeaderMouseButtonRightClick',
        this.rowHeaderMouseButtonRightClickHandler
      );

    //mousemove Handler
    $('#' + this.id)
      .off('mousemove')
      .on('mousemove', this.mousemoveHandler);

    //mouseleave Handler
    $('#' + this.id)
      .off('mouseleave')
      .on('mouseleave', this.mouseleaveHandler);

    //plothover Handler
    $(elem)
      .off('plothover')
      .on('plothover', this.plothoverHandler);

    //columnheaderhover Handler
    $(elem)
      .off('columnHeaderHover')
      .on('columnHeaderHover', this.columnHeaderHoverHandler);

    //rowHeaderHover Handler
    $(elem)
      .off('rowHeaderHover')
      .on('rowHeaderHover', this.rowHeaderHoverHandler);

    //columnHeaderSelectionStart Handler
    $(elem)
      .off('columnHeaderSelectionStart')
      .on('columnHeaderSelectionStart', this.columnHeaderSelectionStartHandler);

    //columnHeaderSelectionEnd Handler
    $(elem)
      .off('columnHeaderSelectionEnd')
      .on('columnHeaderSelectionEnd', this.columnHeaderSelectionEndHandler);

    //objectDragStart Handler
    $(elem)
      .off('objectDragStart')
      .on('objectDragStart', this.objectDragStartHandler);

    //objectDragStart Handler
    $(elem)
      .off('objectDragging')
      .on('objectDragging', this.objectDraggingHandler);

    //allowDropEvent Handler
    $(elem)
      .off('allowDropEvent')
      .on('allowDropEvent', this.allowDropEventHandler);

    //objectDropped Handler
    $(elem)
      .off('objectDropped')
      .on('objectDropped', this.objectDroppedHandler);

    //objectResize Handler
    $(elem)
      .off('objectResize')
      .on('objectResize', this.objectResizeHandler);

    //PlotPan Handler
    $(elem)
      .off('plotpan')
      .on('plotpan', this.plotPanHandler);

    //PLot scroll handler
    $(elem)
      .off('plotscroll')
      .on('plotscroll', this.plotScrollHandler);

    iFlightEventBus.onEvent(
      'paneOpen',
      { pageid: pageId },
      function(event, args) {
        const uniqueId = this.id.split('ui-')[0];
        const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
        let ganttOptions = elem._configProxy.configModel;
        const plot = elem.getCurrentObjCallback();
        let topPane = null;
        if (plot && Object.keys(plot).length > 1) {
          var customData = plot.getOptions().multiScreenFeature.customData;
          if (args[0] == elem.pageId) {
            if (args[1] == ganttOptions.plotLabel) {
              layouts.openPane($(elem), elem.pageId, uniqueId);
              if (
                ganttOptions.multiScreen &&
                ganttOptions.multiScreen.enabled
              ) {
                let screenId = $.multiScreenScroll.setScreenId(
                  plotLabel,
                  customData
                );
                if (treeEnabled) {
                  $.multiScreenScroll.setScreenId(
                    plotLabel + '_tree',
                    customData
                  );
                }
                plot.setScreenId(screenId);
                var yAxisViewArea = plot.getMultiscreenYaxisViewArea(),
                  screenNum = $.multiScreenScroll.getCurrScreenId(
                    customData.key
                  );
                if (screenNum > 0 && window.linkage == 'vertical') {
                  var min = yAxisViewArea.min,
                    totalRows = yAxisViewArea.totalRows,
                    max = min + totalRows;
                  plot.setYaxisViewArea(min, max);
                }
              }
              if (this.paneHidden) {
                this.paneHidden = false;
                plot.clearDataAndRefetchData();
              }
              topPane = services.getTopPane(elem.pageId);
              if (topPane && topPane === uniqueId && plot) {
                if (
                  !elem._splitPaneEnabled ||
                  (elem._splitPaneEnabled && uniqueId.search('_split') != -1)
                ) {
                  //plot.setXAxisOptions('showLabel', true);
                }
                plot.setupGrid();
                plot.draw();
              }
            } else {
              topPane = services.getTopPane(elem.pageId);
              if (
                topPane &&
                topPane !== uniqueId &&
                Object.keys(plot).length > 0
              ) {
                //plot.setXAxisOptions('showLabel', false);
              }
              // this.resizeGantt();
            }
          }
          if (ganttOptions.multiScreen && ganttOptions.multiScreen.enabled) {
            var xAxisViewArea = plot.getMultiscreenXaxisViewArea();
            plot.scrollToPosition(xAxisViewArea.min);
          }
        }
      }.bind(this)
    );

    iFlightEventBus.onEvent(
      'paneToolbarEvent',
      { pageid: pageId },
      function(event, args) {
        let topPane = services.getTopPane(pageId);
        const uniqueId = this.id.split('ui-')[0];
        const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
        let ganttOptions = elem._configProxy.configModel;
        const plot = elem.getCurrentObjCallback();
        //Finding the first valid element from the array.
        if (args[1] == pageId && plot.setXAxisOptions) {
          if (args[0] === 'paneClose' || args[0] === 'paneRestore') {
            //plot.setXAxisOptions('showLabel', false);
          } else if (args[0] === 'paneMinimize') {
            //plot.setXAxisOptions('showLabel', false);
          } else if (args[0] === 'paneMaximize') {
          }
        }
        if (
          args[1] == pageId &&
          window.ganttLayoutComplete &&
          window.ganttLayoutComplete[pageId]
        ) {
          this.resizeGantt();
        }
      }.bind(this)
    );
    iFlightEventBus.onEvent(
      'colHeadClick',
      { pageid: pageId },
      function(event, args) {
        const uniqueId = this.id.split('ui-')[0];
        const elem = document.getElementsByTagName('iflight-gantt')[uniqueId];
        let ganttOptions = elem._configProxy.configModel;
        if (args[0] == pageId && isFunction(ganttOptions.timeBarClick)) {
          eval(ganttOptions.timeBarClick(args[2]));
        }
      }.bind(this)
    );
  }

  unBindGanttEvents() {
    let elem = this._shadowRoot.querySelector('.ui-ganttArea-container');
    let placeHolderId = this.id + 'ui-gantt_holder';

    //Minimize
    if (this.paneMinimizeHandler) {
      $(elem)
        .find(
          '#' + placeHolderId + 'minimize,#' + placeHolderId + 'minimize_tree'
        )
        .off('click', this.paneMinimizeHandler);
    }

    //Maximize
    if (this.paneMaximizeHandler) {
      $(elem)
        .find(
          '#' + placeHolderId + 'maximize,#' + placeHolderId + 'maximize_tree'
        )
        .off('click', this.paneMaximizeHandler);
    }

    //Restore
    if (this.paneRestoreHandler) {
      $(elem)
        .find(
          '#' + placeHolderId + 'restore,#' + placeHolderId + 'restore_tree'
        )
        .off('click', this.paneRestoreHandler);
    }

    //Close
    if (this.paneCloseHandler) {
      $(elem)
        .find('#' + placeHolderId + 'close,#' + placeHolderId + 'close_tree')
        .off('click', this.paneCloseHandler);
    }

    //window resize event
    window.removeEventListener('resize', this.resizeGantt);

    const pageId = ds.getData('app', 'activeTabID');
    layouts.deRegisterDragCallback(this.paneDragged, pageId, placeHolderId);

    // Event work if mouse click is outside the gantt
    $(elem).off('plotleave', this.paneLeaveHandler);

    //columnHeaderSelecting Handler
    $(elem).off('columnHeaderSelecting', this.columnHeaderSelectingHandler);

    //taskTrackerMoved Handler
    $(elem).off('taskTrackerMoved', this.taskTrackerMovedHandler);

    //taskTrackerMoved Handler
    $(elem).off('mouseTrackerMoved', this.mouseTrackerMovedHandler);

    //multiScreenChangeEvent Handler
    $(elem).off('multiScreenChangeEvent', this.multiScreenChangeEventHandler);

    //multiScreenScreenClose Handler
    $(elem).off('multiScreenScreenClose', this.multiScreenScreenCloseHandler);

    //multiScreenScreenOpen Handler
    $(elem).off('multiScreenScreenOpen', this.multiScreenScreenOpenHandler);

    //rowHeaderClick Handler
    $(elem).off('rowHeaderClick', this.rowHeaderClickHandler);

    //plotclick Handler
    $(elem).off('plotclick', this.plotclickHandler);

    //empty plotclick Handler
    $(elem).off('emptyPlotclick', this.emptyPlotclickHandler);

    //mouseButtonRightClick Handler
    $(elem).off('mouseButtonRightClick', this.mouseButtonRightClickHandler);

    //plotzoom handler
    $(elem).off('plotzoom', this.plotzoomHandler);

    //rowHeaderDoubleClick Handler
    $(elem).off('rowHeaderDoubleClick', this.rowHeaderDoubleClickHandler);

    //plotDoubleclick Handler
    $(elem).off('plotDoubleclick', this.plotDoubleclickHandler);

    //objectDoubleclick Handler
    $(elem).off('objectDoubleclick', this.objectDoubleclickHandler);

    //columnHeaderClick Handler
    $(elem).off('columnHeaderClick', this.columnHeaderClickHandler);

    //rectangleSelectionEnd Handler
    $(elem).off('rectangleSelectionEnd', this.rectangleSelectionEndHandler);

    //rowHeaderMouseButtonRightClick Handler
    $(elem).off(
      'rowHeaderMouseButtonRightClick',
      this.rowHeaderMouseButtonRightClickHandler
    );

    //mousemove Handler
    $('#' + this.id).off('mousemove', this.mousemoveHandler);

    //mouseleave Handler
    $('#' + this.id).off('mouseleave', this.mouseleaveHandler);

    //plothover Handler
    $(elem).off('plothover', this.plothoverHandler);

    //columnHeaderHover Handler
    $(elem).off('columnHeaderHover', this.columnHeaderHoverHandler);

    //plot scroll handler
    $(elem).off('plotscroll', this.plotScrollHandler);

    //rowHeaderHover Handler
    $(elem).off('rowHeaderHover', this.rowHeaderHoverHandler);

    //columnHeaderSelectionStart Handler
    $(elem).off(
      'columnHeaderSelectionStart',
      this.columnHeaderSelectionStartHandler
    );

    //columnHeaderSelectionEnd Handler
    $(elem).off(
      'columnHeaderSelectionEnd',
      this.columnHeaderSelectionEndHandler
    );

    //objectDragStart Handler
    $(elem).off('objectDragStart', this.objectDragStartHandler);

    //objectDragging Handler
    $(elem).off('objectDragging', this.objectDraggingHandler);

    //allowDropEvent Handler
    $(elem).off('allowDropEvent', this.allowDropEventHandler);

    //objectDropped Handler
    $(elem).off('objectDropped', this.objectDroppedHandler);

    //objectResize Handler
    $(elem).off('objectResize', this.objectResizeHandler);

    //PlotPan Handler
    $(elem).off('plotpan', this.plotPanHandler);

    //clear highlight on menu click
    $('body').off(
      'click',
      '#context-menu-layer',
      this.clearHighlightOnMenuClick.bind(this)
    );

    if (this._preventContextMenu) {
      $(elem).off('contextmenu', this._preventContextMenu);
    }

    $.contextMenu('destroy', '#' + this.id);
  }
}

//TODO Load template from server
if (window.customElements) {
  customElements.define('iflight-gantt', IflightGantt);
}
