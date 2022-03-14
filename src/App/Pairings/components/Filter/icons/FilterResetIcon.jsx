import React from 'react';
import PropTypes from 'prop-types';

const FilterResetIcon = ({
  width,
  height,
  fill,
  className,
  viewBox,
  style,
}) => (
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
    <g id="Gantt" stroke="none" strokeWidth="1" fill={fill} fillRule="evenodd">
      <g
        id="01-Pairing-Selection"
        transform="translate(-1145.000000, -764.000000)"
        fill="#7C7D7E"
      >
        <g id="filters" transform="translate(1136.000000, 751.000000)">
          <g id="Group-4" transform="translate(9.000000, 13.000400)">
            <path
              d="M18.4798,10.8789 L17.9088,11.4509 L15.6408,9.1839 L13.3738,11.4509 L12.8008,10.8789 L15.0688,8.6109 L12.8008,6.3449 L13.3738,5.7729 L15.6408,8.0399 L17.9088,5.7729 L18.4798,6.3449 L16.2128,8.6109 L18.4798,10.8789 Z M15.6408,3.0429 C12.5658,3.0429 10.0728,5.5359 10.0728,8.6109 C10.0728,11.6869 12.5658,14.1799 15.6408,14.1799 C18.7158,14.1799 21.2088,11.6869 21.2088,8.6109 C21.2088,5.5359 18.7158,3.0429 15.6408,3.0429 L15.6408,3.0429 Z"
              id="Fill-1"
            />
            <path
              d="M7.0003,10 L7.0003,12 L10.2043,12 C9.7133,11.423 9.3473,10.747 9.1323,10 L7.0003,10 Z"
              id="Fill-5"
            />
            <path
              d="M2.9994,5 L2.9994,7 L9.1434,7 C9.3624,6.251 9.7354,5.574 10.2324,5 L2.9994,5 Z"
              id="Fill-3"
            />
            <polygon id="Fill-7" points="0 2 18 2 18 0 0 0" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

FilterResetIcon.defaultProps = {
  width: '24px',
  height: '24px',
  fill: '#000',
  className: '',
  viewBox: '0 0 22 12',
  style: {},
};

FilterResetIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default FilterResetIcon;
