import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import history from '../../history';
import AutoComplete from '../../components/Autocomplete/AutoComplete';
import * as ruleService from '../../services/Data/rules';

import withErrorHandler from '../../components/ErrorHandler/withErrorHandler';
import storage from '../../utils/storage';

import clockIcon from './icons/clock.svg';
import crewGroupsIcon from './icons/crewGroups.svg';
import rulesIcon from './icons/rules.svg';
import rulesDisabledIcon from './icons/rulesdisabled.svg';

import { IconButton, Icon } from '@material-ui/core';
import ZoomOutIcon from './components/Timeline/icons/ZoomOutIcon';
import ZoomMaxOutIcon from './components/Timeline/icons/ZoomMaxOutIcon';
import ZoomMaxInIcon from './components/Timeline/icons/ZoomMaxInIcon';
import { iFlightEventBus } from './components/Chronos/iFlightGantt/iflight_event_bus';
import AccessEnabler from '../../components/AccessEnabler';
import scopes from '../../../src/constants/scopes';
import { ellipsisTransformer } from '../../components/GenericTable/transformers';

const textOverflowStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 2.5px 0;
  position: relative;
  z-index: 3;

  button {
    min-width: 39px;
    min-height: 39px;
    width: 39px;
    height: 39px;
    overflow: visible;
  }

  & .Select-placeholder {
    padding-bottom: 5px;
    padding-left: 30px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.67);
  }

  & .Select-arrow-zone {
    top: -6px;
  }

  & .Select-control {
    width: 80%;
    line-height: -1px;
    & .Select-clear-zone {
      width: auto;
      transform: translateY(-6px);
    }
  }

  & .is-searchable {
    width: 140px;
    margin-top: -5px;
  }

  & .MuiInput-underline:before {
    bottom: -3px;
  }

  & .MuiInput-underline:after {
    bottom: -3px;
  }

  & .Select-multi-value-wrapper > div > div {
    ${textOverflowStyle};
  }

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.87);
    height: 51px;
  }

  & > div:not(:last-child) {
    border-right: 2px solid #e0e0e0;
  }

  & > div:first-child {
    flex-basis: 11%;
    justify-content: center;
    font-weight: 500;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.67);
  }

  & > div:nth-child(2) {
    flex-basis: 40%;

    & > div {
      width: 330px;
      padding-left: 20px;
      ${textOverflowStyle};
      font-weight: 500;
      color: rgba(0, 0, 0, 0.67);

      & > p {
        font-weight: 400;
        font-size: 13px;
        ${textOverflowStyle};
        margin: 0;
        color: #ff650c;
      }
    }
  }

  & > div:nth-child(3) {
    flex-basis: 40%;
    justify-content: space-around;

    & > div:first-child {
      width: 170px;
      font-size: 13px;
    }

    & a:link,
    a:visited,
    a:hover,
    a:active {
      text-decoration: none;
      text-align: center;
      color: #0a75c2;
      font-size: 13px;
      max-width: 170px;

      & > div > div > span {
        ${textOverflowStyle};
        max-width: 138px;
      }
    }

    & > div:last-child {
      width: 100px;
      font-size: 13px;
    }
  }

  & > div:last-child {
    flex-basis: 9%;
    justify-content: center;
  }

  @media only screen and (max-width: 1111px) {
    & > div:nth-child(3) {
      & > div:first-child {
        width: 130px;
      }

      & a:link,
      a:visited,
      a:hover,
      a:active {
        max-width: 130px;

        & > div > div > span {
          max-width: 130px;
        }

        & .rules_icon {
          display: none;
        }
      }

      & > div:last-child {
        width: 70px;
      }

      & .MuiInputAdornment-positionStart {
        display: none;
      }

      & .Select-placeholder {
        padding-left: 0;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    & > div:nth-child(2) {
      flex-basis: 40%;

      & > div {
        width: 290px;
      }
    }

    & > div:first-child {
      font-size: 16px;
    }

    & > div:nth-child(3) {
      & > div:first-child {
        width: 90px;
      }

      & a:link,
      a:visited,
      a:hover,
      a:active {
        max-width: 90px;

        & > div > div > span {
          max-width: 90px;
        }

        & .rules_icon {
          display: none;
        }
      }

      & > div:last-child {
        width: 70px;
      }

      & .MuiInputAdornment-positionStart {
        display: none;
      }

      & .Select-placeholder {
        padding-left: 0;
      }
    }
  }
`;

Header.displayName = 'Header';

// //hardcoded, need to replace with actual data
const timelineSuggestions = () => [
  {
    label: 'UTC',
    value: 'UTC',
  },
];

export class PairingsHeader extends Component {
  constructor(props) {
    super(props);

    const { location, t } = this.props;

    this.state = {
      rule: location && location.state ? location.state.rule : '',
      crewGroup: location && location.state ? location.state.crewGroup : '',
      isFetching: false,
      timelineSuggestion: timelineSuggestions()[0].value,
    };
  }

  startDate = this.props.date ? moment(this.props.date.startDate) : moment();
  endDate = this.props.date ? moment(this.props.date.endDate) : moment();
  startDateFormatted = this.startDate.format('MMMM YYYY');
  endDateFormatted = this.endDate.format('MMMM YYYY');
  diff = this.endDate.diff(this.startDate, 'days') + 1;

  handleAutocompleteChange = fieldName => {
    return value => {
      if (value === null) value = '';
      this.onChange(fieldName, value);
    };
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching !== this.props.isFetching) {
      this.setState({ isFetching: nextProps.isFetching });
    }
    if (
      nextProps.savedCrewGroup.ruleset !== this.props.savedCrewGroup.ruleset &&
      nextProps.savedCrewGroup.crewGroup !== this.props.savedCrewGroup.crewGroup
    ) {
      this.setState({
        rule: nextProps.savedCrewGroup.ruleset,
        crewGroup: nextProps.savedCrewGroup.crewGroup,
      });
    }
  }

  onChange = (fieldName, value) => {
    this.setState({
      [fieldName]: value,
    });
  };

  updateCrewGroup = value => {
    const scenarioId = this.props.openItemId;
    this.setState({ isFetching: true });
    ruleService
      .updateCrewGroup(scenarioId, value, this.state.rule)
      .then(() => {
        this.setState({ isFetching: false });
        this.removeFilters();
        this.props.handleCrewGroupChange(scenarioId, true, {
          crewGroup: value,
          ruleset: this.state.rule,
        });
      })
      .catch(error => {
        this.setState({ isFetching: false });
        this.props.reportError({ error });
      });
  };

  removeFilters = () => {
    storage.removeItem(`timelineFilter1`);
    storage.removeItem(`timelineFilter2`);
    storage.removeItem(`timelineFilter3`);
    storage.removeItem(`timelineLastFilter1`);
    storage.removeItem(`timelineLastFilter2`);
    storage.removeItem(`timelineLastFilter3`);
  };

  setRuleBasedOnCrewGroup = crewGroupId => {
    const filteredCrewGroups = this.props.crewGroups.find(
      crewGroup => crewGroup.id === parseInt(crewGroupId, 10)
    );

    if (filteredCrewGroups) {
      this.setState(
        {
          rule: filteredCrewGroups.ruleset,
        },
        () => {
          this.updateCrewGroup(crewGroupId);
          storage.setItem(`rulesetId`, filteredCrewGroups.ruleset);
        }
      );
    }
  };

  getRuleSetName = () => {
    const ruleName = this.props.ruleSets.find(
      rule => rule.id === this.state.rule
    );
    return ruleName ? ruleName.name : '';
  };

  getRulesPath = () => {};

  getRuleSetToolTipLabel = () => {
    const { t, ruleSets } = this.props;

    const ruleSetName = ruleSets.find(
      ruleSet => ruleSet.id === this.state.rule
    );
    return ruleSetName
      ? ruleSetName.name
      : t('PAIRINGS.activities.tooltips.titles.ruleSet');
  };

  changeTimelineSuggestion = timelineSuggestion => {
    this.setState({ timelineSuggestion });
  };

  handleZoom = zoomDirection => {
    const metaInfo = Date.now();
    if (!metaInfo) {
      event.preventDefault();
    }
    const zoomParameters = {
      zoomDirection,
      rowZoomParameter: 1,
      columnZoomParameter: 2.5,
      metaInfo,
    };

    iFlightEventBus.emitEvent('stepZoomEvent', [
      zoomDirection,
      metaInfo,
      zoomParameters,
    ]);
  };

  handleCustomeZoom = (type = 'out') => {
    iFlightEventBus.emitEvent('maxMinZoomEvent', [type]);
  };

  render() {
    const {
      t,
      name,
      openItemId,
      openItemName,
      onAddClick,
      onMoreClick,
      readOnly,
      readOnlyLegend,
      crewGroups,
      previewMode,
      editMode,
    } = this.props;

    const { crewGroup, isFetching, timelineSuggestion, rule } = this.state;

    const crewGroupsSuggestions = crewGroups.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    return (
      <Header>
        <div>{name}</div>
        <div>
          <AccessEnabler
            scopes={scopes.scenario.manage}
            disableComponent
            render={props => (
              <div>
                {readOnly || props.disableComponent
                  ? `${openItemName} ${readOnlyLegend}`
                  : openItemName}
                <p>{`From ${this.startDateFormatted} to ${this.endDateFormatted} (${this.diff} days)`}</p>
              </div>
            )}
          />
        </div>
        <div>
          <AutoComplete
            className="pairings-autocomplete"
            suggestions={crewGroupsSuggestions}
            onChange={value => {
              this.handleAutocompleteChange('crewGroup')(value);
              this.setRuleBasedOnCrewGroup(value);
            }}
            id="context"
            name="context"
            adornmentIcon={crewGroupsIcon}
            placeholder={t('PAIRINGS.actionBar.crewGroups')}
            t={t}
            value={crewGroup}
            defaultValue={crewGroup}
            disabled={previewMode || isFetching}
          />
          <div>
            {!previewMode && (
              <Link
                to={{
                  pathname: `/data/${openItemId}/rules`,
                  state: {
                    openItemId,
                    openItemName,
                    editMode,
                    readOnly,
                  },
                }}
                onClick={() => storage.setItem('rulesetId', rule)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    className="rules_icon"
                    src={rulesIcon}
                    alt="rules_icon"
                    style={{
                      marginRight: '8px',
                    }}
                  />

                  <span>
                    {ellipsisTransformer(
                      this.getRuleSetName(),
                      {},
                      { maxWidth: '100px' }
                    )}
                  </span>
                </div>
              </Link>
            )}
            {previewMode && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  className="rules_icon"
                  src={rulesDisabledIcon}
                  alt="rules_icon"
                  style={{
                    marginRight: '8px',
                  }}
                  disabled={previewMode}
                />

                <span style={{ fontSize: '13px' }}>
                  {ellipsisTransformer(
                    this.getRuleSetName(),
                    {},
                    { maxWidth: '100px' }
                  )}
                </span>
              </div>
            )}
          </div>
          <AutoComplete
            className="pairings-autocomplete"
            suggestions={timelineSuggestions()}
            id="timelineReference"
            name="timelineReference"
            adornmentIcon={clockIcon}
            placeholder={t('PAIRINGS.actionBar.timelineReference')}
            value={timelineSuggestion}
            onChange={value => this.changeTimelineSuggestion(value)}
            t={t}
          />
        </div>
        <div>
          <IconButton
            onClick={() => this.handleCustomeZoom('out')}
            className="tm-scenario_pairings__collpase-btn"
          >
            <ZoomMaxOutIcon height="30px" width="30px" fill="#737373" />
          </IconButton>
          <IconButton
            onClick={() => this.handleZoom('ZoomOut')}
            className="tm-scenario_pairings__zoom_out-btn"
          >
            <ZoomOutIcon height="30px" width="30px" fill="#737373" />
          </IconButton>
          <IconButton
            onClick={() => this.handleZoom('ZoomIn')}
            className="tm-scenario_pairings__zoom_in-btn"
          >
            <Icon>loupe</Icon>
          </IconButton>
          <IconButton
            onClick={() => this.handleCustomeZoom('in')}
            className="tm-scenario_pairings__expand-btn"
          >
            <ZoomMaxInIcon height="30px" width="30px" fill="#737373" />
          </IconButton>
        </div>
        <div>
          {/* Following buttons may be enabled at a later point*/}
          {/* <IconButton style={{ padding: 0 }}>
            <Icon color="primary">bar_chart</Icon>
          </IconButton>
          <IconButton
            onClick={onMoreClick}
            disabled={previewMode}
            style={{ padding: 0 }}
          >
            <Icon>more_vert</Icon>
          </IconButton> */}
          <Fab
            color="secondary"
            onClick={onAddClick}
            aria-label="add"
            disabled={this.props.addButtonDisabled}
            className="tm-scenario_pairings__create-btn"
          >
            <AddIcon />
          </Fab>
        </div>
      </Header>
    );
  }
}

PairingsHeader.propTypes = {
  t: PropTypes.func.isRequired,
  name: PropTypes.string,
  onAddClick: PropTypes.func.isRequired,
  onMoreClick: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  addButtonDisabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  readOnlyLegend: PropTypes.string,
  date: PropTypes.objectOf(PropTypes.string).isRequired,
  ruleSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  crewGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  location: PropTypes.shape().isRequired,
  previewMode: PropTypes.bool,
  isFetching: PropTypes.bool.isRequired,
  savedCrewGroup: PropTypes.shape().isRequired,
  handleCrewGroupChange: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
};

PairingsHeader.defaultProps = {
  name: '',
  addButtonDisabled: false,
  readOnly: false,
  readOnlyLegend: '',
  previewMode: false,
};

export default withErrorHandler(PairingsHeader);
