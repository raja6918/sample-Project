import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { services } from './iFlightGantt/core';
import { iFlightEventBus } from './iFlightGantt/iflight_event_bus';

import { PANE_LABELS, MODULE_NAME } from './constants';
import { getDefaultGanttOptions } from './ganttConfig';
import { dragZoom, stepZoom, customeZoom } from './zoom';
import { reInitializeZoom, setupPane, paneInitializer } from './paneMethods';
import { unmountTooltip } from './tooltip';

const plotLabel = PANE_LABELS.COLUMN;

export default class ColumnHeaderPane extends Component {
  ganttRef;
  $scope = {
    module: MODULE_NAME,
    pageid: 'W1',
  };
  zoomObject = {};
  prevZooms = [];

  getGanttOptions = () => {
    const { startDate, endDate, noOfDays } = this.props;
    const defaultOptions = getDefaultGanttOptions(
      { startDate, endDate, noOfDays },
      {
        reinitializeZoomVariables: this.reinitializeZoomVariables,
        toggleFilterPane: () => null,
        handleResetFilter: () => null,
        applySelectAll: () => null,
        getMenuOptions: () => null,
        handleMenuCallback: () => null,
      }
    );

    return {
      ...defaultOptions,
      paneOptions: {
        // chronos configuration
        plotOptions: {
          ...defaultOptions.paneOptions.plotOptions,
          restrictVerticalScrollbar: true,
          drawOnlyColumnHeader: true,
        },
      },
      initializer: this.initializer, // init-data fetcher
      plotObjectConsumer: this.setPaneObject,
      timeBarClick: this.timeBarClick,
      timeBarDrop: this.headerDragZoom,
      columnHeaderHover: this.columnHeaderHoverCallback,
      showPaneToolbar: false,
      customPaneToolbar: null,
      menuHandler: null,
      plotLabel, // pane name
    };
  };

  componentDidMount() {
    this.ganttRef = document.getElementById(
      `W1_gantt_placeholder_${plotLabel}`
    );
    this.ganttRef.pageId = 'W1';
    this.ganttRef.config = this.getGanttOptions();

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
  }

  getCurrModel = () => this.ganttRef.dataModel;

  initializer = () => {
    const { startDate, endDate } = this.props;
    const ganttModel = this.getCurrModel();
    paneInitializer(startDate, endDate, ganttModel);
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

    currPaneObj.drawAxisLabels();
  };

  /**
   * This method is called after we load the gantt and when we resize the gantt.
   * Added to fix the row height increase bug when we zoom.
   */
  reinitializeZoomVariables = (xmin, xmax, plot) => {
    reInitializeZoom(xmin, xmax, plot, this.$scope, this.zoomObject);
  };

  columnHeaderHoverCallback = () => {
    unmountTooltip();
  };

  timeBarClick = item => {
    console.log('timeBarClick items', item);
  };

  headerDragZoom = item => {
    dragZoom(item, this.$scope, this.zoomObject, this.prevZooms);
  };

  render() {
    return (
      <iflight-gantt
        enabletree="true"
        class="layout_wrapper"
        horz-id="W1_horizontalBar"
        columnHeader="true"
        id={`W1_gantt_placeholder_${plotLabel}`}
      />
    );
  }
}

ColumnHeaderPane.propTypes = {
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
};
