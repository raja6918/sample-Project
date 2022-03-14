import React from 'react';
import PropTypes from 'prop-types';

const ErrorIcon = ({ width, height, fill, className, viewBox, style }) => (
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
      id="🚫-Alert-notification"
      stroke="none"
      strokeWidth="1"
      fill={fill}
      fillRule="evenodd"
    >
      <g
        id="1---Pairing-Error-zoom-out"
        transform="translate(-221.000000, -386.000000)"
      >
        <g
          id="_icons/alert/error"
          transform="translate(221.000000, 386.000000)"
        >
          <path
            d="M13,0 C5.824,0 0,5.824 0,13 C0,20.176 5.824,26 13,26 C20.176,26 26,20.176 26,13 C26,5.824 20.176,0 13,0 Z"
            id="Path-Copy-4"
            fill="#D10000"
            fillRule="nonzero"
          />
          <circle
            id="Oval-Copy-11"
            stroke="#FFFFFF"
            strokeWidth="2.16666667"
            cx="13"
            cy="13"
            r="8.88333333"
          />
          <line
            x1="7.58333333"
            y1="11.9166667"
            x2="18.4166667"
            y2="14.0833333"
            id="Line-4-Copy-2"
            stroke="#FFFFFF"
            strokeWidth="2.16666667"
            strokeLinecap="square"
            transform="translate(13.000000, 13.000000) rotate(33.690068) translate(-13.000000, -13.000000) "
          />
          <line
            x1="7.58333333"
            y1="11.9166667"
            x2="18.4166667"
            y2="14.0833333"
            id="Line-4-Copy-2"
            stroke="#FFFFFF"
            strokeWidth="2.16666667"
            strokeLinecap="square"
            transform="translate(13.000000, 13.000000) scale(-1, 1) rotate(33.690068) translate(-13.000000, -13.000000) "
          />
        </g>
      </g>
    </g>
  </svg>
);

ErrorIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: 'none',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

ErrorIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default ErrorIcon;
