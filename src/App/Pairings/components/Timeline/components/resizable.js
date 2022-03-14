import {
  MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED,
  MIN_TIMELINE_WINDOW_HEIGHT,
} from './../constants';

function between(a, b, value) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return min <= value && value <= max;
}

function findResizableWindows(currentIndex, timelineWindowsData) {
  const nonCollapsedWindows = timelineWindowsData.filter(
    window => !window.isCollapsed
  );
  /*
  If our current window is a collapsed one, our current window
  will be the next non-collapse window available
  */
  let calculatedCurrentWindowIndex = nonCollapsedWindows.findIndex(
    el => el.index >= currentIndex
  );
  /*
  If user close 2nd window and then resize current 2nd window (3rd timeline) then calculatedCurrentWindowIndex 
  will be -1 because currentIndex is 2 and timelineWindowsData.length is 2
  */
  if (calculatedCurrentWindowIndex === -1) {
    calculatedCurrentWindowIndex = 1;
  }
  const previousWindowIndex =
    nonCollapsedWindows[calculatedCurrentWindowIndex - 1].index;
  const currentWindowIndex =
    nonCollapsedWindows[calculatedCurrentWindowIndex].index;

  return [previousWindowIndex, currentWindowIndex];
}

function enableResizableDiv(props) {
  const { index, updateWindowsHeights } = props;
  // console.log('--> enableResizableDiv', props);

  const containerId = `pt-window-${index}`;
  const ptWindowContainer = document.getElementById(containerId);
  const resizeHandler = ptWindowContainer.querySelector('.resize-handler');

  /* Select all timeline windows */
  const timelineWindows = document.getElementsByClassName(
    'pt-window-container-js'
  );
  let _timelineWindowsData_ = null;

  let _MIN = null;
  let _MAX = null;
  let newHeights = [];

  const calculateHeights = (index, diff, timelineWindowsHeights) => {
    const newWindowsHeights = [...timelineWindowsHeights];
    // const dragMovedUp = diff > 0;

    const resizableWindowsIndexes = findResizableWindows(
      +index,
      _timelineWindowsData_
    );
    const [previousWindowIndex, currentWindowIndex] = resizableWindowsIndexes;
    const previousWindowHeight =
      timelineWindowsHeights[previousWindowIndex] - diff;
    const currentWindowHeight =
      timelineWindowsHeights[currentWindowIndex] + diff;

    const prevHeightIsValid = between(_MIN, _MAX, previousWindowHeight);
    const currHeightIsValid = between(_MIN, _MAX, currentWindowHeight);
    const bothHeightsAreValid = prevHeightIsValid && currHeightIsValid;

    if (bothHeightsAreValid) {
      newWindowsHeights[previousWindowIndex] = previousWindowHeight;
      newWindowsHeights[currentWindowIndex] = currentWindowHeight;
    } else {
      const previousWindowIsSmallerThanCurrent =
        previousWindowHeight < currentWindowHeight;
      if (previousWindowIsSmallerThanCurrent) {
        const difference = _MIN - previousWindowHeight;
        newWindowsHeights[previousWindowIndex] =
          previousWindowHeight + difference;
        newWindowsHeights[currentWindowIndex] =
          currentWindowHeight - difference;
      } else {
        const difference = _MIN - currentWindowHeight;
        newWindowsHeights[previousWindowIndex] =
          previousWindowHeight - difference;
        newWindowsHeights[currentWindowIndex] =
          currentWindowHeight + difference;
      }
    }

    return newWindowsHeights;
  };

  const resize = event => {
    const currentMouseY = event.pageY;
    const currentContainerY =
      ptWindowContainer.getBoundingClientRect().y ||
      ptWindowContainer.getBoundingClientRect().top;
    const diff = Math.trunc(currentContainerY - currentMouseY);

    if (!diff) return;

    const { index } = ptWindowContainer.dataset;

    const timelineWindowsHeights = [...timelineWindows].map(
      element => element.getBoundingClientRect().height
    );

    newHeights = calculateHeights(index, diff, timelineWindowsHeights);

    for (let i = 0; i < timelineWindows.length; i++) {
      const timelineWindow = timelineWindows[i];
      timelineWindow.style.height = `${newHeights[i]}px`; // Update height
    }
  };
  const stopResize = () => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);

    /* Update the heights of each window only after an actual update */
    if (newHeights.length) {
      updateWindowsHeights(newHeights);
    }
  };

  const startResize = event => {
    newHeights = [];
    event.preventDefault();

    _timelineWindowsData_ = [...timelineWindows].map((element, index) => ({
      index,
      isCollapsed: element.dataset.isCollapsed === 'true',
      isLastWindow: element.dataset.isLastWindow === 'true',
    }));

    const currentWindow = { ..._timelineWindowsData_[index] };

    const nonCollapsedWindows = _timelineWindowsData_.filter(
      window => !window.isCollapsed
    );
    const nonCollapsedWindowsCount = nonCollapsedWindows.length;

    /* At least 2 non-collapsed windows are required to proceed with the resize */
    if (nonCollapsedWindowsCount < 2) {
      return false;
    }

    /* If the current window is collapsed and is actual the last window, abort resizing */
    if (currentWindow.isCollapsed && currentWindow.isLastWindow) {
      return false;
    }

    let { defaultHeight } = ptWindowContainer.dataset;
    defaultHeight = +defaultHeight;

    const { totalWindows } = ptWindowContainer.dataset;

    _MIN = MIN_TIMELINE_WINDOW_HEIGHT;
    const maxDecreasedSize = defaultHeight - _MIN;
    _MAX = defaultHeight + maxDecreasedSize * (totalWindows - 1);
    const extraHeight =
      (MIN_TIMELINE_WINDOW_HEIGHT - MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED) *
      (totalWindows - nonCollapsedWindowsCount);

    _MAX += extraHeight;

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  if (resizeHandler) {
    resizeHandler.addEventListener('mousedown', startResize);
  }
}

export default enableResizableDiv;
