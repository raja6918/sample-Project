import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const CloseBtn = styled(Button)`
  position: absolute;
  right: 15px;
  top: 10px;
  width: auto;
  min-width: auto;
  height: auto;
  min-height: auto;
  z-index: 999;
  color: #ffffff;
  padding: 0;
  & span {
    font-size: 22px;
    width: 24px;
    height: 24px;
  }
`;

class Base extends Component {
  render() {
    const { handleCancel, isOpen, anchor } = this.props;

    return (
      <Drawer anchor={anchor} open={isOpen} onEscapeKeyDown={handleCancel}>
        <CloseBtn onClick={handleCancel}>
          <Icon>close</Icon>
        </CloseBtn>
        {this.props.children}
      </Drawer>
    );
  }
}

Base.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  anchor: PropTypes.string.isRequired,
  children: PropTypes.element,
};

Base.defaultProps = {
  children: <div />,
};

export default Base;
