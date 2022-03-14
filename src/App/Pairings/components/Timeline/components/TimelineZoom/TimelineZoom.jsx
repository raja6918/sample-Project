import React, { Component } from 'react';
import PropTypes from 'prop-types';
import round from 'lodash/round';
import debounce from 'lodash/debounce';

import IconButton from '@material-ui/core/IconButton';

import ZoomSlider from './ZoomSlider';

import ZoomMaxInIcon from '../../icons/ZoomMaxInIcon';
import ZoomMaxOutIcon from '../../icons/ZoomMaxOutIcon';
import ZoomOutIcon from '../../icons/ZoomOutIcon';

import {
  ZOOM_PATH,
  MAX_ZOOM_OUT,
  MAX_ZOOM_IN,
  MIN_VISIBLE_DAYS,
  ZOOM_BTN_STEP,
} from './constants';

import {
  round5,
  calculateVisibleDaysFromZoomStep,
  calculateStartDayFromScrollPosition,
} from './helpers';
import SierraMuiTooltip from '../../../../../../_shared/components/SierraMuiTooltip/SierraMuiTooltip';

class TimelineZoom extends Component {
  state = {
    isSliderOpen: false,
    zoomStep: 0,
  };

  timelineVisibleDays = 0;

  componentWillReceiveProps(nextProps) {
    const { timelineVisibleDays } = nextProps;

    const didVisibleDaysChange =
      this.props.timelineVisibleDays !== timelineVisibleDays;
    const didItChangeFromHeaderZoom =
      this.timelineVisibleDays !== timelineVisibleDays;

    if (didVisibleDaysChange && didItChangeFromHeaderZoom) {
      this.timelineVisibleDays = timelineVisibleDays;
      const zoomStep = this.getZoomStep(nextProps);

      this.setState({
        zoomStep,
      });
    }
  }

  getZoomStep = props => {
    const { timelineVisibleDays, initialTimelineVisibleDays } = props;

    if (timelineVisibleDays === initialTimelineVisibleDays) return MAX_ZOOM_OUT;
    if (timelineVisibleDays === MIN_VISIBLE_DAYS) return MAX_ZOOM_IN;

    const zoomStep = 1 - timelineVisibleDays / initialTimelineVisibleDays;

    return round5(round(zoomStep, 2) * 100) / 100;
  };

  openSlider = () => {
    this.setState({ isSliderOpen: true });
  };

  hideSlider = () => {
    this.setState({ isSliderOpen: false });
  };

  onSliderZoomChange = (event, zoomStep) => {
    this.setState({ zoomStep }, () => this.onDelayedZoom(zoomStep));
  };

  getTooltipTitle = () => {
    if (this.state.isSliderOpen) {
      return (
        <span className="action-link" onClick={this.hideSlider}>
          {this.props.t(`${ZOOM_PATH}.hideSlider`)}
        </span>
      );
    }

    return (
      <span className="action-link" onClick={this.openSlider}>
        {this.props.t(`${ZOOM_PATH}.openSlider`)}
      </span>
    );
  };

  buildTooltipClasses = popperClasses => {
    return {
      tooltip: 'zoom-tooltip',
      popper: `zoom-popper ${popperClasses}`,
    };
  };

  zoomIn = step => {
    let { zoomStep } = this.state;

    if (zoomStep >= MAX_ZOOM_IN) return;

    zoomStep = Math.min(round(zoomStep + step, 2), MAX_ZOOM_IN);

    this.setState({ zoomStep }, () => this.onDelayedZoom(zoomStep));
  };

  zoomOut = step => {
    let { zoomStep } = this.state;

    if (zoomStep <= MAX_ZOOM_OUT) return;

    zoomStep = Math.max(round(zoomStep - step, 2), MAX_ZOOM_OUT);

    this.setState({ zoomStep }, () => this.onDelayedZoom(zoomStep));
  };

  onZoom = zoomStep => {
    const onParentZoom =
      zoomStep === MAX_ZOOM_OUT
        ? this.props.onZoomOut
        : this.props.onZoomSelection;

    const { timelineVisibleDays } = this.props;
    const startDay = calculateStartDayFromScrollPosition(this.props);

    const newTimelineVisibleDays = calculateVisibleDaysFromZoomStep(
      zoomStep,
      this.props
    );

    this.timelineVisibleDays = newTimelineVisibleDays;

    let newStartDay =
      startDay + timelineVisibleDays / 2 - newTimelineVisibleDays / 2;
    newStartDay = Math.max(newStartDay, 0);
    const newEndDay = newStartDay + newTimelineVisibleDays - 1;

    const roundedNewStartDay = round(newStartDay);
    const roundedNewEndDay = round(newEndDay);

    onParentZoom(roundedNewStartDay, roundedNewEndDay);
  };

  onDelayedZoom = debounce(this.onZoom, 150);

  render() {
    const { isSliderOpen, zoomStep } = this.state;

    const title = this.getTooltipTitle();
    const commonTooltipProps = {
      title,
      interactive: true,
      arrow: true,
      placement: 'top',
    };

    const didZoomMaxOutReached = zoomStep === MAX_ZOOM_OUT;
    const didZoomMaxInReached = zoomStep === MAX_ZOOM_IN;

    const commonZoomOutProps = {
      disabled: didZoomMaxOutReached,
      classes: { label: 'btn-label' },
      className: 'action-btn',
    };

    const commonZoomInProps = {
      disabled: didZoomMaxInReached,
      classes: { label: 'btn-label' },
      className: 'action-btn',
    };

    const zoomInColor = didZoomMaxInReached ? 'rgba(0,0,0,0.15)' : '#7E7E7E';
    const zoomOutColor = didZoomMaxOutReached ? 'rgba(0,0,0,0.15)' : '#7E7E7E';

    return (
      <div className="timeline-zoom">
        <span className="btn-container">
          <IconButton
            onClick={() => this.zoomOut(MAX_ZOOM_IN)}
            {...commonZoomOutProps}
          >
            <ZoomMaxOutIcon className="material-icons" fill={zoomOutColor} />
          </IconButton>
        </span>
        <SierraMuiTooltip
          {...commonTooltipProps}
          classes={this.buildTooltipClasses('left')}
        >
          <span className="btn-container">
            <IconButton
              onClick={() => this.zoomOut(ZOOM_BTN_STEP)}
              {...commonZoomOutProps}
            >
              <ZoomOutIcon className="material-icons" fill={zoomOutColor} />
            </IconButton>
          </span>
        </SierraMuiTooltip>
        {isSliderOpen && (
          <ZoomSlider
            onChange={this.onSliderZoomChange}
            value={zoomStep}
            onDragEnd={() => this.onZoom(zoomStep)}
          />
        )}
        <SierraMuiTooltip
          {...commonTooltipProps}
          classes={this.buildTooltipClasses('right')}
        >
          <span className="btn-container">
            <IconButton
              onClick={() => this.zoomIn(ZOOM_BTN_STEP)}
              {...commonZoomInProps}
            >
              <i className="material-icons"> loupe </i>
            </IconButton>
          </span>
        </SierraMuiTooltip>
        <span className="btn-container">
          <IconButton
            className="action-btn"
            onClick={() => this.zoomIn(MAX_ZOOM_IN)}
            {...commonZoomInProps}
          >
            <ZoomMaxInIcon className="material-icons" fill={zoomInColor} />
          </IconButton>
        </span>
      </div>
    );
  }
}

TimelineZoom.propTypes = {
  t: PropTypes.func.isRequired,
  onZoomSelection: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  timelineWindowRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  columnWidthInPx: PropTypes.number.isRequired,
  timelineVisibleDays: PropTypes.number.isRequired,
  totalTimelineDurationDays: PropTypes.number.isRequired,
  initialTimelineVisibleDays: PropTypes.number.isRequired,
};

export default TimelineZoom;
