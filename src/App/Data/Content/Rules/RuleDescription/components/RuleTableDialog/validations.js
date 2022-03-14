import moment from 'moment';
import { t } from 'i18next';

export const validateTimeRangeGaps = (tableData, fromField) => {
  const data = tableData.data;
  const format = 'HH:mm';
  for (let i = 0; i < data.length; i++) {
    const prevTo = i > 0 ? data[i - 1]['_to'] : data[data.length - 1]['_to'];
    const from = data[i][fromField];
    if (prevTo && typeof from !== 'symbol') {
      const toPlusOne = moment(prevTo, format)
        .add(1, 'minutes')
        .format(format);
      if (toPlusOne !== from) {
        throw new Error(t(`ERRORS.RULE_TABLE.noGapTimeRange`));
      }
    }
  }
};

export const validateTimeRangeDuration = (tableData, fromField) => {
  const data = tableData.data;
  const format = 'HH:mm';
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const from = data[i][fromField];
    const to = data[i]['_to'];

    if (typeof from !== 'symbol' && to) {
      let diff;
      if (moment(to, format).isAfter(moment(from, format))) {
        diff = moment(to, format).diff(
          moment(from, format).subtract(1, 'minutes')
        );
      } else {
        diff = moment(to, format)
          .add(1, 'day')
          .diff(moment(from, format).subtract(1, 'minutes'));
      }
      sum += diff;
    }
  }
  const totalMinutes = moment.duration(sum).asMinutes();
  if (totalMinutes !== 1440) {
    throw new Error(t(`ERRORS.RULE_TABLE.notExactOneDay`));
  } else {
    // Check start time of the first row = end time of the last row + 00:01
    const startTime = data[0][fromField];
    const endTime = data[data.length - 1]['_to'];
    const endTimePlusOne = moment(endTime, format)
      .add(1, 'minutes')
      .format(format);
    if (startTime !== endTimePlusOne) {
      throw new Error(t(`ERRORS.RULE_TABLE.notExactOneDay`));
    }
  }
};
