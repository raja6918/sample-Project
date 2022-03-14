import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import DutyContainer from './DutyContainer';
import RestContainer from './RestContainer';
import Tooltip from '../../../../../../components/Tooltip';
import ConditionalDrawer from '../../../../../../components/ConditionalDrawer';
import MenuAction from '../../../../../../components/Menu/MenuAction.jsx';
import withErrorHandler from '../../../../../../components/ErrorHandler/withErrorHandler';

import storage from '../../../../../../utils/storage';
import { openInNewTab } from './utils';
import { perfectScrollConfig } from '../../../../../../utils/common';
import * as pairingService from '../../../../../../services/Pairings';

import {
  preparePairingDetailsData,
  getCrewCompositionString,
  getTagsString,
  getPairingDate,
  mainStats,
} from './helpers';
import { getIcon } from '../../../OnlineValidation/helpers';

import './PairingDetails.scss';

const translationKey = 'PAIRINGS.details';

export class PairingDetails extends React.PureComponent {
  state = {
    anchorEl: null,
    timezone: 0,
    pairingDetails: {},
    detailsLoaded: false,
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (!nextProps.open) {
      return {
        detailsLoaded: false,
      };
    }
    return state;
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeTimezone = event => {
    this.setState({ timezone: event.target.value });
  };

  handleOpenNewWindow = () => {
    const { selectedPairing } = this.props;
    const openPreview = storage.getItem('openPreview');

    if (openPreview) {
      storage.removeItem('openPreview');
      storage.setItem('openPairingDetailsScenarioId', {
        scenarioId: openPreview.previewId,
      });
    }

    openInNewTab(
      location.protocol +
        '//' +
        location.host +
        '/pairing-details/' +
        selectedPairing.id
    );

    if (openPreview) {
      storage.setItem('openPreview', openPreview);
      storage.removeItem('openPairingDetailsScenarioId');
    }

    this.props.onClose();
  };

  generateData = (activities = []) => {
    const components = [];
    const { t } = this.props;
    const activitiesCount = activities.length;

    for (let i = 0; i < activitiesCount; i++) {
      const activity = activities[i];
      const commonProps = {
        key: `${activity.type}-${i}`,
        activity,
        t,
      };

      if (activity.type === 'DUT') {
        components.push(<DutyContainer {...commonProps} />);
      } else if (activity.type === 'LO') {
        components.push(<RestContainer {...commonProps} />);
      }
    }

    return components;
  };

  handleBackTop = () => {
    const scrollContainers = document.getElementsByClassName(
      'scrollbar-container ps ps--active-y'
    );
    for (let i = 0; i < scrollContainers.length; i++) {
      scrollContainers[i].scrollTop = 0;
    }
    const mainContainer = document.getElementById('pd-container');
    mainContainer.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  fetchPairingDetails(open, selectedPairing) {
    const { detailsLoaded } = this.state;
    const openedScenario = storage.getItem('openScenario');
    const openPreview = storage.getItem('openPreview');
    const openPairingDetailsScenarioId = storage.getItem(
      'openPairingDetailsScenarioId'
    );

    let openedScenarioId = openedScenario ? openedScenario.id : '';
    if (openPreview) {
      openedScenarioId = openPreview.previewId;
    }
    if (openPairingDetailsScenarioId) {
      openedScenarioId = openPairingDetailsScenarioId.scenarioId;
    }

    if (!open && this.source) {
      /* Cancel a pending request if the pairing details page is closed */
      this.source.cancel();
    }

    if (open && !detailsLoaded) {
      this.CancelToken = axios.CancelToken;
      this.source = this.CancelToken.source();
      const requestToken = { cancelToken: this.source.token };
      pairingService
        .getPairingDetails(selectedPairing, openedScenarioId, requestToken)
        .then(response => {
          const preparedDetailsData = preparePairingDetailsData(response);
          this.setState({
            pairingDetails: preparedDetailsData,
            detailsLoaded: true,
          });
        })
        .catch(error => {
          if (error.response) this.props.reportError({ error });
        });
    }
  }

  componentDidMount() {
    if (this.props.newTab) {
      const pairingID = this.props.match && this.props.match.params.pairingID;
      const { open } = this.props;
      this.fetchPairingDetails(open, pairingID);
    }
  }

  componentDidUpdate() {
    const { open, selectedPairing } = this.props;
    this.fetchPairingDetails(open, selectedPairing && selectedPairing.id);
  }

  generateOtherStatsRow = (otherStats = []) => {
    const { pairingDetails } = this.state;
    const { t } = this.props;
    const rows = [];
    if (otherStats.length) {
      for (let i = 0; i < otherStats.length; i += 2) {
        if (otherStats[i]) {
          rows.push(
            <TableRow key={i}>
              <TableCell>
                {t(`PAIRINGS.details.stats.${otherStats[i]}`)}
              </TableCell>
              <TableCell>{pairingDetails.stats[otherStats[i]]}</TableCell>
              {otherStats[i + 1] && (
                <React.Fragment>
                  <TableCell>
                    {t(`PAIRINGS.details.stats.${otherStats[i + 1]}`)}
                  </TableCell>
                  <TableCell>
                    {pairingDetails.stats[otherStats[i + 1]]}
                  </TableCell>
                </React.Fragment>
              )}
            </TableRow>
          );
        }
      }
    }

    return rows;
  };

  getAlertIcon = alertType => {
    const Icon = getIcon(alertType);
    const style = { width: '24px', height: '24px', viewBox: '0 0 26 26' };
    return Icon && <Icon {...style} />;
  };

  modifyAlerts = (alerts, type, alertsList) => {
    let modifiedAlerts = [];
    modifiedAlerts = alerts.map(alert => ({ ...alert, type }));
    return [...alertsList, ...modifiedAlerts];
  };

  generateAlerts = alerts => {
    let alertsList = [];
    const typeList = {
      errorAlerts: 'error',
      warningAlerts: 'warning',
      cautionAlerts: 'caution',
      infoAlerts: 'info',
    };
    for (const key in alerts) {
      if (!!key && Array.isArray(alerts[key])) {
        alertsList = this.modifyAlerts(alerts[key], typeList[key], alertsList);
      }
    }
    return alertsList;
  };

  generateAlertsRow = (alerts = []) => {
    const { t } = this.props;
    const rows = [];

    alerts = this.generateAlerts(alerts);
    if (alerts.length) {
      for (let i = 0; i < alerts.length; i += 2) {
        if (alerts[i]) {
          const startDate =
            alerts[i] && alerts[i].leg
              ? moment(alerts[i].leg.startDate).format('YYYY/MM/DD')
              : '';
          const description = alerts[i].leg
            ? t('PAIRINGS.alerts.detailDescription', {
                tag: t(`PAIRINGS.alerts.tag.${alerts[i].tag}`),
                flightNumber: alerts[i].leg.flightNumber,
                departureStationCode: alerts[i].leg.departureStationCode,
                arrivalStationCode: alerts[i].leg.arrivalStationCode,
                startDate,
              })
            : '';
          rows.push(
            <TableRow key={i}>
              <TableCell style={{ width: alerts.length === 1 ? '20%' : '' }}>
                <span className="alertIcon">
                  {this.getAlertIcon(alerts[i].type)}
                </span>
                <span className="alertType">
                  {t(`PAIRINGS.alerts.type.${alerts[i].type}`)}
                </span>
              </TableCell>
              <TableCell
                className="alertMsg"
                style={{ width: alerts.length === 1 ? '30%' : '' }}
              >
                {alerts[i].message && (
                  <p className="alertMessage">{alerts[i].message}</p>
                )}
                {description}
              </TableCell>
              {alerts[i + 1] && (
                <React.Fragment>
                  <TableCell>
                    <span className="alertIcon">
                      {this.getAlertIcon(alerts[i + 1].type)}
                    </span>
                    <span className="alertType">
                      {t(`PAIRINGS.alerts.type.${alerts[i + 1].type}`)}
                    </span>
                  </TableCell>
                  <TableCell className="alertMsg">
                    {alerts[i + 1].message && (
                      <p className="alertMessage">{alerts[i + 1].message}</p>
                    )}
                    {description}
                  </TableCell>
                </React.Fragment>
              )}
            </TableRow>
          );
        }
      }
    } else {
      rows.push(
        <TableRow>
          <TableCell colspan="4" style={{ textAlign: 'center' }}>
            <span className="noAlerts">
              {t('PAIRINGS.alerts.noAlertsMessage')}
            </span>
          </TableCell>
        </TableRow>
      );
    }
    return rows;
  };

  render() {
    if (!this.state.detailsLoaded) return null;
    const open = Boolean(this.state.anchorEl);
    const { t, newTab } = this.props;
    const { pairingDetails, detailsLoaded } = this.state;
    const otherStats = pairingDetails.stats
      ? Object.keys(pairingDetails.stats).filter(x => !mainStats.includes(x))
      : [];
    const alerts = pairingDetails.alerts ? pairingDetails.alerts : [];
    return (
      <React.Fragment>
        <ConditionalDrawer
          open={this.props.open}
          onEscapeKeyDown={this.props.onClose}
          anchor="bottom"
          PaperProps={{
            id: 'pd-container',
            style: {
              minWidth: '768px',
              minHeight: 'calc(100vh)',
            },
          }}
          renderDrawer={!newTab}
        >
          <PerfectScrollbar option={perfectScrollConfig}>
            {detailsLoaded && (
              <React.Fragment>
                <div className="pd-header">
                  {!this.props.newTab && (
                    <div className="back" onClick={this.props.onClose}>
                      <IconButton>
                        <Icon className="arrow-back">arrow_back</Icon>
                      </IconButton>
                      <span className="text">
                        {t(`${translationKey}.goBack`)}
                      </span>
                    </div>
                  )}
                  <div
                    className="title"
                    style={{
                      paddingLeft: newTab ? '120px' : '',
                    }}
                  >
                    <span className="main-title">
                      {`${t(`${translationKey}.pairing`)} ${
                        pairingDetails.name
                      }`}
                    </span>
                    <span className="sub-title">
                      {getPairingDate(pairingDetails.startDateTime)}
                    </span>
                  </div>
                  <div className="actions">
                    <form autoComplete="off">
                      <FormControl>
                        <Select
                          value={this.state.timezone}
                          onChange={this.handleChangeTimezone}
                          inputProps={{
                            name: 'timezone',
                            id: 'timezone',
                          }}
                          style={{
                            minWidth: '152px',
                          }}
                        >
                          <MenuItem value={0}>
                            {t(`${translationKey}.utc`)}
                          </MenuItem>
                          <MenuItem value={1}>
                            {t(`${translationKey}.localTime`)}
                          </MenuItem>
                          <MenuItem value={2}>
                            {t(`${translationKey}.localBaseTime`)}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                    {!this.props.newTab && (
                      <Tooltip title={t(`${translationKey}.openNewWindow`)}>
                        <IconButton
                          aria-label="More"
                          aria-haspopup="true"
                          onClick={this.handleOpenNewWindow}
                        >
                          <Icon color="primary">open_in_new</Icon>
                        </IconButton>
                      </Tooltip>
                    )}
                    <IconButton
                      aria-label="More"
                      aria-owns={open ? 'long-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleClick}
                    >
                      <Icon color="primary">more_vert</Icon>
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={this.state.anchorEl}
                      open={open}
                      onClose={this.handleClose}
                    >
                      <MenuAction
                        onClick={this.handleClose}
                        icon={'print'}
                        text={t(`${translationKey}.print`)}
                      />
                      <MenuAction
                        onClick={this.handleClose}
                        icon={'file_copy'}
                        text={t(`${translationKey}.exportPdf`)}
                      />
                    </Menu>
                  </div>
                </div>
                <div className="pd-content">
                  <div className="title">
                    <span>{t(`${translationKey}.pairingDetails`)}</span>
                  </div>
                  <div className="info">
                    <span className="info-group">
                      <span>{t(`${translationKey}.crewBase`)}:</span>
                      {` ${pairingDetails.departureStationCode}`}
                    </span>
                    <span className="info-group">
                      <span>{t(`${translationKey}.crewComposition`)}:</span> [
                      {getCrewCompositionString(pairingDetails.crewComposition)}
                      ]
                    </span>
                    <span className="info-group">
                      <span>{t(`${translationKey}.tags`)}:</span>
                      {` ${getTagsString(pairingDetails.tags)}`}
                    </span>
                  </div>
                  {this.generateData(pairingDetails.activities)}
                  <div className="statistics-summary">
                    {mainStats.map((stat, index) => {
                      return (
                        <span className="statistic-item" key={index}>
                          <span>{`${t(
                            `PAIRINGS.details.stats.${stat}`
                          )} :`}</span>
                          {` ${pairingDetails.stats[stat]}`}
                        </span>
                      );
                    })}
                  </div>
                  {otherStats.length > 0 && (
                    <div className="statistics-data">
                      <div className="title">
                        {t(`${translationKey}.otherstatistics`)}
                      </div>
                      <Paper>
                        <Table className="other-statsistics">
                          <TableHead style={{ background: '#F1F1F1' }}>
                            <TableRow>
                              <TableCell style={{ color: '#000' }}>
                                {t('PAIRINGS.details.statisticsHeaderName')}
                              </TableCell>
                              <TableCell style={{ color: '#000' }}>
                                {t('PAIRINGS.details.statisticsHeaderValue')}
                              </TableCell>
                              <React.Fragment>
                                <TableCell style={{ color: '#000' }}>
                                  {t('PAIRINGS.details.statisticsHeaderName')}
                                </TableCell>
                                <TableCell style={{ color: '#000' }}>
                                  {t('PAIRINGS.details.statisticsHeaderValue')}
                                </TableCell>
                              </React.Fragment>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.generateOtherStatsRow(otherStats)}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  )}
                  {alerts && (
                    <div className="statistics-data">
                      <div className="title">
                        {t(`${translationKey}.alerts`)}
                      </div>
                      <Paper>
                        <Table className="other-statsistics">
                          <TableHead style={{ background: '#F1F1F1' }}>
                            <TableRow>
                              <TableCell style={{ color: '#000' }}>
                                {t('PAIRINGS.details.alertHeaderType')}
                              </TableCell>
                              <TableCell style={{ color: '#000' }}>
                                {t('PAIRINGS.details.alertHeaderDescription')}
                              </TableCell>
                              <React.Fragment>
                                <TableCell style={{ color: '#000' }}>
                                  {t('PAIRINGS.details.alertHeaderType')}
                                </TableCell>
                                <TableCell style={{ color: '#000' }}>
                                  {t('PAIRINGS.details.alertHeaderDescription')}
                                </TableCell>
                              </React.Fragment>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.generateAlertsRow(alerts)}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  )}
                </div>
              </React.Fragment>
            )}
          </PerfectScrollbar>
        </ConditionalDrawer>

        {this.props.open && (
          <Tooltip title={t(`${translationKey}.backTop`)}>
            <span className="back-top" onClick={this.handleBackTop}>
              <i className="material-icons">arrow_upward</i>
              <span>{t(`${translationKey}.top`)}</span>
            </span>
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

PairingDetails.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired,
  open: PropTypes.bool,
  newTab: PropTypes.bool,
  selectedPairing: PropTypes.shape().isRequired,
  onClose: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
};

PairingDetails.defaultProps = {
  open: false,
  newTab: false,
};

export default withErrorHandler(PairingDetails);
