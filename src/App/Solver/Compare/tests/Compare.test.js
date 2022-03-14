import React from 'react';
import { mount } from 'enzyme';

import Compare from '../Compare';

const t = jest.fn();
const SOLVERS = [
  {
    id: 1,
    status: { statusId: 1, status: 'completed' },
    name: 'CreW Bse Test 1',
    bases: ['VAN', 'LND', 'MTL', 'TOR'],
    data: {
      salaryCost: {
        total: '1785287.83',
        VAN: '465459.66',
        LND: '512005.62',
        MTL: '423145.14',
        TOR: '384677.4',
      },
    },
  },
];

const NEW_SOLVERS = [
  {
    id: 1,
    status: { statusId: 1, status: 'completed' },
    name: 'CreW Bse Test 1',
    bases: ['VAN', 'LND', 'MTL', 'TOR'],
    data: {
      salaryCost: {
        total: '1785287.83',
        VAN: '465459.66',
        LND: '512005.62',
        MTL: '423145.14',
        TOR: '384677.4',
      },
    },
  },
  {
    id: 2,
    status: { statusId: 1, status: 'completed' },
    name: 'Crew Bse Test 2',
    bases: ['VAN', 'LND', 'MTL', 'TOR'],
    data: {
      salaryCost: {
        total: '1785287.83',
        VAN: '465459.66',
        LND: '512005.62',
        MTL: '423145.14',
        TOR: '384677.4',
      },
    },
  },
];

const Wrapper = mount(<Compare t={t} solvers={SOLVERS} />);

test.skip('Compare component renders without crash', () => {
  expect(Wrapper).toMatchSnapshot();
});

test('Compare Table adds a new row correct', () => {
  const initialLength = Wrapper.state('data').length;

  Wrapper.instance().addNewRow('salaryCost');

  const afterAddLength = Wrapper.state('data').length;

  expect(afterAddLength).toBe(initialLength + 1);
});

test('Compare Table deletes a row correct', () => {
  Wrapper.instance().addNewRow('salaryCost');

  const length = Wrapper.state('data').length;

  Wrapper.instance().deleteRow(1);

  expect(Wrapper.state('data').length).toBe(length - 1);
});

test('handleChange functions changes the correct crew base selection', () => {
  const event = {
    target: {
      name: 'crewBaseSelected',
      value: 'LND',
    },
  };

  Wrapper.instance().handleChangeStat(event);

  const crewBaseSelected = Wrapper.state('crewBaseSelected');
  expect(crewBaseSelected).toBe('LND');

  // event.target.name = 'kpi';
  // event.target.value = 25;
  // Wrapper.instance().handleChangeStat(event);
  // const kpi = Wrapper.state('kpi');
  // expect(kpi).toBe(25);
});
