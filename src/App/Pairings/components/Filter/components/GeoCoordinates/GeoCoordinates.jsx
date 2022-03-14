import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MUIFormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { t } from 'i18next';

const FormControl = styled(MUIFormControl)`
  width: 50%;
  padding-right: 15px;
`;

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

const BoxWrapper = styled.div`
  margin-top: 28px;
  & > div {
    display: flex;
    justify-content: space-between;
    width: 170px;
  }

  & .errorSpan {
    color: #d10000 !important;
    margin-top: 3px;
    font-size: 0.75rem;
  }

  & .MuiInputLabel-formControl {
    top: 4px;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
  }
`;

const TitleSpan = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-top: 20px;
  margin-left: 10px;
  & .MuiFormControlLabel-root {
    padding-bottom: 10px;
  }
`;

const StyledRadio = styled(Radio)`
  & + span {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    opacity: 0.67;
    padding-left: 7px;
  }
`;

class GeoCoordinates extends Component {
  state = {
    latitudeMin: this.props.value.latitude ? this.props.value.latitude.min : '',
    latitudeMax: this.props.value.latitude ? this.props.value.latitude.max : '',
    longitudeMin: this.props.value.longitude
      ? this.props.value.longitude.min
      : '',
    longitudeMax: this.props.value.longitude
      ? this.props.value.longitude.max
      : '',
    latitudeMinError: '',
    latitudeMaxError: '',
    longitudeMinError: '',
    longitudeMaxError: '',
    latitudeRangeError: '',
    longitudeRangeError: '',
    selected: this.props.value.type
      ? this.props.value.type
      : 'departureArrivalZone',
  };

  isEmpty = value => value === undefined || value === null || value === '';

  sendValues = () => {
    const {
      latitudeMin,
      latitudeMax,
      latitudeMinError,
      latitudeMaxError,
      longitudeMinError,
      longitudeMaxError,
      latitudeRangeError,
      longitudeRangeError,
      longitudeMin,
      longitudeMax,
      selected,
    } = this.state;
    let values = {};
    const error =
      latitudeMinError ||
      latitudeMaxError ||
      longitudeMinError ||
      longitudeMaxError ||
      latitudeRangeError ||
      longitudeRangeError;

    if (!this.isEmpty(selected)) {
      values.type = selected;
    }

    if (!this.isEmpty(latitudeMin) && !this.isEmpty(latitudeMax)) {
      values.latitude = { min: latitudeMin, max: latitudeMax };
    }
    if (!this.isEmpty(longitudeMin) && !this.isEmpty(longitudeMax)) {
      values.longitude = { min: longitudeMin, max: longitudeMax };
    }

    if (
      (!this.isEmpty(latitudeMin) && this.isEmpty(latitudeMax)) ||
      (this.isEmpty(latitudeMin) && !this.isEmpty(latitudeMax))
    ) {
      values = null;
    }
    if (
      (!this.isEmpty(longitudeMin) && this.isEmpty(longitudeMax)) ||
      (this.isEmpty(longitudeMin) && !this.isEmpty(longitudeMax))
    ) {
      values = null;
    }

    this.props.onChange(values, null, error);
  };

  validateCoordinates = (limit, value) => {
    const minLimit = limit * -1;
    const inputValue = parseFloat(value);
    return inputValue >= minLimit && inputValue <= limit;
  };

  extraFieldValidators = {
    longitudeMin: 180,
    longitudeMax: 180,
    latitudeMin: 90,
    latitudeMax: 90,
  };

  getCoordinateType = geoType => {
    if (geoType === 'latitudeMin' || geoType === 'latitudeMax') {
      return 'latitude';
    }
    return 'longitude';
  };

  validate = (geoType, value) => {
    const { pattern } = this.props;
    const { latitudeMin, latitudeMax, longitudeMin, longitudeMax } = this.state;

    const errorType = geoType + 'Error';
    const coordinateType = this.getCoordinateType(geoType);
    const coordinateErrorMsg =
      coordinateType === 'latitude'
        ? t('ERRORS.FILTER.latitudeInvalidFormatMessage')
        : t('ERRORS.FILTER.longitudeInvalidFormatMessage');

    if (coordinateType === 'latitude') {
      if (!latitudeMin && !latitudeMax) {
        return this.setState(
          {
            latitudeMinError: '',
            latitudeMaxError: '',
          },
          this.sendValues
        );
      }
    } else {
      if (!longitudeMin && !longitudeMax) {
        return this.setState(
          {
            longitudeMinError: '',
            longitudeMaxError: '',
          },
          this.sendValues
        );
      }
    }

    if (value) {
      const isValid =
        pattern.test(value) &&
        this.validateCoordinates(this.extraFieldValidators[geoType], value);

      if (!isValid) {
        return this.setState(
          {
            [errorType]: coordinateErrorMsg,
          },
          this.sendValues
        );
      }
    }

    this.setState({ [errorType]: '' }, this.sendValues);
  };

  handleLatitudeOnBlur = () => {
    let errorType;
    let errorMsg;

    if (
      this.state.latitudeMin &&
      parseFloat(this.state.latitudeMin, 10) > this.state.latitudeMax &&
      parseFloat(this.state.latitudeMax, 10)
    ) {
      errorType = 'latitudeRangeError';
      errorMsg = t('ERRORS.FILTER.integerRangeError');
    } else {
      this.setState(
        {
          latitudeRangeError: '',
        },
        this.sendValues
      );
    }

    if (!this.state.latitudeMinError && !this.state.latitudeMaxError) {
      if (!this.state.latitudeMin && this.state.latitudeMax) {
        errorType = 'latitudeMinError';
        errorMsg = t('ERRORS.FILTER.InvalidFormatMessage');
      }

      if (this.state.latitudeMin && !this.state.latitudeMax) {
        errorType = 'latitudeMaxError';
        errorMsg = t('ERRORS.FILTER.InvalidFormatMessage');
      }

      this.setState(
        {
          [errorType]: errorMsg,
        },
        this.sendValues
      );
    }
  };

  handleLongitudeOnBlur = () => {
    let errorType;
    let errorMsg;
    if (
      this.state.longitudeMin &&
      parseFloat(this.state.longitudeMin, 10) > this.state.longitudeMax &&
      parseFloat(this.state.longitudeMax, 10)
    ) {
      errorType = 'longitudeRangeError';
      errorMsg = t('ERRORS.FILTER.integerRangeError');
    } else {
      this.setState(
        {
          longitudeRangeError: '',
        },
        this.sendValues
      );
    }

    if (!this.state.longitudeMinError && !this.state.longitudeMaxError) {
      if (!this.state.longitudeMin && this.state.longitudeMax) {
        errorType = 'longitudeMinError';
        errorMsg = t('ERRORS.FILTER.InvalidFormatMessage');
      }

      if (this.state.longitudeMin && !this.state.longitudeMax) {
        errorType = 'longitudeMaxError';
        errorMsg = t('ERRORS.FILTER.InvalidFormatMessage');
      }

      return this.setState(
        {
          [errorType]: errorMsg,
        },
        this.sendValues
      );
    }
  };

  handleChange = (type, e) => {
    this.setState({ [type]: e.target.value }, () => {
      this.validate(type, this.state[type]);
    });
  };

  handleRadioChange = e => {
    this.setState({ selected: e.target.value }, this.sendValues);
  };

  getValue = value => {
    return value !== undefined && value !== null ? value : '';
  };

  render() {
    const { placeholder, maxLabel, minLabel } = this.props;
    const {
      latitudeMin,
      latitudeMax,
      longitudeMin,
      longitudeMax,
      latitudeMinError,
      latitudeMaxError,
      latitudeRangeError,
      longitudeRangeError,
      longitudeMinError,
      longitudeMaxError,
      selected,
    } = this.state;
    const latError = latitudeMinError || latitudeMaxError || latitudeRangeError;
    const longError =
      longitudeMinError || longitudeMaxError || longitudeRangeError;

    return (
      <BoxWrapper>
        <TitleSpan>Latitude</TitleSpan>
        <div>
          <Grid item xs={12} sm={12}>
            <FormControl>
              <Input
                className={
                  latitudeMinError || latitudeRangeError ? 'error' : ''
                }
                inputProps={{
                  id: 'latitudeMin',
                  name: 'latitudeMin',
                  type: 'text',
                  maxLength: 10,
                }}
                onChange={event => {
                  this.handleChange('latitudeMin', event);
                }}
                label={minLabel}
                value={this.getValue(latitudeMin)}
                onBlur={this.handleLatitudeOnBlur}
                placeholder={placeholder}
              />
            </FormControl>
            <FormControl>
              <Input
                className={latitudeMaxError ? 'error' : ''}
                inputProps={{
                  id: 'latitudeMax',
                  name: 'latitudeMax',
                  type: 'text',
                  maxLength: 10,
                }}
                onChange={event => {
                  this.handleChange('latitudeMax', event);
                }}
                label={maxLabel}
                value={this.getValue(latitudeMax)}
                onBlur={this.handleLatitudeOnBlur}
                placeholder={placeholder}
              />
            </FormControl>
            {latError && <span className="errorSpan">{latError}</span>}
          </Grid>
        </div>
        <TitleSpan style={{ marginTop: '20px' }}>Longitude </TitleSpan>
        <div style={{ marginTop: '0px' }}>
          <Grid item xs={12} sm={12}>
            <FormControl>
              <Input
                className={
                  longitudeMinError || longitudeRangeError ? 'error' : ''
                }
                inputProps={{
                  id: 'longitudeMin',
                  name: 'longitudeMin',
                  type: 'text',
                  maxLength: 10,
                }}
                onChange={event => {
                  this.handleChange('longitudeMin', event);
                }}
                label={minLabel}
                value={this.getValue(longitudeMin)}
                onBlur={this.handleLongitudeOnBlur}
                placeholder={placeholder}
              />
            </FormControl>
            <FormControl>
              <Input
                className={longitudeMaxError ? 'error' : ''}
                inputProps={{
                  id: 'longitudeMax',
                  name: 'longitudeMax',
                  type: 'text',
                  maxLength: 10,
                }}
                onChange={event => {
                  this.handleChange('longitudeMax', event);
                }}
                label={maxLabel}
                value={this.getValue(longitudeMax)}
                onBlur={this.handleLongitudeOnBlur}
                placeholder={placeholder}
              />
            </FormControl>
            {longError && <span className="errorSpan">{longError}</span>}
          </Grid>
        </div>
        <StyledRadioGroup
          aria-label="geocoordinates"
          name="row-radio-buttons-group"
          onChange={this.handleRadioChange}
        >
          <FormControlLabel
            checked={selected === 'departureArrivalZone'}
            value="departureArrivalZone"
            control={<StyledRadio />}
            label={t(
              'FILTER.filterCriteria.geographicalOptions.departure-arrival'
            )}
          />
          <FormControlLabel
            checked={selected === 'depatureInZone'}
            value="depatureInZone"
            control={<StyledRadio />}
            label={t('FILTER.filterCriteria.geographicalOptions.departure')}
          />
          <FormControlLabel
            checked={selected === 'arrivalInZone'}
            value="arrivalInZone"
            control={<StyledRadio />}
            label={t('FILTER.filterCriteria.geographicalOptions.arrival')}
          />
          <FormControlLabel
            checked={selected === 'outsizeZone'}
            value="outsizeZone"
            control={<StyledRadio />}
            label={t('FILTER.filterCriteria.geographicalOptions.outside')}
          />
        </StyledRadioGroup>
      </BoxWrapper>
    );
  }
}

GeoCoordinates.propTypes = {
  style: PropTypes.shape({}),
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  pattern: PropTypes.instanceOf(RegExp),
  value: PropTypes.shape({
    latitude: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.number,
    ]),
    longitude: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
};

GeoCoordinates.defaultProps = {
  style: { width: '70px' },
  minLabel: 'Min',
  maxLabel: 'Max',
  placeholder: '00.0000',
  pattern: /./,
  value: {
    latitude: { min: null, max: null },
    longitude: { min: null, max: null },
  },
};
export default GeoCoordinates;
