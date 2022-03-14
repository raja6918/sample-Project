import React from 'react';
import styled from 'styled-components';
import { Trans, I18n } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import error_404 from './error_404.svg';
import error_500 from './error_500.svg';
import error_403 from './error_403.svg';
import error_401 from './error_401.svg';
import error_unknown from './error_unknown.svg';
import get from 'lodash/get';
import keycloak from '../../keycloak';
import history from '../../history';

export const StyledErrorPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  a {
    color: #0a75c2;
    text-decoration: none;
  }
  p {
    color: rgba(0, 0, 0, 0.87);
  }
  img {
    margin-bottom: 35px;
  }
  .error-details {
    text-align: justify;
  }
  .error-details p {
    margin: 10px 0;
    font-size: 30px;
    color: #000000;
  }

  .error-details p:nth-child(3) {
    font-size: 16px;
    margin-bottom: 15px;
  }

  .error-details p.error-code {
    position: relative;
    font-size: 16px;
    color: #6d7278;
    padding-top: 10px;
  }

  .decorator-line {
    border-top: 1px solid #6d7278;
    width: 85px;
    position: absolute;
    left: 0;
    top: 0;
  }
`;
export const StyledLink = styled.span`
  color: #1d7fc6;
  cursor: pointer;
`;

const getErrorData = errorCode => {
  const errorData = {
    '400': { errorMessageKey: 'NOT_FOUND', errorImage: error_404 },
    '404': { errorMessageKey: 'NOT_FOUND', errorImage: error_404 },
    '403': { errorMessageKey: 'FORBIDDEN', errorImage: error_403 },
    '401': { errorMessageKey: 'UNAUTHORIZED', errorImage: error_401 },
    '500': {
      errorMessageKey: 'PLATFORM_ERROR',
      errorImage: error_500,
    },
    default: { errorMessageKey: 'UNKNOW_ERROR', errorImage: error_unknown },
  };
  return errorData[errorCode] || errorData['default'];
};

class ErrorPage extends React.Component {
  goToPrevious = () => {
    history.goBack();
  };

  goToHomePage = () => {
    history.push('/');
  };

  logOut = () => {
    keycloak.logout();
  };

  render() {
    const { t } = this.props;
    const errorCode = get(this.props.error, 'response.status');
    const errorData = getErrorData(errorCode);
    const errorKey = `ERRORS.${errorData.errorMessageKey}`;
    return (
      <StyledErrorPage>
        <img alt={`Error ${errorCode}`} src={errorData.errorImage} />
        <div className="error-details">
          <p>{t(`${errorKey}.LINE_1`)}</p>
          <p>{t(`${errorKey}.LINE_2`)}</p>
          <p>
            {errorKey !== 'ERRORS.PLATFORM_ERROR' && t(`${errorKey}.LINE_3`)}
            <Trans
              i18nKey={`${errorKey}.LINE_4`}
              components={[
                <StyledLink
                  onClick={errorCode === 401 ? this.logOut : this.goToPrevious}
                >
                  turn back nows
                </StyledLink>,
                <StyledLink onClick={this.goToHomePage}>homepage</StyledLink>,
              ]}
            >
              {t(`${errorKey}.LINE_4`)}
            </Trans>
            {errorKey === 'ERRORS.PLATFORM_ERROR' && t(`${errorKey}.LINE_3`)}
          </p>
          <p className="error-code">
            {t(`ERRORS.ERROR_CODE`)}: {errorCode}
            <span className="decorator-line">&nbsp;</span>
          </p>
        </div>
      </StyledErrorPage>
    );
  }
}

ErrorPage.propTypes = {
  error: PropTypes.shape({}),
  t: PropTypes.func.isRequired,
};

ErrorPage.defaultProps = {
  error: { response: { status: 404 } },
};

export default ErrorPage;
