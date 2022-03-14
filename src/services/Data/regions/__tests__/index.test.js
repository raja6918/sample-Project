import api from './../../api';

import * as service from './../index';
import { ENDPOINT } from './../constants';

jest.mock('./../../api');

const regionsFixtures = [
  {
    id: 1,
    name: 'Africa-Indian Ocean',
    code: 'AFI',
  },
  {
    id: 2,
    name: 'Asia',
    code: 'ASIA',
  },
];

const scenarioId = 1;

function buildEndpoint(scenarioId) {
  return `${ENDPOINT}/get?scenarioId=${scenarioId}`;
}

describe('Regions Service', () => {
  let mock;

  beforeAll(clearMock);

  afterAll(() => mock.restore());

  describe('#getRegions', () => {
    beforeEach(() => {
      mock = api.post.mockImplementationOnce(() =>
        Promise.resolve(regionsFixtures)
      );
    });

    afterEach(clearMock);

    it('should return all regions', async () => {
      const regions = await service.getRegions(scenarioId);
      expect(regions).toEqual(regionsFixtures);

      expect(mock.mock.calls.length).toEqual(1);

      const args = mock.mock.calls[0];
      expect([args[0]]).toEqual([buildEndpoint(scenarioId)]);
    });
  });

  function clearMock() {
    if (mock) mock.mockReset();
  }
});
