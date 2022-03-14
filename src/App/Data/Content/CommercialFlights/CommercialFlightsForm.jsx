import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import pick from 'lodash/pick';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';

import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import Calendar from '../../../../components/Calendar/Calendar';
import AutocompleteChips from '../../../../components/AutocompleteChips/AutocompleteChips';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListboxComponent from '../../../../components/ReactWindow/ListboxComponent';

import { SelectInput, FormControl } from '../Accommodations/FormComponents';
import InputLabel from '@material-ui/core/InputLabel';
import storage from '../../../../utils/storage';
import { getStringHours } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormHeading,
  getFormOkButton,
  getFormCancelButton,
} from '../../../../utils/common';

import {
  CARRY_IN_DAYS,
  CARRY_OUT_DAYS,
} from '../../../Pairings/components/Timeline/constants';

import {
  GeneralTitle,
  InputForm,
  TimePickers,
  CustomText,
  SingleItem,
} from './FormComponents';

import {
  getDefaultEntity,
  getDefaultErrors,
  mapEntityToState,
  hasError,
  wereAllFieldsFilled,
  getCustomPredicate,
  prepareStations,
  findTerminalsByStationCode,
  sanitizeFlight,
  getStationName,
} from './helpers';

import {
  COMMERCIAL_FLIGHTS_FIELDS,
  COMMERCIAL_FLIGHTS_GENERAL,
  COMMERCIAL_FLIGHTS_FORM,
  COMMERCIAL_FLIGHTS_ERRORS,
  COMMERCIAL_FLIGHTS_INFO,
} from './constants';

class CommercialFlightsForm extends Component {
  state = {
    ...getDefaultEntity(),
    isFormDirty: false,
    errors: getDefaultErrors(),
  };

  startDate = null;
  endDate = null;

  componentDidMount() {
    const currentScenario = storage.getItem('openScenario');
    this.startDate = currentScenario.startDate;
    this.endDate = currentScenario.endDate;
  }

  componentWillReceiveProps(nextProps) {
    const { selectedItem, isOpen } = nextProps;
    if (selectedItem) selectedItem.tags = [];
    if (!isOpen) {
      const entity = selectedItem
        ? mapEntityToState(selectedItem)
        : getDefaultEntity();

      this.setState({
        ...entity,
        isFormDirty: false,
        errors: getDefaultErrors(),
      });
    }
  }

  handleChange = (e, shouldValidateForm = true) => {
    this.onChange(e.target.name, e.target.value, shouldValidateForm);
  };

  handleSelectChange = (option, stateProperty) => {
    const value = option ? option.value : '';

    let newState = {
      [stateProperty]: value,
    };

    switch (stateProperty) {
      case 'departureStationCode':
        newState = {
          ...newState,
          passengerTerminalDeparture: null,
        };
        break;
      case 'arrivalStationCode':
        newState = {
          ...newState,
          passengerTerminalArrival: null,
        };

        break;
      default:
        break;
    }

    this.setState(newState, this.checkFormIsReady);
  };

  handleInputChange = e => {
    const errors = this.updateErrors(e);
    let { name, value } = e.target;
    value = [
      'aircraftType',
      'aircraftConfigurationVersion',
      'airlineCode',
    ].includes(name)
      ? value.trim().toUpperCase()
      : value;

    let newState = {
      errors,
      [name]: value,
      onwardOffsetIsDisabled: false,
    };

    if (name === 'onwardFlightDesignator') {
      if (!value) {
        newState = {
          ...newState,
          onwardFlightDayOffset: '',
          onwardOffsetIsDisabled: true,
        };
      }
    }

    this.setState(newState, this.checkFormIsReady);
  };

  onChange = (fieldName, value, shouldValidForm = true) => {
    this.setState(
      {
        [fieldName]: value,
      },
      () => {
        if (shouldValidForm) this.checkFormIsReady();
      }
    );
  };

  checkFormIsReady = () => {
    const { isFormDirty } = this.state;
    const _hasError = hasError(this.state.errors);
    const allFieldsWereFilled = wereAllFieldsFilled(this.state);

    if (allFieldsWereFilled && !_hasError) {
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

  updateErrors = e => {
    const event = e.target || e.srcElement;
    const fieldName = event.name;
    const isValid = getCustomPredicate(fieldName);
    const isError = event.value !== '' && !isValid(event.value, this.state);
    return {
      ...this.state.errors,
      [fieldName]: isError,
    };
  };

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  handleSubmit = () => {
    const entity = sanitizeFlight(pick(this.state, COMMERCIAL_FLIGHTS_FIELDS));
    const id = this.props.selectedItem ? this.props.selectedItem.id : null;

    entity.startTime = getStringHours(entity.startTime);
    entity.endTime = getStringHours(entity.endTime);

    this.props.handleOk(entity, id);
  };

  handleChangePicker = name => dateTime => {
    this.setState({ [name]: dateTime }, this.checkFormIsReady);
  };

  handleCrewComplements = crewComposition => {
    this.setState(
      { crewComposition },
      this.props.handleCrewComplements(crewComposition)
    );
    if (crewComposition !== this.state.crewComposition) {
      this.checkFormIsReady();
    }
  };

  handleCalendarUpdates = date => {
    const startDates = [...this.state.startDates];
    const index = startDates.indexOf(date);

    if (index > -1) {
      startDates.splice(index, 1);
    } else {
      startDates.push(date);
    }
    this.setState({ startDates }, this.checkFormIsReady);
  };

  handleTagsUpdate = tags => {
    this.setState({ tags }, this.checkFormIsReady);
  };

  handleRemoveTag = tag => {
    const { tags } = this.state;
    const index = tags.indexOf(tag);

    if (index !== -1) {
      tags.splice(index, 1);
    }
    this.setState({ tags });
  };

  getGeneralSection = () => {
    const { t, stations, readOnly, enableReadOnly } = this.props;

    const {
      errors,
      airlineCode,
      flightNumber,
      operationalSuffix,
      departureStationCode,
      arrivalStationCode,
      passengerTerminalDeparture,
      passengerTerminalArrival,
      startTime,
      endTime,
      aircraftType,
      aircraftConfigurationVersion,
      startDates,
    } = this.state;
    const sectionPath = COMMERCIAL_FLIGHTS_GENERAL;
    const readOnlyStatus = readOnly || enableReadOnly;

    return (
      <div>
        <GeneralTitle>
          <h2>{t(`${sectionPath}.title`)}</h2>
        </GeneralTitle>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={4}>
            <InputForm
              required
              id="airlineCode"
              label={t(`${sectionPath}.airlineIdentifier`)}
              className={
                errors.airlineCode ? 'error' : readOnly ? 'read-only-input' : ''
              }
              color="secondary"
              error={errors.airlineCode}
              defaultValue={airlineCode}
              onChange={this.handleInputChange}
              maxLength={3}
              errorMessage={t(`${COMMERCIAL_FLIGHTS_ERRORS}.airlineCode`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <InputForm
              required
              id="flightNumber"
              label={t(`${sectionPath}.flightNumber`)}
              className={errors.flightNumber ? 'error' : ''}
              color="secondary"
              error={errors.flightNumber}
              defaultValue={flightNumber}
              onChange={this.handleInputChange}
              maxLength={4}
              errorMessage={t(`${COMMERCIAL_FLIGHTS_ERRORS}.flightNumber`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <InputForm
              id="operationalSuffix"
              label={t(`${sectionPath}.operationalSuffix`)}
              className={
                errors.operationalSuffix
                  ? 'error'
                  : readOnly
                  ? 'read-only-input'
                  : ''
              }
              color="secondary"
              error={errors.operationalSuffix}
              defaultValue={operationalSuffix}
              onChange={this.handleInputChange}
              maxLength={1}
              errorMessage={t(`${COMMERCIAL_FLIGHTS_ERRORS}.operationalSuffix`)}
              disabled={readOnlyStatus}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <Autocomplete
              name="departureStationCode"
              id="departureStationCode"
              options={prepareStations(stations)}
              value={
                departureStationCode
                  ? {
                      value: departureStationCode,
                      label: getStationName(stations, departureStationCode),
                    }
                  : null
              }
              ListboxComponent={ListboxComponent}
              onChange={(e, option) =>
                this.handleSelectChange(option, 'departureStationCode')
              }
              disabled={readOnlyStatus}
              getOptionLabel={option =>
                option.value ? `${option.value} - ${option.label}` : ''
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label={t(`${sectionPath}.departureStationCode`) + ' *'}
                />
              )}
              renderOption={option => <SingleItem>{option.label}</SingleItem>}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControl>
              <InputLabel htmlFor="passengerTerminalDeparture">
                {t(`${sectionPath}.terminal`)}
              </InputLabel>
              <SelectInput
                name="passengerTerminalDeparture"
                onChange={this.handleChange}
                items={findTerminalsByStationCode(
                  stations,
                  departureStationCode
                )}
                value={passengerTerminalDeparture}
                disabled={readOnlyStatus}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6}>
            <Autocomplete
              name="arrivalStationCode"
              id="arrivalStationCode"
              options={prepareStations(stations)}
              value={
                arrivalStationCode
                  ? {
                      value: arrivalStationCode,
                      label: getStationName(stations, arrivalStationCode),
                    }
                  : null
              }
              ListboxComponent={ListboxComponent}
              onChange={(e, option) =>
                this.handleSelectChange(option, 'arrivalStationCode')
              }
              disabled={readOnlyStatus}
              getOptionLabel={option =>
                option.value ? `${option.value} - ${option.label}` : ''
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label={t(`${sectionPath}.arrivalStationCode`) + ' *'}
                />
              )}
              renderOption={option => <SingleItem>{option.label}</SingleItem>}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControl>
              <InputLabel htmlFor="passengerTerminalArrival">
                {t(`${sectionPath}.terminal`)}
              </InputLabel>
              <SelectInput
                name="passengerTerminalArrival"
                onChange={this.handleChange}
                items={findTerminalsByStationCode(stations, arrivalStationCode)}
                value={passengerTerminalArrival}
                disabled={readOnlyStatus}
              />
            </FormControl>
          </Grid>

          <TimePickers
            required
            beforeName={'startTime'}
            beforeLabel={t(`${sectionPath}.startTime`)}
            firstValue={startTime}
            afterName={'endTime'}
            afterLabel={t(`${sectionPath}.endTime`)}
            lastValue={endTime}
            onChange={this.handleChangePicker}
            disabled={readOnlyStatus}
          />

          <Grid item xs={6} sm={6}>
            <InputForm
              required
              id="aircraftType"
              label={t(`${sectionPath}.aircraftTypeCode`)}
              className={
                errors.aircraftTypeCode
                  ? 'error'
                  : readOnly
                  ? 'read-only-input'
                  : ''
              }
              color="secondary"
              error={errors.aircraftType}
              defaultValue={aircraftType}
              onChange={this.handleInputChange}
              maxLength={4}
              errorMessage={t(`${COMMERCIAL_FLIGHTS_ERRORS}.aircraftTypeCode`)}
              disabled={readOnlyStatus}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <InputForm
              id="aircraftConfigurationVersion"
              label={t(`${sectionPath}.aircraftConfigurationVersion`)}
              className={errors.aircraftConfigurationVersion ? 'error' : ''}
              color="secondary"
              error={errors.aircraftConfigurationVersion}
              defaultValue={aircraftConfigurationVersion}
              onChange={this.handleInputChange}
              maxLength={20}
              errorMessage={t(
                `${COMMERCIAL_FLIGHTS_ERRORS}.aircraftConfigurationVersion`
              )}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomText style={{ marginBottom: 10 }}>
              {t(`${sectionPath}.flightDates`)}
            </CustomText>
            <Calendar
              onCalendarUpdates={this.handleCalendarUpdates}
              flightDates={startDates}
              startDate={this.startDate}
              endDate={this.endDate}
              carryIn={CARRY_IN_DAYS}
              carryOut={CARRY_OUT_DAYS}
              t={t}
              disabled={readOnlyStatus}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  getInformationSection = () => {
    const { t, tagsSource, readOnly, enableReadOnly } = this.props;
    const { tags } = this.state;
    const sectionPath = COMMERCIAL_FLIGHTS_INFO;
    const readOnlyStatus = readOnly || enableReadOnly;
    return (
      <React.Fragment>
        <h2>{t(`${sectionPath}.title`)}</h2>
        <Grid container spacing={2} style={{ marginBottom: '30px' }}>
          <Grid item xs={12} sm={12}>
            <CustomText id="tags" style={{ marginBottom: 10 }}>
              {t(`${sectionPath}.tags`)}
            </CustomText>
            <AutocompleteChips
              chips={tags}
              chipsSource={tagsSource}
              onChipsUpdate={this.handleTagsUpdate}
              disabled={readOnlyStatus}
              label={t(`${sectionPath}.label`)}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  render() {
    const { selectedItem, t, readOnly, enableReadOnly, ...rest } = this.props;

    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();

    return (
      <Form
        okButton={getFormOkButton(t, selectedItem, readOnly)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={() => {}}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        {...rest}
        handleOk={this.handleSubmit}
      >
        <FormHeader>
          <span>
            {getFormHeading(
              t,
              selectedItem,
              readOnlyStatus,
              COMMERCIAL_FLIGHTS_FORM
            )}
          </span>
          <span>{name}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              {this.getGeneralSection()}
              {this.getInformationSection()}
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

CommercialFlightsForm.propTypes = {
  t: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  handleCrewComplements: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  airlines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  aircrafts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  tagsSource: PropTypes.arrayOf(PropTypes.string),
  enableReadOnly: PropTypes.bool,
};

CommercialFlightsForm.defaultProps = {
  selectedItem: null,
  stations: [],
  positions: [],
  airlines: [],
  services: [],
  aircrafts: [],
  tagsSource: [],
  enableReadOnly: false,
};

export default CommercialFlightsForm;
