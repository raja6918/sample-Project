import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonMUI from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ReplayIcon from '@material-ui/icons/Replay';

const FormTitle = styled.div`
  display: flex;
  justify-content: space-between;
  & h2 {
    margin-top: 0px !important;
  }
`;

const LastFilterButton = styled(ButtonMUI)`
  text-transform: none;
  font-size: 12px;
  padding: 0;
  margin-bottom: 13.28px;
  margin-right: 15px;
  &:hover {
    background-color: transparent;
  }
  & .MuiButton-startIcon {
    margin-right: 0px;
  }
`;

const ClearAllButton = styled(ButtonMUI)`
  text-transform: none;
  font-size: 12px;
  padding: 0;
  margin-bottom: 13.28px;
  &:hover {
    background-color: transparent;
  }
  & .MuiButton-startIcon {
    margin-right: 0px;
  }
`;

const FormTitleLabel = styled.h2`
  font-style: ${props => (props.isFilterChanged ? 'italic' : 'normal')};
  font-weight: bold;
  font-size: 16px;
  color: ${props => (props.isFilterChanged ? '#7e7e7e' : '#000000')} !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 50%;
`;

const FormBodyTitle = ({
  t,
  type,
  formTitle,
  enableClearAll,
  handleClearAll,
  enableLastFilter,
  handleLastFilterApply,
  isFilterChanged,
}) => (
  <FormTitle>
    {!formTitle && <h2>{t(`FILTER.${type}`)}</h2>}
    {formTitle && (
      <FormTitleLabel isFilterChanged={isFilterChanged}>
        {formTitle}
      </FormTitleLabel>
    )}
    <div>
      <LastFilterButton
        disabled={!enableLastFilter}
        color="primary"
        startIcon={<ReplayIcon />}
        disableRipple={true}
        disableFocusRipple={true}
        onClick={handleLastFilterApply}
      >
        {t('FILTER.pane.buttons.lastFilter')}
      </LastFilterButton>
      <ClearAllButton
        disabled={!enableClearAll}
        color="primary"
        startIcon={<CloseIcon />}
        disableRipple={true}
        disableFocusRipple={true}
        onClick={handleClearAll}
      >
        {t('FILTER.pane.buttons.clearAll')}
      </ClearAllButton>
    </div>
  </FormTitle>
);

FormBodyTitle.propTypes = {
  t: PropTypes.func.isRequired,
  type: PropTypes.string,
  enableClearAll: PropTypes.bool.isRequired,
  handleClearAll: PropTypes.func.isRequired,
  enableLastFilter: PropTypes.bool,
  handleLastFilterApply: PropTypes.func.isRequired,
  formTitle: PropTypes.string.isRequired,
  isFilterChanged: PropTypes.bool,
};

FormBodyTitle.defaultProps = {
  type: 'new',
  enableLastFilter: false,
  isFilterChanged: false,
};

export default FormBodyTitle;
