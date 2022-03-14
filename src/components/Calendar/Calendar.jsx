import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Header } from './Header';
import CustomInfiniteCalendar from './CustomInfiniteCalendar';

class Calendar extends Component {
  state = {
    displayMode: 'days',
  };

  minDate = null;
  maxDate = null;
  datesArray = [null];

  componentWillMount() {
    this.minDate = moment(this.props.startDate, 'YYYY-MM-DD')
      .subtract(this.props.carryIn, 'd')
      .toDate();
    this.maxDate = moment(this.props.endDate, 'YYYY-MM-DD')
      .add(this.props.carryOut, 'd')
      .toDate();

    this.props.flightDates.forEach(flight => {
      const flightDate = moment(flight, 'YYYY-MM-DD').toDate();
      this.datesArray.push(flightDate);
    });
  }

  componentDidMount() {
    this.updateMonthDiv(this.minDate);
  }

  onCalendarScroll = scrollTop => {
    const weekElements = document.getElementsByClassName('Cal__Month__row');
    const rowsScrolled = Math.floor(scrollTop / 56);
    const dayDate = weekElements[rowsScrolled]
      .getElementsByClassName('Cal__Day__root')[0]
      .getAttribute('data-date');

    this.updateMonthDiv(dayDate);
  };

  updateMonthDiv = date => {
    const month = moment(date).format('MMMM');
    const year = moment(date).format('YYYY');

    document.getElementById('month').textContent = month;
    document.getElementById('year').textContent = year;
  };

  onSelectDate = date => {
    const dateString = moment(date).format('YYYY-MM-DD');
    this.props.onCalendarUpdates(dateString);
  };

  toggleView = () => {
    let displayMode = 'days';
    if (this.state.displayMode === 'days') {
      displayMode = 'years';
    }

    this.setState({ displayMode });
  };

  render() {
    const { flightDates, t, disabled } = this.props;

    return (
      <React.Fragment>
        {Header(flightDates, t)}
        <CustomInfiniteCalendar
          disabled={disabled}
          flightDates={this.datesArray}
          minDate={this.minDate}
          maxDate={this.maxDate}
          onSelectDate={this.onSelectDate}
          onCalendarScroll={this.onCalendarScroll}
        />
      </React.Fragment>
    );
  }
}

Calendar.propTypes = {
  flightDates: PropTypes.arrayOf(PropTypes.string),
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onCalendarUpdates: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  carryIn: PropTypes.number,
  carryOut: PropTypes.number,
  disabled: PropTypes.bool,
};

Calendar.defaultProps = {
  flightDates: [null],
  carryIn: 0,
  carryOut: 0,
  disabled: false,
};

export default Calendar;
