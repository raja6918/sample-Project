import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import className from 'classnames';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { TimelineColumns, TimelineRows } from './';
import { TimelineContext } from './../TimelineContext';
import FilterContainer from '../../Filter';
import { DEBUG_MODE, ROW_HEIGHT, ROWS_TO_FETCH } from './../constants';
import { findOptimalStartAndEndIndex } from './../helpers';
import storage from './../../../../../utils/storage';

import enableResizableDiv from './resizable';
import debounce from 'lodash/debounce';
import { perfectScrollConfig } from '../../../../../utils/common';

class TimelineWindow extends Component {
  constructor(props) {
    super(props);
    this.rowsContainerRef = React.createRef();
    this.enableResizableDiv = enableResizableDiv.bind(this);
    this.timer = null;

    this.state = {
      scrollTop: 0,
    };
  }

  componentWillUpdate() {
    this.timerStart = Date.now();
  }

  componentDidUpdate() {
    if (DEBUG_MODE) {
      const elapsedTime = (Date.now() - this.timerStart) / 1000;
      // eslint-disable-next-line
      console.log('>>> Render time:', `${elapsedTime} seconds`);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleOnScrollY = () => {
    const {
      timelineWindowHeight,
      timelineWindowRef,
      index,
      fetchData,
      pairings,
      flights,
    } = this.props;
    const containerRef = timelineWindowRef.current._container;
    const { scrollTop } = timelineWindowRef.current._container;

    this.setState({ scrollTop: scrollTop });

    let objectsToRender = [];

    if (index === 0) {
      // Show pairings in Timeline Window 1
      objectsToRender = pairings;
    } else if (index === 1) {
      // Show pairings in Timeline Window 2
      objectsToRender = flights;
    }

    let visibleStartIndex = 0;

    const rows = containerRef.getElementsByClassName('pt-hl');
    const rowsCount = rows.length;

    let rowsHeightAccum = 0;
    for (let i = 0; i < rowsCount; i++) {
      const row = rows[i];
      rowsHeightAccum += row.offsetHeight;

      if (rowsHeightAccum >= scrollTop) {
        visibleStartIndex = i;
        break;
      }
    }

    const visibleEndIndex =
      visibleStartIndex + Math.ceil(timelineWindowHeight / ROW_HEIGHT);

    let tmpStartIndex = visibleStartIndex - ROWS_TO_FETCH;
    let tmpEndIndex = visibleEndIndex + ROWS_TO_FETCH;

    if (tmpStartIndex <= 0) {
      tmpStartIndex = 0;
    }

    tmpEndIndex = Math.min(rowsCount, tmpEndIndex);

    const { startIndex, endIndex } = findOptimalStartAndEndIndex(
      objectsToRender,
      tmpStartIndex,
      tmpEndIndex
    );

    if (startIndex && endIndex) {
      fetchData(index, { startIndex, endIndex });
    }
  };

  debouncedHandleScrollY = debounce(this.handleOnScrollY, 100);

  componentDidMount() {
    if (this.props.timelineWindows.length > 1) {
      this.enableResizableDiv(this.props);
    }
    //Fix for FF for scrolling to top on refresh
    this.timer = setTimeout(() => {
      this.props.timelineWindowRef.current._container.scrollTop = 0;
    }, 200);
  }

  isEmpty = value => {
    return value === undefined && value === null ? false : true;
  };

  getFilterInfo = timelineId => {
    const payload = storage.getItem(`timelineFilter${timelineId}`);
    if (payload) {
      const data = {
        filterSize: payload.filteredDataSize,
        totalSize: payload.totalDataSize,
        render: payload.render === 'pairings' ? 'pairings' : 'flights',
      };
      if (this.isEmpty(data.filterSize) && this.isEmpty(data.totalSize)) {
        return data;
      }
    }
    return false;
  };

  onCloseTimelineWindow = (index, id) => {
    this.props.onCloseTimelineWindow(index, id);
    storage.removeItem(`timelineFilter${id}`);
    storage.removeItem(`timelineLastFilter${id}`);
    const render = { 1: 'pairings', 2: 'legs' };
    this.props.setFilter(render[id], id);
  };

  render() {
    const {
      t,
      id,
      calendarData,
      index,
      columnWidthInPx,
      onScrollX,
      timelineWindowRef,
      outerWidth,
      timelineWindowHeight,
      defaultTimelineWindowHeight,
      innerWidth,
      timelineVisibleDays,
      hourWidthInPx,
      timelineWindows,
      onCollapseTimelineWindow,
      isCollapsed,
      timelineWindowsCount,
      filterCriteria,
      setFilter,
    } = this.props;

    const days = calendarData
      .map(month => month.days.map(day => day))
      .reduce((acc, val) => acc.concat(val), []);

    const filterInfo = this.getFilterInfo(id);

    const isFirstWindow = index === 0;
    const isUniqueWindow = timelineWindowsCount === 1;
    const isLastWindow = timelineWindows.length - 1 === index;
    const showWindowName = (!isCollapsed && !isUniqueWindow) || filterInfo;
    const windowName = `Timeline #${index + 1}`;
    const ptWindowClass = className({
      'pt-window-container': true,
      'hide-scroll-x': isCollapsed,
      'is-collapsed': isCollapsed,
    });

    return (
      <div
        id={`pt-window-${index}`}
        className={ptWindowClass}
        data-index={index}
        data-total-windows={timelineWindows.length}
        data-default-height={defaultTimelineWindowHeight}
      >
        <div className="pt-window-header">
          {showWindowName && <span className="name">{windowName}</span>}
          {filterInfo && (
            <span className="filter-count">
              ({filterInfo.filterSize}/{filterInfo.totalSize}{' '}
              {filterInfo.render})
            </span>
          )}
          {!isFirstWindow && (
            <React.Fragment>
              <button
                type="button"
                className="collapse-btn"
                onClick={() => onCollapseTimelineWindow(index)}
              >
                {isCollapsed ? (
                  <span>
                    <i className="material-icons">unfold_more</i>
                    {windowName}
                  </span>
                ) : (
                  <i className="material-icons">unfold_less</i>
                )}
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={() => this.onCloseTimelineWindow(index, id)}
              >
                ✕
              </button>
            </React.Fragment>
          )}
        </div>
        <PerfectScrollbar
          onScrollY={this.debouncedHandleScrollY}
          onScrollX={onScrollX}
          ref={timelineWindowRef}
          option={perfectScrollConfig}
        >
          <div
            className="pt-window-container-js"
            data-is-collapsed={isCollapsed}
            data-is-last-window={isLastWindow}
            style={{
              width: outerWidth,
              height: timelineWindowHeight,
            }}
          >
            <div className="pt-window" style={{ width: innerWidth }}>
              <TimelineColumns
                days={days}
                columnWidthInPx={columnWidthInPx}
                timelineVisibleDays={timelineVisibleDays}
                hourWidthInPx={hourWidthInPx}
              />
              <TimelineRows
                columnWidthInPx={columnWidthInPx}
                t={t}
                index={index}
                scrollTop={this.state.scrollTop}
                isZoomed={this.props.isZoomed}
                timelineWindowHeight={timelineWindowHeight}
              />
            </div>
          </div>
        </PerfectScrollbar>
        {!isFirstWindow && (
          <React.Fragment>
            <div className="pt-separator" /> <div className="resize-handler" />
          </React.Fragment>
        )}

        <FilterContainer
          t={t}
          id={id}
          isCollapsed={isCollapsed}
          timelineWindows={timelineWindows}
          filterCriteria={filterCriteria}
          setFilter={setFilter}
        />
      </div>
    );
  }
}

TimelineWindow.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onScrollX: PropTypes.func.isRequired,
  timelineWindowHeight: PropTypes.number.isRequired,
  defaultTimelineWindowHeight: PropTypes.number.isRequired,
  columnWidthInPx: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  calendarData: PropTypes.arrayOf(PropTypes.object).isRequired,
  timelineWindowRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  timelineVisibleDays: PropTypes.number.isRequired,
  hourWidthInPx: PropTypes.number.isRequired,
  outerWidth: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
  timelineWindows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCloseTimelineWindow: PropTypes.func.isRequired,
  onCollapseTimelineWindow: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  isZoomed: PropTypes.bool.isRequired,
  timelineWindowsCount: PropTypes.number.isRequired,
  filterCriteria: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default props => (
  <TimelineContext.Consumer>
    {({
      columnWidthInPx,
      hourWidthInPx,
      innerWidth,
      outerWidth,
      timelineWindows,
      pairings,
      flights,
    }) => (
      <TimelineWindow
        {...props}
        columnWidthInPx={columnWidthInPx}
        hourWidthInPx={hourWidthInPx}
        innerWidth={innerWidth}
        outerWidth={outerWidth}
        timelineWindows={timelineWindows}
        pairings={pairings}
        flights={flights}
      />
    )}
  </TimelineContext.Consumer>
);
