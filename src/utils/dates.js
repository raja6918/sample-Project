import moment from 'moment';

const longFormat = 'MMM DD, YYYY';
const shortFormat = 'MMM DD';
const hoursFormat = 'LT';
const dayFormat = 'DD, YYYY';
const fullFormat = 'DD-MMM-YYYY [at] HH:mm';
const flightFormat = 'YYYY-MM-DD';

export const dateRange = (start, end) => {
  const date1 = moment.utc(start);
  const date2 = moment.utc(end);

  const sameYear = date1.year() === date2.year();
  const sameMonth = date1.month() === date2.month();

  return `${date1.format(sameYear ? shortFormat : longFormat)} - ${date2.format(
    sameYear && sameMonth ? dayFormat : longFormat
  )}`.toUpperCase();
};

export const prettyFormat = date => {
  const utcDate = moment.utc(date);

  return utcDate.format(longFormat).toUpperCase();
};

export const formatFlightDate = date => {
  if (!date) {
    return '';
  }

  const flightDate = moment(date).format(flightFormat);
  return flightDate;
};

export const formatDepartureDates = (type = 'start') => {
  let date = '';

  if (type === 'start') {
    date = moment().format(flightFormat);
  } else if (type === 'end') {
    date = moment()
      .add(3, 'M')
      .format(flightFormat);
  }

  return date;
};

export const lastModified = timestamp => {
  if (!timestamp) {
    return '';
  }
  const date = moment.utc(timestamp);
  if (date.isSame(new Date(), 'day')) {
    return date.format(hoursFormat);
  }
  return date.format(longFormat).toUpperCase();
};

export const isToday = timestamp => {
  const date = moment.utc(timestamp);
  return date.isSame(new Date(), 'day');
};

export const isThisMonth = timestamp => {
  const date = moment.utc(timestamp);
  return date.isSame(new Date(), 'month');
};

export const addDays = (date, days) => {
  const myDate = moment(moment.utc(date)).add(days - 1, 'days');

  return dateRange(date, myDate);
};

export const sumDays = (date, days) => {
  const myDate = moment(moment.utc(date)).add(days - 1, 'days');

  return myDate.toISOString();
};

export const dateToUtc = date => {
  return moment(moment.utc(date)).format();
};

export const stringDateTime = timestamp => {
  if (!timestamp) {
    return '';
  }
  const date = moment.utc(timestamp);
  return date.format('MMMM D, YYYY [at] h:mm A');
};

export const fullDisplay = timestamp =>
  timestamp !== null
    ? moment.utc(timestamp).format(fullFormat)
    : moment.utc().format(fullFormat);

export const getFormattedTime = time => {
  if (time) {
    time = time.split(':');
    const date = new Date(2010, 10, 10, 10, 10, 10);
    date.setHours(time[0], time[1], 0);
    return date;
  } else {
    return '';
  }
};
