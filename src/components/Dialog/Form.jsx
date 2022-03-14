import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import ButtonMUI from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';

import BaseDialog from './Base';
import ActionsContent from './ActionsContent';

import debounce from 'lodash/debounce';
import { perfectScrollConfig } from '../../utils/common';

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
`;

const Content = styled(DialogContent)`
  min-height: 193px;
  &:first-child {
    padding: 24px;
  }
`;

class Form extends Component {
  handleSubmit = e => {
    e.preventDefault();
  };
  handleOk = debounce(() => {
    this.props.handleOk(this.ref);
  }, 500);

  render() {
    const {
      handleCancel,
      cancelButton,
      handleOk,
      okButton,
      formId,
      disableSave,
      closeOnly,
      hideCancelBtn = false,
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
            <Content>{this.props.children}</Content>
            <ActionsContent className="actions-content">
              {!hideCancelBtn && (
                <ButtonMUI color="primary" onClick={handleCancel}>
                  {cancelButton || 'Cancel'}
                </ButtonMUI>
              )}
              {!closeOnly && (
                <ButtonMUI
                  disabled={disableSave}
                  type="submit"
                  onClick={this.handleOk}
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

Form.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  cancelButton: PropTypes.string,
  handleOk: PropTypes.func.isRequired,
  okButton: PropTypes.string,
  formId: PropTypes.string.isRequired,
  disableSave: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onEntered: PropTypes.func,
  open: PropTypes.bool.isRequired,
  closeOnly: PropTypes.bool,
  hideCancelBtn: PropTypes.bool,
};

Form.defaultProps = {
  title: '',
  disableSave: false,
  cancelButton: 'Cancel',
  okButton: 'Ok',
  className: '',
  closeOnly: false,
  onClose: () => {
    return false;
  },
  onEntered: () => {},
  hideCancelBtn: false,
};

export default Form;
