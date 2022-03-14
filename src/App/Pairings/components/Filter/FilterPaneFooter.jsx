import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonMUI from '@material-ui/core/Button';

import ActionsContent from '../../../../components/Dialog/ActionsContent';

const FormFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: right;
  background: #fff;
`;

const FilterPaneFooter = ({
  t,
  enableSave,
  handleCancel,
  // handleRefine,
  // handleAugment,
  handleApply,
}) => (
  <FormFooter>
    <ActionsContent>
      <ButtonMUI color="primary" onClick={handleCancel}>
        {t('FILTER.pane.buttons.cancel')}
      </ButtonMUI>
      {/* <ButtonMUI
        disabled={!enableSave}
        onClick={handleRefine}
        variant="contained"
        color="primary"
      >
        {t('FILTER.pane.buttons.refine')}
      </ButtonMUI>
      <ButtonMUI
        disabled={!enableSave}
        onClick={handleAugment}
        variant="contained"
        color="primary"
      >
        {t('FILTER.pane.buttons.augment')}
      </ButtonMUI> */}
      <ButtonMUI
        disabled={!enableSave}
        onClick={handleApply}
        variant="contained"
        color="primary"
      >
        {t('FILTER.pane.buttons.apply')}
      </ButtonMUI>
    </ActionsContent>
  </FormFooter>
);

FilterPaneFooter.propTypes = {
  t: PropTypes.func.isRequired,
  enableSave: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  // handleRefine: PropTypes.func.isRequired,
  // handleAugment: PropTypes.func.isRequired,
  handleApply: PropTypes.func.isRequired,
};

export default FilterPaneFooter;
