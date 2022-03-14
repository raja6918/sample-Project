import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { formatVersionDate } from '../utils/utils';

const VersionDiv = styled.div`
  font-size: 13px;
  margin: 10px 0px;

  & p.name {
    color: #000000;
    text-align: left;
    margin: 0px;
    padding: 2px;
    line-height: 13px;
  }

  & p.data {
    color: #7e7e7e;
    text-align: left;
    margin: 0px;
    padding: 2px;
    line-height: 13px;
  }
`;

class VersionsRadioGroup extends Component {
  VersionData = (data, key) => {
    const { t, dataName } = this.props;
    const { dateString, timeString } = formatVersionDate(data.creationTime);

    const label = (
      <VersionDiv>
        <p className="name">{`${dataName} ${t('DATA.card.version')} ${
          data.version
        }`}</p>
        <p className="data">{`${t('DATA.updateModal.importedBy')} ${
          data.userDisplayName
        }`}</p>
        <p className="data">{`${dateString} ${t(
          'DATA.updateModal.at'
        )} ${timeString}`}</p>
      </VersionDiv>
    );

    return (
      <FormControlLabel
        key={key}
        value={String(data.id)}
        control={
          <Radio
            style={{ padding: '9px' }}
            disableRipple={true}
            color="secondary"
          />
        }
        label={label}
      />
    );
  };

  render() {
    const { handleChange, versions, dataType, version } = this.props;

    return (
      <RadioGroup
        aria-label={dataType}
        name={dataType}
        value={version}
        onChange={handleChange}
        className="radiogroup"
      >
        {versions.map((v, key) => {
          return this.VersionData(v, key);
        })}
      </RadioGroup>
    );
  }
}

VersionsRadioGroup.propTypes = {
  t: PropTypes.func.isRequired,
  dataName: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(PropTypes.shape()),
  handleChange: PropTypes.func.isRequired,
  dataType: PropTypes.string,
  version: PropTypes.string.isRequired,
};

VersionsRadioGroup.defaultProps = {
  versions: [],
  dataType: 'versions',
};

export default VersionsRadioGroup;
