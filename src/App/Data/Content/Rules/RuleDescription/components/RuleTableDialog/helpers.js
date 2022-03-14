import moment from 'moment';
import { getComponentDefaults } from './constants';

export const getKeyItem = (value, tableData, keyField) => {
  const item = tableData.data.find(item => item[keyField] === value);
  return item;
};

const generateTimeKey = (position, rowDataValue, isFooter, counter = 0) => {
  let value;
  const format = 'HH:mm';
  if (isFooter) {
    value = moment(rowDataValue, format)
      .add(1 + counter, 'minutes')
      .format(format);
  } else if (position === 'above') {
    value = moment(rowDataValue, format)
      .subtract(1 + counter, 'minutes')
      .format(format);
  } else {
    value = moment(rowDataValue, format)
      .add(1 + counter, 'minutes')
      .format(format);
  }
  return value;
};

const generateDateKey = (position, rowDataValue, isFooter, counter = 0) => {
  let value;
  const format = 'YYYY-MM-DD';
  if (isFooter) {
    value = moment(rowDataValue, format)
      .add(1 + counter, 'day')
      .format(format);
  } else if (position === 'above') {
    value = moment(rowDataValue, format)
      .subtract(1 + counter, 'day')
      .format(format);
  } else {
    value = moment(rowDataValue, format)
      .add(1 + counter, 'day')
      .format(format);
  }
  return value;
};

export const generateKey = (
  type,
  tableData,
  keyField,
  index,
  position,
  isFooter
) => {
  // To handle empty data table
  if (!tableData.data) {
    const config = getComponentDefaults(type);
    return config ? config.defaultValue : Symbol(type);
  }

  const { data } = tableData;
  const rowData = isFooter ? data[index - 1] : data[index];
  const rowDataValue = rowData ? rowData[keyField] : null;

  if (rowData && typeof rowDataValue !== 'symbol') {
    let counter = 0;
    while (true) {
      let value;
      if (type === 'timeParamType') {
        value = generateTimeKey(position, rowDataValue, isFooter, counter);
        counter++;
      }

      if (type === 'dateParamType') {
        value = generateDateKey(position, rowDataValue, isFooter, counter);
        counter++;
      }

      // primary base case
      if (!getKeyItem(value, tableData, keyField)) return value;

      // Secondary base case added for extra safety to prevent stack overflow.
      if (counter > 100) return Symbol(type);
    }
  } else {
    const config = getComponentDefaults(type);
    return config ? config.defaultValue : Symbol(type);
  }
};

export const generateInitialTimeRanges = (data, fromField) => {
  const format = 'HH:mm';
  for (let i = 0; i < data.length; i++) {
    const nextFrom =
      i === data.length - 1 ? data[0][fromField] : data[i + 1][fromField];
    if (nextFrom && typeof nextFrom !== 'symbol') {
      const _to = moment(nextFrom, format)
        .subtract(1, 'minutes')
        .format(format);
      if (!data[i]['_to']) {
        data[i]['_to'] = _to;
      }
    }
  }
  return data;
};

export const generateUpdatedTimeRanges = (tableData, fromField, index) => {
  const data = tableData.data;
  const format = 'HH:mm';
  if (typeof data[index][fromField] === 'symbol') {
    const prevTo = index > 0 ? data[index - 1]['_to'] : null;
    if (prevTo && typeof prevTo !== 'symbol') {
      const value = moment(prevTo, format)
        .add(1, 'minutes')
        .format(format);
      if (!getKeyItem(value, tableData, fromField)) {
        data[index][fromField] = value;
      }
    }
  }
  return {
    ...tableData,
    data,
  };
};
