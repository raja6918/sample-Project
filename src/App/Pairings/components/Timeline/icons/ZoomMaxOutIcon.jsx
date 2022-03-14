import React from 'react';
import PropTypes from 'prop-types';

const ZoomMaxOutIcon = ({ width, height, fill, className, viewBox, style }) => (
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
    <g transform="translate(-1131.000000, -802.000000)" fill={fill}>
      <g transform="translate(1126.000000, 800.000000)">
        <g transform="translate(18.00000, 18.00000) rotate(-45.000000) translate(-18.00000, -18.00000) translate(7.000000, 7.000000)">
          <path d="M13.500697,0.585786438 L9.42875326,4.65608947 L11.4640281,6.67590765 L13.500697,4.65608947 L15.5359719,6.67590765 L17.5712467,4.65608947 L13.500697,0.585786438 Z M13.5,16.0502525 C14.8807119,16.0502525 16,14.9309644 16,13.5502525 C16,12.1695407 14.8807119,11.0502525 13.5,11.0502525 C12.1192881,11.0502525 11,12.1695407 11,13.5502525 C11,14.9309644 12.1192881,16.0502525 13.5,16.0502525 Z M20.3237232,11.4648485 L22.3450579,13.4986061 L20.3237232,15.5351515 L22.3450579,17.570303 L26.4142136,13.4986061 L22.3450579,9.42969697 L20.3237232,11.4648485 Z M0.585786438,13.4986061 L4.65494214,17.570303 L6.67767079,15.5351515 L4.65494214,13.4986061 L6.67767079,11.4648485 L4.65494214,9.42969697 L0.585786438,13.4986061 Z M13.500697,22.3439105 L11.4640281,20.3213045 L9.42875326,22.3439105 L13.500697,26.4142136 L17.5712467,22.3439105 L15.5359719,20.3213045 L13.500697,22.3439105 Z" />
        </g>
      </g>
    </g>
  </svg>
);

ZoomMaxOutIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: '#000',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

ZoomMaxOutIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default ZoomMaxOutIcon;
