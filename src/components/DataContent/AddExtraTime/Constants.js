import { getFormattedTime } from '../../../utils/dates';

export const EXTRA_TIME_ROW_LIMIT = 5;
export const extraTimeModel = {
  extraTime: 0,
  startTime: getFormattedTime('00:00'),
  endTime: getFormattedTime('23:59'),
};

export const extraTimeErrorModel = {
  extraTime: false,
  starEndTime: false,
};
