const originalWindow = { ...window };
const windowSpy = jest.spyOn(global, 'window', 'get');
windowSpy.mockImplementation(() => ({
  ...originalWindow,
  __APP_CONFIG: {
    NOTIFICATION_API: 'test_url',
  },
  Rtns: {
    getInstance: jest.fn(() => ({
      registerService: jest.fn(),
      setNotificationUrl: jest.fn(),
      getNotificationUrl: jest.fn(),
      registerClient: jest.fn(),
      registerNotify: jest.fn(),
    })),
  },
  addEventListener: jest.fn(),
}));
export default windowSpy;
