/**
 * @class - RtnsNotifications
 * @description - This class integrates the sprout RTNS client service to the sprout RTNS
 * server
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import notificationService, {
  baseURL,
} from '../../services/Notifications/RtnsNotificationService';
import {
  notificationIncrement,
  notificationDecrement,
  fetchNotifications,
  addNewNotificationToStore,
} from '../../actions/generic';
import { updateJobStatus } from '../../actions/solver';
import { connect } from 'react-redux';
import { createRequest, filterResponse, notificationCreator } from './helper';
import {
  rtnsServiceName,
  notificationTypes,
  offlineModeCheckURL,
} from './constants';
import Notification from '../../components/Notification';
import storage from '../../utils/storage';
import { matchPath } from 'react-router';
import history from '../../history';
import axios from 'axios';
import { setUserDetails } from '../../actions/user';
import ModalLoader from '../../components/ModalLoader';
import { isReadOnlyMode } from '../../utils/common';

export class RtnsNotifications extends Component {
  /**
   * @param {*} props
   * @instance - rtnsInstance -instance of the the rtns sprout class (public folder)
   */
  constructor(props) {
    super(props);
    this.state = {
      snackType: '',
      message: null,
      notificationMessages: [],
      notificationTypesWithIds: [],
      hasPairingNotification: false,
      online: true,
    };
    this.rtnsInstance = null;

    this.currentPath = window.location.pathname || '';
    // We don't need to do any notification registration if we are in preview page
    if (window.Rtns && !this.currentPath.includes('/pairings-preview/')) {
      this.rtnsInitialization();
    }
  }
  user = null;
  timer = null;
  /**
   * @function -rtnsInitialization
   * @description - This method initializes an instance of the sprout RTNS client.
   * registerService - This method of the rtnsInstance is used for overriding the default
   * api service of rtns instance . We use notificationService method to override here.
   * setNotificationUrl - Its used to change the notification url of the rtns instance
   */
  rtnsInitialization() {
    const { userData, setUserDetails } = this.props;
    this.rtnsInstance = window.Rtns.getInstance();
    //rtns registers its api function as ajax so by default
    this.rtnsInstance.registerService(rtnsServiceName, notificationService);
    this.rtnsInstance.setNotificationUrl(
      baseURL + '/' + this.rtnsInstance.getNotificationUrl()
    );
    // this.rtnsInstance.registerService(
    //   'closeConnection',
    //   this.connectionCloseFunc
    // );
    // this.rtnsInstance.registerService('reConnection', this.reConnectionFunc);
    if (userData.id) {
      this.user = userData;
    } else {
      //check sessions storage if userData is present. temporary workaround until keycloak
      const user_details = storage.getItem('loggedUser');
      setUserDetails(user_details);
    }
  }

  /**
   * @description
   * @function-rtnsInstance.registerClient(@callback successCallback ) - this is used to
   * register a client to sprout server side and obtain the clientID
   */

  componentDidMount() {
    // We don't need to do any notification registration if we are in preview page
    if (this.currentPath.includes('/pairings-preview/')) {
      return;
    }

    if (typeof navigator.onLine === 'boolean') {
      if (!navigator.onLine) this.connectionCloseFunc();
    }

    console.log(window);

    //offline mode
    window.addEventListener('offline', this.connectionCloseFunc);
    if (this.user && this.user.id) {
      this.registeration();
    }
  }

  registeration = () => {
    this.rtnsInstance.registerClient(this.clientRegisterSuccessFunc);
    this.registerNotification();
    this.props.getInitialNotifications(this.user.id);
  };

  componentWillUnmount() {
    // We don't need to do any notification unregistration if we are in preview page
    if (this.currentPath.includes('/pairings-preview/')) {
      return;
    }

    window.removeEventListener('offline', this.checkConnection);
    this.unregisterNotificationTypes();
  }

  componentWillReceiveProps(nextProps) {
    // We don't need to do any notification registration if we are in preview page
    if (this.currentPath.includes('/pairings-preview/')) {
      return;
    }

    const pathChecker = matchPath(history.location.pathname, {
      path: '/pairings/:id',
      exact: true,
      strict: true,
    });

    if (nextProps.userData && nextProps.userData.id) {
      if (!this.user) {
        this.user = nextProps.userData;
        this.registeration();
      }
    }

    if (!pathChecker) {
      const newNotifications = this.state.notificationMessages.filter(
        notification => notification.snackType !== 'warning'
      );
      this.setState({
        notificationMessages: newNotifications,
        hasPairingNotification: false,
      });
    }
  }

  /**
   * @function-registerNotification
   * @description - This method is used to register different notification types such as * solver, import etc with the sprout rtns server.
   *  rtnsInstance.registerNotify(
   * @params {object} request,
   * @callback messageCallback,
   * @callback successCallback ,
   * @callback errorCallback
   * )
   * request - request body for registration.Has filterCriteria variable for further
   * filtering
   */

  registerNotification = () => {
    const { id, role } = this.user;
    const filterCriteria = {
      userId: `${id}`,
      role: role,
    };
    notificationTypes.forEach(type => {
      const request = createRequest(type, filterCriteria);
      this.rtnsInstance.registerNotify(
        request,
        type !== 'generic'
          ? this.notificationMessageFunc
          : this.notificationUIUpdaterFunc,
        this.notificationRegisterSuccessFunc,
        this.notificationRegisterErrorFunc
      );
    });
  };
  /**
   * @function notificationRegisterSuccessFunc
   * @param {object} response
   * @description - used as a callback on successfull registration in registerNotify
   * method of rtnsInstance
   */
  notificationRegisterSuccessFunc = response => {
    const { notificationTypesWithIds } = this.state;
    if (Object.prototype.hasOwnProperty.call(response, 'registerID')) {
      const newNotificationsTypesWithIds = [
        ...notificationTypesWithIds,
        response,
      ];
      this.setState({ notificationTypesWithIds: newNotificationsTypesWithIds });
    }
  };

  /**
   * @function notificationMessageFunc
   * @param {object} res
   * @description- used as a callback inorder to receive push notification from sprout
   * server - user specific
   */
  notificationMessageFunc = res => {
    const { t, notificationsCount, addNewNotificationToStore } = this.props;
    const { notificationMessages } = this.state;
    const newNotifications = [...notificationMessages];
    const response = filterResponse(res, t);
    const storageScenario = storage.getItem(`openScenario`);
    const currentScenarioId = storageScenario
      ? storageScenario.id.toString()
      : null; //done when user is not in any scenario
    if (response.scenarioId === currentScenarioId && response.notify) {
      if (response.notifyObject && response.notifyObject.snackType) {
        newNotifications.push(response.notifyObject);
        this.setState({ notificationMessages: newNotifications });
        addNewNotificationToStore(res.payload);
        notificationsCount(1);
      }
    } else if (response.notify) {
      addNewNotificationToStore(res.payload);
      notificationsCount(1);
    }
  };

  /**
   *
   * @param {*} res - response from BE as part of generic notification
   * @description - this is used to update the UI as per generic notification - not user specific
   */

  notificationUIUpdaterFunc = res => {
    const { updateJobStatus, t } = this.props;

    const openScenario = storage.getItem(`openScenario`);
    try {
      const responsePayload = res['payload']['data'];
      if (typeof responsePayload !== 'object')
        throw new Error({ message: 'Parse Error from Server' });
      switch (responsePayload['eventType']) {
        case 'solver': {
          updateJobStatus(responsePayload);
          break;
        }
        case 'pairing': {
          const pathChecker = matchPath(history.location.pathname, {
            path: '/pairings/:id',
            exact: true,
            strict: true,
          });
          if (
            openScenario &&
            openScenario.id.toString() === responsePayload['scenarioId'] &&
            pathChecker &&
            !this.state.hasPairingNotification &&
            isReadOnlyMode()
          ) {
            const newResponse = notificationCreator(responsePayload, t);
            const newNotifications = [...this.state.notificationMessages];
            if (this.state.notificationMessages.length < 4) {
              newNotifications.push(newResponse);
            } else {
              newNotifications.splice(3, 0, newResponse);
            }
            this.setState({
              notificationMessages: newNotifications,
              hasPairingNotification: true,
            });
            // Remove old pairing store in session storage
            storage.removeItem('pairingStore');
          }

          break;
        }
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * @function-  unregisterNotificationTypes = () => {
   * @description - This method is used to unregister different notification types such as
   * solver, generic etc with the sprout rtns server.
   * rtnsInstance.registerNotify(
   * @params {object} request,
   * @callback unregisterSuccessCallback ,
   * @callback unregisterErrorCallback
   * )
   * request - request body for unregistration.Has filterCriteria variable for further
   * filtering
   */
  unregisterNotificationTypes = () => {
    const { notificationTypesWithIds } = this.state;
    const { id, role } = this.user;
    const filterCriteria = {
      userId: `${id}`,
      role: role,
    };
    if (notificationTypesWithIds.length) {
      notificationTypesWithIds.forEach((notificationType, i) => {
        this.rtnsInstance.unregisterNotify(
          { ...notificationType, filterCriteria: filterCriteria },
          this.unregisterSuccessCallback,
          this.unregisterErrorCallback
        );
        if (i === notificationTypesWithIds.length - 1) {
          this.rtnsInstance.unregisterClient(() => {
            this.rtnsInstance.disconnect();
            this.props.notificationDecrement();
          });
        }
      });
    }
  };

  unregisterSuccessCallback = response => {
    console.log(response);
  };

  unregisterErrorCallback = response => {
    console.log(response);
  };

  connectionCloseFunc = () => {
    const notificationMessage = [
      {
        snackType: 'noInternet',
        key: 'connectionClose',
        message: this.props.t('ERRORS.NOTIFICATIONS.noInternet'),
        autoHideDuration: 3600000,
        bottomheight: 10,
      },
    ];
    this.setState(
      {
        notificationMessages: notificationMessage,
        online: false,
      },
      () => {
        this.checkBackToOnline();
      }
    );
  };

  checkBackToOnline = () => {
    this.timer = setInterval(this.checkConnection, 5000);
  };

  checkConnection = () => {
    axios
      .get(offlineModeCheckURL)
      .then(() => {
        clearInterval(this.timer);
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
   * @function notificationRegisterErrorFunc
   * @param  {...any} error
   * @description -used as a callback on registration failures in registerNotify method of rtnsInstance
   */
  notificationRegisterErrorFunc = error => {
    console.log(error);
  };

  /**
   * @function clientRegisterSuccessFunc
   * @param  {...any} error
   * @description -used as a callback on successful client registration in registerClient method of rtnsInstance
   */
  clientRegisterSuccessFunc = response => {
    console.log(response);
  };

  onClearSnackBar = i => {
    console.log(`triggered`);
    this.setState(prevState => ({
      notificationMessages: prevState.notificationMessages.filter(
        n => n.key !== i
      ),
      hasPairingNotification: i === 'pairing' ? false : true,
    }));
  };

  render() {
    const { notificationMessages, online } = this.state;
    return (
      <React.Fragment>
        {this.props.children}
        {notificationMessages.length > 0 &&
          notificationMessages.slice(0, 4).map((notification, i) => {
            const bH = notification.bottomheight
              ? notification.bottomheight
              : i * 47;
            return (
              <Notification
                message={notification.message}
                type={notification.snackType}
                clear={() => this.onClearSnackBar(notification.key)}
                bottomheight={bH}
                key={notification.key}
                renderers={notification.renderers}
                autoHideDuration={
                  notification.autoHideDuration
                    ? notification.autoHideDuration
                    : 5000
                }
              />
            );
          })}
        {notificationMessages.length > 4 && (
          <Notification
            message={this.props.t('NOTIFICATIONS.additionalMsg', {
              notificationCount: notificationMessages.length - 4,
            })}
            type={'info'}
            clear={() =>
              this.onClearSnackBar(
                notificationMessages[4] ? notificationMessages[4].key : 'more'
              )
            }
            bottomheight={4 * 47}
            autoHideDuration={3600000}
            displayCloseButton={true}
          />
        )}

        <ModalLoader
          open={!online}
          loaderRequired={false}
          background="240, 248, 255"
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { userData: state.user.userData };
};

const mapDispatchToProps = dispatch => {
  return {
    notificationsCount: count => dispatch(notificationIncrement(count)),
    updateJobStatus: job => dispatch(updateJobStatus(job)),
    notificationDecrement: () => dispatch(notificationDecrement()),
    getInitialNotifications: userId => dispatch(fetchNotifications(userId)),
    addNewNotificationToStore: payload =>
      dispatch(addNewNotificationToStore(payload)),
    setUserDetails: data => dispatch(setUserDetails(data)),
  };
};

const RtnsNotify = connect(
  mapStateToProps,
  mapDispatchToProps
)(RtnsNotifications);

export default RtnsNotify;

RtnsNotifications.propTypes = {
  children: PropTypes.node.isRequired,
  notificationsCount: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  updateJobStatus: PropTypes.func.isRequired,
  notificationDecrement: PropTypes.func.isRequired,
  getInitialNotifications: PropTypes.func.isRequired,
  addNewNotificationToStore: PropTypes.func.isRequired,
  setUserDetails: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

RtnsNotifications.defaultProps = {
  userData: {},
};
