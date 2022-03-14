import React from 'react';
import LoadingPage from 'react-loading-components';
import styled from 'styled-components';

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loading = () => (
  <Overlay>
    <LoadingPage type="rings" width={200} height={200} fill="#ed4d15" />
  </Overlay>
);

export default Loading;
