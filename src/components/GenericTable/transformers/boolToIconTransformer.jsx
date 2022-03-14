import React from 'react';
import Icon from './../../Icon';

const boolToIconTransformer = iconName => boolValue => {
  if (boolValue) {
    return <Icon margin={'0'}>{iconName}</Icon>;
  } else {
    return null;
  }
};

export default boolToIconTransformer;
