import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { AutoCompleteForm } from './../../../../components/FormComponents';
import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';

import Sort from '../../../../utils/sortEngine';
import { getCountries } from '../../../../services/Data/countries';
import { getStations } from '../../../../services/Data/stations';
import { getInlineErrorMessage } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';

import ListboxComponent from '../../../../components/ReactWindow/ListboxComponent';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;
const FormControl = styled(MUIFormControl)`
  width: 100%;
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

class CrewBasesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseCode: '',
      baseName: '',
      country: null,
      countryCode: null,
      countries: [],
      stationSuggestions: [],
      stationCodes: [],
      autoStationCodes: [],
      isFormDirty: false,
      errors: {
        baseCode: false,
        baseName: false,
      },
    };

    this.allStationsSuggestions = [];
  }

  formatBases_DEPRECATED = bases => {
    return bases.map(
      base => `{"code": "${base.code}", "name": "${base.name}"}`
    );
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      const autoStationCodes =
        nextProps.crewBase &&
        nextProps.crewBase.stationCodes.map(station => {
          return { value: station };
        });
      this.setState(
        {
          baseCode: nextProps.crewBase ? nextProps.crewBase.code : '',
          baseName: nextProps.crewBase ? nextProps.crewBase.name : '',
          countryCode: nextProps.crewBase ? nextProps.crewBase.countryCode : '',
          countryName: nextProps.crewBase
            ? nextProps.crewBase.countryName
            : null,
          stationCodes: nextProps.crewBase
            ? nextProps.crewBase.stationCodes
            : [],
          autoStationCodes: nextProps.crewBase ? autoStationCodes : [],
          stationSuggestions:
            nextProps.crewBase && nextProps.crewBase.countryCode
              ? this.filterStations(nextProps.crewBase.countryCode)
              : this.formatStations(this.allStationsSuggestions),
          isFormDirty: false,
          errors: {
            baseCode: false,
            baseName: false,
          },
        },
        () => this.props.updateBases(this.state.stationCodes)
      );
    }

    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkIfFormisReady);
    }
  }

  formatCountries = countries => {
    return countries.data.map(country => ({
      value: country.code,
      label: `${country.name}, ${country.code}`,
    }));
  };

  componentDidMount() {
    const openItemId = this.props.openItemId;
    Promise.all([getStations(openItemId), getCountries(openItemId)])
      .then(([stations, countries]) => {
        this.allStationsSuggestions = stations.data;
        this.setState({
          stationSuggestions: this.formatStations(stations.data),
          countries: this.formatCountries(countries),
        });
      })
      .catch(err => console.log(err));
  }

  formatStations = stations => {
    const sortedStations = new Sort(stations, {
      type: 'string',
      direction: 'inc',
      field: 'code',
    }).sort();
    return sortedStations.map(station => {
      const display = station.name
        ? `${station.code} - ${station.name}`
        : `${station.code}`;

      return {
        display,
        value: station.code,
      };
    });
  };
  setStations = () => {
    this.setState({
      stationSuggestions: this.formatStations(this.allStationsSuggestions),
    });
  };

  filterStations = countryCode => {
    return this.formatStations(
      this.allStationsSuggestions.filter(
        station => station.countryCode === countryCode
      )
    );
  };

  onSelectChange = value => {
    this.setState(
      {
        countryCode: value,
        stationCodes: [],
        autoStationCodes: [],
        stationSuggestions: !value
          ? this.formatStations(this.allStationsSuggestions)
          : this.filterStations(value),
      },
      () => {
        this.onFormChange();
      }
    );
  };

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  checkIfFormisReady = () => {
    const node_baseName = document.getElementById('baseName');
    const baseName = node_baseName ? node_baseName.value.trim() : '';
    const { errors, stationCodes, isFormDirty, baseCode } = this.state;
    const isError = errors.baseCode || errors.baseName;

    if (
      baseCode !== '' &&
      baseName !== '' &&
      !isError &&
      stationCodes.length !== 0
    ) {
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

  onFormChange = () => {
    this.checkIfFormisReady();
  };

  evaluateRegex = (regex, term) => {
    const reg = new RegExp(regex);
    const isValidRegex = reg.test(term);
    return isValidRegex;
  };

  handleStationsChange = (e, options = []) => {
    const staionsValue = options.map(opt => opt.value);
    const autoStaionsValue = options.map(opt => ({ value: opt.value }));

    // To prevent adding more than 10 stations
    if (this.state.stationCodes.length >= 10 && staionsValue.length) {
      const index = this.state.stationCodes.indexOf(
        staionsValue[staionsValue.length - 1]
      );

      if (index === -1) return;
    }

    this.setState(
      {
        stationCodes: staionsValue,
        autoStationCodes: autoStaionsValue,
      },
      () => {
        this.checkIfFormisReady();
        this.props.updateBases(this.state.stationCodes);
      }
    );
  };

  updateErrors = (e, regexp: '') => {
    const event = e.target || e.srcElement;
    const key = event.name;
    const value = event.value;
    const isError = value === '' ? false : !this.evaluateRegex(regexp, value);

    return {
      ...this.state.errors,
      [key]: isError,
    };
  };

  handleTextInputChange = (e, regexp: '') => {
    const { inlineError } = this.props;
    const errors = this.updateErrors(e, regexp);
    const inlineErrorMessage = getInlineErrorMessage(e, inlineError);

    this.setState(
      {
        errors,
        [e.target.name]: e.target.value,
        inlineErrorMessage,
      },
      this.checkIfFormisReady
    );
  };

  handleRenderValues = bases => {
    return bases.join(', ');
  };

  render() {
    const {
      crewBase,
      formId,
      t,
      readOnly,
      enableReadOnly,
      ...rest
    } = this.props;
    const {
      baseCode,
      baseName,
      countries,
      countryCode,
      errors,
      stationCodes,
      autoStationCodes,
      stationSuggestions,
      inlineErrorMessage,
    } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const formHeader = 'DATA.crewBases.form';
    const sectionGeneral = 'DATA.crewBases.form.section.general';
    const errorMsg = 'ERRORS.CREWBASES';

    let codeErrorMessage = t(`${errorMsg}.baseCode`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, crewBase)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        {...rest}
      >
        <FormHeader>
          <span>{getFormHeading(t, crewBase, readOnlyStatus, formHeader)}</span>
          <span>{baseName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.baseCode} required>
                    <Input
                      error={errors.baseCode}
                      className={errors.baseCode ? 'error' : ''}
                      inputProps={{
                        id: 'baseCode',
                        name: 'baseCode',
                        type: 'text',
                        maxLength: 3,
                        placeholder: t(`${sectionGeneral}.codePlaceholder`),
                        title: t('ERRORS.CREWBASES.baseCode'),
                      }}
                      onChange={e =>
                        this.handleTextInputChange(e, '[A-Za-z]{3}')
                      }
                      required
                      label={t(`${sectionGeneral}.code`)}
                      value={baseCode}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.baseCode}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.baseName}>
                    <Input
                      inputProps={{
                        name: 'baseName',
                        maxLength: 50,
                      }}
                      className={errors.baseName ? 'error' : ''}
                      id="baseName"
                      label={t(`${sectionGeneral}.name`)}
                      color="secondary"
                      defaultValue={baseName}
                      error={errors.baseName}
                      required
                      onChange={e =>
                        this.handleTextInputChange(e, '^[a-zA-Z0-9].*')
                      }
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.baseName}
                      message={t(`${errorMsg}.baseName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <AutoCompleteForm
                      id={'countryCode'}
                      name={'countryCode'}
                      label={t(`${sectionGeneral}.country`)}
                      suggestions={countries}
                      value={countryCode}
                      onChange={this.onSelectChange}
                      disabled={readOnlyStatus}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <StyledAutoComplete
                      multiple
                      name="stationCodes"
                      id="stationCodes"
                      options={stationSuggestions}
                      value={autoStationCodes}
                      ListboxComponent={ListboxComponent}
                      onChange={this.handleStationsChange}
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
                          size="small"
                          label={t(`${sectionGeneral}.stations`) + ' *'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

CrewBasesForm.propTypes = {
  t: PropTypes.func.isRequired,
  crewBase: PropTypes.shape({
    bases: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    countryCode: PropTypes.string,
    countryName: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateBases: PropTypes.func.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
};

CrewBasesForm.defaultProps = {
  crewBase: {},
  inlineError: null,
};

export default CrewBasesForm;
