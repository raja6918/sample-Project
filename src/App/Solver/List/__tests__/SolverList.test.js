import React from 'react';
import { shallow } from 'enzyme';

import SolverList from '../SolverList';

const t = jest.fn();
const handleClick = jest.fn();

const solverRequests = [
  {
    id: 1,
    name: 'Crew Solution: 777 Pilots',
    status: 'running',
    lastModified: '2018-04-11T22:25:09.586Z'
  },
  {
    id: 2,
    name: 'Crew Solution: 888 Pilots',
    status: 'failed',
    lastModified: '2018-04-14T22:25:09.586Z'
  },
  {
    id: 3,
    name: 'Crew Solution: 999 Pilots',
    status: 'completed',
    lastModified: '2018-04-01T22:25:09.586Z'
  },
  {
    id: 4,
    name: 'Crew Solution: 777 Pilots',
    status: 'stopping',
    lastModified: '2018-04-15T22:25:09.586Z'
  },
  {
    id: 5,
    name: 'Crew Solution: 333 Pilots',
    status: 'stoppedWithResults',
    lastModified: '2018-06-20T22:25:09.586Z'
  },
  {
    id: 6,
    name: 'Crew Solution: 444 Pilots',
    status: 'completed',
    lastModified: '2018-02-11T22:25:09.586Z'
  },
  {
    id: 7,
    name: 'Crew Solution: 111 Pilots',
    status: 'running',
    lastModified: '2018-03-11T22:25:09.586Z'
  },
  {
    id: 8,
    name: 'Crew Solution: 777 Pilots',
    status: 'completed',
    lastModified: '2018-05-11T22:25:09.586Z'
  },
  {
    id: 9,
    name: 'Crew Solution: 555 Pilots',
    status: 'running',
    lastModified: '2018-01-11T22:25:09.586Z'
  },
  {
    id: 10,
    name: 'Crew Solution: 888 Pilots',
    status: 'completed',
    lastModified: '2018-09-11T22:25:09.586Z'
  },
  {
    id: 11,
    name: 'Crew Solution: 000 Pilots',
    status: 'running',
    lastModified: '2017-04-11T22:25:09.586Z'
  }
];

test.skip('SolverList Render', () => {
  expect(
    shallow(
      <SolverList
        solverRequests={solverRequests}
        active={-1}
        handleClick={handleClick}
        t={t}
      />
    )
  ).toMatchSnapshot();
});
