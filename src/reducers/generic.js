import { GENERAL } from '../constants';

const notificationState = {
  count: 0,
  temp: [],
  notifications: [],
  totalSize: 0,
  isFetching: false,
  start: 0,
  viewedAll: false,
  closeNavBar: false,
  currentNav: 'scenarios',
};
/**
 * @description - This reducer is for notification pane.
 * @param {*} state
 * @param {*} action
 */

export const genericReducer = (state = notificationState, action) => {
  switch (action.type) {
    case GENERAL.NOTIFICATION_INCREMENT: {
      return { ...state, count: state.count + action.payload };
    }
    case GENERAL.NOTIFICATION_RESET: {
      return { ...state, count: 0 };
    }
    case GENERAL.NOTIFICATION_SUCCESS: {
      return {
        ...state,
        count: action.payload.notViewedCount,
        notifications: [
          ...state.temp,
          ...state.notifications,
          ...action.payload.data,
        ],
        totalSize: action.payload.totalCount,
        isFetching: false,
        start: action.payload.startIndex + state.temp.length,
        temp: [],
      };
    }
    case GENERAL.NOTIFICATION_FETCHING: {
      return {
        ...state,
        isFetching: action.bool,
      };
    }
    case GENERAL.NOTIFICATION_ADD: {
      const newNotification = {
        ...action.payload.data,
        viewStatus: 'UNSEEN',
      };
      if (!state.isFetching) {
        const updatedNotificationData = [...state.notifications];
        updatedNotificationData.unshift(newNotification);
        return {
          ...state,
          notifications: updatedNotificationData,
          start: state.start + 1,
          totalSize: state.totalSize + 1,
        };
      } else {
        return {
          ...state,
          temp: [newNotification, ...state.temp],
        };
      }
    }
    case GENERAL.NOTIFICATION_ALL_DELETE: {
      return {
        ...state,
        notifications: [],
        totalSize: 0,
        start: 0,
        temp: [],
        count: 0,
      };
    }
    case GENERAL.NOTIFICATION_BAR_CLOSE: {
      return {
        ...state,
        closeNavBar: action.bool,
      };
    }
    case GENERAL.NOTIFICATION_SINGLE_DELETE: {
      const filteredNotificationArray = state.notifications.filter(
        notification => notification.eventId !== action.notificationId
      );
      return {
        ...state,
        notifications: filteredNotificationArray,
        totalSize: state.totalSize - 1,
      };
    }
    case GENERAL.NOTIFICATION_ALL_SEEN: {
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          viewStatus: 'SEEN',
        })),
        viewedAll: false,
      };
    }
    case GENERAL.VIEWED_ALL_NOTIFICATION: {
      return {
        ...state,
        viewedAll: true,
      };
    }
    case GENERAL.NOTIFICATION_CLEANUP: {
      return {
        ...state,
        ...notificationState,
      };
    }

    case GENERAL.SET_CURRENT_NAV_MENU: {
      return {
        ...state,
        currentNav: action.name,
      };
    }
    default:
      return state;
  }
};
