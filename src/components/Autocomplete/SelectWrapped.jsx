import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Creatable } from 'react-select';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import SierraTooltip from '../../_shared/components/SierraTooltip';

import Option from './Option';

class SelectWrapper extends Component {
  render() {
    const { createComponent, createLabel, t, isToolTip, ...other } = this.props;

    if (createComponent) {
      return (
        <Creatable
          optionComponent={Option}
          promptTextCreator={value =>
            `${
              createLabel ? createLabel : t('GLOBAL.form.capCreate')
            } '${value}'`
          }
          arrowRenderer={arrowProps => {
            return arrowProps.isOpen ? (
              <Icon>arrow_drop_up</Icon>
            ) : (
              <Icon>arrow_drop_down</Icon>
            );
          }}
          clearRenderer={() => <Icon>clear</Icon>}
          valueComponent={valueProps => {
            const { children } = valueProps;

            return <div>{children}</div>;
          }}
          {...other}
        />
      );
    } else {
      return (
        <Select
          optionComponent={Option}
          noResultsText={
            <Typography>{t('GLOBAL.dataNotFound.noResults')}</Typography>
          }
          arrowRenderer={arrowProps => {
            return arrowProps.isOpen ? (
              <Icon>arrow_drop_up</Icon>
            ) : (
              <Icon>arrow_drop_down</Icon>
            );
          }}
          clearRenderer={() => <Icon>clear</Icon>}
          valueComponent={valueProps => {
            const { children } = valueProps;

            return isToolTip ? (
              <SierraTooltip
                position="bottom"
                html={<p style={{ padding: '20px' }}>{children}</p>}
              >
                <div>{`${children.substr(0, 30)}...`}</div>
              </SierraTooltip>
            ) : (
              <div>{children}</div>
            );
          }}
          {...other}
        />
      );
    }
  }
}

SelectWrapper.propTypes = {
  createComponent: PropTypes.bool.isRequired,
  createLabel: PropTypes.string,
  t: PropTypes.func.isRequired,
  isToolTip: PropTypes.bool,
};

SelectWrapper.defaultProps = {
  createLabel: '',
  isToolTip: false,
};
export default SelectWrapper;
