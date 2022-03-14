import React from 'react';
import PropTypes from 'prop-types';

const hour24 = Array(23).fill(1);
const hour12 = Array(11).fill(1);

const TimelineDay = props => {
  const { timelineVisibleDays, hourWidthInPx, isFirstDayOfMonth } = props;
  return (
    <div
      className={`${props.className} ${
        timelineVisibleDays < 4 ? 'day-in-timeline' : ''
      }`}
      style={props.style}
    >
      {timelineVisibleDays === 1 &&
        hour24.map((val, index) => (
          <div
            key={index}
            className="hour-in-timeline"
            style={{ width: hourWidthInPx }}
          />
        ))}
      {timelineVisibleDays > 1 &&
        timelineVisibleDays < 4 &&
        hour12.map((val, index) => (
          <div
            key={index}
            className="hour-in-timeline"
            style={{ width: hourWidthInPx * 2 }}
          />
        ))}
      {isFirstDayOfMonth && <span className="month-separator" />}
    </div>
  );
};

TimelineDay.propTypes = {
  className: PropTypes.string.isRequired,
  timelineVisibleDays: PropTypes.number.isRequired,
  hourWidthInPx: PropTypes.number.isRequired,
  style: PropTypes.shape({
    width: PropTypes.number,
    heigth: PropTypes.number,
  }).isRequired,
};

export default TimelineDay;
