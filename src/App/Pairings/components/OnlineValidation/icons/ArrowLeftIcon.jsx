import React from 'react';
import PropTypes from 'prop-types';

const ArrowLeftIcon = ({ width, height, fill, className, viewBox, style }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
    style={style}
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    xmlSpace="preserve"
  >
    <g
      id="_icons/arrow_left_alt-24px"
      stroke="none"
      strokeWidth="1"
      fill={fill}
      fillRule="evenodd"
    >
      <polygon
        id="Path"
        fill="#FFFFFF"
        fillRule="nonzero"
        transform="translate(8.000000, 4.000000) rotate(-180.000000) translate(-8.000000, -4.000000) "
        points="12.01 3 4.4408921e-15 3 4.4408921e-15 5 12.01 5 12.01 8 16 4 12.01 -1.16351373e-13"
      />
    </g>
  </svg>
);

ArrowLeftIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: 'none',
  className: '',
  viewBox: '0 0 16 8',
  style: {},
};

ArrowLeftIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default ArrowLeftIcon;
