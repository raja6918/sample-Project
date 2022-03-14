import { t } from 'i18next';
import isEmpty from 'lodash/isEmpty';
import { GENERAL, getExpectionMetaInfo } from './constants';
import Sort from '../../../../../../../utils/sortEngine';

export const getTooltipContent = (data, exceptionsSelected) => {
  if (data._header) {
    const revertTo = data._header.revertTo;
    if (revertTo) {
      return t('DATA.rules.ruleTable.tooltip.revertTo', {
        name: exceptionsSelected[revertTo],
      });
    }
    return t('DATA.rules.ruleTable.tooltip.revertTo', {
      name: GENERAL,
    });
  }
};

export const getResetedExceptions = (
  data,
  row,
  exceptions,
  exceptionsSelected
) => {
  if (Array.isArray(exceptions)) {
    const key = data._header.exceptionType;
    const column = data._header.field;
    const selected = exceptionsSelected[key];

    return exceptions.map(exception => {
      if (exception.key === key) {
        // deep clone is needed since we are deleting nested objects
        const exceptionClone = JSON.parse(JSON.stringify(exception));
        const values = exceptionClone.values;
        // delete column
        if (
          values &&
          values[selected] &&
          values[selected][row] &&
          values[selected][row][column]
        ) {
          delete values[selected][row][column];
        }
        // If row become empty delete it
        if (isEmpty(values[selected][row])) {
          delete values[selected][row];
        }
        // If selected become empty delete it
        if (isEmpty(values[selected])) {
          delete values[selected];
        }

        return exceptionClone;
      }
      return exception;
    });
  }
};

/**
 * To find and return the highest priority exception selected.
 *
 * @param {Array} exceptions
 * @param {Object} exceptionsSelected
 */
export const getHighestExpectionType = (exceptions, exceptionsSelected) => {
  let type = null;
  if (Array.isArray(exceptions)) {
    for (const exception of exceptions) {
      if (exceptionsSelected[exception.key]) {
        type = exception.key;
        break;
      }
    }
  }
  return type;
};

export const getUpdatedException = (
  value,
  data,
  row,
  exceptions,
  exceptionsSelected,
  exceptionType
) => {
  const key = exceptionType;
  const column = data._header.field;
  const selected = exceptionsSelected[key];

  return exceptions.map(exception => {
    if (exception.key === key) {
      // deep clone is needed since we are deleting nested objects
      const exceptionClone = JSON.parse(JSON.stringify(exception));
      const values = exceptionClone.values;
      // set selected key is not exit
      if (!(selected in values)) values[selected] = {};
      // set row key is not exit in selected obj
      if (!(row in values[selected])) values[selected][row] = {};
      // finally set column
      values[selected][row][column] = value;
      return exceptionClone;
    }
    return exception;
  });
};

/**
 * When we change value of exception we need to clear all its dependent exceptions ie bottom exceptions.
 *
 * @param {Array} exceptionKeys - exceptions keys in their priority order
 * @param {number} index - exception index in which value choosen
 */
export const clearDependentExceptionsSelected = (exceptionKeys, index) => {
  const nextKeys =
    index + 1 < exceptionKeys.length ? exceptionKeys.slice(index + 1) : [];
  const updatedNextKeys = {};
  for (const key of nextKeys) {
    updatedNextKeys[key] = null;
  }

  return updatedNextKeys;
};

/**
 * When we change value of exception we need to select its parent exceptions ie top exceptions.
 *
 * @param {Array} exceptionKeys - exceptions keys in their priority order
 * @param {number} index - exception index in which value choosen
 * @param {string} value - the choosen value
 * @param {Object} dynamicEnumData - dynamicEnumData prefetched by prefetchExceptions
 */
export const selectDependentExceptions = (
  exceptionKeys,
  index,
  value,
  dynamicEnumData
) => {
  const prevKeys = exceptionKeys.slice(0, index).reverse();
  const updatedPrevKeys = {};
  let prevValue = value;
  for (const key of prevKeys) {
    const exceptionMetaInfo = getExpectionMetaInfo(key);
    if (exceptionMetaInfo.hasMany && prevValue) {
      const items = dynamicEnumData[exceptionMetaInfo.hasMany];
      const item = Array.isArray(items)
        ? items.find(
            // eslint-disable-next-line no-loop-func
            item => item.code === prevValue
          )
        : null;
      prevValue = item ? item[exceptionMetaInfo.hasManyVia] : null;
      updatedPrevKeys[key] = prevValue;
    }
  }

  return updatedPrevKeys;
};

export const getItems = (
  data,
  values,
  exceptionsSelected,
  exceptionMetaInfo
) => {
  const itemKeys = Object.keys(values);
  let items = [];
  if (
    exceptionMetaInfo.belongsTo &&
    exceptionsSelected[exceptionMetaInfo.belongsTo]
  ) {
    items = Array.isArray(data)
      ? data
          .map(item => {
            if (
              itemKeys.includes(item.value) &&
              item[exceptionMetaInfo.belongsToVia] ===
                exceptionsSelected[exceptionMetaInfo.belongsTo]
            ) {
              return { ...item, primary: true };
            }
            return item;
          })
          .filter(
            item =>
              item[exceptionMetaInfo.belongsToVia] ===
              exceptionsSelected[exceptionMetaInfo.belongsTo]
          )
      : [];
  } else {
    items = Array.isArray(data)
      ? data.map(item => {
          if (itemKeys.includes(item.value)) {
            return { ...item, primary: true };
          }
          return item;
        })
      : [];
  }

  return items;
};
