import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkDown from 'react-markdown';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';

import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import WifiOffIcon from '@material-ui/icons/WifiOff';

const iconBarStyles = {
  success: { icon: CheckCircleIcon, color: '#00ce05', background: '#fafafa' },
  error: { icon: ErrorIcon, color: '#d10000', background: '#fafafa' },
  warning: { icon: WarningIcon, color: '#e8bb00', background: '#fafafa' },
  info: { icon: InfoIcon, color: '#5098e7', background: '#fafafa' },
  noInternet: { icon: WifiOffIcon, color: '#FFFFFF', background: '#464646' },
  '': { icon: null, color: '#323232', background: '#fafafa' },
};

const Snack = styled(Snackbar)`
  ${props =>
    `& > div {
      background: ${iconBarStyles[props.theme.type].background};
      color: ${
        props.theme.type === 'noInternet'
          ? iconBarStyles[props.theme.type].color
          : '#000'
      };
      border-top:${`5px solid ${
        props.theme.type !== 'noInternet'
          ? iconBarStyles[props.theme.type].color
          : iconBarStyles[props.theme.type].background
      }`};
    }
    &.${props.theme.type} {
      & .icon-${props.theme.type} {
          color: ${iconBarStyles[props.theme.type].color};
          vertical-align: middle;
          margin: 0 ${props.theme.type !== 'noInternet' ? '10px' : '25px'} ;
          position: relative;
          top: -2px;
          font-size: ${props.theme.type !== 'noInternet' ? '' : '40px'} ;
        }
    }
    & .msg-wrapper {
        margin: -1em 0 -1em -1em;
        display: flex;
        align-items: center;
        max-width: 520px;
    }
    &.MuiSnackbar-anchorOriginBottomCenter {
      bottom: ${props.bottomHeight}px;
    }
    & .msg {
      display: inline-block;
      vertical-align: middle;
      max-width: 100%;
      //max-width: '90%';
      margin: 1em 0;
      font-size: 12px;
      & .bold {
        font-weight: bold;
      }
    }
    & .link-button {
        color: #5098e7;
        cursor: pointer;
        display: inline-block;
        right: 32px;
        position: relative;
        font-size: 12px;
        &:hover {
          text-decoration: underline;
        }
    }
    & .close-icon {
        width: 20px;
        position: absolute;
        height: 20px;
        padding:0;
        top: 10px;
        right: 1px;
        & svg {
          font-size: 15px;
        }
    }
    & h3{
      margin:0;
      color:#fff;
    }
    @media (max-width: 959px) {
      & .msg {
        max-width: 90%;
      }
    }
 `};
`;

const notificationRoot = document.getElementById('notification-area');

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.state = {
      ...props,
      open: Boolean(this.props.message),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type === 'error' && nextProps.type !== 'error') {
      setTimeout(() => {
        this.handleClose();
      }, nextProps.autoHideDuration);
    }

    this.setState({
      ...nextProps,
      open: Boolean(nextProps.message),
    });
  }

  componentDidMount() {
    if (!!notificationRoot) {
      notificationRoot.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    if (!!notificationRoot) {
      notificationRoot.removeChild(this.el);
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false }, this.props.clear);
  };

  onLinkAction = () => {
    this.props.onLinkAction();
  };

  render() {
    const { open, type, message, buttonText, autoHideDuration } = this.state;
    const bottomHeight = this.props.bottomheight;
    const { renderers } = this.props;
    const Icon = iconBarStyles[type].icon || null;
    const isError = type === 'error';
    const closeButton =
      isError || this.props.displayCloseButton ? (
        <IconButton
          className="close-icon"
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={this.handleClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null;
    // autoHideDuration = isError ? null : autoHideDuration;
    const viewMoreButton = isError ? (
      <div key={buttonText} className="link-button" onClick={this.onLinkAction}>
        {buttonText}
      </div>
    ) : null;

    return ReactDOM.createPortal(
      <ThemeProvider theme={{ type, buttonText, bottomHeight }}>
        <Snack
          className={type}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          TransitionComponent={Fade}
          onClose={this.handleClose}
          autoHideDuration={autoHideDuration}
          message={
            <div className="msg-wrapper">
              {type !== '' && <Icon className={`icon-${type}`} />}
              <div className="msg">
                <ReactMarkDown source={message} renderers={{ ...renderers }} />
              </div>
            </div>
          }
          action={[closeButton, viewMoreButton]}
          bottomHeight={bottomHeight}
        />
      </ThemeProvider>,
      this.el
    );
  }
}

Notification.defaultProps = {
  autoHideDuration: 5000,
  message: '',
  type: '',
  buttonText: '',
  clear: () => {},
  onLinkAction: () => {},
  displayCloseButton: false,
  bottomheight: 0,
  renderers: { paragraph: 'span' },
};

Notification.propTypes = {
  autoHideDuration: PropTypes.number,
  message: PropTypes.string,
  clear: PropTypes.func,
  type: PropTypes.oneOf([
    'success',
    'warning',
    'error',
    'info',
    'noInternet',
    '',
  ]),
  buttonText: PropTypes.string,
  onLinkAction: PropTypes.func,
  displayCloseButton: PropTypes.bool,
  bottomheight: PropTypes.number,
  renderers: PropTypes.shape({}),
};

export default Notification;
