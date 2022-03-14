import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { TimelineColumnDay } from './';

const TimelineColumns = props => {
  const { days, columnWidthInPx } = props;
  return (
    <Fragment>
      <div className="pt-vertical-lines">
        {days.map(day => {
          const className = classNames({
            'pt-vl': true,
            'carry-day': day.isCarryIn || day.isCarryOut,
            'period-start': day.isPeriodStart,
            'period-end': day.isPeriodEnd,
            'day-after-period-end': day.isDayAfterPeriodEnd,
            weekend: day.isWeekend,
          });
          const { isFirstDayOfMonth } = day;
          return (
            <TimelineColumnDay
              key={day.dayIndex}
              className={className}
              timelineVisibleDays={props.timelineVisibleDays}
              hourWidthInPx={props.hourWidthInPx}
              style={{
                width: columnWidthInPx,
              }}
              isFirstDayOfMonth={isFirstDayOfMonth}
            />
          );
        })}
      </div>
    </Fragment>
  );
};

TimelineColumns.propTypes = {
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnWidthInPx: PropTypes.number.isRequired,
  timelineVisibleDays: PropTypes.number.isRequired,
  hourWidthInPx: PropTypes.number.isRequired,
};

export default TimelineColumns;
