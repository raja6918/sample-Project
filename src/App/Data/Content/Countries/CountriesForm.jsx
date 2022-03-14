import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';

import Autocomplete from '@material-ui/lab/Autocomplete';
import ListboxComponent from '../../../../components/ReactWindow/ListboxComponent';

import { prepareCurrencies, getLabel } from './Constants';
import * as currenciesService from '../../../../services/Data/currencies';
import { getInlineErrorMessage } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormHeading,
  getFormOkButton,
  getFormCancelButton,
} from '../../../../utils/common';

import Sort from '../../../../utils/sortEngine';

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

const SingleItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

class CountriesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryName: '',
      countryCode: '',
      currencyCode: null,
      currencies: [],
      isFormDirty: false,
      errors: {
        countryCode: false,
        countryName: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.setState({
        countryName: nextProps.country ? nextProps.country.name : '',
        countryCode: nextProps.country ? nextProps.country.code : '',
        currencyCode: nextProps.country ? nextProps.country.currencyCode : null,
        isFormDirty: false,
        errors: {
          countryCode: false,
          countryName: false,
        },
      });
    }

    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkIfFormisReady);
    }
  }

  componentDidMount() {
    currenciesService
      .getCurrencies(this.props.openItemId)
      .then(currencies => {
        const sortedCurrencies = new Sort(currencies.data, {
          type: 'string',
          direction: 'inc',
          field: 'name',
        }).sort();

        this.setState({
          currencies: prepareCurrencies(sortedCurrencies),
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  onSelectChange = option => {
    const value = option ? option.value : '';
    this.setState({ currencyCode: value }, this.onFormChange);
  };

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  checkIfFormisReady = () => {
    const node_countryName = document.getElementById('countryName');
    const node_countryCode = document.getElementById('countryCode');
    const countryName = node_countryName ? node_countryName.value.trim() : '';
    const countryCode = node_countryCode ? node_countryCode.value.trim() : '';
    const { errors, currencyCode, isFormDirty } = this.state;
    const isError = errors.countryName || errors.countryCode;

    if (
      countryName !== '' &&
      countryCode !== '' &&
      currencyCode !== null &&
      currencyCode !== '' &&
      !isError
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

  handleChange = (e, regexp: '') => {
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

  render() {
    const {
      country,
      t,
      readOnly,
      enableReadOnly,
      handleOk,
      ...rest
    } = this.props;
    const {
      countryName,
      countryCode,
      currencyCode,
      currencies,
      errors,
      inlineErrorMessage,
    } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const addCountries = 'DATA.countries.form';
    const sectionGeneral = 'DATA.countries.form.section.general';
    const errorMsg = 'ERRORS.COUNTRIES';

    let codeErrorMessage = t(`${errorMsg}.countryCode`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, country)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        handleOk={form => handleOk(form, { currencyCode })}
        {...rest}
        enableReadOnly={enableReadOnly}
      >
        <FormHeader>
          <span>
            {getFormHeading(t, country, readOnlyStatus, addCountries)}
          </span>
          <span>{countryName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.countryCode}>
                    <Input
                      inputProps={{
                        name: 'countryCode',
                        maxLength: 2,
                      }}
                      className={errors.countryCode ? 'error' : ''}
                      id="countryCode"
                      label={t(`${sectionGeneral}.countryCode`)}
                      placeholder={t(
                        `${sectionGeneral}.countryCodePlaceholder`
                      )}
                      color="secondary"
                      onChange={e => this.handleChange(e, '^[a-zA-Z]{2}.*')}
                      value={countryCode}
                      error={errors.countryCode}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.countryCode}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={errors.countryName}>
                    <Input
                      inputProps={{
                        name: 'countryName',
                        maxLength: 50,
                      }}
                      id="countryName"
                      label={t(`${addCountries}.countryName`)}
                      color="secondary"
                      className={errors.countryName ? 'error' : ''}
                      value={countryName}
                      required
                      error={errors.countryName}
                      onChange={e => this.handleChange(e, '^[a-zA-Z].*')}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.countryName}
                      message={t(`${errorMsg}.countryName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required>
                    <Autocomplete
                      name="currencyCode"
                      id="currencyCode"
                      options={currencies}
                      value={
                        currencyCode
                          ? {
                              value: currencyCode,
                              label: getLabel(currencies, currencyCode),
                            }
                          : null
                      }
                      ListboxComponent={ListboxComponent}
                      onChange={(e, option) => this.onSelectChange(option)}
                      disabled={readOnlyStatus}
                      getOptionLabel={option =>
                        option.label ? option.label : ''
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="standard"
                          label={t(`${sectionGeneral}.currency`) + ' *'}
                        />
                      )}
                      renderOption={option => (
                        <SingleItem>{option.label}</SingleItem>
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

CountriesForm.propTypes = {
  t: PropTypes.func.isRequired,
  country: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
    currencyCode: PropTypes.string,
    currencyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

CountriesForm.defaultProps = {
  country: {},
  inlineError: null,
};

export default CountriesForm;
