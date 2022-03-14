import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  oneDayTime,
  fewDaysTime,
  zoomLevels,
  classZoomDays,
} from '../constants';
import {
  cancelZoomSelection,
  onMouseOut,
  onHoverHighlight,
  onZoomSelection,
} from '../zoomHelpers';

class TimelineDays extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionStartDay: null,
      selectionEndDay: null,
      hoverHighlight: false,
    };
    this.nodesToDays = [];
    this.onZoomSelection = onZoomSelection.bind(this);
    this.cancelZoomSelection = cancelZoomSelection.bind(this);
    this.onHoverHighlight = onHoverHighlight.bind(this);
  }

  componentDidMount() {
    this.nodesToDays = document.querySelectorAll(`.${classZoomDays}`);
    document.addEventListener('click', e =>
      this.cancelZoomSelection(e, classZoomDays)
    );
  }

  componentWillUnmount() {
    window.removeEventListener('click', e =>
      this.cancelZoomSelection(e, classZoomDays)
    );
  }

  handleMouseOut = () => {
    if (this.props.timelineVisibleDays !== 1) {
      onMouseOut(this.state.selectionEndDay, classZoomDays);
    }
  };

  handleHoverHighlight = e => {
    if (this.props.timelineVisibleDays !== 1) {
      this.onHoverHighlight(e, this.nodesToDays, classZoomDays, 'id');
    }
  };

  handleZoomSelection = dayIndex => {
    if (this.props.timelineVisibleDays !== 1) {
      this.onZoomSelection(dayIndex, classZoomDays);
    }
  };

  render() {
    const { calendarData, columnWidthInPx, timelineVisibleDays } = this.props;
    const { selectionStartDay, selectionEndDay } = this.state;
    let showHours = false;
    let columnHrsWidthInPx = null;
    let relativeTime = null;
    if (timelineVisibleDays <= zoomLevels.levelTwo) {
      showHours = true;
      columnHrsWidthInPx =
        timelineVisibleDays === 1 ? columnWidthInPx / 24 : columnWidthInPx / 12;
      relativeTime = timelineVisibleDays === 1 ? oneDayTime : fewDaysTime;
    }
    const ptClasses = classNames({
      'pt-dates': true,
      dark_bg: selectionStartDay !== null,
    });

    return (
      <div ref={this.props.timelineHeaderRef} className={ptClasses}>
        {calendarData.map(month =>
          month.days.map(day => {
            const givenClass = classNames({
              [`${classZoomDays}`]: true,
              selected:
                selectionStartDay === day.dayIndex ||
                selectionEndDay === day.dayIndex,
              divided: showHours,
              lock_hover: timelineVisibleDays === 1,
            });

            return (
              <div
                id={day.dayIndex}
                key={day.relativeDay}
                className={givenClass}
                style={{ width: `${columnWidthInPx}px` }}
                onClick={() => this.handleZoomSelection(day.dayIndex)}
                onMouseOver={this.handleHoverHighlight}
                onFocus={() => {}}
                onMouseOut={this.handleMouseOut}
                onBlur={() => {}}
              >
                {showHours && (
                  <Fragment>
                    <div className="date inline">
                      <span>
                        {`${day.dayName} ${day.dayNumber} (${day.relativeDay})`}
                      </span>
                    </div>
                    <div className="relative">
                      {relativeTime.map(time => {
                        return (
                          <div
                            className="hours"
                            key={time}
                            style={{ width: `${columnHrsWidthInPx}px` }}
                          >
                            {time}
                          </div>
                        );
                      })}
                    </div>
                  </Fragment>
                )}
                {!showHours && (
                  <Fragment>
                    <div className="date">
                      <span>{day.dayShortName}</span>
                      <span>{day.dayNumber}</span>
                    </div>
                    <div className="relative">{day.relativeDay}</div>
                  </Fragment>
                )}
                {day.isFirstDayOfMonth && <span className="month-separator" />}
              </div>
            );
          })
        )}
      </div>
    );
  }
}

TimelineDays.propTypes = {
  calendarData: PropTypes.arrayOf(Object).isRequired,
  columnWidthInPx: PropTypes.number.isRequired,
  onZoomSelection: PropTypes.func.isRequired,
  timelineVisibleDays: PropTypes.number.isRequired,
  timelineHeaderRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
};

export default TimelineDays;
