import { PAIRING } from '../constants';

export const setTimelineKeyList = (
  timelineId,
  render,
  pairingsKeyList,
  legsKeyList,
  pairingsIdRowMap,
  legsIdRowMap,
  count,
  internalDeadHeadList,
  internalDeadHeadIdRowMap,
  commercialDeadHeadList,
  commercialDeadHeadIdRowMap
) => ({
  type: PAIRING.SET_TIMELINE_KEYLIST,
  timelineId,
  render,
  pairingsKeyList,
  legsKeyList,
  pairingsIdRowMap,
  legsIdRowMap,
  count,
  internalDeadHeadList,
  internalDeadHeadIdRowMap,
  commercialDeadHeadList,
  commercialDeadHeadIdRowMap,
});

export const deleteTimelineKeyList = timelineId => ({
  type: PAIRING.DELETE_TIMELINE_KEYLIST,
  timelineId,
});

export const updateTimelineKeys = (timelineId, rowId, items) => ({
  type: PAIRING.UPDATE_TIMELINE_KEYS,
  timelineId,
  rowId,
  items,
});

export const removeTimelineKeys = (timelineId, items) => ({
  type: PAIRING.REMOVE_TIMELINE_KEYS,
  timelineId,
  items,
});

export const setAllTimelineKeyList = data => ({
  type: PAIRING.SET_ALL_TIMELINE_KEYLIST,
  data,
});

export const removeKeys = (items, timelineId, allTimeline = false) => ({
  type: PAIRING.REMOVE_KEYS,
  items,
  timelineId,
  allTimeline,
});

export const changeLegsToDeadheads = (timelineId, legIds) => ({
  type: PAIRING.CHANGE_LEGS_TO_DEADHEADS,
  timelineId,
  legIds,
});

export const changeDeadheadsToLegs = (timelineId, dhiIds) => ({
  type: PAIRING.CHANGE_DEADHEADS_TO_LEGS,
  timelineId,
  dhiIds,
});

export const resetTimeline = () => ({
  type: PAIRING.RESET_TIMELINE_KEYS,
});

export const bulkUpdateTimelineKeys = (timelineId, items) => ({
  type: PAIRING.BULK_UPDATE_TIMELINE_KEYS,
  timelineId,
  items,
});
