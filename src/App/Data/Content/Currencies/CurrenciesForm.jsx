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
import { getInlineErrorMessage } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  checkDecimalLimit,
  getFormCancelButton,
} from '../../../../utils/common';

import {
  CURRENCY_CODE_MAX_LENGTH,
  CURRENCY_NAME_MAX_LENGTH,
  CURRENCY_EXCHANGE_RATE,
  CURRENCY_CODE_REGEX,
  CURRENCY_NAME_REGEX,
  CURRENCY_RATE_REGEX,
} from './constants.jsx';

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

class CurrenciesForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencyCode: '',
      isFormDirty: false,
      currencyName: '',
      currencyRate: '',
      errors: {
        currencyCode: false,
        currencyName: false,
        currencyRate: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.setState({
        currencyCode: nextProps.currency ? nextProps.currency.code : '',
        currencyName: nextProps.currency ? nextProps.currency.name : '',
        currencyRate: nextProps.currency ? nextProps.currency.exchangeRate : '',
        isFormDirty: false,
        errors: {
          currencyCode: false,
          currencyName: false,
          currencyRate: false,
        },
      });
    }

    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkIfFormisReady);
    }
  }

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  isValidField = value => {
    return value !== '' && value !== null;
  };

  checkIfFormisReady = () => {
    setTimeout(() => {
      const currencyCodeElement = document.getElementById('currencyCode');
      const currencyRateElement = document.getElementById('currencyRate');

      const currencyCode = currencyCodeElement
        ? currencyCodeElement.value.trim()
        : '';

      const currencyName = document.getElementById('currencyName').value.trim();

      const currencyRate = currencyRateElement
        ? currencyRateElement.value.trim()
        : '';

      const { errors, isFormDirty } = this.state;
      const isError =
        errors.currencyCode || errors.currencyName || errors.currencyRate;

      const allFieldsWereFilled =
        this.isValidField(currencyCode) &&
        this.isValidField(currencyName) &&
        this.isValidField(currencyRate);

      if (allFieldsWereFilled && !isError) {
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
    }, 1);
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

    if (value === '') {
      return {
        ...this.state.errors,
        [key]: false,
      };
    }

    let isError = value === '' ? false : !this.evaluateRegex(regexp, value);

    if (event.id === 'currencyRate') {
      const splited = event.value.split('.');

      if (splited[0] === '' && +splited[1] > 0 && splited[1].length <= 6)
        isError = false;
    }

    return {
      ...this.state.errors,
      [key]: isError,
    };
  };

  handleChange = (e, regexp: '') => {
    const { inlineError } = this.props;
    const errors = this.updateErrors(e, regexp);
    const inlineErrorMessage = getInlineErrorMessage(e, inlineError);
    let updateFields = true;

    if (e.target.name === 'currencyRate') {
      updateFields = checkDecimalLimit(e.target.value, 6, 6);
    }
    if (updateFields) {
      this.setState(
        {
          errors,
          [e.target.name]: e.target.value,
          inlineErrorMessage,
        },
        this.checkIfFormisReady
      );
    }
  };

  render() {
    const { currency, t, readOnly, enableReadOnly, ...rest } = this.props;
    const {
      errors,
      currencyName,
      currencyCode,
      currencyRate,
      inlineErrorMessage,
    } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const editCurrencies = 'DATA.currencies.form';
    const sectionGeneral = 'DATA.currencies.form.section.general';
    const sectionExchange = 'DATA.currencies.form.section.exchange';
    const errorMsg = 'ERRORS.CURRENCIES';

    let codeErrorMessage = t(`${errorMsg}.currencyCode`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, currency)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        {...rest}
      >
        <FormHeader>
          <span>
            {getFormHeading(t, currency, readOnlyStatus, editCurrencies)}
          </span>
          <span>{currencyName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.currencyCode}>
                    <Input
                      inputProps={{
                        name: 'currencyCode',
                        maxLength: CURRENCY_CODE_MAX_LENGTH,
                      }}
                      className={errors.currencyCode ? 'error' : ''}
                      id="currencyCode"
                      label={t(`${sectionGeneral}.code`)}
                      color="secondary"
                      onChange={e => this.handleChange(e, CURRENCY_CODE_REGEX)}
                      value={currencyCode}
                      error={errors.currencyCode}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.currencyCode}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={errors.currencyName} required>
                    <Input
                      required
                      inputProps={{
                        name: 'currencyName',
                        maxLength: CURRENCY_NAME_MAX_LENGTH,
                      }}
                      id="currencyName"
                      label={t(`${editCurrencies}.name`)}
                      color="secondary"
                      className={errors.currencyName ? 'error' : ''}
                      error={errors.currencyName}
                      value={currencyName}
                      onChange={e => this.handleChange(e, CURRENCY_NAME_REGEX)}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.currencyName}
                      message={t(`${errorMsg}.currencyName`)}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <h2>{t(`${sectionExchange}.title`)}</h2>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.currencyRate}>
                    <Input
                      style={{ whiteSpace: 'nowrap' }}
                      inputProps={{
                        name: 'currencyRate',
                        maxLength: CURRENCY_EXCHANGE_RATE,
                      }}
                      className={errors.currencyRate ? 'error' : ''}
                      id="currencyRate"
                      label={t(`${sectionExchange}.rate`)}
                      color="secondary"
                      onChange={e => this.handleChange(e, CURRENCY_RATE_REGEX)}
                      value={currencyRate}
                      defaultValue={currencyRate}
                      error={errors.currencyRate}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.currencyRate}
                      message={t(`${errorMsg}.currencyRate`)}
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

CurrenciesForm.propTypes = {
  t: PropTypes.func.isRequired,
  currency: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
    exchangeRate: PropTypes.number,
  }),
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
};

CurrenciesForm.defaultProps = {
  currency: {},
  inlineError: null,
};

export default CurrenciesForm;
