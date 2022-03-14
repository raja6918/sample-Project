import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Notification from '../../../../../components/Notification';

import * as PairingConstants from '../constants';
import {
  cancelZoomSelection,
  onMouseOut,
  onHoverHighlight,
  onZoomSelection,
} from '../zoomHelpers';
import SierraMuiTooltip from '../../../../../_shared/components/SierraMuiTooltip/SierraMuiTooltip';

const MAX_DAYS =
  PairingConstants.MAX_PERIOD_DAYS +
  PairingConstants.CARRY_IN_DAYS +
  PairingConstants.CARRY_OUT_DAYS;
const classZoomMonths = PairingConstants.classZoomMonths;

class TimelineMonths extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionStartDay: null,
      selectionEndDay: null,
      hoverHighlight: false,
      isTooltipOpen: false,
      openSnackBar: false,
    };
    this.nodesToMonthDays = [];
    this.onZoomSelection = onZoomSelection.bind(this);
    this.cancelZoomSelection = cancelZoomSelection.bind(this);
    this.onHoverHighlight = onHoverHighlight.bind(this);

    this.tooltipX = 0;
    this.year = '';
    this.monthName = '';
    this.dayNumber = '';
  }

  componentDidMount() {
    this.nodesToMonthDays = document.querySelectorAll(`.${classZoomMonths}`);
    document.addEventListener('click', e =>
      this.cancelZoomSelection(e, classZoomMonths)
    );
  }
  componentWillUnmount() {
    window.removeEventListener('click', e =>
      this.cancelZoomSelection(e, classZoomMonths)
    );
  }

  handleZoomSelection = (e, month, day) => {
    if (this.state.selectionStartDay === null) {
      const rect = e.target.getBoundingClientRect();
      this.tooltipX = rect.x || rect.right;
      this.monthName = month.monthName;
      this.year = month.year;
      this.dayNumber = day.dayNumber;
      this.handleTooltipOpen();
    }
    this.onZoomSelection(day.dayIndex, classZoomMonths);
  };

  handleTooltipOpen = () => {
    this.setState({ isTooltipOpen: true });
  };

  onCloseSnack = () => {
    this.setState({
      openSnackBar: false,
    });
  };

  render() {
    const {
      t,
      outerWidth,
      calendarData,
      columnWidthInPx,
      monthsRef,
    } = this.props;

    const snackMessage = t('PAIRINGS.zoomError', { maxDays: MAX_DAYS });
    const {
      selectionStartDay,
      selectionEndDay,
      isTooltipOpen,
      openSnackBar,
    } = this.state;

    return (
      <Fragment>
        <div
          style={{
            position: 'absolute',
            left: `${this.tooltipX}px`,
          }}
        >
          <SierraMuiTooltip
            open={isTooltipOpen}
            placement="top"
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={`${this.monthName} ${this.dayNumber}, ${this.year}`}
          >
            <span style={{ display: 'block' }} />
          </SierraMuiTooltip>
        </div>
        <div
          className="pt-months"
          ref={monthsRef}
          style={{ width: outerWidth }}
        >
          {calendarData.map(month => (
            <div
              key={`${month.year}-${month.monthNumber}`}
              className="month-holder"
            >
              <div className={`month-title`}>
                {`${month.monthName} ${month.year}`}
              </div>
              <div className="container-month-day">
                {month.days.map(day => {
                  const givenClass = classNames({
                    [`${classZoomMonths}`]: true,
                    selected:
                      selectionStartDay === day.dayIndex ||
                      selectionEndDay === day.dayIndex,
                  });
                  return (
                    <SierraMuiTooltip
                      title={`${month.monthName} ${day.dayNumber}, ${month.year}`}
                      placement="top"
                      key={`tooltip_${day.dayNumber}`}
                    >
                      <div
                        data-key={day.dayIndex}
                        key={day.dayNumber}
                        className={givenClass}
                        onClick={e => this.handleZoomSelection(e, month, day)}
                        onMouseOver={e =>
                          this.onHoverHighlight(
                            e,
                            this.nodesToMonthDays,
                            classZoomMonths,
                            'data-key'
                          )
                        }
                        onFocus={() => {}}
                        onMouseOut={() =>
                          onMouseOut(selectionEndDay, classZoomMonths)
                        }
                        onBlur={() => {}}
                        style={{ width: columnWidthInPx }}
                      >
                        {day.isFirstDayOfMonth && (
                          <span className="month-separator" />
                        )}
                      </div>
                    </SierraMuiTooltip>
                  );
                })}
              </div>
            </div>
          ))}
          {openSnackBar && (
            <Notification
              message={snackMessage}
              clear={this.onCloseSnack}
              type="error"
              buttonText={t('GLOBAL.viewMore')}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

TimelineMonths.propTypes = {
  t: PropTypes.func.isRequired,
  calendarData: PropTypes.arrayOf(Object).isRequired,
  columnWidthInPx: PropTypes.number.isRequired,

  outerWidth: PropTypes.number.isRequired,
  monthsRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default TimelineMonths;
