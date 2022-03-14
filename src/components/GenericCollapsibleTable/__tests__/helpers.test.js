import { prepareSortPayload } from './../helpers';

const direction = 'inc';

describe('Test helpers of Generic Table', () => {
  test('Return proper payload when sortCriteria is not declared', () => {
    const obj = {
      field: 'fieldName',
    };

    const sortPayload = prepareSortPayload(obj, direction);

    expect(sortPayload).toEqual([{ fieldName: obj.field, direction }]);
  });

  test('Return proper payload when sortCriteria is declared', () => {
    const obj = {
      field: 'fieldName',
      sortCriteria: 'fieldName2',
    };

    const sortPayload = prepareSortPayload(obj, direction);

    expect(sortPayload).toEqual([{ fieldName: obj.sortCriteria, direction }]);
  });

  test('Return proper payload when sortCriteria is an array with single field', () => {
    const obj = {
      field: 'fieldName',
      sortCriteria: ['fieldName2'],
    };

    const sortPayload = prepareSortPayload(obj, direction);

    expect(sortPayload).toEqual([
      { fieldName: obj.sortCriteria[0], direction },
    ]);
  });
  test('Return proper payload when sortCriteria is an array with multiple fields', () => {
    const obj = {
      field: 'fieldName',
      sortCriteria: ['fieldName2', 'fieldName3'],
    };

    const sortPayload = prepareSortPayload(obj, direction);

    expect(sortPayload).toEqual([
      { fieldName: obj.sortCriteria[0], direction },
      { fieldName: obj.sortCriteria[1], direction },
    ]);
  });
});
