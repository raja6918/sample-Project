import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { pull } from 'lodash';
import history from '../../history';
import { previewChannel } from '../../utils/broadCast';
import sessionStorage, { localStorage } from '../../utils/storage';
import { savePreview } from '../../services/Solver';
import scenarioService from '../../services/Scenarios';
import PairingsWithErrorHandler from './Pairings';
import ModalLoader from '../../components/ModalLoader';
import Notification from '../../components/Notification';
import withErrorHandler from '../../components/ErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import { READ_ONLY } from '../../constants';
import { currentScenario } from '../../utils/common';

export class PairingsPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewDetails: null,
      openLoader: false,
      titleLoader: '',
      snackMessage: null,
      snackType: '',
    };
  }

  clearLocalStorage = () => {
    // Remove openItem from localstorage
    const previewId = this.props.match.params.previewID;
    const openPreviews = localStorage.getItem('openPreviews');

    const filteredPreviews = openPreviews.filter(preview =>
      preview ? preview.previewId !== parseInt(previewId, 10) : false
    );

    localStorage.setItem('openPreviews', filteredPreviews);
  };

  setupBeforeUnloadListener = () => {
    const { previewID } = this.props.match.params;

    const deletedPreviews = localStorage.getItem('deletedPreviews') || [];
    localStorage.setItem('deletedPreviews', [...deletedPreviews, previewID]);

    previewChannel.postMessage({
      title: 'DELETE_ID',
      data: previewID,
    });

    this.clearLocalStorage();
  };

  componentDidMount() {
    const previewId = this.props.match.params.previewID;

    // Register the event listener
    window.addEventListener('beforeunload', this.setupBeforeUnloadListener);

    // grab openPreview from session storage
    const openPreview = sessionStorage.getItem('openPreview');

    const openPreviews = localStorage.getItem('openPreviews') || [];
    let previewDetails = openPreviews.find(preview =>
      preview ? preview.previewId === parseInt(previewId, 10) : false
    );

    // if user refresh the page and local storage content is lost then use session storage content
    if (!previewDetails) {
      previewDetails = openPreview;
      // and then set localstorage
      localStorage.setItem('openPreviews', openPreviews.concat(openPreview));
      // Remove id from deletedPreviews
      const deletedPreviews = localStorage.getItem('deletedPreviews') || [];
      pull(deletedPreviews, previewId);
      localStorage.setItem('deletedPreviews', deletedPreviews);
    }

    this.setState({ previewDetails });

    // check whether preview is readonly
    const openScenario = sessionStorage.getItem('openScenario');
    const readOnly = openScenario.status === READ_ONLY;

    if (readOnly) {
      this.disableSave();
    }

    // set history state
    history.push({
      state: { ...previewDetails, readOnly },
    });

    // If session storage is not set then set it - happen when tab is open first time
    if (!openPreview) {
      sessionStorage.setItem('openPreview', {
        pathname: location.pathname,
        ...previewDetails,
      });
    }
  }

  handleClose = async () => {
    const { userData } = this.props;
    const userId = userData ? userData.id : '';

    // Unregister the event listener
    window.removeEventListener('beforeunload', this.setupBeforeUnloadListener);

    try {
      // call delete scenario API
      await scenarioService.deletePreview(
        parseInt(this.props.match.params.previewID, 10),
        userId,
        true
      );

      this.clearLocalStorage();
      window.close();
    } catch (error) {
      // Re-Register the event listener
      window.addEventListener('beforeunload', this.setupBeforeUnloadListener);
      this.props.reportError({ error });
    }
  };

  handleSave = async () => {
    const crewGroupName = this.state.previewDetails.crewGroups
      ? this.state.previewDetails.crewGroups[0].name
      : '';
    this.openLoader(crewGroupName);
    this.onClearSnackBar();

    const scenario = currentScenario();
    const scenarioId = scenario ? scenario.id : null;

    try {
      // Call save preview API
      const data = await savePreview(
        parseInt(this.props.match.params.previewID, 10),
        scenarioId
      );
      // If save is success without any warning
      if (data.status === 'SUCCESS') {
        this.setState({
          snackMessage: this.props.t('SUCCESS.PAIRING_PREVIEW.SAVE', {
            solverRequestName: this.state.previewDetails.solverName,
            crewGroupName,
          }),
          snackType: 'success',
        });
      }

      // If save is success with warning
      if (data.status === 'SUCCESS_WARNING') {
        this.setState({
          snackMessage: this.props.t('SUCCESS.PAIRING_PREVIEW.SAVE_WARNING', {
            solverRequestName: this.state.previewDetails.solverName,
            crewGroupName,
          }),
          snackType: 'info',
        });
      }

      // Broadcast message to all opened tabs to remove pairingStore from session storage of its parent scenario
      const parentScenario = currentScenario();
      if (parentScenario) {
        previewChannel.postMessage({
          title: 'PREVIEW_SAVED',
          scenarioId: parentScenario.id,
        });
      }

      this.disableSave();
    } catch (error) {
      // If save completely failed with 400 status
      this.setState({
        snackMessage: this.props.t('ERRORS.PAIRING_PREVIEW_SAVE.message'),
        snackType: 'error',
      });
    } finally {
      this.closeLoader();
    }
  };

  disableSave = () => {
    sessionStorage.setItem('disableSave', { status: true });
  };

  openLoader = crewGroupName => {
    this.setState({
      openLoader: true,
      titleLoader: this.props.t('PAIRINGS.solverResults.loader', {
        crewGroupName,
      }),
    });
  };

  closeLoader = () => {
    this.setState({ openLoader: false });
  };

  onClearSnackBar = () => {
    this.setState({
      snackMessage: null,
      snackBarType: '',
    });
  };

  render() {
    return (
      this.state.previewDetails && (
        <Fragment>
          <PairingsWithErrorHandler
            previewMode={true}
            handleClose={this.handleClose}
            handleSave={this.handleSave}
            {...this.props}
          />
          <ModalLoader
            open={this.state.openLoader}
            title={this.state.titleLoader}
            color="white"
          />
          <Notification
            message={this.state.snackMessage}
            clear={this.onClearSnackBar}
            type={this.state.snackType}
            displayCloseButton={this.state.snackType === 'info' ? true : false}
            autoHideDuration={this.state.snackType === 'info' ? 3600000 : 5000}
          />
        </Fragment>
      )
    );
  }
}

PairingsPreview.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired,
  reportError: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return { userData: state.user.userData };
};
const PairingsPreviewComponent = connect(mapStateToProps)(PairingsPreview);

export default withErrorHandler(PairingsPreviewComponent);
