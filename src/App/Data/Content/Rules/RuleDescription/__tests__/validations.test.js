import * as validations from '../validations';

const t = msg => msg;

describe('Test Numeric Validation', () => {
  const data = {
    min: 1,
    max: 10,
  };

  test('validateNumbers should validate numbers properly', () => {
    const value = 12;
    expect(() => validations.validateNumbers(t, value, data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Numbers.rangeValidation'
    );
  });

  test('validateRange should validate range properly when both min and max given', () => {
    // value less than min
    expect(() => validations.validateRange(t, 0, data, 'Numbers')).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Numbers.rangeValidation'
    );
    // value greater than  max
    expect(() =>
      validations.validateRange(t, 11, data, 'Numbers')
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Numbers.rangeValidation');
    // value between min and max
    expect(() =>
      validations.validateRange(t, 10, data, 'Numbers')
    ).not.toThrow();
  });

  test('validateRange should validate range properly when min is not given', () => {
    delete data.min;
    // value less than or equal to max
    expect(() =>
      validations.validateRange(t, 0, data, 'Numbers')
    ).not.toThrow();
    // value greater than max
    expect(() =>
      validations.validateRange(t, 11, data, 'Numbers')
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Numbers.maxValidation');
  });

  test('validateRange should validate range properly when max is not given', () => {
    delete data.max;
    data.min = 1;
    // value greater than or equal to min
    expect(() =>
      validations.validateRange(t, 100, data, 'Numbers')
    ).not.toThrow();
    // value less than min
    expect(() =>
      validations.validateRange(t, -10, data, 'Numbers')
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Numbers.minValidation');
  });
});

describe('Test Time Validation', () => {
  const data = {
    min: '04:00',
    max: '08:00',
  };

  test('validateTime should validate time properly', () => {
    const value = '03:59';
    expect(() => validations.validateTime(t, value, data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Time.rangeValidation'
    );
  });

  test('validateTimeRange should validate range properly when both min and max given', () => {
    // value less than min
    expect(() => validations.validateTimeRange(t, '03:59', data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Time.rangeValidation'
    );
    // value greater than max
    expect(() => validations.validateTimeRange(t, '08:01', data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Time.rangeValidation'
    );
    // value between min and max
    expect(() => validations.validateTimeRange(t, '08:00', data)).not.toThrow();
  });

  test('validateTimeRange should validate range properly when min is not given', () => {
    data.min = null;
    // value less than or equal to max
    expect(() => validations.validateTimeRange(t, '07:00', data)).not.toThrow();
    // value greater than max
    expect(() => validations.validateTimeRange(t, '08:01', data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Time.maxValidation'
    );
  });

  test('validateTimeRange should validate range properly when max is not given', () => {
    data.max = null;
    data.min = '04:00';
    // value greater than or equal to min
    expect(() => validations.validateTimeRange(t, '04:00', data)).not.toThrow();
    // value less than min
    expect(() => validations.validateTimeRange(t, '03:59', data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Time.minValidation'
    );
  });
});

describe('Test String Validation', () => {
  const data = {
    min: 2,
    max: 5,
    pattern: '^t+',
  };

  test('validateString should validate string length properly', () => {
    const value = 'tigers';
    expect(() => validations.validateString(t, value, data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.String.rangeValidation'
    );
  });

  test('validateString should validate string pattern properly', () => {
    const value = 'igers';
    expect(() => validations.validateString(t, value, data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.String.regexValidation'
    );
  });

  test('validateRange should validate string length range properly when both min and max given', () => {
    // value less than min
    expect(() => validations.validateRange(t, 0, data, 'String')).toThrowError(
      'ERRORS.RULES_DESCRIPTION.String.rangeValidation'
    );
    // value greater than max
    expect(() => validations.validateRange(t, 11, data, 'String')).toThrowError(
      'ERRORS.RULES_DESCRIPTION.String.rangeValidation'
    );
    // value between min and max
    expect(() => validations.validateRange(t, 2, data, 'String')).not.toThrow();
  });

  test('validateRange should validate string length range properly when min is not given', () => {
    delete data.min;
    // value less than or equal to max
    expect(() => validations.validateRange(t, 0, data, 'String')).not.toThrow();
    // value greater than max
    expect(() => validations.validateRange(t, 11, data, 'String')).toThrowError(
      'ERRORS.RULES_DESCRIPTION.String.maxValidation'
    );
  });

  test('validateRange should validate string length range properly when max is not given', () => {
    delete data.max;
    data.min = 2;
    // value greater than or equal to min
    expect(() =>
      validations.validateRange(t, 100, data, 'String')
    ).not.toThrow();
    // value less than min
    expect(() =>
      validations.validateRange(t, -10, data, 'String')
    ).toThrowError('ERRORS.RULES_DESCRIPTION.String.minValidation');
  });

  test('validateRegExp should validate string pattern properly', () => {
    expect(() => validations.validateRegExp(t, 'igers', data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.String.regexValidation'
    );
    expect(() => validations.validateRegExp(t, 'tigers', data)).not.toThrow();
  });
});

describe('Test Duration Validation', () => {
  const data = {
    min: '4h00',
    max: '1000h00',
  };

  test('validateDuration should validate duration format properly', () => {
    const value = '4h99';
    expect(() => validations.validateDuration(t, value, data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Duration.formatValidation'
    );
  });

  test('validateDuration should validate duration range properly', () => {
    const value = '3h59';
    expect(() => validations.validateDuration(t, value, data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Duration.rangeValidation'
    );
  });

  test('validateDurationRange should validate range properly when both min and max given', () => {
    // value less than min
    expect(() =>
      validations.validateDurationRange(t, '3h59', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.rangeValidation');
    // value greater than max
    expect(() =>
      validations.validateDurationRange(t, '1001h01', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.rangeValidation');
    // value between min and max
    expect(() =>
      validations.validateDurationRange(t, '8h00', data)
    ).not.toThrow();
  });

  test('validateDurationRange should validate range properly when min is not given', () => {
    data.min = null;
    // value less than or equal to max
    expect(() =>
      validations.validateDurationRange(t, '1000h00', data)
    ).not.toThrow();
    // value greater than max
    expect(() =>
      validations.validateDurationRange(t, '1001h00', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.maxValidation');
  });

  test('validateDurationRange should validate range properly when max is not given', () => {
    data.max = null;
    data.min = '4h00';
    // value greater than or equal to min
    expect(() => validations.validateTimeRange(t, '4h00', data)).not.toThrow();
    // value less than min
    expect(() => validations.validateTimeRange(t, '3h59', data)).toThrowError(
      'ERRORS.RULES_DESCRIPTION.Time.minValidation'
    );
  });

  test('validateDurationFormat should validate duration format properly', () => {
    expect(() =>
      validations.validateDurationFormat(t, '4h99', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.formatValidation');
    expect(() =>
      validations.validateDurationFormat(t, '4h5', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.formatValidation');
    expect(() =>
      validations.validateDurationFormat(t, '499', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.formatValidation');
    expect(() =>
      validations.validateDurationFormat(t, 'h16', data)
    ).toThrowError('ERRORS.RULES_DESCRIPTION.Duration.formatValidation');
    expect(() =>
      validations.validateDurationFormat(t, '4h00', data)
    ).not.toThrow();
  });
});
