import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';

import Icon from '../../components/Icon';
import MenuText from '../../components/Menu/MenuText';
import MenuItem from '../../components/Menu/MenuItem';
import TruncatedTableCell from '../../components/TruncatedTableCell';
import GetEditIcon from '../../components/Icons/GetEditIcon';

import { READ_ONLY, EDIT, FREE } from './constants';

import * as dates from '../../utils/dates';
import AccessEnabler from '../../components/AccessEnabler';
import { checkPermission } from '../../utils/common';
import { connect } from 'react-redux';

const Row = styled(TableRow)`
  transition: all 0.5s ease;
  background-color: ${props =>
    props.scenariostatus === EDIT ? '#bae1fc' : 'none'};
`;

export const MenuAction = ({
  onClick,
  icon,
  text,
  scenario,
  scenariostofilter,
  index,
  disabled,
  svgIcon,
}) => {
  const handleClick = () => {
    onClick(scenario, scenariostofilter, index);
  };

  return (
    <MenuItem onClick={handleClick} disabled={disabled}>
      {svgIcon ? (
        svgIcon({
          width: '24px',
          height: '24px',
          fill: '#7e7e7e',
          style: { margin: '0 8px 0 0' },
        })
      ) : (
        <Icon>{icon}</Icon>
      )}
      <MenuText>{text}</MenuText>
    </MenuItem>
  );
};

export class ScenariosRow extends Component {
  state = {
    anchorEl: null,
    openLoader: false,
  };

  titles = {};

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  openDeleteDialog = (scenario, scenariostofilter, index) => {
    this.closeMenu();
    this.props.openDeleteDialog(scenario, scenariostofilter, index);
  };

  openEditDialog = () => {
    this.closeMenu();
    this.props.handleGetInfo(this.props.scenario);
  };

  saveAsTemplate = scenario => {
    this.props.openSaveAsTemplate(scenario);
    this.closeMenu();
  };

  getScenarioIconName = status => {
    const { userPermissions, scopes } = this.props;
    const statuses = {
      [FREE]: 'description',
      [EDIT]: 'create',
      [READ_ONLY]: 'visibility',
      DEFAULT: 'description',
      VIEW_ONLY: 'visibility',
    };

    if (checkPermission(scopes.manage, userPermissions)) {
      return statuses[status] || statuses['DEFAULT'];
    } else {
      return statuses['VIEW_ONLY'];
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ scenario: nextProps.scenario });
  }

  render() {
    const { anchorEl } = this.state;
    const {
      t,
      scenariostofilter,
      index,
      scenario,
      handleOpenScenario,
      scopes,
    } = this.props;
    const menuScenarios = 'GLOBAL.menu';

    const propsToOpenScenario = {
      style: { cursor: 'pointer' },
      onClick: () => handleOpenScenario(scenario),
    };

    return (
      <Row scenariostatus={scenario.status}>
        <TableCell {...propsToOpenScenario}>
          <Icon margin={'0 0 0 0'}>
            {this.getScenarioIconName(scenario.status)}
          </Icon>
        </TableCell>
        <TruncatedTableCell
          {...propsToOpenScenario}
          id={`name${scenario.id}`}
          text={scenario.name}
        >
          {scenario.name}
        </TruncatedTableCell>

        <TruncatedTableCell
          {...propsToOpenScenario}
          id={scenario.id}
          text={dates.dateRange(scenario.startDate, scenario.endDate)}
        >
          {dates.dateRange(scenario.startDate, scenario.endDate)}
        </TruncatedTableCell>
        <TruncatedTableCell
          {...propsToOpenScenario}
          id={`created${scenario.id}`}
          text={scenario.createdBy}
        >
          {scenario.createdBy}
        </TruncatedTableCell>
        <TruncatedTableCell
          {...propsToOpenScenario}
          id={`opened${scenario.id}`}
          text={dates.lastModified(scenario.lastOpenedByMe)}
        >
          {dates.lastModified(scenario.lastOpenedByMe)}
        </TruncatedTableCell>
        <TableCell>
          <IconButton
            aria-label="More"
            aria-owns={anchorEl ? 'long-menu' : null}
            aria-haspopup="true"
            onClick={this.openMenu}
          >
            <Icon iconcolor={'#0A75C2'}>more_vert</Icon>
          </IconButton>

          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.closeMenu}
          >
            <MenuAction
              onClick={this.openEditDialog}
              icon={'info'}
              svgIcon={GetEditIcon}
              text={t(`${menuScenarios}.getOrEditInfo`)}
              scenario={null}
            />
            {/* <MenuAction
              onClick={() => {}}
              icon={'layers'}
              text={t(`${menuScenarios}.duplicate`)}
              scenario={null}
            /> */}
            <AccessEnabler
              scopes={scopes.saveAsTemplate}
              disableComponent
              render={props => (
                <MenuAction
                  onClick={this.saveAsTemplate}
                  icon={'save'}
                  text={t(`SCENARIOS.menu.saveAs`)}
                  scenario={scenario}
                  disabled={props.disableComponent}
                />
              )}
            />
            <AccessEnabler
              scopes={scopes.delete}
              disableComponent
              render={props => (
                <MenuAction
                  onClick={this.openDeleteDialog}
                  icon={'delete'}
                  text={t(`${menuScenarios}.delete`)}
                  scenario={scenario}
                  index={index}
                  scenariostofilter={scenariostofilter}
                  disabled={
                    scenario.status === READ_ONLY || props.disableComponent
                  }
                />
              )}
            />
          </Menu>
        </TableCell>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    userPermissions: user.permissions,
  };
};

ScenariosRow.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    createdBy: PropTypes.string,
    creationTime: PropTypes.string,
    description: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    isOpenedBy: PropTypes.string,
    lastModifiedTime: PropTypes.string,
    lastOpenedByMe: PropTypes.string,
    status: PropTypes.string,
    templateId: PropTypes.string,
    templateName: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  openSaveAsTemplate: PropTypes.func.isRequired,
  handleGetInfo: PropTypes.func.isRequired,
  handleOpenScenario: PropTypes.func.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  scenariostofilter: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  scopes: PropTypes.arrayOf(PropTypes.string),
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

MenuAction.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  scenariostofilter: PropTypes.string,
  index: PropTypes.number,
  scenario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    createdBy: PropTypes.string,
    creationTime: PropTypes.string,
    description: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    isOpenedBy: PropTypes.string,
    lastModifiedTime: PropTypes.string,
    lastOpenedByMe: PropTypes.string,
    status: PropTypes.string,
    templateId: PropTypes.string,
    templateName: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};

MenuAction.defaultProps = {
  disabled: false,
  scenariostofilter: '',
  index: -1,
  scenario: null,
  text: '',
};

ScenariosRow.defaultProps = {
  scopes: [],
};

const ScenariosRowComponent = connect(mapStateToProps)(ScenariosRow);

export default ScenariosRowComponent;
