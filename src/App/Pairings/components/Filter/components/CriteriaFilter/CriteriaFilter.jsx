import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Menu } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import CriteriaFilterSub from './CriteriaFilterSub';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    PaperProps={{
      style: {
        width: 180,
        color: 'rgba(0, 0, 0, 0.67)',
      },
    }}
    {...props}
  />
));

const CriteriaButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  border-style: solid;
  border-width: 0 0 1px 0;
  border-bottom-color: #717171;
  cursor: pointer;
  width: 127px;
  background: transparent;
  color: #717171;
  text-align: left;
  outline: none;

  &:hover {
    border-bottom-color: #000000;
    border-width: 0 0 2px 0;
  }
  & span {
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    font-weight: 500;
  }
`;

class CriteriaFilter extends Component {
  state = {
    anchorEl: null,
    subMenuOpen: null,
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSubMenuOpen = id => {
    this.setState({ subMenuOpen: id });
  };

  handleSubMenuClose = () => {
    this.setState({ subMenuOpen: null });
  };

  render() {
    const { categories, t, getfilteredCriteria } = this.props;
    const { anchorEl, subMenuOpen } = this.state;
    return (
      <div>
        <CriteriaButton onClick={this.handleMenuClick}>
          <span>{t('FILTER.form.criteria')}</span>
          {anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </CriteriaButton>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
        >
          {categories.map(catElement => (
            <CriteriaFilterSub
              t={t}
              id={catElement.categoryId}
              key={catElement.categoryId}
              catElement={catElement}
              subMenuOpen={subMenuOpen}
              getfilteredCriteria={getfilteredCriteria}
              handleClose={this.handleMenuClose}
              handleSubMenuOpen={this.handleSubMenuOpen}
              handleSubMenuClose={this.handleSubMenuClose}
            />
          ))}
        </StyledMenu>
      </div>
    );
  }
}

CriteriaFilter.propTypes = {
  t: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getfilteredCriteria: PropTypes.func.isRequired,
};

export default CriteriaFilter;
