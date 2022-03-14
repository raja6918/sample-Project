import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MUIButton from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const LoginBox = styled.div`
  width: 425px;
  height: 330px;
  padding: 40px;
  background-color: #ffffff;
  z-index: 999;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  margin-top: 64px;
  & form p:first-of-type {
    margin: 0;
    font-weight: 400;
    font-size: 24px;
    color: #ff650c;
    margin-bottom: 20px;
  }
  & form div label {
    color: rgba(0, 0, 0, 0.67);
  }
  & form div label + div::before {
    background-color: transparent;
  }
  & form div:first-child {
    margin-bottom: 13px;
  }
`;

const Input = styled(TextField)`
  width: 100%;
  margin-bottom: ${props => props.mb};
  & div::before {
    background-color: rgba(0, 0, 0, 0.12);
  }
`;

const Button = styled(MUIButton)`
  float: right;
  min-width: 80px;
  max-width: 80px;
  max-height: 32px;
  min-height: 32px;
  background: #0a75c2;
  border-radius: 2px;
  &:hover {
    background: #075187;
  }
  & span {
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0;
    text-transform: none;
    color: #ffffff;
    line-height: 1.4em;
    opacity: 0.85;
  }
`;

const ErrorMessage = styled.p`
  color: #ff650c;
  height: 38px;
  margin-top: 0;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
`;

class Form extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmit(this.ref);
  };

  render() {
    const { t, errorMessage, clearErrorMessage } = this.props;

    return (
      <LoginBox>
        <form ref={ref => (this.ref = ref)} onSubmit={this.handleSubmit}>
          <p>{t('LOGIN.loginTitle')}</p>
          <Input
            label={t('LOGIN.username')}
            id="username"
            name="username"
            mb="13px"
            inputProps={{
              maxLength: 50,
            }}
            onChange={clearErrorMessage}
          />
          <Input
            id="password"
            name="password"
            label={t('LOGIN.password')}
            type="password"
            mb="13px"
            inputProps={{
              maxLength: 100,
            }}
            onChange={clearErrorMessage}
          />
          <ErrorMessage>{errorMessage}</ErrorMessage>

          <Button type="submit" variant="contained">
            {t('LOGIN.button')}
          </Button>
        </form>
      </LoginBox>
    );
  }
}

Form.propTypes = {
  t: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
};

export default Form;
