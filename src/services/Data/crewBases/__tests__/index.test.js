import api from './../../api';

import * as service from './../index';
import { ENDPOINT } from './../constants';

jest.mock('./../../api');

const crewBasesFixtures = [
  {
    id: 1,
    name: 'London',
    countryName: 'United Kingdom',
    contryCode: 'GB',
    stations: [
      { code: 'LHR', name: 'Heathrow Station' },
      { code: 'LGW', name: 'Gatwick Station' },
      { code: 'STN', name: 'London Stansted Station' },
    ],
  },
  {
    id: 1,
    name: 'Frankfurt',
    countryName: 'Germany',
    contryCode: 'GE',
    stations: [{ code: 'FRA', name: 'Frankfurt Station' }],
  },
];

describe('Crew Bases Service', () => {
  let mock;
  function clearMock() {
    if (mock) mock.mockReset();
  }
  beforeAll(clearMock);

  afterAll(() => mock.restore());

  describe('#getCrewBases', () => {
    beforeEach(() => {
      mock = api.post.mockImplementationOnce(() =>
        Promise.resolve(crewBasesFixtures)
      );
    });

    afterEach(clearMock);

    it('should return all crew bases', async () => {
      const crewBases = await service.getCrewBases(2);
      expect(crewBases).toEqual(crewBasesFixtures);

      expect(mock.mock.calls.length).toEqual(1);

      const args = mock.mock.calls[0];
      expect([args[0]]).toEqual([`${ENDPOINT}/get?scenarioId=2`]);
    });
  });
});
