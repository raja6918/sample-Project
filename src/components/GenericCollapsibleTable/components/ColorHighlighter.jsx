import React from 'react';
import PropTypes from 'prop-types';

const ColorHighlighter = ({ highlighter, value, data, style }) => {
  const customeStyle = highlighter(value, data);
  return <span style={customeStyle ? style : {}}>{value}</span>;
};

ColorHighlighter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  data: PropTypes.shape().isRequired,
  style: PropTypes.shape(),
  highlighter: PropTypes.func,
};

ColorHighlighter.defaultProps = {
  style: { color: '#FF650C' },
  highlighter: () => false,
};

export default ColorHighlighter;
