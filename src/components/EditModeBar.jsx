import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';

const EditModeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 25px;
`;
const Line = styled.div`
  background: ${props => props.theme.color};
  height: 1px;
  position: absolute;
  top: 12.5px;
  right: 0;
  left: 0;
  z-index: 1;
`;
const Title = styled.span`
  text-align: center;
  font-size: 13px !important;
  z-index: 2;
  position: relative;
  background: #fafafa;
  color: ${props => `${props.theme.color} !important`};
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 99px;
  height: 21px;
  line-height: 21px;
  top: 2px;
`;

const EditModeBar = props => (
  <ThemeProvider theme={{ color: props.barColor }}>
    <EditModeWrapper>
      <Line />
      <Title>{props.title}</Title>
    </EditModeWrapper>
  </ThemeProvider>
);

EditModeBar.propTypes = {
  title: PropTypes.string.isRequired,
  barColor: PropTypes.string,
};

EditModeBar.defaultProps = {
  barColor: '#E54C42',
};

export default EditModeBar;
