import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import ReactMarkDown from 'react-markdown';
import { connect } from 'react-redux';
import { getIcon } from './helpers';
import { checkPermission } from '../../../../utils/common';
import scopes from '../../../../constants/scopes';

const AlertRow = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 24px;
  min-height: 50px;
  font-size: 12px;

  &:hover {
    background: #ebebeb;
  }
  & div:first-child {
    width: 6%;
  }
  & div:nth-child(2) {
    width: 14%;
    font-weight: 700;
    font-size: 14px;
    color: #333333;
  }
  & div:nth-child(3) {
    width: 70%;
    line-height: 16.41px;
    white-space: normal;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    p {
      margin: 0;
    }
  }
  & div:nth-child(4) {
    width: 10%;
  }
  .alert-rule-name {
    color: #0a75c2;
    cursor: pointer;
    line-height: normal;
    text-decoration: underline;
  }
  .alert-edit-button {
    color: #0a75c2;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
  }
  .alert-edit-button[disabled] {
    color: rgba(0, 0, 0, 0.26);
    cursor: default;
  }
`;

export const AlertList = ({
  t,
  alerts,
  alertType,
  onAlertSelect,
  onAlertClear,
  openRuleEditDialog,
  readOnly,
  permissions,
}) => {
  const style = { width: '26px', viewBox: '0 0 26 26' };
  const Icon = getIcon(alertType);

  const handleDisabled = (value, data) => {
    return readOnly || !checkPermission(scopes.rules.ruleEdit, permissions);
  };

  return (
    <Fragment>
      {alerts &&
        alerts.map((alert, index) => {
          const tag = t(`PAIRINGS.alerts.tag.${alert.tag}`);
          const startDate = alert.leg
            ? moment(alert.leg.startDate).format('YYYY/MM/DD')
            : '';
          const flightNumber = alert.leg ? alert.leg.flightNumber : '';
          const description = alert.leg
            ? t('PAIRINGS.alerts.description', {
                tag,
                flightNumber,
                departureStationCode: alert.leg.departureStationCode,
                arrivalStationCode: alert.leg.arrivalStationCode,
                startDate,
              })
            : '';
          return (
            <AlertRow
              key={index}
              onMouseEnter={() => onAlertSelect(alertType, flightNumber)}
              onMouseLeave={onAlertClear}
            >
              <div>{Icon && <Icon {...style} />}</div>
              <div>{t(`PAIRINGS.alerts.type.${alertType}`)}</div>
              <div>
                {alert.rule && (
                  <p>
                    <button
                      type="button"
                      className="alert-rule-name button-reset"
                      onClick={() => openRuleEditDialog(alert.rule)}
                    >
                      {alert.rule.name}
                    </button>
                  </p>
                )}
                {alert.message && <p>{alert.message}</p>}
                <ReactMarkDown source={description} />
              </div>
              <div>
                {alert.rule && (
                  <button
                    disabled={handleDisabled()}
                    type="button"
                    className="alert-edit-button button-reset"
                    id={`edit-rule-btn-${alertType}-${index}`}
                    onClick={() => openRuleEditDialog(alert.rule)}
                  >
                    {t('PAIRINGS.alerts.editRule')}
                  </button>
                )}
              </div>
            </AlertRow>
          );
        })}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return { permissions: state.user.permissions };
};

AlertList.propTypes = {
  t: PropTypes.func.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  alertType: PropTypes.string.isRequired,
  onAlertSelect: PropTypes.func.isRequired,
  onAlertClear: PropTypes.func.isRequired,
  openRuleEditDialog: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  permissions: PropTypes.shape([]).isRequired,
};

export default connect(mapStateToProps)(AlertList);
