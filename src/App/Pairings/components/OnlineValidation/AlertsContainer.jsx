import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Dialog from './Dialog';
import AlertListWithConnect from './AlertList';
import RuleDialog from './Rule';
import ModalLoader from '../../../../components/ModalLoader';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';

import { perfectScrollConfig } from '../../../../utils/common';
import PairingBar from './PairingBar';

const AlertListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 260px;
  margin: 1px 0;
`;
export class AlertsContainer extends Component {
  state = {
    ruleSelected: null,
    alertSelected: null,
    overlay: false,
    openLoader: false,
  };

  handleAlertSelect = (alertType, flightNumber) => {
    this.setState({
      alertSelected: {
        alertType,
        flightNumber,
      },
    });
  };

  handleAlertClear = () => {
    this.setState({ alertSelected: null });
  };

  openRuleEditDialog = ruleSelected => {
    this.setState({ ruleSelected });
  };

  handleCancel = () => {
    this.setState({
      alertSelected: null,
      ruleSelected: null,
      overlay: false,
      openLoader: false,
    });
    this.props.handleCancel();
    this.props.clearErrorNotification();
  };

  handleBack = () => {
    this.setState({
      ruleSelected: null,
      overlay: false,
      openLoader: false,
    });
    this.props.clearErrorNotification();
  };

  setOverlay = () => {
    this.setState({ overlay: true });
  };

  removeOverlay = () => {
    this.setState({ overlay: false }, () => {
      this.props.clearErrorNotification();
    });
  };

  toggleLoader = (state = false) => {
    this.setState({ openLoader: state });
  };

  render() {
    const { overlay, ruleSelected, alertSelected, openLoader } = this.state;
    const {
      t,
      pairing,
      open,
      openItemId,
      ruleset,
      readOnly,
      reportError,
    } = this.props;
    const { alerts } = pairing;
    return (
      <Dialog
        title={
          ruleSelected
            ? t(`PAIRINGS.alerts.DIALOG.editRule`)
            : `${t(`PAIRINGS.alerts.DIALOG.showAlerts`)} ${
                pairing && pairing.name ? pairing.name : ''
              }`
        }
        maxWidth="sm"
        fullWidth={true}
        cancelButton={t(`PAIRINGS.alerts.DIALOG.close`)}
        formId={'alertDialog'}
        open={open}
        handleCancel={this.handleCancel}
        onClose={this.handleCancel}
        backButton={t(`PAIRINGS.alerts.DIALOG.back`)}
        handleBack={this.handleBack}
        enableBack={!!ruleSelected}
        overlayComponent={
          overlay ? (
            <div
              className="pairing-alert-rule-overlay"
              onClick={this.removeOverlay}
            />
          ) : null
        }
      >
        <Fragment>
          {!ruleSelected && (
            <PairingBar pairing={pairing} alertSelected={alertSelected} />
          )}

          {!ruleSelected && (
            <AlertListContainer>
              <PerfectScrollbar option={perfectScrollConfig}>
                {alerts &&
                  alerts.errorAlerts &&
                  Array.isArray(alerts.errorAlerts) && (
                    <AlertListWithConnect
                      t={t}
                      alerts={alerts.errorAlerts}
                      alertType="error"
                      onAlertSelect={this.handleAlertSelect}
                      onAlertClear={this.handleAlertClear}
                      openRuleEditDialog={this.openRuleEditDialog}
                      readOnly={readOnly}
                    />
                  )}

                {alerts &&
                  alerts.warningAlerts &&
                  Array.isArray(alerts.warningAlerts) && (
                    <AlertListWithConnect
                      t={t}
                      alerts={alerts.warningAlerts}
                      alertType="warning"
                      onAlertSelect={this.handleAlertSelect}
                      onAlertClear={this.handleAlertClear}
                      openRuleEditDialog={this.openRuleEditDialog}
                      readOnly={readOnly}
                    />
                  )}

                {alerts &&
                  alerts.cautionAlerts &&
                  Array.isArray(alerts.cautionAlerts) && (
                    <AlertListWithConnect
                      t={t}
                      alerts={alerts.cautionAlerts}
                      alertType="caution"
                      onAlertSelect={this.handleAlertSelect}
                      onAlertClear={this.handleAlertClear}
                      openRuleEditDialog={this.openRuleEditDialog}
                      readOnly={readOnly}
                    />
                  )}

                {alerts &&
                  alerts.infoAlerts &&
                  Array.isArray(alerts.infoAlerts) && (
                    <AlertListWithConnect
                      t={t}
                      alerts={alerts.infoAlerts}
                      alertType="info"
                      onAlertSelect={this.handleAlertSelect}
                      onAlertClear={this.handleAlertClear}
                      openRuleEditDialog={this.openRuleEditDialog}
                      readOnly={readOnly}
                    />
                  )}
              </PerfectScrollbar>
            </AlertListContainer>
          )}

          {ruleSelected && (
            <RuleDialog
              t={t}
              rule={ruleSelected}
              openItemId={openItemId}
              ruleset={ruleset}
              readOnly={readOnly}
              reportError={reportError}
              overlay={overlay}
              setOverlay={this.setOverlay}
              removeOverlay={this.removeOverlay}
              toggleLoader={this.toggleLoader}
            />
          )}

          <ModalLoader
            open={openLoader}
            title={t(`PAIRINGS.alerts.loader`)}
            color="white"
          />
        </Fragment>
      </Dialog>
    );
  }
}

AlertsContainer.propTypes = {
  t: PropTypes.func.isRequired,
  pairing: PropTypes.shape({
    name: PropTypes.string,
    alerts: {
      errorAlerts: PropTypes.shape(),
      warningAlerts: PropTypes.shape(),
      cautionAlerts: PropTypes.shape(),
      infoAlerts: PropTypes.shape(),
    },
  }).isRequired,
  open: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  ruleset: PropTypes.number,
  readOnly: PropTypes.bool,
  handleCancel: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  clearErrorNotification: PropTypes.func.isRequired,
};

AlertsContainer.defaultProps = {
  ruleset: null,
  readOnly: null,
};

export default withErrorHandler(AlertsContainer);
