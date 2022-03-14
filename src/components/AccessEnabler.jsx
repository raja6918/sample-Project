import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkPermission } from '../utils/common';

const AccessEnabler = ({
  render,
  scopes,
  disableComponent,
  userPermissions,
}) => {
  const hasPermission = checkPermission(scopes, userPermissions);
  return hasPermission ? (
    render({})
  ) : disableComponent ? (
    render({ disableComponent })
  ) : (
    <Fragment />
  );
};

AccessEnabler.propTypes = {
  render: PropTypes.func,
  disableComponent: PropTypes.bool,
  scopes: PropTypes.shape([]).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

AccessEnabler.defaultProps = {
  render: () => {},
  disableComponent: false,
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    userPermissions: user.permissions,
  };
};

export default connect(mapStateToProps)(AccessEnabler);
