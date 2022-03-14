import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputMUI from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import withErrorHandler from '../../../../../../components/ErrorHandler/withErrorHandler';
import { FormControl } from '@material-ui/core';
import '../style.scss';

const ItemText = styled(ListItemText)`
  & span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 260px;
    padding-left: 6px;
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  padding-right: 0;
  padding-left: 6px;
  & > div {
    padding-left: 0;
  }
  & .PrivateSwitchBase-root-6 {
    padding: 6px !important;
  }
  & .PrivateSwitchBase-root-14 {
    padding: 6px !important;
  }
  & .MuiCheckbox-colorPrimary.Mui-checked {
    color: #ff650c;
  }
`;

export class MultiSelectComboBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredItems: [],
      selectedIds: this.props.value || [],
      filter: '',
      elements: [],
      totalDataSize: 0,
    };
  }

  componentDidMount() {
    const { render, dataResolver } = this.props;

    if (render === 'static') {
      // No need of await since it is a static data resolver
      const elements = dataResolver();
      this.setFilteredItems(elements);
      this.setState({
        elements,
        totalDataSize: elements.length,
      });
    } else {
      this.fetchData(true);
    }
  }
  setFilteredItems = elements => {
    const { selectedIds } = this.state;
    const { defaultValues } = this.props;

    if (selectedIds.length && elements.length) {
      const filteredItems = elements.filter(element =>
        selectedIds.includes(element.value)
      );
      this.setState({ filteredItems });
    } else if (defaultValues && selectedIds.length === 0) {
      const filteredElements = elements.filter(elem =>
        defaultValues.includes(elem.value)
      );

      this.setState(
        { selectedIds: defaultValues, filteredItems: filteredElements },
        this.handleAdd
      );
    }
  };

  fetchData = async (initialCall = false) => {
    try {
      const { render, dataResolver, scope, paginationSize } = this.props;
      const { filter, elements, totalDataSize } = this.state;
      if (
        render === 'dynamic' &&
        (elements.length < totalDataSize || initialCall)
      ) {
        const response = await dataResolver({
          endIndex: elements.length + paginationSize,
          scope,
          startIndex: elements.length,
          filter,
        });
        this.setState(
          prevState => ({
            elements: [...prevState.elements, ...response.data],
            totalDataSize: response.totalDataSize,
          }),
          () => this.setFilteredItems(this.state.elements)
        );
      }
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  handleAdd = () => {
    this.props.onChange(
      this.state.selectedIds.length > 0 ? this.state.selectedIds : null,
      this.state.filteredItems,
      false
    );
  };

  getDisplayNames = selectedValues => {
    const { elements } = this.state;

    const filteredData = elements.filter(elem =>
      selectedValues.includes(elem.value)
    );

    const displayNames = filteredData
      .map(selectedvalue => selectedvalue.display)
      .join(', ');

    return displayNames;
  };

  toggleItems = event => {
    const { elements } = this.state;
    const filteredItems = elements.filter(elem =>
      event.target.value.includes(elem.value)
    );

    this.setState(
      {
        filteredItems: [...filteredItems],
        selectedIds: [...event.target.value],
      },
      this.handleAdd
    );
  };
  render() {
    const { elements, selectedIds } = this.state;
    const { t, crName } = this.props;

    return (
      <FormControl required className="multi-select-combo-cls">
        <InputLabel htmlFor="subCategory">{t(`FILTER.${crName}`)}</InputLabel>
        <Select
          multiple
          name="subCategory"
          input={<InputMUI id="subCategory" />}
          onChange={this.toggleItems}
          value={selectedIds}
          renderValue={selected => this.getDisplayNames(selected)}
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 300, width: 250 },
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          required
        >
          {elements.map(s => (
            <StyledMenuItem key={s.key} value={s.value}>
              <Checkbox
                color="primary"
                style={{ paddingLeft: '6px' }}
                checked={selectedIds.indexOf(s.value) > -1}
              />
              <ItemText primary={s.display} />
            </StyledMenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}
MultiSelectComboBox.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  render: PropTypes.string,
  dataResolver: PropTypes.func.isRequired,
  scope: PropTypes.string,
  paginationSize: PropTypes.number,
  reportError: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  crName: PropTypes.string,
  defaultValues: PropTypes.string,
};

MultiSelectComboBox.defaultProps = {
  render: 'static',
  scope: 'pairings',
  paginationSize: 300,
  value: [],
  crName: '',
  defaultValues: '',
};

export default withErrorHandler(MultiSelectComboBox);
