import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import styled from 'styled-components';

import storage from '../../utils/storage';
import Container from './Container';
import AppTitle from './AppTitle';
import Form from './Form';

import API from '../../utils/API';

import scenarioService from '../../services/Scenarios/index';
import { setUserDetails } from '../../actions/user';
import { connect } from 'react-redux';

const Overlay = styled.div`
  width: 437px;
  background-image: linear-gradient(
    0deg,
    rgba(0, 76, 140, 0.64) 2%,
    #00355b 48%
  );
  border-radius: 4px;
  height: calc(100vh - 80px);
  left: 10%;
  top: 40px;
  position: relative;
  padding: 35px 33px 0 49px;
`;

class Login extends Component {
  state = {
    errorMessage: '',
  };

  redirectToDashboard = () => {
    this.props.history.push('/');
  };

  handleSubmit = ref => {
    const loginRequestBody = {
      username: ref.username.value.trim(),
      password: ref.password.value.trim(),
    };

    const { setUserDetails } = this.props;
    API.post('/auth/login', loginRequestBody)
      .then(response => {
        storage.setItem('jwt', response);
        API.get(`/users/${loginRequestBody.username}`).then(res => {
          storage.setItem('loggedUser', res);
          setUserDetails(res);
          scenarioService.deletePendingPreviews();
          this.redirectToDashboard();
        });
      })
      .catch(error => {
        let errorMessage;
        try {
          const [{ errorDetails }] = error.response.data;
          const [errorInfo] = errorDetails;
          errorMessage = this.props.t(`ERRORS.${errorInfo.messageKey}`);
        } catch (err) {
          if (error.response) {
            if (error.response.status === 401) {
              errorMessage = this.props.t('LOGIN.invalidCredentials');
            } else {
              errorMessage = this.props.t('GLOBAL.serviceNotAvailable');
            }
          } else {
            errorMessage = this.props.t('GLOBAL.serviceNotAvailable');
          }
        }
        this.setState({ errorMessage });
      });
  };

  clearErrorMessage = () => {
    this.setState({ errorMessage: '' });
  };

  render() {
    const { t } = this.props;
    const { errorMessage } = this.state;

    return (
      <React.Fragment>
        <Container t={t}>
          <Overlay>
            <AppTitle t={t} />
            <Form
              t={t}
              handleSubmit={this.handleSubmit}
              errorMessage={errorMessage}
              clearErrorMessage={this.clearErrorMessage}
            />
          </Overlay>
        </Container>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    push: PropTypes.func,
  }).isRequired,
  setUserDetails: PropTypes.func.isRequired,
};

const mapStatetoProps = state => {
  return { userData: state.user.userData };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserDetails: data => dispatch(setUserDetails(data)),
  };
};
const LoginComponent = connect(
  mapStatetoProps,
  mapDispatchToProps
)(Login);
export default translate()(LoginComponent);
