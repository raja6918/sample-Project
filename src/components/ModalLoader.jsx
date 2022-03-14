import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';

/* Note: The background prop, should be a string as rgb color i.e.

    background="255,0,0" --- for red
    background="65,105,225" --- for royalblue

    If the format is not correct or there's no background prop
    the background color will be black as default
*/

const DialogUi = styled(Dialog)`
  > div {
    background: ${props => `rgba(${props.theme.background},0.5)`};
  }
  & > div + div {
    align-items: center;
    box-shadow: none;
    background: none;
    > div {
      padding-bottom: 5px !important;
      align-items: center;
      box-shadow: none;
      background: none;
    }
    > div,
    h2,
    p {
      color: ${props => props.theme.color};
    }
  }
`;

class ModalLoader extends Component {
  render() {
    const {
      open,
      title,
      subtitle,
      color,
      background,
      onClose,
      loaderRequired,
    } = this.props;

    return (
      <ThemeProvider theme={{ color: color, background: background }}>
        <DialogUi
          open={open}
          onClose={onClose || (() => {})}
          aria-labelledby="form-dialog-title"
        >
          {loaderRequired && <CircularProgress style={{ color: 'white' }} />}
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{subtitle}</DialogContentText>
          </DialogContent>
        </DialogUi>
      </ThemeProvider>
    );
  }
}

ModalLoader.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  color: PropTypes.string,
  background: PropTypes.string,
  onClose: PropTypes.func,
  loaderRequired: PropTypes.bool,
};

ModalLoader.defaultProps = {
  color: '',
  title: '',
  subtitle: '',
  background: '',
  onClose: () => {},
  open: false,
  loaderRequired: true,
};
export default ModalLoader;
