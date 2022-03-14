/**
 *
 * @author A-4211 Rtns client implementation
 */

//Hashtable start
function Hashtable() {
  this.data = new Array();
  this.position = 0;
}

Hashtable.prototype.data = null;
Hashtable.prototype.position = null;

Hashtable.prototype.put = function(key, value) {
  if (!this.isContain(key)) {
    this.position++;
  }
  this.data[key] = value;
};

Hashtable.prototype.get = function(key) {
  if (this.isContain(key)) {
    return this.data[key];
  }
  return undefined;
};

Hashtable.prototype.isContain = function(key) {
  return this.data.hasOwnProperty(key);
};

Hashtable.prototype.remove = function(key) {
  if (this.isContain(key)) {
    delete this.data[key];
    this.position--;
  }
};

Hashtable.prototype.size = function() {
  return this.position;
};

Hashtable.prototype.getKeys = function() {
  const keys = [];
  for (const key in this.data) {
    if (this.isContain(key)) {
      keys.push(key);
    }
  }
  return keys;
};

Hashtable.prototype.getValues = function() {
  const values = [];
  for (const key in this.data) {
    if (this.isContain(key)) {
      values.push(this.data[key]);
    }
  }
  return values;
};

Hashtable.prototype.clear = function() {
  this.position = 0;
  this.data = {};
};

Hashtable.prototype.setValue = function(key, value) {
  if (this.data[key] != null) this.data[key] = value;
};

Hashtable.prototype.getKeyOfValue = function(value) {
  for (const key in this.data) {
    if (this.data(key) == value) {
      return key;
    }
  }
  return null;
};
//HashTables end
const Rtns = () => {
  /**
   * Singleton object of rtns
   */
  let instance;
  /**
   * Application supplied functions
   */
  const services = {};
  /**
   * Unique id provided by the server
   */
  let clientID = '';
  /**
   * UUID created by the atmosphere server
   */
  let uuid = '';
  /**
   * Keep the message callback corresponding to registerid
   */
  const suCallbacks = new Hashtable();
  /**
   * Copy of the atmosphere library
   */
  let transport = '';
  let atmosphere = '';

  /**
   * Copy of the atmosphere library
   */
  let socket;
  /**
   * Copy of the atmosphere library
   */
  if (typeof require !== 'undefined') {
    socket = require('atmosphere');
    atmosphere = require('atmosphere');
  } else {
    socket = window.atmosphere;
  }
  /**
   * Cache the notification registration data in an array
   */
  const notificationCache = [];
  /**
   * Transport used by atmosphere
   */
  let transProtocol = 'websocket';
  /**
   * Fallback Transport used by atmosphere
   */
  let fbTransProtocol = 'long-polling';
  /**
   * Default notification url
   *
   */

  let notificationUrl = 'async/sprout-rtns';
  const defaultNotificationUrl = 'async/sprout-rtns';
  /**
   * client registration url
   */
  const CLIENT_REGISTER_URL = 'sprout/rtns/client/register';
  /**
   * Unregister the client url
   */
  const CLIENT_UNREGISTER_URL = 'sprout/rtns/client/unregister';
  /**
   * Register the notification url
   */
  const NOTI_REGISTER_URL = 'sprout/rtns/notification/register';
  /**
   * Unregister the notification url
   */
  const NOTI_UNREGISTER_URL = 'sprout/rtns/notification/unregister';

  /**
   * For the status check
   */
  let connected = false;
  /**
   * For assign the registration id
   */
  let notificationCount = 0;

  /**
   * content type
   */
  const UTF_JSON = 'application/json; charset=utf-8';

  /**
   * Default constructor of the rtns
   */
  const init = () => {
    const getClientID = () => {
      return clientID;
    };

    const getUUID = () => {
      return uuid;
    };

    const setTransports = (transport, fallbackTransport) => {
      if (transProtocol !== undefined && transProtocol !== '') {
        transProtocol = transport;
      }
      if (fallbackTransport !== undefined && fallbackTransport !== '') {
        fbTransProtocol = fallbackTransport;
      }
    };

    /**
     * Register the client for getting client id
     */
    const registerClient = successCallback => {
      const method = 'GET';
      ajaxService(
        CLIENT_REGISTER_URL,
        method,
        null,
        null,
        null,
        response => {
          // if register client request coming via a second request (exception case like guest user login)
          // clear the current client id and connected details
          if (clientID !== '' && response.clientID !== clientID) {
            connected = false;
            clientID = '';
          }

          clientID = response.clientID;
          if (clientID !== '') {
            connect();
            // Calls the cached notification
            if (notificationCache.length > 0) {
              do {
                const notify = notificationCache.pop();
                registerNotify(
                  notify.request,
                  notify.messageCallback,
                  notify.successCallback,
                  notify.errorCallback
                );
              } while (notificationCache.length > 0);
            }
          }
          successCallback(response);
        },
        errorHandler
      );
    };

    /**
     * Unregister the client
     */
    const unregisterClient = unregisterCallback => {
      const requestBody = {
        clientID: getClientID(),
      };
      const method = 'POST';
      ajaxService(
        CLIENT_UNREGISTER_URL,
        method,
        requestBody,
        UTF_JSON,
        'json',
        response => {
          if (response.unregister === true) {
            clientID = '';
          }
          if (unregisterCallback !== undefined) {
            unregisterCallback(response);
          }
        },
        errorHandler
      );
    };

    /**
     * Register the notification type with clientid returns registration id
     * successCallback will be invoked at success of service call
     * messageCallback will be invoked at onMessage() of atmosphere client
     */
    const registerNotify = (
      request,
      messageCallback,
      successCallback,
      errorCallback
    ) => {
      if (getClientID() === '') {
        // Cache the function
        const cacheNotify = {
          request: request,
          messageCallback: messageCallback,
          successCallback: successCallback,
          errorCallback: errorCallback,
        };
        notificationCache.push(cacheNotify);
        return;
      }

      notificationCount++;
      const registerID =
        getClientID() + request.notificationType + notificationCount;

      const requestBody = {
        clientID: getClientID(),
        notificationType: request.notificationType,
        notificationSince: request.notificationSince,
        filterCriteria: request.filterCriteria,
        registerID: registerID,
      };

      if (messageCallback === null || messageCallback === undefined) {
        return;
      }
      const method = 'POST';
      ajaxService(
        NOTI_REGISTER_URL,
        method,
        requestBody,
        UTF_JSON,
        'json',
        response => {
          suCallbacks.put(response.registerID, messageCallback);
          // execute the call back
          if (successCallback !== undefined) {
            successCallback(response);
          }
        },
        (jqXHR, textStatus, errorThrown) => {
          errorHandler(jqXHR, textStatus, errorThrown);
          if (errorCallback !== undefined && errorCallback === null) {
            errorCallback(jqXHR, textStatus, errorThrown);
          }
        }
      );
    };

    /**
     * Register the notification unregisterCallback will be invoked at
     * success of service call. Request body contains notificationType and
     * registerID
     */
    const unregisterNotify = (request, unregisterCallback, errorCallback) => {
      const method = 'POST';
      const requestBody = request;

      ajaxService(
        NOTI_UNREGISTER_URL,
        method,
        requestBody,
        UTF_JSON,
        'json',
        response => {
          if (response.unregister === true) {
            suCallbacks.remove(request.registerID);
          }
          if (unregisterCallback !== undefined) {
            unregisterCallback(response);
          }
        },
        (jqXHR, textStatus, errorThrown) => {
          errorHandler(jqXHR, textStatus, errorThrown);
          if (errorCallback !== undefined && errorCallback === null) {
            errorCallback(jqXHR, textStatus, errorThrown);
          }
        }
      );
    };

    /**
     * Bind the application provided function against the name
     */
    const registerService = (name, serviceCallback) => {
      services[name] = serviceCallback;
    };

    /**
     * jquery based ajax service
     */
    const ajaxService = (
      url,
      type,
      content,
      contentType,
      dataType,
      successCallback,
      errorCallback
    ) => {
      const options = {};
      options['url'] = url;
      options['type'] = type;

      if (contentType != null && contentType != '') {
        options['contentType'] = contentType;
      }
      if (dataType != null && dataType != '') {
        options['dataType'] = dataType;
      }
      if (content != null && content != '') {
        options['data'] = JSON.stringify(content);
      }

      options['success'] = successCallback;
      options['error'] = errorCallback;

      // Assuming ajax is name the provided by the application
      services['ajax'](options);
      // $.ajax(options);
    };

    /**
     * Utiliy Functions
     */
    const isObject = value => {
      return value !== null && typeof value === 'object';
    };

    const isArrayLike = obj => {
      if (obj == null || isWindow(obj)) {
        return false;
      }
      const length = obj.length;
      if (obj.nodeType === 1 && length) {
        return true;
      }
      return (
        isString(obj) ||
        isArray(obj) ||
        length === 0 ||
        (typeof length === 'number' && length > 0 && length - 1 in obj)
      );
    };

    const isFunction = obj => {
      return typeof obj === 'function';
    };

    const isArray = () => {
      if (!isFunction(Array.isArray)) {
        return value => {
          return toString.call(value) === '[object Array]';
        };
      }
      return Array.isArray;
    };

    const isWindow = obj => {
      return (
        obj && obj.document && obj.location && obj.alert && obj.setInterval
      );
    };

    const isString = value => {
      return typeof value === 'string';
    };

    const forEach = (obj, iterator, context) => {
      let key;
      if (obj) {
        if (typeof obj === 'function') {
          for (key in obj) {
            // Need to check if hasOwnProperty exists,
            // as on IE8 the result of querySelectorAll is an object
            // without a hasOwnProperty function
            if (
              key !== 'prototype' &&
              key !== 'length' &&
              key !== 'name' &&
              (!obj.hasOwnProperty || obj.hasOwnProperty(key))
            ) {
              iterator.call(context, obj[key], key);
            }
          }
        } else if (obj.forEach && obj.forEach !== forEach) {
          obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
          for (key = 0; key < obj.length; key++)
            iterator.call(context, obj[key], key);
        } else {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key);
            }
          }
        }
      }
      return obj;
    };

    const convert = pushMessage => {
      forEach(pushMessage, (key2, value) => {
        const key = key2.toString();
        if (key.charAt(0) === '_') {
          pushMessage[key.substr(1)] = Date.parse(pushMessage[key.substr(1)]);
          delete pushMessage[key];
        } else {
          if (isObject(pushMessage[key])) {
            convert(pushMessage[key]);
          }
        }
      });
      return pushMessage;
    };

    /**
     * Open the channel to retrieve the notification
     */
    const connect = () => {
      if (connected) {
        return;
      }
      const request = {
        url: notificationUrl + '?clientID=' + clientID,
        contentType: 'application/json',
        logLevel: 'debug',
        transport: transProtocol,
        trackMessageLength: true,
        reconnectInterval: 5000,
        fallbackTransport: fbTransProtocol,
      };

      request.onOpen = response => {
        transport = response.transport;
        uuid = response.request.uuid;
        console.log(`Connection Established `);
        if (typeof services['reConnection'] === 'function')
          services['reConnection'](response);
      };

      request.onReopen = response => {
        console.log(`opened`);
        if (typeof InstallTrigger !== 'undefined')
          if (typeof services['reConnection'] === 'function')
            //check if mozilla ,onopen not triggering in mozilla
            services['reConnection'](response);
      };

      request.onMessage = response => {
        const message = convert(JSON.parse(response.responseBody));
        messageFilter(message);
      };

      request.onClose = response => {
        console.log(response);
        if (typeof services['closeConnection'] === 'function')
          services['closeConnection'](response);
      };

      request.onError = response => {
        console.log(
          "Sorry, but there's some problem with your socket or the server is down"
        );
      };

      request.onReconnect = (request, response) => {
        console.log(
          'Connection lost, trying to reconnect. Trying to reconnect ' +
            request.reconnectInterval
        );
      };
      const subSocket = socket.subscribe(request);
      if (subSocket != null || subSocket !== undefined) {
        connected = true;
      }
    };

    const disconnect = () => {
      if (notificationUrl !== '') {
        socket.unsubscribe(notificationUrl);
        connected = false;
      } else {
        console.log('Notification URL is null');
      }
    };

    const messageFilter = message => {
      const regIDs = message.headers.RegistrationIDs.split(',');

      const clientMessage = {
        headers: {
          NotificationType: message.headers.NotificationType,
          Time: message.headers.Time,
        },
        payload: message.payload,
      };

      for (let index = 0; index < regIDs.length; index++) {
        const callbackFun = suCallbacks.get(regIDs[index]);
        callbackFun(clientMessage);
      }
    };

    const errorHandler = (jqXHR, textStatus, errorThrown) => {
      console.log('Error ' + jqXHR + ', ' + textStatus + ' ' + errorThrown);
      console.log(jqXHR);
      if (
        typeof services['closeConnection'] === 'function' &&
        jqXHR.message === 'Network Error' &&
        !navigator.onLine
      ) {
        response = { state: 'unsubscribe' };
        services['closeConnection'](response);
      }
    };

    return {
      // Public methods
      registerService: registerService,
      // return the client id
      getClientID: getClientID,
      // return the unique id generated by atmosphere
      getUUID: getUUID,
      registerClient: registerClient,
      unregisterClient: unregisterClient,
      registerNotify: registerNotify,
      unregisterNotify: unregisterNotify,
      connect: connect,
      disconnect: disconnect,
      setTransports: setTransports,
      setNotificationUrl: url => {
        if (url !== '') {
          notificationUrl = url;
        }
      },
      getNotificationUrl: () => {
        return defaultNotificationUrl;
      },
      isRegistered: () => {
        return getClientID() !== '';
      },
    };
  }; // init over

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: () => {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
};
window.Rtns = Rtns();
