import getAPIFactory from './APIBuilder';

const apiFactory = getAPIFactory();
const buildAPI = apiFactory.getInstance.bind(apiFactory);

const config = { ...window.__APP_CONFIG };

function getConfig() {
  return config;
}

export default {
  getConfig,
  buildAPI,
};
