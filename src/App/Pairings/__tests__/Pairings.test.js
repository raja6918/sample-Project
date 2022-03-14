import React from 'react';
import { shallow } from 'enzyme';
import storage from './../../../utils/storage';
import mockedScenario from './mockedScenario.mock';
import * as pairingService from '../../../services/Pairings';

import { Pairings } from '../Pairings';

describe('Test Pairings Component', () => {
  const minProps = {
    location: {
      state: {
        openItemId: 1,
      },
    },
    name: 'Pairings test name',
    t: jest.fn(),
    reportError: jest.fn(),
    match: {
      params: {
        scenarioID: 1,
      },
    },
  };

  const filterBody = {
    type: 'apply',
    filterCriteria: { crewBase: { value: ['YHZ'], type: '' } },
    render: 'pairings',
  };

  let wrapper;
  beforeAll(() => {
    storage.setItem('openScenario', mockedScenario);
    storage.setItem('timelineFilter1', filterBody);
    storage.setItem('timelineFilter2', { ...filterBody, render: 'legs' });

    wrapper = shallow(<Pairings {...minProps} />);
  });

  afterAll(() => {
    storage.clear();
    wrapper.unmount();
  });

  test('Pairings Component renders', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test.skip('Check whether timeline1 is reset and getPairingAggregates service is called when filter is applied/reset for timeline1', () => {
    wrapper.instance().resetTimeline = jest.fn();
    wrapper.instance().forceUpdate();

    pairingService.getPairingAggregates = jest.fn(() =>
      Promise.resolve({
        response: {
          totalDataSize: 0,
          startIndex: 0,
          endIndex: 0,
          data: [],
        },
      })
    );

    const render = 'pairings';
    const timelineId = 1;
    wrapper.find('Timeline').prop('setFilter')(render, timelineId);

    expect(wrapper.instance().resetTimeline).toBeCalledWith(timelineId - 1);
    expect(pairingService.getPairingAggregates).toBeCalled();
  });

  test.skip('check whether reportError is called when error occured in getPairingAggregates Service when applying filter', () => {
    pairingService.getPairingAggregates = jest.fn(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        response: {},
      })
    );

    const render = 'pairings';
    const timelineId = 1;
    wrapper.find('Timeline').prop('setFilter')(render, timelineId);

    expect(minProps.reportError).toHaveBeenCalled();
    // check whether session storage is removed
    const filterStored = storage.getItem('timelineFilter1');
    expect(filterStored).toBe(null);
  });

  test.skip('Check whether timeline2 is reset and getFlightAggregates service is called when filter is applied/reset for timeline2', () => {
    wrapper.instance().resetTimeline = jest.fn();
    wrapper.instance().forceUpdate();

    pairingService.getFlightAggregates = jest.fn(() =>
      Promise.resolve({
        response: {
          totalDataSize: 0,
          startIndex: 0,
          endIndex: 0,
          data: [],
        },
      })
    );

    const render = 'legs';
    const timelineId = 2;
    wrapper.find('Timeline').prop('setFilter')(render, timelineId);

    expect(wrapper.instance().resetTimeline).toBeCalledWith(timelineId - 1);
    expect(pairingService.getFlightAggregates).toBeCalled();
  });

  test.skip('check whether reportError is called when error occured in getFlightAggregates Service when applying filter', () => {
    pairingService.getFlightAggregates = jest.fn(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        response: {},
      })
    );

    const render = 'legs';
    const timelineId = 2;
    wrapper.find('Timeline').prop('setFilter')(render, timelineId);

    expect(minProps.reportError).toHaveBeenCalled();
    // check whether session storage is removed
    const filterStored = storage.getItem('timelineFilter2');
    expect(filterStored).toBe(null);
  });
});
