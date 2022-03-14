import moment from 'moment';

const ERRORS = 'ERRORS.RULES_DESCRIPTION';

/**
 * Utility function to implement range validation in numbers and string.
 *
 * @param {Function} t - For localization
 * @param {number} value - input value
 * @param {Object} data - userDescription object
 * @param {string} key - For localization
 */
export const validateRange = (t, value, data, key) => {
  if (!isNaN(data.min) && !isNaN(data.max)) {
    // Range Validation
    if (value < data.min || value > data.max) {
      throw new RangeError(
        t(`${ERRORS}.${key}.rangeValidation`, [data.min, data.max])
      );
    }
  } else if (!isNaN(data.min)) {
    // Min Validation
    if (value < data.min) {
      throw new RangeError(t(`${ERRORS}.${key}.minValidation`, [data.min]));
    }
  } else if (!isNaN(data.max)) {
    // Max Validation
    if (value > data.max) {
      throw new RangeError(t(`${ERRORS}.${key}.maxValidation`, [data.max]));
    }
  }
};

/**
 * Utility function to implement range validation in time.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 * @param {Object} data - userDescription object
 */
export const validateTimeRange = (t, value, data) => {
  const currentTime = moment(value, 'HH:mm');
  const minTime = moment(data.min, 'HH:mm');
  const maxTime = moment(data.max, 'HH:mm');

  if (data.min && data.max) {
    // Range Validation
    if (currentTime.isBefore(minTime) || currentTime.isAfter(maxTime)) {
      throw new RangeError(
        t(`${ERRORS}.Time.rangeValidation`, [data.min, data.max])
      );
    }
  } else if (data.min) {
    // Min Validation
    if (currentTime.isBefore(minTime)) {
      throw new RangeError(t(`${ERRORS}.Time.minValidation`, [data.min]));
    }
  } else if (currentTime.isAfter(maxTime)) {
    // Max Validation
    if (value > data.max) {
      throw new RangeError(t(`${ERRORS}.Time.maxValidation`, [data.max]));
    }
  }
};

/**
 * Utility function to implement regular expression validation.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 * @param {Object} data - userDescription object
 */
export const validateRegExp = (t, value, data) => {
  if (data.pattern) {
    const regex = RegExp(data.pattern);
    if (!regex.test(value)) {
      throw new Error(t(`${ERRORS}.String.regexValidation`));
    }
  }
};

/**
 * Utility function to implement format validation in duration.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 */
export const validateDurationFormat = (t, value) => {
  const regex = /^-?(\d?\d?\d?\d?\d?\d?\d?)\dh[0-5][0-9]$/;
  if (!regex.test(value)) {
    throw new Error(t(`${ERRORS}.Duration.formatValidation`));
  }
};

/**
 * Utility function to implement range validation in duration.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 * @param {Object} data - userDescription object
 */
export const validateDurationRange = (t, value, data) => {
  const valueArray = value ? value.split('h') : [];
  const [valueHour, valueMinute] = valueArray;

  const minArray = data.min ? data.min.split('h') : [];
  const [minHour, minMinute] = minArray;

  const maxArray = data.max ? data.max.split('h') : [];
  const [maxHour, maxMinute] = maxArray;

  const isValueHourLessThanMinHour = valueHour < minHour; // You should not convert minHour or valueHour to integer since -0 < 0 returns false.
  const isValueHourGreaterThanMaxHour = valueHour > parseInt(maxHour, 10); // converted maxHour to integer since "1000" > "12" returns false.

  const isValueHourLessThanEqualToMinHour = valueHour <= minHour;
  const isValueHourGreaterThanEqualToMaxHour =
    valueHour >= parseInt(maxHour, 10); // converted maxHour to integer since "1000" > "12" returns false

  const isValueMinuteLessThanMinMinute = valueMinute < minMinute;
  const isValueMinuteGreaterThanMaxMinute = valueMinute > maxMinute;

  if (data.min && data.max) {
    // Range Validation
    if (isValueHourLessThanMinHour || isValueHourGreaterThanMaxHour) {
      throw new RangeError(
        t(`${ERRORS}.Duration.rangeValidation`, [data.min, data.max])
      );
    }

    if (
      (isValueHourLessThanEqualToMinHour && isValueMinuteLessThanMinMinute) ||
      (isValueHourGreaterThanEqualToMaxHour &&
        isValueMinuteGreaterThanMaxMinute)
    ) {
      throw new RangeError(
        t(`${ERRORS}.Duration.rangeValidation`, [data.min, data.max])
      );
    }
  } else if (data.min) {
    // Min Validation
    if (isValueHourLessThanMinHour) {
      throw new RangeError(t(`${ERRORS}.Duration.minValidation`, [data.min]));
    }
    if (isValueHourLessThanEqualToMinHour && isValueMinuteLessThanMinMinute) {
      throw new RangeError(t(`${ERRORS}.Duration.minValidation`, [data.min]));
    }
  } else if (data.max) {
    // Max Validation
    if (isValueHourGreaterThanMaxHour) {
      throw new RangeError(t(`${ERRORS}.Duration.maxValidation`, [data.max]));
    }
    if (
      isValueHourGreaterThanEqualToMaxHour &&
      isValueMinuteGreaterThanMaxMinute
    ) {
      throw new RangeError(t(`${ERRORS}.Duration.maxValidation`, [data.max]));
    }
  }
};

/**
 * Utility function to implement client side validation for number in Rule description module.
 *
 * @param {Function} t - For localization
 * @param {number} value - input value
 * @param {Object} data - userDescription object
 */
export const validateNumbers = (t, value, data) => {
  validateRange(t, value, data, 'Numbers');
};

/**
 * Utility function to implement client side validation for time in Rule description module.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 * @param {Object} data - userDescription object
 */
export const validateTime = (t, value, data) => {
  validateTimeRange(t, value, data);
};

/**
 * Utility function to implement client side validation for string in Rule description module.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 * @param {Object} data - userDescription object
 */
export const validateString = (t, value, data) => {
  validateRange(t, value.length, data, 'String');
  validateRegExp(t, value, data);
};

/**
 * Utility function to implement client side validation for duration in Rule description module.
 *
 * @param {Function} t - For localization
 * @param {string} value - input value
 * @param {Object} data - userDescription object
 */
export const validateDuration = (t, value, data) => {
  validateDurationFormat(t, value);
  validateDurationRange(t, value, data);
};
