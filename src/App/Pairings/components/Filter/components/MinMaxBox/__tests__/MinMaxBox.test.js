import React from 'react';
import { shallow } from 'enzyme';
import MinMaxBox from '../MinMaxBox';
import { validateDurationRange } from '../../../helpers';

describe('Test MinMaxBox Component', () => {
  const minProps = {
    style: { width: '70px' },
    error: false,
    type: 'text',
    minLabel: 'Min',
    maxLabel: 'Max',
    maxInputLength: 11,
    placeholder: '0h00',
    innerPattern: /./,
    converter: value => value,
    pattern: /^(\d?\d?\d?\d?\d?\d?\d?)\dh[0-5][0-9]$/,
    rangeValidator: validateDurationRange,
    value: {
      min: 0,
      max: 59,
    },
    invalidFormatMessage: 'Invalid Format',
    rangeErrorMessage: 'Range validation error',
    maxDisplayLength: 7,
    onChange: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<MinMaxBox {...minProps} />);
  });

  test('MinMaxBox Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('getValue works correctly for correct input', () => {
    const value = 'Correct Value';
    const result = wrapper.instance().getValue(value);
    expect(result).toBe(value);
  });

  test('getValue works correctly for inccorrect input', () => {
    const value = undefined;
    const result = wrapper.instance().getValue(value);
    expect(result).toBe('');
  });

  test('validate works correctly when min and max values are null', () => {
    wrapper.instance().setState({ min: null, max: null });
    wrapper.instance().validate();
    expect(wrapper.state('error')).toBeFalsy();
    expect(wrapper.state('errorMsg')).toBe('');
  });

  test('validate works correctly when min and max values are null', () => {
    wrapper.instance().setState({ min: null, max: null });
    wrapper.instance().validate();
    expect(wrapper.state('error')).toBeFalsy();
    expect(wrapper.state('errorMsg')).toBe('');
  });

  test('format validation works correctly when min value has incorrect format', () => {
    wrapper.instance().setState({ min: '23h66', max: null });
    wrapper.instance().validate();
    expect(wrapper.state('error')).toBeTruthy();
    expect(wrapper.state('errorMsg')).toBe('Invalid Format');
  });

  test('range validation works correctly when min value is greater than max value', () => {
    wrapper.instance().setState({ min: '23h59', max: '21h59' });
    wrapper.instance().validate();
    expect(wrapper.state('error')).toBeTruthy();
    expect(wrapper.state('errorMsg')).toBe('Range validation error');
  });

  test('handleChange works correctly', () => {
    const type = 'min';
    const value = '23h44';
    wrapper.instance().handleChange(type, value);
    expect(wrapper.state(type)).toBe(value);
  });
});
