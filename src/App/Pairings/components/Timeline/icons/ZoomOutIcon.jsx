import React from 'react';
import PropTypes from 'prop-types';

const ZoomOutIcon = ({ width, height, fill, className, viewBox, style }) => (
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
    xmlSpace="preserve"
  >
    <defs>
      <polygon id="path-1" points="0 0 23 0 23 23 0 23" />
    </defs>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="icons/map/zoom-out" transform="translate(-1.500000, -1.500000)">
        <g transform="translate(6.000000, 6.000000)">
          <mask id="mask-2" fill="white">
            <use xlinkHref="#path-1" />
          </mask>
          <g id="Clip-2" />

          <path
            d="M11.5,20.6937244 C6.42305593,20.6937244 2.30627558,16.5769441 2.30627558,11.5 C2.30627558,6.42148704 6.42305593,2.30470668 11.5,2.30470668 C16.5769441,2.30470668 20.6937244,6.42148704 20.6937244,11.5 C20.6843111,16.5738063 16.5738063,20.6843111 11.5,20.6937244 L11.5,20.6937244 Z M0,11.5 C0,17.8508868 5.14911323,23 11.5,23 L20.6937244,23 C21.9676671,23 23,21.9676671 23,20.6937244 L23,11.5 C22.9905866,5.15225102 17.847749,0.00784447476 11.5,0 C5.14911323,0 0,5.14754434 0,11.5 Z M10.3547067,10.3547067 L5.75784447,10.3547067 L5.75784447,12.6452933 L10.3547067,12.6452933 L12.6452933,12.6452933 L17.2421555,12.6452933 L17.2421555,10.3547067 L12.6452933,10.3547067 L10.3547067,10.3547067 Z"
            id="Fill-1"
            fill={fill}
            mask="url(#mask-2)"
          />
        </g>
      </g>
    </g>
  </svg>
);

ZoomOutIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: '#000',
  className: '',
  viewBox: '0 0 32 32',
  style: {},
};

ZoomOutIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

export default ZoomOutIcon;
