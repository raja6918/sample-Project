import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FixedColumnTable from '../../../components/FixedColumnTable/FixedColumnTable';

import { getHeaders } from './utils';
import { suggestions } from './constants';

import _ from 'lodash';
import CompareHeader from './CompareHeader';
import {
  getFilteredArray,
  showSelectorBox,
  getDefaultStats,
  formatData,
  basesAggregator,
  updateData,
  suggestionsAggregator,
} from '../statisticsHelpers';

const CompareContainer = styled.div`
  height: calc(100% - 104px);
  border: 1px solid rgb(204, 204, 204);
  background: #fff;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  height: 100%;

  .cell .Select {
    padding: 0;
  }
  .container .table .col.left:first-child,
  .container .table .col.left:first-child .column.sticky-left,
  .container
    .table
    .col.left:first-child
    .column.sticky-left
    .cells-wrapper
    .cell,
  .container .table .col.left:first-child .column.sticky-left .header.cell {
    min-width: 250px;
  }
  .col:not(.left),
  .col:not(.right) {
    min-width: 175px;
  }
  .Select-multi-value-wrapper > div:first-child {
    font-size: 14px;
  }

  .container {
    height: calc(100% - 104px);
  }
  @media (max-width: 878px) {
    .container {
      height: calc(100% - 170px);
    }
  }
`;

class Compare extends Component {
  state = {
    crewBaseSelected: 'total',
    kpi: 5,
    tempRow: {},
    nextId: 12,
    data: [
      {
        id: 0,
        statistics: { id: 0, name: 0, defaultValue: '' },
        total: '',
      },
    ],
    Data: [],
    suggestions: [],
    selectedSuggestions: [],
    solvers: [],
    bases: [],
  };

  container = null;
  table = null;
  isIE = window.document.documentMode; // IE 6-11

  componentDidMount() {
    this.initializeTable();
    const suggestions = suggestionsAggregator(this.props.solvers)
      .map(key => {
        return {
          value: key,
          label: this.props.t(`SOLVER.KpiParameters.${key}`),
        };
      })
      .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));

    const selectedSuggestions = [];

    let defaultStatsProcessed = getDefaultStats
      .reduce((result, stat) => {
        const thatSuggestion = suggestions.find(
          suggestion => suggestion.value === stat
        );
        if (thatSuggestion) {
          result.push(thatSuggestion);
          selectedSuggestions.push(thatSuggestion.value);
        }
        return result;
      }, [])
      .map((suggestion, i) => {
        return {
          ...suggestion,
          id: i + 1,
          statistics: {
            id: i + 1,
            name: i + 1,
            defaultValue: suggestion.label,
            value: suggestion.value,
          },
        };
      });

    defaultStatsProcessed = updateData(
      [...defaultStatsProcessed, ...this.state.data],
      this.state.crewBaseSelected,
      this
    );
    const Data = this.props.solvers.map(solver => {
      return {
        id: solver.id,
        data: solver.data,
      };
    });

    this.setState({
      suggestions,
      Data,
      data: defaultStatsProcessed,
      bases: basesAggregator(this.props.solvers),
      selectedSuggestions,
    });
  }

  componentDidUpdate() {
    if (this.container === null) this.initializeTable();
  }

  initializeTable() {
    const container = document.querySelector('.fct-container');
    // const table = document.querySelector(
    //   '.table .col:first-child .column .cells-wrapper'
    // );
    // if (container && table) {
    if (container) {
      this.container = container;
      // this.table = table;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { crewBaseSelected, bases } = this.state;
    const { solvers } = nextProps;

    const isAdd =
      solvers.length > this.props.solvers.length &&
      solvers.length - this.props.solvers.length <= 1;
    const newBases = basesAggregator(solvers);
    const updatedData = updateData(
      this.state.data,
      crewBaseSelected,
      this,
      isAdd,
      solvers
    );
    this.setState({
      data: updatedData,
      bases: _.uniq([...bases, ...newBases]),
    });
  }

  addNewRow = value => {
    const {
      suggestions,
      nextId,
      data,
      crewBaseSelected,
      selectedSuggestions,
    } = this.state;
    const { solvers } = this.props;
    let dataToBeAdded = suggestions.find(suggestion => {
      return suggestion.value === value;
    });

    const newKpi = solvers.map(sol => {
      return {
        [sol.id]: sol.data[value] ? sol.data[value][crewBaseSelected] : '--',
      };
    });
    if (dataToBeAdded) {
      dataToBeAdded = {
        ...dataToBeAdded,
        id: nextId,
        statistics: {
          id: nextId,
          name: nextId,
          defaultValue: this.props.t(`SOLVER.KpiParameters.${value}`),
          value: value,
        },
        ...Object.assign({}, ...newKpi),
      };
      const LastRow = data.pop(data.length - 1);
      this.setState({
        data: [...data, dataToBeAdded, LastRow],
        nextId: nextId + 1,
        selectedSuggestions: [...selectedSuggestions, value],
      });
    }
  };

  deleteRow = id => {
    const { data, selectedSuggestions } = this.state;
    let newSelectedSuggestions = selectedSuggestions;

    const delValue = data.find(d => d.id === id);
    if (delValue)
      newSelectedSuggestions = selectedSuggestions.filter(
        sugg => delValue.value !== sugg
      );

    this.setState({
      data: getFilteredArray(data, 'id', id),
      selectedSuggestions: newSelectedSuggestions,
    });
  };

  handleChange = (value, id) => {
    const { data, crewBaseSelected, selectedSuggestions } = this.state;
    const { solvers } = this.props;
    let newSelectedSuggestions = [...selectedSuggestions];

    const rowToChange = _.findIndex(data, data => data.id === id);
    const oldSuggestion = data.find(data => data.id === id);
    const newSuggestion = suggestions.find(
      suggestion => suggestion.value === value
    );
    if (value && value !== '') {
      newSelectedSuggestions = [
        ...newSelectedSuggestions.filter(v => v !== data[rowToChange].value),
        value,
      ];

      solvers.map(sol => {
        return (data[rowToChange] = {
          ...data[rowToChange],
          label: value,
          value,
          statistics: {
            ...data[rowToChange].statistics,
            defaultValue: value,
            value,
          },
          [sol.id]: sol.data[value][crewBaseSelected] || '',
        });
      });
    } else {
      newSelectedSuggestions = newSelectedSuggestions.filter(
        selectedSuggestion => selectedSuggestion !== oldSuggestion.value
      );
      data[rowToChange] = {
        ...newSuggestion,
        statistics: {
          ...data[rowToChange].statistics,
          value,
          defaultValue: value,
        },
        id,
      };
    }

    this.setState({
      data,
      selectedSuggestions: newSelectedSuggestions,
    });
  };

  handleChangeStat = event => {
    if (event.target.name === 'crewBaseSelected') {
      const updatedData = updateData(this.state.data, event.target.value, this);
      this.setState({
        data: updatedData,
        [event.target.name]: event.target.value,
      });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  handleClickSelector = id => {
    // scrollIntoView for the last 2 rows
    if (id === 0 || id === this.state.data.length - 1) {
      if (this.isIE) {
        const element = document.querySelector('#sectionScroll');
        element.style.height = `${element.clientHeight + 200}px`; // give space for dropdown
      }
      showSelectorBox(id, this);
    }
  };

  render() {
    const {
      data,
      crewBaseSelected,
      kpi,
      suggestions,
      bases,
      selectedSuggestions,
    } = this.state;
    const { solvers, t } = this.props;

    const headers = getHeaders(solvers, t);
    return (
      <Container>
        <CompareHeader
          title={t('SOLVER.tabCompare.compareTitle')}
          buttonLabel={t('SOLVER.tabCompare.saveButton')}
          columnValue={crewBaseSelected}
          kpiValue={kpi}
          crewbases={bases}
          handleChangeColumn={this.handleChangeStat}
          handleChangeKPI={this.handleChangeStat}
          t={t}
        />
        <CompareContainer>
          <FixedColumnTable
            headers={headers}
            data={formatData(data, this, suggestions, selectedSuggestions)}
          />
        </CompareContainer>
      </Container>
    );
  }
}

Compare.propTypes = {
  t: PropTypes.func.isRequired,
  solvers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.shape({
        statusId: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Compare;
