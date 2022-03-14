import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import ButtonMUI from '@material-ui/core/Button';

import ActionsContent from '../../../../components/Dialog/ActionsContent';

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #e5e5e5;
  border-top: 1px solid #cccccc;
`;

const InputWrapper = styled.div`
  padding: 10px 20px;
  padding-bottom: ${props => (props.error ? '0px' : '16px')};
  .MuiTextField-root {
    width: 360px;
  }
  .error > label {
    color: rgb(209, 0, 0) !important;
  }
  .MuiInput-underline.Mui-error:after {
    border-bottom-color: #0a75c2;
  }
`;

const CustomeActionsContent = styled(ActionsContent)`
  border-top: none;
  padding-top: ${props => (props.error ? '7px' : '14px')};
`;

const SaveFilterFooter = ({
  t,
  onSaveFilter,
  onCancelFilter,
  loadedFilters,
  disableFilterSave,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSave = () => {
    onSaveFilter(name);
  };

  const handleOnChange = e => {
    let hasError = false;
    if (Array.isArray(loadedFilters)) {
      for (const filter of loadedFilters) {
        if (filter.name === e.target.value.trim()) {
          hasError = true;
          break;
        }
      }
    }

    setName(e.target.value);
    setError(hasError);
  };

  return (
    <Footer>
      <InputWrapper error={error}>
        <TextField
          error={error}
          className={error ? 'error' : ''}
          helperText={error ? t('FILTER.pane.favourites.errorInfo') : ''}
          value={name}
          onChange={handleOnChange}
          onFocus={event => event.target.select()}
          onClick={this.removeOverlay}
          label={t('FILTER.pane.favourites.placeholder')}
          inputProps={{ maxLength: 30 }}
        />
      </InputWrapper>
      <CustomeActionsContent error={error}>
        <ButtonMUI color="primary" onClick={onCancelFilter}>
          {t('FILTER.pane.buttons.cancel')}
        </ButtonMUI>
        <ButtonMUI
          disabled={name.trim().length === 0 || error || disableFilterSave}
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          {t('FILTER.pane.buttons.save')}
        </ButtonMUI>
      </CustomeActionsContent>
    </Footer>
  );
};

SaveFilterFooter.propTypes = {
  t: PropTypes.func.isRequired,
  onCancelFilter: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  loadedFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  disableFilterSave: PropTypes.bool.isRequired,
};

export default SaveFilterFooter;
