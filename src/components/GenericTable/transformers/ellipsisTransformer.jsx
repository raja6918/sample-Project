import React from 'react';
import './ellipsisTransformer.scss';
import OverflowTip from './OverflowTip';

const ellipsisTransformer = (text, tooltipStyle = {}, maxWidth = '200px') => {
  return (
    <OverflowTip
      tooltipStyle={tooltipStyle}
      value={text}
      content={text}
      maxWidth={maxWidth}
    />
  );
};

export default ellipsisTransformer;
