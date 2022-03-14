import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import ButtonMUI from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const FavouritesSession = styled(Grid)`
  position: absolute;
  bottom: 63px;
  width: 100%;
  height: 48px;
  margin: 0;
  border-top: 1px solid #cccccc;
  background: #f7f7f7;
`;

const SubSession = styled(Grid)`
  justify-content: center;
  align-items: center;
  & .MuiInputBase-root {
    width: 218px;
  }
`;

const Button = styled(ButtonMUI)`
  text-transform: none;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  .MuiButton-endIcon {
    padding-bottom: 2px;
  }
  .MuiButton-iconSizeMedium > *:first-child {
    font-size: 24px;
  }
`;

const StyledAutocomplete = styled(Autocomplete)`
  .MuiInputLabel-shrink {
    display: none;
  }
  label + .MuiInput-formControl {
    margin-top: 0;
  }
  .MuiInputLabel-formControl {
    top: -15px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  font-size: 15px;
`;

const FilterPaneFavourites = ({
  t,
  enableSave,
  filterLoaded,
  loadedFilters,
  onLoadFilter,
  onStartSaveFilter,
  onUpdateFilter,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOption = data => {
    if (data === 'update') {
      onUpdateFilter();
    } else {
      onStartSaveFilter();
    }
    setAnchorEl(null);
  };

  return (
    <FavouritesSession container>
      <SubSession item container xs={8}>
        <StyledAutocomplete
          value={filterLoaded}
          options={loadedFilters}
          onChange={onLoadFilter}
          getOptionLabel={option => option.name || ''}
          blurOnSelect
          disableClearable
          renderInput={params => (
            <TextField
              {...params}
              label={t('FILTER.pane.favourites.selectInputPlaceholder')}
            />
          )}
        />
      </SubSession>
      <SubSession
        item
        container
        xs={4}
        style={{ borderLeft: '1px solid #B2B2B2' }}
      >
        {filterLoaded && (
          <Fragment>
            <Button
              aria-controls="save-filter-options-menu"
              aria-haspopup="true"
              disabled={!enableSave}
              color="primary"
              endIcon={<MoreVertIcon />}
              onClick={handleClick}
            >
              {t('FILTER.pane.favourites.saveBtn')}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <StyledMenuItem onClick={() => handleOption('new')}>
                {t('FILTER.pane.favourites.saveBtnNew')}
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOption('update')}>
                {t('FILTER.pane.favourites.saveBtnUpdate')}
              </StyledMenuItem>
            </Menu>
          </Fragment>
        )}
        {!filterLoaded && (
          <Button
            disabled={!enableSave}
            color="primary"
            onClick={onStartSaveFilter}
            endIcon={<SaveIcon />}
          >
            {t('FILTER.pane.favourites.saveBtn')}
          </Button>
        )}
      </SubSession>
    </FavouritesSession>
  );
};

FilterPaneFavourites.propTypes = {
  t: PropTypes.func.isRequired,
  enableSave: PropTypes.bool.isRequired,
  filterLoaded: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])
    .isRequired,
  loadedFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onLoadFilter: PropTypes.func.isRequired,
  onStartSaveFilter: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
};

export default FilterPaneFavourites;
