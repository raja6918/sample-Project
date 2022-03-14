import React from 'react';
import PropTypes from 'prop-types';

const UnknownIcon = ({ width, height, fill, className, viewBox, style }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
    style={style}
  >
    <g
      id="Import-datas"
      stroke="none"
      strokeWidth="1"
      fill={fill}
      fillRule="evenodd"
    >
      <g
        id="03-Import-Data_home-Popin_select-Dropdown_select-Copy-2"
        transform="translate(-456.000000, -420.000000)"
        fill={fill}
        fillRule="nonzero"
      >
        <g id="Dialog" transform="translate(360.000000, 309.000000)">
          <g id="dialog-template">
            <g id="Group-10" transform="translate(24.000000, 105.000000)">
              <g
                id="Dropdown-static"
                transform="translate(12.000000, 6.000000)"
              >
                <g id="Group-15" transform="translate(60.000000, 0.000000)">
                  <polygon id="Path" points="10 28 6 28 6 24 10 24" />
                  <path
                    d="M14.14,12.5 L12.34,14.34 C10.9,15.8 10,17 10,20 L6,20 L6,19 C6,16.8 6.9,14.8 8.34,13.34 L10.82,10.82 C11.56,10.1 12,9.1 12,8 C12,5.8 10.2,4 8,4 C5.8,4 4,5.8 4,8 L0,8 C0,3.58 3.58,0 8,0 C12.42,0 16,3.58 16,8 C16,9.76 15.28,11.36 14.14,12.5 Z"
                    id="Path"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

UnknownIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: '#000',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

UnknownIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default UnknownIcon;
