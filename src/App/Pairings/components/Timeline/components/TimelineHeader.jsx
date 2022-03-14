import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TimelineMonths, TimelineDays } from './';

class TimelineHeader extends Component {
  componentDidUpdate() {
    if (this.props.timelineHeaderRef.current) {
      this.props.timelineHeaderRef.current.style.left = `-${
        this.props.leftScroll
      }px`;
    }
  }
  render() {
    const {
      t,
      timelineHeaderRef,
      width,
      calendarData,
      columnWidthInPx,
      onZoomSelection,
      timelineVisibleDays,
      leftScroll,
      initialColumnWidthInPx,
      outerWidth,
      totalTimelineDurationDays,
      isZoomed,
      startDay,
      monthsRef,
    } = this.props;

    return (
      <div className="pt-header" style={{ width: width }}>
        <TimelineMonths
          t={t}
          width={width}
          leftScroll={leftScroll}
          calendarData={calendarData}
          initialColumnWidthInPx={initialColumnWidthInPx}
          columnWidthInPx={columnWidthInPx}
          outerWidth={outerWidth}
          totalTimelineDurationDays={totalTimelineDurationDays}
          isZoomed={isZoomed}
          timelineVisibleDays={timelineVisibleDays}
          startDay={startDay}
          monthsRef={monthsRef}
          onZoomSelection={onZoomSelection}
        />
        <TimelineDays
          timelineHeaderRef={timelineHeaderRef}
          calendarData={calendarData}
          columnWidthInPx={columnWidthInPx}
          onZoomSelection={onZoomSelection}
          timelineVisibleDays={timelineVisibleDays}
        />
      </div>
    );
  }
}

TimelineHeader.propTypes = {
  t: PropTypes.func.isRequired,
  calendarData: PropTypes.arrayOf(Object).isRequired,
  columnWidthInPx: PropTypes.number.isRequired,
  timelineHeaderRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  onZoomSelection: PropTypes.func.isRequired,
  timelineVisibleDays: PropTypes.number.isRequired,
  leftScroll: PropTypes.number,
  width: PropTypes.number,
  initialColumnWidthInPx: PropTypes.number.isRequired,
  outerWidth: PropTypes.number.isRequired,
  totalTimelineDurationDays: PropTypes.number.isRequired,
  isZoomed: PropTypes.bool.isRequired,
  startDay: PropTypes.number.isRequired,
  monthsRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

TimelineHeader.defaultProps = {
  leftScroll: 0,
  width: null,
};

export default TimelineHeader;
