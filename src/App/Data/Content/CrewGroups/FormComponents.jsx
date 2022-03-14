import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormControlMUI from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';

const FormControl = styled(FormControlMUI)`
  width: 100%;
`;

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

export const InputForm = props => {
  const {
    required = false,
    id,
    error: showError,
    errorMessage = '',
    maxLength,
    ...otherInputProps
  } = props;

  const inputProps = {
    name: id,
  };

  if (maxLength) inputProps.maxLength = maxLength;

  return (
    <FormControl required={required} error={showError}>
      <Input
        inputProps={inputProps}
        id={id}
        error={showError}
        required={required}
        {...otherInputProps}
      />
      <ErrorMessage isVisible={showError} message={errorMessage} />
    </FormControl>
  );
};

export const ComboBox = ({
  name,
  onChange,
  value,
  items,
  label,
  required,
  disabled,
}) => {
  return (
    <FormControl required={required}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        onChange={onChange}
        value={value}
        inputProps={{ name }}
        disabled={disabled}
      >
        {items.map((item, k) => (
          <MenuItem key={k} value={item.value}>
            {item.display || item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

InputForm.propTypes = {
  id: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
};

InputForm.defaultProps = {
  required: false,
  error: false,
  maxLength: 0,
  errorMessage: '',
  disabled: false,
};

ComboBox.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

ComboBox.defaultProps = {
  required: false,
  disabled: false,
};
