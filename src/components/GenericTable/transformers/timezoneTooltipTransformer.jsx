import React from 'react';
import Tooltip from '../../Tooltip';

const timezoneTooltipTransformer = time => {
  return (
    <Tooltip title={`${time} (Local Time)`}>
      <span>{`${time} (Z)`}</span>
    </Tooltip>
  );
};

export default timezoneTooltipTransformer;
