import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Access = ({ route, ...props }) => {
  //   const userPermissions = Object.keys(props.permissions);
  //   const renderComp = route.permissions.some(permission =>
  //     userPermissions.includes(permission)
  //   );
  const renderComp = true;
  return renderComp ? <route.component {...props} /> : <Redirect to="/" />;
};

const mapStatetoProps = state => {
  return {
    permissions: state.notifications.permissions,
  };
};
const AccessComponent = connect(mapStatetoProps)(Access);
export default AccessComponent;
