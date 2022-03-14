import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Delete } from '@material-ui/icons';

import SolverIcon from '../../App/Solver/SolverIcon/SolverIcon';
import { shortenText } from '../../utils/common';
import unreadIcon from './images/unreadIcon.svg';
import ReactMarkDown from 'react-markdown';
import { timeModifier } from './helper';
import SolverNotificationLink from './SolverNotificationLinkRenderer';

const textOverflowStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
`;

const CardHolder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
  padding: 3px 0;
  font-size: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
  background: #fafafa;

  & :hover {
    background: #e8f4fc;
  }
`;

const Row1 = styled.div`
  display: flex;
  flex-basis: 25%;
  align-items: center;
  padding: 5px 20px;

  & > span:nth-child(2) {
    font-weight: 600;
    margin-right: 3px;
  }
  & > span:nth-child(3) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span {
      width: 250px;
      ${textOverflowStyle};
    }
    & > svg {
      color: #0a75c2;
    }
  }
`;

const Row2 = styled.div`
  flex-basis: 50%;
  padding: 0 20px;

  & > div {
    width: 322px;
    & > span {
      color: #5098e7;
      cursor: pointer;
      word-break: break-all;
    }
  }
`;

const Row3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-basis: 25%;
  padding: 5px 20px;
  & > span {
    color: #5e5e5e;
  }
  & > img {
    width: 10px;
    margin: 7px;
  }
`;

class NotificationCard extends Component {
  renderNotification = (notification, t) => {
    let jsx = null;
    switch (notification.eventType) {
      case 'solver':
        jsx = (
          <ReactMarkDown
            source={
              notification.status === 'Done-success'
                ? t('NOTIFICATION.notificationTexts.solverRequestCompleted', {
                    solverRequestName: shortenText(notification.solverName, 70),
                    solverPath: `solver/${notification.scenarioId}/${
                      notification.solverId
                    }`,
                  })
                : t('NOTIFICATION.notificationTexts.solverRequestFailed', {
                    solverRequestName: shortenText(notification.solverName, 70),
                    solverPath: `solver/${notification.scenarioId}/${
                      notification.solverId
                    }`,
                  })
            }
            renderers={{
              paragraph: 'div',
              link: SolverNotificationLink,
            }}
          />
        );

        break;
      default:
        break;
    }
    return jsx;
  };

  render() {
    const { t, deleteNotification, notificationResponse } = this.props;
    const {
      eventId,
      scenarioName,
      viewStatus,
      lastModified,
    } = this.props.notificationResponse;
    return (
      <CardHolder>
        <Row1>
          <SolverIcon
            style={{
              width: '16px',
              marginRight: '5px',
            }}
            status={notificationResponse.alertType}
          />
          <span>{t('NOTIFICATION.notificationTexts.scenario')}</span>
          <span>
            <span>{scenarioName}</span>
            <Delete
              style={{ cursor: 'pointer' }}
              onClick={() => {
                deleteNotification(eventId);
              }}
            />
          </span>
        </Row1>
        <Row2>{this.renderNotification(notificationResponse, t)}</Row2>
        <Row3>
          <span>{timeModifier(lastModified)}</span>
          {viewStatus === 'UNSEEN' && (
            <img src={unreadIcon} alt={'notification unread icon'} />
          )}
        </Row3>
      </CardHolder>
    );
  }
}

NotificationCard.propTypes = {
  t: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  notificationResponse: PropTypes.shape([{}]).isRequired,
};

export default NotificationCard;
