import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PairingBlock, PairingToolbar } from './';
import {
  PAIRING_HEIGHT,
  DEBUG_MODE,
  STATION_LABEL_WIDTH,
  PAIRING_NAME_LABEL_MIN_WIDTH,
} from './../constants';
import { TimelineContext } from './../TimelineContext';
import {
  getPriorityColor,
  getPriorityIcon,
} from '../../OnlineValidation/helpers';
import IconButton from '@material-ui/core/IconButton';

class PairingObject extends Component {
  pairingObjectRef = React.createRef();
  iconRef = React.createRef();

  state = {
    isSelected: false,
    renderTooltips: false,
    alertSelected: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.hourWidthInPx !== nextProps.hourWidthInPx) {
      return true;
    }
    if (this.state.isSelected !== nextState.isSelected) {
      return true;
    }
    if (this.state.renderTooltips !== nextState.renderTooltips) {
      return true;
    }
    if (this.props.timelineWindowHeight !== nextProps.timelineWindowHeight) {
      return true;
    }
    if (this.state.alertSelected !== nextState.alertSelected) {
      return true;
    }
    return false;
  }

  handleOnClick = event => {
    event.stopPropagation();
    const { uniqueId, pairing, setSelectedPairing } = this.props;
    setSelectedPairing({ id: pairing.id, uniqueId });

    if (!DEBUG_MODE) return;
    // eslint-disable-next-line
    console.log(`>>> PAIRING ${pairing.id} ${uniqueId} `, pairing);
  };

  componentWillReceiveProps(nextProps) {
    const { selectedPairing } = nextProps;
    const { uniqueId } = this.props;
    const uniqueIds = selectedPairing.map(pairing => pairing.uniqueId);
    const isSelected = uniqueIds.includes(uniqueId);

    this.setState({ isSelected });
  }

  componentDidMount() {
    this.processLabels();
    this.moveAlertsIcon();
    document.addEventListener('timelineScrolled', this.moveAlertsIcon);
  }

  componentDidUpdate() {
    this.processLabels();
  }

  moveAlertsIcon = () => {
    try {
      if (this.pairingObjectRef.current) {
        const rect = this.pairingObjectRef.current.getBoundingClientRect();
        let translateX = 0;
        //check if object is inside viewport
        if (rect.left + rect.width > 0 && rect.left < 0) {
          const moveAlerts = this.props.isZoomed;
          if (!moveAlerts) return;
          translateX = Math.abs(rect.left) + 10;
          if (this.iconRef.current)
            this.iconRef.current.style.transform =
              'translate(' + translateX + 'px)';
        } else {
          if (this.iconRef.current)
            this.iconRef.current.style.transform =
              'translate(' + translateX + 'px)';
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  componentWillUnmount() {
    const { isSelected } = this.state;

    if (isSelected) {
      this.props.clearSelectedPairing();
    }

    document.removeEventListener('timelineScrolled', this.moveAlertsIcon);
  }

  processLabels() {
    const labelsRows = this.pairingObjectRef.current.getElementsByClassName(
      'pa-labels-row'
    );
    const labelsRowsCount = labelsRows.length;

    for (let lblRowIdx = 0; lblRowIdx < labelsRowsCount; lblRowIdx++) {
      let offsetWidthAccumulator = 0;
      const labelRow = labelsRows[lblRowIdx];
      const labels = labelRow.getElementsByClassName('pa-label');
      const labelsCount = labels.length;

      for (let lblIdx = 0; lblIdx < labelsCount; lblIdx++) {
        const label = labels[lblIdx];
        const offsetWidth = label.originalOffsetWidth || label.offsetWidth;
        const parentWidth = labelRow.parentElement.parentElement.clientWidth;

        offsetWidthAccumulator += offsetWidth;

        const labelFitsInsideItsParent = offsetWidthAccumulator <= parentWidth;

        if (!label.originalOffsetWidth) {
          /*
            The first time a label is rendered, we need to store the original
            offsetWidth of each one, this is because once we set display: none to
            any label, the offsetWidth is set to 0 and there is no way to revert that.
           */
          label.originalOffsetWidth = offsetWidth;
        }

        /* Debuging console. Do not remove */
        /*
        console.log({
          lblRowIdx,
          lblIdx,
          offsetWidth,
          originalOffsetWidth: label.originalOffsetWidth,
          parentWidth,
          offsetWidthAccumulator,
          labelFitsInsideItsParent,
        });
        */

        if (labelFitsInsideItsParent) {
          label.classList.add('no-hide');
          label.classList.remove('hide');
        } else {
          label.classList.add('hide');
          label.classList.remove('no-hide');
        }
      }
    }
  }

  handleAlertSelect = (alertType, flightNumber) => {
    this.setState({
      alertSelected: {
        alertType,
        flightNumber,
      },
    });
  };

  handleAlertClear = () => {
    this.setState({ alertSelected: null });
  };

  render() {
    const {
      t,
      pairing,
      hourWidthInPx,
      clearSelectedPairing,
      openPairingDetails,
      openRuleEditDialog,
      index,
    } = this.props;
    const { isSelected, renderTooltips, alertSelected } = this.state;
    const pairingWidth = pairing._duration * hourWidthInPx;
    const pairingNameWidth = Math.max(
      PAIRING_NAME_LABEL_MIN_WIDTH,
      pairingWidth
    );

    const style = {
      left: pairing._hoursFromTimelineStart * hourWidthInPx,
      width: pairingWidth > 1 ? pairingWidth : 1,
      height: PAIRING_HEIGHT,
    };

    const pairingNameStyle = {
      width: pairingNameWidth,
      left: (pairingWidth - pairingNameWidth) / 2,
    };

    const shouldRenderDepartureStation =
      pairing._hoursFromPrevPairing === null
        ? true
        : pairing._hoursFromPrevPairing * hourWidthInPx > STATION_LABEL_WIDTH;
    const shouldRenderArrivalStation =
      pairing._hoursToNextPairing === null
        ? true
        : pairing._hoursToNextPairing * hourWidthInPx > STATION_LABEL_WIDTH;
    /*
    When the pairing comes with no activities property, is because
    it is a single activity, such as FLT. In this case, we emulate
    the pairing structure for a proper render. This might change
    in the future.
    */

    if (!pairing.activities) {
      pairing.activities = [
        {
          duration: pairing.duration,
          activities: [
            {
              ...pairing,
            },
          ],
        },
      ];
    }

    /*
      This will prevent the selection of a pairing
      when users click on the outside labels (departure, arrival)
    */
    const stopPropagation = event => event.stopPropagation();

    const labelColor = getPriorityColor(pairing.alerts);
    const Icon = getPriorityIcon(pairing.alerts);

    return (
      <React.Fragment>
        {Icon && (
          <IconButton
            style={{
              top: '40px',
              left: style.left - 10 + 'px',
              position: 'absolute',
              zIndex: 1,
            }}
            ref={this.iconRef}
          >
            <Icon width={'26px'} height={'26px'} />
          </IconButton>
        )}
        <div
          className="pairing-container"
          style={style}
          ref={this.pairingObjectRef}
          onClick={this.handleOnClick}
          onMouseEnter={() => {
            this.setState({ renderTooltips: true });
          }}
          onMouseLeave={() => {
            this.setState({ renderTooltips: false });
          }}
        >
          {pairing.name && (
            <span
              className="pairing-name"
              style={pairingNameStyle}
              onClick={stopPropagation}
            >
              <span className="lbl-name" style={{ color: labelColor }}>
                {pairing.name}
              </span>
            </span>
          )}
          {shouldRenderDepartureStation && (
            <span
              className="pairing-station departure"
              onClick={stopPropagation}
            >
              {pairing.departureStationCode}
            </span>
          )}
          {shouldRenderArrivalStation && (
            <span className="pairing-station arrival" onClick={stopPropagation}>
              {pairing.arrivalStationCode}
            </span>
          )}
          {pairing.activities.map((activity, idx) => (
            <PairingBlock
              t={t}
              key={`activity-${idx}`}
              activity={activity}
              hourWidthInPx={hourWidthInPx}
              isPairingSelected={isSelected}
              renderTooltips={renderTooltips}
              alertSelected={alertSelected}
            />
          ))}
          {isSelected && (
            <PairingToolbar
              t={t}
              clearSelectedPairing={clearSelectedPairing}
              openPairingDetails={openPairingDetails}
              pairingObjectStyle={style}
              pairingObjectRef={this.pairingObjectRef}
              activityType={this.props.previewMode ? 'PRV' : pairing.type}
              timelineWindowHeight={this.props.timelineWindowHeight}
              index={index}
              pairing={pairing}
              onAlertSelect={this.handleAlertSelect}
              onAlertClear={this.handleAlertClear}
              openRuleEditDialog={openRuleEditDialog}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

PairingObject.propTypes = {
  t: PropTypes.func.isRequired,
  pairing: PropTypes.shape({}).isRequired,
  hourWidthInPx: PropTypes.number.isRequired,
  selectedPairing: PropTypes.shape({}).isRequired,
  setSelectedPairing: PropTypes.func.isRequired,
  clearSelectedPairing: PropTypes.func.isRequired,
  openPairingDetails: PropTypes.func.isRequired,
  previewMode: PropTypes.bool.isRequired,
  isZoomed: PropTypes.bool.isRequired,
  openRuleEditDialog: PropTypes.func.isRequired,
};

export default props => (
  <TimelineContext.Consumer>
    {({
      hourWidthInPx,
      setSelectedPairing,
      selectedPairing,
      clearSelectedPairing,
      openPairingDetails,
      renderTooltips,
      previewMode,
      openRuleEditDialog,
    }) => (
      <PairingObject
        {...props}
        hourWidthInPx={hourWidthInPx}
        setSelectedPairing={setSelectedPairing}
        selectedPairing={selectedPairing}
        clearSelectedPairing={clearSelectedPairing}
        openPairingDetails={openPairingDetails}
        renderTooltips={renderTooltips}
        previewMode={previewMode}
        openRuleEditDialog={openRuleEditDialog}
      />
    )}
  </TimelineContext.Consumer>
);
