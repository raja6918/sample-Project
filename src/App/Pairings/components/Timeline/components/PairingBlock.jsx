import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { transformDuration } from '../helpers';
import {
  COLORS,
  DEFAULT_COLOR,
  MIN_WIDTH_TO_RENDER_LABELS,
} from '../constants';
import { PairingLabels } from './';
import PairingTooltip from './PairingTooltip';
import { getAlertColor } from '../../OnlineValidation/helpers';
import { ArrowLeftIcon } from '../../OnlineValidation/icons';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

class PairingBlock extends Component {
  alertBorderRef = createRef();

  componentDidUpdate() {
    this.showAlertArrow();
  }

  showAlertArrow = () => {
    try {
      if (this.alertBorderRef.current) {
        const rect = this.alertBorderRef.current.getBoundingClientRect();
        // Move non visible left side alert label to visible left side
        if (rect.left + rect.width < 0) {
          this.alertBorderRef.current.style.transform =
            'translate(' + Math.abs(rect.left) + 'px)';
          this.alertBorderRef.current.style.width = '50px';
          this.alertBorderRef.current.childNodes[0].childNodes[0].style.display =
            'block';
        }
        // Move non visible right side alert label to visible right side
        if (rect.left > window.innerWidth) {
          const translateLeft = rect.left - window.innerWidth + 50;
          this.alertBorderRef.current.style.transform =
            'translate(' + translateLeft * -1 + 'px)';
          this.alertBorderRef.current.style.width = '50px';
          this.alertBorderRef.current.childNodes[0].childNodes[1].style.display =
            'block';
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  generateBlockActivities = () => {
    const {
      t,
      activity,
      hourWidthInPx,
      isPairingSelected,
      renderTooltips,
      alertSelected,
    } = this.props;

    const hasActivities = activity && activity.activities;
    const commonProps = {
      t,
    };
    const shouldRenderTooltips = renderTooltips && !isPairingSelected;

    if (!hasActivities) {
      return (
        <React.Fragment>
          {shouldRenderTooltips && (
            <PairingTooltip activity={activity} {...commonProps}>
              <span className="tooltip-area" />
            </PairingTooltip>
          )}
          <PairingLabels t={t} activity={activity} />
        </React.Fragment>
      );
    }

    return activity.activities.map((activity, idx) => {
      const { duration } = activity;
      let { type } = activity;
      let width = transformDuration(duration) * hourWidthInPx;

      if (activity.aircraftChange) {
        type = `${type}_AIRCRAFTCHANGE`;
      }

      /*
      We need to round the activity width to avoid an issue in Chrome
      which shows a white line when rendering a subpixel
      */
      width = Math.ceil(width);
      const renderLabels = width >= MIN_WIDTH_TO_RENDER_LABELS;
      const style = {
        width,
        background: COLORS[type] || DEFAULT_COLOR,
      };

      let borderAlertStyle;
      if (
        type === 'FLT' &&
        alertSelected &&
        activity.flightNumber === alertSelected.flightNumber
      ) {
        const background = getAlertColor(alertSelected.alertType);
        borderAlertStyle = {
          background,
          width,
        };
      }

      return (
        <Fragment key={idx}>
          {renderLabels &&
            borderAlertStyle && (
              <span
                ref={this.alertBorderRef}
                className="alert-icon-outer-container"
                style={borderAlertStyle}
              >
                <span className="alert-icon-inner-container">
                  <ArrowLeftIcon
                    height="8px"
                    width="16px"
                    style={{ display: 'none' }}
                  />
                  <ArrowRightAltIcon style={{ display: 'none' }} />
                </span>
              </span>
            )}
          <span
            key={`activity-${idx}`}
            className="pairing-activity"
            style={style}
            onClick={() => {}}
          >
            {shouldRenderTooltips && (
              <PairingTooltip
                key={`tooltip-activity-${idx}`}
                activity={activity}
                open
                {...commonProps}
              >
                <span className="tooltip-area" />
              </PairingTooltip>
            )}
            {renderLabels && <PairingLabels t={t} activity={activity} />}
          </span>
        </Fragment>
      );
    });
  };

  render() {
    const { activity, hourWidthInPx } = this.props;
    const duration = transformDuration(activity.duration) || 0;
    const className = classNames({
      'pairing-block': true,
      'no-activities': !activity.activities,
    });

    const pairingWidth = duration * hourWidthInPx;
    const blockContainerStyles = {
      width: pairingWidth > 1 ? pairingWidth : 1,
    };

    /*
      When a block comes without activities, the block itself must have the background
      matched with the activity type
    */
    if (!activity.activities) {
      blockContainerStyles.background = COLORS[activity.type] || DEFAULT_COLOR;
      blockContainerStyles.textAlign = 'center';
    }

    return (
      <span className={className} style={blockContainerStyles}>
        {this.generateBlockActivities()}
      </span>
    );
  }
}

PairingBlock.propTypes = {
  t: PropTypes.func.isRequired,
  activity: PropTypes.shape({}).isRequired,
  hourWidthInPx: PropTypes.number.isRequired,
  isPairingSelected: PropTypes.bool.isRequired,
  renderTooltips: PropTypes.bool.isRequired,
  alertSelected: PropTypes.shape(),
};

PairingBlock.defaultProps = {
  alertSelected: null,
};

export default PairingBlock;
