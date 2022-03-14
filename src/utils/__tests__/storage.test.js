import storage from '../storage';

const fixture = {
  something: { test: true },
  other: 42,
  foo: 'bar'
};

const length = obj => Object.keys(obj).length;

beforeEach(() => {
  Object.entries(fixture).forEach(([key, value]) => {
    storage.setItem(key, value);
  });
});

afterEach(() => {
  storage.clear();
});

test('storage can set/get Items', () => {
  expect(storage.length()).toBe(length(fixture));

  let i = 0;
  Object.entries(fixture).forEach(([key, value]) => {
    expect(storage.key(i)).toBe(key);
    expect(JSON.stringify(storage.getItem(key))).toBe(JSON.stringify(value));
    i++;
  });
});

test('storage can remove/clear items', () => {
  storage.removeItem(storage.key(1));
  expect(storage.length()).toBe(length(fixture) - 1);

  storage.clear();
  expect(storage.length()).toBe(0);
});
