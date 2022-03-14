import React from 'react';
import { shallow } from 'enzyme';
import { RuleDialog } from '../RuleDialog';
import storage from '../../../../../../utils/storage';
import { ruleDescriptionData } from '../../../../../Data/Content/Rules/mockData';
import * as ruleService from '../../../../../../services/Data/rules';

describe('Test RuleDialog Component', () => {
  const minProps = {
    t: jest.fn(),
    rule: {
      code: 'duty-nb-max',
      name: 'Minimum local night',
    },
    ruleset: 1,
    setOverlay: jest.fn(),
    reportError: jest.fn(),
    removeOverlay: jest.fn(),
    toggleLoader: jest.fn(),
    readOnly: false,
    openItemId: 1,
    overlay: false,
  };

  let wrapper;
  beforeAll(() => {
    // set loggedUser session storage
    storage.setItem('loggedUser', { id: 1 });
    wrapper = shallow(<RuleDialog {...minProps} />);
  });

  afterAll(() => {
    storage.clear();
    wrapper.unmount();
  });

  test('RuleDialog Component renders correctly', () => {
    wrapper.setState({
      ruleDescription: ruleDescriptionData[0],
      code: 'duty-credit',
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('check whether reportError is called when error occured in revertParam Service', async () => {
    const data = ruleDescriptionData[3].userDescription[1];
    ruleService.revertParam = jest.fn(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        response: {},
      })
    );

    await wrapper
      .find('Connect(Description)')
      .at(0)
      .prop('handleParamReset')(data, 1, 'duty-nb-max');

    expect(minProps.reportError).toHaveBeenCalled();
  });

  test('Check whether fetchDescription is not called when rule code prop has not changed', () => {
    wrapper.instance().fetchDescription = jest.fn();

    wrapper.setProps({
      rule: {
        code: 'duty-credit',
        name: 'Duty credit',
      },
    });

    expect(wrapper.instance().fetchDescription).not.toHaveBeenCalled();
  });
});
