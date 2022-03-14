import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';

import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import AddExtraTime from '../../../../components/DataContent/AddExtraTime/AddExtraTime';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';
import Sort from '../../../../utils/sortEngine';

import {
  ComboBox,
  InputForm,
  TimePickers,
  Switch,
  GeneralTitle,
  OpositeDirection,
  SwitchContainer,
  SingleItem,
} from './FormComponents';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListboxComponent from '../../../../components/ReactWindow/ListboxComponent';

import {
  hasError,
  getCustomPredicate,
  wereAllFieldsFilled,
  getDefaultName,
  getDefaultEntity,
  getDefaultErrors,
  mapEntityToState,
  formatObjectToArray,
  areValidExtraTimes,
  getStationName,
} from './utils';

import {
  COTERMINAL_GENERAL,
  COTERMINAL_TIMING,
  COTERMINAL_COST,
  COTERMINAL_FORM,
  COTERMINAL_ERRORS,
  COTERMINAL_FIELDS,
  prepareCreditPolicies,
  prepareTransportTypes,
  prepareTransportBillingPolicies,
} from './Constants';

class CoterminalTransportsForm extends Component {
  state = {
    ...getDefaultEntity(),
    isFormDirty: false,
    errors: getDefaultErrors(),
  };

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

  updateExtraTimeDetails = stateProperty => ({
    extraTimeDetails,
    extraTimeErrors,
  }) => {
    const { errors } = this.state;
    const extraTimes = formatObjectToArray(extraTimeDetails);
    errors[stateProperty] = formatObjectToArray(extraTimeErrors).reduce(
      (hasPrevErrors, extraTime) => {
        return hasPrevErrors || hasError(extraTime);
      },
      false
    );
    errors[stateProperty] =
      errors[stateProperty] || !areValidExtraTimes(extraTimes);

    this.setState(
      {
        [stateProperty]: extraTimes,
        errors,
      },
      this.checkFormIsReady
    );
  };

  handleChange = (e, shouldValidateForm = true) => {
    this.onChange(e.target.name, e.target.value, shouldValidateForm);
  };

  handleChangePicker = name => dateTime => {
    if (
      name === 'outboundFirstDepartureTime' &&
      this.state.outboundLastDepartureTime
    ) {
      this.setState(
        { outboundLastDepartureTime: '', [name]: dateTime },
        this.checkFormIsReady
      );
    } else {
      this.setState({ [name]: dateTime }, this.checkFormIsReady);
    }
  };

  handleInputChange = e => {
    const errors = this.updateErrors(e);

    this.setState(
      {
        errors,
        [e.target.name]: e.target.value,
      },
      this.checkFormIsReady
    );
  };

  handleAutocompleteChange = (option, fieldName) => {
    const value = option ? option.value : '';
    this.onChange(fieldName, value);
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

  handleSubmit = formRef => {
    const entity = pick(this.state, COTERMINAL_FIELDS);
    if (this.props.selectedItem) entity.id = this.props.selectedItem.id;
    entity.name = entity.name || getDefaultName(this.props.t, this.state);
    this.props.handleOk(formRef, entity);
  };

  handleSwitchChange = () => {
    const isBidirectional = !this.state.isBidirectional;
    this.setState({ isBidirectional }, this.checkFormIsReady);
  };

  getGeneralSection = () => {
    const { t, transportTypes, readOnly, enableReadOnly } = this.props;
    const {
      errors,
      departureStationCode,
      arrivalStationCode,
      name,
      typeCode,
      capacity,
      isBidirectional,
    } = this.state;
    const sectionPath = COTERMINAL_GENERAL;

    const sortedStations = new Sort(this.props.stations, {
      type: 'string',
      direction: 'inc',
      field: 'code',
    }).sort();

    const stationsSuggestions = sortedStations.map(({ code, name }) => ({
      value: code,
      label: `${code} - ${name}`,
    }));

    const departureStations = stationsSuggestions.filter(
      item => item.value !== arrivalStationCode
    );

    const arrivalStations = stationsSuggestions.filter(
      item => item.value !== departureStationCode
    );

    const readOnlyStatus = readOnly || enableReadOnly;

    return (
      <div>
        <GeneralTitle>
          <h2>{t(`${sectionPath}.title`)}</h2>
          <SwitchContainer>
            <p className={isBidirectional ? 'unchecked' : ''}>
              {t(`${sectionPath}.oneWay`)}
            </p>
            <Switch
              disabled={readOnlyStatus}
              onChange={this.handleSwitchChange}
              checked={isBidirectional}
              classes={{
                thumb: 'custom-icon',
                track: 'custom-bar',
                checked: 'custom-checked',
                switchBase: 'custom-base',
              }}
            />
            <p className={isBidirectional ? '' : 'unchecked'}>
              {t(`${sectionPath}.twoWay`)}
            </p>
          </SwitchContainer>
        </GeneralTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Autocomplete
              name="departureStationCode"
              id="departureStationCode"
              options={departureStations}
              value={
                departureStationCode
                  ? {
                      value: departureStationCode,
                      label: getStationName(
                        sortedStations,
                        departureStationCode
                      ),
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
          <Grid item xs={12} sm={12}>
            <Autocomplete
              name="arrivalStationCode"
              id="arrivalStationCode"
              options={arrivalStations}
              value={
                arrivalStationCode
                  ? {
                      value: arrivalStationCode,
                      label: getStationName(sortedStations, arrivalStationCode),
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
          <Grid item xs={12} sm={12}>
            <InputForm
              id="name"
              label={t(`${sectionPath}.name`)}
              className={errors.name ? 'error' : ''}
              color="secondary"
              error={errors.name}
              defaultValue={name}
              onChange={this.handleInputChange}
              maxLength={50}
              errorMessage={t(`${COTERMINAL_ERRORS}.name`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <ComboBox
              required
              name={'typeCode'}
              value={typeCode}
              onChange={this.handleChange}
              items={prepareTransportTypes(transportTypes)}
              label={t(`${sectionPath}.type`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputForm
              id="capacity"
              label={t(`${sectionPath}.capacity`)}
              className={errors.capacity ? 'error' : ''}
              color="secondary"
              error={errors.capacity}
              defaultValue={capacity}
              onChange={this.handleInputChange}
              errorMessage={t(`${COTERMINAL_ERRORS}.capacity`)}
              disabled={readOnlyStatus}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  getTimingSection = (
    t = this.props.t,
    readOnly = this.props.readOnly,
    enableReadOnly = this.props.enableReadOnly,
    sectionPath = COTERMINAL_TIMING,
    errors = this.state.errors,
    outboundDuration = this.state.outboundDuration,
    outboundConnectionTimeBefore = this.state.outboundConnectionTimeBefore,
    outboundConnectionTimeAfter = this.state.outboundConnectionTimeAfter,
    outboundFirstDepartureTime = this.state.outboundFirstDepartureTime,
    outboundLastDepartureTime = this.state.outboundLastDepartureTime,
    isBidirectional = this.state.isBidirectional
  ) => {
    return (
      <div>
        <h2>
          {isBidirectional
            ? t(`${sectionPath}.titleOutbound`)
            : t(`${sectionPath}.title`)}
        </h2>
        <Grid container spacing={2}>
          <TimePickers
            beforeName={'outboundFirstDepartureTime'}
            beforeLabel={t(`${sectionPath}.availabilityBetween`)}
            firstValue={outboundFirstDepartureTime}
            onChange={this.handleChangePicker}
            afterName={'outboundLastDepartureTime'}
            afterLabel={t(`${sectionPath}.availabilityAnd`)}
            lastValue={outboundLastDepartureTime}
            disabled={readOnly || enableReadOnly}
          />
          <Grid item xs={12} sm={12}>
            <InputForm
              id="outboundDuration"
              label={t(`${sectionPath}.duration`)}
              className={errors.outboundDuration ? 'error' : ''}
              required
              color="secondary"
              error={errors.outboundDuration}
              defaultValue={outboundDuration}
              maxLength={50}
              errorMessage={t(`${COTERMINAL_ERRORS}.duration`)}
              onChange={this.handleInputChange}
              disabled={readOnly || enableReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AddExtraTime
              t={t}
              extraTimeDetails={this.state.outboundExtraTravelTimes}
              updateExtraTimeDetails={this.updateExtraTimeDetails(
                'outboundExtraTravelTimes'
              )}
              disabled={readOnly || enableReadOnly}
            />
          </Grid>
          <Grid item xs={2} sm={12}>
            <span style={{ fontSize: 12 }}>{`${t(
              `${sectionPath}.minConnectionTime`
            )} *`}</span>
          </Grid>

          <Grid item xs={6} sm={6}>
            <InputForm
              id="outboundConnectionTimeBefore"
              label={t(`${sectionPath}.connectionTimeBefore`)}
              className={errors.outboundConnectionTimeBefore ? 'error' : ''}
              required
              color="secondary"
              error={errors.outboundConnectionTimeBefore}
              defaultValue={outboundConnectionTimeBefore}
              maxLength={50}
              errorMessage={t(`${COTERMINAL_ERRORS}.connectionTimeBeforeAfter`)}
              onChange={this.handleInputChange}
              disabled={readOnly || enableReadOnly}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputForm
              id="outboundConnectionTimeAfter"
              label={t(`${sectionPath}.connectionTimeAfter`)}
              className={errors.outboundConnectionTimeAfter ? 'error' : ''}
              required
              color="secondary"
              error={errors.outboundConnectionTimeAfter}
              defaultValue={outboundConnectionTimeAfter}
              maxLength={50}
              errorMessage={t(`${COTERMINAL_ERRORS}.connectionTimeBeforeAfter`)}
              onChange={this.handleInputChange}
              disabled={readOnly || enableReadOnly}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  getOpositeTimingSection = (
    t = this.props.t,
    readOnly = this.props.readOnly,
    enableReadOnly = this.props.enableReadOnly,
    sectionPath = COTERMINAL_TIMING,
    errors = this.state.errors,
    inboundDuration = this.state.inboundDuration,
    inboundConnectionTimeBefore = this.state.inboundConnectionTimeBefore,
    inboundConnectionTimeAfter = this.state.inboundConnectionTimeAfter,
    inboundFirstDepartureTime = this.state.inboundFirstDepartureTime,
    inboundLastDepartureTime = this.state.inboundLastDepartureTime,
    inboundExtraTravelTimes = this.state.inboundExtraTravelTimes
  ) => (
    <OpositeDirection>
      <h2>{t(`${sectionPath}.titleOposite`)}</h2>
      <Grid container spacing={2}>
        <TimePickers
          beforeName={'inboundFirstDepartureTime'}
          beforeLabel={t(`${sectionPath}.availabilityBetween`)}
          firstValue={inboundFirstDepartureTime}
          onChange={this.handleChangePicker}
          afterName={'inboundLastDepartureTime'}
          afterLabel={t(`${sectionPath}.availabilityAnd`)}
          lastValue={inboundLastDepartureTime}
          disabled={readOnly || enableReadOnly}
        />
        <Grid item xs={12} sm={12}>
          <InputForm
            id="inboundDuration"
            label={t(`${sectionPath}.duration`)}
            className={errors.inboundDuration ? 'error' : ''}
            required
            color="secondary"
            error={errors.inboundDuration}
            defaultValue={inboundDuration}
            maxLength={50}
            errorMessage={t(`${COTERMINAL_ERRORS}.duration`)}
            onChange={this.handleInputChange}
            disabled={readOnly || enableReadOnly}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <AddExtraTime
            t={t}
            extraTimeDetails={inboundExtraTravelTimes}
            updateExtraTimeDetails={this.updateExtraTimeDetails(
              'inboundExtraTravelTimes'
            )}
            disabled={readOnly || enableReadOnly}
          />
        </Grid>
        <Grid item xs={2} sm={12}>
          <span style={{ fontSize: 12 }}>{`${t(
            `${sectionPath}.minConnectionTime`
          )} *`}</span>
        </Grid>

        <Grid item xs={6} sm={6}>
          <InputForm
            id="inboundConnectionTimeBefore"
            label={t(`${sectionPath}.connectionTimeBefore`)}
            className={errors.inboundConnectionTimeBefore ? 'error' : ''}
            required
            color="secondary"
            error={errors.inboundConnectionTimeBefore}
            defaultValue={inboundConnectionTimeBefore}
            maxLength={50}
            errorMessage={t(`${COTERMINAL_ERRORS}.connectionTimeBeforeAfter`)}
            onChange={this.handleInputChange}
            disabled={readOnly || enableReadOnly}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <InputForm
            id="inboundConnectionTimeAfter"
            label={t(`${sectionPath}.connectionTimeAfter`)}
            className={errors.inboundConnectionTimeAfter ? 'error' : ''}
            required
            color="secondary"
            error={errors.inboundConnectionTimeAfter}
            defaultValue={inboundConnectionTimeAfter}
            maxLength={50}
            errorMessage={t(`${COTERMINAL_ERRORS}.connectionTimeBeforeAfter`)}
            onChange={this.handleInputChange}
            disabled={readOnly || enableReadOnly}
          />
        </Grid>
      </Grid>
    </OpositeDirection>
  );

  getCostSection = () => {
    const sectionPath = COTERMINAL_COST;
    const {
      t,
      creditPolicies,
      transportBillingPolicies,
      readOnly,
      enableReadOnly,
    } = this.props;
    const {
      errors,
      cost,
      currencyCode,
      billingPolicyCode,
      credit,
      creditPolicyCode,
    } = this.state;

    const currencies = this.props.currencies.map(c => ({
      value: c.code,
      display: c.code,
    }));
    const readOnlyStatus = readOnly || enableReadOnly;

    return (
      <div>
        <h2>{t(`${sectionPath}.title`)}</h2>
        <Grid container spacing={2}>
          <Grid item xs={5} sm={5}>
            <InputForm
              required
              id="cost"
              label={t(`${sectionPath}.cost`)}
              className={errors.cost ? 'error' : ''}
              color="secondary"
              error={errors.cost}
              defaultValue={cost}
              onChange={this.handleInputChange}
              maxLength={50}
              errorMessage={t(`${COTERMINAL_ERRORS}.cost`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={7} sm={7}>
            <Autocomplete
              name="currencyCode"
              id="currencyCode"
              options={currencies}
              value={
                currencyCode
                  ? {
                      value: currencyCode,
                    }
                  : null
              }
              ListboxComponent={ListboxComponent}
              onChange={(e, option) =>
                this.handleAutocompleteChange(option, 'currencyCode')
              }
              disabled={readOnlyStatus}
              getOptionLabel={option => (option.value ? option.value : '')}
              renderInput={params => (
                <TextField {...params} variant="standard" label={' '} />
              )}
              renderOption={option => <SingleItem>{option.value}</SingleItem>}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <ComboBox
              required
              name={'billingPolicyCode'}
              value={billingPolicyCode}
              onChange={this.handleChange}
              items={prepareTransportBillingPolicies(transportBillingPolicies)}
              label={t(`${sectionPath}.costBasis`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputForm
              required
              id="credit"
              label={t(`${sectionPath}.creditCost`)}
              className={errors.credit ? 'error' : ''}
              color="secondary"
              error={errors.credit}
              defaultValue={credit}
              onChange={this.handleInputChange}
              maxLength={50}
              errorMessage={t(`${COTERMINAL_ERRORS}.creditCost`)}
              disabled={readOnlyStatus}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <ComboBox
              required
              name={'creditPolicyCode'}
              value={creditPolicyCode}
              onChange={this.handleChange}
              items={prepareCreditPolicies(creditPolicies)}
              label={t(`${sectionPath}.creditScope`)}
              disabled={readOnlyStatus}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  render() {
    const { selectedItem, t, readOnly, enableReadOnly, ...rest } = this.props;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const name = this.state.name || getDefaultName(t, this.state);
    const idBidirectional = this.state.isBidirectional;

    return (
      <Form
        okButton={getFormOkButton(t, selectedItem)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={() => {}}
        anchor={'right'}
        {...rest}
        handleOk={this.handleSubmit}
        enableReadOnly={enableReadOnly}
      >
        <FormHeader>
          <span>
            {getFormHeading(t, selectedItem, readOnlyStatus, COTERMINAL_FORM)}
          </span>
          <span>{name}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              {this.getGeneralSection()}
              {this.getTimingSection()}
              {idBidirectional && this.getOpositeTimingSection()}
              {this.getCostSection()}
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

CoterminalTransportsForm.propTypes = {
  t: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
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
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  creditPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
  readOnly: PropTypes.bool.isRequired,
  enableReadOnly: PropTypes.bool,
};

CoterminalTransportsForm.defaultProps = {
  selectedItem: null,
  stations: [],
  currencies: [],
  enableReadOnly: false,
};

export default CoterminalTransportsForm;
