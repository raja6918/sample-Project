import React from 'react';
import { shallow } from 'enzyme';
import Timeline from '../';

describe('Timeline Component', () => {
  const minProps = {
    panelExpanded: true,
    periodStartDate: '2018-08-01T00:00:00Z',
    periodEndDate: '2018-08-31T00:00:00Z',
    pairings: [],
    isSolverResult: false,
    updateTimelineWindowsCount: jest.fn(),
    timelineWindowsCount: 0,
    t: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<Timeline {...minProps} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test('Check Timeline Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Check whether ruleSelected is reset to null when rule dialog is closed by clicking cancel button', () => {
    wrapper.setState({
      ruleSelected: { code: 'duty-credit', name: 'Duty credit' },
    });
    wrapper.find('ErrorHandler').prop('handleCancel')();
    expect(wrapper.state('ruleSelected')).toBe(null);
  });
});
