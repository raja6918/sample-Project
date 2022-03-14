import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { redirectURL } from '../utils/redirect';

import storage from '../utils/storage';

const Auth = ({ render, ...rest }) => {
  const JWT = storage.getItem('jwt') || {};

  const redirectUrl = redirectURL(location.pathname);
  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <Route
      {...rest}
      render={props => (JWT.token ? render(props) : <Redirect to="/" />)}
    />
  );
};

Auth.propTypes = {
  render: PropTypes.func,
};
Auth.defaultProps = {
  render: () => {},
};

export default Auth;
