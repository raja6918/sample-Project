import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoCompleteForm } from '../../../components/FormComponents';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '../../../components/Icon';
import { modifySuggestions } from '../statisticsHelpers';
import { shortenText } from '../../../utils/common';
import { isEqual } from 'lodash';
import '../styles.scss';

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

class RecipeComponent extends Component {
  render() {
    const {
      t,
      selectedRecipes,
      arrangeSelectedRecipes,
      recipesSuggestions,
      handleDelete,
      onSortEnd,
      isDisabled,
      maxLength,
    } = this.props;

    const SortableContainer = sortableContainer(({ children }) => {
      return <div>{children}</div>;
    });

    const disabled = selectedRecipes.length <= 1 || isDisabled;

    const DragHandle = sortableHandle(() => (
      <IconButton
        className="material-icons drag-handle-cls"
        disabled={disabled}
      >
        <Icon iconcolor={disabled ? 'inherit' : '#7e7e7e'} margin={'0'}>
          drag_handle
        </Icon>
      </IconButton>
    ));

    const SortableItem = sortableElement(props => {
      const { value, i, index } = props;
      const label =
        value !== '-1' && value !== null && value !== undefined && value !== ''
          ? recipesSuggestions.find(rec => rec.value === value).label
          : '-1';
      const modifiedLabel = shortenText(label, maxLength);
      const isToolTip = !isEqual(modifiedLabel, label);

      return (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={1}
          className="rcp-grid"
          direction="row"
        >
          <Grid item xs={1} sm={1}>
            <DragHandle />
          </Grid>
          <Grid item xs={10} sm={10}>
            <AutoCompleteForm
              id="recipe"
              label={''}
              placeholder="Choose a recipe *"
              value={value}
              isToolTip={isToolTip}
              suggestions={modifySuggestions(
                selectedRecipes,
                recipesSuggestions,
                value
              )}
              onChange={event => arrangeSelectedRecipes(event, i)}
              t={t}
              disabled={isDisabled}
            />
          </Grid>
          <Grid item xs={1} sm={1}>
            <IconButton
              className="delete-icon"
              onClick={() => handleDelete(i)}
              disabled={disabled}
            >
              <Icon iconcolor={disabled ? 'inherit' : '#0A75C2'} margin={'0'}>
                delete
              </Icon>
            </IconButton>
          </Grid>
        </Grid>
      );
    });

    return (
      <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {selectedRecipes.map((value, i) => {
          return (
            <SortableItem key={`item-${value}`} value={value} i={i} index={i} />
          );
        })}
      </SortableContainer>
    );
  }
}

RecipeComponent.propTypes = {
  t: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  arrangeSelectedRecipes: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  recipesSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  isDisabled: PropTypes.bool,
};

RecipeComponent.defaultProps = {
  selectedRecipes: [],
  isDisabled: false,
};

export default RecipeComponent;
