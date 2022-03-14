import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Checkbox, Input } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CloseIcon from '@material-ui/icons/Close';
import { perfectScrollConfig } from '../../../../../../utils/common';

import {
  InputSearch,
  SearchIcon,
  ClearButton,
  ClearIcon,
} from '../../../../../../components/FilterInput';

const StyledSubComponent = styled.div`
  width: 180px;
  background: #ffffff;
  border-radius: 3px;
  outline: none;
  white-space: nowrap;

  & > div:first-child {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid rgba(151, 151, 151, 0.24);
  }

  & > div:nth-child(2) {
    & > div:first-child {
      max-height: ${props => props.popupHeight + 'px'};
      & > div {
        display: flex;
        align-items: flex-start;
        padding: 4px 12px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.67);
        cursor: pointer;
        & > div {
          padding: 4px;
          white-space: normal;
          user-select: none;
        }
      }
      & > div:hover {
        background: #f5f5f5;
      }
    }
  }

  & > div:nth-child(3) {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 86px;
    border-top: 1px solid rgba(151, 151, 151, 0.24);
  }
`;

const AddButton = styled(Button)`
  width: 80px;
  height: 32px;
  border-radius: 2px;
  box-shadow: none;
  margin-top: 10px;
`;

const ClearAllButton = styled(Button)`
  text-transform: none;
  font-size: 12px;
  padding: 0;
  margin-bottom: 10px;

  &:hover {
    background-color: transparent;
  }
  & .MuiButton-startIcon {
    margin-right: 0px;
  }
`;

const StyledInputSearch = styled(InputSearch)`
  div {
    border: 1px solid rgba(0, 0, 0, 0.54);
  }
`;

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },
})(props => (
  <Menu
    MenuListProps={{ disablePadding: true }}
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '& .MuiSvgIcon-fontSizeSmall': {
      fontSize: '16px',
    },
    '& .MuiTypography-body1': {
      fontWeight: 'unset',
      fontSize: '14px',
      whiteSpace: 'normal',
    },
    '&:hover': {
      backgroundColor: '#F5F5F5 !important',
    },
  },
  selected: {
    backgroundColor: '#EBEBEB !important',
    fontWeight: '500 !important',
  },
}))(MenuItem);

class CriteriaFilterSub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredItems: [],
      selectedIds: [],
      anchorEl: null,
      filter: '',
      popupHeight: 253,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  popupTimer = null;

  componentDidMount() {
    this.setPopupHeight();
    document.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('resize', this.setPopupHeight);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('resize', this.setPopupHeight);
    clearTimeout(this.popupTimer);
    this.popupTimer = null;
  }

  setPopupHeight = () => {
    const windowHeight = document.documentElement.clientHeight;
    let popupHeight;
    switch (true) {
      case windowHeight >= 700:
        popupHeight = 253;
        break;
      case windowHeight < 700 && windowHeight >= 440:
        popupHeight = 200;
        break;
      case windowHeight < 440 && windowHeight >= 400:
        popupHeight = 150;
        break;
      case windowHeight < 400 && windowHeight >= 350:
        popupHeight = 100;
        break;
      case windowHeight < 350 && windowHeight >= 300:
        popupHeight = 75;
        break;
      case windowHeight < 300 && windowHeight >= 200:
        popupHeight = 30;
        break;
      case windowHeight < 200:
        popupHeight = 0;
        break;
      default:
        popupHeight = 253;
    }
    this.setState({ popupHeight });
  };

  handleClickOutside = event => {
    try {
      const mainMenu = document.getElementById('main-menu');
      const subMenu = document.querySelectorAll('.sub-menu');
      let subMenuContain = false;
      subMenu.forEach(elem => {
        if (elem.contains(event.target)) {
          subMenuContain = true;
        }
      });
      if (mainMenu.contains(event.target) || subMenuContain) {
        return;
      }
      this.handleMenuClose();
    } catch (error) {
      console.error(error);
    }
  };

  handleMenuClick = currentTarget => {
    const { id, handleSubMenuOpen } = this.props;
    this.setState({ anchorEl: currentTarget });
    this.handleClearFilter();
    handleSubMenuOpen(id);
  };

  handleMenuClose = () => {
    this.props.handleSubMenuClose();
  };

  handleAdd = e => {
    const {
      getfilteredCriteria,
      catElement,
      handleClose,
      handleSubMenuClose,
    } = this.props;
    getfilteredCriteria(this.state.filteredItems, catElement.categoryId);
    this.handleClearFilter();
    this.handleClearAll();
    handleSubMenuClose();
    handleClose();
    e.stopPropagation();
  };

  handleClearAll = () => {
    this.setState({ filteredItems: [], selectedIds: [] });
  };

  handleFilter = e => {
    this.setState({ filter: e.target.value });
  };

  handleClearFilter = () => {
    this.setState({ filter: '' });
  };

  toggleItems = (item, checked) => {
    if (checked) {
      this.setState(prevState => ({
        filteredItems: [...prevState.filteredItems, item],
        selectedIds: [...prevState.selectedIds, item.crId],
      }));
    } else {
      this.setState(prevState => ({
        filteredItems: prevState.filteredItems.filter(
          filteredItem => filteredItem.crId !== item.crId
        ),
        selectedIds: prevState.selectedIds.filter(id => id !== item.crId),
      }));
    }
  };

  handlePopupOnEnter = event => {
    const currentTarget = event.currentTarget;
    this.popupTimer = setTimeout(() => {
      this.handleMenuClick(currentTarget);
    }, 300);
  };

  handlePopupOnLeave = () => {
    clearTimeout(this.popupTimer);
    this.popupTimer = null;
  };

  render() {
    const { catElement, t, subMenuOpen, id } = this.props;
    const { selectedIds, filter, anchorEl, popupHeight } = this.state;

    const sortedCriteria = this.props.catElement.criteria.sort((a, b) => {
      const aValue = this.props.t(`FILTER.filterCriteria.criteria.${a.crKey}`);
      const bValue = this.props.t(`FILTER.filterCriteria.criteria.${b.crKey}`);
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });

    const localisedMenuItemName = t(
      `FILTER.filterCriteria.categories.${catElement.categoryKey}`
    );
    return (
      <div>
        <StyledMenuItem
          onClick={event => this.handleMenuClick(event.currentTarget)}
          onMouseEnter={this.handlePopupOnEnter}
          onMouseLeave={this.handlePopupOnLeave}
          selected={id === subMenuOpen}
          id="main-menu"
        >
          <ListItemText primary={localisedMenuItemName} />
          <ListItemIcon style={{ minWidth: '20px', color: '#3f3e3e' }}>
            <ArrowForwardIosIcon fontSize="small" />
          </ListItemIcon>
        </StyledMenuItem>
        <StyledMenu
          style={{ pointerEvents: 'none' }}
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={id === subMenuOpen}
        >
          <StyledSubComponent
            style={{ pointerEvents: 'auto' }}
            className="sub-menu"
            popupHeight={popupHeight}
          >
            <div>
              <StyledInputSearch>
                <Input
                  onKeyDown={e => e.stopPropagation()}
                  type="text"
                  disableUnderline={true}
                  startAdornment={<SearchIcon>search</SearchIcon>}
                  placeholder={t('SEARCHENGINE')}
                  onChange={this.handleFilter}
                  value={filter}
                  endAdornment={
                    filter && (
                      <ClearButton onClick={this.handleClearFilter}>
                        <ClearIcon>highlight_off</ClearIcon>
                      </ClearButton>
                    )
                  }
                />
              </StyledInputSearch>
            </div>
            <PerfectScrollbar option={perfectScrollConfig}>
              <div>
                {sortedCriteria.map(crElement => {
                  const localisedCriteriaName = t(
                    `FILTER.filterCriteria.criteria.${crElement.crKey}`
                  );
                  if (
                    localisedCriteriaName
                      .toLowerCase()
                      .includes(filter.toLowerCase()) ||
                    filter === ''
                  ) {
                    const isItemPresent = selectedIds.includes(crElement.crId);
                    return (
                      <div
                        key={crElement.crId}
                        onClick={() =>
                          this.toggleItems(crElement, !isItemPresent)
                        }
                        style={{
                          background: isItemPresent ? '#EBEBEB' : '',
                          fontWeight: isItemPresent ? 500 : '',
                        }}
                      >
                        <Checkbox checked={isItemPresent} />
                        <div>{localisedCriteriaName}</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </PerfectScrollbar>
            <div>
              <AddButton
                variant="contained"
                color="primary"
                onClick={this.handleAdd}
                disabled={selectedIds.length === 0}
              >
                {t('FILTER.pane.buttons.add')}
              </AddButton>
              <ClearAllButton
                disabled={selectedIds.length === 0}
                color="primary"
                size="small"
                startIcon={<CloseIcon />}
                disableRipple={true}
                disableFocusRipple={true}
                onClick={this.handleClearAll}
              >
                {t('FILTER.pane.buttons.clearAll')}
              </ClearAllButton>
            </div>
          </StyledSubComponent>
        </StyledMenu>
      </div>
    );
  }
}

CriteriaFilterSub.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  getfilteredCriteria: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  catElement: PropTypes.shape([]).isRequired,
  subMenuOpen: PropTypes.number,
  handleSubMenuOpen: PropTypes.func.isRequired,
  handleSubMenuClose: PropTypes.func.isRequired,
};

CriteriaFilterSub.defaultProps = {
  subMenuOpen: null,
};

export default CriteriaFilterSub;
