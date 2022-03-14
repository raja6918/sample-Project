import React from 'react';
import PropTypes from 'prop-types';

const InfoIcon = ({ width, height, fill, className, viewBox, style }) => (
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
        transform="translate(-628.000000, -324.000000)"
      >
        <g id="_icons/alert/info" transform="translate(628.000000, 324.000000)">
          <path
            d="M13,0 C5.824,0 0,5.824 0,13 C0,20.176 5.824,26 13,26 C20.176,26 26,20.176 26,13 C26,5.824 20.176,0 13,0 Z"
            id="Path"
            fill="#5098E7"
          />
          <circle
            id="Oval-Copy-11"
            stroke="#FFFFFF"
            strokeWidth="2.16666667"
            cx="13"
            cy="13"
            r="8.88333333"
          />
          <polygon
            id="Path"
            fill="#FFFFFF"
            fillRule="nonzero"
            transform="translate(13.000000, 8.666667) rotate(-180.000000) translate(-13.000000, -8.666667) "
            points="14.3 9.96666667 11.7 9.96666667 11.7 7.36666667 14.3 7.36666667"
          />
          <polygon
            id="Path"
            fill="#FFFFFF"
            fillRule="nonzero"
            transform="translate(13.000000, 15.600000) rotate(-180.000000) translate(-13.000000, -15.600000) "
            points="14.3 18.6333333 11.7 18.6333333 11.7 12.5666667 14.3 12.5666667"
          />
        </g>
      </g>
    </g>
  </svg>
);

InfoIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: 'none',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

InfoIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default InfoIcon;
