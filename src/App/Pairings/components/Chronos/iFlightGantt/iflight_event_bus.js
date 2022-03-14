/**
 * Implementation to emit and listen to UI events
 */
'use strict';
import { iFlightRxjs } from './iflight_reactive_extensions.js';

const { multicast, refCount } = iFlightRxjs.operators;
const eventSource = new iFlightRxjs.Subject();
const eventListener = new iFlightRxjs.Subject();
const eventListenerRegistry = eventSource.pipe(
  multicast(eventListener),
  refCount()
);

/**
				PageId to iFlight eventbus mapping format is as follows.
				{
					'<pageId>':{'<eventName>' : [<eventListenerRegistrySubscriptionObj1>,<eventListenerRegistrySubscriptionObj2>]}
				}

				eg: {
						'W1':{ 'RTU' : [<eventListenerRegistrySubscriptionObj>], 'iFlightHotKey' : <eventListenerRegistrySubscriptionObj> },
						'W2':{ 'RTU' : [<eventListenerRegistrySubscriptionObj1>, <eventListenerRegistrySubscriptionObj2>]}
					}

			 */
let pageIdToEvntLstrMapping = {};

/**
				Defining multicast(pub-sub model) event bus
			 */
const iFlightMCastEventBus = {
  emitEvent: function(eventName, args) {
    eventSource.next({ eventName, args });
  },

  onEvent: function(eventName, elementDetails, listenerFunction) {
    //TODO console.log('Subscribing for eventname in bus ' + eventName, elementDetails);
    let subscription = eventListenerRegistry.subscribe({
      next: eventData => {
        try {
          if (eventData.eventName == eventName) {
            listenerFunction(eventData.eventName, eventData.args);
          }
        } catch (error) {
          console.error(error);
        }
      },
    });

    addToEvntLstrMapping(elementDetails.pageid, eventName, subscription);
    if (typeof elementDetails.$on === 'function') {
      elementDetails.$on('$destroy', function() {
        if (!subscription.closed) {
          subscription.unsubscribe();
        }
      });
    }
    return onEventCallback;
  },
};

/**
				Adds the event subscribtion against the pageid and event name
			 */
const addToEvntLstrMapping = function(pageId, eventName, subscription) {
  //Add to pageIdToEvntLstrMapping variable
  let pageEvntSubscriptions = pageIdToEvntLstrMapping[pageId];
  if (typeof pageEvntSubscriptions === 'undefined') {
    pageEvntSubscriptions = {};
    pageEvntSubscriptions[eventName] = [subscription];
  } else {
    if (typeof pageEvntSubscriptions[eventName] === 'undefined') {
      pageEvntSubscriptions[eventName] = [];
    }
    pageEvntSubscriptions[eventName].push(subscription);
  }

  pageIdToEvntLstrMapping[pageId] = pageEvntSubscriptions;
};

const cleanUpEventBusRegistrationsForPage = function(removedPageIds) {
  let eventSubscriptionsForPage;
  let subscriptionObjToUnsubscribe;

  for (let idx = 0; idx < removedPageIds.length; idx++) {
    eventSubscriptionsForPage = pageIdToEvntLstrMapping[removedPageIds[idx]];
    if (typeof eventSubscriptionsForPage !== 'undefined') {
      Object.keys(eventSubscriptionsForPage).forEach(eventName => {
        for (
          let idx = 0;
          idx < eventSubscriptionsForPage[eventName].length;
          idx++
        ) {
          subscriptionObjToUnsubscribe =
            eventSubscriptionsForPage[eventName][idx];
          if (!subscriptionObjToUnsubscribe.closed) {
            subscriptionObjToUnsubscribe.unsubscribe();
          }
          //TODO console.log('UnSubscribing for eventname in bus ' + eventName);
        }
      });
    }

    delete pageIdToEvntLstrMapping[removedPageIds[idx]];
  }
};

const onEventCallback = function() {
  //Do nothing
};

export const iFlightEventBus = {
  onEvent: iFlightMCastEventBus.onEvent,
  emitEvent: iFlightMCastEventBus.emitEvent,
  removeEventBusRegistrationsForPage: cleanUpEventBusRegistrationsForPage,
};
