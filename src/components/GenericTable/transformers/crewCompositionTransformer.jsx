import React from 'react';
import Tooltip from '../../Tooltip';

const crewCompositionTransformer = crewComposition => {
  let quantity = '';
  let codes = '';

  crewComposition.forEach(position => {
    quantity += quantity === '' ? position.quantity : `, ${position.quantity}`;
    codes +=
      codes === ''
        ? `${position.quantity} ${position.positionCode}`
        : `, ${position.quantity} ${position.positionCode}`;
  });

  return (
    <Tooltip title={codes}>
      <span>{quantity}</span>
    </Tooltip>
  );
};

export default crewCompositionTransformer;
