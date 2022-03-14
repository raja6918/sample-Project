import round from 'lodash/round';
import get from 'lodash/get';

import { MAX_ZOOM_IN, MAX_ZOOM_OUT, MIN_VISIBLE_DAYS } from './constants';

export const round5 = x => {
  return x % 5 >= 2.5 ? parseInt(x / 5, 10) * 5 + 5 : parseInt(x / 5, 10) * 5;
};

export const calculateVisibleDaysFromZoomStep = (zoomStep, props) => {
  const { initialTimelineVisibleDays } = props;

  if (zoomStep >= MAX_ZOOM_IN) return MIN_VISIBLE_DAYS;
  if (zoomStep === MAX_ZOOM_OUT) return initialTimelineVisibleDays;

  return round(initialTimelineVisibleDays * (1 - zoomStep));
};

export const scrollLeftFromWindow = ref => {
  return get(ref, 'current._container.scrollLeft');
};

export const calculateStartDayFromScrollPosition = props => {
  const scrollLeft = scrollLeftFromWindow(props.timelineWindowRef);

  return round(scrollLeft / props.columnWidthInPx);
};
