import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AppTitleContainerWrapper = styled.div`
  & h2 {
    font-size: 36px;
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 5px;
    font-weight: 400;
  }
  & p {
    font-size: 20px;
    font-weight: 200;
    color: #ffffff;
    margin: 0;
    opacity: 0.75;
  }
`;

// eslint-disable-next-line
const shortHash = COMMITHASH.substr(0, 7);

const AppTitleContainer = ({ t }) => {
  return (
    <AppTitleContainerWrapper>
      <h2>{t('LOGIN.appTitle')}</h2>
      <p title={`Build ${shortHash}`}>{t('LOGIN.appVersion')}</p>
    </AppTitleContainerWrapper>
  );
};

AppTitleContainer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default AppTitleContainer;
