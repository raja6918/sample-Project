import * as utils from '../utils';
require('datejs');

describe('Testing utility methods', () => {
  const currDate = new Date('2019-05-14T11:01:58.000Z');
  const timeFormat = 'HH:mm';
  const dateFormat = 'dd-MMM-yyyy';
  const dateTimeFormat = 'dd-MMM-yyyy HH:mm';
  const newTimeFormat = 'HH:mm:ss';
  const newDateFormat = 'dd-MM-yyyy';
  const newDateTimeTormat = 'dd-MMM-yyyy HH:mm:ss';

  utils.$rootScope.opsGanttDefaults = {
    defaultGantt: 'ops',
  };
  utils.$rootScope.ctsGanttDefaults = {
    defaultGantt: 'cts',
  };
  utils.$rootScope.applicationvo = {
    userinfo: 'Hello',
  };
  utils.$rootScope.moduleConfig = {
    CTS: [],
    OPS: [2],
  };

  test('Check whether isFunction determines if a reference is a `Function` correctly', () => {
    const fn = () => {};
    expect(utils.isFunction(fn)).toBe(true);

    expect(utils.isFunction('string')).toBe(false);
    expect(utils.isFunction(1)).toBe(false);
    expect(utils.isFunction([])).toBe(false);
    expect(utils.isFunction({})).toBe(false);
    expect(utils.isFunction(true)).toBe(false);
  });

  test('Check whether isString determines if a reference is a String correctly', () => {
    expect(utils.isString('string')).toBe(true);
    expect(utils.isString('')).toBe(true);

    expect(utils.isString(1)).toBe(false);
    expect(utils.isString([])).toBe(false);
    expect(utils.isString({})).toBe(false);
    expect(utils.isString(true)).toBe(false);
  });

  test('Check whether isDate determines if a reference is a Date correctly', () => {
    const date = new Date();
    expect(utils.isDate(date)).toBe(true);

    expect(utils.isDate('string')).toBe(false);
    expect(utils.isDate(1)).toBe(false);
    expect(utils.isDate([])).toBe(false);
    expect(utils.isDate({})).toBe(false);
    expect(utils.isDate(true)).toBe(false);
  });

  test('Check whether getGanttTime return correct time for given date', () => {
    expect(utils.getGanttTime(new Date('2019-05-14T11:01:58.135Z'))).toBe(
      1557851518135
    );

    expect(utils.getGanttTime('string')).toBe(0);
    expect(utils.getGanttTime(new Date('2019-055-14T11:01:58.135Z'))).toBe(NaN);
  });

  test('Check whether setDate determines if the given date set to current date', () => {
    expect(utils.setDate(currDate)).toEqual(currDate);
  });

  test('Check whether getDate returns the current date correctly', () => {
    expect(utils.getDate()).toEqual(currDate);
  });

  test('Check whether getUTCDateForTimeInMilliseconds converts time in milliseconds to date object', () => {
    expect(utils.getUTCDateForTimeInMilliseconds(1557851518000, true)).toEqual(
      currDate
    );
    expect(utils.getUTCDateForTimeInMilliseconds(1557851518000, false)).toEqual(
      new Date('2019-05-14T11:01:00.000Z')
    );
    expect(utils.getUTCDateForTimeInMilliseconds()).toBe(undefined);
  });

  test('Check whether setDefaultTimeFormat returns the time format correctly', () => {
    expect(utils.setDefaultTimeFormat(timeFormat)).toBe(timeFormat);
    expect(utils.setDefaultTimeFormat(newTimeFormat)).toBe(newTimeFormat);
  });

  test('Check whether getDefaultTimeFormat returns the time format correctly', () => {
    expect(utils.getDefaultTimeFormat()).toEqual(newTimeFormat);
  });

  test('Check whether setDefaultDateFormat returns the date format correctly', () => {
    expect(utils.setDefaultDateFormat(dateFormat)).toEqual(dateFormat);
    expect(utils.setDefaultDateFormat(newDateFormat)).toEqual(newDateFormat);
  });

  test('Check whether getdefaultGanttForCurrentRole returns the gantt defaults correctly', () => {
    expect(utils.getdefaultGanttForCurrentRole('test')).toEqual({
      defaultGantt: 0,
    });
    expect(utils.getdefaultGanttForCurrentRole('OPS')).toEqual({
      defaultGantt: 'ops',
    });
    expect(utils.getdefaultGanttForCurrentRole('CTS')).toEqual({
      defaultGantt: 'cts',
    });
  });

  test('Check whether getUserInfo gives us correct userInfo', () => {
    expect(utils.getUserInfo()).toBe('Hello');
  });

  test('Check whether getDefaultDateFormat return default date format', () => {
    expect(utils.getDefaultDateFormat()).toBe(newDateFormat);
  });

  test('Check whether setDefaultDateTimeFormat override default date time format', () => {
    expect(utils.getDefaultDateTimeFormat()).toBe(dateTimeFormat);
    expect(utils.setDefaultDateTimeFormat(newDateTimeTormat)).toBe(
      newDateTimeTormat
    );
  });

  test('Check whether getDefaultDateTimeFormat return new date time format', () => {
    expect(utils.getDefaultDateTimeFormat()).toBe(newDateTimeTormat);
  });

  test('Check whether formatDateTime return formatted date time', () => {
    const date = new Date('02-08-2021 15:47');
    expect(utils.formatDateTime(date, dateFormat)).toBe('08-Feb-2021');
  });

  test('Check whether formatDateTime return null when dateObj is not injected', () => {
    expect(utils.formatDateTime()).toBe(null);
  });

  test('Check whether formatMinutesToTime format minute to time - HH:MM', () => {
    // Testing positive numberic values
    expect(utils.formatMinutesToTime(65)).toBe('01:05');
    expect(utils.formatMinutesToTime(55)).toBe('00:55');
    expect(utils.formatMinutesToTime(0)).toBe('00:00');
    expect(utils.formatMinutesToTime(12000)).toBe('200:00');

    // Testing negative values
    expect(utils.formatMinutesToTime(-10)).toBe('-00:10');

    // Testing edge cases
    expect(utils.formatMinutesToTime()).toBe('');
    expect(utils.formatMinutesToTime('55:45')).toBe('00:55');
    expect(utils.formatMinutesToTime('01:55')).toBe('00:01');
  });

  test('Check whether formatDateTimeString format date time string in a predefined format to a given new format', () => {
    expect(
      utils.formatDateTimeString(
        '02-08-2021 15:47',
        'dd-MM-yyyy HH:mm',
        'yyyy-MM-ddTHH:mm:ssZ'
      )
    ).toBe('2021-02-08T15:47:00Z');
    // Check date with milliseconds
    expect(
      utils.formatDateTimeString(
        '2021-08-02T00:15:47.123',
        'yyyy-MM-ddTHH:mm:ss',
        'dd-MM-yyyy HH:mm'
      )
    ).toBe('02-08-2021 00:15');
    // Check invalid date and formats
    expect(utils.formatDateTimeString('abc', 'abc', 'dd-MM-yyyy HH:mm')).toBe(
      undefined
    );
  });

  test('Check whether parseDateTime parse a date time string in a given format', () => {
    // If no dateTimeString provided
    expect(utils.parseDateTime('', 'dd-MM-yyyy HH:mm')).toBe(undefined);
  });

  test('Check whether deleteArrayElemByIdx delete array elements by providing indexes to remove', () => {
    const arr = ['A', 'B', 'C', 'D'];
    const idx = [2]; // C
    expect(utils.deleteArrayElemByIdx(arr, idx)).toEqual(['A', 'B', 'D']);

    // Check empty index array case
    expect(utils.deleteArrayElemByIdx(arr, [])).toEqual(['A', 'B', 'D']);
    // Check empty src array case
    expect(utils.deleteArrayElemByIdx([], idx)).toEqual([]);
    // check empty src array and index array case
    expect(utils.deleteArrayElemByIdx([], [])).toEqual([]);
  });

  test('Check whether getModule return correct moduleName', () => {
    const defaultModule = 'CTS';
    // Check whether defaultModule is returned if pageId doesn't exit in rootScope and defaultModule is provided, then page added to default module.
    expect(utils.getModule(1, defaultModule)).toBe(defaultModule);

    // Check whether we get correct moduleName when correct pageid is provided.
    expect(utils.getModule(1)).toBe(defaultModule);
    expect(utils.getModule(2)).toBe('OPS');

    // Check whether we get null if pageId doen't exit in rootScope and defaultModule is not provided
    expect(utils.getModule(3)).toBe(null);
  });
});
