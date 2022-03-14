import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RecipeComponent from './RecipeComponent';
import { arrayMove } from '../../../_shared/helpers';
import IconButton from '@material-ui/core/IconButton';
import ControlPointIcon from '@material-ui/icons/ControlPoint';

class RecipeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRecipes: this.props.selectedRecipes || ['-1'],
      isUpdated: false,
      activeRequestId: this.props.activeRequestId || 0,
      isAPICallActive: this.props.isAPICallActive || false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.selectedRecipes &&
      (!state.isUpdated ||
        state.activeRequestId !== props.activeRequestId ||
        props.isLaunched)
    ) {
      return {
        selectedRecipes: props.selectedRecipes,
        activeRequestId: props.activeRequestId,
      };
    }
    return { isAPICallActive: props.isAPICallActive };
  }

  componentDidMount() {
    const { activeRequestId } = this.props;

    if (!activeRequestId) this.setState({ selectedRecipes: ['-1'] });
  }

  onSortEnd = event => {
    const { fieldName, handleAutocompleteChange } = this.props;

    const data = [...this.state.selectedRecipes];
    const reorderedData = arrayMove(data, event.oldIndex, event.newIndex);
    this.setState({ selectedRecipes: reorderedData, isUpdated: true }, () => {
      handleAutocompleteChange(fieldName, reorderedData);
    });
  };

  arrangeSelectedRecipes = (value, index) => {
    const { selectedRecipes } = this.state;
    const { fieldName, handleAutocompleteChange } = this.props;

    if (index === selectedRecipes.length) {
      this.setState({
        selectedRecipes: [...selectedRecipes, `${value}`],
        isUpdated: true,
      });
    } else {
      this.setState(
        {
          selectedRecipes: this.state.selectedRecipes.map((item, i) =>
            i === index ? value : item
          ),
          isUpdated: true,
        },
        () => {
          this.scrollToPosition();
          handleAutocompleteChange(fieldName, this.state.selectedRecipes);
        }
      );
    }
  };

  handleDelete = i => {
    const { fieldName, handleAutocompleteChange } = this.props;

    this.setState(
      {
        selectedRecipes: this.state.selectedRecipes.filter(
          (item, index) => index !== i
        ),
        isUpdated: true,
      },
      () => {
        handleAutocompleteChange(fieldName, this.state.selectedRecipes);
        this.scrollToPosition();
      }
    );
  };

  scrollToPosition = () => {
    const { activeRequestId } = this.props;
    const actReqId = activeRequestId ? activeRequestId : '0';

    const element = document.getElementById(`control-point-icon${actReqId}`);
    element.scrollIntoView();
  };

  render() {
    const { selectedRecipes, isAPICallActive } = this.state;
    const {
      t,
      recipesSuggestions,
      isDisabled,
      maxLength,
      activeRequestId,
    } = this.props;

    const disableAdd = selectedRecipes
      ? isDisabled ||
        selectedRecipes.includes('-1') ||
        selectedRecipes.includes(null) ||
        selectedRecipes.length === 25 ||
        isAPICallActive
      : false;
    const actReqId = activeRequestId ? activeRequestId : '0';

    return (
      <React.Fragment>
        <RecipeComponent
          t={t}
          selectedRecipes={selectedRecipes}
          arrangeSelectedRecipes={this.arrangeSelectedRecipes}
          recipesSuggestions={recipesSuggestions}
          handleDelete={this.handleDelete}
          onSortEnd={this.onSortEnd}
          isDisabled={isDisabled || isAPICallActive}
          maxLength={maxLength}
        />
        <div
          id={`control-point-icon${actReqId}`}
          style={{
            paddingTop: '20px',
            paddingBottom: '20px',
          }}
        >
          <IconButton
            onClick={() =>
              this.arrangeSelectedRecipes('-1', selectedRecipes.length)
            }
            disabled={disableAdd}
          >
            <ControlPointIcon color={disableAdd ? 'disabled' : 'primary'} />
          </IconButton>
        </div>
      </React.Fragment>
    );
  }
}

RecipeContainer.propTypes = {
  t: PropTypes.func.isRequired,
  handleAutocompleteChange: PropTypes.func.isRequired,
  recipesSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  isDisabled: PropTypes.bool,
  fieldName: PropTypes.string,
  activeRequestId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

RecipeContainer.defaultProps = {
  recipesSuggestions: null,
  isDisabled: false,
  fieldName: '',
  activeRequestId: '',
};

export default RecipeContainer;
