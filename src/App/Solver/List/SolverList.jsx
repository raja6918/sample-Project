import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Collapse from '@material-ui/core/Collapse';
import CheckboxMUI from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';

import MenuItem from '../../../components/Menu/MenuItem';
import MenuText from '../../../components/Menu/MenuText';
import MenuAction from '../../../components/Menu/MenuAction';
import Icon from '../../../components/Icon';

import rocket from './rocket.svg';
import { perfectScrollConfig } from '../../../utils/common';

import {
  InputSearch,
  SearchIcon,
  ClearButton,
  ClearIcon,
} from '../../../components/FilterInput';

import SolverCard from './SolverCard';
import AccessEnabler from '../../../components/AccessEnabler';

const Checkbox = styled(CheckboxMUI)`
  font-size: 1.5rem;
  vertical-align: top;
  width: 20px;
  /* padding: 12px; */
`;

const List = styled.ul`
  height: calc(100% - 48px);
  margin: 0;
  padding: 0;
  /* overflow-y: auto;
  overflow-x: hidden; */
  border-right: 1px solid #cecece;
`;

const FilterContainer = styled.div`
  height: 48px;
  border-bottom: 1px solid #cecece;
  background-color: #fff;
  padding: 12px;
  & button:last-child {
    float: right;
    z-index: 1000;
  }
  & .MuiIconButton-root:hover {
    /* background-color: transparent !important; */
  }
`;

const FilterInputContainer = styled(Collapse)`
  text-align: center;
  padding: ${props => (props.in ? '5px' : '0')} 0;
  border-bottom: ${props => (props.in ? '1px solid #cecece' : 'none')};
  background-color: #fff;
`;

class SolverList extends Component {
  state = {
    requests: this.props.solverRequests,
    filteredRequests: this.props.solverRequests,
    showFilter: false,
    action: this.props.action,
    multiSelected: [],
    anchorEl: null,
  };
  searchTerm = '';

  filter = createRef();

  componentDidMount() {
    window.addEventListener('resize', this.shakeScrollBar);
  }

  componentWillReceiveProps(nextProps) {
    const updatedMultiselected = [];
    const { multiSelected, showFilter } = this.state;
    if (multiSelected.length) {
      multiSelected.forEach(selected => {
        let i = 0;
        while (i < nextProps.solverRequests.length) {
          if (selected.id === nextProps.solverRequests[i].id) {
            updatedMultiselected.push(nextProps.solverRequests[i]);
            break;
          }
          i++;
        }
      });
    }

    this.setState({
      requests: nextProps.solverRequests,
      action: nextProps.action,
      filteredRequests: showFilter
        ? this.filterRequests(nextProps.solverRequests)
        : nextProps.solverRequests,
      multiSelected: updatedMultiselected,
    });
  }

  toggleFilter = () => {
    this.setState(state => {
      if (state.showFilter) {
        this.filter.current.value = '';
        return { filteredRequests: this.state.requests, showFilter: false };
      } else {
        return { showFilter: true };
      }
    });
  };

  isEmpty = () =>
    this.filter.current ? this.filter.current.value.length < 1 : true;

  onFilter = () => {
    const { requests } = this.state;
    this.setState({ filteredRequests: this.filterRequests(requests) });
  };

  filterRequests = requests => {
    if (this.filter.current.value !== '')
      return requests.filter(
        val =>
          val.name
            .toLowerCase()
            .indexOf(this.filter.current.value.toLowerCase()) !== -1
      );
    return this.state.requests;
  };

  clearFilter = () => {
    this.filter.current.value = '';
    this.setState({ filteredRequests: this.state.requests });
  };

  selectAllClick = (event, checked) => {
    if (checked) {
      const validSolversToCompare = this.state.filteredRequests.filter(
        solver => {
          return solver.status.status === 'Done-success';
        }
      );
      this.setState({ multiSelected: this.state.filteredRequests }, () => {
        if (validSolversToCompare.length > 25) {
          this.props.handleCompareAll([...validSolversToCompare.slice(0, 25)]);
        } else {
          this.props.handleCompareAll(validSolversToCompare);
        }
      });
    } else {
      this.setState({ multiSelected: [] }, () => {
        this.props.handleCompare([]);
      });
    }
  };

  isSelected = id =>
    this.state.multiSelected.find(val => val.id === id) !== undefined;

  handleCheckbox = (event, request) => {
    const { multiSelected } = this.state;
    const selectedRequest = multiSelected.find(val => val.id === request.id);
    let newMultiSelected = [];
    let action = 'add';

    if (selectedRequest) {
      newMultiSelected = multiSelected.filter(
        val => val.id !== selectedRequest.id
      );
      action = 'remove';
    } else {
      newMultiSelected = [...multiSelected, request];
    }
    this.setState({ multiSelected: newMultiSelected }, () =>
      this.props.handleSolverToCompare(request, action)
    );
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleCompare = () => {
    if (this.state.multiSelected.length > 0) {
      const validSolverIds = this.state.multiSelected
        .filter(solver => {
          return solver.status.status === 'Done-success';
        })
        .map(request => request.id);

      const validSolversToCompare = this.state.requests.filter(solver => {
        return validSolverIds.includes(solver.id);
      });

      if (validSolversToCompare.length > 10) {
        this.props.handleCompare([...validSolversToCompare.slice(0, 10)]);
      } else {
        this.props.handleCompare(validSolversToCompare);
      }

      this.closeMenu();
    }
  };

  isReadyToCompare = () => {
    const { multiSelected } = this.state;
    let isDisabled = true;
    let i = 0;
    for (const selected of multiSelected) {
      if (selected.status.status === 'Done-success') {
        i++;
      }
      if (i >= 1) {
        isDisabled = false;
        break;
      }
    }
    return isDisabled;
  };

  shakeScrollBar = () => {
    // shake the scroll to get the scrollbar active in case of resizes :(
    setTimeout(() => {
      if (this._scrollRefY) {
        this._scrollRefY.scrollTop += 1;
      }
    }, 1000);
  };

  render() {
    const { active, handleClick, t, readOnly, solverScopes } = this.props;
    const {
      showFilter,
      filteredRequests,
      action,
      multiSelected,
      anchorEl,
    } = this.state;

    const numSelected = multiSelected.length;
    const rowCount = filteredRequests.length;
    const isDisabled =
      multiSelected.filter(solver => solver.status.status === 'Done-success')
        .length < 1;

    return (
      <Fragment>
        <FilterContainer open={showFilter}>
          <Checkbox
            onChange={this.selectAllClick}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount && rowCount > 0}
            style={{ paddingRight: '5px', marginRight: '15px' }}
          />
          <IconButton onClick={this.toggleFilter}>
            <Icon iconcolor="#0A75C2" margin="0">
              filter_list
            </Icon>
          </IconButton>
          <IconButton
            aria-label="More"
            aria-owns={anchorEl ? 'long-menu' : null}
            aria-haspopup="true"
            onClick={this.openMenu}
          >
            <Icon iconcolor="#0A75C2" margin="0">
              more_vert
            </Icon>
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.closeMenu}
          >
            <AccessEnabler
              scopes={solverScopes.solverEvaluate}
              disableComponent
              render={props => (
                <MenuAction
                  disabled={this.isReadyToCompare() || props.disableComponent}
                  handleClick={this.handleCompare}
                  icon={'compare'}
                  text={t('SOLVER.options.compare')}
                />
              )}
            />

            {/* <MenuItem disabled={isDisabled || readOnly} onClick={() => {}}>
              <img
                style={{ marginRight: 8, width: 24, height: 24 }}
                src={rocket}
                alt={t('SOLVER.options.launch')}
              />
              <MenuText>{t('SOLVER.options.launch')}</MenuText>
            </MenuItem> */}
            {/* <MenuAction
              disabled={isDisabled || readOnly}
              handleClick={() => {}}
              icon={'delete'}
              text={t('SOLVER.options.delete')}
            /> */}
          </Menu>
        </FilterContainer>
        <List>
          <PerfectScrollbar
            option={perfectScrollConfig}
            containerRef={ref => {
              this._scrollRefY = ref;
            }}
          >
            <div>
              <FilterInputContainer in={showFilter}>
                <InputSearch>
                  <Input
                    type="text"
                    disableUnderline={true}
                    startAdornment={<SearchIcon>search</SearchIcon>}
                    placeholder={t('SEARCHENGINE')}
                    onChange={e => {
                      this.onFilter(e.target.value);
                    }}
                    inputRef={this.filter}
                    endAdornment={
                      !this.isEmpty() && (
                        <ClearButton onClick={this.clearFilter}>
                          <ClearIcon>highlight_off</ClearIcon>
                        </ClearButton>
                      )
                    }
                  />
                </InputSearch>
              </FilterInputContainer>
              {filteredRequests.map(request => (
                <SolverCard
                  key={request.id}
                  request={request}
                  active={request.id === active}
                  handleClick={handleClick}
                  action={action}
                  t={t}
                  handleCheckbox={this.handleCheckbox}
                  isSelected={this.isSelected(request.id)}
                />
              ))}
            </div>
          </PerfectScrollbar>
        </List>
      </Fragment>
    );
  }
}

SolverList.propTypes = {
  solverRequests: PropTypes.arrayOf(
    PropTypes.shape({
      crewGroupName: PropTypes.string.isRequired,
      elapsedTime: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      isEndorsed: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.object.isRequired,
    })
  ).isRequired,
  active: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  action: PropTypes.string,
  handleCompare: PropTypes.func.isRequired,
  handleSolverToCompare: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  handleCompareAll: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  solverScopes: PropTypes.shape([]).isRequired,
};

SolverList.defaultProps = {
  action: '',
  readOnly: false,
};

export default SolverList;
