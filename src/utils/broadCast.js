import { pull } from 'lodash';
import BroadcastChannel from './broadcast-channel';
import storage, { localStorage } from './storage';
import { DEBUG_MODE } from '../_shared/constants';
import scenarioService from '../services/Scenarios/index';
import { currentScenario } from '../utils/common';
import store from '../store';
import { resetTimeline } from '../actions/pairings';

export const previewChannel = new BroadcastChannel('previewChannel');

previewChannel.onmessage = ev => {
  if (ev.data.title === 'GET_ID') {
    if (DEBUG_MODE) {
      // eslint-disable-next-line
      console.log('GET_ID BroadcastChennel is fired ', ev);
    }
    const browserSessionId = storage.getItem('browserSessionId');
    if (browserSessionId) {
      previewChannel.postMessage({ title: 'POST_ID', data: browserSessionId });
    }
  }

  if (ev.data.title === 'POST_ID') {
    if (DEBUG_MODE) {
      // eslint-disable-next-line
      console.log('POST_ID BroadcastChennel is fired ', ev);
    }
    const browserSessionId = storage.getItem('browserSessionId');
    if (!browserSessionId) {
      storage.setItem('browserSessionId', ev.data.data);
    }
  }

  if (ev.data.title === 'DELETE_ID') {
    if (DEBUG_MODE) {
      // eslint-disable-next-line
      console.log('DELETE_ID BroadcastChennel is fired ', ev);
    }
    const previewId = ev.data.data;
    const userId = sessionStorage.getItem('loggedUser')
      ? sessionStorage.getItem('loggedUser').id
      : '';

    setTimeout(async () => {
      const openPreview = storage.getItem('openPreview');
      const openPreviews = localStorage.getItem('openPreviews');

      const filteredPreviews = openPreviews.filter(preview =>
        preview ? preview.previewId === parseInt(previewId, 10) : false
      );

      if (filteredPreviews.length === 0 && !openPreview) {
        // call delete scenario API
        try {
          await scenarioService.deletePreview(
            parseInt(previewId, 10),
            userId,
            true
          );
          // Remove id from deletedPreviews if it is success - to handle token expiry situation
          const deletedPreviews = localStorage.getItem('deletedPreviews') || [];
          pull(deletedPreviews, previewId);
          localStorage.setItem('deletedPreviews', deletedPreviews);
        } catch (error) {
          console.error(error);
        }
      }
    }, 60000); // 60 secound delay to consider slow 3G speed
  }

  // We need to remove old pairingStore of parent scenario if preview is saved to avoid 404 error
  if (ev.data.title === 'PREVIEW_SAVED') {
    if (DEBUG_MODE) {
      // eslint-disable-next-line
      console.log('PREVIEW_SAVED BroadcastChennel is fired ', ev);
    }
    const scenario = currentScenario();
    if (scenario && scenario.id === ev.data.scenarioId) {
      storage.removeItem('pairingStore');
      store.dispatch(resetTimeline());
    }
  }
};
