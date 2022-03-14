import moment from 'moment';

export const preparePairingDetailsData = details => {
  const pairingStartDate = moment.utc(details.startDateTime).startOf('day');
  const activities = details.activities;

  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    if (activity.type === 'DUT') {
      /* Calculate relative day */
      const dutyStartDate = moment.utc(activity.startDateTime).startOf('day');
      activity._relativeDay = dutyStartDate.diff(pairingStartDate, 'days') + 1;
    }
  }

  return details;
};

export const getCrewCompositionString = (crewComposition = []) => {
  return crewComposition
    .map(({ quantity, positionCode }) => `${quantity} ${positionCode}`)
    .join(', ');
};

export const getTagsString = (tags = []) => {
  return tags.join(', ');
};

export const getPairingDate = startDate => {
  /*
    Example: Monday, 1st July 2019;
  */
  const date = moment.utc(startDate);
  return date.format('dddd, Do MMMM YYYY');
};

export const getMealsString = (meals = []) => {
  return meals.map(({ quantity, meal }) => `${quantity}${meal}`).join(', ');
};

export const formatTime = (startDateTime, endDateTime) => {
  const startDate = moment.utc(startDateTime);
  const endDate = moment.utc(endDateTime);

  const startTimeStr = startDate.format('HH:mm');
  const endTimeStr = endDate.format('HH:mm');

  const onlyStartDate = startDate.startOf('day');
  const onlyEndDate = endDate.startOf('day');

  const daysDifference = onlyEndDate.diff(onlyStartDate, 'days');

  return { startTimeStr, endTimeStr, daysDifference };
};

export const mainStats = ['credit', 'dutyTime', 'blockTime', 'tafb'];
