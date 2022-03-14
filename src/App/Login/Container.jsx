import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LoginContainerWrapper = styled.div`
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  height: 100vh;
  background-repeat: no-repeat;
  position: relative;
`;

const LoginContainer = ({ children, t }) => {
  let bg = '';
  try {
    bg = require(`./${t('LOGIN.bg')}`);
  } catch (e) {
    bg = require(`./Login.jpg`);
  }

  return <LoginContainerWrapper bg={bg}>{children}</LoginContainerWrapper>;
};

LoginContainer.propTypes = {
  children: PropTypes.element,
  t: PropTypes.func.isRequired,
};

LoginContainer.defaultProps = {
  children: <div />,
};

export default LoginContainer;
