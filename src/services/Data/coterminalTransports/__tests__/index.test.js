import api from './../../api';

import * as service from './../index';
import { ENDPOINT } from './../constants';

jest.mock('./../../api');

const coterminalTransportObj = [
  {
    id: '1',
    departureStationCode: 'PVG',
    arrivalStationCode: 'SHA',
    name: 'PVG-SHA Transport',
    type: 'Station Shuttle',
    availability: 'Perpetual',
  },
  {
    id: '2',
    departureStationCode: 'SHA',
    arrivalStationCode: 'PVG',
    name: 'SHA-PVG Transport',
    type: 'Station Shuttle',
    availability: 'Perpetual',
  },
];
const scenarioId = 91;

describe('Coterminal Transports Service', () => {
  let mock;
  function clearMock() {
    if (mock) mock.mockReset();
  }
  beforeAll(clearMock);

  afterAll(() => mock.restore());

  describe('#getCoterminalTranports', () => {
    beforeEach(() => {
      mock = api.post.mockImplementationOnce(() =>
        Promise.resolve(coterminalTransportObj)
      );
    });

    afterEach(clearMock);

    it('should return all coterminal transports', async () => {
      const tranports = await service.getCoterminalTransports(scenarioId);
      expect(tranports).toEqual(coterminalTransportObj);

      expect(mock.mock.calls.length).toEqual(1);

      const args = mock.mock.calls[0];
      expect([args[0]]).toEqual([`${ENDPOINT}/get?scenarioId=${scenarioId}`]);
    });
  });
});
