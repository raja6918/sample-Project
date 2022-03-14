import axios from 'axios';
import storage from '../../storage';
import history from '../../../history';

const config = { ...window.__APP_CONFIG };

let APIFactory;

function registerInterceptors(instance, tokenHandler) {
  instance.interceptors.request.use(
    config => {
      const JWT = tokenHandler.getJWT();
      if (JWT.token) {
        config.headers['Authorization'] = `Bearer ${JWT.token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      const originalRequest = error.config;
      const JWT = tokenHandler.getJWT();

      // Ensure that in 401 responses, only try to refresh the token if there were
      // a token previously stored in session storage
      if (error.response && error.response.status === 401 && JWT.token) {
        return tokenHandler
          .refreshJWT()
          .then(newJWT => {
            originalRequest.headers.Authorization = `Bearer ${newJWT.token}`;
            return axios(originalRequest).then(response => response.data);
          })
          .catch(error => {
            if (error.response.status === 401) {
              history.push('/');
            }
            return Promise.reject(error);
          });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

function buildTokensHandler() {
  const JWT_KEY = 'jwt';
  const _requestsStack = [];

  const destroyJWT = () => {
    storage.removeItem(JWT_KEY);
  };

  const getJWT = () => {
    return storage.getItem(JWT_KEY) || {};
  };

  const saveJWT = jwt => {
    storage.setItem(JWT_KEY, jwt);
  };

  const makeGetJWTRequest = () => {
    const JWT = getJWT();

    return axios
      .post(`${config.USER_API}/auth/token`, null, {
        headers: { Authorization: `Bearer ${JWT.refreshToken}` },
      })
      .then(({ data }) => {
        saveJWT(data);

        return Promise.resolve(data);
      })
      .catch(error => {
        if (error.response.status === 401) {
          destroyJWT();
        }

        return Promise.reject(error);
      });
  };

  const refreshJWT = () => {
    if (_requestsStack.length > 0) return _requestsStack[0];

    const promise = makeGetJWTRequest();

    const buildPromiseFn = promiseFn => {
      return res => {
        _requestsStack.pop();
        promiseFn(res);
      };
    };

    const promiseClone = new Promise((resolve, reject) => {
      promise.then(buildPromiseFn(resolve), buildPromiseFn(reject));
    });

    _requestsStack.push(promiseClone);

    return promiseClone;
  };

  return {
    destroyJWT,
    getJWT,
    saveJWT,
    refreshJWT,
  };
}

function buildAPIFactory() {
  const __instances = {};
  let tokenHandler;

  const getTokenHandler = () => {
    if (!tokenHandler) {
      tokenHandler = buildTokensHandler();
    }

    return tokenHandler;
  };

  const createInstance = baseURL => {
    return registerInterceptors(axios.create({ baseURL }), getTokenHandler());
  };

  const getInstance = baseURL => {
    if (!__instances[baseURL]) {
      __instances[baseURL] = createInstance(baseURL);
    }

    return __instances[baseURL];
  };

  const __getInstances = () => __instances;

  const __clearAllInstances = () => {
    Object.keys(__instances).forEach(key => {
      delete __instances[key];
    });
  };

  return {
    __getInstances,
    __clearAllInstances,
    getInstance,
  };
}

function getAPIFactory() {
  if (!APIFactory) APIFactory = buildAPIFactory();

  return APIFactory;
}

export default getAPIFactory;
