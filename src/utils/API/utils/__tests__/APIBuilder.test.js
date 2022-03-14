import axios from 'axios';
import getAPIFactory from '../APIBuilder';
import getAPIFactory2 from '../APIBuilder';

jest.mock('axios');

const API_URL = 'http://api.url.com';
const API_URL_2 = 'http://api2.url.com';

const apiFactory = getAPIFactory();

describe('API Factory', () => {
  let apiCounter;
  let createMock;

  beforeAll(clearMock);

  afterAll(() => {
    createMock.mockRestore();
    apiFactory.__clearAllInstances();
  });

  describe('handling without instances already created', () => {
    beforeEach(() => {
      apiCounter = 0;
      apiFactory.__clearAllInstances();
      validateInstanceShouldNotBeenCreated();
    });

    afterEach(clearMock);

    test('should create an api instance if it has not been created yet', () => {
      apiFactory.getInstance(API_URL);

      validateInstanceShouldBeenCreated(API_URL);
    });

    test('should not create a new api instance if it has already been created', () => {
      apiFactory.getInstance(API_URL);
      validateInstanceShouldBeenCreated(API_URL);

      clearMock();

      apiFactory.getInstance(API_URL);
      validateInstanceShouldNotBeenCreated();
    });
  });

  describe('handling with instances already created', () => {
    beforeEach(() => {
      apiCounter = 0;

      apiFactory.__clearAllInstances();
      apiFactory.getInstance(API_URL);

      validateInstanceShouldBeenCreated(API_URL);

      clearMock();
    });

    afterEach(clearMock);

    test('should reuse current api instance', () => {
      apiFactory.getInstance(API_URL);

      validateInstanceShouldNotBeenCreated(apiCounter);
    });

    test('should maintain current instances executing get factory fn again', () => {
      const factory2 = getAPIFactory2();

      validateInstanceShouldNotBeenCreated(apiCounter);
    });

    test('should create a new api instance if it has not been created', () => {
      apiFactory.getInstance(API_URL_2);

      validateInstanceShouldBeenCreated(API_URL_2);
    });
  });

  function clearMock() {
    if (createMock) {
      createMock.mockReset();
    }

    createMock = axios.create.mockImplementation(() => ({
      interceptors: {
        request: { use: () => {} },
        response: { use: () => {} },
      },
    }));
  }

  function validateInstanceShouldNotBeenCreated() {
    expect(createMock.mock.calls.length).toEqual(0);
    expect(Object.keys(apiFactory.__getInstances()).length).toEqual(apiCounter);
  }

  function validateInstanceShouldBeenCreated(baseURL) {
    ++apiCounter;
    expect(createMock.mock.calls.length).toEqual(1);
    expect(createMock.mock.calls[0][0]).toEqual({ baseURL });
    expect(Object.keys(apiFactory.__getInstances()).length).toEqual(apiCounter);
  }
});
