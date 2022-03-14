import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledMessage = styled.div`
  position: relative;
  margin: 90px auto;
  text-align: center;
  color: rgba(0, 0, 0, 0.54);
`;

const DataNotFound = ({ text, style }) => (
  <StyledMessage style={style}>
    <p>{text}</p>
  </StyledMessage>
);

DataNotFound.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.shape({}),
};

DataNotFound.defaultProps = {
  style: {},
};

export default DataNotFound;
