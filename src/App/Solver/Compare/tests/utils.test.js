import { getHeaders } from '../utils';

const t = jest.fn();

const HEADERS = [
  { id: '1', name: 'Crew Base 777 - Test' },
  { id: '2', name: 'Crew Base 123 - Test' },
  { id: '3', name: 'Crew Base 33 - Test' },
  { id: '4', name: 'Crew Base 888 - Test' },
];

test('getHeaders returns a correct array of headers', () => {
  const Headers = getHeaders(HEADERS, t);

  expect(Headers).toHaveLength(6);
});

const DATA = [
  { id: 1, statistics: 'TEST 1', total: 500 },
  { id: 2, statistics: 'TEST 2', total: 400 },
  { id: 3, statistics: 'TEST 3', total: 100 },
  { id: 4, statistics: 'TEST 4', total: 200 },
];
/*
test('getFilteredArray returs a correct array', () => {
  const newArray = getFilteredArray(DATA, 'id', 3);
  expect(newArray).toHaveLength(3);
});
*/
