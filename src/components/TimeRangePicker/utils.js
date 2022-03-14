import moment from 'moment';

export const timeCreator = value => {
  const d = '1960-2-10 '; //just a random date
  return moment(d + value.trim()).toDate();
};
