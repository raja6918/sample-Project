import React from 'react';
import { mount } from 'enzyme';
import IntegrationsAlerts from '../IntegrationsAlerts';

const importErrors = {
  total: 1,
  datatypes: {
    flight: {
      errors: [
        {
          errorType: 'DATA',
          id: 6155,
          importProcessId: 4,
          messageArguments: ['2', '2009-07-01 13:20', 'AUH'],
          messageKey: 'IMPORT_FLIGHT_UNKNOWN_ARR_STATION',
          severity: 'WARNING',
        },
      ],
    },
  },
};
const minProps = {
  importErrors: { ...importErrors },
  t: jest.fn(() => ''),
  removeError: jest.fn(),
};
describe('Tests on IntegrationAlert', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(<IntegrationsAlerts {...minProps} />);
  });
  afterAll(() => {
    wrapper.unmount();
  });
  test('IntegrationAlert component render correct', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
