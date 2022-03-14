/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const StyledDiv = styled.div`
  background-color: #f0f8ff;
  padding: 14px 56px 14px 56px;
  color: #000000;
`;

const OrangeSPan = styled.span`
  color: #ff650c;
  border-bottom: 1px solid #ff650c;
`;

const HeaderLink = styled.span`
  color: #0a75c2;
  text-decoration: underline;
  cursor: pointer;
`;

export const MockCollapsibleComponent = props => (
  <StyledDiv>
    <OrangeSPan>1 &nbsp;</OrangeSPan>
    (<IconButton aria-label="expand row" size="small">
      <RotateLeftIcon color="disabled" fontSize="small" />
    </IconButton>) <HeaderLink>local nights rest</HeaderLink> is required
    between transitions of
    <HeaderLink> early duty</HeaderLink> to <HeaderLink>late</HeaderLink> /{' '}
    <HeaderLink>night duty</HeaderLink>, or vice versa
  </StyledDiv>
);

MockCollapsibleComponent.propTypes = {
  data: PropTypes.shape().isRequired,
};
