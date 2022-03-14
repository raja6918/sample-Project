import React from 'react';
import PropTypes from 'prop-types';

const CrewBasesIcon = ({ width, height, fill, className, viewBox, style }) => (
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
      id="Data-Home-Icons"
      stroke="none"
      strokeWidth="1"
      fill={fill}
      fillRule="evenodd"
    >
      <g
        id="Crew-Bases---Icon-Concepts"
        transform="translate(-273.000000, -326.000000)"
      >
        <g id="Group-12" transform="translate(273.000000, 326.000000)">
          <path
            d="M14.5,0 C6.48357143,0 0,6.26 0,14 C0,24.5 14.5,40 14.5,40 C14.5,40 29,24.5 29,14 C29,6.26 22.5164286,0 14.5,0 Z M14.5,25.2173913 C7.99675,25.2173913 2.71875,20.1530435 2.71875,13.9130435 C2.71875,7.67304348 7.99675,2.60869565 14.5,2.60869565 C21.00325,2.60869565 26.28125,7.67304348 26.28125,13.9130435 C26.28125,20.1530435 21.00325,25.2173913 14.5,25.2173913 Z"
            id="Shape"
            fillRule="nonzero"
          />
          <polygon
            id="Path"
            points="4 12.3347216 7.99795091 12.3305568 7.99795091 20.9916704 13.3326725 21 13.3368373 16.652784 15.9979509 16.652784 15.9937861 20.9916704 21.328541 21 21.3243762 12.3305568 25.3222938 12.3305568 14.6611802 7"
          />
        </g>
      </g>
    </g>
  </svg>
);

CrewBasesIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: '#000',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

CrewBasesIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default CrewBasesIcon;
