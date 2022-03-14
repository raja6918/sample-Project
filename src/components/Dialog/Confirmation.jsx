import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import ActionsContent from './ActionsContent';

import Base from './';

const Content = styled(DialogContent)`
  color: rgba(0, 0, 0, 0.54);
  min-width: 400px;
`;

class Confirmation extends Component {
  render() {
    const {
      handleCancel,
      cancelButton,
      handleOk,
      okButton,
      okButtonDisabled,
      ...rest
    } = this.props;

    return (
      <Base disableBackdropClick {...rest}>
        <Content>{this.props.children}</Content>
        <ActionsContent>
          <Button color="primary" onClick={handleCancel}>
            {cancelButton || 'Cancel'}
          </Button>
          <Button
            disabled={okButtonDisabled}
            onClick={handleOk}
            variant="contained"
            color="primary"
          >
            {okButton}
          </Button>
        </ActionsContent>
      </Base>
    );
  }
}

Confirmation.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  cancelButton: PropTypes.string,
  handleOk: PropTypes.func,
  okButton: PropTypes.string,
  okButtonDisabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onExited: PropTypes.func,
};

Confirmation.defaultProps = {
  okButton: 'Ok',
  handleOk: () => {},
  cancelButton: null,
  okButtonDisabled: false,
  onExited: () => {},
  title: '',
};

export default Confirmation;
