import React from 'react';
import { t } from 'i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getExpectionMetaInfo } from './constants';
import { getItems } from './multiDimensionalTableUtils';
import ColorAutocompleteBox from '../../../../../../../components/ColorAutocompleteBox/ColorAutocompleteBox';

const Panel = styled.div`
  position: 'relative';
  margin: 20px 0;
  padding: 0 20px;
  width: 242px;
  border-right: 1px solid #b2b2b2;

  .MuiFormControlLabel-root {
    padding: 5px 10px 5px 10px;
  }

  .MuiTypography-body1 {
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 16px;
  }

  .combo-wrapper {
    padding-left: 30px;

    & > div {
      width: 145px;
      margin: 15px 0;
      margin-top: 5px;
    }
  }
`;

const Title = styled.div`
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  color: #333333;
`;

const ExceptionPanel = ({
  exceptions,
  exceptionState,
  dynamicEnumData,
  exceptionsSelected,
  handleStateChange,
  handleExceptionsSelectedChange,
}) => {
  return (
    <Panel>
      <Title>{t('DATA.rules.ruleTable.view')}</Title>

      <RadioGroup
        aria-label="exceptions-panel"
        name="exceptions-panel"
        value={exceptionState}
        onChange={event => handleStateChange(event.target.value)}
      >
        <FormControlLabel
          value="general"
          control={<Radio size="small" />}
          label={t('DATA.rules.ruleTable.general')}
        />
        <FormControlLabel
          value="exceptions"
          control={<Radio size="small" />}
          label={t('DATA.rules.ruleTable.exceptions')}
        />
      </RadioGroup>

      <div className="combo-wrapper">
        {exceptions.map((exception, index) => {
          const exceptionMetaInfo = getExpectionMetaInfo(exception.key);
          const items = getItems(
            dynamicEnumData[exception.key],
            exception.values,
            exceptionsSelected,
            exceptionMetaInfo
          );
          return (
            <ColorAutocompleteBox
              key={exception.key}
              width={145}
              options={items}
              disabled={exceptionState === 'general'}
              color={exceptionMetaInfo.color}
              placeholder={exception.placeholder}
              value={exceptionsSelected[exception.key]}
              onChange={value =>
                handleExceptionsSelectedChange(exception.key, value, index)
              }
            />
          );
        })}
      </div>
    </Panel>
  );
};

ExceptionPanel.propTypes = {
  exceptionState: PropTypes.string.isRequired,
  exceptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  dynamicEnumData: PropTypes.shape().isRequired,
  exceptionsSelected: PropTypes.shape().isRequired,
  handleStateChange: PropTypes.func.isRequired,
  handleExceptionsSelectedChange: PropTypes.func.isRequired,
};

export default ExceptionPanel;
