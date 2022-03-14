import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { parseDate } from './../../utils/utils';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DateFnsUtils from '@date-io/date-fns';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Icon from '../../../../components/Icon';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import {
  TimePicker,
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBodyUI from '../../../../components/FormDrawer/FormBody';
import TransitCardsForm from './TransitCardsForm';
import { getFormattedTime } from '../../../../utils/dates';
import { ACC_NAME_REGEX, prepareAccommodationTypes } from './Constants';
import './FormComponents.css';
import {
  PER_24H_BLOCKS,
  CHECKIN_CHECKOUT,
} from './../../../../_shared/configurationEntities';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';

import ListboxComponent from '../../../../components/ReactWindow/ListboxComponent';

import {
  CurrencyGrid,
  CheckInOutGrid,
  Input,
  FormControl,
  PickersWrapper,
  SelectInput,
  Switch,
  DefaultValue,
  Label,
} from './FormComponents';

import {
  isReadyToSubmit,
  countDecimals,
  evaluateRegex,
  formatInverseTransitDetails,
} from './utils';

const TransitContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const FormBody = styled(FormBodyUI)`
  padding-bottom: 0;
`;

const StyledAutoComplete = styled(Autocomplete)`
  & .MuiAutocomplete-tag {
    height: 24px;
    width: 65px;
    & span {
      padding-left: 5px;
      padding-right: 10px;
      font-size: 13px;
      color: #000000;
    }
    & svg {
      height: 18px;
      width: 18px;
      color: #b2b2b2;
    }
  }
`;

const SingleItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 260px;
  display: block;
`;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class AccommodationsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormDirty: false,
      name: '',
      stations: [],
      autoStations: [],
      typeCode: '',
      capacity: '',
      extendedStayCostFactor: '',
      contractStartDate: null,
      contractLastDate: null,
      cost: '',
      currencyCode: '',
      checkInTime: '',
      checkOutTime: '',
      billingPolicyCode: this.props.accommodation
        ? this.props.accommodation.billingPolicyCode
        : PER_24H_BLOCKS,
      defaultTransits: true,
      errors: {
        name: false,
        capacity: false,
        cost: false,
        extendedStayCostFactor: false,
      },
    };
    this.transitDetails = {};
    this.transitErrors = {};
  }

  componentWillReceiveProps(nextProps) {
    const autoStationCodes =
      nextProps.accommodation &&
      nextProps.accommodation.stationCodes.map(station => {
        return { value: station };
      });
    if (nextProps.isOpen) {
      this.setState({
        isFormDirty: false,
        defaultTransits:
          nextProps.accommodation &&
          nextProps.accommodation.stationCodes.length !== 0
            ? false
            : true,
        name: nextProps.accommodation ? nextProps.accommodation.name : '',
        stations: nextProps.accommodation
          ? nextProps.accommodation.stationCodes
          : [],
        autoStations: nextProps.accommodation ? autoStationCodes : [],
        typeCode: nextProps.accommodation
          ? nextProps.accommodation.typeCode
          : '',
        capacity: nextProps.accommodation
          ? nextProps.accommodation.capacity
          : '',
        extendedStayCostFactor: nextProps.accommodation
          ? nextProps.accommodation.extendedStayCostFactor
          : '',
        contractLastDate: nextProps.accommodation
          ? parseDate(nextProps.accommodation.contractLastDate)
          : null,
        contractStartDate: nextProps.accommodation
          ? parseDate(nextProps.accommodation.contractStartDate)
          : null,
        cost: nextProps.accommodation ? nextProps.accommodation.cost : '',
        currencyCode: nextProps.accommodation
          ? nextProps.accommodation.currencyCode
          : '',
        checkInTime: nextProps.accommodation
          ? getFormattedTime(nextProps.accommodation.checkInTime)
          : '',
        checkOutTime: nextProps.accommodation
          ? getFormattedTime(nextProps.accommodation.checkOutTime)
          : '',
        billingPolicyCode: nextProps.accommodation
          ? nextProps.accommodation.billingPolicyCode
          : PER_24H_BLOCKS,
        errors: {
          name: false,
          capacity: false,
          cost: false,
          extendedStayCostFactor: false,
        },
      });

      this.transitDetails = nextProps.accommodation
        ? formatInverseTransitDetails(nextProps.accommodation.transports)
        : {};

      this.transitErrors = {};
    }
  }

  handleChange = e => {
    let changeValue = true;
    const targetName = e.target.name;

    if (targetName === 'billingPolicyCode') {
      this.setState(
        {
          [targetName]: e.target.value,
          checkInTime: null,
          checkOutTime: null,
        },
        () => {
          this.checkFormIsReady(this.state);
        }
      );
      return;
    }
    if (targetName === 'cost') {
      if (!isNaN(parseFloat(e.target.value))) {
        const decimals = countDecimals(e.target.value);

        if (decimals > 2) {
          changeValue = false;
        }
      }
    }
    if (changeValue) {
      this.setState({ [targetName]: e.target.value }, () => {
        this.checkFormIsReady(this.state);
      });
    }
  };

  handleStationChange = (e, options = []) => {
    const staionsValue = options.map(opt => opt.value);
    const autoStaionsValue = options.map(opt => ({ value: opt.value }));

    // To prevent adding more than 10 stations
    if (this.state.stations.length >= 10 && staionsValue.length) {
      const index = this.state.stations.indexOf(
        staionsValue[staionsValue.length - 1]
      );
      if (index === -1) return;
    }

    this.setState(
      { stations: staionsValue, autoStations: autoStaionsValue },
      () => {
        this.checkFormIsReady(this.state);
        if (this.state.defaultTransits) {
          this.onDefTransitChange();
        }
      }
    );
  };

  handleChangePicker = name => dateTime => {
    if (name === 'contractStartDate' && this.state.contractLastDate) {
      this.setState({ contractLastDate: null, [name]: dateTime });
    } else {
      this.setState({ [name]: dateTime }, () => {
        this.checkFormIsReady(this.state);
      });
    }
  };

  handleBlur = (e, regex: '') => {
    const event = e.target || e.srcElement;
    const isError =
      event.value === '' ? false : !evaluateRegex(regex, event.value);
    this.setState(
      {
        errors: {
          ...this.state.errors,
          [event.name]: isError,
        },
      },
      () => this.checkFormIsReady(this.state)
    );
  };

  checkFormIsReady(state) {
    this.setState({
      isFormDirty: isReadyToSubmit(
        state,
        this.transitDetails,
        this.transitErrors,
        state.defaultTransits
      ),
    });
  }

  verifyNumber = (min, max, type: 'float') => e => {
    const val = e.target.value;
    const name = e.target.name;

    if (
      type === 'integer' &&
      !Number.isInteger(parseFloat(val)) &&
      val !== ''
    ) {
      this.setState({ errors: { ...this.state.errors, [name]: true } }, () =>
        this.checkFormIsReady(this.state)
      );
    } else {
      if (isNaN(val) || parseFloat(val) < min || parseFloat(val) > max) {
        this.setState({ errors: { ...this.state.errors, [name]: true } }, () =>
          this.checkFormIsReady(this.state)
        );
      } else {
        this.setState({ errors: { ...this.state.errors, [name]: false } }, () =>
          this.checkFormIsReady(this.state)
        );
      }
    }
  };

  verifyFloatNumber = e => {
    const event = e.target || e.srcElement;
    const val = event.value;
    const name = event.name;
    const valueArr = val.split('');
    const isError =
      isNaN(val) || parseFloat(val) <= 0 || valueArr.indexOf('e') !== -1;

    this.setState({ errors: { ...this.state.errors, [name]: isError } }, () =>
      this.checkFormIsReady(this.state)
    );
  };

  filterTransitDetails = () => {
    // eslint-disable-next-line  guard-for-in
    for (const transist in this.transitDetails) {
      if (!this.state.stations.includes(transist)) {
        delete this.transitDetails[transist];
      }
    }
  };

  handleSubmit = formRef => {
    formRef.name.blur();
    formRef.capacity.blur();
    formRef.cost.blur();
    formRef.extendedStayCostFactor.blur();

    const { name, capacity, cost, extendedStayCostFactor } = this.state.errors;

    if (!name && !capacity && !cost && !extendedStayCostFactor) {
      this.filterTransitDetails();
      this.props.handleOk(
        formRef,
        this.transitDetails,
        this.state.defaultTransits
      );
    }
  };

  handleBlurCheck = () => {
    this.checkFormIsReady(this.state);
  };

  onDefTransitChange = () => {
    this.setState({
      defaultTransits: !this.state.defaultTransits,
      isFormDirty: isReadyToSubmit(
        this.state,
        this.transitDetails,
        this.transitErrors,
        !this.state.defaultTransits
      ),
    });
  };

  updateTransitDetails = (transitDetails, transitErrors) => {
    this.transitDetails = transitDetails;
    this.transitErrors = transitErrors;

    this.checkFormIsReady(this.state);
  };

  render() {
    const {
      name,
      stations,
      autoStations,
      typeCode,
      capacity,
      contractStartDate,
      contractLastDate,
      cost,
      currencyCode,
      errors,
      billingPolicyCode,
      checkInTime,
      checkOutTime,
      extendedStayCostFactor,
      defaultTransits,
    } = this.state;
    const {
      accommodation,
      accommodationTypes,
      accommodationBillingPolicies,
      transportBillingPolicies,
      suggestions,
      currencies,
      readOnly,
      t,
      enableReadOnly,
      ...rest
    } = this.props;

    const addAccommodations = 'DATA.accommodations.form';
    const form = 'DATA.accommodations.form.section';
    const errorMsg = 'ERRORS.ACCOMMODATIONS';
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = !accommodation
      ? isReadyToSubmit(
          this.state,
          this.transitDetails,
          this.transitErrors,
          defaultTransits
        )
      : readOnlyStatus
      ? true
      : this.state.isFormDirty;
    return (
      <Form
        okButton={getFormOkButton(t, accommodation)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={!isDisabled}
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
              accommodation,
              readOnlyStatus,
              addAccommodations
            )}
          </span>
          <span>{name}</span>
        </FormHeader>

        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${form}.general.title`)}</h2>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.name}>
                    <Input
                      inputProps={{
                        name: 'name',
                        maxLength: 50,
                      }}
                      className={errors.name ? 'error' : ''}
                      id="name"
                      label={t(`${form}.general.name`)}
                      color="secondary"
                      defaultValue={name}
                      error={errors.name}
                      disabled={readOnlyStatus}
                      required
                      onChange={e => {
                        this.handleChange(e);
                        this.handleBlur(e, ACC_NAME_REGEX);
                      }}
                    />
                    <ErrorMessage
                      isVisible={errors.name}
                      message={t(`${errorMsg}.name`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <StyledAutoComplete
                      multiple
                      name="stations"
                      id="stations"
                      options={suggestions}
                      value={autoStations}
                      ListboxComponent={ListboxComponent}
                      onChange={this.handleStationChange}
                      disableCloseOnSelect
                      disabled={readOnlyStatus}
                      getOptionLabel={option => option.value}
                      getOptionSelected={(option, value) =>
                        option.value === value.value
                      }
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          <SingleItem>{option.display}</SingleItem>
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="standard"
                          label={t(`${form}.general.served`) + ' *'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <InputLabel htmlFor="typeCode">
                      {t(`${form}.general.typeOfAccommodation`)}
                    </InputLabel>
                    <SelectInput
                      name="typeCode"
                      onChange={this.handleChange}
                      onBlur={this.handleBlurCheck}
                      items={prepareAccommodationTypes(accommodationTypes)}
                      value={typeCode}
                      disabled={readOnlyStatus}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.capacity}>
                    <Input
                      inputProps={{
                        name: 'capacity',
                        maxLength: 4,
                      }}
                      className={errors.capacity ? 'error' : ''}
                      id="capacity"
                      label={t(`${form}.general.negotiatedRooms`)}
                      color="secondary"
                      defaultValue={capacity}
                      error={errors.capacity}
                      onChange={e => {
                        this.handleChange(e);
                        this.verifyNumber(0, 1000, 'integer')(e);
                      }}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.capacity}
                      message={t(`${errorMsg}.capacity`)}
                    />
                  </FormControl>
                </Grid>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <PickersWrapper>
                    <Grid item xs={5} sm={5}>
                      <DatePicker
                        id="contractStartDate"
                        name="contractStartDate"
                        className="picker-field"
                        label={t(`${form}.general.contractStartDate`)}
                        format="yyyy/MM/dd"
                        value={contractStartDate}
                        onChange={this.handleChangePicker('contractStartDate')}
                        required
                        disabled={readOnlyStatus}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment style={{ cursor: 'pointer' }}>
                              <Icon margin="0" iconcolor="#0A75C2">
                                date_range
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={5} sm={5}>
                      <DatePicker
                        id="contractLastDate"
                        name="contractLastDate"
                        required
                        disabled={
                          readOnlyStatus || (contractStartDate ? false : true)
                        }
                        minDate={contractStartDate}
                        label={t(`${form}.general.contractEndDate`)}
                        format="yyyy/MM/dd"
                        value={contractStartDate ? contractLastDate : null}
                        onChange={this.handleChangePicker('contractLastDate')}
                        minDateMessage={t(`${errorMsg}.endDate`)}
                        className={
                          contractLastDate < contractStartDate &&
                          contractLastDate !== null
                            ? 'picker-field error'
                            : 'picker-field'
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment style={{ cursor: 'pointer' }}>
                              <Icon margin="0" iconcolor="#0A75C2">
                                date_range
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </PickersWrapper>
                </MuiPickersUtilsProvider>
              </Grid>
              <h2>{t(`${form}.cost.title`)}</h2>

              <CurrencyGrid container spacing={2} style={{ fontSize: 0 }}>
                <span className="nightly">
                  {t(`${form}.cost.nightlyRate`)} *
                </span>
                <div className="first">
                  <FormControl error={errors.cost}>
                    <Input
                      inputProps={{
                        name: 'cost',
                        maxLength: 10,
                      }}
                      className={errors.cost ? 'error' : ''}
                      id="cost"
                      placeholder={t(`${form}.cost.price`)}
                      color="secondary"
                      value={cost}
                      error={errors.cost}
                      onChange={e => {
                        this.handleChange(e);
                        this.verifyFloatNumber(e);
                      }}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.cost}
                      message={t(`${errorMsg}.cost`)}
                    />
                  </FormControl>
                </div>
                <div className="last">
                  <FormControl>
                    <Select
                      value={currencyCode}
                      onChange={this.handleChange}
                      onBlur={this.handleBlurCheck}
                      name="currencyCode"
                      inputProps={{ name: 'currencyCode', id: 'currencyCode' }}
                      disabled={readOnlyStatus}
                    >
                      {currencies.map((c, k) => (
                        <MenuItem key={k} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </CurrencyGrid>
              <CheckInOutGrid item xs={12} sm={12}>
                <span className="title">
                  {t(`${form}.cost.nightsCalculatedBy`)} *
                </span>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="billingPolicyCode"
                    value={billingPolicyCode}
                    onChange={this.handleChange}
                    disabled={readOnlyStatus}
                  >
                    {accommodationBillingPolicies.map(policy => (
                      <FormControlLabel
                        key={policy.code}
                        value={policy.code}
                        control={<Radio color="primary" />}
                        label={policy.name}
                        disabled={readOnlyStatus}
                      />
                    ))}
                  </RadioGroup>
                  <input
                    type="hidden"
                    value={billingPolicyCode}
                    name="billingPolicyCodeHiddenInput"
                  />
                </FormControl>
                {billingPolicyCode === CHECKIN_CHECKOUT && (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <PickersWrapper padding="0px 0 19px 0">
                      <Grid item xs={5} sm={5} style={{ marginRight: 30 }}>
                        <TimePicker
                          name="checkInTime"
                          id="checkInTime"
                          ampm={false}
                          required
                          label={t(`${form}.cost.checkInTime`)}
                          placeholder={'HH:MM'}
                          value={checkInTime ? checkInTime : null}
                          onChange={this.handleChangePicker('checkInTime')}
                          style={{ width: '100%' }}
                          disabled={readOnlyStatus}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment style={{ cursor: 'pointer' }}>
                                <AccessTimeIcon
                                  margin="0"
                                  style={{ color: '#0A75C2' }}
                                >
                                  alarm
                                </AccessTimeIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={5} sm={5}>
                        <TimePicker
                          name="checkOutTime"
                          id="checkOutTime"
                          ampm={false}
                          required
                          label={t(`${form}.cost.checkOutTime`)}
                          placeholder={'HH:MM'}
                          value={checkOutTime ? checkOutTime : null}
                          onChange={this.handleChangePicker('checkOutTime')}
                          disabled={
                            readOnlyStatus || (checkInTime ? false : true)
                          }
                          style={{ width: '100%' }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment style={{ cursor: 'pointer' }}>
                                <AccessTimeIcon
                                  margin="0"
                                  style={{ color: '#0A75C2' }}
                                >
                                  alarm
                                </AccessTimeIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </PickersWrapper>
                  </MuiPickersUtilsProvider>
                )}
              </CheckInOutGrid>

              <Grid
                item
                xs={12}
                sm={12}
                style={{ fontSize: 0, marginBottom: 20 }}
              >
                <FormControl error={errors.extendedStayCostFactor}>
                  <Input
                    inputProps={{
                      name: 'extendedStayCostFactor',
                    }}
                    className={errors.extendedStayCostFactor ? 'error' : ''}
                    id="extendedStayCostFactor"
                    label={t(`${form}.cost.costExtendedStay`)}
                    color="secondary"
                    defaultValue={extendedStayCostFactor}
                    error={errors.extendedStayCostFactor}
                    onChange={e => {
                      this.handleChange(e);
                      this.verifyNumber(0, 100)(e);
                    }}
                    disabled={readOnlyStatus}
                  />
                  <ErrorMessage
                    isVisible={errors.extendedStayCostFactor}
                    message={t(`${errorMsg}.costExtendedStay`)}
                  />
                </FormControl>
              </Grid>

              <h2>{t(`${form}.transit.title`)}</h2>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <Label
                      control={
                        <Switch
                          onChange={this.onDefTransitChange}
                          checked={defaultTransits}
                          color={'primary'}
                          disabled={readOnlyStatus}
                        />
                      }
                      label={t(`${form}.transit.defTransitFlag`)}
                      labelPlacement="start"
                    />
                  </FormControl>
                </Grid>
                {defaultTransits && (
                  <React.Fragment>
                    <Grid item xs={12} sm={12}>
                      <DefaultValue>
                        <InputLabel>
                          {t(`${form}.transit.defTransitTime`)}
                        </InputLabel>
                        <p>{t(`${form}.transit.defTransitTimeVal`)}</p>
                      </DefaultValue>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <DefaultValue>
                        <InputLabel>
                          {t(`${form}.transit.defTransitCost`)}
                        </InputLabel>
                        <p>{t(`${form}.transit.defTransitCostVal`)}</p>
                      </DefaultValue>
                    </Grid>
                  </React.Fragment>
                )}
                {!defaultTransits && (
                  <TransitContainer>
                    <TransitCardsForm
                      currencies={currencies}
                      stations={stations}
                      t={t}
                      transitDetails={this.transitDetails}
                      transitErrors={this.transitErrors}
                      updateTransitDetails={this.updateTransitDetails}
                      selectedAccommodation={accommodation}
                      transportBillingPolicies={transportBillingPolicies}
                      disabled={readOnlyStatus}
                    />
                  </TransitContainer>
                )}
              </Grid>
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

AccommodationsForm.propTypes = {
  t: PropTypes.func.isRequired,
  accommodation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    stations: PropTypes.string,
    typeCode: PropTypes.string,
    capacity: PropTypes.number,
    name: PropTypes.string,
    billingPolicyCode: PropTypes.string,
    extendedStayCostFactor: PropTypes.number,
    contractLastDate: PropTypes.string,
    contractStartDate: PropTypes.string,
    currencyCode: PropTypes.string,
    checkOutTime: PropTypes.string,
    checkInTime: PropTypes.string,
    cost: PropTypes.number,
  }),
  accommodationTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  currencies: PropTypes.arrayOf(PropTypes.string),
  readOnly: PropTypes.bool.isRequired,
};

AccommodationsForm.defaultProps = {
  accommodation: {},
  suggestions: [],
  currencies: [],
};

export default AccommodationsForm;
