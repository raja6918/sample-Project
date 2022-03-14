import * as dates from '../dates';
import moment from 'moment';

test('isToday and isThisMonth returns true or false value', () => {
  const today = Date.now();
  //today = moment.utc(today);

  let flag = dates.isToday(today);
  expect(flag).toBe(true);
  flag = dates.isToday('2018-02-12T22:25:09.586Z');
  expect(flag).toBe(false);

  flag = dates.isThisMonth(today);
  expect(flag).toBe(true);
  flag = dates.isThisMonth('2018-02-12T22:25:09.586Z');
  expect(flag).toBe(false);
});

test('dateRange format is correct', () => {
  const format = dates.dateRange(
    '2018-04-10T22:25:09.586Z',
    '2018-04-10T22:25:09.586Z'
  );
  expect(format).toBe('APR 10 - 10, 2018');
});

test('lastModified format is correct', () => {
  const format = dates.lastModified('2018-03-10T22:25:09.586Z');
  dates.lastModified(new Date());
  dates.lastModified('');
  expect(format).toBe('MAR 10, 2018');
});

test('addDays format is correct', () => {
  const format = dates.addDays('2018-03-10T22:25:09.586Z', 3);

  expect(format).toBe('MAR 10 - 12, 2018');
});

test('sumDays format is correct', () => {
  const format = dates.sumDays('2018-05-31T13:49:56.000Z', 5);
  expect(format).toBe('2018-06-04T13:49:56.000Z');
});

test('dateToUtc format is correct', () => {
  const format = dates.dateToUtc('2018-05-31T13:54:39.434Z');

  expect(format).toBe('2018-05-31T13:54:39Z');
});

test('prettyFormat works correct', () => {
  const format = dates.prettyFormat('2018-04-10T22:25:09.586Z');
  expect(format).toBe('APR 10, 2018');
});
