import moment from 'moment';

export const evaluateRegex = (regex, term) => {
  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};

export const parseDate = stringDate => {
  if (!stringDate) return null;
  const utcDate = moment.utc(stringDate).format('Y/MM/DD');
  return utcDate;
};

export const formatDate = (startDate, endDate) => {
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);

  const dialogDates = `${start.format('Y/MM/DD')} to ${end.format('Y/MM/DD')}`;

  return {
    formattedStart: start.format('MMMM Do Y'),
    formattedEnd: end.format('MMMM Do Y'),
    days: end.diff(start, 'days') + 1,
    dialogDates,
  };
};

export const formatFileDate = date => {
  const dateString = moment.utc(date).format('YYYY/MM/DD');
  return dateString;
};

export const formatScenarioDate = date => {
  const dateString = moment.utc(date).format('YYYY-MM-DD');
  return dateString;
};

export const formatVersionDate = date => {
  const dateString = moment.utc(date).format('YYYY/MM/DD');
  const timeString = moment.utc(date).format('H:mm');
  return { dateString, timeString };
};
