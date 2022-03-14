import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import MenuItem from './MenuItem';
import MenuText from './MenuText';

const MenuAction = ({ handleClick, icon, text, disabled, svgIcon }) => {
  return (
    <MenuItem disabled={disabled} onClick={handleClick}>
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

MenuAction.propTypes = {
  handleClick: PropTypes.func,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  svgIcon: PropTypes.func,
};

MenuAction.defaultProps = {
  svgIcon: undefined,
  handleClick: () => {},
  text: '',
  disabled: false,
};

export default MenuAction;
