import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InputLabel from '@material-ui/core/InputLabel';
import FormControlMUI from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import ErrorMessage from './FormValidation/ErrorMessage';
import AutoComplete from './Autocomplete/AutoComplete';

export const FormControl = styled(FormControlMUI)`
  width: 100%;
  & .MuiInputAdornment-positionStart {
    margin-right: 0px;
  }

  & .MuiInput-underline:before {
    bottom: -3px;
  }

  & .MuiInput-underline:after {
    bottom: -3px;
  }
  .MuiInputBase-input {
    cursor: pointer;
  }
  .MuiInputBase-input.Mui-disabled {
    cursor: default !important;
  }
`;

export const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

export const AutoCompleteForm = ({
  required = false,
  label,
  id,
  error: showError,
  errorMessage = '',
  ...autocompleteProps
}) => {
  const [shrink, setShrink] = useState(!!autocompleteProps.value);

  return (
    <FormControl required={required} error={showError}>
      <InputLabel htmlFor={id} shrink={shrink}>
        {label}
      </InputLabel>
      <AutoComplete
        id={id}
        name={id}
        setShrink={setShrink}
        {...autocompleteProps}
      />
      <ErrorMessage isVisible={showError} message={errorMessage} />
    </FormControl>
  );
};

AutoCompleteForm.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  required: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
};

AutoCompleteForm.defaultProps = {
  required: false,
  error: false,
  errorMessage: '',
  disabled: false,
};
