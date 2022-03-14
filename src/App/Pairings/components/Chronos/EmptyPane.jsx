import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import union from 'lodash/union';
import get from 'lodash/get';
import { connect } from 'react-redux';

import Watermark from './Watermark';
import FilterPane from '../Filter/FilterPane';
import AlertsContainer from '../OnlineValidation';
import CrewComplementContainerWithErrorHandler from '../CrewComplement/CrewComplementContainer';
import TagsComponent from '../TagsComponent/TagsComponentContainer';
import PairingDetails from '../Timeline/components/PairingDetails';

import { services } from './iFlightGantt/core';
import { iFlightEventBus } from './iFlightGantt/iflight_event_bus';
import {
  togglePaneToolBar,
  handlePaneToolBarEvent,
  setupPaneToolBar,
  restorePaneContainer,
  getFilterRenderer,
  generateRowHeaders,
  highlightAnEntityWithErrorHandler,
  removeFilterFromStore,
  toggleSelectAllIcon,
  disableSelectAllIcon,
  clearDataAndRefetchPane,
  filterAndUpdatePane,
  hasEditPermission,
  removeAllPaneFocusClass,
} from './utils';
import { PANE_LABELS, MODULE_NAME } from './constants';
import { drawGanttItems } from './draw';
import { getDefaultGanttOptions } from './ganttConfig';
import { stepZoom, customeZoom, dragZoom } from './zoom';
import {
  dropItemHandler,
  multipaneDrop,
  reInitializeZoom,
  setupPane,
  paneInitializer,
  getKeyList,
  applySelectAll,
  clearSelectAll,
  emitClearSelectAllEvent,
} from './paneMethods';
import {
  getMenuOptions,
  handleMenuCallback,
  closePairingDetails,
  closePairingAlerts,
  closeCrewComplement,
  updateCrewComplement,
  closeTags,
  updateTags,
  getMenuTitle,
} from './contextMenu';
import {
  resetGanttData,
  fetchKeyList,
  clearTimeline,
  fetchGanttDetails,
} from './api';
import storage from '../../../../utils/storage';
import { generateTooltip, unmountTooltip } from './tooltip';

const plotLabel = PANE_LABELS.EMPTY;
const defaultRenderer = 'empty';

class EmptyPane extends Component {
  state = {
    isFilterOpen: false,
    minimized: false,
    selectedPairing: {},
    showPairingDetails: false,
    showPairingAlerts: false,
    showCrewComplement: false,
    showTags: false,
    render: null,
    isJoinAction: false,
  };

  ganttRef;
  $scope = {
    module: MODULE_NAME,
    pageid: 'W1',
  };
  zoomObject = {};
  prevZooms = [];
  selectAll = false;
  timelineId = 3;
  disableContextMenu = false;

  getGanttOptions = () => {
    const { startDate, endDate, noOfDays } = this.props;
    const defaultOptions = getDefaultGanttOptions(
      { startDate, endDate, noOfDays },
      {
        reinitializeZoomVariables: this.reinitializeZoomVariables,
        toggleFilterPane: this.toggleFilterPane,
        handleClear: this.handleClear,
        applySelectAll: this.applySelectAll,
        getMenuOptions: this.getMenuOptions,
        handleMenuCallback: this.handleMenuCallback,
        getMenuTitle: this.getMenuTitle,
      }
    );

    return {
      ...defaultOptions,
      initializer: this.initializer, // init-data fetcher
      dataLoader: this.getGanttItems, // gantt-data fetcher
      itemRenderer: this.drawGanttItems, // task-renderer
      labelRenderer: () => {},
      plotObjectConsumer: this.setPaneObject,
      paneClick: this.paneClick,
      itemClick: this.itemClick,
      timeBarClick: this.timeBarClick,
      timeBarDrop: this.headerDragZoom,
      rectSelEnd: this.rectangularSelect,
      itemDrop: this.dropItemCallback,
      itemDrag: this.dragItemCallback,
      itemHover: this.itemHoverCallback,
      plotHover: this.plotHoverCallback,
      columnHeaderHover: this.columnHeaderHoverCallback,
      plotLabel, // pane name
    };
  };

  componentDidMount() {
    this.ganttRef = document.getElementById(
      `W1_gantt_placeholder_${plotLabel}`
    );
    this.ganttRef.pageId = 'W1';
    this.ganttRef.paneIcon = 'paneIconSprite.svg';
    this.ganttRef.config = this.getGanttOptions();

    setupPaneToolBar(this.ganttRef);

    iFlightEventBus.onEvent('stepZoomEvent', this.$scope, (event, args) => {
      const [zoomDirection, metaInfo, zoomParameters] = args;
      stepZoom(
        zoomDirection,
        metaInfo,
        zoomParameters,
        this.$scope,
        this.zoomObject,
        this.prevZooms
      );
    });

    iFlightEventBus.onEvent('maxMinZoomEvent', this.$scope, (event, args) => {
      const [type] = args;
      customeZoom(
        type,
        this.props.noOfDays,
        this.$scope,
        this.zoomObject,
        this.prevZooms
      );
    });

    iFlightEventBus.onEvent('dropPaneEvent', this.$scope, (event, args) => {
      const [dragPane, modifiedItems] = args;
      if (dragPane === plotLabel) {
        multipaneDrop(modifiedItems, this.$scope, this.timelineId);
      }
    });

    iFlightEventBus.onEvent('paneToolbarEvent', this.$scope, (event, args) => {
      handlePaneToolBarEvent(args, plotLabel, this.ganttRef, this);
    });

    iFlightEventBus.onEvent('paneOpen', this.$scope, (event, args) => {
      restorePaneContainer(this.ganttRef, this);

      //To fix pairings (less then 1 day) / flights drag and drop issue in empty pane.
      const [pageId, paneLabel] = args;
      if (paneLabel === plotLabel) {
        const render = getFilterRenderer(this.timelineId, defaultRenderer);
        if (render === 'empty') {
          this.setupEmptyPane(false);
        }
      }
    });

    iFlightEventBus.onEvent('crewGroupChange', this.$scope, (event, args) => {
      this.handleCrewGroupChange();
    });

    iFlightEventBus.onEvent(
      'clearSelectAllEvent',
      this.$scope,
      (event, args) => {
        const [clearedPane, clearData] = args;
        const clear = clearedPane === plotLabel ? clearData : true;
        clearSelectAll(this, clear);
      }
    );

    iFlightEventBus.onEvent(
      'clearDataAndRefetchPaneEvent',
      this.$scope,
      (event, args) => {
        const [timelineIds] = args;
        if (timelineIds.includes(this.timelineId)) {
          clearDataAndRefetchPane(this);
        }
      }
    );

    iFlightEventBus.onEvent('updatePaneEvent', this.$scope, (event, args) => {
      const [itemsToAddOrUpdate, itemsToRemove] = args;
      filterAndUpdatePane(this, itemsToAddOrUpdate, itemsToRemove);
    });
  }

  componentWillUnmount() {
    unmountTooltip();
  }

  getPairingsLegsCount = () => {
    const countMap = this.props.pairingMap
      ? this.props.pairingMap[this.timelineId]
      : null;
    const pairingsCount =
      countMap && countMap.idRowMap && countMap.idRowMap.pairings
        ? Object.keys(countMap.idRowMap.pairings).length
        : 0;
    const legsCount =
      countMap && countMap.idRowMap && countMap.idRowMap.legs
        ? Object.keys(countMap.idRowMap.legs).length
        : 0;
    const dhiCount =
      countMap && countMap.idRowMap && countMap.idRowMap.dhi
        ? Object.keys(countMap.idRowMap.dhi).length
        : 0;
    const cmlCount =
      countMap && countMap.idRowMap && countMap.idRowMap.cml
        ? Object.keys(countMap.idRowMap.cml).length
        : 0;

    return { pairingsCount, legsCount, dhiCount, cmlCount };
  };

  getMenuTitle = options => {
    const {
      pairingsCount,
      legsCount,
      dhiCount,
      cmlCount,
    } = this.getPairingsLegsCount();
    return getMenuTitle(options, this.$scope, {
      selectAll: this.selectAll,
      pairingsCount,
      legsCount,
      dhiCount,
      cmlCount,
    });
  };

  getMenuOptions = (type, data, event, pos) => {
    if (this.disableContextMenu) {
      return;
    }

    const { pairingsCount, legsCount, dhiCount } = this.getPairingsLegsCount();
    return getMenuOptions(
      type,
      data,
      this.$scope,
      this.props.readOnly,
      this.props.permissions,
      {
        selectAll: this.selectAll,
        pairingsCount,
        legsCount,
        dhiCount,
      }
    );
  };

  handleMenuCallback = (menukey, options, data, pos) => {
    handleMenuCallback(menukey, data, this);
  };

  getCurrModel = () => this.ganttRef.dataModel;

  initializer = async () => {
    try {
      const { startDate, endDate, match } = this.props;

      const { count } = await getKeyList(
        this.timelineId,
        defaultRenderer,
        match
      );

      const ganttModel = this.getCurrModel();
      paneInitializer(startDate, endDate, ganttModel, count > 0 ? count : 20);
    } catch (error) {
      this.reportFilterErrors(this.timelineId, error);
      console.error(error);
    }
  };

  setPaneObject = (paneObjectArray, isSplitPane, isTreeEnabled, caller) => {
    const {
      startDate,
      endDate,
      carryOutStartDate,
      carryInEndDate,
    } = this.props;
    setupPane(
      paneObjectArray,
      isSplitPane,
      isTreeEnabled,
      caller,
      plotLabel,
      { startDate, endDate, carryOutStartDate, carryInEndDate },
      this.$scope
    );

    const currPaneObj = services.getCurrentPaneObject(
      paneObjectArray,
      false,
      isSplitPane
    );

    this.zoomObject = services.setupRootZoomVariables(
      currPaneObj,
      this.$scope.pageid,
      plotLabel,
      caller
    );

    highlightAnEntityWithErrorHandler(currPaneObj);
  };

  /**
   * This method is called after we load the gantt and when we resize the gantt.
   * Added to fix the row height increase bug when we zoom.
   */
  reinitializeZoomVariables = (xmin, xmax, plot) => {
    togglePaneToolBar(this.ganttRef, this);

    reInitializeZoom(xmin, xmax, plot, this.$scope, this.zoomObject);
  };

  setupEmptyPane = isSplit => {
    const rowHeaders = generateRowHeaders(20, 1);
    const emptyData = {
      ganttHeader: rowHeaders,
      normalMaximumDaySpan: 0,
      loadPeriodStartDate: 0,
      loadPeriodEndDate: 0,
      ganttData: {},
      ganttDataType: 'INIT',
      isTree: false,
      responseToken: 1616483043371,
      filterCount: 0,
    };

    const ganttModel = this.getCurrModel(isSplit);
    if (!ganttModel) return;

    services.modifyForUnassignedGantt(
      emptyData,
      ganttModel,
      '',
      undefined,
      plotLabel,
      'W1',
      true
    );
  };

  getGanttItems = async (fetchDataRequest, isTree, isSplit) => {
    try {
      const { pairingMap, match } = this.props;
      const rowIds = union(
        fetchDataRequest.windowDataRange.rowIds,
        fetchDataRequest.fetchDataRangeList[0].rowIds
      );

      const dataMap = pairingMap ? pairingMap[this.timelineId] : {};
      const render = getFilterRenderer(
        this.timelineId,
        defaultRenderer,
        dataMap.render
      );

      await fetchGanttDetails(rowIds, dataMap, this.ganttRef, this.$scope, {
        match,
      });

      // After items are loaded we can enable contextMenu
      this.disableContextMenu = false;

      // To fix pairings (less then 1 day) / flights drag and drop issue in empty pane.
      if (render === 'empty') {
        this.setupEmptyPane(isSplit);
      }

      this.setState({ render });
    } catch (error) {
      // Remove entire pairingStore and refresh if any of entity got corrupted.
      if (
        get(error, 'response.status') === 404 &&
        get(error, 'response.data.messageKey') === 'ENTITY_NOT_FOUND'
      ) {
        storage.removeItem(`pairingStore`);
        window.location.reload();
      } else {
        this.reportFilterErrors(this.timelineId, error);
        console.error(error);
      }
    }
  };

  drawGanttItems = dataToDraw => {
    drawGanttItems(dataToDraw, this.$scope, this.selectAll);
  };

  dragItemCallback = () => {
    unmountTooltip();
  };

  itemHoverCallback = data => {
    generateTooltip(data, this);
  };

  plotHoverCallback = () => {
    unmountTooltip();
  };

  columnHeaderHoverCallback = () => {
    unmountTooltip();
  };

  paneClick = item => {
    console.log('paneClick item', item);
    emitClearSelectAllEvent(plotLabel, true);
    removeAllPaneFocusClass(this.ganttRef);
    this.props.onClearSnackBar();
  };

  itemClick = item => {
    unmountTooltip();
    emitClearSelectAllEvent(plotLabel, true);
    removeAllPaneFocusClass(this.ganttRef);
    this.props.onClearSnackBar();
    console.log('itemClick items', item);
    console.log(this.$scope.paneObjArr[0].getAllGanttHighlights());
  };

  timeBarClick = item => {
    console.log('timeBarClick items', item);
  };

  rectangularSelect = item => {
    console.log('rectSelEnd items', item);
    unmountTooltip();
  };

  dropItemCallback = item => {
    dropItemHandler(item, this.$scope, this.timelineId);
    unmountTooltip();
  };

  headerDragZoom = item => {
    dragZoom(item, this.$scope, this.zoomObject, this.prevZooms);
  };

  toggleFilterPane = () => {
    this.setState(prevState => ({
      isFilterOpen: !prevState.isFilterOpen,
    }));
    removeAllPaneFocusClass(this.ganttRef);
  };

  fetchFilterData = async render => {
    try {
      const { match, startDate, endDate } = this.props;

      const { count } = await fetchKeyList(
        this.timelineId,
        defaultRenderer,
        match,
        render
      );

      resetGanttData(count, startDate, endDate, this.$scope.paneObjArr);
      this.setState({ render });
    } catch (error) {
      this.reportFilterErrors(this.timelineId, error);
      console.error(error);
    }
  };

  handleSetFilter = (render, filterBody) => {
    emitClearSelectAllEvent(plotLabel, false);

    storage.setItem(`timelineFilter${this.timelineId}`, filterBody);
    storage.setItem(`timelineLastFilter${this.timelineId}`, filterBody);
    this.fetchFilterData(render);
  };

  handleClear = () => {
    const { startDate, endDate } = this.props;

    emitClearSelectAllEvent(plotLabel, false);

    const timelineFilter = storage.getItem(`timelineFilter${this.timelineId}`);
    if (timelineFilter) {
      removeFilterFromStore(this.timelineId);
    }

    const { count } = clearTimeline(this.timelineId);
    resetGanttData(count, startDate, endDate, this.$scope.paneObjArr);
    this.setState({ render: 'empty' });
  };

  handleResetFilter = render => {
    emitClearSelectAllEvent(plotLabel, false);

    const timelineFilter = storage.getItem(`timelineFilter${this.timelineId}`);
    if (timelineFilter) {
      removeFilterFromStore(this.timelineId);
    }
    this.fetchFilterData(render || defaultRenderer);
  };

  reportFilterErrors = (timelineId, err) => {
    storage.removeItem(`timelineFilter${timelineId}`);
    if (err.response) {
      this.props.reportError({ error: err });
    } else {
      this.props.reportError({
        errorType: 'Snackbar',
        isHtml: true,
        error: err,
      });
    }
  };

  handleCrewGroupChange = () => {
    // Clear select all when user change crew group
    clearSelectAll(this, false);
    removeFilterFromStore(this.timelineId);
    this.setState(
      {
        render: defaultRenderer,
      },
      () => {
        this.fetchFilterData(defaultRenderer);
      }
    );
  };

  applySelectAll = data => {
    console.log('applySelectAll', data);
    applySelectAll(this);
    removeAllPaneFocusClass(this.ganttRef);
  };

  toggleSelectAllIcon = () => {
    const { permissions, readOnly } = this.props;
    if (!hasEditPermission(permissions) || readOnly) {
      disableSelectAllIcon(this);
      return;
    }

    const {
      pairingsCount,
      legsCount,
      dhiCount,
      cmlCount,
    } = this.getPairingsLegsCount();
    if (pairingsCount + legsCount + dhiCount + cmlCount === 0) {
      disableSelectAllIcon(this);
    } else {
      toggleSelectAllIcon(this);
    }
  };

  setSnackBar = (toastMsg, snackType) => {
    this.props.setSnackBar(toastMsg, snackType);
  };

  openLoader = title => {
    this.props.openLoader(title);
  };

  closeLoader = () => {
    this.props.closeLoader();
  };

  render() {
    const {
      t,
      match,
      filterCriteria,
      readOnly,
      ruleset,
      currentCrewGroupId,
      pairingMap,
      loadedFilters,
      reportError,
      onUpdateLoadedFilter,
    } = this.props;
    const {
      minimized,
      selectedPairing,
      showPairingDetails,
      showPairingAlerts,
      showCrewComplement,
      showTags,
      render,
      isJoinAction,
    } = this.state;
    const scenarioId = match.params.scenarioID || match.params.previewID;
    const countMap = pairingMap ? pairingMap[this.timelineId] : {};
    const count = countMap ? countMap.count : {};

    this.toggleSelectAllIcon();

    return (
      <Fragment>
        <div className="pane_h ">
          <iflight-gantt
            enabletree="true"
            class="layout_wrapper"
            horz-id="W1_horizontalBar"
            id={`W1_gantt_placeholder_${plotLabel}`}
          >
            <Watermark
              t={t}
              minimized={minimized}
              totalPairingNb={count.totalPairingNb || 0}
              totalFlightNb={count.totalFlightNb || 0}
              render={render}
              timelineName={`T${this.timelineId}`}
              ganttRef={this.ganttRef}
              countMap={countMap}
            />
          </iflight-gantt>
        </div>
        {Array.isArray(filterCriteria) && filterCriteria.length > 0 && (
          <FilterPane
            t={t}
            id={this.timelineId}
            isOpen={this.state.isFilterOpen}
            handleCancel={this.toggleFilterPane}
            filterCriteria={filterCriteria}
            setFilter={this.handleSetFilter}
            viewAllActivities={this.handleResetFilter}
            scenarioId={scenarioId}
            readOnly={readOnly}
            loadedFilters={loadedFilters}
            onUpdateLoadedFilter={onUpdateLoadedFilter}
            reportError={reportError}
          />
        )}
        <PairingDetails
          t={t}
          match={match}
          selectedPairing={selectedPairing}
          open={showPairingDetails}
          onClose={() => closePairingDetails(this)}
        />
        <AlertsContainer
          t={t}
          pairing={selectedPairing}
          open={showPairingAlerts}
          handleCancel={() => closePairingAlerts(this)}
          readOnly={readOnly}
          openItemId={scenarioId}
          ruleset={ruleset}
        />
        <CrewComplementContainerWithErrorHandler
          handleCancel={() => closeCrewComplement(this)}
          t={t}
          open={showCrewComplement}
          openItemId={scenarioId}
          readOnly={readOnly}
          selectedPairing={selectedPairing}
          handleSave={data => updateCrewComplement(data, this)}
          currentCrewGroupId={currentCrewGroupId}
          isJoinAction={isJoinAction}
        />
        <TagsComponent
          t={t}
          open={showTags}
          openItemId={scenarioId}
          readOnly={readOnly}
          selectedPairing={selectedPairing}
          handleSave={data => updateTags(data, this)}
          handleCancel={() => closeTags(this)}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { permissions: state.user.permissions, pairingMap: state.pairing };
};

EmptyPane.propTypes = {
  t: PropTypes.func.isRequired,
  startDate: PropTypes.number.isRequired,
  endDate: PropTypes.number.isRequired,
  noOfDays: PropTypes.number.isRequired,
  carryOutStartDate: PropTypes.number.isRequired,
  carryInEndDate: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: {
      scenarioID: PropTypes.number,
      previewID: PropTypes.number,
    },
  }).isRequired,
  filterCriteria: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  reportError: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  ruleset: PropTypes.number,
  permissions: PropTypes.shape([]).isRequired,
  currentCrewGroupId: PropTypes.number,
  pairingMap: PropTypes.shape().isRequired,
  setSnackBar: PropTypes.func.isRequired,
  onClearSnackBar: PropTypes.func.isRequired,
  openLoader: PropTypes.func.isRequired,
  closeLoader: PropTypes.func.isRequired,
  loadedFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onUpdateLoadedFilter: PropTypes.func.isRequired,
};

EmptyPane.defaultProps = {
  ruleset: null,
  readOnly: null,
  currentCrewGroupId: null,
};

export default connect(mapStateToProps)(EmptyPane);
