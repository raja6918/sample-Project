import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import ButtonMUI from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';

import BaseDialog from '../../../../../../../components/Dialog/Base';
import ActionsContent from '../../../../../../../components/Dialog/ActionsContent';

import { perfectScrollConfig } from '../../../../../../../utils/common';

const Base = styled(BaseDialog)`
  & > div:last-child > div:not(.actions-content) {
    background-color: #5098e7;
    padding: 21px 24px;
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
      closeButton,
      cancelButton,
      formId,
      overlayComponent,
      handleOk,
      okButton,
      disableSave,
      closeOnly,
      hideCancelBtn = false,
      readOnly,
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
              {readOnly && (
                <ButtonMUI
                  color="primary"
                  variant="contained"
                  onClick={handleCancel}
                >
                  {closeButton || 'Close'}
                </ButtonMUI>
              )}
              {!readOnly && !hideCancelBtn && (
                <ButtonMUI color="primary" onClick={handleCancel}>
                  {cancelButton || 'Cancel'}
                </ButtonMUI>
              )}
              {!readOnly && !closeOnly && (
                <ButtonMUI
                  disabled={disableSave}
                  type="submit"
                  onClick={handleOk}
                  disablesave={disableSave.toString()}
                  variant="contained"
                  color="primary"
                >
                  {okButton || 'Ok'}
                </ButtonMUI>
              )}
            </ActionsContent>
          </form>
        </PerfectScrollbar>
      </Base>
    );
  }
}

Dialog.propTypes = {
  handleOk: PropTypes.func.isRequired,
  okButton: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  closeButton: PropTypes.string,
  cancelButton: PropTypes.string,
  formId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onEntered: PropTypes.func,
  open: PropTypes.bool.isRequired,
  overlayComponent: PropTypes.element,
  closeOnly: PropTypes.bool,
  hideCancelBtn: PropTypes.bool,
  disableSave: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
};

Dialog.defaultProps = {
  title: '',
  okButton: 'Ok',
  closeButton: 'Close',
  cancelButton: 'Cancel',
  className: '',
  overlayComponent: null,
  closeOnly: false,
  onClose: () => {
    return false;
  },
  onEntered: () => {},
  hideCancelBtn: false,
  disableSave: false,
};

export default Dialog;
