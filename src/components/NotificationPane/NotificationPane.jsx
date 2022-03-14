import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { DeleteSweep } from '@material-ui/icons';
import Base from '../FormDrawer/Base';
import NotificationCard from './NotificationCard';
import { perfectScrollConfig } from '../../utils/common';
import storage from '../../utils/storage';
import * as notificationService from '../../services/Notifications';
import {
  fetchNotifications,
  deleteSingleNotification,
  deleteAllNotification,
} from '../../actions/generic';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import Notification from '../Notification';

const FormContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 400px;
`;

const FormHeader = styled.div`
  height: 113px;
  padding: 20px 16px 35px 20px;
  background: #5098e7;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 100%;
    font-size: 18px;
    font-weight: 500;
  }
`;

const FormBody = styled.div`
  background: #f7f7f7;
  height: calc(100vh - 113px);
`;

const ClearMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c8c8c;
`;

export class NotificationPane extends Component {
  state = {
    notificationResponse: this.props.notificationResponse,
    message: '',
    snackType: 'error',
  };
  user = null;
  componentDidMount() {
    const { userData } = this.props;
    this.user = userData;
  }

  componentWillReceiveProps(newProps) {
    this.setState({ notificationResponse: newProps.notificationResponse });
  }

  deleteNotification = notificationId => {
    const { t } = this.props;
    const payload = {
      eventIds: [notificationId],
      status: 'CLEARED',
    };
    notificationService
      .updateNotificationStatus(payload)
      .then(() => {
        this.props.deleteSingleNotification(notificationId);
      })
      .catch(() => {
        this.setState({
          message: t('ERRORS.NOTIFICATIONS.message'),
        });
      });
  };

  sweepNotification = () => {
    const { t } = this.props;
    const payload = {
      status: 'CLEARED',
    };
    notificationService
      .updateAllNotifications(payload, this.user.id)
      .then(() => {
        this.props.deleteAllNotification();
      })
      .catch(() => {
        this.setState({
          message: t('ERRORS.NOTIFICATIONS.message'),
        });
      });
  };
  fetchOnScroll = debounce(
    () => this.props.fetchDataOnScroll(this.user.id, true),
    2000
  );

  render() {
    const { t, ...rest } = this.props;
    const { message, snackType } = this.state;
    const isNotificationsEmpty = this.state.notificationResponse.length === 0;
    return (
      <Base anchor="right" {...rest}>
        <FormContainer>
          <FormHeader>
            <div>
              <span>{t('NOTIFICATION.notificationPaneHeader')}</span>{' '}
              <DeleteSweep
                onClick={this.sweepNotification}
                style={
                  isNotificationsEmpty
                    ? { color: '#91b8e4' }
                    : { cursor: 'pointer' }
                }
                disabled={true}
              />
            </div>
          </FormHeader>
          <FormBody>
            <PerfectScrollbar
              option={perfectScrollConfig}
              onScrollDown={this.fetchOnScroll}
            >
              <div>
                {this.state.notificationResponse.map((notification, i) => (
                  <NotificationCard
                    t={t}
                    key={
                      notification ? notification.eventId : `notification${i}`
                    }
                    notificationResponse={notification}
                    deleteNotification={this.deleteNotification}
                  />
                ))}
              </div>
              {isNotificationsEmpty && (
                <ClearMessage>
                  {t('NOTIFICATION.notificationTexts.noNotification')}
                </ClearMessage>
              )}
            </PerfectScrollbar>
          </FormBody>
        </FormContainer>
        <Notification message={message} type={snackType} />
      </Base>
    );
  }
}

const mapStateToProps = state => {
  return {
    notificationResponse: state.notifications['notifications'],
    userData: state.user.userData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDataOnScroll: (userId, scroll) =>
      dispatch(fetchNotifications(userId, scroll)),
    deleteSingleNotification: eventId =>
      dispatch(deleteSingleNotification(eventId)),
    deleteAllNotification: () => dispatch(deleteAllNotification()),
  };
};

NotificationPane.propTypes = {
  t: PropTypes.func.isRequired,
  notificationResponse: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchDataOnScroll: PropTypes.func.isRequired,
  deleteSingleNotification: PropTypes.func.isRequired,
  deleteAllNotification: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

NotificationPane.defaultProps = {
  userData: {},
};

const NotificationPaneComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationPane);

export default NotificationPaneComponent;
