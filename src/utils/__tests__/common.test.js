import * as common from '../common';

const t = msg => msg;

describe('Test Common Utility Functions', () => {
  test("Check whether checkElementVisibility check element's visibility when element is placed inside container", () => {
    const container = {
      scrollTop: 100,
      clientHeight: 50,
    };
    const element = {
      offsetTop: 130,
      clientHeight: 10,
    };

    const result = common.checkElementVisibility(container, element);
    expect(result).toEqual({ isVisible: true, bottomHeightDiff: -10 });
  });

  test("Check whether checkElementVisibility check element's visibility when element is placed outside the container", () => {
    const container = {
      scrollTop: 100,
      clientHeight: 50,
    };
    const element = {
      offsetTop: 151,
      clientHeight: 10,
    };

    const result = common.checkElementVisibility(container, element);
    expect(result).toEqual({ isVisible: false, bottomHeightDiff: 11 });
  });

  test("Check whether checkElementVisibility check element's visibility when element is partily outside the container", () => {
    const container = {
      scrollTop: 100,
      clientHeight: 50,
    };
    const element = {
      offsetTop: 145,
      clientHeight: 10,
    };

    const result = common.checkElementVisibility(container, element);
    expect(result).toEqual({ isVisible: false, bottomHeightDiff: 5 });
  });

  test('Check whether checkElementVisibility return undefined if invalid paramaters injected', () => {
    const result = common.checkElementVisibility(null, null);
    expect(result).toBeUndefined();
  });

  test('Check whether checkElementVisibility return undefined if no paramaters injected', () => {
    const result = common.checkElementVisibility();
    expect(result).toBeUndefined();
  });

  test('Check whether shortenText trim a valid long text', () => {
    const result = common.shortenText('Hello world!', 5);
    expect(result).toBe('He...');
  });

  test('Check whether shortenText does not trim a valid short text', () => {
    const result = common.shortenText('Hi', 5);
    expect(result).toBe('Hi');
  });

  test('Check whether shortenText return empty string when empty string provided', () => {
    const result = common.shortenText('', 5);
    expect(result).toBe('');
  });

  test('Check whether shortenText return null when null is provided', () => {
    const result = common.shortenText(null, 5);
    expect(result).toBe(null);
  });

  test('Check whether shortenText return undefined when no parameters injected', () => {
    const result = common.shortenText();
    expect(result).toBe(undefined);
  });

  test('Check whether getFirstLetters convert fist and last name to uppercase 2 digit word when first and last name provided', () => {
    const result = common.getFirstLetters('john', 'doe');
    expect(result).toBe('JD');
  });

  test('Check whether getFirstLetters convert fist name to uppercase 1 digit word when only first name provided', () => {
    const result = common.getFirstLetters('john');
    expect(result).toBe('J');
  });

  test('Check whether getFirstLetters convert last name to uppercase 1 digit word when only last name provided', () => {
    const result = common.getFirstLetters('', 'doe');
    expect(result).toBe('D');
  });

  test('Check whether getFormOkButton return addBtn when condition is empty/null', () => {
    expect(common.getFormOkButton(t, '')).toBe('GLOBAL.form.add');
    expect(common.getFormOkButton(t, null)).toBe('GLOBAL.form.add');
  });

  test('Check whether getFormOkButton return saveBtn when condition is not empty and readOnly false', () => {
    expect(common.getFormOkButton(t, {})).toBe('GLOBAL.form.save');
  });

  test('Check whether getFormOkButton return closeBtn when condition is not empty and readOnly true', () => {
    expect(common.getFormOkButton(t, {}, true)).toBe('GLOBAL.form.save');
  });

  test('Check whether getFormHeading return add form title when condition is empty/null', () => {
    expect(common.getFormHeading(t, '', false, 'Accomodation')).toBe(
      'Accomodation.add'
    );
    expect(common.getFormHeading(t, null, false, 'Accomodation')).toBe(
      'Accomodation.add'
    );
  });

  test('Check whether getFormHeading return edit form title when condition is not empty and readOnly false', () => {
    expect(common.getFormHeading(t, {}, false, 'Accomodation')).toBe(
      'Accomodation.edit'
    );
  });

  test('Check whether getFormHeading return view form title when condition is not empty and readOnly true', () => {
    expect(common.getFormHeading(t, {}, true, 'Accomodation')).toBe(
      'Accomodation.view'
    );
  });
});
