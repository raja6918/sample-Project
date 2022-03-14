import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import ActionsContent from './ActionsContent';

import ReactMarkDown from 'react-markdown';

import Base from './';

const Content = styled(DialogContent)`
  color: #000000;
  font-size: 14px;
  margin-bottom: 25px;
  margin-top: 24px;
`;

class ErrorDialog extends Component {
  render() {
    const {
      handleOk,
      okText,
      bodyText,
      modalCommand = true,
      ...rest
    } = this.props;

    return (
      <Base disableBackdropClick modalCommand={modalCommand} {...rest}>
        <Content>
          <p style={{ marginTop: 0 }}>
            <ReactMarkDown
              source={bodyText}
              renderers={{ paragraph: 'span' }}
            />
          </p>
        </Content>
        <ActionsContent>
          <Button onClick={handleOk} variant="contained" color="primary">
            {okText}
          </Button>
        </ActionsContent>
      </Base>
    );
  }
}

ErrorDialog.propTypes = {
  okText: PropTypes.string,
  title: PropTypes.string,
  bodyText: PropTypes.string,
  onExited: PropTypes.func,
  open: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
};

ErrorDialog.defaultProps = {
  okText: 'Ok',
  title: '',
  bodyText: '',
  onExited: () => {},
};

export default ErrorDialog;
