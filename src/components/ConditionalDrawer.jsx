import React, { Fragment } from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const WrapperDiv = styled.div`
  top: auto;
  left: 0;
  right: 0;
  height: auto;
  max-height: 100%;
  position: absolute;
  overflow-y: auto;
  background-color: #fff;
`;

const ConditionalDrawer = ({ children, renderDrawer, ...rest }) => (
  <Fragment>
    {renderDrawer && <Drawer {...rest}>{children}</Drawer>}
    {!renderDrawer && <WrapperDiv id="pd-container">{children}</WrapperDiv>}
  </Fragment>
);

ConditionalDrawer.propTypes = {
  children: PropTypes.element.isRequired,
  renderDrawer: PropTypes.bool.isRequired,
};

export default ConditionalDrawer;
