import { MAX_PERIOD_DAYS, CARRY_IN_DAYS, CARRY_OUT_DAYS } from './constants';

const MAX_DAYS = MAX_PERIOD_DAYS + CARRY_IN_DAYS + CARRY_OUT_DAYS;

export function cancelZoomSelection(e, className) {
  const event = e.target || e.srcElement;
  /*Prevents bug in Firefox -  Node type must be 1 (Element)*/
  if (event.nodeType !== 1 || this.state.selectionStartDay === null) {
    return;
  }

  if (
    event.closest(`.${className}`) === null &&
    this.state.selectionStartDay !== null
  ) {
    this.setState({
      selectionStartDay: null,
      hoverHighlight: false,
      isTooltipOpen: false,
    });
  }
}
export const clearFocused = className => {
  const focusedNodes = document.querySelectorAll(`.${className}.focused`);
  for (let i = 0; i < focusedNodes.length; i++) {
    focusedNodes[i].classList.remove('focused');
  }
};
export const onMouseOut = (selectionEndDay, className) => {
  if (selectionEndDay === null) {
    clearFocused(className);
  }
};
export function onHoverHighlight(e, nodeItems, className, attribute) {
  const setFocus = finalDayId => {
    const initialDayId = this.state.selectionStartDay;
    let dayId = null;
    for (let i = 0; i < nodeItems.length; i++) {
      dayId = nodeItems[i].getAttribute(attribute);
      if (
        (dayId >= initialDayId && dayId <= finalDayId) ||
        (dayId <= initialDayId && dayId >= finalDayId)
      ) {
        nodeItems[i].classList.add('focused');
      }
    }
  };

  const event = e.target || e.srcElement;
  let nodeId = null;
  let node = null;
  if (this.state.hoverHighlight) {
    const isTheFather = event.classList.contains(className);
    if (isTheFather) {
      node = event;
    } else {
      node = event.closest(`.${className}`);
    }
    nodeId = node.getAttribute(attribute);
    clearFocused(className);
    setFocus(parseInt(nodeId, 10));
  }
}
export function zoomReady(className) {
  const { selectionStartDay, selectionEndDay } = this.state;
  const zoomStartDay =
    selectionStartDay < selectionEndDay ? selectionStartDay : selectionEndDay;
  const zoomEndDay =
    zoomStartDay === selectionStartDay ? selectionEndDay : selectionStartDay;

  if (zoomEndDay - zoomStartDay + 1 > MAX_DAYS) {
    this.setState({
      openSnackBar: true,
      selectionStartDay: null,
      selectionEndDay: null,
      hoverHighlight: false,
      isTooltipOpen: false,
    });
    clearFocused(className);
  } else {
    this.setState({
      selectionStartDay: null,
      selectionEndDay: null,
      hoverHighlight: false,
      isTooltipOpen: false,
    });
    clearFocused(className);
    this.props.onZoomSelection(zoomStartDay, zoomEndDay);
  }
}

export function onZoomSelection(dayIndex, className) {
  const { selectionStartDay, selectionEndDay } = this.state;
  if (selectionStartDay === null && selectionEndDay === null) {
    this.setState({
      selectionStartDay: dayIndex,
      hoverHighlight: true,
    });
  } else if (selectionStartDay !== null && selectionEndDay === null) {
    this.setState(
      {
        selectionEndDay: dayIndex,
        hoverHighlight: false,
      },
      zoomReady.bind(this, className)
    );
  } else {
    this.setState(
      {
        selectionStartDay: dayIndex,
        selectionEndDay: null,
        hoverHighlight: true,
      },
      clearFocused(className)
    );
  }
}
