import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import ColumnHeaderPane from './ColumnHeaderPane';
import PairingPane from './PairingPane';
import FlightPane from './FlightPane';
import EmptyPane from './EmptyPane';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import Notification from '../../../../components/Notification';
import ModalLoader from '../../../../components/ModalLoader';

import { services, ds, layouts } from './iFlightGantt/core';
import { iFlightEventBus } from './iFlightGantt/iflight_event_bus';

import {
  ganttConfiguration,
  ganttPanes,
  ganttPopupConfiguration,
} from './config';
import { convertTime } from './utils';
import { CARRY_IN_DAYS, CARRY_OUT_DAYS } from './constants';
import storage from '../../../../utils/storage';
import './PairingTooltip.scss';

import { loadFilters } from '../../../../services/Pairings';

const moduleName = 'OPS';
export class Chronos extends Component {
  constructor(props) {
    super(props);
    const startDateBuffer = moment(this.props.startDate).subtract(
      'days',
      CARRY_IN_DAYS
    );
    const endDateBuffer = moment(this.props.endDate).add(
      'days',
      CARRY_OUT_DAYS + 1
    );
    const startDate = convertTime(startDateBuffer);
    const endDate = convertTime(endDateBuffer);
    const noOfDays =
      moment(this.props.endDate).diff(moment(this.props.startDate), 'days') + 1;

    const carryInEndDate = convertTime(
      moment(startDate).add('days', CARRY_IN_DAYS)
    );

    const carryOutStartDate = convertTime(
      moment(endDate).subtract('days', CARRY_OUT_DAYS)
    );

    this.state = {
      startDate,
      endDate,
      noOfDays,
      carryInEndDate,
      carryOutStartDate,
      initialSetupCompleted: false,
      toastMsg: null,
      snackType: '',
      openLoader: false,
      titleLoader: '',
      loadedFilters: [],
    };
  }

  horizontalScrollBarRef;
  $scope = {
    module: moduleName,
    pageid: 'W1',
  };
  zoomObject = {};
  prevZooms = [];

  componentDidMount() {
    const { startDate, endDate } = this.state;
    const { updateTimelineWindowsCount } = this.props;
    const localWorldContext = {
      lwGanttIds: [],
      excludedPageIds: [],
      previousLWMap: {},
      activeLW: null,
      previousLW: null,
    };

    layouts.setBarSize(2);

    ds.addData('app', 'page', null, { id: 'W1' });
    ds.addData('app', 'activeTabID', null, 'W1');
    ds.addData('app', 'module', 'W1', 'OPS');
    ds.addData('app', 'ganttConfiguration', 'W1', ganttConfiguration);

    // Handle pane history management
    const openTimeLineWindows = storage.getItem(`openTimeLineWindows`);
    if (openTimeLineWindows) {
      // We need to convert all the boolean values to string since generic gantt doesn't support that.
      for (const paneId of Object.keys(openTimeLineWindows)) {
        openTimeLineWindows[paneId] = openTimeLineWindows[paneId].toString();
      }
    }
    const updatedGanttPanes = openTimeLineWindows
      ? { OPS: openTimeLineWindows }
      : ganttPanes;
    ds.addData('app', 'ganttPanes', 'W1', updatedGanttPanes);

    ds.addData('app', 'ganttPopupConfiguration', 'W1', ganttPopupConfiguration);
    ds.addData('app', 'localWorldContext', 'W1', localWorldContext);

    ds.addData('app', 'loadPeriodStartDate', 'W1', startDate);
    ds.addData('app', 'loadPeriodEndDate', 'W1', endDate);

    //Real world context info.
    const realWorldContext = { pageIds: [], ganttTabIds: [] };
    ds.addData('app', 'realWorldContext', null, realWorldContext);

    //Clipboard context info
    const clipboardContext = {
      lwGanttIds: [],
      rwGanttIds: [],
      pageMap: {},
      dataMap: {},
    };
    ds.addData('app', 'clipboardContext', null, clipboardContext);

    ds.addData('app', 'pagesconfig', null, {
      activepage: {
        id: 'W1',
      },
    });

    this.horizontalScrollBarRef = document.querySelector(
      'iflight-horizontal-bar'
    );
    this.horizontalScrollBarRef.id = 'W1_horizontalBar';

    // initialize icon
    const iconImage = new Image();
    iconImage.src = window.imagePath + '/icons-alerts.svg';
    iconImage.onload = () => {
      services.setIconImage(iconImage);
    };

    this.setState({ initialSetupCompleted: true });

    iFlightEventBus.onEvent('paneToolbarEvent', this.$scope, (event, args) => {
      // used this.props.timelineWindowsCount instead of destructured version because for somehow initial value of timelineWindowsCount is persisted inside iFlightEventBus
      if (args[0] === 'paneClose' && this.props.timelineWindowsCount > 1) {
        updateTimelineWindowsCount(args[2]);
      }
    });

    this.loadFilters();
  }

  loadFilters = async () => {
    try {
      const { match } = this.props;
      const scenarioId = match.params.scenarioID || match.params.previewID;
      // const loadedFilters = await loadFilters(scenarioId);
      // if (loadedFilters) {
      //   this.setState({ loadedFilters: loadedFilters.data });
      // }
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  updateLoadedFilter = (savedFilter, isUpdate = false) => {
    const { t } = this.props;
    let updatedLoadedFilters;
    if (isUpdate) {
      updatedLoadedFilters = this.state.loadedFilters.map(filter => {
        if (filter.name === savedFilter.name) {
          return savedFilter;
        }
        return filter;
      });
      this.setSnackBar(
        t('SUCCESS.FILTER.UPDATE', { filterName: savedFilter.name }),
        'success'
      );
    } else {
      updatedLoadedFilters = [...this.state.loadedFilters, savedFilter];
      this.setSnackBar(
        t('SUCCESS.FILTER.SAVE', { filterName: savedFilter.name }),
        'success'
      );
    }

    this.setState({ loadedFilters: updatedLoadedFilters });
  };

  setSnackBar = (toastMsg, snackType) => {
    this.setState({ toastMsg, snackType });
  };

  onClearSnackBar = () => {
    this.setState({
      toastMsg: null,
      snackType: '',
    });
    this.props.clearErrorNotification();
  };

  openLoader = title => {
    this.setState({ openLoader: true, titleLoader: title });
  };

  closeLoader = () => {
    this.setState({ openLoader: false, titleLoader: '' });
  };

  render() {
    const {
      startDate,
      endDate,
      noOfDays,
      carryInEndDate,
      carryOutStartDate,
      initialSetupCompleted,
      toastMsg,
      snackType,
      loadedFilters,
    } = this.state;
    const {
      t,
      match,
      filterCriteria,
      previewMode,
      readOnly,
      reportError,
      ruleset,
      currentCrewGroupId,
      selectedCrewGroup,
    } = this.props;

    return (
      <div id="W1" style={{ position: 'relative' }}>
        <div
          style={{
            position: 'relative',
            height: `calc(100vh - ${previewMode ? 160 : 111}px)`,
            width: '100%',
          }}
        >
          <span className="toolbar_top">
            <span className="icon_set" />
            <span className="more_btn" />
          </span>
          <iflight-horizontal-bar page-id="W1" />

          {initialSetupCompleted && (
            <Fragment>
              <div
                style={{
                  position: 'absolute',
                  overflow: 'hidden',
                  top: '15px',
                  height: '72px',
                  width: '100%',
                }}
              >
                <div>
                  <ColumnHeaderPane
                    startDate={startDate}
                    endDate={endDate}
                    noOfDays={noOfDays}
                    carryOutStartDate={carryOutStartDate}
                    carryInEndDate={carryInEndDate}
                    match={match}
                  />
                </div>
              </div>

              <div className="h_pane_wrapper">
                <PairingPane
                  t={t}
                  startDate={startDate}
                  endDate={endDate}
                  noOfDays={noOfDays}
                  carryOutStartDate={carryOutStartDate}
                  carryInEndDate={carryInEndDate}
                  match={match}
                  filterCriteria={filterCriteria}
                  reportError={reportError}
                  readOnly={readOnly || previewMode}
                  ruleset={ruleset}
                  currentCrewGroupId={currentCrewGroupId}
                  selectedCrewGroup={selectedCrewGroup}
                  setSnackBar={this.setSnackBar}
                  onClearSnackBar={this.onClearSnackBar}
                  openLoader={this.openLoader}
                  closeLoader={this.closeLoader}
                  loadedFilters={loadedFilters}
                  onUpdateLoadedFilter={this.updateLoadedFilter}
                />
                {!previewMode && (
                  <FlightPane
                    t={t}
                    startDate={startDate}
                    endDate={endDate}
                    noOfDays={noOfDays}
                    carryOutStartDate={carryOutStartDate}
                    carryInEndDate={carryInEndDate}
                    match={match}
                    filterCriteria={filterCriteria}
                    reportError={reportError}
                    readOnly={readOnly || previewMode}
                    ruleset={ruleset}
                    currentCrewGroupId={currentCrewGroupId}
                    selectedCrewGroup={selectedCrewGroup}
                    setSnackBar={this.setSnackBar}
                    onClearSnackBar={this.onClearSnackBar}
                    openLoader={this.openLoader}
                    closeLoader={this.closeLoader}
                    loadedFilters={loadedFilters}
                    onUpdateLoadedFilter={this.updateLoadedFilter}
                  />
                )}
                {!previewMode && (
                  <EmptyPane
                    t={t}
                    startDate={startDate}
                    endDate={endDate}
                    noOfDays={noOfDays}
                    carryOutStartDate={carryOutStartDate}
                    carryInEndDate={carryInEndDate}
                    match={match}
                    filterCriteria={filterCriteria}
                    reportError={reportError}
                    readOnly={readOnly || previewMode}
                    ruleset={ruleset}
                    currentCrewGroupId={currentCrewGroupId}
                    selectedCrewGroup={selectedCrewGroup}
                    setSnackBar={this.setSnackBar}
                    onClearSnackBar={this.onClearSnackBar}
                    openLoader={this.openLoader}
                    closeLoader={this.closeLoader}
                    loadedFilters={loadedFilters}
                    onUpdateLoadedFilter={this.updateLoadedFilter}
                  />
                )}
              </div>
            </Fragment>
          )}
        </div>
        <Notification
          autoHideDuration={snackType === 'info' ? 3600000 : 5000}
          message={toastMsg}
          clear={this.onClearSnackBar}
          type={snackType}
          displayCloseButton={true}
        />
        <ModalLoader
          open={this.state.openLoader}
          title={this.state.titleLoader}
          color="white"
        />
        <div className="sierra-tooltip" id="sierra-tooltip">
          {' '}
        </div>
      </div>
    );
  }
}

Chronos.propTypes = {
  t: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: {
      scenarioID: PropTypes.number,
      previewID: PropTypes.number,
    },
  }).isRequired,
  updateTimelineWindowsCount: PropTypes.func.isRequired,
  filterCriteria: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  timelineWindowsCount: PropTypes.number.isRequired,
  previewMode: PropTypes.bool.isRequired,
  reportError: PropTypes.func.isRequired,
  clearErrorNotification: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  ruleset: PropTypes.number,
  currentCrewGroupId: PropTypes.number,
  selectedCrewGroup: PropTypes.shape({}),
};

Chronos.defaultProps = {
  ruleset: null,
  readOnly: null,
  currentCrewGroupId: null,
  selectedCrewGroup: null,
};

export default withRouter(withErrorHandler(Chronos, 3600000));
