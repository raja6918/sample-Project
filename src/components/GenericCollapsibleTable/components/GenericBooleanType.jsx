import React from 'react';
import PropTypes from 'prop-types';
import {
  SelectInput,
  GenericSwitchField,
} from '../../../components/GenericCollapsibleTable/components';

const GenericBooleanType = props => {
  if (props.data.switch) {
    return <GenericSwitchField {...props} />;
  } else {
    return <SelectInput {...props} />;
  }
};

GenericBooleanType.propTypes = {
  data: PropTypes.shape({ switch: PropTypes.bool }).isRequired,
};

export default GenericBooleanType;
