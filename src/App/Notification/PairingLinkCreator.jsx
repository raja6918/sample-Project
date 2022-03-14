import React from 'react';
import PropTypes from 'prop-types';

const PairingLinkCreator = props => {
  const label = props.children ? props.children[0].props.value : null;
  return (
    <span
      onClick={() => window.location.reload()}
      style={{
        color: '#0a75c2',
        fontSize: '12px',
        cursor: 'pointer',
        textAlign: 'right',
        marginLeft: '24px',
      }}
    >
      {label}
    </span>
  );
};

PairingLinkCreator.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.object),
};

export default PairingLinkCreator;
