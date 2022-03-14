import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Container from '../../components/Container';
import MenuText from '../../components/Menu/MenuText';
import Icon from '../../components/Icon';
import AccessEnabler from '../../components/AccessEnabler';

const HeaderContainer = styled(Container)`
  background-color: #fafafa;
  position: fixed;
  top: 54px;
  left: 0;
`;
const CreatedByMenu = styled(Menu)`
  margin-top: 40px;
  padding-top: 0;
  padding-bottom: 0;
`;

const StickyHeader = styled.h3`
  padding: 10px 16px;
  margin: 0;
  z-index: ${props => props.z};
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
`;

const StyledTableSortLabel = styled(TableSortLabel)`
  &.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active
    .MuiTableSortLabel-icon {
    color: rgba(0, 0, 0, 0.87) !important;
    font-size: 16px;
  }
`;
StickyHeader.displayName = 'StickyHeader';

const List = styled.ul`
  margin: 0;
  padding: 4.5px 0;
  width: 100;
  margin: 0 auto;
  background-color: #e0e0e0;
  -webkit-border-radius: 2px 2px 0 0;
  -moz-border-radius: 2px 2px 0 0;
  border-radius: 2px 2px 0 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 4px 0 rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14),
    0 3px 4px 0 rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14),
    0 3px 4px 0 rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  letter-spacing: 0;
  li {
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
    padding: 0;
    text-align: left;
  }
  li button {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
    padding-left: 0;
    padding-right: 0;
    text-transform: inherit;
    text-align: left;
    letter-spacing: 0;
  }
  li:first-child {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
    width: 8%;
    padding: 0 0 0 16px;
  }
  li:nth-child(2) {
    width: 37%;
  }
  li:nth-child(3) {
    width: 20%;
  }
  li:nth-child(4) {
    width: 19%;
  }
  li:nth-child(5) {
    width: 16%;
  }
  @media only screen and (max-device-width: 1024px) {
    li:first-child {
      padding: 0 5px 0 25px;
      width: 8%;
    }
    li:nth-child(2) {
      width: 37%;
      padding: 0px;
    }
    li:nth-child(3) {
      width: 20%;
      padding: 0px;
    }
    li:nth-child(4) {
      width: 18%;
      padding: 0px;
    }
    li:nth-child(5) {
      width: 16%;
      padding: 0 0 0 7px;
    }
  }
  @media only screen and (max-device-width: 768px) {
    li {
      padding: 0 0 0 10px;
    }
    li:first-child {
      padding: 0 0 0 15px;
      width: 8%;
    }
    li:nth-child(2) {
      width: 37%;
    }
    li:nth-child(4) {
      width: 18%;
    }
  }
`;

const TableName = styled(Typography)`
  display: flex;
  flex: 1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
  padding: 23px 0;
  align-items: center;
  line-height: 24px;
`;

const Header = styled.div`
  display: flex;
`;

const DEFAULT_ORDER = 'desc';

class TableHeader extends Component {
  state = {
    anchorEl: null,
    createdByOp: this.props.t('SCENARIOS.tableHead.createdBy.me'),
  };

  onClick = () => {
    this.props.handleAdd();
  };

  openCreatedBy = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCreatedBy = (createdByOp, filter) => {
    this.props.handleCreatedBy(filter);
    this.setState({ createdByOp: createdByOp });
    window.scrollTo(0, 0);
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl, createdByOp } = this.state;
    const tableHead = 'SCENARIOS.tableHead';
    const createdBy = 'SCENARIOS.tableHead.createdBy';
    const { t, stickyHeader, scopes } = this.props;

    return (
      <HeaderContainer
        style={{
          zIndex: 10,
        }}
        className="mui-fixed headerFixed"
      >
        <Header>
          <TableName variant="h6">{t('SCENARIOS.tableName')}</TableName>
          <AccessEnabler
            scopes={scopes.add}
            disableComponent
            render={props => (
              <Fab
                color="secondary"
                onClick={this.onClick}
                aria-label="add"
                style={{ top: '7px' }}
                disabled={props.disableComponent}
                className="tm-scenario_home_create-btn"
              >
                <AddIcon />
              </Fab>
            )}
          />
        </Header>
        <List>
          <li>{t(`${tableHead}.status`)}</li>
          <li>{t(`${tableHead}.name`)}</li>
          <li>{t(`${tableHead}.period`)}</li>
          <li>
            <Button
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.openCreatedBy}
              variant="contained"
              disableElevation
            >
              {t(`${tableHead}.created`) + ':'}
              {` ${createdByOp}`}
              <Icon margin={'0 0 0 8px'} iconcolor={'#0A75C2'}>
                filter_list
              </Icon>
            </Button>
          </li>
          <li>
            <StyledTableSortLabel
              style={{ cursor: 'auto' }}
              active={true}
              direction={DEFAULT_ORDER}
            >
              {t(`${tableHead}.modified`)}
            </StyledTableSortLabel>
          </li>
        </List>
        <StickyHeader z={1} id="stickyHeader">
          {stickyHeader}
        </StickyHeader>

        <CreatedByMenu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={this.handleCreatedBy.bind(
              null,
              t(`${createdBy}.me`),
              'ME'
            )}
          >
            <Icon margin={'-3px 8px 0 0'}>person</Icon>
            <MenuText>{t(`${createdBy}.me`)}</MenuText>
          </MenuItem>
          <MenuItem
            onClick={this.handleCreatedBy.bind(
              null,
              t(`${createdBy}.anyone`),
              'ANYONE'
            )}
          >
            <Icon margin={'-3px 8px 0 0'}>people</Icon>
            <MenuText>{t(`${createdBy}.anyone`)}</MenuText>
          </MenuItem>
          <MenuItem
            onClick={this.handleCreatedBy.bind(
              null,
              t(`${createdBy}.notMe`),
              'NOT_ME'
            )}
          >
            <Icon margin={'-3px 8px 0 0'}>person_outline</Icon>
            <MenuText>{t(`${createdBy}.notMe`)}</MenuText>
          </MenuItem>
        </CreatedByMenu>
      </HeaderContainer>
    );
  }
}

TableHeader.propTypes = {
  t: PropTypes.func.isRequired,
  stickyHeader: PropTypes.string.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleCreatedBy: PropTypes.func.isRequired,
  scopes: PropTypes.arrayOf(PropTypes.shape({})),
};

TableHeader.defaultProps = {
  scopes: [],
};

export default TableHeader;
