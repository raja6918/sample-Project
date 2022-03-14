import React from 'react';
import PropTypes from 'prop-types';

const ZoomMaxInIcon = ({ width, height, fill, className, viewBox, style }) => (
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
    <g transform="translate(-1235.000000, -803.000000)" fill={fill}>
      <g transform="translate(1126.000000, 800.000000)">
        <g transform="translate(108.000000, 3.000000)">
          <g transform="translate(16.500000, 16.500000) rotate(-45.000000) translate(-16.500000, -16.500000) translate(5.000000, 5.000000)">
            <path
              id="Fill-1"
              d="M11.499303,6.09012121 L15.5712467,2.01981818 L13.5359719,8.8817842e-16 L11.499303,2.01981818 L9.46402812,0 L7.42875326,2.01981818 L11.499303,6.09012121 Z M11.5,14.0502525 C12.8807119,14.0502525 14,12.9309644 14,11.5502525 C14,10.1695407 12.8807119,9.05025253 11.5,9.05025253 C10.1192881,9.05025253 9,10.1695407 9,11.5502525 C9,12.9309644 10.1192881,14.0502525 11.5,14.0502525 Z M23,13.5351515 L20.9786654,11.5013939 L23,9.46484848 L20.9786654,7.42969697 L16.9095097,11.5013939 L20.9786654,15.570303 L23,13.5351515 Z M6.09188436,11.5013939 L2.02272865,7.42969697 L0,9.46484848 L2.02272865,11.5013939 L-8.8817842e-16,13.5351515 L2.02272865,15.570303 L6.09188436,11.5013939 Z M11.499303,20.9773939 L13.5359719,23 L15.5712467,20.9773939 L11.499303,16.9070909 L7.42875326,20.9773939 L9.46402812,23 L11.499303,20.9773939 Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

ZoomMaxInIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: '#000',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

ZoomMaxInIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default ZoomMaxInIcon;
