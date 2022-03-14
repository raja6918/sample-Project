import React, { Component } from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import history from '../../history';
import GenericTextField from '../../components/GenericTextField';
import ErrorDialog from '../../components/Dialog/ErrorDialog';
import ModalLoader from '../../components/ModalLoader';
import storage, { localStorage } from '../../utils/storage';
import {
  openInNewTab,
  getBrowserSessionId,
  getFilteredCrewBasesandRules,
} from './utils';
import { getPreviewId } from '../../services/Solver/index';
import { connect } from 'react-redux';
import AccessEnabler from '../../components/AccessEnabler';

const ButtonItem = styled(IconButton)`
  z-index: 1;
  overflow: visible;
  height: 48px;
  width: 48px;
  padding: 0px;
  & > span {
    display: block;
    line-height: 0px;
  }
`;

const BoldedGenericTextField = styled.div`
  input {
    font-weight: 400;
    font-size: 20px;
  }
`;

const ActionButtonContainer = styled(Grid)`
  margin-top: 5px;
  & div {
    z-index: 10;
    margin: 0 7px;
  }
  & div:first-child {
    margin-left: -4px;
  }
  & div:last-child {
    margin-right: -10px;
  }
`;
const IconLabel = styled.span`
  font-family: 'Roboto-Regular', sans-serif;
  font-size: 12px;
`;
const BarContainer = styled.div`
  padding: 25px 40px 0 40px;
  & h2 {
    margin: 0 0 20px 0;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: normal;
  }
`;
const ActionButton = ({
  icon,
  label,
  onClick,
  readOnly,
  active,
  isFetching,
}) => {
  const disabled = !active || readOnly || isFetching;
  // if (activeBtns) {
  //   disabled = !activeBtns.includes(status) || readOnly;
  // }

  const color = disabled ? 'disabled' : 'primary';

  return (
    <Grid item xm={2}>
      <ButtonItem onClick={onClick} disabled={disabled}>
        <Icon color={color}>{icon}</Icon>
        <IconLabel>{label}</IconLabel>
      </ButtonItem>
    </Grid>
  );
};

export class SolverActionBar extends Component {
  state = {
    name: '',
    isFetching: false,
    maxPreviewDialogOpen: false,
    active: false,
    popupBlockDialogOpen: false,
    showErrors: this.props.showErrors,
  };

  onTriggerAction = action => {
    this.props.onUpdateState(action);
  };

  onPreview = async () => {
    const { id, scenarioSnapshot } = this.props.activeRequest;
    const { scenarioId, scenarioName } = this.props;
    const openItemId = scenarioId;
    const openItemName = scenarioName;

    // get or create browser session id
    const browserSessionId = await getBrowserSessionId();

    const openPreviews = localStorage.getItem('openPreviews') || [];

    // check max preview limit
    const childPreviews = openPreviews.filter(preview =>
      preview ? preview.browserSessionId === browserSessionId : false
    );
    if (childPreviews.length > 4) {
      this.setState({ maxPreviewDialogOpen: true });
      return;
    }

    // setup Crew Groups and rules
    const { crewGroupName, rulesetName } = this.props.activeRequest;
    let crewGroupId = this.props.crewGroups
      ? this.props.crewGroups.find(
          crewGroup => crewGroup.name === crewGroupName
        )
      : '';
    let rulesetId = this.props.rules
      ? this.props.rules.find(rule => rule.name === rulesetName)
      : '';
    crewGroupId = crewGroupId ? crewGroupId.id : '';
    rulesetId = rulesetId ? rulesetId.id : '';

    const [crewGroups, rules] = getFilteredCrewBasesandRules(
      crewGroupId,
      this.props.crewGroups,
      rulesetId,
      this.props.rules
    );
    let filterPayload = null;
    let timelineLastFilter = null;
    let pairingStore = null;

    try {
      this.setState({ isFetching: true });
      const requestBody = {
        scenarioId: openItemId,
        solverRequestId: id,
        snapShot: scenarioSnapshot,
        crewGroupId: crewGroupId,
        rulesetId: rulesetId,
      };
      const data = await getPreviewId(requestBody);
      if (crewGroupId === '' || !crewGroups.length) {
        crewGroupId = crewGroupName;
        crewGroups.push({ id: crewGroupName, name: crewGroupName });
      }
      if (rulesetId === '' || !rules.length) {
        rulesetId = crewGroupName;
        rules.push({ id: rulesetName, name: rulesetName });
      }

      openPreviews.push({
        previewId: data.previewScenarioId,
        openItemId: data.previewScenarioId,
        openItemName,
        solverId: id,
        browserSessionId,
        crewGroup: crewGroupId,
        crewGroups,
        rule: rulesetId,
        rules,
        solverName: this.props.activeRequest.name,
      });
      localStorage.setItem('openPreviews', openPreviews);

      filterPayload = storage.getItem(`timelineFilter1`);
      storage.removeItem(`timelineFilter1`);
      timelineLastFilter = storage.getItem('timelineLastFilter1');
      storage.removeItem(`timelineLastFilter1`);
      pairingStore = storage.getItem('pairingStore');
      storage.removeItem(`pairingStore`);

      const isOpen = openInNewTab(
        location.protocol +
          '//' +
          location.host +
          '/pairings-preview/' +
          data.previewScenarioId,
        data.previewScenarioId
      );

      if (!isOpen) {
        this.setState({ popupBlockDialogOpen: true });
      }
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    } finally {
      this.setState({ isFetching: false });
      if (filterPayload) {
        storage.setItem(`timelineFilter1`, filterPayload);
      }
      if (timelineLastFilter) {
        storage.setItem(`timelineLastFilter1`, timelineLastFilter);
      }
      if (pairingStore) {
        storage.setItem(`pairingStore`, pairingStore);
      }
    }
  };

  closeMaxPreviewDialog = () => {
    this.setState({ maxPreviewDialogOpen: false });
  };

  closePopupBlockDialog = () => {
    this.setState({ popupBlockDialogOpen: false });
  };

  componentWillMount() {
    this.setState({ name: this.props.activeRequest.name });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.activeRequest.name,
    });
  }

  shouldComponentUpdate() {
    return !this.state.active;
  }

  handleOnBlur = (id, value) => {
    this.setState({ active: false, name: value }, () => {
      if (id && value) {
        this.props.updateSolverName(id, value);
      }
    });
  };
  checkActive = active => {
    this.setState({ active });
  };

  render() {
    const {
      t,
      activeRequest,
      onEndorse,
      readOnly,
      showErrors,
      solverScopes,
    } = this.props;
    const {
      isFetching,
      maxPreviewDialogOpen,
      popupBlockDialogOpen,
      name,
    } = this.state;
    const label = 'SOLVER.actionBar.actionButtons';
    const errorMsg = 'ERRORS.SOLVER';
    const endorseIcon = activeRequest.isEndorsed
      ? 'favorite'
      : 'favorite_border';

    const activePlay =
      activeRequest.status.activeBtns.includes('play') && !showErrors;
    const activeStop = activeRequest.status.activeBtns.includes('stop');
    const activePreview = activeRequest.status.activeBtns.includes('preview');
    const activeEndorse = activeRequest.status.activeBtns.includes('endorse');
    const activeMore = activeRequest.status.activeBtns.includes('more');

    const isDisabled =
      [
        'Done-success',
        'Creating',
        'Waiting',
        'Sending',
        'Running',
        'Fetching',
        'Stopping',
        'Launching',
      ].includes(activeRequest.status.status) || readOnly;
    return (
      <BarContainer>
        <Grid container spacing={5}>
          <Grid item xs={5} xm={5}>
            <AccessEnabler
              scopes={solverScopes.solverManage}
              disableComponent
              render={props => (
                <BoldedGenericTextField>
                  <GenericTextField
                    id="name"
                    value={name}
                    readOnly={isDisabled || props.disableComponent}
                    onBlur={this.handleOnBlur}
                    checkError={true}
                    t={t}
                    errorMsg={`${errorMsg}.name`}
                    isActive={this.checkActive}
                  />
                </BoldedGenericTextField>
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={6} xm={6}>
            <ActionButtonContainer container spacing={0}>
              <AccessEnabler
                scopes={solverScopes.solverManage}
                disableComponent
                render={props => (
                  <ActionButton
                    icon="play_arrow"
                    label={t(`${label}.launch`)}
                    onClick={() => this.onTriggerAction('play')}
                    active={activePlay}
                    readOnly={readOnly || props.disableComponent}
                  />
                )}
              />
              <AccessEnabler
                scopes={solverScopes.solverManage}
                disableComponent
                render={props => (
                  <ActionButton
                    icon="stop"
                    label={t(`${label}.stop`)}
                    onClick={() => this.onTriggerAction('stop')}
                    active={activeStop}
                    readOnly={readOnly || props.disableComponent}
                  />
                )}
              />
              <AccessEnabler
                scopes={solverScopes.solverEvaluate}
                disableComponent
                render={props => (
                  <ActionButton
                    icon="visibility"
                    label={t(`${label}.preview`)}
                    onClick={this.onPreview}
                    active={activePreview}
                    isFetching={isFetching}
                    readOnly={props.disableComponent}
                  />
                )}
              />
            </ActionButtonContainer>
          </Grid>
          <Grid item xs={6} xm={6}>
            <ActionButtonContainer container spacing={0} justify="flex-end">
              <AccessEnabler
                scopes={solverScopes.solverEvaluateOrManage}
                disableComponent
                render={props => (
                  <ActionButton
                    icon={endorseIcon}
                    label={t(`${label}.endorse`)}
                    onClick={onEndorse}
                    active={activeEndorse}
                    readOnly={readOnly || props.disableComponent}
                  />
                )}
              />
              {/* <ActionButton
                icon="more_vert"
                label={t(`${label}.more`)}
                readOnly={readOnly}
                active={activeMore}
              /> */}
            </ActionButtonContainer>
          </Grid>
        </Grid>
        <ErrorDialog
          open={maxPreviewDialogOpen}
          handleOk={this.closeMaxPreviewDialog}
          onExited={this.closeMaxPreviewDialog}
          okText={t('GLOBAL.form.close')}
          title={t('ERRORS.PAIRING_PREVIEW_ERROR.title')}
          bodyText={t('ERRORS.PAIRING_PREVIEW_ERROR.body')}
        />
        <ErrorDialog
          open={popupBlockDialogOpen}
          handleOk={this.closePopupBlockDialog}
          onExited={this.closePopupBlockDialog}
          okText={t('GLOBAL.form.close')}
          title={t('ERRORS.PAIRING_PREVIEW_BLOCKED.title')}
          bodyText={t('ERRORS.PAIRING_PREVIEW_BLOCKED.body')}
        />
        <ModalLoader
          open={isFetching}
          title={t('DATA.solver.preview.loader')}
          color="white"
        />
      </BarContainer>
    );
  }
}

const mapStatetoProps = state => {
  const { newJobStatus: solver } = state;
  return {
    showErrors: solver.showErrors,
  };
};

ActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  status: PropTypes.string,
  activeBtns: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  readOnly: PropTypes.bool,
  isFetching: PropTypes.bool,
};
ActionButton.defaultProps = {
  label: '',
  status: null,
  activeBtns: [],
  onClick: () => {},
  readOnly: false,
  isFetching: false,
};

SolverActionBar.propTypes = {
  activeRequest: PropTypes.shape({
    crewGroupName: PropTypes.string,
    crewGroupId: PropTypes.number.isRequired,
    rulesetId: PropTypes.number.isRequired,
    elapsedTime: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEndorsed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.shape({
      activeBtns: PropTypes.arrayOf(PropTypes.string).isRequired,
      block: PropTypes.bool.isRequired,
      dateCurrent: PropTypes.bool.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      routes: PropTypes.arrayOf(PropTypes.number).isRequired,
      showTimer: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      statusId: PropTypes.number.isRequired,
      textBar: PropTypes.string.isRequired,
      timerType: PropTypes.string.isRequired,
    }).isRequired,
    lastModified: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  onEndorse: PropTypes.func.isRequired,
  onUpdateState: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  reportError: PropTypes.func.isRequired,
  crewGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      ruleset: PropTypes.number.isRequired,
    })
  ).isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  showErrors: PropTypes.bool.isRequired,
  solverScopes: PropTypes.shape([]).isRequired,
};

export default connect(mapStatetoProps)(SolverActionBar);
