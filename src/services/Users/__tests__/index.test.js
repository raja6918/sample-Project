import api from '../api';
import service from '../index';
import constants from './../constants';

jest.mock('../api');

const { ENDPOINT, ENDPOINT_SUMMARY } = constants;
const USER = {
  id: 1,
  firstName: 'admin',
  lastName: 'admin',
  userName: 'admin',
  role: 'Administrator',
};

const usersFixtures = [USER];

const rolesFixtures = ['Administrator', 'Planner', 'Reviewer'];

describe('Users Service', () => {
  let mockGet;
  let mockPost;
  let mockPut;
  let mockDelete;

  beforeAll(clearMock);

  afterAll(() => {
    mockGet.restore();
    mockPost.restore();
    mockPut.restore();
    mockDelete.restore();
  });

  describe('#createUser', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should create a new user', async () => {
      const [userCreated] = await service.createUser(USER);

      expect(userCreated).toEqual(USER);
      expect(mockPost.mock.calls.length).toEqual(1);

      const args = mockPost.mock.calls[0];

      const [data] = buildPostRequestParams(USER);

      expect(args).toEqual([ENDPOINT, data]);
    });
  });

  describe('#deleteUser', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should delete an user', async () => {
      await service.deleteUser(USER.id);

      expect(mockDelete.mock.calls.length).toEqual(1);

      const args = mockDelete.mock.calls[0];
      const data = [USER.id];

      expect(args).toEqual([ENDPOINT, { data }]);
    });
  });

  describe('#getUsers', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should return all users in summary mode', async () => {
      const users = await service.getUsers();

      expect(users).toEqual(usersFixtures);
      expect(mockGet.mock.calls.length).toEqual(1);

      const args = mockGet.mock.calls[0];

      expect(args).toEqual([ENDPOINT_SUMMARY]);
    });
  });

  describe('#getRoles', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should return all user roles', async () => {
      const roles = await service.getRoles();

      expect(roles).toEqual(rolesFixtures);
      expect(mockGet.mock.calls.length).toEqual(1);

      const args = mockGet.mock.calls[0];

      expect(args).toEqual([`${ENDPOINT}/roles`]);
    });
  });

  describe('#updateUser', () => {
    beforeEach(initMocks);
    afterEach(clearMock);

    it('should update an user', async () => {
      const dataToUpdate = { ...USER, name: 'update user name' };
      const [updatedUser] = await service.updateUser(dataToUpdate);

      expect(updatedUser).toEqual(dataToUpdate);
      expect(mockPut.mock.calls.length).toEqual(1);

      const args = mockPut.mock.calls[0];
      const [data] = buildPostRequestParams(dataToUpdate);

      expect(args).toEqual([ENDPOINT, data]);
    });
  });

  function clearMock() {
    if (mockGet) mockGet.mockReset();
    if (mockPost) mockPost.mockReset();
    if (mockPut) mockPut.mockReset();
    if (mockDelete) mockDelete.mockReset();
  }

  function initMocks() {
    mockGet = api.get.mockImplementation(endpoint =>
      Promise.resolve(
        endpoint === ENDPOINT_SUMMARY ? usersFixtures : rolesFixtures
      )
    );
    mockPost = api.post.mockImplementation((a, b) =>
      Promise.resolve(b.objects)
    );
    mockPut = api.put.mockImplementation((a, b) => Promise.resolve(b.objects));
    mockDelete = api.delete.mockImplementation(() => Promise.resolve());
  }

  function buildPostRequestParams(userData) {
    const params = {};
    const data = { objects: [userData] };
    return [data, { params }];
  }
});
