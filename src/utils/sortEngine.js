import moment from 'moment';

/**
 * Sort Engine
 * @param sortPayload - The data that needs to be sorted.
 * @param sortProperties - The metadata required, which includes,
 * type: The data type on which the sort is applied.
 * direction: Order (default: increasing, pass 'dec' for decreasing order).
 * field: The field on which the sort is applied.
 */
class Sort {
  constructor(sortPayload, sortProperties) {
    this.sortPayload = sortPayload;
    this.type = sortProperties.type;
    this.direction = sortProperties.direction;
    this.field = sortProperties.field;
  }

  static DEC_DIRECTION = 'dec';

  /**
   * sortNumber
   * Sort all types of numbers.
   */
  sortNumber() {
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      if (!value1 && value1 !== 0) {
        return 1;
      } else if (!value2 && value2 !== 0) {
        return -1;
      } else if (typeof value1 === 'number' && typeof value2 === 'number') {
        return this.direction === Sort.DEC_DIRECTION
          ? value2 - value1
          : value1 - value2;
      }
      return 0;
    });
  }

  /**
   * sortBoolean
   * Sorts and groups the boolean values.
   */
  sortBoolean() {
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      return value1 === value2
        ? 0
        : this.direction === Sort.DEC_DIRECTION
        ? value1
          ? 1
          : -1
        : value1
        ? -1
        : 1;
    });
  }

  /**
   * sortDate
   * Sort an array of dates strings.
   * Accepted formats: '2021-02-10' or '2021/02/10'.
   * undefined/null/0/'' will be grouped at the end of the array.
   */
  sortDate() {
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      if (!value1) {
        return 1;
      } else if (!value2) {
        return -1;
      } else {
        const formatValue1 = new Date(value1);
        const formatValue2 = new Date(value2);
        return this.direction === Sort.DEC_DIRECTION
          ? formatValue2 - formatValue1
          : formatValue1 - formatValue2;
      }
    });
  }

  /**
   * sortTime.
   * Sort an array of time strings.
   * Accepted formats: '10:10'.
   * undefined/null/0/'' will be grouped at the end of the array.
   */
  sortTime() {
    const timeFormat = 'HH:mm';
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      if (!value1) {
        return 1;
      } else if (!value2) {
        return -1;
      } else {
        const formatValue1 = moment(value1, timeFormat);
        const formatValue2 = moment(value2, timeFormat);
        return formatValue1 === formatValue2
          ? 0
          : this.direction === Sort.DEC_DIRECTION
          ? formatValue2 - formatValue1
          : formatValue1 - formatValue2;
      }
    });
  }

  /**
   * sortDuration
   * Sort an array for duration strings.
   * Accepted format: '10h55'.
   * undefined/null/0/'' will be grouped at the end of the array.
   */
  sortDuration() {
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      if (!value1) {
        return 1;
      } else if (!value2) {
        return -1;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        let splitValue1 = value1.split('h')[0];
        let splitValue2 = value2.split('h')[0];
        if (splitValue1 === splitValue2) {
          splitValue1 = value1.split('h')[1];
          splitValue2 = value2.split('h')[1];
        }
        return this.direction === Sort.DEC_DIRECTION
          ? splitValue2 - splitValue1
          : splitValue1 - splitValue2;
      }
      return 0;
    });
  }

  /**
   * sortString
   * Sort an array for text strings.
   * undefined/null/0/'' will be grouped at the end of the array.
   */
  sortString() {
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      if (!value1) {
        return 1;
      } else if (!value2) {
        return -1;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        return this.direction === Sort.DEC_DIRECTION
          ? value2.localeCompare(value1)
          : value1.localeCompare(value2);
      }
      return 0;
    });
  }

  /**
   * sortDateTime
   * Sort an array of datetime strings.
   * Accepted formats: '2019-07-05T07:30'.
   * undefined/null/0/'' will be grouped at the end of the array.
   */
  sortDateTime() {
    return this.sortPayload.sort((a, b) => {
      const value1 = a[this.field];
      const value2 = b[this.field];
      if (!value1) {
        return 1;
      } else if (!value2) {
        return -1;
      } else {
        const formatValue1 = new Date(value1);
        const formatValue2 = new Date(value2);
        return this.direction === Sort.DEC_DIRECTION
          ? formatValue2 - formatValue1
          : formatValue1 - formatValue2;
      }
    });
  }

  sort() {
    switch (this.type) {
      case 'string':
        return this.sortString();
      case 'number':
        return this.sortNumber();
      case 'duration':
        return this.sortDuration();
      case 'date':
        return this.sortDate();
      case 'time':
        return this.sortTime();
      case 'boolean':
        return this.sortBoolean();
      case 'dateTime':
        return this.sortDateTime();
      default:
        return this.sortString();
    }
  }
}

export default Sort;
