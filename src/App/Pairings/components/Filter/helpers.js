import moment from 'moment';
import { criteriaConfig, DATE_FORMAT, TIME_FORMAT } from './constants';
import storage from './../../../../utils/storage';

/**
 * To get dataResolver for multiSelectSearchType and multiSelectType component
 *
 * @param {Object} data
 */
export const getDataResolver = data => {
  if (
    data.type === 'multiSelectSearchType' ||
    data.type === 'multiSelectType' ||
    data.type === 'multiSelectComboBox'
  ) {
    const config = criteriaConfig[data.crName];
    const dataResolver = config ? config.data : null;
    return dataResolver;
  }
};

/**
 * To check whether server side search is enabled for multiSelectType component.
 *
 * @param {Object} data
 */
export const isServerSideSearch = data => {
  if (data.type === 'multiSelectSearchType') {
    const config = criteriaConfig[data.crName];
    const status = config ? config.enableServerSearch : null;
    return status ? status : false;
  }
};

/**
 * To get scope
 *
 * @param {Object} data
 */
export const getScope = data => {
  if (
    data.type === 'multiSelectSearchType' ||
    data.type === 'multiSelectType'
  ) {
    const config = criteriaConfig[data.crName];
    const scope = config ? config.scope : null;
    return scope || 'pairings';
  }
};

/**
 * Utility function to select all checkboxes in the initial render of multiselectsearchtype & multiSelectType component.
 *
 * @param {Object} data
 * @returns {boolean}
 */
export const isSelectAll = data => {
  if (
    data.type === 'multiSelectSearchType' ||
    data.type === 'multiSelectType'
  ) {
    const config = criteriaConfig[data.crName];
    const selectAll = config ? config.selectAll : false;
    return selectAll;
  }
};

/**
 * Utility function to set default values in the inital render of multiselectCombobox component
 * @param {Object} data
 */

export const getDefaultValues = data => {
  if (data.type === 'multiSelectComboBox') {
    const config = criteriaConfig[data.crName];
    const defaultValues = config ? config.defaultValues : null;
    return defaultValues;
  }
};

export const checkIsSubCategory = data => {
  if (data.type === 'multiSelectComboBox') {
    const config = criteriaConfig[data.crName];
    const isSubCategory = config ? config.isSubCategory : false;
    return isSubCategory;
  }
};
/**
 * To get pagination size
 *
 * @param {Object} data
 */
export const getPaginationSize = data => {
  if (data.type === 'multiSelectSearchType') {
    const config = criteriaConfig[data.crName];
    const paginationSize = config ? config.paginationSize : null;
    return paginationSize || 300;
  }
};

/**
 * To get tooltip key
 *
 * @param {Object} data
 */
export const getTooltipKey = data => {
  if (
    data.type === 'multiSelectSearchType' ||
    data.type === 'multiSelectType'
  ) {
    const config = criteriaConfig[data.crName];

    // Need to remove when all criteria is mapped
    if (!config) {
      console.error('Unable to resolve criteria mapping', data);
      return 'display';
    }

    const tooltipKey = config.tooltipKey;
    return tooltipKey || 'display';
  }
};

const getReadOnlyFromLocation = location =>
  location.state ? location.state.readOnly : false;

export const getScenarioDates = () => {
  const openedScenario = storage.getItem('openScenario');
  if (!openedScenario) return { startTime: null, endTime: null };
  const { startDate, endDate } = openedScenario;
  return { startTime: startDate, endTime: endDate };
};

export const getCurrentScenario = location => {
  const openedScenario = storage.getItem('openScenario');
  const id =
    location && location.state ? location.state.openItemId : openedScenario.id;
  return { ...openedScenario, id } || {};
};

export const validateDurationRange = (min, max) => {
  if (min && max) {
    const [minHour, minMinute] = min.split('h');
    const [maxHour, maxMinute] = max.split('h');
    const minHourParsed = parseInt(minHour, 10);
    const minMinuteParsed = parseInt(minMinute, 10);
    const maxHourParsed = parseInt(maxHour, 10);
    const maxMinuteParsed = parseInt(maxMinute, 10);
    if (
      !(
        minHourParsed < maxHourParsed ||
        (minHourParsed === maxHourParsed && minMinuteParsed <= maxMinuteParsed)
      )
    )
      return false;
  }
  return true;
};

const getValue = value => {
  return value !== undefined && value !== null ? value : '';
};

export const validateRange = (min, max) => {
  if (getValue(min).toString() && getValue(max).toString()) {
    return min <= max;
  }
  return true;
};

export const getDataValue = data => {
  return data.value !== undefined && data.value !== null ? data.value : '';
};

export const getDates = (data, location) => {
  const { startTime, endTime } = getScenarioDates(location);
  if (data.value)
    return {
      startTime: data.value.startTime,
      endTime: data.value.endTime,
      noChange: false,
    };
  return {
    startTime: moment(startTime)
      .startOf('day')
      .format(DATE_FORMAT),
    endTime: moment(endTime)
      .endOf('day')
      .format(DATE_FORMAT),
    noChange: true,
  };
};

export const getTimes = data => {
  if (data.value)
    return {
      startTime: moment(data.value.startTime, TIME_FORMAT),
      endTime: moment(data.value.endTime, TIME_FORMAT),
      noChange: false,
    };
  return {
    startTime: moment('00.00', TIME_FORMAT),
    endTime: moment('23.59', TIME_FORMAT),
    noChange: true,
  };
};
