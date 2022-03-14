import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';

import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import StandardCrewComplement from '../../../../components/StandardCrewComplement';
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
  AutoCompleteForm,
  SingleItem,
} from './FormComponents';

import {
  getDefaultEntity,
  getDefaultErrors,
  mapEntityToState,
  hasError,
  wereAllFieldsFilled,
  getCustomPredicate,
  prepareSelectData,
  prepareSelectDataForAirCraftType,
  prepareStations,
  prepareServices,
  findTerminalsByStationCode,
  sanitizeFlight,
  getStationName,
} from './helpers';

import {
  OPERATING_FLIGHTS_FIELDS,
  OPERATING_FLIGHTS_GENERAL,
  OPERATING_FLIGHTS_FORM,
  OPERATING_FLIGHTS_ERRORS,
  OPERATING_FLIGHTS_CREW,
  OPERATING_FLIGHTS_INFO,
  OPERATING_FLIGHTS_TIME,
} from './constants';

class OperatingFlightsForm extends Component {
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

  handleAutocompleteChange = (option, stateProperty) => {
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

  handleSelectChange = stateProperty => value => {
    this.setState({ [stateProperty]: value }, this.checkFormIsReady);
  };

  handleInputChange = e => {
    const errors = this.updateErrors(e);
    const targetName = e.target.name;
    const targetValue =
      targetName === 'aircraftConfigurationVersion'
        ? e.target.value.trim().toUpperCase()
        : e.target.value;

    let newState = {
      errors,
      [targetName]: targetValue,
      onwardOffsetIsDisabled: false,
    };

    if (targetName === 'onwardFlightDesignator') {
      if (!targetValue) {
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
    const entity = sanitizeFlight(pick(this.state, OPERATING_FLIGHTS_FIELDS));
    const id = this.props.selectedItem ? this.props.selectedItem.id : null;

    const flightInstances = entity.flightInstances.map(flight => {
      return flight.id;
    });

    entity.flightInstances = flightInstances;

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
    const {
      t,
      airlines,
      stations,
      aircrafts,
      services,
      readOnly,
      enableReadOnly,
    } = this.props;

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
      serviceTypeCode,
      onwardFlightDesignator,
      onwardFlightDayOffset,
      onwardOffsetIsDisabled,
      aircraftTypeCode,
      aircraftConfigurationVersion,
      tailNumber,
      deadheadSeatsNumber,
      startDates,
    } = this.state;
    const sectionPath = OPERATING_FLIGHTS_GENERAL;
    const readOnlyStatus = readOnly || enableReadOnly;

    return (
      <div>
        <GeneralTitle>
          <h2>{t(`${sectionPath}.title`)}</h2>
        </GeneralTitle>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={4}>
            <FormControl required>
              <InputLabel htmlFor="typeCode">
                {t(`${sectionPath}.airlineIdentifier`)}
              </InputLabel>
              <SelectInput
                name="airlineCode"
                onChange={this.handleChange}
                items={prepareSelectData(airlines)}
                value={airlineCode}
                disabled={readOnlyStatus}
              />
            </FormControl>
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
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.flightNumber`)}
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
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.operationalSuffix`)}
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
                this.handleAutocompleteChange(option, 'departureStationCode')
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
                this.handleAutocompleteChange(option, 'arrivalStationCode')
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

          <Grid item xs={12} sm={12}>
            <AutoCompleteForm
              id={'serviceTypeCode'}
              label={t(`${sectionPath}.serviceTypeCode`)}
              suggestions={prepareServices(services)}
              onChange={this.handleSelectChange('serviceTypeCode')}
              t={t}
              value={serviceTypeCode}
              defaultValue={serviceTypeCode}
              error={errors.serviceTypeCode}
              disabled={readOnlyStatus}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <InputForm
              id="onwardFlightDesignator"
              label={t(`${sectionPath}.onwardFlightDesignator`)}
              className={errors.onwardFlightDesignator ? 'error' : ''}
              color="secondary"
              error={errors.onwardFlightDesignator}
              value={onwardFlightDesignator}
              defaultValue={''}
              onChange={this.handleInputChange}
              maxLength={7}
              errorMessage={t(
                `${OPERATING_FLIGHTS_ERRORS}.onwardFlightDesignator`
              )}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="onwardFlightDayOffset"
              label={t(`${sectionPath}.onwardFlightDayOffset`)}
              className={errors.onwardFlightDayOffset ? 'error' : ''}
              color="secondary"
              error={errors.onwardFlightDayOffset}
              defaultValue={''}
              value={onwardFlightDayOffset}
              onChange={this.handleInputChange}
              maxLength={2}
              disabled={readOnlyStatus || onwardOffsetIsDisabled}
              errorMessage={t(
                `${OPERATING_FLIGHTS_ERRORS}.onwardFlightDayOffset`
              )}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <FormControl required>
              <InputLabel htmlFor="aircraftTypeCode">
                {t(`${sectionPath}.aircraftTypeCode`)}
              </InputLabel>
              <SelectInput
                name="aircraftTypeCode"
                onChange={this.handleChange}
                items={prepareSelectDataForAirCraftType(aircrafts)}
                value={aircraftTypeCode}
                disabled={readOnlyStatus}
              />
            </FormControl>
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
                `${OPERATING_FLIGHTS_ERRORS}.aircraftConfigurationVersion`
              )}
              disabled={readOnlyStatus}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <InputForm
              id="tailNumber"
              label={t(`${sectionPath}.tailNumber`)}
              className={errors.tailNumber ? 'error' : ''}
              color="secondary"
              error={errors.tailNumber}
              defaultValue={tailNumber}
              onChange={this.handleInputChange}
              maxLength={25}
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.tailNumber`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="deadheadSeatsNumber"
              label={t(`${sectionPath}.deadheadSeatsNumber`)}
              className={errors.deadheadSeatsNumber ? 'error' : ''}
              color="secondary"
              error={errors.deadheadSeatsNumber}
              defaultValue={deadheadSeatsNumber}
              onChange={this.handleInputChange}
              maxLength={3}
              errorMessage={t(
                `${OPERATING_FLIGHTS_ERRORS}.deadheadSeatsNumber`
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

  getCrewSection = () => {
    const { t, openItemId, readOnly, enableReadOnly } = this.props;
    const { crewComposition } = this.state;
    const sectionPath = OPERATING_FLIGHTS_CREW;
    const readOnlyStatus = readOnly || enableReadOnly;
    return (
      <React.Fragment>
        <h2>{t(`${sectionPath}.title`)}</h2>
        <StandardCrewComplement
          id="crewComposition"
          t={t}
          onChange={this.handleCrewComplements}
          defaultValues={crewComposition}
          openItemId={openItemId}
          disabled={readOnlyStatus}
        />
      </React.Fragment>
    );
  };

  getTimeSection = () => {
    const { t, readOnly, enableReadOnly } = this.props;
    const {
      errors,
      extraBriefingFlightDeck,
      extraBriefingCabin,
      extraDebriefingFlightDeck,
      extraDebriefingCabin,
    } = this.state;
    const sectionPath = OPERATING_FLIGHTS_TIME;
    const readOnlyStatus = readOnly || enableReadOnly;

    const customStyle = {
      paddingBottom: 0,
    };

    return (
      <React.Fragment>
        <h2>{t(`${sectionPath}.title`)}</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} style={customStyle}>
            <CustomText>{t(`${sectionPath}.cabin`)}</CustomText>
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="extraBriefingCabin"
              label={t(`${sectionPath}.extraBriefing`)}
              className={errors.extraBriefingCabin ? 'error' : ''}
              color="secondary"
              error={errors.extraBriefingCabin}
              defaultValue={extraBriefingCabin}
              onChange={this.handleInputChange}
              maxLength={3}
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.extraBriefing`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="extraDebriefingCabin"
              label={t(`${sectionPath}.extraDebriefing`)}
              className={errors.extraDebriefingCabin ? 'error' : ''}
              color="secondary"
              error={errors.extraDebriefingCabin}
              defaultValue={extraDebriefingCabin}
              onChange={this.handleInputChange}
              maxLength={3}
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.extraBriefing`)}
              disabled={readOnlyStatus}
            />
          </Grid>

          <Grid item xs={12} sm={12} style={customStyle}>
            <CustomText>{t(`${sectionPath}.pilot`)}</CustomText>
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="extraBriefingFlightDeck"
              label={t(`${sectionPath}.extraBriefing`)}
              className={errors.extraBriefingFlightDeck ? 'error' : ''}
              color="secondary"
              error={errors.extraBriefingFlightDeck}
              defaultValue={extraBriefingFlightDeck}
              onChange={this.handleInputChange}
              maxLength={3}
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.extraBriefing`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="extraDebriefingFlightDeck"
              label={t(`${sectionPath}.extraDebriefing`)}
              className={errors.extraDebriefingFlightDeck ? 'error' : ''}
              color="secondary"
              error={errors.extraDebriefingFlightDeck}
              defaultValue={extraDebriefingFlightDeck}
              onChange={this.handleInputChange}
              maxLength={3}
              errorMessage={t(`${OPERATING_FLIGHTS_ERRORS}.extraBriefing`)}
              disabled={readOnlyStatus}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  getInformationSection = () => {
    const { t, tagsSource, readOnly, enableReadOnly } = this.props;
    const { tags } = this.state;
    const sectionPath = OPERATING_FLIGHTS_INFO;
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
        okButton={getFormOkButton(t, selectedItem)}
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
              OPERATING_FLIGHTS_FORM
            )}
          </span>
          <span>{name}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              {this.getGeneralSection()}
              {this.getCrewSection()}
              {this.getTimeSection()}
              {this.getInformationSection()}
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

OperatingFlightsForm.propTypes = {
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
};

OperatingFlightsForm.defaultProps = {
  selectedItem: null,
  stations: [],
  positions: [],
  airlines: [],
  services: [],
  aircrafts: [],
  tagsSource: [],
};

export default OperatingFlightsForm;
