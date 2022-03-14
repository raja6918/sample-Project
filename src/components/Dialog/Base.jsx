import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import Icon from '@material-ui/core/Icon';

const styles = {
  dialogPaper: {
    minHeight: '320px',
    maxHeight: '747px',
    minWidth: '560px',
  },
};

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background-color: transparent;
  position: absolute;
  right: 18px;
  top: 12px;
  cursor: pointer;
`;
const CloseIcon = styled(Icon)`
  color: #fff;
`;

const StyledDialogTitle = styled(DialogTitle)`
  background-color: #5098e7;
  font-family: Roboto-Medium;
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: left;
  line-height: 28px;
`;

const StyledDialogWithSubTitle = styled(DialogTitle)`
  display: flex;
  background-color: #5098e7;
  letter-spacing: 0;
  text-align: left;
  line-height: 28px;
  color: #ffffff;

  & > h2 > div {
    display: flex;
    flex-direction: column;
    height: 54px;
  }
  & span:first-child {
    font-size: 14px;
    font-weight: 400;
  }
  & span:last-child {
    font-size: 20px;
    font-weight: 500;
  }
`;

export class Base extends Component {
  render() {
    const {
      id,
      title,
      subTitle,
      onClose,
      handleCancel,
      modalCommand = true,
      classes,
      ...rest
    } = this.props;

    const closeButton = onClose === false ? handleCancel : onClose;

    return (
      <Dialog
        aria-labelledby={id}
        classes={{ paper: classes.dialogPaper }}
        onClose={closeButton}
        {...rest}
        disableBackdropClick
      >
        {subTitle || subTitle === '' ? (
          <StyledDialogWithSubTitle>
            <div>
              <span>{title}</span>
              <span>{subTitle}</span>
            </div>
          </StyledDialogWithSubTitle>
        ) : (
          <StyledDialogTitle id={id}>{title}</StyledDialogTitle>
        )}
        {modalCommand && (
          <CloseButton onClick={closeButton}>
            <CloseIcon>clear</CloseIcon>
          </CloseButton>
        )}
        {this.props.children}
      </Dialog>
    );
  }
}

Base.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  handleCancel: PropTypes.func,
  modalCommand: PropTypes.bool,
  subTitle: PropTypes.bool,
  children: PropTypes.node,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onEntered: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

Base.defaultProps = {
  id: null,
  className: '',
  children: null,
  disableBackdropClick: null,
  disableEscapeKeyDown: null,
  onClose: () => {},
  onEntered: () => {},
  handleCancel: () => {},
  modalCommand: true,
  subTitle: false,
};

export default withStyles(styles)(Base);
