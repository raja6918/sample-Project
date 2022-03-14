import { GENERAL } from '../constants';
import * as notificationService from '../services/Notifications';

export const notificationIncrement = payload => ({
  type: GENERAL.NOTIFICATION_INCREMENT,
  payload,
});

export const notificationDecrement = payload => ({
  type: GENERAL.NOTIFICATION_RESET,
  payload,
});
export const addNotificationsToStore = payload => ({
  type: GENERAL.NOTIFICATION_SUCCESS,
  payload,
});

export const viewedAllStatus = () => ({
  type: GENERAL.VIEWED_ALL_NOTIFICATION,
});
export const notificationCleanUp = () => ({
  type: GENERAL.NOTIFICATION_CLEANUP,
});

export const closeNotificationBar = bool => ({
  type: GENERAL.NOTIFICATION_BAR_CLOSE,
  bool,
});

export const addNewNotificationToStore = payload => ({
  type: GENERAL.NOTIFICATION_ADD,
  payload,
});

export const fetchingNotification = bool => ({
  type: GENERAL.NOTIFICATION_FETCHING,
  bool,
});

export const deleteSingleNotification = notificationId => ({
  type: GENERAL.NOTIFICATION_SINGLE_DELETE,
  notificationId,
});
export const deleteAllNotification = () => ({
  type: GENERAL.NOTIFICATION_ALL_DELETE,
});
export const updateNotificationAsSeen = () => ({
  type: GENERAL.NOTIFICATION_ALL_SEEN,
});
export const fetchNotifications = (userId, scroll = false) => (
  dispatch,
  getState
) => {
  const { totalSize, start, isFetching } = getState().notifications;
  let offset = GENERAL.NOTIFICATION_PAGE_SIZE;
  const newStart = scroll ? start + offset : start;
  if ((scroll && newStart >= totalSize) || isFetching) return;
  if (scroll && totalSize - newStart < offset) offset = totalSize - newStart;

  const requestPayload = {
    endIndex: offset, //offset
    startIndex: newStart,
  };
  dispatch(fetchingNotification(true));
  return notificationService
    .getNotifications(userId, requestPayload)
    .then(response => {
      const notificationPayload = response; //mockData
      dispatch(fetchingNotification(false));
      if (
        notificationPayload.totalCount &&
        Array.isArray(notificationPayload.data)
      ) {
        dispatch(addNotificationsToStore(notificationPayload));
      }
    })
    .catch(() => {
      dispatch(fetchingNotification(false));
    });
};

export const setCurrentMenu = name => ({
  type: GENERAL.SET_CURRENT_NAV_MENU,
  name,
});

//permissions
