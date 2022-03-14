import api from '../api';
import storage from '../../../utils/storage';
import service from '../index';
import constants from './../constants';

jest.mock('../api');
jest.mock('../../../utils/storage');

const { ENDPOINT, ENDPOINT_SUMMARY } = constants;
const SCENARIO = {
  id: 1,
  name: 'Blank',
  category: 'Pairing',
  description: 'Initial Blank scenario',
  isTemplate: false,
  status: 'Free',
  createdBy: 'admin admin',
  creationTime: '2018-12-17T23:37:55.691Z',
  lastModifiedBy: 'admin admin',
  lastModifiedTime: '2018-12-17T23:37:55.691Z',

  lastOpenedByMe: null,
  isOpenedBy: null,
  isOpenedById: null,
  startDate: null,
  endDate: null,
};

const LOGGED_USER_ID = 2;

const scenariosFixtures = [
  SCENARIO,
  {
    id: '3',
    name: 'scenario 2',
    category: 'Pairing',
    description: 'scenario description 2',
    createdBy: 'Smith Sam',
    creationTime: '2017-12-04T08:30:00.586Z',
    status: 'FREE',
    isTemplate: false,
    lastModified: '2018-04-12T08:30:00.586Z',
    lastModifiedBy: 'Ann Marié',

    lastOpenedByMe: null,
    isOpenedBy: null,
    isOpenedById: null,
    startDate: null,
    endDate: null,
  },
];

const categoriesFixtures = ['All', 'Pairing'];

const USERS_SERVICE_ENDPOINT = `${ENDPOINT}`;

const USERS_SERVICE_SUMMARY_ENDPOINT = `${ENDPOINT_SUMMARY}`;

describe('Scenarios Service', () => {
  let mockGet;
  let mockPost;
  let mockPut;
  let mockDelete;
  let mockStorage;

  function clearMock() {
    if (mockGet) mockGet.mockReset();
    if (mockPost) mockPost.mockReset();
    if (mockPut) mockPut.mockReset();
    if (mockDelete) mockDelete.mockReset();
    if (mockStorage) mockStorage.mockReset();
  }

  function mockBulkImplementation(a, b, c) {
    if (c && c.objects) return Promise.resolve(c.objects);
    return Promise.resolve(b && b.objects ? b.objects : []);
  }

  function initMocks() {
    mockGet = api.get.mockImplementation(endpoint =>
      Promise.resolve(
        endpoint === USERS_SERVICE_SUMMARY_ENDPOINT
          ? scenariosFixtures
          : categoriesFixtures
      )
    );
    mockPost = api.post.mockImplementation(mockBulkImplementation);
    mockPut = api.put.mockImplementation(mockBulkImplementation);
    mockDelete = api.delete.mockImplementation(() => Promise.resolve());
    mockStorage = storage.getItem.mockImplementation(() => ({
      id: LOGGED_USER_ID,
    }));
  }

  function buildQueryParams() {
    const userId = LOGGED_USER_ID;
    return { userId };
  }

  function buildPostRequestParams(scenarioData, userId = LOGGED_USER_ID) {
    const params = buildQueryParams(userId);
    const data = { objects: [scenarioData] };
    return [data, { params }];
  }

  beforeAll(clearMock);

  afterAll(() => {
    mockGet.restore();
    mockPost.restore();
    mockPut.restore();
    mockDelete.restore();
    mockStorage.restore();
  });

  describe('#createScenario', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should create a new scenario', async () => {
      const [scenarioCreated] = await service.createScenario(SCENARIO);

      expect(scenarioCreated).toEqual(SCENARIO);
      expect(mockPost.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];

      expect(args).toEqual([
        USERS_SERVICE_ENDPOINT,
        ...buildPostRequestParams(SCENARIO),
      ]);
    });

    it('should accept userId as second arg and used it in the creation', async () => {
      const userId = 100;
      await service.createScenario(SCENARIO, userId);

      expect(mockPost.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];
      const [endpointExecuted] = args;

      const expectedEndpoint = `${ENDPOINT}`;

      expect(endpointExecuted).toEqual(expectedEndpoint);
    });

    it('should set user logged id as a request query param', async () => {
      await service.createScenario(SCENARIO);

      expect(mockPost.mock.calls.length).toEqual(1);
      expect(mockStorage.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];
      const [endpointExecuted] = args;

      expect(endpointExecuted).toEqual(USERS_SERVICE_ENDPOINT);
    });
  });

  describe('#deleteScenario', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should delete a scenario', async () => {
      await service.deleteScenario(SCENARIO.id);

      expect(mockDelete.mock.calls.length).toEqual(1);

      const args = mockDelete.mock.calls[0];
      const data = [SCENARIO.id];
      const params = buildQueryParams();

      expect(args).toEqual([USERS_SERVICE_ENDPOINT, { data, params }]);
    });
  });

  describe('#getScenarios', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should return all scenarios', async () => {
      const scenarios = await service.getScenarios();

      expect(scenarios).toEqual(scenariosFixtures);
      expect(mockGet.mock.calls.length).toEqual(1);

      const args = mockGet.mock.calls[0];
      const params = buildQueryParams();

      expect(args).toEqual([USERS_SERVICE_SUMMARY_ENDPOINT, { params }]);
    });

    it('should apply filter params if it is passed', async () => {
      await service.getScenarios('ME');

      expect(mockGet.mock.calls.length).toEqual(1);

      const args = mockGet.mock.calls[0];
      const params = { ...buildQueryParams(), filter: 'ME' };

      expect(args).toEqual([USERS_SERVICE_SUMMARY_ENDPOINT, { params }]);
    });
  });

  describe('#openScenario', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should mark a scenario as opened', async () => {
      await service.openScenario(SCENARIO.id);

      expect(mockPut.mock.calls.length).toEqual(1);

      const args = mockPut.mock.calls[0];
      const endpoint = `${ENDPOINT}/${SCENARIO.id}`;
      const params = { action: 'OPEN', userId: LOGGED_USER_ID };

      expect(args).toEqual([endpoint, null, { params }]);
    });
  });

  describe('#updateScenario', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should update a scenario', async () => {
      const dataToUpdate = { ...SCENARIO, name: 'updated scenario name' };
      const [updatedScenario] = await service.updateScenario(dataToUpdate);

      expect(updatedScenario).toEqual(dataToUpdate);
      expect(mockPut.mock.calls.length).toEqual(1);

      const args = mockPut.mock.calls[0];
      const [data, params] = buildPostRequestParams(dataToUpdate);

      expect(args).toEqual([USERS_SERVICE_ENDPOINT, data, params]);
    });
  });
});
