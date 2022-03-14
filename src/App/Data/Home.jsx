import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Button from '@material-ui/core/Button';
import EditModeBar from '../../components/EditModeBar';

import Icon from '../../components/Icon';

import storage from '../../utils/storage';
import {
  dataCardClassNames,
  pushBinDataToAnalytics,
  pushImportDataToAnalytics,
} from '../../utils/analytics';
import { formatDate, formatScenarioDate } from './utils/utils';
import ImportDialog from './Import/ImportDialog';
import VersionsDialog from './Import/VersionsDialog';
import StopDialog from '../../components/Dialog/StopDialog';
import NewDataDialog from './Import/NewDataDialog';
import DataConversionDialog from './Import/DataConversionDialog';
import ImportErrorDialog from './Import/ImportErrorDialog';
import ModalLoader from '../../components/ModalLoader';
import Notification from '../../components/Notification';
import { connect } from 'react-redux';

import scenariosService from '../../services/Scenarios';
import * as binService from '../../services/Data/bins';
import * as importService from '../../services/Data/import';
import AccessEnabler from '../../components/AccessEnabler';
import scopes from '../../constants/scopes';

import { validationErrorKeys } from './homeConstants';
import {
  IMPORT_CONVERTION_WARNINGS,
  IMPORT_TIMER_VALUE,
  COMPLETED,
  CONVERSION_FAILED,
  COMPLETED_WITH_ERRORS,
  PROCESS_STATUS_CONTINUE,
  PROCESS_STATUS_ACKNOWLEDGE,
  UPDATE_FAILED,
  UNKNOWN_FAILED,
  PROCESS_STATUS_STOP,
  STOPPED,
} from './Import/const';
import { perfectScrollConfig, checkIsTemplate } from '../../utils/common';

const MainContainer = styled.div`
  /* overflow-y: auto; */
  -webkit-overflow-scrolling: touch;
  max-height: calc(100vh - 54px);
`;

const Header = styled.div`
  width: 100%;

  padding: 23px 24px;
  position: relative;
  & h2,
  & span {
    display: inline-block;
    vertical-align: top;
  }
  & h2 {
    font-weight: 400;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.87);
    margin: 0;
    line-height: 24px;
  }
  & span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 400;
    text-align: center;
  }
  & span > p {
    color: #ff650c;
    font-size: 13px;
    text-align: center;
    margin-top: 5px;
  }
  & button {
    position: absolute;
    right: 0%;
    margin-right: 24px;
    width: 115px;
    height: 32px;
    font-size: 13px;
  }
  & button > span {
    color: #ffffff;
    width: inherit;
    font-size: 13px;
    top:50%;
    transform: translateY(-50%);
    left: 0%;
    }
  }
`;
const CardsContainer = styled.div`
  text-align: center;
  width: 95%;
  max-width: 1300px;
  margin: 0 auto;
  margin-top: 10px;
  height: ${props =>
    props.editMode ? 'calc(100vh - 160px)' : 'calc(100vh - 135px)'};

  .extra-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1;
  }

  & > div > div {
    width: 250px;
    margin: 0 15px 30px 15px;
    display: inline-block;
    border-radius: 2px;
    box-shadow: 0px 1px 2px gray;
  }
  & div > div.bot {
    padding: 12.5px 20px;
    background-color: #fff;
    & > div:nth-child(1) {
      & span:first-child {
        font-size: 18px;
        color: ${props => (props.importInProgress ? '#dfdfdf' : '#000000')};
        font-weight: 400;
      }
    }
    & > div:nth-child(2) {
      text-align: center;
    }
    & > div:nth-child(3) {
      text-align: right;
      & span:first-child {
        font-size: 18px;
        color: ${props => (props.importInProgress ? '#dfdfdf' : '#d0021b')};
        font-weight: 400;
        text-align: center;
      }
      & button {
        margin: 8px auto 0 auto;
        text-align: right;
        color: inherit;
        width: 30px;
        height: 30px;
        & span{
          color: #0a75c2 !important;
        }
      }
    }
    & > div {
      display: inline-block;
      vertical-align: bottom;
      width: 33.33%;
      & * {
        display: block;
        margin: 0;
      }
      & span:first-child {
        margin-bottom: 5px;
      }
      & .type-icon {
        width: 26.5px;
        height: 26.5px;
        border-radius: 30px;
        border: ${props =>
          props.importInProgress ? '2px solid #dfdfdf' : '2px solid #0a75c2'};
        font-size: 18px;
        text-align: center;
        line-height: 22px;
        padding: 0 3px;
        margin: 8px auto 0 auto;
      }
    }
  }
  & div > div a {
    text-decoration: none;
    padding: 12px 22px 10px 22px;
    width: 100%;
    height: 170px;
    display: flex;
    flex-direction: column;
    cursor: ${props => (props.importInProgress ? 'default' : 'pointer')};
    background-color: ${props =>
      props.importInProgress ? '#f0f0f0' : '#e5e5e5'};
    & * {
      display: block;
    }
    & .icon {
      margin: 0 auto 12px auto;
      font-size: 32px;
      width: 55px;
      padding: 0 11.5px;
      height: 55px;
      line-height: 55px;
      color: #fff;
      border-radius: 55px;
    }
    & img.icon{
      width: auto;
    }
    & span.name {
      font-size: 20px;
      color: ${props =>
        props.importInProgress
          ? 'rgba(211, 211, 211, 1)'
          : 'rgba(0, 0, 0, 0.87)'};
      text-align: center;
      font-weight: 400;
      margin-bottom: 17px;
    }
    & span.from,
    & span.versions,
    & span.new-versions,
    & span.date {
      opacity: 0.67;
      font-weight: 500;
      font-size: 12px;
      color: #000000;
      text-align: left;
      line-height: 20px;
      margin-right: 5px;
    }
    & span.date {
      font-size: 13px;
    }
    & span.versions {
      color: ${props => (props.importInProgress ? '#000000' : '#0A75C2')};
      text-align: left;
    }
    & span.new-versions{
      color: ${props => (props.importInProgress ? '#000000' : '#FF650C')} ;
      font-weight: bold;
      text-align: left;
    }
    & span.versions-container {
      display: flex;
    }
    & span.versions-read-only {
      & .versions, .new-versions {
        font-weight: 500 !important;
        color: #000000 !important;
      }
    }
  }
}
`;

const cardWidth = 280;

export class Home extends Component {
  state = {
    emptyCells: [],
    fetching: true,
    formattedDates: {},
    importDialogIsOpen: false,
    versionsDialogIsOpen: false,
    newDataDialogIsOpen: false,
    conversionDialogIsOpen: false,
    stopDialogIsOpen: false,
    importErrorDialogIsOpen: false,
    availableVersions: [],
    selectedDataType: '',
    selectedDataName: '',
    message: null,
    snackBarType: '',
    bins: [],
    newDataFiles: [],
    importProcessId: null,
    openLoader: false,
    loaderTitle: '',
    conversionWarnings: {},
    connectBinImportProgress: false,
    conversionErrors: [],
    isInternalError: false,
  };

  grid = '';
  startDate = null;
  endDate = null;
  userId = null;
  fetchImportStatusTimer = null;

  componentDidMount() {
    this.setEmptyCells();
    window.addEventListener('resize', this.setEmptyCells);
    const { openItemId, editMode, readOnly, scenarioBinId } = this.props;
    const updatedState = {};

    // revisit later: why is an api call when it is already saved in session storage
    // if (editMode || readOnly) {
    //   this.getScenarioDates(openItemId);
    //   return;
    // }

    const localOpenedScenario = storage.getItem('openScenario');
    const { userData: loggedUser } = this.props;

    if (!localOpenedScenario || !loggedUser) return;

    this.startDate = localOpenedScenario.startDate;
    this.endDate = localOpenedScenario.endDate;
    this.userId = loggedUser.id;

    const formattedDates = formatDate(this.startDate, this.endDate);
    const formattedStartDate = formatScenarioDate(this.startDate);
    const formattedEndDate = formatScenarioDate(this.endDate);

    updatedState.formattedDates = formattedDates;

    if (!scenarioBinId) {
      const allBinsData = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
      if (!checkIsTemplate()) {
        binService
          .getAllBins(allBinsData)
          .then(allBins => {
            updatedState.bins = allBins;
            this.setState(updatedState);
          })
          .catch(err => {
            this.setState(updatedState);
            console.error(err);
          });
      }
    } else {
      this.setState(updatedState);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { openItemId, editMode, readOnly, cards, t } = this.props;

    const localOpenedScenario = storage.getItem('openScenario');
    const startDate = localOpenedScenario ? localOpenedScenario.startDate : '';
    const endDate = localOpenedScenario ? localOpenedScenario.endDate : '';

    const formattedDates = formatDate(startDate, endDate);
    this.setState({ formattedDates });

    const cardsDataIsReady = this.state.connectBinImportProgress
      ? nextProps.cards.length > 0
      : cards.length === 0 && nextProps.cards.length > 0;

    let importProcessId = null;

    if (
      nextProps.importProcess &&
      Object.keys(nextProps.importProcess).length > 0
    ) {
      const newState = {};
      importProcessId = nextProps.importProcess.importProcessId || null;
      newState.importProcessId = importProcessId;

      if (importProcessId) {
        const { status } = nextProps.importProcess;

        if (status === IMPORT_CONVERTION_WARNINGS) {
          this.getConversionWarnings(importProcessId);
        } else {
          if (this.fetchImportStatusTimer) {
            window.clearInterval(this.fetchImportStatusTimer);
          }

          this.fetchImportStatusTimer = window.setInterval(
            this.getImportStatus,
            IMPORT_TIMER_VALUE
          );

          if (!this.state.importErrorDialogIsOpen) {
            newState.openLoader = true;
            newState.loaderTitle = t('DATA.import.loaderInProgress');
          }
        }
      }
      this.setState(newState);
    }

    // //Validation to show the Dialog
    if (cardsDataIsReady && !importProcessId) {
      if (!(readOnly || editMode)) {
        const newDataFiles = [];
        const lastOpenedScenario = storage.getItem('lastOpenedScenario');

        nextProps.cards.forEach(dataType => {
          if (dataType.newFilesAvailable && dataType.newFilesAvailable.length) {
            const { name, newFilesAvailable, type } = dataType;
            const dataObject = { name, newFilesAvailable, type };
            newDataFiles.push(dataObject);
          }
        });

        if (newDataFiles.length && lastOpenedScenario !== openItemId) {
          this.setState({
            newDataDialogIsOpen: true,
            importDialogIsOpen: false,
            newDataFiles,
          });
          storage.setItem('lastOpenedScenario', openItemId);
        } else if (this.state.connectBinImportProgress) {
          this.setState({
            importDialogIsOpen: true,
            connectBinImportProgress: false,
          });
        }
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setEmptyCells);
    window.clearInterval(this.fetchImportStatusTimer);
  }

  componentDidUpdate() {
    this.setEmptyCells();
  }

  getImportStatus = () => {
    const { importProcessId } = this.state;
    const { getHomeCards, t } = this.props;
    const userId = this.userId;

    const getImportData = {
      userId,
      importProcessId,
    };

    importService
      .getImportById(getImportData)
      .then(async importProcess => {
        const { status } = importProcess;
        const newState = {};
        switch (status) {
          case IMPORT_CONVERTION_WARNINGS:
            window.clearInterval(this.fetchImportStatusTimer);
            this.getConversionWarnings(importProcessId);
            newState.openLoader = false;
            break;
          case COMPLETED:
            window.clearInterval(this.fetchImportStatusTimer);
            await getHomeCards(false);
            newState.importProcessId = null;
            newState.openLoader = false;
            newState.message = t('DATA.import.importCompleted');
            newState.snackType = 'success';
            break;
          case COMPLETED_WITH_ERRORS:
            window.clearInterval(this.fetchImportStatusTimer);
            await getHomeCards(false);
            newState.importProcessId = null;
            newState.openLoader = false;
            break;
          case CONVERSION_FAILED:
            window.clearInterval(this.fetchImportStatusTimer);
            this.getConversionErrors(importProcessId);
            newState.openLoader = false;
            await getHomeCards(false);
            break;
          case UPDATE_FAILED:
            window.clearInterval(this.fetchImportStatusTimer);
            newState.importErrorDialogIsOpen = true;
            newState.isInternalError = true;
            newState.openLoader = false;
            await getHomeCards(false);
            break;
          case UNKNOWN_FAILED:
            window.clearInterval(this.fetchImportStatusTimer);
            newState.importErrorDialogIsOpen = true;
            newState.isInternalError = true;
            newState.openLoader = false;
            await getHomeCards(false);
            break;
          case STOPPED:
            window.clearInterval(this.fetchImportStatusTimer);
            await getHomeCards(false);
            newState.importProcessId = null;
            newState.openLoader = false;
            newState.message = t('DATA.import.importStopped');
            newState.snackType = 'error';
            newState.stopDialogIsOpen = false;
            break;
          default:
            break;
        }

        this.setState(newState);
      })
      .catch(error => {
        console.error({ error });
      });
  };

  getScenarioDates = scenarioId => {
    scenariosService
      .getScenarioDetails(scenarioId)
      .then(response => {
        const { startDate, endDate } = response;
        const formattedDates = formatDate(startDate, endDate);

        this.setState({ formattedDates });
      })
      .catch(error => {
        console.error({ error });
      });
  };

  setEmptyCells = () => {
    if (this.props.cards.length > 0) {
      const containerWidth = !!this.grid ? this.grid.clientWidth : 0;
      const rowNumber = Math.floor(containerWidth / cardWidth);

      const aux = this.props.cards.length % rowNumber;

      const left = aux === 0 || isNaN(aux) ? 0 : rowNumber - aux;

      if (this.state.emptyCells.length !== left) {
        const aux = [];
        for (let i = 0; i < left; i++) {
          aux.push({});
        }
        this.setState({ emptyCells: aux });
      }
    }
  };

  openImportDialog = () => {
    this.setState({
      importDialogIsOpen: true,
    });
  };

  closeImportDialog = () => {
    this.setState({
      importDialogIsOpen: false,
    });
  };

  openVersionsDialog = (
    event,
    selectedDataName,
    selectedDataType,
    currentVersion
  ) => {
    const { scenarioBinId } = this.props;

    event.preventDefault();
    binService
      .getOtherVersions(selectedDataType, scenarioBinId)
      .then(response => {
        const availableVersions = response.filter(
          v => v.version !== currentVersion
        );

        this.setState({
          versionsDialogIsOpen: true,
          availableVersions,
          selectedDataName,
          selectedDataType,
        });
      })
      .catch(error => {
        console.error({ error });
      });
  };

  closeVersionsDialog = () => {
    this.setState({
      versionsDialogIsOpen: false,
    });
  };

  closeNewDataDialog = () => {
    if (this.state.connectBinImportProgress) {
      this.setState({
        importDialogIsOpen: true,
      });
    }

    this.setState({
      newDataDialogIsOpen: false,
      connectBinImportProgress: false,
    });
  };

  closeConversionDialog = () => {
    const { t } = this.props;
    const { importProcessId } = this.state;
    const userId = this.userId;

    importService
      .updateImportStatus(PROCESS_STATUS_CONTINUE, importProcessId, userId)
      .then(() => {
        this.fetchImportStatusTimer = window.setInterval(
          this.getImportStatus,
          IMPORT_TIMER_VALUE
        );

        this.setState({
          conversionDialogIsOpen: false,
          openLoader: true,
          loaderTitle: t('DATA.import.loaderInProgress'),
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  stopImport = () => {
    const { t, getHomeCards } = this.props;
    const { importProcessId } = this.state;
    const userId = this.userId;
    const newState = {};
    importService
      .updateImportStatus(PROCESS_STATUS_STOP, importProcessId, userId)
      .then(() => {
        this.fetchImportStatusTimer = window.setInterval(
          this.getImportStatus,
          IMPORT_TIMER_VALUE
        );

        this.setState({
          conversionDialogIsOpen: false,
          openLoader: true,
          loaderTitle: t('DATA.import.stopLoader'),
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  closeStopDialog = () => {
    const { conversionWarnings } = this.state;

    const newState =
      Object.keys(conversionWarnings).length === 0 &&
      conversionWarnings.constructor === Object
        ? {
            stopDialogIsOpen: false,
          }
        : {
            stopDialogIsOpen: false,
            conversionDialogIsOpen: true,
          };
    this.setState(newState);
  };

  openStopDialog = () => {
    this.setState({
      conversionDialogIsOpen: false,
      stopDialogIsOpen: true,
    });
  };

  closeImportErrorDialog = () => {
    const { importProcessId } = this.state;
    const userId = this.userId;

    importService
      .updateImportStatus(PROCESS_STATUS_ACKNOWLEDGE, importProcessId, userId)
      .then(() => {
        this.setState({
          importErrorDialogIsOpen: false,
          importProcessId: null,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleImportForm = (files, filesMetadata) => {
    const { openItemId: scenarioId, t, scenarioBinId } = this.props;
    const userId = this.userId;

    const data = { files, filesMetadata, scenarioId, userId };
    storage.removeItem(`pairingStore`);
    importService
      .uploadFiles(data)
      .then(response => {
        const { importProcessId } = response;
        if (importProcessId) {
          const payload = {};
          payload['iScenarioId'] = scenarioId;
          payload['iDataImportType'] = filesMetadata[0].datatype;
          payload['iDataImportBinId'] = scenarioBinId;
          pushImportDataToAnalytics(payload);

          this.setState(
            {
              importDialogIsOpen: false,
              importProcessId,
              openLoader: true,
              loaderTitle: t('DATA.import.loaderInProgress'),
            },
            () => {
              this.fetchImportStatusTimer = window.setInterval(
                this.getImportStatus,
                IMPORT_TIMER_VALUE
              );
            }
          );
        }
      })
      .catch(e => {
        const error = e.response;
        let errorKey = 'genericUpload';

        switch (error.status) {
          case 400:
            if (
              validationErrorKeys.indexOf(
                error.data[0].errorDetails[0].messageKey
              ) !== -1
            ) {
              errorKey = 'validationError';
            } else if (
              error.data[0].errorDetails[0].messageKey ===
              'FILE_CHECKSUM_MISMATCH'
            ) {
              errorKey = 'corruptedData';
            } else {
              errorKey = 'genericUpload';
            }
            break;
          case 404:
            errorKey = 'transferFailed';
            break;
          default:
            errorKey = 'genericUpload';
            break;
        }

        this.setState({
          openLoader: false,
          message: t(`ERRORS.IMPORT.${errorKey}`),
          snackType: 'error',
        });
      });
  };

  updateFileVersion = scenarioBinsFiles => {
    const userId = this.userId;
    const { openItemId: scenarioId, t } = this.props;

    storage.removeItem(`pairingStore`);
    importService
      .updateFromBin(scenarioBinsFiles, scenarioId, userId)
      .then(response => {
        const { importProcessId } = response;
        if (importProcessId) {
          this.setState(
            {
              versionsDialogIsOpen: false,
              newDataDialogIsOpen: false,
              importProcessId,
              openLoader: true,
              connectBinImportProgress: false,
              loaderTitle: t('DATA.import.loaderInProgress'),
            },
            () => {
              this.fetchImportStatusTimer = window.setInterval(
                this.getImportStatus,
                IMPORT_TIMER_VALUE
              );
            }
          );
        }
      })
      .catch(e => {
        console.error(e);
        this.setState({
          openLoader: false,
        });
      });
  };

  createNewBin = name => {
    const userId = this.userId;
    const { t } = this.props;

    const data = {
      startDate: formatScenarioDate(this.startDate),
      endDate: formatScenarioDate(this.endDate),
      scenarioId: this.props.openItemId,
      createdById: userId,
      name,
    };

    binService
      .createBin(data, userId)
      .then(response => {
        const bin = response[0];
        const id = bin.id;
        if (!!bin) {
          const payload = {};
          payload['iScenarioId'] = data.scenarioId;
          payload['iDataImportBinId'] = id;
          payload['iDataImportBinName'] = bin.name;
          payload['iDataImportBinPeriod'] = `${bin.startDate} - ${bin.endDate}`;
          payload['iDataImportBinAction'] = `Create`;
          pushBinDataToAnalytics(payload);
        }
        this.showNotification({
          message: t('DATA.connectSuccess', {
            name,
          }),
          type: 'success',
        });

        this.props.updateBinId(id);
      })
      .catch(error => {
        console.error({ error });
      });
  };

  connectToBin = (name, id) => {
    const userId = this.userId;
    const { bins } = this.state;
    const { t, getHomeCards } = this.props;

    const data = {
      scenarioId: this.props.openItemId,
      binId: id,
    };

    this.closeImportDialog();

    binService
      .connectBin(data, userId)
      .then(response => {
        const { binId } = response[0];
        const bin = bins.filter(bin => bin.id === binId);
        if (!!binId && Array.isArray(bin)) {
          const payload = {};
          payload['iScenarioId'] = data.scenarioId;
          payload['iDataImportBinId'] = binId;
          payload['iDataImportBinName'] = bin[0].name;
          payload[
            'iDataImportBinPeriod'
          ] = `${bin[0].startDate} - ${bin[0].endDate}`;
          payload['iDataImportBinAction'] = `Reuse`;
          pushBinDataToAnalytics(payload);
        }

        this.showNotification({
          message: t('DATA.connectSuccess', {
            name,
          }),
          type: 'success',
        });

        this.props.updateBinId(binId);

        getHomeCards(false);

        this.setState({
          connectBinImportProgress: true,
        });
      })

      .catch(error => {
        console.error({ error });
      });
  };

  getConversionWarnings = importProcessId => {
    const userId = this.userId;
    const data = { userId, importProcessId };
    importService
      .getConversionSummary(data)
      .then(response => {
        this.setState({
          conversionDialogIsOpen: true,
          conversionWarnings: response,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  getConversionErrors = importProcessId => {
    const { t } = this.props;
    const userId = this.userId;
    const data = { userId, importProcessId };

    const newState = [];
    importService
      .getConversionError(data)
      .then(response => {
        response.datatypes.pairing.errors.forEach(e => {
          const getErrorDescription = () => {
            switch (e.messageKey) {
              case 'IMPORT_PAIRING_BAD_FILE_FORMAT':
                return t('ERRORS.IMPORT.conversion.badXML');
              default:
                return t('ERRORS.IMPORT.conversion.undefined');
            }
          };
          newState.push({
            messageKey: e.messageKey,
            errorDescription: getErrorDescription(),
          });
        });
        this.setState({
          conversionErrors: newState,
          importErrorDialogIsOpen: true,
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          isInternalError: true,
          importErrorDialogIsOpen: true,
        });
      });
  };

  toggleLoader = message => {
    const { openLoader } = this.state;

    this.setState({
      openLoader: !openLoader,
      loaderTitle: message,
    });
  };

  showNotification = args => {
    this.setState({
      message: args.message,
      snackType: args.type,
    });
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackType: '',
    });
  };

  translateSource = source => {
    const { t } = this.props;

    const sourceKeys = {
      '': null,
      blank: null,
      import: t('DATA.source.import'),
      template: t('DATA.source.template'),
    };

    return sourceKeys[source] || source;
  };

  generateFromLabel = c => {
    const { t } = this.props;

    return (
      <span className="from">
        {this.translateSource(c.source)}
        {c.currentFile &&
          `: ${t('DATA.card.version')} ${c.currentFile.version}`}
      </span>
    );
  };

  generateVersionsLink = c => {
    const { readOnly, t } = this.props;
    const { importProcessId } = this.state;

    const { name, type } = c;
    const version = c.currentFile ? c.currentFile.version : null;
    const latestVersion = c.availableVersions[c.availableVersions.length - 1];
    const otherVersions = [];

    const linkProps = {
      className: 'versions-container versions-read-only',
    };

    if (!readOnly && !importProcessId) {
      linkProps.onClick = event =>
        this.openVersionsDialog(event, name, type, version);
      linkProps.className = 'versions-container';
    }

    if (version && c.availableVersions.length > 1) {
      otherVersions.push(
        <span key={0} className="versions">
          {t('DATA.card.otherVersions')}
        </span>
      );
    }

    if (!version && c.availableVersions.length > 0) {
      otherVersions.push(
        <span key={0} className="versions">
          {t('DATA.card.versionsAvailable')}
        </span>
      );
    }

    if (version && latestVersion > version) {
      otherVersions.push(
        <span key={1} className="new-versions">
          {t('DATA.card.someNew')}
        </span>
      );
    }

    return <span {...linkProps}> {otherVersions} </span>;
  };

  preventDefault = event => {
    event.preventDefault();
  };

  render() {
    const {
      t,
      path,
      editMode,
      openItemId,
      openItemName,
      readOnly,
      cards,
      scenarioBinId,
      importConfig,
      importFileOptions,
      isFetching,
    } = this.props;
    const {
      emptyCells,
      formattedDates,
      importDialogIsOpen,
      versionsDialogIsOpen,
      newDataDialogIsOpen,
      conversionDialogIsOpen,
      availableVersions,
      selectedDataName,
      message,
      snackType,
      bins,
      newDataFiles,
      importProcessId,
      openLoader,
      loaderTitle,
      conversionWarnings,
      conversionErrors,
      stopDialogIsOpen,
      connectBinImportProgress,
      importErrorDialogIsOpen,
      isInternalError,
    } = this.state;
    const { formattedStart, formattedEnd, days, dialogDates } = formattedDates;
    const viewOnlyText = t('SCENARIOS.viewOnly.viewOnlyText');

    if (!isFetching) {
      return (
        <PerfectScrollbar option={perfectScrollConfig}>
          <MainContainer>
            <Header>
              <h2>{t('DATA.dataHome')}</h2>
              <AccessEnabler
                scopes={
                  editMode ? scopes.template.manage : scopes.scenario.manage
                }
                disableComponent
                render={props => (
                  <span>
                    {`${openItemName} ${
                      readOnly || props.disableComponent
                        ? `${viewOnlyText}`
                        : ''
                    }`}
                    {!editMode && (
                      <React.Fragment>
                        <br />
                        <p>
                          {t('DATA.dateDetails', {
                            0: formattedStart,
                            1: formattedEnd,
                            2: days,
                          })}
                        </p>
                      </React.Fragment>
                    )}
                  </span>
                )}
              />
              {!editMode && (
                <AccessEnabler
                  scopes={scopes.dataCardPage.importButton}
                  disableComponent
                  render={props => (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.openImportDialog}
                      disabled={
                        readOnly ||
                        importProcessId !== null ||
                        props.disableComponent
                      }
                      className="tm-scenario_data_home__import_data-btn"
                    >
                      {t('DATA.import.importButton')}
                    </Button>
                  )}
                />
              )}
            </Header>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
            <PerfectScrollbar option={perfectScrollConfig}>
              <CardsContainer
                innerRef={node => (this.grid = node)}
                importInProgress={importProcessId}
                editMode={editMode}
              >
                <div>
                  {cards.map((c, k) => {
                    const pathName = c.link ? `${path}${c.link}` : path;
                    const className = dataCardClassNames(editMode, c);
                    return (
                      <div key={k} className={className}>
                        <Link
                          to={{
                            pathname: pathName,
                            state: {
                              openItemId,
                              openItemName,
                              editMode,
                              readOnly,
                            },
                          }}
                          onClick={
                            importProcessId ? this.preventDefault : () => {}
                          }
                        >
                          {c.isCustomIcon ? (
                            <span
                              style={{
                                position: 'relative',
                                background: importProcessId
                                  ? '#d3d3d3'
                                  : c.bgIcon,
                              }}
                              className="icon"
                            >
                              <c.icon
                                width={'43px'}
                                height={'43px'}
                                viewBox={'0 0 43 43'}
                                fill={'#fff'}
                                style={c.iconStyles}
                              />
                            </span>
                          ) : (
                            <Icon
                              className="icon"
                              bg={importProcessId ? '#d3d3d3' : c.bgIcon}
                            >
                              {c.icon}
                            </Icon>
                          )}

                          <span className="name">{c.name}</span>
                          <div className="extra-info">
                            {!editMode && this.generateFromLabel(c)}
                            {!editMode &&
                              c.availableVersions &&
                              this.generateVersionsLink(c)}
                          </div>
                        </Link>
                        <div className="bot">
                          <div>
                            <span>{c.count || 0}</span>
                            {c.isCustomIcon ? (
                              <c.icon
                                fill={importProcessId ? '#dfdfdf' : '#0a75c2'}
                                viewBox={c.viewBox ? c.viewBox : '0 0 44 44'}
                                className="type-icon"
                              />
                            ) : (
                              <Icon
                                className="type-icon"
                                iconcolor={
                                  importProcessId ? '#dfdfdf' : '#0A75C2'
                                }
                              >
                                {c.icon}
                              </Icon>
                            )}
                          </div>
                          <div>
                            {c.midIcon !== null && (
                              <Icon
                                style={{ fontSize: '30px', margin: '0 auto' }}
                                iconcolor={
                                  importProcessId ? '#dfdfdf' : '#0A75C2'
                                }
                              >
                                {c.midIcon}
                              </Icon>
                            )}
                          </div>
                          <div>
                            {c.errorCount > 0 && (
                              <React.Fragment>
                                <span
                                  style={{
                                    color: importProcessId
                                      ? '#dfdfdf'
                                      : '#D0021B',
                                  }}
                                >
                                  {c.errorCount}
                                </span>
                                <Icon
                                  style={{ fontSize: '30px', margin: '0 auto' }}
                                  iconcolor={
                                    importProcessId ? '#dfdfdf' : '#D0021B'
                                  }
                                >
                                  error_outline
                                </Icon>
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {emptyCells.map((item, index) => (
                    <div
                      style={{
                        width: `${cardWidth - 30}px`,
                        display: 'inline-block',
                      }}
                      key={index}
                    />
                  ))}
                </div>
              </CardsContainer>
            </PerfectScrollbar>
            {!editMode && (
              <React.Fragment>
                <ImportDialog
                  open={importDialogIsOpen}
                  handleImport={this.handleImportForm}
                  closeDialog={this.closeImportDialog}
                  formId={'importForm'}
                  scenarioDates={dialogDates}
                  showNotification={this.showNotification}
                  bins={bins}
                  scenarioBinId={scenarioBinId}
                  t={t}
                  createNewBin={this.createNewBin}
                  connectToBin={this.connectToBin}
                  importConfig={importConfig}
                  importFileOptions={importFileOptions}
                  toggleLoader={this.toggleLoader}
                />
                <VersionsDialog
                  open={versionsDialogIsOpen}
                  closeDialog={this.closeVersionsDialog}
                  formId={'versionsForm'}
                  scenarioBinId={scenarioBinId}
                  t={t}
                  handleOk={this.updateFileVersion}
                  dataName={selectedDataName}
                  versions={availableVersions}
                />
                <NewDataDialog
                  open={newDataDialogIsOpen}
                  isConnectedToBin={connectBinImportProgress}
                  closeDialog={this.closeNewDataDialog}
                  formId={'newDataForm'}
                  scenarioBinId={scenarioBinId}
                  t={t}
                  handleOk={this.updateFileVersion}
                  dataName={selectedDataName}
                  dataFiles={newDataFiles}
                />
                <DataConversionDialog
                  open={conversionDialogIsOpen}
                  closeDialog={this.closeConversionDialog}
                  formId={'DataConversionForm'}
                  t={t}
                  handleOk={() => {
                    this.openStopDialog();
                  }}
                  conversionWarnings={conversionWarnings}
                />
                <StopDialog
                  open={stopDialogIsOpen}
                  handleClose={this.closeStopDialog}
                  texts={{
                    title: t('DATA.import.stopDialogTitle'),
                    content: t('DATA.import.stopDialogText'),
                    okButton: t('DATA.import.stopDialogTitle'),
                  }}
                  formId={'DataConversionForm'}
                  t={t}
                  handleOk={() => {
                    this.stopImport();
                  }}
                />
                <ImportErrorDialog
                  open={importErrorDialogIsOpen}
                  closeDialog={this.closeImportErrorDialog}
                  formId={'ImportErrorForm'}
                  t={t}
                  closeOnly
                  conversionErrors={conversionErrors}
                  isInternalError={isInternalError}
                />
              </React.Fragment>
            )}
            <ModalLoader open={openLoader} title={loaderTitle} color="white" />
            <Notification
              message={message}
              clear={this.onClearSnackBar}
              type={snackType}
              autoHideDuration={snackType === 'error' ? 360000 : 5000}
            />
          </MainContainer>
        </PerfectScrollbar>
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  return { userData: state.user.userData };
};

Home.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  path: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  scenarioBinId: PropTypes.number,
  updateBinId: PropTypes.func.isRequired,
  importConfig: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  importFileOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  importProcess: PropTypes.shape(),
  isFetching: PropTypes.bool.isRequired,
  setIsFetching: PropTypes.func.isRequired,
  getHomeCards: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

Home.defaultProps = {
  editMode: false,
  readOnly: false,
  scenarioBinId: null,
  importProcess: null,
  userData: {},
};

const HomeComponent = connect(mapStateToProps)(Home);

export default HomeComponent;
