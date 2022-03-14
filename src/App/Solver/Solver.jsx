import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Redirect } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import moment from 'moment';

import Summary from './Summary';
import SolverActionBarWithConnect from './SolverActionBar';
import SolverList from './List/SolverList';
import StatisticsTable from './Statistics/';
import Compare from './Compare/';
import SolverIcon from './SolverIcon/SolverIcon';
import SolverForm from './SolverForm';
import Notification from '../../components/Notification';
import { getStatusObject } from './List/SolverStatus';
import StopDialog from '../../components/Dialog/StopDialog';
import ModalLoader from '../../components/ModalLoader';

import AddHeader from '../../components/Headers/AddHeader';
import Loading from '../../components/Loading';

import history from '../../history';
import storage from '../../utils/storage';
import {
  pushSolverDataToAnalytics,
  pushSolverEventAnalytics,
} from '../../utils/analytics';
import { sortRequests } from './List/helpers';

import * as solverService from '../../services/Solver';
import withErrorHandler from '../../components/ErrorHandler/withErrorHandler';
import { SOLVER_RUNNING_STATUS } from './Constants';
import { perfectScrollConfig, currentScenario } from '../../utils/common';
import { connect } from 'react-redux';
import { triggerShowErrors } from '../../actions/solver';
import solverScopes from '../../constants/scopes';
import AccessEnabler from '../../components/AccessEnabler';
import { READ_ONLY } from '../../constants';

const Header = styled.div`
  & h2 {
    width: 344px;
  }
  & > div div {
    position: absolute;
    width: auto;
    z-index: 1;
    left: 241px;
    top: 43px;
  }
  & > div p {
    width: calc(100vw - 344px);
  }
`;

const Container = styled.div`
  position: relative;
  width: 100vw;
  overflow: hidden;
  height: calc(100vh - 125px);
  border-top: 1px solid #979797;
`;
const ListContainer = styled.div`
  display: inline-block;
  height: 100%;
  overflow: hidden;
  vertical-align: top;
  width: 344px;
`;
const TabsContainer = styled.div`
  /* overflow-y: scroll; */
  display: inline-block;
  height: 100%;
  width: calc(100vw - 344px);
  & header {
    box-shadow: none;
    background-color: #fff;
    border-bottom: 1px solid #979797;
    border-left: 1px solid #979797;
  }
  & header button[disabled] {
    opacity: 0.4;
  }
  & header button {
    opacity: 1;
    width: 180px;
  }
  & header button span {
    font-size: 14px;
    font-weight: 500;
  }
  & header button[aria-selected='true'] {
    color: #e54c42;
    z-index: 2;
  }
  & header button[aria-selected='false'] {
    color: rgba(0, 0, 0, 0.87);
    z-index: 2;
  }
  @media (max-width: 768px) {
    & header button {
      width: 33.333333%;
    }
  }
`;
const TabContent = styled.div`
  padding: 20px 40px 45px 40px;
  height: calc(100% - 48px);
`;
const SolverStatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  background-color: #eee;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 4px 0 rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);
  & p {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.87);
    line-height: 18px;
    margin: 0;
  }
  & span {
    font-size: 26px;
  }
`;
const NoActiveRequest = styled.div`
  text-align: center;
  position: relative;
  top: 50%;
  margin-top: -51px;
  & p {
    font-size: 1rem;
  }
`;

const TabContainer = props => {
  return <TabContent style={props.style}>{props.children}</TabContent>;
};
TabContainer.propTypes = {
  style: PropTypes.shape({}),
  children: PropTypes.node.isRequired,
};
TabContainer.defaultProps = {
  style: {},
};

class Solver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: -1,
      solverRequests: [],
      solverTasks: [],
      crewGroups: [],
      rules: [],
      recipes: [],
      scopes: [],
      activeRequest: null,
      isFetching: true,
      updateEndorsed: false,
      solversToCompare: [],
      compareTab: false,
      isFormOpen: false,
      message: null,
      snackType: '',
      totalDataSize: 0,
      jobs: [],
      isStopDialogOpen: false,
      status: null,
      isStatDataFetching: false,
      isRecipeCallActive: false,
      isLaunched: false,
    };

    this.intervalCall = '';
    const openScenario = storage.getItem('openScenario');
    if (props.readOnly || (openScenario && openScenario.status === READ_ONLY))
      props.setReadOnly(true);
  }
  scrollRef = React.createRef();
  timer = undefined;
  userId = null;
  scenarioId = null;
  scenarioName = null;
  isAPICallActive = false;

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData = () => {
    const scenario = storage.getItem('openScenario');
    let scenarioId;
    if (scenario) scenarioId = scenario.id;
    const { userData } = this.props;

    const openedSolverId =
      history.location.state !== undefined &&
      history.location.state.openSolverId
        ? history.location.state.openSolverId
        : null;

    const userId = userData.id;

    this.userId = userId;
    this.scenarioId = scenarioId;

    const requestList = [
      solverService.getSolverRequests(scenarioId, userId),
      solverService.getSolverTasks(scenarioId, userId),
      solverService.getSolverRecipes(scenarioId, userId),
      solverService.getRuleSets(scenarioId, userId),
      solverService.getCrewGroups(scenarioId, userId),
      solverService.getScopes(scenarioId, userId),
    ];
    if (openedSolverId) {
      requestList.push(
        solverService.getSolverRequestById(scenarioId, userId, openedSolverId)
      );
    }

    Promise.all(requestList)
      .then(
        ([
          solverRequests,
          solverTasks,
          recipes,
          rules,
          crewGroups,
          scopes,
          activeRequest,
        ]) => {
          let newData = solverRequests.map(request => {
            if (request.status === 'Done-success') {
              const { id, jobId, elapsedTime, crewGroupName } = request;
              const payLoad = {
                iSolverRequestId: id || null,
                iSolverRequestType: 'Complete',
                iSolverJobId: jobId || null,
                iCrewGroup: crewGroupName || null,
                iSolverRequestElapsedTime: moment
                  .duration(elapsedTime)
                  .asMilliseconds(),
              };
              pushSolverEventAnalytics(payLoad);
            }
            return {
              ...request,
              status: getStatusObject(request.status),
            };
          });
          if (openedSolverId) {
            newData = this.getRearrangedSolvers(newData, openedSolverId);
          } else {
            newData = sortRequests(newData);
          }
          this.setState({
            solverRequests: newData,
            solverTasks,
            recipes,
            rules,
            crewGroups,
            scopes,
            isFetching: false,
            activeRequest: activeRequest
              ? {
                  ...activeRequest,
                  status: getStatusObject(activeRequest.status),
                }
              : null,
            selectedTab: activeRequest ? 0 : -1,
          });
        }
      )
      .catch(err => {
        this.setState({ isFetching: false });
        this.props.reportError({
          errorType: 'Snackbar',
          isHtml: true,
          error: err,
        });
      });

    if (history.location.state) {
      const readOnlyFromHistory = history.location.state.readOnly;
      const readOnlyFromProps = this.props.readOnly;
      if (readOnlyFromHistory !== readOnlyFromProps) {
        this.props.setReadOnly(readOnlyFromHistory);
      }
      //clear after selection
      if (history.location.state.openSolverId) {
        this.cleanActiveSolverHistory();
      }
    }
  };

  setCurrentActiveRuleset = (solverId, solverRequests) => {
    solverService
      .getSolverRequestById(this.scenarioId, this.userId, solverId)
      .then(activeRequest => {
        this.setState(
          {
            activeRequest: {
              ...activeRequest,
              status: getStatusObject(activeRequest.status),
            },
            selectedTab: 0,
            solverRequests,
          },
          () => {
            if (history.location.state.openSolverId) {
              this.cleanActiveSolverHistory();
            }
          }
        );
      })
      .catch(() => {});
  };

  cleanActiveSolverHistory = () => {
    const st = { ...history.location.state };
    delete st.openSolverId;
    const path = {
      state: st,
    };
    history.push(path);
  };

  getRearrangedSolvers = (srRequests, openSolverId) => {
    const solverRequests = Array.from(srRequests);
    const index = solverRequests.findIndex(
      request => request.id === openSolverId
    );
    const poppedData = solverRequests.splice(index, 1);
    const newData = [poppedData[0], ...sortRequests(solverRequests)];
    return newData;
  };

  componentWillReceiveProps(nextProps) {
    const { activeRequest } = this.state;
    const openSolverId =
      history.location.state !== undefined &&
      history.location.state.openSolverId
        ? history.location.state.openSolverId
        : null;
    if (history.location.state && openSolverId) {
      if (history.location.state.openItemId === this.scenarioId) {
        this.setCurrentActiveRuleset(
          history.location.state.openSolverId,
          this.getRearrangedSolvers(this.state.solverRequests, openSolverId)
        );
      } else {
        this.fetchInitialData();
      }
    }
    if (
      activeRequest &&
      activeRequest.status &&
      activeRequest.status.status === 'Launching'
    ) {
      this.getJobStatus(activeRequest);
    } else if (
      nextProps.newJobStatus &&
      nextProps.newJobStatus.latestJob.length > 0
    ) {
      this.getJobStatus(nextProps.newJobStatus.latestJob);
    }
  }

  /**
   * @function -  Used to get status of jobs
   * @param {Array} jobsArray - ids of jobs in creating ,running, waiting ,sending or fetching status.
   */
  getJobStatus = async (jobsArray = []) => {
    const jobStatus = jobsArray;
    try {
      const {
        solverRequests,
        activeRequest,
        newSolverRequests,
        modifiedData,
      } = {
        ...this.state,
        newSolverRequests: Array.from(this.state.solverRequests),
        modifiedData: {},
      };

      let { newActiveRequest } = {
        newActiveRequest: activeRequest ? { ...activeRequest } : activeRequest,
      };

      jobStatus.forEach(job => {
        const key = solverRequests.findIndex(request => {
          if (
            request.id != null &&
            parseInt(this.scenarioId, 10) === parseInt(job.scenarioId, 10)
          )
            return request.id.toString() === job.solverId.toString();
          return false;
        });
        if (key !== -1) {
          newSolverRequests[key] = {
            ...newSolverRequests[key],
            ...job,
            status: getStatusObject(
              job.status,
              solverRequests[key].status.status
            ),
          };
          modifiedData['solverRequests'] = newSolverRequests;
          if (activeRequest && activeRequest.id) {
            if (activeRequest.id.toString() === job.solverId.toString()) {
              newActiveRequest = {
                ...activeRequest,
                ...job,
                status: getStatusObject(
                  job.status,
                  activeRequest.status.status
                ),
              };
              modifiedData['activeRequest'] = newActiveRequest;
            }
          }
        }
      });
      modifiedData['status'] = null; // to remove launching
      this.setState(modifiedData);
    } catch (error) {
      console.error(`Caught Non Array Data from Server`, error);
      this.props.reportError({
        errorType: 'Snackbar',
        isHtml: true,
        error: error,
      });
    }
  };

  toggleForm = () => {
    const { isFormOpen } = this.state;
    const dataToUpdate = { isFormOpen: !isFormOpen };

    this.setState(dataToUpdate);
  };

  onEndorse = () => {
    const { activeRequest } = this.state;
    const { readOnly } = this.props;
    const requestBody = {
      id: activeRequest.id,
      isEndorsed: !activeRequest.isEndorsed,
      jobId: activeRequest.jobId,
    };

    solverService
      .setFavourite(this.scenarioId, this.userId, requestBody)
      .then(response => {
        //values of activerequest or solver request might change between api calls
        if (response['id'] === '' || readOnly) return;
        const { solverRequests, activeRequest } = this.state;
        const solverRequestUpdated = [...solverRequests];
        const activeRequestUpdated = { ...activeRequest };
        solverRequestUpdated.forEach(solver => {
          //update solverrequest
          if (solver['id'] === response['id'])
            solver.isEndorsed = response['isEndorsed'];
          if (activeRequestUpdated) {
            if (response['id'] === activeRequestUpdated['id']) {
              activeRequestUpdated.isEndorsed = response['isEndorsed'];
            }
          }
        });
        this.setState({
          solverRequests: solverRequestUpdated,
          activeRequest: activeRequestUpdated,
          updateEndorsed: true,
        });
      })
      .catch(() => {
        const key = !activeRequest.isEndorsed ? 'SET' : 'UNSET';
        this.setState({
          snackType: 'error',
          message: this.props.t(`ERRORS.FAVORITE_${key}.message`, {
            solverRequestName: activeRequest.name,
          }),
        });
      });
  };

  /**
   * @function - Used to close the StopImport dialog box.
   */
  closeStopDialog = () => {
    this.setState({ isStopDialogOpen: false });
  };

  /**
   * @function - Used to perform different operations on a solver request like, launch, stop, or preview.
   * @param {String} action - Action performed by the user, which can include launch, stop, or preview.
   */
  onUpdateState = action => {
    const relaunchStatuses = ['stoppedNoResults', 'Done-failed'];
    const jobRequest = { ...this.state.activeRequest };
    const { isStopDialogOpen, solverTasks } = this.state;
    const { t } = this.props;

    const solverTask = solverTasks.find(
      solverTask => solverTask.name === jobRequest.solverTaskName
    );
    const requestBodyLaunch = {
      objects: [
        {
          name: jobRequest.name,
          packageId: solverTask ? solverTask.id : '',
          solverRequestId: jobRequest.id,
          scenarioId: this.scenarioId,
        },
      ],
    };

    const requestBodyStop = [jobRequest.jobId];

    const self = this;

    /**
     * @function - Used to update solver requests based on launch/stop response.
     * @param {Object} response - The response object recieved from the API call.
     * @param {String} searchKey - Search parameter.
     */
    function getUpdatedSolverDetails(response, searchKey) {
      const { activeRequest, solverRequests } = self.state;
      const updatedSolverRequests = Array.from(solverRequests);
      const newJobs = [];
      let updatedActiveRequest;

      response.forEach(jobItem => {
        const key = updatedSolverRequests.findIndex(solverRequest => {
          if (solverRequest[searchKey] !== null)
            return (
              solverRequest[searchKey].toString() ===
              jobRequest[searchKey].toString()
            );
          return false;
        });
        if (key !== -1) {
          updatedSolverRequests[key] = {
            ...updatedSolverRequests[key],
            ...jobItem,
            status: getStatusObject(
              jobItem.status,
              updatedSolverRequests[key].status.status
            ),
          };
          updatedActiveRequest =
            activeRequest[searchKey] === updatedSolverRequests[key][searchKey]
              ? updatedSolverRequests[key]
              : activeRequest;
          if (SOLVER_RUNNING_STATUS.includes(jobItem.status)) {
            newJobs.push(jobItem.jobId.toString());
          }
        }
      });
      return {
        updatedSolverRequests,
        updatedActiveRequest,
        newJobs, // use this only for Launch.
      };
    }

    /**
     * @function - Used to launch a solver request.
     */
    function launchSolverCall() {
      self.setState({ isLaunched: true });
      solverService
        .launchSolverRequest(self.userId, requestBodyLaunch)
        .then(response => {
          const updatedRequests = getUpdatedSolverDetails(response, 'id');
          self.setState({
            solverRequests: updatedRequests.updatedSolverRequests,
            activeRequest: updatedRequests.updatedActiveRequest,
            isLaunched: false,
            // jobs: [...self.state.jobs, ...updatedRequests.newJobs],
          });
        })
        .catch(error => {
          console.error(`error`, error);
          self.updateSolverRequests(
            jobRequest.id,
            'status',
            jobRequest.status.status
          );
          self.props.reportError({
            errorType: 'Snackbar',
            isHtml: true,
            error: error,
          });
        });
    }

    /**
     * @function - Used to stop a solver request.
     */
    function stopSolverCall() {
      const scenario = currentScenario();
      const scenarioId = scenario ? scenario.id : null;

      solverService
        .stopSolverRequest(
          scenarioId,
          jobRequest.id,
          self.userId,
          requestBodyStop
        )
        .then(() => {
          // const updatedRequests = getUpdatedSolverDetails(response, 'jobId');
          const name = jobRequest.name;
          self.showNotification({
            message: t('SOLVER.stopSolverNotification', {
              name,
            }),
            type: 'success',
          });

          // self.setState(
          //   {
          //     solverRequests: updatedRequests.updatedSolverRequests,
          //     activeRequest: updatedRequests.updatedActiveRequest,
          //   },
          //   () => {
          //     const name = jobRequest.name;
          //     self.showNotification({
          //       message: t('SOLVER.stopSolverNotification', {
          //         name,
          //       }),
          //       type: 'success',
          //     });
          //   }
          // );
        })
        .catch(error => {
          console.error(`error`, error);
          self.updateSolverRequests(
            jobRequest.id,
            'status',
            jobRequest.status.status
          );
          self.props.reportError({
            errorType: 'Snackbar',
            isHtml: true,
            error: error,
          });
        });
    }

    if (action === 'play') {
      action = relaunchStatuses.includes(jobRequest.status.status)
        ? 'relaunch'
        : action;
      /*push Events for Analytics */
      const payLoad = {
        iSolverRequestId: jobRequest.id,
        iSolverRequestType: action === 'relaunch' ? 'Relaunch' : 'Launch',
        iSolverJobId: null,
        iCrewGroup: jobRequest.crewGroupName || null,
        iSolverRequestElapsedTime: null,
      };
      pushSolverEventAnalytics(payLoad);
      /**
       *  status 'Launching' will be used when the user launch a job to set the front end state irrespective of the status
       *  from the job polling inorder to show that the process has initiated immediately when the user clicks.
       */
      this.updateSolverRequests(jobRequest.id, 'status', 'Launching');
      if (this.isAPICallActive || this.state.isRecipeCallActive) {
        setTimeout(launchSolverCall, 3000);
      } else {
        launchSolverCall();
      }
    } else if (action === 'stop') {
      if (!isStopDialogOpen) {
        this.setState({ isStopDialogOpen: true, isLaunched: false });
      } else {
        this.setState({ isStopDialogOpen: false, isLaunched: false });
        action = relaunchStatuses.includes(jobRequest.status.status)
          ? 'relaunch'
          : action;
        stopSolverCall();
      }
    }
  };

  /**
   * @function - Used to update the activeRequest and Solver requests array.
   * @param {*} solverId - The unique solver ID.
   * @param {*} field - The field which needs to be updated.
   * @param {*} value - The value that is to be set.
   */
  updateSolverRequests = (solverId, field, value, callback) => {
    const { activeRequest, solverRequests } = this.state;
    let updatedActiveRequest;
    const updateSolverRequests = Array.from(solverRequests);
    const key = solverRequests.findIndex(solverRequest => {
      return solverRequest.id === solverId;
    });

    const fieldValue =
      field === 'status'
        ? getStatusObject(value, updateSolverRequests[key].status.status)
        : value;
    const isRecipeUpdated =
      field === 'solverRecipeName' ? false : this.state.isRecipeCallActive;

    if (key !== -1) {
      updateSolverRequests[key] = {
        ...updateSolverRequests[key],
        [field]: fieldValue,
      };

      updatedActiveRequest =
        activeRequest.id === solverId
          ? updateSolverRequests[key]
          : activeRequest;
    }
    this.setState(
      {
        solverRequests: updateSolverRequests,
        activeRequest: updatedActiveRequest,
        isRecipeCallActive: isRecipeUpdated,
        isLaunched: false,
      },
      () => {
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    );
  };

  /**
   * @function - Used to set the active request.
   * @param {Object} request - The current selected request from the solver object.
   */
  selectRequest = async request => {
    try {
      const { activeRequest, solverRequests } = this.state;
      const updateSolverRequests = Array.from(solverRequests);

      const key = solverRequests.findIndex(solverRequest => {
        if (solverRequest.id !== null) {
          return solverRequest.id === request.id;
        }
        return false;
      });

      const updatedActiveRequest =
        key !== -1 ? updateSolverRequests[key] : activeRequest;

      // const { selectedTab } = this.state;
      // let newTab = selectedTab !== -1 ? selectedTab : 0;
      let newTab = 0; // always select the first tab 'Summary' as default when switching between solver cards.

      const statisticsDisabled =
        (request && request.status.status) !== 'Done-success';
      if (statisticsDisabled && newTab === 1) {
        newTab = 0;
      }

      this.setState({
        activeRequest: updatedActiveRequest,
        selectedTab: newTab,
        action: null,
        updateEndorsed: false,
        compareTab: false,
      });
    } catch (error) {
      this.props.reportError({
        errorType: 'Snackbar',
        isHtml: true,
        error: error,
      });
    }
  };

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  handleActiveCompareTab = solversToCompare => {
    this.setStatsDataIfNot(solversToCompare, true);
  };

  handleSolverToCompare = (solver, action) => {
    if (
      action === 'add' &&
      solver.status.status === 'Done-success' &&
      this.state.solversToCompare.length < 25
    ) {
      const newSetSolversToCompare = [...this.state.solversToCompare, solver];
      if (this.state.compareTab) {
        this.setStatsDataIfNot(newSetSolversToCompare, true);
      }
    } else {
      const solversToCompare = this.state.solversToCompare.filter(
        s => s.id !== solver.id
      );

      const isOpenCompareTab =
        solversToCompare.length >= 1 && this.state.compareTab;
      this.setState({
        solversToCompare,
        compareTab: isOpenCompareTab,
      });
    }
  };

  handleCompareAll = solversToCompare => {
    if (this.state.compareTab) this.setStatsDataIfNot(solversToCompare, true);
    else this.setState({ solversToCompare });
  };

  handleSolverRequest = (form, entity) => {
    const solverRequest = [
      {
        crewGroupName: entity.crewGroup,
        isEndorsed: false,
        solverTaskName: entity.solverTask,
        rulesetName: entity.rule,
        name: entity.name,
        description: entity.description,
        solverRecipeName: entity.recipeNames,
      },
    ];

    this.addSolverRequest(solverRequest);
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackType: '',
    });
  };

  addSolverRequest = solverRequest => {
    solverService
      .createRequest(this.scenarioId, this.userId, solverRequest)
      .then(r => {
        if (Array.isArray(r)) {
          const payload = {};
          payload['iSolverRequestId'] = r[0].id;
          payload['iSolverRequestName'] = r[0].name;
          payload['iScenarioId'] = parseInt(this.scenarioId, 10);
          payload['iSolverRequestType'] = 'Create';
          payload['iSolverTask'] = r[0].solverTaskName;
          payload['iCrewGroup'] = r[0].crewGroupName;
          payload['iRuleSet'] = r[0].rulesetName;
          payload['iRecipe'] = r[0].solverRecipeName;

          pushSolverDataToAnalytics(payload);
        }
        this.setState(
          state => ({
            solverRequests: [
              { ...r[0], status: getStatusObject(r[0].status) },
              ...state.solverRequests,
            ],
            message: this.props.t('SUCCESS.SOLVER.ADD', {
              solverRequest: r[0].name,
            }),
            snackType: 'success',
            totalDataSize: state.totalDataSize + 1,
            activeRequest: { ...r[0], status: getStatusObject(r[0].status) },
          }),
          () => {
            this.selectRequest(this.state.activeRequest);
            this.scrollToTop();
          }
        );
        this.toggleForm();
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  scrollToTop = () => {
    setTimeout(() => {
      if (this.scrollRef.current) {
        this.scrollRef.current._scrollRefY.scrollTop = 0;
      }
    }, 1000);
  };

  throttleUpdate = _.throttle((updatedValues, field, oldFieldValue) => {
    this.isAPICallActive = true;
    this.setState({
      isRecipeCallActive: field === 'solverRecipeName' ? true : false,
    });
    solverService
      .updateRequest(this.scenarioId, this.userId, updatedValues)
      .then(r => {
        if (Array.isArray(r)) {
          const payload = {};
          payload['iSolverRequestId'] = r[0].id;
          payload['iSolverRequestName'] = r[0].name;
          payload['iScenarioId'] = parseInt(this.scenarioId, 10);
          payload['iSolverRequestType'] = 'Update';
          payload['iSolverTask'] = r[0].solverTaskName;
          payload['iCrewGroup'] = r[0].crewGroupName;
          payload['iRuleSet'] = r[0].rulesetName;
          payload['iRecipe'] = r[0].solverRecipeName;

          pushSolverDataToAnalytics(payload);
        }
        const { activeRequest, solverRequests } = this.state;
        const updatedSolverRequests = Array.from(solverRequests);

        const key = solverRequests.findIndex(solverRequest => {
          return solverRequest.id === r[0].id;
        });

        if (key !== -1) {
          updatedSolverRequests[key] = {
            ...r[0],
            status:
              updatedSolverRequests[key].status.status === 'Launching'
                ? updatedSolverRequests[key].status
                : getStatusObject(r[0].status),
          };
        }
        const updatedActiveRequest =
          activeRequest.id === r[0].id
            ? {
                ...r[0],
                status:
                  activeRequest.status.status === 'Launching'
                    ? activeRequest.status
                    : getStatusObject(r[0].status),
              }
            : activeRequest;

        this.setState({
          activeRequest: updatedActiveRequest,
          solverRequests: updatedSolverRequests,
          isRecipeCallActive:
            field === 'solverRecipeName'
              ? false
              : this.state.isRecipeCallActive,
        });
        this.isAPICallActive = false;
      })
      .catch(error => {
        this.updateSolverRequests(updatedValues.id, field, oldFieldValue);
        this.isAPICallActive = false;
        this.props.reportError({ error });
      });
  }, 500);

  updateSolverSummary = (field, value) => {
    const activeRequestCopy = { ...this.state.activeRequest };
    this.updateSolverRequests(activeRequestCopy.id, field, value, () => {
      const updatedRequest = this.state.solverRequests.find(
        solverRequest => solverRequest.id === activeRequestCopy.id
      );

      //updateApiCall will be initiated only if any of the field is changed
      let isSolverUpdated = false;
      for (const key of Object.keys(activeRequestCopy)) {
        if (activeRequestCopy[key] !== updatedRequest[key]) {
          isSolverUpdated = true;
          break;
        }
      }

      //since solverrecipe accept multiple values, making sure all values are valid
      let isInvalidValue = false;
      if (field === 'solverRecipeName')
        isInvalidValue = updatedRequest.solverRecipeName.includes('-1');

      if (isSolverUpdated && !isInvalidValue)
        this.throttleUpdate(updatedRequest, field, activeRequestCopy[field]);
    });
  };

  updateCrewGroupRulesDetails = value => {
    const { activeRequest, crewGroups, rules } = this.state;
    const updatedValues = { ...activeRequest };

    updatedValues.crewGroupName = value;
    //change the rule name as well corresponding to the crew group.
    const filteredCrewGroup = crewGroups.find(
      crewGroup => crewGroup.name === value
    );

    if (filteredCrewGroup) {
      const rulesetName = rules.find(
        rule => rule.id === filteredCrewGroup.ruleset
      ).name;
      updatedValues.rulesetName = rulesetName;
    }

    this.throttleUpdate(updatedValues);
  };

  showNotification = args => {
    this.setState({
      message: args.message,
      snackType: args.type,
    });
  };

  /**
   * @function - Used to set statistics data if not present in the solver requests.
   *
   * @param {Array} requests - Array of solver requests to check and update.
   * @param {Boolean} compareFlag - Used to check if it is the compare functionality.
   */
  setStatsDataIfNot = (requests, compareFlag = false) => {
    let key = null;
    const noStatDataJobs = requests
      .filter(
        request =>
          !(
            Object.prototype.hasOwnProperty.call(request, 'bases') &&
            Object.prototype.hasOwnProperty.call(request, 'data')
          )
      )
      .map(request => request.jobId);
    if (noStatDataJobs.length > 0) {
      this.setState({ isStatDataFetching: true });

      solverService
        .getSolverStatistics(this.userId, this.scenarioId, noStatDataJobs)
        .then(response => {
          const { activeRequest, solverRequests } = this.state;

          const updatedSolverRequests = solverRequests.map(
            (solverRequest, index) => {
              const statData = response.find(
                element => element.jobId === solverRequest.jobId
              );
              if (
                activeRequest &&
                solverRequest.jobId === activeRequest.jobId
              ) {
                key = index;
              }
              if (statData) {
                return {
                  ...solverRequest,
                  bases: statData.bases || [],
                  data: statData.data || {},
                };
              }
              return solverRequest;
            }
          );
          let compareData = requests;
          let isCompare = false;
          if (compareFlag && requests.length > 0) {
            isCompare = true;
            compareData = requests.map(compareSolver => {
              const tempData = response.find(
                el => el.jobId === compareSolver.jobId
              );

              if (tempData) {
                return {
                  ...compareSolver,
                  bases: tempData.bases || [],
                  data: tempData.data || {},
                };
              }
              return compareSolver;
            });
          }
          const updatedActiveRequest =
            key !== null ? updatedSolverRequests[key] : activeRequest;
          this.setState({
            solverRequests: updatedSolverRequests,
            activeRequest: updatedActiveRequest,
            solversToCompare: compareData,
            compareTab: isCompare,
            isStatDataFetching: false,
          });
        })
        .catch(error => {
          console.error(error);
          this.props.reportError({
            errorType: 'Snackbar',
            isHtml: true,
            error: error,
          });
          this.setState({ selectedTab: 0, isStatDataFetching: false });
        });
    } else {
      if (compareFlag && requests.length) {
        this.setState({ compareTab: true, solversToCompare: requests });
      } else {
        this.setState({ compareTab: false, solversToCompare: [] });
      }
    }
  };

  render() {
    const openScenario = storage.getItem('openScenario');
    if (!openScenario) {
      return <Redirect to="/" />;
    }
    const {
      solverRequests,
      activeRequest,
      selectedTab,
      action,
      updateEndorsed,
      compareTab,
      solversToCompare,
      isFetching,
      solverTasks,
      crewGroups,
      rules,
      recipes,
      scopes,
      isFormOpen,
      message,
      snackType,
      isStopDialogOpen,
      isStatDataFetching,
      isRecipeCallActive,
      isLaunched,
    } = this.state;
    const { t, readOnly, reportError } = this.props;

    const isReadOnly = readOnly ? true : false;

    this.scenarioName =
      history.location.state !== undefined &&
      history.location.state.openItemName
        ? history.location.state.openItemName
        : storage.getItem('openScenario').name;
    const noActiveRequest = t('SOLVER.noActiveRequest');
    const noSolverRequests = t('SOLVER.noSolverRequests');
    const active = activeRequest ? activeRequest.id : -1;
    let statisticsDisabled = true;
    if (active !== -1)
      statisticsDisabled = !(activeRequest.status.status === 'Done-success');
    if (isFetching) {
      return <Loading />;
    }

    const statusBarTransKey = activeRequest
      ? `SOLVER.statusMessages.${activeRequest.status.status}.textBar`
      : null;

    return (
      <Fragment>
        <Header>
          <AddHeader
            t={t}
            name={t('SOLVER.name')}
            openItemName={this.scenarioName}
            onClick={this.toggleForm}
            disableAdd
            readOnly={isReadOnly}
            scopes={solverScopes.solver.solverManage}
            className="tm-scenario_solver__create-btn"
          />
        </Header>
        <Container>
          <ListContainer>
            <SolverList
              solverRequests={solverRequests}
              active={active}
              handleClick={this.selectRequest}
              action={action}
              handleCompare={this.handleActiveCompareTab}
              handleSolverToCompare={this.handleSolverToCompare}
              handleCompareAll={this.handleCompareAll}
              t={t}
              readOnly={isReadOnly}
              ref={this.scrollRef}
              solverScopes={solverScopes.solver}
            />
          </ListContainer>

          <TabsContainer>
            <PerfectScrollbar option={perfectScrollConfig}>
              <AppBar
                position="static"
                color="default"
                style={{ transform: 'none' }}
              >
                {!compareTab && (
                  <AccessEnabler
                    scopes={solverScopes.solver.solverEvaluate}
                    disableComponent
                    render={props => (
                      <Tabs
                        value={selectedTab !== -1 ? selectedTab : false}
                        onChange={this.handleTabChange}
                      >
                        <Tab
                          label={t('SOLVER.summary')}
                          disabled={active === -1 ? true : false}
                        />

                        <Tab
                          label={t('SOLVER.statistics')}
                          disabled={
                            statisticsDisabled || props.disableComponent
                          }
                          onClick={() => {
                            this.setStatsDataIfNot([this.state.activeRequest]);
                          }}
                        />
                      </Tabs>
                    )}
                  />
                )}
                {compareTab && (
                  <Tabs value={0}>
                    <Tab label={'Compare'} disabled={false} />
                  </Tabs>
                )}
              </AppBar>
              {activeRequest && !compareTab && (
                <Fragment>
                  <div>
                    <SolverStatusBar>
                      <SolverIcon
                        style={{
                          width: '25px',
                          height: '25px',
                          margin: '5px',
                        }}
                        status={activeRequest.status.status}
                      />
                      <p>{t(statusBarTransKey)}</p>
                    </SolverStatusBar>
                    <SolverActionBarWithConnect
                      t={t}
                      activeRequest={activeRequest}
                      onEndorse={this.onEndorse}
                      onUpdateState={this.onUpdateState}
                      readOnly={isReadOnly}
                      updateSolverName={this.updateSolverSummary}
                      reportError={reportError}
                      crewGroups={crewGroups}
                      rules={rules}
                      scenarioName={this.scenarioName}
                      scenarioId={this.scenarioId}
                      solverScopes={solverScopes.solver}
                    />
                  </div>
                  {selectedTab === 0 && (
                    <PerfectScrollbar option={perfectScrollConfig}>
                      <TabContainer>
                        <Summary
                          t={t}
                          activeRequest={activeRequest}
                          updateEndorsed={updateEndorsed}
                          solverTasks={solverTasks}
                          crewGroups={crewGroups}
                          rules={rules}
                          recipes={recipes}
                          scopes={scopes}
                          readOnly={isReadOnly}
                          updateSolverSummary={this.updateSolverSummary}
                          updateCrewGroupRulesDetails={
                            this.updateCrewGroupRulesDetails
                          }
                          solverScopes={solverScopes.solver}
                          isAPICallActive={isRecipeCallActive}
                          isLaunched={isLaunched}
                        />
                      </TabContainer>
                    </PerfectScrollbar>
                  )}

                  {selectedTab === 1 && (
                    <TabContainer
                      style={{
                        height: 'calc(100% - 201px)',
                      }}
                    >
                      <StatisticsTable t={t} activeRequest={activeRequest} />
                    </TabContainer>
                  )}
                </Fragment>
              )}
              {compareTab && (
                <TabContainer>
                  <Compare t={t} solvers={solversToCompare} />
                </TabContainer>
              )}
              {!activeRequest &&
                !compareTab &&
                (solverRequests.length ? (
                  <NoActiveRequest>
                    <p>{noActiveRequest}</p>
                  </NoActiveRequest>
                ) : (
                  <NoActiveRequest>
                    <p>{noSolverRequests}</p>
                  </NoActiveRequest>
                ))}
            </PerfectScrollbar>
          </TabsContainer>

          <SolverForm
            isOpen={isFormOpen}
            handleCancel={this.toggleForm}
            handleOk={this.handleSolverRequest}
            formId={'solverForm'}
            t={t}
            onClose={this.toggleForm}
            solverTasks={solverTasks}
            crewGroups={crewGroups}
            rules={rules}
            recipes={recipes}
            solverScopes={solverScopes.solver}
          />
          <StopDialog
            open={isStopDialogOpen}
            handleClose={this.closeStopDialog}
            texts={{
              title: t('SOLVER.stopSolverTitle'),
              content: t('SOLVER.stopSolverMessage'),
              okButton: t('SOLVER.stopSolverButton'),
            }}
            formId={'solverForm'}
            t={t}
            handleOk={() => {
              this.onUpdateState('stop');
            }}
          />
          <Notification
            message={message}
            clear={this.onClearSnackBar}
            type={snackType}
          />
        </Container>
        <ModalLoader
          open={isStatDataFetching}
          title={t('SOLVER.loaderStatistics.waitMessage')}
          subtitle={t('SOLVER.loaderStatistics.waitStatus')}
          color="white"
        />
      </Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return { newJobStatus: state.newJobStatus, userData: state.user.userData };
};

const mapDispatchToProps = dispatch => {
  return {
    triggerShowErrors: bool => dispatch(triggerShowErrors(bool)),
  };
};

Solver.propTypes = {
  t: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  setReadOnly: PropTypes.func,
  reportError: PropTypes.instanceOf(Object).isRequired,
  newJobStatus: PropTypes.shape({ latestJob: PropTypes.array }),
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

Solver.defaultProps = {
  readOnly: false,
  setReadOnly: () => {},
  newJobStatus: { latestJob: [] },
  userData: {},
};
const solverComponent = connect(mapStatetoProps, mapDispatchToProps)(Solver);
export default withErrorHandler(solverComponent);
