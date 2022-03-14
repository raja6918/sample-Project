import React from 'react';
import { shallow } from 'enzyme';
import CompoundTimePicker from '../CompoundTimePicker';

jest.mock('moment', () => {
  return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

describe('Test CompoundTimePicker Component', () => {
  const minProps = {
    t: jest.fn(),
    onChange: jest.fn(),
    returnTimeFormat: 'HH:mm',
    displayTimeFormat: 'HH:mm',
    value: {
      startTime: '00:00',
      endTime: '23:59',
    },
    containerStyle: { width: '160px' },
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<CompoundTimePicker {...minProps} />);
  });

  test('CompoundTimePicker Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  // test('isTimeRangeValid returns true by when time are not set', () => {
  //   wrapper.instance().setState({
  //     startTime: null,
  //     endTime: null,
  //   });
  //   const result = wrapper.instance().isTimeRangeValid();
  //   expect(result).toBeTruthy();
  // });

  // test('isTimeRangeValid returns false when the start date is equal to the end date', () => {
  //   wrapper.instance().setState({
  //     startTime: '01:00',
  //     endTime: '01:00',
  //   });
  //   const result = wrapper.instance().isTimeRangeValid();
  //   expect(result).toBeFalsy();
  // });

  // test('isTimeRangeValid returns true when the start time is lesser than the end time', () => {
  //   wrapper.instance().setState({
  //     startTime: '05:00',
  //     endTime: '07:00',
  //   });
  //   const result = wrapper.instance().isTimeRangeValid();
  //   expect(result).toBeTruthy();
  // });

  test('handleChange unsets the error when the date values are valid', () => {
    wrapper.instance().setState({
      startTime: '02:00',
      endTime: '01:00',
    });
    const event = '05:00';
    const field = 'endTime';
    wrapper.instance().handleChange(event, field);
    expect(wrapper.state('error')).toBeFalsy();
  });
});
