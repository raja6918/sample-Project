import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import PairingsHeaderDefault from './PairingsHeader';
import PairingsSolverResults from './PairingsSolverResults';
import withErrorHandler from '../../components/ErrorHandler/withErrorHandler';

import * as solverService from '../../services/Solver';
import * as ruleService from '../../services/Data/rules';
import { getCrewGroup } from '../../services/Data/crewGroups';
import { getFilterCriteria } from '../../services/Pairings';

import sessionStorage from '../../utils/storage';
import { isReadOnlyMode } from '../../utils/common';
import ChronosWithRouters from './components/Chronos/Chronos';
import {
  PANE_LABELS,
  MAX_TIMELINE_WINDOWS,
} from './components/Chronos/constants';
import { iFlightEventBus } from './components/Chronos/iFlightGantt/iflight_event_bus';

export class Pairings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crewGroups: [],
      selectedCrewGroup: null,
      ruleSets: [],
      savedCrewGroup: {
        crewGroup: null,
        ruleset: null,
      },
      timelineWindowsCount: 1,
      isFetching: false,
      filterCriteria: [],
      timelineOpenInfo: {
        [PANE_LABELS.PAIRING]: true,
        [PANE_LABELS.FLIGHT]: false,
        [PANE_LABELS.EMPTY]: false,
      },
    };

    const openedScenario = sessionStorage.getItem('openScenario');
    if (!openedScenario) return;
    const { startDate, endDate } = openedScenario;

    this.startDate = this.removeHoursFromISODate(startDate);
    this.endDate = this.removeHoursFromISODate(endDate);
  }

  componentDidMount() {
    const { previewMode, match, readOnly, setReadOnly } = this.props;
    if (readOnly || isReadOnlyMode()) {
      setReadOnly(true);
    }
    const userId = sessionStorage.getItem('loggedUser')
      ? sessionStorage.getItem('loggedUser').id
      : '';

    const scenarioId = match.params.scenarioID || match.params.previewID;

    if (!previewMode) {
      this.setCrewGroupAndRules(scenarioId, userId);
    } else {
      this.setCrewGroupAndRulesFromProps(scenarioId);
    }

    this.fetchFilterCriteria(userId);

    const openTimeLineWindows = sessionStorage.getItem(`openTimeLineWindows`);
    if (!this.props.previewMode && openTimeLineWindows) {
      if (
        typeof openTimeLineWindows === 'object' &&
        openTimeLineWindows !== null
      ) {
        let count = 0;
        for (const paneId of Object.keys(openTimeLineWindows)) {
          if (openTimeLineWindows[paneId] === true) {
            count++;
          }
        }
        this.setState({
          timelineWindowsCount: count,
          timelineOpenInfo: openTimeLineWindows,
        });
      }
    }
  }

  removeHoursFromISODate = date => {
    if (date) {
      /*
      This is patch, scenarios are stored with local hours
      and must be saved with hours set to 00:00:00
      */
      const datewithoutHours = date.split('T')[0] + 'T00:00:00.000Z';
      return datewithoutHours;
    }
    return null;
  };

  fetchFilterCriteria = userId => {
    getFilterCriteria(userId)
      .then(response => {
        this.setState({ filterCriteria: response });
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      });
  };

  getCrewGroupDetails = scenarioId => {
    const { crewGroup } = this.state.savedCrewGroup;
    getCrewGroup(crewGroup, scenarioId)
      .then(crewGroup => {
        this.setState({ selectedCrewGroup: crewGroup });
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      });
  };

  setCrewGroupAndRules(scenarioId, userId) {
    const getCrewGroups = solverService.getCrewGroups(scenarioId, userId);
    const getRuleSets = solverService.getRuleSets(scenarioId, userId);
    const getSavedCrewGroup = ruleService.getDefaultCrewgroup(scenarioId);
    Promise.all([getCrewGroups, getRuleSets, getSavedCrewGroup])
      .then(([crewGroups, ruleSets, savedCrewGroup]) => {
        this.setState(
          {
            crewGroups,
            ruleSets,
            savedCrewGroup: savedCrewGroup.data[0],
          },
          () => this.getCrewGroupDetails(scenarioId)
        );
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      });
  }

  setCrewGroupAndRulesFromProps(scenarioId) {
    try {
      const { location } = this.props;
      this.setState(
        {
          crewGroups:
            location && location.state ? location.state.crewGroups : [],
          ruleSets: location && location.state ? location.state.rules : [],
          savedCrewGroup: {
            crewGroup:
              location && location.state
                ? location.state.crewGroups[0].id
                : null,
            ruleset:
              location && location.state ? location.state.rules[0].id : null,
          },
        },
        () => this.getCrewGroupDetails(scenarioId)
      );
    } catch (error) {
      console.error(error);
    }
  }

  handleCrewGroupChange = (scenarioId, resetTimeline, savedCrewGroup) => {
    this.setState({ savedCrewGroup });

    iFlightEventBus.emitEvent('crewGroupChange', [
      scenarioId,
      resetTimeline,
      savedCrewGroup,
    ]);
  };

  getReadOnlyFromLocation = () =>
    this.props.location.state ? this.props.location.state.readOnly : false;

  handleAddButton = () => {
    const { timelineOpenInfo } = this.state;

    for (const paneId of Object.keys(timelineOpenInfo)) {
      if (timelineOpenInfo[paneId] === false) {
        timelineOpenInfo[paneId] = true;
        iFlightEventBus.emitEvent('paneOpen', ['W1', paneId]);
        break;
      }
    }

    this.setState(prevState => ({
      timelineWindowsCount: prevState.timelineWindowsCount + 1,
      timelineOpenInfo,
    }));
    sessionStorage.setItem(`openTimeLineWindows`, timelineOpenInfo);
  };

  updateTimelineWindowsCount = paneId => {
    if (paneId) {
      const timelineOpenInfo = {
        ...this.state.timelineOpenInfo,
        [paneId]: false,
      };

      let count = 0;
      for (const paneId of Object.keys(timelineOpenInfo)) {
        if (timelineOpenInfo[paneId] === true) {
          count++;
        }
      }

      this.setState(
        {
          timelineWindowsCount: count,
          timelineOpenInfo,
        },
        () => {
          sessionStorage.setItem(`openTimeLineWindows`, timelineOpenInfo);
        }
      );
    }
  };

  render() {
    const {
      timelineWindowsCount,
      crewGroups,
      ruleSets,
      savedCrewGroup,
      isFetching,
      filterCriteria,
      selectedCrewGroup,
    } = this.state;
    const {
      t,
      match,
      location,
      readOnly,
      editMode,
      previewMode,
      handleClose,
      handleSave,
    } = this.props;

    const openScenario = sessionStorage.getItem('openScenario');
    // To temporarily fix the issue when you open pairing page in new tab
    if (!openScenario || !this.startDate || !this.endDate) {
      return <Redirect to="/" />;
    }
    let openedScenarioName =
      location && location.state ? location.state.openItemName : null;
    if (!openedScenarioName)
      openedScenarioName = openScenario ? openScenario.name : '';

    const openItemId = match.params.scenarioID || match.params.previewID;

    const addButtonDisabled = previewMode
      ? previewMode
      : timelineWindowsCount >= MAX_TIMELINE_WINDOWS;

    return (
      <Fragment>
        <PairingsHeaderDefault
          name={t('PAIRINGS.name')}
          onAddClick={this.handleAddButton}
          onFilterClick={() => {}}
          onMoreClick={() => {}}
          openItemId={openItemId}
          editMode={editMode}
          openItemName={openedScenarioName}
          addButtonDisabled={addButtonDisabled}
          readOnly={readOnly || isReadOnlyMode()}
          readOnlyLegend={t('SCENARIOS.viewOnly.viewOnlyText')}
          t={t}
          date={{ startDate: this.startDate, endDate: this.endDate }}
          crewGroups={crewGroups}
          ruleSets={ruleSets}
          savedCrewGroup={savedCrewGroup}
          location={location}
          previewMode={previewMode}
          handleCrewGroupChange={this.handleCrewGroupChange}
          isFetching={isFetching}
        />
        {previewMode && (
          <PairingsSolverResults
            t={t}
            location={location}
            handleClose={handleClose}
            handleSave={handleSave}
          />
        )}
        <ChronosWithRouters
          t={t}
          startDate={this.startDate}
          endDate={this.endDate}
          timelineWindowsCount={timelineWindowsCount}
          filterCriteria={filterCriteria}
          updateTimelineWindowsCount={this.updateTimelineWindowsCount}
          previewMode={previewMode}
          readOnly={readOnly || isReadOnlyMode()}
          ruleset={savedCrewGroup.ruleset}
          currentCrewGroupId={savedCrewGroup.crewGroup}
          selectedCrewGroup={selectedCrewGroup}
        />
      </Fragment>
    );
  }
}

Pairings.propTypes = {
  t: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      readOnly: PropTypes.bool,
      openItemName: PropTypes.string,
      crewGroups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
        })
      ),
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
        })
      ),
    }),
  }).isRequired,
  editMode: PropTypes.bool,
  readOnly: PropTypes.bool,
  setReadOnly: PropTypes.func,
  previewMode: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  match: PropTypes.shape({
    params: {
      scenarioID: PropTypes.number,
      previewID: PropTypes.number,
    },
  }).isRequired,
  reportError: PropTypes.func.isRequired,
};

Pairings.defaultProps = {
  readOnly: false,
  editMode: false,
  previewMode: false,
  setReadOnly: () => {},
  handleClose: () => {},
  handleSave: () => {},
};

export default withErrorHandler(Pairings);
