import React from 'react';
import { shallow } from 'enzyme';
import CompoundDateTimePicker from '../CompoundDateTimePicker';

describe('Test CompoundDateTimePicker Component', () => {
  const minProps = {
    t: jest.fn(),
    value: {
      startTime: '2020-12-06T06:02',
      endTime: '2020-12-06T06:02',
    },
    onChange: jest.fn(),
    returnDateFormat: 'YYYY-MM-DDTHH:mm',
    displayDateFormat: 'yy/MM/dd HH:mm',
    containerStyle: { width: '160px' },
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<CompoundDateTimePicker {...minProps} />);
  });

  test('CompoundDateTimePicker Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('isDateTimeRangeValid returns true by when dates are not set', () => {
    wrapper.instance().setState({
      startTime: null,
      endTime: null,
    });
    const result = wrapper.instance().isDateTimeRangeValid();
    expect(result).toBeTruthy();
  });

  test('isDateTimeRangeValid returns false when the start date is equal to the end date', () => {
    wrapper.instance().setState({
      startTime: '20/12/06 06:55',
      endTime: '20/12/06 06:55',
    });
    const result = wrapper.instance().isDateTimeRangeValid();
    expect(result).toBeTruthy();
  });

  test('isDateTimeRangeValid returns false when the start date is greater than the end date', () => {
    wrapper.instance().setState({
      startTime: '20/12/06 06:56',
      endTime: '20/12/06 06:55',
    });
    const result = wrapper.instance().isDateTimeRangeValid();
    expect(result).toBeFalsy();
  });

  test('isDateTimeRangeValid returns true when the start date is lesser than the end date', () => {
    wrapper.instance().setState({
      startTime: '20/12/06 06:54',
      endTime: '20/12/06 06:55',
    });
    const result = wrapper.instance().isDateTimeRangeValid();
    expect(result).toBeTruthy();
  });

  test('handleChange sets the error when the date values are not valid', () => {
    wrapper.instance().setState({
      startTime: '20/12/06 06:54',
      endTime: '20/12/06 06:54',
    });
    const event = '20/12/06 06:53';
    const field = 'endTime';
    wrapper.instance().handleChange(event, field);
    expect(wrapper.state('error')).toBeTruthy();
  });

  test('handleChange unsets the error when the date values are valid', () => {
    wrapper.instance().setState({
      startTime: '20/12/06 06:54',
      endTime: '20/12/06 06:53',
    });
    const event = '20/12/06 06:55';
    const field = 'endTime';
    wrapper.instance().handleChange(event, field);
    expect(wrapper.state('error')).toBeFalsy();
  });

  test('sendDateTime works correctly', () => {
    wrapper.instance().setState({
      startTime: '20/12/06 06:54',
      endTime: '20/12/06 06:53',
    });
    wrapper.instance().sendDateTime();

    expect(minProps.onChange).toBeCalledWith(
      expect.objectContaining({
        startTime: expect.any(String),
        endTime: expect.any(String),
      }),
      null,
      expect.any(Boolean)
    );
  });
});
