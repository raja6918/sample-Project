import sessionStorage from '../utils/storage';
import { PAIRING } from '../constants';
import { emitClearDataAndRefetchPaneEvent } from '../App/Pairings/components/Chronos/utils';

const saveSessionStorage = state => {
  sessionStorage.setItem('pairingStore', state);
};

const initialState = {};

export const pairingReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAIRING.SET_TIMELINE_KEYLIST: {
      const updatedState = {
        ...state,
        [action.timelineId]: {
          render: action.render,
          count: action.count,
          pairings: action.pairingsKeyList,
          legs: action.legsKeyList,
          dhi: action.internalDeadHeadList,
          cml: action.commercialDeadHeadList,
          idRowMap: {
            pairings: action.pairingsIdRowMap,
            legs: action.legsIdRowMap,
            dhi: action.internalDeadHeadIdRowMap,
            cml: action.commercialDeadHeadIdRowMap,
          },
        },
      };
      // Update Session storage
      saveSessionStorage(updatedState);
      return JSON.parse(JSON.stringify(updatedState));
    }
    case PAIRING.DELETE_TIMELINE_KEYLIST: {
      // When you reset filter in empty pane we can delete its keyList info
      delete state[action.timelineId];
      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    case PAIRING.UPDATE_TIMELINE_KEYS: {
      const timelineData = state[action.timelineId];
      if (timelineData) {
        for (const item of action.items) {
          const id = item.id;
          const render = item.render;

          const idRowMapRender = timelineData.idRowMap[render];
          let prevPosition;
          if (idRowMapRender) {
            prevPosition = idRowMapRender[id];
            // Update idRowMap
            idRowMapRender[id] = action.rowId;
          }

          // Remove id from previous row
          if (
            prevPosition &&
            Array.isArray(timelineData[render][prevPosition - 1])
          ) {
            timelineData[render][prevPosition - 1] = timelineData[render][
              prevPosition - 1
            ].filter(id => id !== item.id);
          }

          // Add id to new row
          if (Array.isArray(timelineData[render][action.rowId - 1])) {
            timelineData[render][action.rowId - 1].push(item.id);
          }
        }
      }
      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    case PAIRING.REMOVE_TIMELINE_KEYS: {
      const timelineData = state[action.timelineId];
      if (timelineData) {
        for (const item of action.items) {
          const id = item.id;
          const render = item.render;

          const idRowMapRender = timelineData.idRowMap[render];
          let prevPosition;
          if (idRowMapRender) {
            prevPosition = idRowMapRender[id];
            // Delete idRowMap for that id
            delete idRowMapRender[id];
          }

          // Remove id from previous row
          if (
            prevPosition &&
            Array.isArray(timelineData[render][prevPosition - 1])
          ) {
            timelineData[render][prevPosition - 1] = timelineData[render][
              prevPosition - 1
            ].filter(id => id !== item.id);
          }
        }
      }
      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    case PAIRING.SET_ALL_TIMELINE_KEYLIST: {
      return action.data;
    }
    case PAIRING.REMOVE_KEYS: {
      const timelineIdsSet = new Set();
      for (let i = 1; i <= 3; i++) {
        const timelineData = state[i];
        if (timelineData) {
          for (const item of action.items) {
            const id = item.id;
            const render = item.render;

            const idRowMapRender = timelineData.idRowMap[render];
            let prevPosition;
            if (idRowMapRender) {
              // flights are only needed to removed from current timeline
              if (render !== 'pairings' && i !== action.timelineId) {
                // eslint-disable-next-line no-continue
                continue;
              }
              prevPosition = idRowMapRender[id];
              // Delete idRowMap for that id
              delete idRowMapRender[id];
            }

            // Add timeline that that id to set
            if (prevPosition) {
              timelineIdsSet.add(i);
            }

            // Remove id from previous row
            if (
              prevPosition &&
              Array.isArray(timelineData[render][prevPosition - 1])
            ) {
              timelineData[render][prevPosition - 1] = timelineData[render][
                prevPosition - 1
              ].filter(id => id !== item.id);
            }
          }
        }
      }

      // Call emitClearDataAndRefetchPaneEvent to refetch everything in required panes
      if (action.allTimeline) {
        emitClearDataAndRefetchPaneEvent([1, 2, 3]);
      } else {
        emitClearDataAndRefetchPaneEvent([...timelineIdsSet]);
      }

      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    case PAIRING.CHANGE_LEGS_TO_DEADHEADS: {
      const timelineData = state[action.timelineId];
      if (timelineData) {
        for (const legId of action.legIds) {
          const legIdRowMapRender = timelineData.idRowMap['legs'];
          const dhiIdRowMapRender = timelineData.idRowMap['dhi'];
          let prevPosition;
          if (legIdRowMapRender) {
            prevPosition = legIdRowMapRender[legId];
            // Delete idRowMap from leg
            delete legIdRowMapRender[legId];
            // Insert it into idRowMap of dhi
            dhiIdRowMapRender[legId] = prevPosition;
          }
          // Remove legId from legs
          if (
            prevPosition &&
            Array.isArray(timelineData['legs'][prevPosition - 1])
          ) {
            timelineData['legs'][prevPosition - 1] = timelineData['legs'][
              prevPosition - 1
            ].filter(id => id !== legId);
          }
          // Add legId to dhi
          if (Array.isArray(timelineData['dhi'][prevPosition - 1])) {
            timelineData['dhi'][prevPosition - 1].push(legId);
          }
        }
      }
      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    case PAIRING.CHANGE_DEADHEADS_TO_LEGS: {
      const timelineData = state[action.timelineId];
      if (timelineData) {
        for (const dhiId of action.dhiIds) {
          const legIdRowMapRender = timelineData.idRowMap['legs'];
          const dhiIdRowMapRender = timelineData.idRowMap['dhi'];
          let prevPosition;
          if (dhiIdRowMapRender) {
            prevPosition = dhiIdRowMapRender[dhiId];
            // Delete idRowMap from dhi
            delete dhiIdRowMapRender[dhiId];
            // Insert it into idRowMap of legs
            legIdRowMapRender[dhiId] = prevPosition;
          }
          // Remove dhiId from dhi
          if (
            prevPosition &&
            Array.isArray(timelineData['dhi'][prevPosition - 1])
          ) {
            timelineData['dhi'][prevPosition - 1] = timelineData['dhi'][
              prevPosition - 1
            ].filter(id => id !== dhiId);
          }
          // Add dhiId to legs
          if (Array.isArray(timelineData['legs'][prevPosition - 1])) {
            timelineData['legs'][prevPosition - 1].push(dhiId);
          }
        }
      }
      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    case PAIRING.RESET_TIMELINE_KEYS: {
      return { ...initialState };
    }
    case PAIRING.BULK_UPDATE_TIMELINE_KEYS: {
      const timelineData = state[action.timelineId];
      if (timelineData) {
        for (const item of action.items) {
          const id = item.id;
          const render = item.render;

          const idRowMapRender = timelineData.idRowMap[render];
          let prevPosition;
          if (idRowMapRender) {
            prevPosition = idRowMapRender[id];
            // Update idRowMap
            idRowMapRender[id] = item.rowId;
          }

          // Remove id from previous row
          if (
            prevPosition &&
            Array.isArray(timelineData[render][prevPosition - 1])
          ) {
            timelineData[render][prevPosition - 1] = timelineData[render][
              prevPosition - 1
            ].filter(id => id !== item.id);
          }

          // Add id to new row
          if (Array.isArray(timelineData[render][item.rowId - 1])) {
            timelineData[render][item.rowId - 1].push(item.id);
          }
        }
      }
      // Update Session storage
      saveSessionStorage(state);
      return JSON.parse(JSON.stringify(state));
    }
    default:
      return state;
  }
};
