import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const GetEditIcon = props => {
  const { fill, viewBox } = props;
  return (
    <SvgIcon {...props} viewBox={viewBox}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-770.000000, -492.000000)" fill={fill}>
          <g transform="translate(757.000000, 427.000000)">
            <g transform="translate(13.000000, 65.000000)">
              <path
                fill={fill}
                d="M7.062,5.662 L8.466,5.662 L8.466,4.258 L7.062,4.258 L7.062,5.662 Z M7.062,11.279 L8.466,11.279 L8.466,7.066 L7.062,7.066 L7.062,11.279 Z M14.786,7.769 C14.786,3.893 11.64,0.747 7.764,0.747 C3.888,0.747 0.743,3.893 0.743,7.769 C0.743,11.645 3.888,14.79 7.764,14.79 C7.768,14.79 7.772,14.79 7.776,14.79 L14.785,7.78 C14.785,7.777 14.786,7.773 14.786,7.769 L14.786,7.769 Z"
              />
              <path
                fill={fill}
                d="M21.047,9.2165 C21.327,8.9355 21.327,8.4835 21.047,8.2025 L19.364,6.5205 C19.084,6.2395 18.631,6.2395 18.351,6.5205 L17.035,7.8365 L19.731,10.5315 L21.047,9.2165 Z M8.314,16.5565 L8.314,19.2535 L11.01,19.2535 L18.962,11.3015 L16.266,8.6055 L8.314,16.5565 Z"
              />
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

GetEditIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.shape({}),
};

GetEditIcon.defaultProps = {
  width: '100%',
  height: '100%',
  fill: '#000',
  className: '',
  viewBox: '0 0 22 20',
  style: {},
};

export default GetEditIcon;
