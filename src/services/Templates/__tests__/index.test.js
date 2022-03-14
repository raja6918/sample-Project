import api from '../api';
import storage from '../../../utils/storage';
import service from '../index';
import constants from './../constants';

jest.mock('../api');
jest.mock('../../../utils/storage');

const { ENDPOINT, ENDPOINT_SUMMARY } = constants;
const TEMPLATE = {
  id: 1,
  name: 'Blank',
  category: 'Pairing',
  description: 'Initial Blank template',
  isTemplate: true,
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

const templatesFixtures = [
  TEMPLATE,
  {
    id: '3',
    name: 'template 2',
    category: 'Pairing',
    description: 'template description 2',
    createdBy: 'Smith Sam',
    creationTime: '2017-12-04T08:30:00.586Z',
    status: 'FREE',
    isTemplate: true,
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

describe('Templates Service', () => {
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

  function buildQueryParams() {
    return { userId: LOGGED_USER_ID };
  }

  function initMocks() {
    mockGet = api.get.mockImplementation(endpoint =>
      Promise.resolve(
        endpoint === USERS_SERVICE_SUMMARY_ENDPOINT
          ? templatesFixtures
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

  function buildPostRequestParams(templateData, userId = LOGGED_USER_ID) {
    const params = buildQueryParams(userId);
    const data = { objects: [templateData] };
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

  describe('#createTemplate', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should create a new template', async () => {
      const [templateCreated] = await service.createTemplate(TEMPLATE);

      expect(templateCreated).toEqual(TEMPLATE);
      expect(mockPost.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];

      expect(args).toEqual([
        USERS_SERVICE_ENDPOINT,
        ...buildPostRequestParams(TEMPLATE),
      ]);
    });

    it('should accept userId as second arg and used it in the creation', async () => {
      const userId = 100;
      await service.createTemplate(TEMPLATE, userId);

      expect(mockPost.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];
      const [endpointExecuted] = args;

      const expectedEndpoint = ENDPOINT;

      expect(endpointExecuted).toEqual(expectedEndpoint);
    });

    it('should set user logged id as a request query param', async () => {
      await service.createTemplate(TEMPLATE);

      expect(mockPost.mock.calls.length).toEqual(1);
      expect(mockStorage.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];
      const [endpointExecuted] = args;

      expect(endpointExecuted).toEqual(USERS_SERVICE_ENDPOINT);
    });
  });

  describe('#deleteTemplate', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should delete a template', async () => {
      await service.deleteTemplate(TEMPLATE.id);

      expect(mockDelete.mock.calls.length).toEqual(1);

      const args = mockDelete.mock.calls[0];
      const data = [TEMPLATE.id];
      const params = buildQueryParams();

      expect(args).toEqual([USERS_SERVICE_ENDPOINT, { data, params }]);
    });
  });

  describe('#getTemplates', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should return all templates', async () => {
      const templates = await service.getTemplates();

      expect(templates).toEqual(templatesFixtures);
      expect(mockGet.mock.calls.length).toEqual(1);

      const args = mockGet.mock.calls[0];
      const params = buildQueryParams();

      expect(args).toEqual([USERS_SERVICE_SUMMARY_ENDPOINT, { params }]);
    });
  });

  describe('#getCategories', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should return all template categories', async () => {
      const categories = await service.getCategories();

      expect(categories).toEqual(categoriesFixtures);
      expect(mockGet.mock.calls.length).toEqual(1);

      const args = mockGet.mock.calls[0];
      const params = buildQueryParams();

      expect(args).toEqual([
        `${USERS_SERVICE_ENDPOINT}/categories`,
        { params },
      ]);
    });
  });

  describe('#updateTemplate', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should update a template', async () => {
      const dataToUpdate = { ...TEMPLATE, name: 'update template name' };
      const [updatedTemplate] = await service.updateTemplate(dataToUpdate);

      expect(updatedTemplate).toEqual(dataToUpdate);
      expect(mockPut.mock.calls.length).toEqual(1);

      const args = mockPut.mock.calls[0];
      const [data, params] = buildPostRequestParams(dataToUpdate);

      expect(args).toEqual([USERS_SERVICE_ENDPOINT, data, params]);
    });
  });
});
