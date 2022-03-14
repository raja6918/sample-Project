import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {},
  tabsRoot: {},
  tabsIndicator: {
    backgroundColor: '#F66500',
  },
  tabRoot: {
    color: 'rgba(0, 0, 0, 0.87)',
    opacity: 1,
    minWidth: 72,
    lineHeight: 'inherit',
    fontSize: '0.8rem',
    padding: '6px 26px',

    '&:hover': {
      color: '#F66500',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#F66500',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#F66500',
    },
  },
  tabSelected: {},
});

class SierraTabs extends Component {
  generateTabs = tabsData => {
    const { classes } = this.props;
    const tabsComponents = tabsData.map(tab => {
      return (
        <Tab
          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          key={`tab-${tab.value}`}
          value={tab.value}
          label={tab.label}
        />
      );
    });
    return tabsComponents;
  };

  render() {
    const { tabs, classes, ...props } = this.props;
    const tabsComponents = this.generateTabs(tabs);
    return (
      <div className={classes.root}>
        <Tabs
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          {...props}
        >
          {tabsComponents}
        </Tabs>
      </div>
    );
  }
}

SierraTabs.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ).isRequired,
};

export default withStyles(styles)(SierraTabs);
