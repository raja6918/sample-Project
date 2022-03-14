import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { addPaneFocusClass } from './utils';

const ProfileBTN = styled(IconButton)`
  width: auto;
  color: #fff;
  border-radius: 0;
  padding-right: 0;
  & .MuiIcon-root {
    padding-left: 5px;
  }
`;

const MenuProfile = styled(Menu)`
  & .MuiList-padding {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  & .MuiPaper-root {
    height: 186px;
    width: 256px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    justifycontent: 'flex-end';
  }
  & .MuiMenuItem-root {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.67);
  }
  & .MuiListItem-root {
    justify-content: flex-end;
  }
  .MuiList-root span:first-of-type {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 22px;
    padding-left: 28px;
    color: rgba(0, 0, 0, 0.67);
  }
`;

class Watermark extends Component {
  state = {
    anchorEl: null,
    selected: 'pairings',
  };

  componentDidUpdate(prevProps) {
    if (prevProps.ganttRef !== this.props.ganttRef && this.props.ganttRef) {
      const { ganttRef } = this.props;
      ganttRef.shadowRoot
        .querySelector(`.gantt_pane_icons_wrap`)
        .addEventListener('focus', this.attachFocusClass.bind(this));
    }

    if (prevProps.render !== this.props.render) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selected:
          this.props.render === 'empty' ? 'pairings' : this.props.render,
      });
    }
  }

  componentWillUnmount() {
    if (this.props.ganttRef) {
      this.props.ganttRef.shadowRoot
        .querySelector(`.gantt_pane_icons_wrap`)
        .removeEventListener('focus', this.attachFocusClass.bind(this));
    }
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  attachFocusClass = e => {
    if (this.props.ganttRef) {
      const { ganttRef } = this.props;
      const ganttContainer = ganttRef.shadowRoot.querySelector(
        `.gantt-container`
      );

      if (!ganttContainer.classList.contains('minimized')) {
        addPaneFocusClass(ganttRef);
      }
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMenuItem = selected => {
    this.setState({ anchorEl: null, selected });
  };

  getActivityCount = () => {
    const { countMap } = this.props;

    const pairingsCount =
      countMap && countMap.idRowMap && countMap.idRowMap.pairings
        ? Object.keys(countMap.idRowMap.pairings).length
        : 0;
    const flightsCount =
      countMap && countMap.idRowMap && countMap.idRowMap.legs
        ? Object.keys(countMap.idRowMap.legs).length
        : 0;
    const internalDeadheadCount =
      countMap && countMap.idRowMap && countMap.idRowMap.dhi
        ? Object.keys(countMap.idRowMap.dhi).length
        : 0;
    const commercialCount =
      countMap && countMap.idRowMap && countMap.idRowMap.cml
        ? Object.keys(countMap.idRowMap.cml).length
        : 0;
    const totalActFltNb =
      countMap && countMap.count.totalActFltNb
        ? countMap.count.totalActFltNb
        : 0;
    const totalDhdFltNb =
      countMap && countMap.count.totalDhdFltNb
        ? countMap.count.totalDhdFltNb
        : 0;
    const totalCmlFltNb =
      countMap && countMap.count.totalCmlFltNb
        ? countMap.count.totalCmlFltNb
        : 0;

    return {
      pairingsCount,
      flightsCount,
      internalDeadheadCount,
      commercialCount,
      totalActFltNb,
      totalDhdFltNb,
      totalCmlFltNb,
    };
  };

  renderCount = type => {
    const { t, render, totalPairingNb, totalFlightNb } = this.props;

    const {
      pairingsCount,
      flightsCount,
      internalDeadheadCount,
      commercialCount,
      totalActFltNb,
      totalDhdFltNb,
      totalCmlFltNb,
    } = this.getActivityCount();

    const totalPairingCount = Math.max(pairingsCount, totalPairingNb);

    switch (type) {
      case 'pairings': {
        return `${pairingsCount}${
          render === 'pairings' ? '/' + totalPairingCount : ''
        } ${t('PAIRINGS.paneActionBar.titles.pairings')}`;
      }
      case 'legs': {
        return `${flightsCount + internalDeadheadCount + commercialCount}${
          render === 'legs' ? '/' + totalFlightNb : ''
        } ${t('PAIRINGS.paneActionBar.titles.flights')}`;
      }
      case 'operating': {
        return `${flightsCount} ${
          render === 'legs' ? '/' + totalActFltNb : ''
        } ${t('PAIRINGS.paneActionBar.titles.operating')}`;
      }
      case 'dhi': {
        return `${internalDeadheadCount} ${
          render === 'legs' ? '/' + totalDhdFltNb : ''
        } ${t('PAIRINGS.paneActionBar.titles.dhi')}`;
      }
      case 'cml': {
        return `${commercialCount} ${
          render === 'legs' ? '/' + totalCmlFltNb : ''
        } ${t('PAIRINGS.paneActionBar.titles.cml')}`;
      }
      default: {
        return '';
      }
    }
  };

  render() {
    const { minimized, timelineName } = this.props;

    const { anchorEl } = this.state;
    const { selected } = this.state;
    const open = Boolean(anchorEl);

    return (
      <span
        slot="timeline-label"
        className={minimized ? 'timeline-label-minimized' : 'timeline-label'}
      >
        <span className="label-left">{timelineName}</span>{' '}
        <span className="label-right">
          {this.renderCount(selected)}
          <ProfileBTN
            open={open ? 'menu-appbar1' : null}
            onClick={this.handleMenu}
            color="inherit"
            disabled={false}
          >
            <Icon>keyboard_arrow_down</Icon>
          </ProfileBTN>
          <MenuProfile
            id="menu-appbar1"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <span>Choose activity count to display</span>
            <MenuItem
              onClick={() => this.handleMenuItem('pairings')}
              disableRipple
            >
              {this.renderCount('pairings')}
            </MenuItem>
            <MenuItem onClick={() => this.handleMenuItem('legs')} disableRipple>
              {this.renderCount('legs')}
            </MenuItem>
            <MenuItem
              onClick={() => this.handleMenuItem('operating')}
              disableRipple
            >
              {this.renderCount('operating')}
            </MenuItem>
            <MenuItem onClick={() => this.handleMenuItem('dhi')} disableRipple>
              {this.renderCount('dhi')}
            </MenuItem>
            <MenuItem onClick={() => this.handleMenuItem('cml')} disableRipple>
              {this.renderCount('cml')}
            </MenuItem>
          </MenuProfile>
        </span>
      </span>
    );
  }
}

Watermark.propTypes = {
  t: PropTypes.func.isRequired,
  minimized: PropTypes.bool.isRequired,
  totalPairingNb: PropTypes.number.isRequired,
  totalFlightNb: PropTypes.number.isRequired,
  timelineName: PropTypes.string.isRequired,
  render: PropTypes.string,
  ganttRef: PropTypes.shape(),
  countMap: PropTypes.shape().isRequired,
};

Watermark.defaultProps = {
  render: null,
  ganttRef: null,
};

export default Watermark;
