import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputAdornment, Icon, TextField } from '@material-ui/core';
import FormControlMUI from '@material-ui/core/FormControl';
import { evaluateRegex } from './utils';
import { TEXT_FIELD_REGEX, TEXT_FIELD_ERROR } from './constants';
import ErrorMessage from '../FormValidation/ErrorMessage';

const FormControl = styled(FormControlMUI)`
  width: 100%;
`;
/**
 * Props
 * id(string): id to be passed (required),
 * readOnly(bool): read only mode check (required),
 * value(string): default value of the textfield (required),
 * onBlur(func): callback on focus lost , returns id and value( required),
 * checkError(bool):checks to go for error handling, default false(optional)
 * regexString(string): regex pattern to check ,default ^[a-zA-Z0-9].* (optional),
 * errorMsg(string): error message for regex checking , default ERRORS.GENERIC_TEXT_FIELD.name(optional),
 * t(func): translate function for i18next checking (optional)
 * isActive(func):callback to check whether textfield is clicked
 */

class GenericTextField extends Component {
  state = {
    active: false,
    value: this.props.value,
    error: false,
    checkError: this.props.checkError ? this.props.checkError : false,
  };

  handleOnBlur = () => {
    const noChanges = this.state.value === this.props.value;
    if (noChanges) {
      this.setState({ active: false });
      this.props.onBlur();
      return;
    }

    let nextState = {
      active: false,
    };

    if (!this.state.value.length) {
      nextState = { ...nextState, value: this.props.value };
    } else {
      nextState = { ...nextState, value: this.state.value };
    }

    if (!this.state.error) {
      this.setState(
        nextState,
        this.props.onBlur(this.props.id, nextState.value)
      );
    } else {
      this.setState({
        value: this.props.value,
        error: false,
      });
    }
  };

  handleOnChange = event => {
    const { value } = event.target;
    if (this.state.checkError) {
      const regex = this.props.regexString
        ? this.props.regexString
        : TEXT_FIELD_REGEX;
      const isError = value === '' ? false : !evaluateRegex(regex, value);
      this.setState({ error: isError, value: value });
    } else {
      this.setState({ value });
    }
  };

  handleOnClick = () => {
    this.setState({ active: !this.state.active }, () => {
      this.props.isActive(this.state.active);
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ active: false, value: nextProps.value, error: false });
  }

  render() {
    const { active, value, error } = this.state;
    const { id, readOnly, t, errorMsg } = this.props;
    const errorMessage = errorMsg ? errorMsg : TEXT_FIELD_ERROR;
    let commonProps = {
      id,
      value,
      inputProps: {
        maxLength: 50,
      },
      onFocus: event => event.target.select(),
      onBlur: this.handleOnBlur,
      onChange: this.handleOnChange,
      disabled: readOnly,
      error: error,
    };

    if (!active) {
      commonProps = {
        ...commonProps,
        onClick: !readOnly ? this.handleOnClick : null,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Icon color={readOnly ? 'disabled' : 'primary'}>edit</Icon>
            </InputAdornment>
          ),
        },
      };
    }

    return (
      <FormControl error={error}>
        <TextField {...commonProps} />
        {this.state.checkError && (
          <ErrorMessage isVisible={error} message={t(errorMessage)} />
        )}
      </FormControl>
    );
  }
}

GenericTextField.propTypes = {
  id: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  checkError: PropTypes.bool,
  regexString: PropTypes.string,
  errorMsg: PropTypes.string,
  t: PropTypes.func,
  isActive: PropTypes.func,
};

export default GenericTextField;
