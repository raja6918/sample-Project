import { formatDate } from './../helpers';

describe('Test formatDate()', () => {
  it('Must return 0:00', () => {
    const utcDate = '2018-01-01T00:00:00Z';
    const result = formatDate(utcDate);
    expect(result).toEqual('0:00');
  });
  it('Must return 1:59', () => {
    const utcDate = '2018-01-01T01:59:00Z';
    const result = formatDate(utcDate);
    expect(result).toEqual('1:59');
  });
  it('Must return 20:59', () => {
    const utcDate = '2018-01-01T20:59:00Z';
    const result = formatDate(utcDate);
    expect(result).toEqual('20:59');
  });
  it('Must return 9:01', () => {
    const utcDate = '2018-01-01T09:01:00Z';
    const result = formatDate(utcDate);
    expect(result).toEqual('9:01');
  });
});
