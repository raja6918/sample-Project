import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import AddExtraTime from '../../../../components/DataContent/AddExtraTime/AddExtraTime';
import { SelectInput } from './FormComponents';
import { ExpansionPanel, FormControl, Input } from './FormComponents';

import {
  POSITIVE_NUM_REGEX,
  transitModel,
  transitErrorModel,
} from './Constants';

import {
  prepareCurrencyCodes,
  evaluateRegex,
  TRANSIT_TIME_MAX_VALUE,
} from './utils';

import { prepareTransportBillingPolicies } from '../CoterminalTransports/Constants';

class TransitCardsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transitDetails: this.props.transitDetails,
      transitErrors: this.props.transitErrors,
      mountExtraTimeRows: Object.keys(this.props.transitDetails).length,
    };
  }

  componentWillMount() {
    this.handleTransitDetails(this.props.stations);
  }

  shouldComponentUpdate_DEPRECATED_(nextProps, nextState) {
    const needRender =
      nextProps.stations !== this.props.stations ||
      nextState.transitErrors !== this.state.transitErrors;
    return needRender;
  }
  componentWillReceiveProps(nextProps) {
    this.handleTransitDetails(nextProps.stations);
  }

  handleTransitDetails = stations => {
    /* Creates transit and error state details for Transit form based on each station*/
    const { transitDetails, transitErrors } = this.state;
    stations.forEach(stationCode => {
      transitDetails[stationCode] =
        transitDetails[stationCode] || transitModel(this.props.t);
      transitErrors[stationCode] =
        transitErrors[stationCode] || transitErrorModel;
    });

    //removes transit errors and details when uncheck stations.
    for (const key in transitDetails) {
      if (Object.prototype.hasOwnProperty.call(transitDetails, key)) {
        if (stations.indexOf(key) === -1) {
          delete transitDetails[key];
          delete transitErrors[key];
        }
      }
    }
  };

  handleBlur = (e, station, regex: '') => {
    const event = e.target || e.srcElement;
    const name = event.name;
    const value = event.value;
    let isError = null;
    if (name === 'duration') {
      isError = value === '' ? false : !evaluateRegex(regex, value);
      isError = value > TRANSIT_TIME_MAX_VALUE ? true : isError;
    }
    if (name === 'transportCost') {
      const valueArr = value.split('');
      isError =
        isNaN(value) ||
        value < 0 ||
        valueArr.indexOf('e') !== -1 ||
        value === '-0';
    }
    this.setState(
      {
        transitErrors: {
          ...this.state.transitErrors,
          [station]: {
            ...this.state.transitErrors[station],
            [event.name]: isError,
          },
        },
      },
      this.updateTransitDetails
    );
  };

  updateTransitDetails = () => {
    const { transitDetails, transitErrors } = this.state;
    this.props.updateTransitDetails(transitDetails, transitErrors);
  };

  handleInputChange = (e, station) => {
    const event = e.target || e.srcElement;

    this.setState(
      {
        transitDetails: {
          ...this.state.transitDetails,
          [station]: {
            ...this.state.transitDetails[station],
            [event.name]: event.value,
          },
        },
      },
      this.updateTransitDetails
    );
  };

  handleSelectChange = (event, station) => {
    const name = event.target.name;
    const newVal = event.target.value;
    this.setState(
      {
        transitDetails: {
          ...this.state.transitDetails,
          [station]: {
            ...this.state.transitDetails[station],
            [name]: newVal,
          },
        },
      },
      this.updateTransitDetails
    );
  };

  formatToArray = obj => {
    const formattedArr = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        formattedArr.push(obj[key]);
      }
    }
    return formattedArr;
  };

  updateExtraTimeDetails = ({ extraTimeDetails, extraTimeErrors }, station) => {
    this.setState(
      {
        transitDetails: {
          ...this.state.transitDetails,
          [station]: {
            ...this.state.transitDetails[station],
            extraTravelTimes: this.formatToArray(extraTimeDetails),
          },
        },
        transitErrors: {
          ...this.state.transitErrors,
          [station]: {
            ...this.state.transitErrors[station],
            extraTravelTimes: this.formatToArray(extraTimeErrors),
          },
        },
      },
      () => {
        this.updateTransitDetails();
      }
    );
  };

  render() {
    const { transitDetails, transitErrors, mountExtraTimeRows } = this.state;
    const {
      t,
      currencies,
      stations,
      transportBillingPolicies,
      disabled,
    } = this.props;
    const form = 'DATA.accommodations.form.section';
    const errorMsg = 'ERRORS.ACCOMMODATIONS';

    return stations.map(station => {
      const errors = transitErrors[station];
      const details = transitDetails[station];

      return (
        <React.Fragment key={station}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
            >
              <p>
                {t(`${form}.transit.transitCardHeader`, {
                  code: station,
                })}
              </p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ padding: '10px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.duration}>
                    <Input
                      className={errors.duration ? 'error' : ''}
                      inputProps={{
                        maxLength: 10,
                      }}
                      id={`duration`}
                      name={`duration`}
                      label={t(`${form}.transit.transitTime`)}
                      color="secondary"
                      onChange={e => {
                        this.handleInputChange(e, station);
                        this.handleBlur(e, station, POSITIVE_NUM_REGEX);
                      }}
                      defaultValue={details.duration}
                      disabled={disabled}
                      error={errors.duration}
                      required
                    />
                    <ErrorMessage
                      isVisible={errors.duration}
                      message={t(`${errorMsg}.transitTime`)}
                    />
                  </FormControl>
                </Grid>
                {/* temporarily disabling addextratime since its not yet supported in the Altitude Pairing solver(for accomodation)
                <Grid item xs={12} sm={12}>
                  <AddExtraTime
                    t={t}
                    extraTimeDetails={
                      mountExtraTimeRows
                        ? transitDetails[station].extraTravelTimes
                        : null
                    }
                    extraTimeErrors={
                      mountExtraTimeRows
                        ? transitErrors[station].extraTravelTimes
                        : null
                    }
                    updateExtraTimeDetails={extraTime => {
                      this.updateExtraTimeDetails(extraTime, station);
                    }}
                    buttonId={`id_${station}`}
                    disabled={disabled}
                  />
                </Grid> */}
                <Grid item xs={6} sm={6}>
                  <FormControl error={errors.transportCost}>
                    <Input
                      required
                      inputProps={{
                        maxLength: 10,
                      }}
                      className={errors.transportCost ? 'error' : ''}
                      id={`transportCost`}
                      name={`transportCost`}
                      label={t(`${form}.transit.transitCost`)}
                      color="secondary"
                      defaultValue={
                        details.transportCost ? details.transportCost : 0
                      }
                      error={errors.transportCost}
                      onChange={e => {
                        this.handleInputChange(e, station);
                        this.handleBlur(e, station);
                      }}
                      disabled={disabled}
                    />
                    <ErrorMessage
                      isVisible={errors.transportCost}
                      message={t(`${errorMsg}.transitCost`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl>
                    <InputLabel htmlFor="transportCurrencyCode">
                      {''}
                    </InputLabel>
                    <SelectInput
                      name="transportCurrencyCode"
                      onChange={event =>
                        this.handleSelectChange(event, station)
                      }
                      items={prepareCurrencyCodes(currencies)}
                      value={details.transportCurrencyCode}
                      disabled={disabled}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <InputLabel htmlFor="billingPolicyCode">
                      {t(`${form}.transit.costBasis`)}
                    </InputLabel>
                    <SelectInput
                      name="billingPolicyCode"
                      onChange={event =>
                        this.handleSelectChange(event, station)
                      }
                      items={prepareTransportBillingPolicies(
                        transportBillingPolicies
                      )}
                      value={details.billingPolicyCode}
                      disabled={disabled}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </React.Fragment>
      );
    });
  }
}

TransitCardsForm.propTypes = {
  t: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  stations: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateTransitDetails: PropTypes.func.isRequired,
  transitDetails: PropTypes.shape({
    duration: PropTypes.number,
    transitTimes: PropTypes.shape({
      extraTime: PropTypes.number,
      startTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      endTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    transportCost: PropTypes.number,
    transitCurrency: PropTypes.string,
    costBasis: PropTypes.string,
  }),
  transitErrors: PropTypes.shape({
    duration: PropTypes.bool,
    extraTimes: PropTypes.shape({
      extraTime: PropTypes.bool,
      starEndTime: PropTypes.bool,
    }),
    transportCost: PropTypes.bool,
  }),
  disabled: PropTypes.bool.isRequired,
};

TransitCardsForm.defaultProps = {
  transitDetails: {},
  transitErrors: {},
};

export default TransitCardsForm;
