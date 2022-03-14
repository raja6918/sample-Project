import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Sticky from '../Sticky';
import Header from '../TableHeader';
import Table from '../ScenarioTable';

const minPropsHeader = {
  t: jest.fn(),
  top: 0,
  stickyHeader: 'Today',
  isDisabled: false,
  handleAdd: jest.fn(),
  handleCreatedBy: jest.fn('ANYONE'),
};
const minPropsTable = {
  scenarios: [
    {
      id: '1001',
      name: 'April Prod - 777 Pilots',
      startDate: '2018-04-10T22:25:09.586Z',
      endDate: '2018-04-10T22:25:09.586Z',
      createdBy: 'Ruben Flores',
      creationTime: '2018-04-10T22:25:09.586Z',
      lastOpenedByMe: '2018-04-12T22:25:09.586Z',
      status: 'NOT_OPENED',
      planName: 'Reference Data Set April 2018',
    },
  ],
  needHeader: false,
  scenarioHeader: '',

  scenariostofilter: 'scenariosToday',
  id: 'tableToday',
  t: jest.fn(),
};
const StickyHeader = (
  <Sticky
    render={({ top }) => (
      <React.Fragment>
        <Header {...minPropsHeader} />
        <Table
          style={{
            position: top <= 64 ? 'relative' : 'static',
            top: top <= 64 ? '133px' : 0,
          }}
          {...minPropsTable}
        />
        )}
      </React.Fragment>
    )}
  />
);
const wrapper = shallow(StickyHeader);

test('state: top on Sticky is > 0', () => {
  const inst = wrapper.instance().state.top;
  expect(inst > 0);
});
