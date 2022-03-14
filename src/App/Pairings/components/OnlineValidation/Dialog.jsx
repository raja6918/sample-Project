import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import ButtonMUI from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';

import BaseDialog from '../../../../components/Dialog/Base';
import ActionsContent from '../../../../components/Dialog/ActionsContent';

import { perfectScrollConfig } from '../../../../utils/common';

const Base = styled(BaseDialog)`
  & > div:last-child {
    max-width: 459px;
    width: 100%;
  }
  & > div:last-child > div:not(.actions-content) {
    background-color: #5098e7;
    padding: 21px 24px;
  }
  & > div:last-child > div + button {
    position: absolute;
    top: 10px;
    right: 15px;
  }
  & > div:last-child > div + button span {
    color: #fff;
    font-size: 20px;
  }
  & > div:last-child > div h2 {
    color: #fff;
    font-size: 20px;
  }
  & .MuiDialogTitle-root {
    background-color: #5098e7;
    color: #fff;
  }
  & .back-button {
    padding: 0px 16px;
  }
  & .hide {
    display: none;
  }
`;

const Content = styled(DialogContent)`
  &:first-child {
    padding: 0;
    min-height: 193px;
  }
`;

const DialogBody = styled.span`
  display: ${props => (props.isDiv ? 'block' : 'inline')};
  position: relative;
`;

class Dialog extends Component {
  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const {
      handleCancel,
      cancelButton,
      formId,
      overlayComponent,
      backButton,
      enableBack,
      handleBack,
      ...rest
    } = this.props;

    return (
      <Base handleCancel={handleCancel} {...rest}>
        <PerfectScrollbar option={perfectScrollConfig}>
          <form
            id={formId}
            name={formId}
            ref={ref => (this.ref = ref)}
            onSubmit={this.handleSubmit}
          >
            <DialogBody isDiv={!!overlayComponent}>
              <Content>
                <PerfectScrollbar option={perfectScrollConfig}>
                  {this.props.children}
                </PerfectScrollbar>
              </Content>
              {overlayComponent}
            </DialogBody>

            <ActionsContent className="actions-content">
              <ButtonMUI
                color={'primary'}
                onClick={handleCancel}
                variant={enableBack ? 'outlined' : 'contained'}
              >
                {cancelButton || 'Close'}
              </ButtonMUI>

              <ButtonMUI
                color={'primary'}
                variant="contained"
                onClick={handleBack}
                className={enableBack ? 'back-button' : 'hide'}
              >
                {backButton || 'Back'}
              </ButtonMUI>
            </ActionsContent>
          </form>
        </PerfectScrollbar>
      </Base>
    );
  }
}

Dialog.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  cancelButton: PropTypes.string,
  formId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onEntered: PropTypes.func,
  open: PropTypes.bool.isRequired,
  overlayComponent: PropTypes.element,
  enableBack: PropTypes.bool.isRequired,
  handleBack: PropTypes.func.isRequired,
  backButton: PropTypes.string,
};

Dialog.defaultProps = {
  title: '',
  cancelButton: 'Cancel',
  backButton: 'Back',
  className: '',
  overlayComponent: null,
  onClose: () => {
    return false;
  },
  onEntered: () => {},
};

export default Dialog;
