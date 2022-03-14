import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MUIFormControl from '@material-ui/core/FormControl';
import TimeZone from './TimeZone/index.jsx';

import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import FormHelperText from '@material-ui/core/FormHelperText';
import { SelectInput } from '../Accommodations/FormComponents';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListboxComponent from '../../../../components/ReactWindow/ListboxComponent';

import * as regionsService from '../../../../services/Data/regions';
import * as countriesService from '../../../../services/Data/countries';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';

import {
  terminalsCleansing,
  checkErrorFlags,
  cleanCoordinateValue,
  validateFields,
  getLabel,
} from './helpers';
import { MAX_TERMINALS, TERMINAL_PATTERN } from './constants';
import { getInlineErrorMessage } from '../../../../_shared/helpers';

import Sort from '../../../../utils/sortEngine';

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;
const SectionTitle = styled.h2`
  font-size: 16px;
  font-family: 'Roboto-Regular', sans-serif;
  color: rgba(0, 0, 0, 0.87);
  margin-top: 0;
`;
const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

const ErrorMessage = styled(FormHelperText)`
  color: #d10000;
`;

const SingleItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;
class StationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: '',
      countries: [],
      regionCode: '',
      regions: [],
      terminals: '',
      name: '',
      IATACode: '',
      latitude: '',
      longitude: '',
      isFormDirty: false,
      errors: {
        IATACode: false,
        latitude: false,
        longitude: false,
        name: false,
        terminals: false,
      },
    };
    this.errorExistsDEPRECATED = false;
  }

  componentDidMount() {
    const openItemId = this.props.openItemId;
    Promise.all([
      countriesService.getCountries(openItemId),
      regionsService.getRegions(openItemId),
    ])
      .then(([countries, regions]) => {
        const sortedCountries = new Sort(countries.data, {
          type: 'string',
          direction: 'inc',
          field: 'name',
        }).sort();

        this.setState({
          countries: sortedCountries,
          regions: regions.data,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    const { station } = nextProps;
    if (!nextProps.isOpen) {
      this.setState({
        IATACode: station ? station.code : '',
        countryCode: station ? station.countryCode : null,
        regionCode: station ? station.regionCode : null,
        latitude: station ? station.latitude : '',
        longitude: station ? station.longitude : '',
        name: station ? station.name : '',
        terminals:
          station && station.terminals ? station.terminals.join(', ') : '',
        isFormDirty: false,
        errors: {
          IATACode: false,
          latitude: false,
          longitude: false,
          name: false,
          terminals: false,
        },
      });
    }

    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkIfFormisReady);
    }
  }

  buildCountryValue = ({ countryName, countryCode }) =>
    `${countryName},${countryCode}`;

  onSelectChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      this.onFormChange
    );
  };

  onAutocompleteChange = (option, fieldName) => {
    const value = option ? option.value : '';
    this.setState({ [fieldName]: value }, this.onFormChange);
  };

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  getStation = property => {
    const { station } = this.props;

    return station && (station[property] || station[property] === 0)
      ? station[property].toString()
      : '';
  };

  validateTerminalsField = event => {
    const { id, value } = event.target;
    let error = false;

    if (value.length) {
      const terminals = value.split(',');

      const terminalsCount = terminals.length;
      for (let index = 0; index < terminalsCount; index++) {
        const terminal = terminals[index];
        const isLastTerminal = index === terminalsCount - 1;
        const terminalRegexp = new RegExp(TERMINAL_PATTERN);

        /* Ignore last terminals if it is the last one and is empty */
        if (!(isLastTerminal && terminal === '')) {
          error = !terminalRegexp.test(terminal);
          if (error) break;
        }
      }
    }

    this.updateError(id, error);
  };

  handleTerminalsBlur = event => {
    const { id, value } = event.target;

    if (this.state.errors[id] === false) {
      const terminals = terminalsCleansing(value);
      const terminalsString = terminals.join(', ');
      this.setState({ [id]: terminalsString });
    }
  };

  validateErrors = (event, pattern) => {
    const { inlineError } = this.props;
    const { errors } = this.state;
    const { id, value } = event.target;
    const inlineErrorMessage = getInlineErrorMessage(event, inlineError);

    if (value.length) {
      this.checkForError(event, pattern);
    } else {
      if (errors[id]) {
        this.setState(
          state => ({
            [id]: value,
            errors: {
              ...state.errors,
              [id]: false,
            },
            inlineErrorMessage,
          }),
          this.checkIfFormisReady()
        );
      }
    }
  };

  checkIfFormisReady = () => {
    const IATACode = document.getElementById('IATACode').value.trim();
    const stationName = document.getElementById('name').value.trim();
    const { countryCode } = this.state;
    const utcOffset = document.getElementById('utcOffset').value;
    const dstShift = document.getElementById('dstShift').value.trim();
    const dstStartDateTime =
      document.getElementById('dstStartDateTime') !== null
        ? document.getElementById('dstStartDateTime').value
        : null;
    const endDateDomField = document.getElementById('dstEndDateTime');
    const dstEndDateTime =
      endDateDomField !== null ? endDateDomField.value : null;
    const { errors, isFormDirty } = this.state;

    const isError = checkErrorFlags(errors);

    const isValidValue = value => {
      return value !== '' && value !== null && value !== undefined;
    };

    const hasValidDSTDates =
      !!dstStartDateTime &&
      !!dstEndDateTime &&
      dstEndDateTime > dstStartDateTime;

    const predicateWithNoDates =
      IATACode && stationName && countryCode && utcOffset && dstShift;

    const predicateWithDates =
      predicateWithNoDates && dstStartDateTime && dstEndDateTime;

    const withDates =
      isValidValue(predicateWithDates) && hasValidDSTDates && isError === false;

    const withNoDates = isValidValue(predicateWithNoDates) && isError === false;

    const isDirtyCondition = dstShift !== '0h00' ? withDates : withNoDates;

    if (isDirtyCondition) {
      if (!isFormDirty) {
        this.setState({
          isFormDirty: true,
        });
      }
    } else {
      if (isFormDirty) {
        this.setState({
          isFormDirty: false,
        });
      }
    }
  };

  setErrorDEPRECATED = (errors, error) => {
    if (error) {
      if (Object.values(errors).filter(field => field).length)
        this.errorExistsDEPRECATED = true;
    } else {
      if (Object.values(errors).filter(field => field).length === 0)
        this.errorExistsDEPRECATED = false;
    }

    this.checkIfFormisReady();
  };

  onFormChange = () => {
    this.checkIfFormisReady();
  };

  updateError = (key, nextValue) => {
    const { errors } = this.state;
    const currentValue = errors[key];

    if (currentValue !== nextValue) {
      this.setState(
        state => ({
          errors: {
            ...state.errors,
            [key]: nextValue,
          },
        }),
        this.checkIfFormisReady
      );
    }
  };

  checkForError = (event, pattern) => {
    const { inlineError } = this.props;
    const { id, value } = event.target;
    const { errors } = this.state;

    const inlineErrorMessage = getInlineErrorMessage(event, inlineError);
    const format = new RegExp(pattern);

    if (!format.test(value)) {
      this.setState(
        state => ({
          [id]: value,
          errors: {
            ...state.errors,
            [id]: true,
          },
          inlineErrorMessage,
        }),
        this.checkIfFormisReady
      );
    } else {
      if (errors[id] && format.test(value)) {
        this.setState(
          state => ({
            [id]: value,
            errors: {
              ...state.errors,
              [id]: false,
            },
            inlineErrorMessage,
          }),
          this.checkIfFormisReady
        );
      }
    }
  };

  evaluateRegex = (regex, term) => {
    const reg = new RegExp(regex);
    const isValidRegex = reg.test(term);
    return isValidRegex;
  };

  updateErrors = (key, value, regexp: '') => {
    const isEmpty = value === '';
    let isError = isEmpty ? false : !this.evaluateRegex(regexp, value);
    if (!isError && !isEmpty) isError = !validateFields(key, value);

    return {
      ...this.state.errors,
      [key]: isError,
    };
  };

  handleChange = (e, regex) => {
    const { inlineError } = this.props;
    const name = e.target.name;
    let value = e.target.value;

    const inlineErrorMessage = getInlineErrorMessage(e, inlineError);

    if (name === 'latitude' || name === 'longitude') {
      value = cleanCoordinateValue(value);
    }

    const errors = this.updateErrors(name, value, regex);

    this.setState(
      {
        [name]: value,
        errors,
        inlineErrorMessage,
      },
      this.checkIfFormisReady
    );
  };

  handleChangeTerminals = e => {
    const id = e.target.name;
    const value = e.target.value;

    let newState = { [id]: value };
    const terminalsArray = value.split(',');
    const terminalsCount = terminalsArray.length;

    if (terminalsCount > MAX_TERMINALS) {
      const truncatedTerminals = terminalsArray
        .splice(0, MAX_TERMINALS)
        .join(',');
      newState = { [id]: truncatedTerminals };
    }

    this.setState(newState);
  };

  render() {
    const {
      station,
      formId,
      t,
      readOnly,
      enableReadOnly,
      handleOk,
      ...rest
    } = this.props;
    const {
      name,
      countryCode,
      countries,
      regionCode,
      regions,
      errors,
      terminals,
      IATACode,
      inlineErrorMessage,
      latitude,
      longitude,
    } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const addStation = 'DATA.stations.form';
    const sectionGeneral = 'DATA.stations.form.section.general';
    const sectionGeography = 'DATA.stations.form.section.geography';
    const sectionTime = 'DATA.stations.form.section.time';

    const suggestionCountries = countries.map(s => ({
      value: s.code,
      label: `${s.name}, ${s.code}`,
    }));

    let codeErrorMessage = t('ERRORS.STATIONS.IATACode');

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    const prepareRegions = regions => {
      return regions.map(region => ({
        value: region.code,
        display: region.name,
      }));
    };

    return (
      <Form
        okButton={getFormOkButton(t, station)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        handleOk={form => handleOk(form, { countryCode })}
        {...rest}
      >
        <FormHeader>
          <span>{getFormHeading(t, station, readOnlyStatus, addStation)}</span>
          <span>{name}</span>
        </FormHeader>

        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <SectionTitle>{t(`${sectionGeneral}.title`)}</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <Input
                      error={errors.IATACode}
                      className={errors.IATACode ? 'error' : ''}
                      inputProps={{
                        id: 'IATACode',
                        name: 'IATACode',
                        type: 'text',
                        maxLength: 3,
                        placeholder: t(`${sectionGeneral}.codePlaceholder`),
                        title: t('ERRORS.STATIONS.IATACode'),
                      }}
                      onChange={event =>
                        this.handleChange(event, '[A-Za-z]{3}')
                      }
                      required
                      label={t(`${sectionGeneral}.code`)}
                      value={IATACode}
                      disabled={readOnlyStatus}
                    />
                    {errors.IATACode && (
                      <ErrorMessage>{codeErrorMessage}</ErrorMessage>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl required>
                    <Input
                      required
                      error={errors.name}
                      className={errors.name ? 'error' : ''}
                      inputProps={{
                        id: 'name',
                        name: 'name',
                        maxLength: 75,
                      }}
                      label={t(`${addStation}.name`)}
                      value={name}
                      color="secondary"
                      onChange={event => {
                        this.handleChange(event, '^[A-Za-z0-9]+.*');
                      }}
                      disabled={readOnlyStatus}
                    />
                    {errors.name && (
                      <ErrorMessage>
                        {t('ERRORS.STATIONS.stationName')}
                      </ErrorMessage>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <Input
                      error={errors.terminals}
                      className={errors.terminals ? 'error' : ''}
                      inputProps={{
                        id: 'terminals',
                        name: 'terminals',
                        style: { textTransform: 'uppercase' },
                      }}
                      label={t(`${addStation}.terminals`)}
                      value={terminals}
                      color="secondary"
                      onChange={event => {
                        this.handleChangeTerminals(event);
                        this.validateTerminalsField(event);
                      }}
                      onBlur={this.handleTerminalsBlur}
                      disabled={readOnlyStatus}
                    />
                    {errors.terminals && (
                      <ErrorMessage>
                        {t('ERRORS.STATIONS.terminals')}
                      </ErrorMessage>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <SectionTitle>{t(`${sectionGeography}.title`)}</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <Autocomplete
                      name="countryCode"
                      id="countryCode"
                      options={suggestionCountries}
                      value={
                        countryCode
                          ? {
                              value: countryCode,
                              label: getLabel(suggestionCountries, countryCode),
                            }
                          : null
                      }
                      ListboxComponent={ListboxComponent}
                      onChange={(e, option) =>
                        this.onAutocompleteChange(option, 'countryCode')
                      }
                      disabled={readOnlyStatus}
                      getOptionLabel={option =>
                        option.label ? option.label : ''
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="standard"
                          label={t(`${sectionGeography}.country`) + ' *'}
                        />
                      )}
                      renderOption={option => (
                        <SingleItem>{option.label}</SingleItem>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <InputLabel htmlFor="regionCode">
                      {t(`${sectionGeography}.region`)}
                    </InputLabel>
                    <SelectInput
                      name="regionCode"
                      onChange={this.onSelectChange}
                      items={prepareRegions(regions)}
                      value={regionCode || ''}
                      disabled={readOnlyStatus}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Input
                      error={errors.latitude}
                      className={errors.latitude ? 'error' : ''}
                      inputProps={{
                        id: 'latitude',
                        name: 'latitude',
                        type: 'text',
                        title: t('ERRORS.STATIONS.latitude'),
                        maxLength: 10,
                      }}
                      onChange={event => {
                        this.handleChange(event, /^[-+]?\d*\.{0,1}\d+$/);
                      }}
                      label={t(`${sectionGeography}.latitude`)}
                      value={latitude}
                      disabled={readOnlyStatus}
                    />
                    {errors.latitude && (
                      <ErrorMessage>
                        {t('ERRORS.STATIONS.latitude')}
                      </ErrorMessage>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Input
                      error={errors.longitude}
                      className={errors.longitude ? 'error' : ''}
                      inputProps={{
                        id: 'longitude',
                        name: 'longitude',
                        type: 'text',
                        title: t('ERRORS.STATIONS.longitude'),
                        maxLength: 11,
                      }}
                      onChange={event => {
                        this.handleChange(event, /^[-+]?\d*\.{0,1}\d+$/);
                      }}
                      label={t(`${sectionGeography}.longitude`)}
                      value={longitude}
                      disabled={readOnlyStatus}
                    />
                    {errors.longitude && (
                      <ErrorMessage>
                        {t('ERRORS.STATIONS.longitude')}
                      </ErrorMessage>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <SectionTitle>{t(`${sectionTime}.title`)}</SectionTitle>
              <TimeZone
                t={t}
                station={station}
                onChange={this.onFormChange}
                disabled={readOnlyStatus}
              />
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

StationForm.propTypes = {
  t: PropTypes.func.isRequired,
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    country: PropTypes.string,
    region: PropTypes.string,
    dst: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dstEndDateTime: PropTypes.string,
    dstStartDateTime: PropTypes.string,
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

StationForm.defaultProps = {
  station: {},
  inlineError: null,
};

export default StationForm;
