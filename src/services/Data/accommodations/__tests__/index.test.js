import api from './../../api';

import * as service from './../index';
import { ENDPOINT } from './../constants';

jest.mock('./../../api');

const accommodationFixtures = [
  {
    capacity: '30',
    checkInTime: '',
    checkOutTime: '',
    contractEndDate: '2018-11-30T22:25:09.586Z',
    contractStartDate: '2018-11-01T22:25:09.586Z',
    cost: '1200',
    costExtendedStay: '999',
    currency: 'MXN',
    id: '8',
    name: 'Fiesta Inn',
    paymentType: '24HourBlock',
    restType: 'City',
    stations: [{ code: 'MEX' }],
  },
  {
    capacity: '20',
    checkInTime: '16:00',
    checkOutTime: '10:00',
    contractEndDate: '2018-11-30T22:25:09.586Z',
    contractStartDate: '2018-11-01T22:25:09.586Z',
    cost: '150',
    costExtendedStay: '135',
    currency: 'USD',
    id: '7',
    name: 'Crown Plaza JFK',
    paymentType: 'CheckInOut',
    restType: 'Station',
    stations: [{ code: 'JFK' }],
  },
];

function buildEndpoint(scenarioId) {
  return `${ENDPOINT}/get?scenarioId=${scenarioId}`;
}

describe('Accommodations Service', () => {
  let mock;
  function clearMock() {
    if (mock) mock.mockReset();
  }
  beforeAll(clearMock);

  afterAll(() => mock.restore());

  describe('#getAccommodations', () => {
    beforeEach(() => {
      mock = api.post.mockImplementationOnce(() =>
        Promise.resolve(accommodationFixtures)
      );
    });

    afterEach(clearMock);

    it('should return all accommodations', async () => {
      const scenarioId = 1;
      const accommodations = await service.getAccommodations(scenarioId);
      expect(accommodations).toEqual(accommodationFixtures);

      expect(mock.mock.calls.length).toEqual(1);

      const args = mock.mock.calls[0];
      expect([args[0]]).toEqual([buildEndpoint(scenarioId)]);
    });
  });
});
