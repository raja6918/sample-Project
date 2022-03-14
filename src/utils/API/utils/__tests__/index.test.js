import utils from './../index';

describe('API Utils #getConfig', () => {
  it('should return config stored in app-config file', () => {
    const config = utils.getConfig();
    expect(typeof config).toEqual('object');
  });
});
