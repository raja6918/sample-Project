import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InfiniteCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withMultipleDates,
} from 'react-infinite-calendar';
import './Calendar.css';

class CustomInfiniteCalendar extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      flightDates,
      minDate,
      maxDate,
      onSelectDate,
      onCalendarScroll,
      displayMode,
      disabled,
    } = this.props;

    return (
      <InfiniteCalendar
        width={350}
        height={280}
        min={minDate}
        max={maxDate}
        minDate={minDate}
        maxDate={maxDate}
        autoFocus={false}
        display={displayMode}
        Component={withMultipleDates(Calendar)}
        interpolateSelection={defaultMultipleDateInterpolation}
        selected={flightDates}
        onScroll={scrollTop => {
          onCalendarScroll(scrollTop);
        }}
        onSelect={date => {
          onSelectDate(date);
        }}
        displayOptions={{
          showTodayHelper: false,
          showHeader: false,
        }}
        className={disabled ? 'cal-disabled' : ''}
      />
    );
  }
}

CustomInfiniteCalendar.propTypes = {
  flightDates: PropTypes.arrayOf(PropTypes.shape()),
  minDate: PropTypes.shape().isRequired,
  maxDate: PropTypes.shape().isRequired,
  onSelectDate: PropTypes.func.isRequired,
  onCalendarScroll: PropTypes.func.isRequired,
  displayMode: PropTypes.string,
  disabled: PropTypes.bool,
};

CustomInfiniteCalendar.defaultProps = {
  flightDates: [null],
  displayMode: 'days',
  disabled: false,
};

export default CustomInfiniteCalendar;
