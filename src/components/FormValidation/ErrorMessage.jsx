import React from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';

const ErrorMessage = ({ isVisible, message, error }) =>
  isVisible && <FormHelperText error={error}>{message}</FormHelperText>;

ErrorMessage.propTypes = {
  isVisible: PropTypes.bool,
  message: PropTypes.string,
  error: PropTypes.bool,
};
ErrorMessage.defaultProps = {
  isVisible: false,
  message: '',
  error: true,
};

export default ErrorMessage;
