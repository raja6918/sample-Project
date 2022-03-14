import React from 'react';
import className from 'classnames';
import PropTypes from 'prop-types';
import Popper from '@material-ui/core/Popper';

class PairingToolbarItem extends React.Component {
  state = {
    open: false,
    anchorEl: null,
  };

  handleOnMouseEnter = event => {
    const { open } = this.state;
    if (!open) {
      this.setState({ open: true, anchorEl: event.currentTarget });
    }
  };

  handleOnMouseLeave = () => {
    this.setState({ open: false, anchorEl: null });
  };

  generateSubmenu = submenu =>
    submenu.map((item, idx) => (
      <span className="pairing-toolbar-subitem" key={`subitem-${idx}`}>
        <i className="material-icons">{item.icon}</i>
        <span className="menu-text">{item.text}</span>
      </span>
    ));

  render() {
    const {
      t,
      bottom,
      pairing,
      menuItem,
      onAlertSelect,
      onAlertClear,
      openRuleEditDialog,
    } = this.props;
    const { open, anchorEl } = this.state;
    const menuItemProps = { ...menuItem.props };
    const submenu = menuItem.items;
    const Component = menuItem.component;

    /* If the menu contains a sub-menu, add these listeners to open it */
    if (submenu) {
      menuItemProps.onMouseEnter = this.handleOnMouseEnter;
      menuItemProps.onMouseLeave = this.handleOnMouseLeave;
    }

    /* If the menu contains a component, add these listeners to open it */
    if (Component) {
      menuItemProps.onMouseEnter = this.handleOnMouseEnter;
      menuItemProps.onMouseLeave = this.handleOnMouseLeave;
    }

    const submenuClassName = className({
      'pairing-toolbar-submenu': true,
      open: open,
    });

    return (
      <span
        style={{ background: this.state.anchorEl ? '#000' : '' }}
        className="pairing-toolbar-item"
        {...menuItemProps}
      >
        <i className="material-icons">{menuItem.icon}</i>
        <span className="menu-text">{menuItem.text}</span>
        {submenu && (
          <React.Fragment>
            <i className="material-icons expand">keyboard_arrow_down</i>
            <span className={submenuClassName}>
              {this.generateSubmenu(submenu)}
            </span>
          </React.Fragment>
        )}
        {Component && (
          <React.Fragment>
            <i className="material-icons expand">keyboard_arrow_down</i>
            <Popper
              open={open}
              anchorEl={anchorEl}
              style={{ zIndex: 1101 }}
              placement={bottom ? 'bottom-start' : 'top-start'}
            >
              <Component
                t={t}
                pairing={pairing}
                onAlertSelect={onAlertSelect}
                onAlertClear={onAlertClear}
                openRuleEditDialog={openRuleEditDialog}
              />
            </Popper>
          </React.Fragment>
        )}
      </span>
    );
  }
}

PairingToolbarItem.propTypes = {
  t: PropTypes.func.isRequired,
  bottom: PropTypes.bool.isRequired,
  pairing: PropTypes.shape({}).isRequired,
  menuItem: PropTypes.shape({}).isRequired,
  onAlertSelect: PropTypes.func.isRequired,
  onAlertClear: PropTypes.func.isRequired,
  openRuleEditDialog: PropTypes.func.isRequired,
};

export default PairingToolbarItem;
