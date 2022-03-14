/**
  A simple BroadcastChannel polyfill that works with all major browsers.
  @see <a href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API">Broadcast Channel API on MDN</a>
 */

// Internal variables
let _channels = null; // List of channels
let _tabId = null; // Current window browser tab identifier (see IE problem, later)
const _prefix = 'polyBC_'; // prefix to identify localStorage keys.

/**
 * Internal function, generates pseudo-random strings.
 * @see http://stackoverflow.com/a/1349426/2187738
 * @private
 */
function getRandomString(length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < (length || 5); i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Check if an object is empty.
 * @see http://stackoverflow.com/a/679937/2187738
 * @private
 */
function isEmpty(obj) {
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
  // Also this is good.
  // returns 0 if empty or an integer > 0 if non-empty
  //return Object.keys(obj).length;
}

/**
 * Gets the current timestamp
 * @private
 */
function getTimestamp() {
  return new Date().getTime();
}

/**
 * Build a "similar" response as done in the real BroadcastChannel API
 */
function buildResponse(data) {
  return {
    timestamp: getTimestamp(),
    isTrusted: true,
    target: null, // Since we are using JSON stringify, we cannot pass references.
    currentTarget: null,
    data: data,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    lastEventId: '',
    origin: window.location.origin,
  };
}

/**
 * Creates a new BroadcastChannel
 * @param {String} channelName - the channel name.
 * return {BroadcastChannel}
 */
function BroadcastChannel(channelName) {
  // Check if localStorage is available.
  if (!window.localStorage) {
    throw new 'localStorage not available'();
  }

  // Add custom prefix to Channel Name.
  const _channelId = _prefix + channelName;
  const isFirstChannel = _channels === null;

  this.channelId = _channelId;

  _tabId = _tabId || getRandomString(); // Creates a new tab identifier, if necessary.
  _channels = _channels || {}; // Initializes channels, if necessary.
  _channels[_channelId] = _channels[_channelId] || [];

  // Adds the current Broadcast Channel.
  _channels[_channelId].push(this);

  // Creates a sufficiently random name for the current instance of BC.
  this.name = _channelId + '::::' + getRandomString() + getTimestamp();

  // If it is the first instance of Channel created, also creates the storage listener.
  if (isFirstChannel) {
    // addEventListener.
    // eslint-disable-next-line no-use-before-define
    window.addEventListener('storage', _onmsg.bind(this), false);
  }

  return this;
}

/**
 * Empty function to prevent errors when calling onmessage.
 */
// eslint-disable-next-line func-names
BroadcastChannel.prototype.onmessage = function(ev) {};

/**
 * Sends the message to different channels.
 * @param {Object} data - the data to be sent ( actually, it can be any JS type ).
 */
// eslint-disable-next-line func-names
BroadcastChannel.prototype.postMessage = function(data) {
  // Gets all the 'Same tab' channels available.
  if (!_channels) return;

  if (this.closed) {
    throw new 'This BroadcastChannel is closed.'();
  }

  // Build the event-like response.
  const msgObj = buildResponse(data);

  // SAME-TAB communication.
  const subscribers = _channels[this.channelId] || [];
  for (const j in subscribers) {
    // We don't send the message to ourselves.
    // eslint-disable-next-line no-continue
    if (subscribers[j].closed || subscribers[j].name === this.name) continue;

    if (subscribers[j].onmessage) {
      subscribers[j].onmessage(msgObj);
    }
  }

  // CROSS-TAB communication.
  // Adds some properties to communicate among the tabs.
  const editedObj = {
    channelId: this.channelId,
    bcId: this.name,
    tabId: _tabId,
    message: msgObj,
  };
  let lsKey;
  try {
    const editedJSON = JSON.stringify(editedObj);
    lsKey = 'eomBCmessage_' + getRandomString() + '_' + this.channelId;
    // Set localStorage item (and, after that, removes it).
    window.localStorage.setItem(lsKey, editedJSON);
  } catch (ex) {
    throw new 'Message conversion has resulted in an error.'();
  }

  // eslint-disable-next-line func-names
  setTimeout(function() {
    // eslint-disable-next-line no-undef
    window.localStorage.removeItem(lsKey);
  }, 1000);
};

/**
 * Handler of the 'storage' function.
 * Called when another window has sent a message.
 * @param {Object} ev - the message.
 * @private
 */
function _onmsg(ev) {
  const key = ev.key;
  const newValue = ev.newValue;
  const isRemoved = !newValue;
  let obj = null;

  // Actually checks if the messages if from us.
  if (key.indexOf('eomBCmessage_') > -1 && !isRemoved) {
    try {
      obj = JSON.parse(newValue);
    } catch (ex) {
      throw new 'Message conversion has resulted in an error.'();
    }

    // NOTE: Check on tab is done to prevent IE error
    // (localStorage event is called even in the same tab :( )

    if (
      obj.tabId !== _tabId &&
      obj.channelId &&
      _channels &&
      _channels[obj.channelId]
    ) {
      const subscribers = _channels[obj.channelId];
      for (const j in subscribers) {
        if (!subscribers[j].closed && subscribers[j].onmessage) {
          subscribers[j].onmessage(obj.message);
        }
      }
      // Remove the item for safety.
      window.localStorage.removeItem(key);
    }
  }
}

/**
 * Closes a Broadcast channel.
 */

// eslint-disable-next-line func-names
BroadcastChannel.prototype.close = function() {
  this.closed = true;

  const index = _channels[this.channelId].indexOf(this);
  if (index > -1) _channels[this.channelId].splice(index, 1);

  // If we have no channels, remove the listener.
  if (!_channels[this.channelId].length) {
    delete _channels[this.channelId];
  }
  if (isEmpty(_channels)) {
    window.removeEventListener('storage', _onmsg.bind(this));
  }
};

// Sets BroadcastChannel, if not available.
const broadcastChannel = window.BroadcastChannel || BroadcastChannel;

export default broadcastChannel;
