import React, { Component } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  TimelineHeader,
  TimelineWindow,
  TimelineZoom,
  PairingDetails,
} from './components';
import sessionStorage from '../../../../utils/storage';
import {
  getDaysInDatesRange,
  generateCalendarData,
  prepareFlightsData,
  preparePairingsData,
  indexingWindows,
  splitValue,
  calculateHeightsAfterUncollapse,
} from './helpers';
import {
  CARRY_IN_DAYS,
  CARRY_OUT_DAYS,
  MAX_PERIOD_DAYS,
  MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED,
  MIN_TIMELINE_WINDOW_HEIGHT,
} from './constants';

import { TimelineContext } from './TimelineContext';
import './styles.scss';

import RuleDialogWithErrorHandling from '../OnlineValidation/Rule';

/*
Components structure:

Timeline ( generateCalendarData )
  TimelineHeader (prop: generateCalendarData)
    TimelineMonths
    TimelineDays
  TimelineWindow
    TimelineRows
      PairingObject
        PairingBlock
          PairingLabels
    TimelineColumns
*/

const solverResultBarHeights = {
  true: 45.5,
  false: 0,
};
const tmHeaderHeight = 84;
class Timeline extends Component {
  constructor(props) {
    super(props);

    this.defaultWindows = [
      { id: 1, isOpen: true, collapsed: false, height: 0, prevHeight: null },
      { id: 2, isOpen: false, collapsed: false, height: 0, prevHeight: null },
      { id: 3, isOpen: false, collapsed: false, height: 0, prevHeight: null },
    ];
    this.event = new CustomEvent('timelineScrolled', {
      bubbles: true,
      cancelable: true,
    });

    this.calculateHeightsAfterUncollapse = calculateHeightsAfterUncollapse.bind(
      this
    );
    const openTimeLineWindows = sessionStorage.getItem(`openTimeLineWindows`);
    this.state = {
      timelineWindows:
        openTimeLineWindows && !this.props.previewMode
          ? openTimeLineWindows
          : this.defaultWindows,
      hourWidthInPx: 0,
      columnWidthInPx: 0,
      width: null,
      height: null,
      initialColumnWidthInPx: 0,
      pairings: [],
      flights: [],
      outerWidth: 0,
      innerWidth: 0,
      defaultTimelineWindowHeight: 0,
      selectedPairing: [],
      showPairingDetails: false,
      previewMode: this.props.previewMode,
      ruleSelected: null,
      setSelectedPairing: selectedPairing => {
        this.setState({ selectedPairing: [selectedPairing] });
      },
      clearSelectedPairing: () => {
        if (this.state.selectedPairing.length) {
          this.setState({ selectedPairing: [], showPairingDetails: false });
        }
      },
      openPairingDetails: () => {
        this.setState({ showPairingDetails: true });
      },
      closePairingDetails: () => {
        this.setState({ showPairingDetails: false });
      },
      openRuleEditDialog: ruleSelected => {
        this.setState({ ruleSelected });
      },
    };

    this.isZoomed = false;
    this.zoomStartDay = 0;
    this.zoomEndDay = 0;
    this.scrollLeft = 0;

    const { periodStartDate, periodEndDate } = props;

    const timelineStartDate = moment
      .utc(periodStartDate)
      .subtract(CARRY_IN_DAYS, 'days');
    const timelineEndDate = moment
      .utc(periodEndDate)
      .add(CARRY_OUT_DAYS, 'days');
    const periodDurationDays = getDaysInDatesRange(
      periodStartDate,
      periodEndDate
    );

    const totalCarryDays = CARRY_IN_DAYS + CARRY_OUT_DAYS;
    const periodVisibleDays = Math.min(periodDurationDays, MAX_PERIOD_DAYS);
    const initialTimelineVisibleDays = periodVisibleDays + totalCarryDays;
    const totalTimelineDurationDays = periodDurationDays + totalCarryDays;

    const calendarData = generateCalendarData({
      timelineStartDate,
      periodStartDate,
      periodEndDate,
      timelineEndDate,
    });

    // Please do not remove next commented console.log,
    // it is useful for debug purposes
    /*
    console.log('>>> INIT', {
      periodDurationDays,
      periodVisibleDays,
      timelineVisibleDays,
      totalTimelineDurationDays,
    });
    */
    this.initialTimelineVisibleDays = initialTimelineVisibleDays;
    this.timelineVisibleDays = initialTimelineVisibleDays;
    this.totalTimelineDurationDays = totalTimelineDurationDays;
    this.timelineStartDate = timelineStartDate.toISOString();
    this.calendarData = calendarData;

    this.timelineHeaderRef = React.createRef();
    this.timelineWindowRefs = [];

    this.monthsRef = React.createRef();

    this.pendingWindowIndexToDelete = null;
  }

  componentWillMount() {
    document.body.classList.add('hide-overflow');
    this.w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  componentWillUnmount() {
    document.body.classList.remove('hide-overflow');
    const { timelineWindows } = this.state;
    const openTimeLineWindows = timelineWindows;
    sessionStorage.setItem(`openTimeLineWindows`, openTimeLineWindows);
  }

  componentWillReceiveProps(nextProps) {
    const { pairings, flights, timelineWindowsCount } = nextProps;
    const { timelineWindowsCount: prevTimelineWindowsCount } = this.props;
    const { timelineWindows } = this.state;
    const pairingsData = preparePairingsData(pairings, this.timelineStartDate);
    const flightsData = prepareFlightsData(flights, this.timelineStartDate);

    const newState = {
      ...this.state,
      pairings: pairingsData,
      flights: flightsData,
    };

    const windowAdded = timelineWindowsCount > prevTimelineWindowsCount;

    if (windowAdded) {
      const windows = timelineWindows.slice(0);
      const indexedWindows = indexingWindows(windows);

      const previousWindow = indexedWindows
        .reverse()
        .find(window => window.height > MIN_TIMELINE_WINDOW_HEIGHT * 2);
      const previousWindowIndex = previousWindow ? previousWindow.index : 1;
      const previousWindowHeight = windows[previousWindowIndex].height;

      const [newPrevWindowHeight, newWindowHeight] = splitValue(
        previousWindowHeight
      );

      /* Update previous windows height with the new calculated one */
      windows[previousWindowIndex].height = newPrevWindowHeight;

      /* Configure the new window */
      const windowCloseIndex = windows.findIndex(
        window => window.isOpen === false
      );
      if (windowCloseIndex > -1) {
        windows[windowCloseIndex].isOpen = true;
        windows[windowCloseIndex].collapsed = false;
        windows[windowCloseIndex].height = newWindowHeight;
      }

      /* Add the new window to the previous updated ones */
      newState.timelineWindows = windows;
      sessionStorage.setItem(`openTimeLineWindows`, newState.timelineWindows);
    }

    this.setState(newState);
  }

  onResize = (width, height) => {
    // const columnWidthInPx = Math.floor(width / this.timelineVisibleDays);
    const { timelineWindows } = this.state;
    const initialColumnWidthInPx = width / this.totalTimelineDurationDays;
    const columnWidthInPx = width / this.timelineVisibleDays;
    const hourWidthInPx = columnWidthInPx / 24;
    const outerWidth = columnWidthInPx * this.timelineVisibleDays;
    const innerWidth = columnWidthInPx * this.totalTimelineDurationDays;
    const defaultTimelineWindowHeight = Math.ceil(height - tmHeaderHeight);
    // const innerWidth = Math.floor(
    //   columnWidthInPx * this.totalTimelineDurationDays + 1
    // );

    const allWindows = timelineWindows.reduce((a, b) => {
      return { height: a.height + b.height };
    });

    const lastWindowHeight = defaultTimelineWindowHeight - allWindows.height;
    const timelineWindowsCopy = [...timelineWindows];
    const lastTimelineWindowId = timelineWindowsCopy
      .reverse()
      .find(window => window.isOpen === true).id;

    const newTimelineWindows = timelineWindows.map(
      window =>
        window.id === lastTimelineWindowId
          ? { ...window, height: window.height + lastWindowHeight }
          : window
    );
    sessionStorage.setItem(`openTimeLineWindows`, newTimelineWindows);

    this.scrollLeft = this.zoomStartDay * columnWidthInPx;

    const timelineCalcs = {
      width,
      height,
      columnWidthInPx,
      hourWidthInPx,
      outerWidth,
      innerWidth,
      initialColumnWidthInPx,
      defaultTimelineWindowHeight,
      timelineWindows: newTimelineWindows,
    };

    const firstWindowsHasNoHeightSet = !timelineWindows[0].height;
    if (firstWindowsHasNoHeightSet) {
      timelineCalcs.timelineWindows[0].height = defaultTimelineWindowHeight;
    }

    // Please do not remove next commented console.log,
    // it is useful for debug purposes
    // console.log('>>> TIMELINE CALCS', timelineCalcs);

    this.setState(timelineCalcs);
  };

  resetTimeline = index => {
    if (index !== undefined) {
      if (this.state.timelineWindows[index].isOpen) {
        this.timelineWindowRefs[index].current._container.scrollTop = 0;
      }
    } else {
      this.onZoomOut(0, 0);
      for (let i = 0; i < this.state.timelineWindows.length; i++) {
        if (this.state.timelineWindows[i].isOpen) {
          this.timelineWindowRefs[i].current._container.scrollTop = 0;
        }
      }
    }
  };

  generateTimelineWindows = () => {
    const { timelineWindows, defaultTimelineWindowHeight } = this.state;
    const {
      t,
      fetchData,
      timelineWindowsCount,
      filterCriteria,
      setFilter,
    } = this.props;
    const timeLineWindow = [];
    const windows = timelineWindows.slice(0);
    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      if (window.isOpen) {
        this.timelineWindowRefs[i] = React.createRef();
        const timelineWindowHeight =
          window.height || defaultTimelineWindowHeight;
        timeLineWindow.push(
          <TimelineWindow
            index={i}
            key={i}
            t={t}
            id={window.id}
            timelineWindowsCount={timelineWindowsCount}
            calendarData={this.calendarData}
            isCollapsed={window.collapsed}
            timelineWindowHeight={timelineWindowHeight}
            defaultTimelineWindowHeight={defaultTimelineWindowHeight}
            onScrollX={this.onScrollX}
            timelineWindowRef={this.timelineWindowRefs[i]}
            timelineVisibleDays={this.timelineVisibleDays}
            onCloseTimelineWindow={this.onCloseTimelineWindow}
            onCollapseTimelineWindow={this.onCollapseTimelineWindow}
            updateWindowsHeights={this.updateWindowsHeights}
            fetchData={fetchData}
            isZoomed={this.isZoomed}
            filterCriteria={filterCriteria}
            setFilter={setFilter}
          />
        );
      }
    }

    return timeLineWindow;
  };

  onScrollX = container => {
    container.dispatchEvent(this.event);
    this.scrollLeft = container.scrollLeft;

    /* Sync the day selection on the month timeline */
    if (this.monthsRef.current) {
      this.monthsRef.current.style.left = `-${this.scrollLeft}px`;
    }

    /* Sync the Timeline Header with the horizontal scroll */
    this.timelineHeaderRef.current.style.left = `-${this.scrollLeft}px`;

    /* Sync the horizontal scroll on all Timeline Windows */
    this.timelineWindowRefs.forEach(ref => {
      if (ref.current) {
        ref.current._container.scrollLeft = this.scrollLeft;
      }
    });

    this.moveMonthTitles();
  };

  moveMonthTitles = () => {
    const monthsRef = this.monthsRef.current;
    const monthContainers = monthsRef.getElementsByClassName('month-holder');

    for (let i = 0; i <= monthContainers.length - 1; i++) {
      const monthContainer = monthContainers[i];
      const monthContainerRect = monthContainer.getBoundingClientRect();
      const monthXStart = monthContainerRect.x || monthContainerRect.left;
      const monthXEnd = monthXStart + monthContainerRect.width;

      const monthIsCompletelyOutOfScreen =
        monthXEnd <= 0 || monthXStart > this.w;

      if (!monthIsCompletelyOutOfScreen) {
        const monthTitle = monthContainer.getElementsByClassName(
          'month-title'
        )[0];

        if (monthXStart >= 0 && monthXEnd <= this.w) {
          monthTitle.style.left = 0;
          monthTitle.style.right = 'auto';
          monthTitle.style.width = `100%`;
        } else if (monthXStart < 0 && monthXEnd <= this.w) {
          const monthNewWidth = monthXEnd;
          monthTitle.style.left = 'auto';
          monthTitle.style.right = 0;
          monthTitle.style.width = `${monthNewWidth}px`;
        } else if (monthXStart > 0 && monthXEnd > this.w) {
          const monthNewWidth = this.w - monthXStart;
          monthTitle.style.left = 0;
          monthTitle.style.right = 'auto';
          monthTitle.style.width = `${monthNewWidth}px`;
        } else if (monthXStart <= 0 && monthXEnd > this.w) {
          const monthNewWidth = this.w;
          monthTitle.style.left = `${Math.abs(monthXStart)}px`;
          monthTitle.style.right = 'auto';
          monthTitle.style.width = `${monthNewWidth}px`;
        }
      }
    }
  };

  onZoomSelection = (zoomStartDay, zoomEndDay) => {
    if (
      this.zoomStartDay !== zoomStartDay ||
      this.zoomEndDay !== zoomEndDay ||
      this.isZoomed === false
    ) {
      this.timelineVisibleDays = zoomEndDay - zoomStartDay + 1;
      this.zoomEndDay = zoomEndDay;
      this.zoomStartDay = zoomStartDay;
      this.isZoomed = true;
      this.onResize(this.state.width, this.state.height);
    }
  };
  onZoomOut = (zoomStartDay, zoomEndDay) => {
    if (
      this.zoomStartDay !== zoomStartDay ||
      this.zoomEndDay !== zoomEndDay ||
      this.isZoomed === true
    ) {
      this.zoomStartDay = zoomStartDay;
      this.zoomEndDay = zoomEndDay;
      this.isZoomed = false;
      this.timelineVisibleDays = this.initialTimelineVisibleDays;
      this.onResize(this.state.width, this.state.height);
    }
  };

  onCloseTimelineWindow = (windowIndex, id) => {
    const { updateTimelineWindowsCount, timelineWindowsCount } = this.props;

    const windows = this.state.timelineWindows;

    const windowToDelete = this.state.timelineWindows.find(
      window => window.id === id
    );
    const windowToDeleteHeight = windowToDelete.height;

    const allPrevWindows = this.state.timelineWindows.filter(
      window => window.id !== id
    );

    const indexedWindows = indexingWindows(allPrevWindows);
    const firstNonCollapsed = indexedWindows
      .reverse()
      .find(window => !window.collapsed && window.isOpen);

    /* Remove ref and close window */
    this.timelineWindowRefs.splice(windowIndex, 1);
    windows.forEach(window => {
      if (window.id === id) {
        window.isOpen = false;
        window.height = 0;
      }
      /* Sum the height of the closing window to the previous non-collapsed window */
      if (window.id === firstNonCollapsed.id) {
        window.height += windowToDeleteHeight;
      }
    });
    sessionStorage.setItem(`openTimeLineWindows`, windows);
    this.setState({ timelineWindows: windows });

    updateTimelineWindowsCount(timelineWindowsCount - 1);
  };

  updateWindowsHeights = windowsHeights => {
    const windows = this.state.timelineWindows.slice(0);
    let index = 0;
    windows.forEach(window => {
      if (window.isOpen) {
        windows[window.id - 1].height = windowsHeights[index];
        index++;
      }
    });
    sessionStorage.setItem(`openTimeLineWindows`, windows);
    this.setState({ timelineWindows: windows });
  };

  onCollapseTimelineWindow = windowIndex => {
    const windows = this.state.timelineWindows.slice(0);
    const isCollapsed = windows[windowIndex].collapsed;

    if (isCollapsed) {
      const calculatedHeights = this.calculateHeightsAfterUncollapse(
        windowIndex
      );

      /* Update new calculated heights */
      for (let i = 0; i < windows.length; i++) {
        windows[i].height = calculatedHeights[i];
      }

      windows[windowIndex].prevHeight = null;
      windows[windowIndex].collapsed = false;
    } else {
      const currentWindowHeight = windows[windowIndex].height;
      const indexedWindow = indexingWindows(windows);
      const previousWindow = indexedWindow
        .slice(0, windowIndex)
        .reverse()
        .find(window => !window.collapsed && window.isOpen);

      windows[previousWindow.index].height +=
        currentWindowHeight - MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED;

      windows[windowIndex].prevHeight = currentWindowHeight;
      windows[windowIndex].height = MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED;
      windows[windowIndex].collapsed = true;
    }
    sessionStorage.setItem(`openTimeLineWindows`, windows);

    this.setState({
      timelineWindows: windows,
    });
  };

  componentDidUpdate() {
    this.timelineWindowRefs.forEach(ref => {
      if (ref.current) {
        ref.current._container.scrollLeft = this.scrollLeft;
      }
    });
  }

  closeRuleEditDialog = () => this.setState({ ruleSelected: null });

  render() {
    const {
      isSolverResult,
      readOnly,
      openItemId,
      ruleset,
      previewMode,
      t,
    } = this.props;
    // const toolBarHeight = window.innerWidth <= 1111 ? 150 : 105;
    const toolBarHeight = 105;
    const solverResultBarHeight = solverResultBarHeights[isSolverResult];
    const {
      innerWidth,
      outerWidth,
      columnWidthInPx,
      initialColumnWidthInPx,
      showPairingDetails,
      closePairingDetails,
      selectedPairing,
      ruleSelected,
    } = this.state;

    return (
      <TimelineContext.Provider value={this.state}>
        <div
          className="pairing-timeline"
          style={{
            height: `calc(100vh - (${toolBarHeight}px + ${solverResultBarHeight}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 25,
              left: 25,
              opacity: 0.4,
              zIndex: 99,
              display: 'none',
            }}
          >
            Timeline {this.state.width}x{this.state.height}
          </div>
          <ReactResizeDetector
            handleWidth
            handleHeight
            onResize={this.onResize}
          />
          <div
            className="outer-container"
            style={{
              width: outerWidth,
            }}
          >
            <TimelineHeader
              t={t}
              width={innerWidth}
              calendarData={this.calendarData}
              columnWidthInPx={columnWidthInPx}
              timelineHeaderRef={this.timelineHeaderRef}
              onZoomSelection={this.onZoomSelection}
              leftScroll={this.scrollLeft}
              timelineVisibleDays={this.timelineVisibleDays}
              initialColumnWidthInPx={initialColumnWidthInPx}
              outerWidth={outerWidth}
              totalTimelineDurationDays={this.totalTimelineDurationDays}
              isZoomed={this.isZoomed}
              startDay={this.zoomStartDay}
              monthsRef={this.monthsRef}
            />
            {this.generateTimelineWindows()}
            <TimelineZoom
              t={t}
              timelineWindowRef={this.timelineWindowRefs[0]}
              onZoomOut={this.onZoomOut}
              columnWidthInPx={columnWidthInPx}
              onZoomSelection={this.onZoomSelection}
              totalTimelineDurationDays={this.totalTimelineDurationDays}
              timelineVisibleDays={this.timelineVisibleDays}
              initialTimelineVisibleDays={this.initialTimelineVisibleDays}
            />
          </div>
        </div>
        <PairingDetails
          selectedPairing={selectedPairing[0]}
          open={showPairingDetails}
          onClose={closePairingDetails}
          t={t}
        />
        <RuleDialogWithErrorHandling
          t={t}
          open={!!ruleSelected}
          rule={ruleSelected}
          readOnly={readOnly || previewMode}
          openItemId={openItemId}
          ruleset={ruleset}
          handleCancel={this.closeRuleEditDialog}
        />
      </TimelineContext.Provider>
    );
  }
}

Timeline.propTypes = {
  t: PropTypes.func.isRequired,
  periodStartDate: PropTypes.string.isRequired,
  periodEndDate: PropTypes.string.isRequired,
  pairings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isSolverResult: PropTypes.bool.isRequired,
  updateTimelineWindowsCount: PropTypes.func.isRequired,
  timelineWindowsCount: PropTypes.number.isRequired,
  previewMode: PropTypes.bool.isRequired,
  filterCriteria: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFilter: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  openItemId: PropTypes.number.isRequired,
  ruleset: PropTypes.number,
};

Timeline.defaultProps = {
  readOnly: false,
  ruleset: null,
};

export default Timeline;
