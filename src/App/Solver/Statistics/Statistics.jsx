import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import FixedColumnTable from '../../../components/FixedColumnTable/FixedColumnTable';
import ModalLoader from '../../../components/ModalLoader';
import { perfectScrollConfig } from '../../../utils/common';

import {
  getFilteredArray,
  showSelectorBox,
  buildHeaders,
  getDefaultStats,
  formatData,
} from '../statisticsHelpers';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  height: 100%;
  border: 1px solid rgb(204, 204, 204);
  background: #fff;

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
  .Select-multi-value-wrapper > div:first-child {
    font-size: 14px;
  }
  .ps__rail-x,
  .ps__rail-y {
    z-index: 80;
  }
`;
const MuiSwitch = styled(Switch)`
  & .MuiSwitch-switchBase {
    left: 6px !important;
    bottom: 0px !important;
  }
  & .MuiIconButton-root:hover {
    background-color: transparent;
  }
`;
const OptionsDialog = styled.div`
  display: ${props => (props.open ? 'block' : 'none')};
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  position: absolute;
  right: -9px;
  width: 170px;
  z-index: 999;
  background-color: #fff;
  top: 45px;
  border-radius: 5px;

  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background: transparent;
  }
  .content {
    z-index: 9999;
    height: 100%;
    width: 100%;
  }

  .content > p {
    margin: 0;
    padding: 15px 12px;
    border-bottom: 1px solid #c3c3c3;
  }

  .content > label {
    margin: 0;
    width: 100%;
  }

  .col-options {
    max-height: 18vh;
    /* overflow-y: auto; */
    margin: 0 0 4px 5px;
  }
  .col-options label {
    width: 100%;
    margin: 0;
  }
  .content:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 80%;
    transform: translate(-80%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-bottom: 10px solid #fff;
  }
`;

class StatisticsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 0,
          statistics: { id: 0, name: 0, defaultValue: '' },
          total: '',
        },
      ],
      nextId: 12,
      openOptionsDialog: false,
      checkedOptions: [],
      isFetching: false,
      suggestions: [],
      selectedSuggestions: [],
      headers: [],
      isDataRecieved: false,
    };
    this.container = null;
    this.table = null;
  }
  isIE = window.document.documentMode; // IE 6-11

  checkAndsetStatsData = activeRequest => {
    if (
      !(
        Object.prototype.hasOwnProperty.call(activeRequest, 'bases') &&
        Object.prototype.hasOwnProperty.call(activeRequest, 'data')
      )
    ) {
      this.setState({ isFetching: true });
    } else {
      const suggestions =
        activeRequest && activeRequest.data
          ? Object.keys(activeRequest.data)
              .map(key => {
                return {
                  value: key,
                  label: this.props.t(`SOLVER.KpiParameters.${key}`),
                  ...activeRequest.data[key],
                };
              })
              .sort((a, b) =>
                a.label > b.label ? 1 : b.label > a.label ? -1 : 0
              )
          : [];

      const selectedSuggestions = [];
      const defaultStatsProcessed = getDefaultStats
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
              defaultValue: suggestion.value,
              value: suggestion.value,
            },
          };
        });

      const checkedOptions = Array.isArray(activeRequest.bases)
        ? activeRequest.bases.map(base => {
            return {
              id: base,
              display: base,
              selected: true,
              name: base,
            };
          })
        : [];

      this.setState({
        suggestions,
        checkedOptions,
        headers: checkedOptions,
        isFetching: false,
        data: [...defaultStatsProcessed, ...this.state.data],
        selectedSuggestions,
        isDataRecieved: true,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!this.state.isDataRecieved)
      this.checkAndsetStatsData(nextProps.activeRequest);
  }
  componentDidUpdate() {
    if (this.container === null) this.initializeTable();
  }

  componentWillMount() {
    this.checkAndsetStatsData(this.props.activeRequest);
  }

  componentDidMount() {
    this.initializeTable();
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

  /* this is the handler to delete one row from data array */
  deleteRow = id => {
    const { data, selectedSuggestions } = this.state;
    let newSelectedSuggestions = Array.from(selectedSuggestions);
    const oldSuggestion = data.find(data => data.id === id);

    //remove old value from selectedSuggestions
    if (oldSuggestion) {
      newSelectedSuggestions = newSelectedSuggestions.filter(
        selectedSuggestion => selectedSuggestion !== oldSuggestion.value
      );
    }
    this.setState({
      data: getFilteredArray(data, 'id', id),
      selectedSuggestions: newSelectedSuggestions,
    });
  };

  /* this is the handler when user change a row on statistics selector */
  handleChange = (value, id) => {
    const { suggestions, data, selectedSuggestions } = this.state;
    let newSelectedSuggestions = Array.from(selectedSuggestions);
    const rowToChange = data.findIndex(data => data.id === id);
    const oldSuggestion = data.find(data => data.id === id);
    const newSuggestion = suggestions.find(
      suggestion => suggestion.value === value
    );

    // to handle the cross on the dropdown box where value will be null, if so remove it from selected suggestions.
    if (value === null) {
      newSelectedSuggestions = newSelectedSuggestions.filter(
        selectedSuggestion => selectedSuggestion !== oldSuggestion.value
      );
    }

    //push new value to selectedSuggestions and remove old value from selectedSuggestions
    if (oldSuggestion && newSuggestion) {
      newSelectedSuggestions = newSelectedSuggestions.filter(
        selectedSuggestion => selectedSuggestion !== oldSuggestion.value
      );
      newSelectedSuggestions.push(newSuggestion.value);
    }

    data[rowToChange] = {
      ...newSuggestion,
      statistics: {
        ...data[rowToChange].statistics,
        value,
        defaultValue: value,
      },
      id,
    };
    this.setState({
      data: [...data],
      selectedSuggestions: newSelectedSuggestions,
    });
  };

  /* this is the handler to add new row on the data array */
  addNewRow = value => {
    const { suggestions, nextId, data, selectedSuggestions } = this.state;
    const newSelectedSuggestions = Array.from(selectedSuggestions);

    //push new value to selectedSuggestions
    if (value) {
      newSelectedSuggestions.push(value);
    }

    let dataToBeAdded = suggestions.find(suggestion => {
      return suggestion.value === value;
    });

    if (dataToBeAdded) {
      dataToBeAdded = {
        ...dataToBeAdded,
        id: nextId,
        statistics: {
          id: nextId,
          name: nextId,
          defaultValue: value,
          value: value,
        },
      };

      const LastRow = data.pop(data.length - 1);

      this.setState({
        data: [...data, dataToBeAdded, LastRow],
        nextId: nextId + 1,
        selectedSuggestions: newSelectedSuggestions,
      });
    }
  };

  /* This functios works as toggle to show/hide the OptionsDialog */
  handleOpenColumns = () => {
    this.setState({
      openOptionsDialog: !this.state.openOptionsDialog,
    });
  };

  /* This is the handler of the switch inside OptionDialog */
  handleChangeSwitch = e => {
    const copyOfCheckedOptins = this.state.checkedOptions;

    for (let i = 0; i < copyOfCheckedOptins.length; i++) {
      copyOfCheckedOptins[i].selected = e.target.checked;
    }

    this.setState({
      checkedOptions: [...copyOfCheckedOptins],
    });
  };

  /* This is the handler of each checkobox inse OptionsDialog */
  handleCheck = id => {
    const copyOfCheckedOptions = Array.from(this.state.checkedOptions);

    const headerIndex = copyOfCheckedOptions.findIndex(
      header => header.id === id
    );

    copyOfCheckedOptions[headerIndex].selected = !copyOfCheckedOptions[
      headerIndex
    ].selected;

    this.setState({
      checkedOptions: copyOfCheckedOptions,
    });
  };

  /* This function maps a list of checkboxes inside OptionDialog based on checkedOptions array */
  displayCheckBoxes = () => {
    const checkBoxes = this.state.checkedOptions.map((header, k) => (
      <FormControlLabel
        key={k}
        control={
          <Checkbox
            checked={header.selected}
            onChange={() => this.handleCheck(header.id)}
            value={header.id}
            color="secondary"
          />
        }
        label={header.display}
      />
    ));
    return checkBoxes;
  };

  /* This function returns true if all checkboxes are checked, otherwise false */
  isCheckAll = () => {
    const checkedOptios = this.state.checkedOptions.filter(op => op.selected);
    return checkedOptios.length === this.state.checkedOptions.length;
  };

  /* this functions returs all the headers that are checked */
  getHeaders = () => {
    const newHeaders = [];

    const selectedColumns = [];

    for (let i = 0; i < this.state.checkedOptions.length; i++) {
      if (this.state.checkedOptions[i].selected) {
        selectedColumns.push(this.state.checkedOptions[i].id);
      }
    }
    for (let i = 0; i < this.state.headers.length; i++) {
      if (this.state.headers[i].sticky) {
        newHeaders.push(this.state.headers[i]);
      } else {
        const header = selectedColumns.find(
          col => col === this.state.headers[i].id
        );
        if (header) {
          newHeaders.push(this.state.headers[i]);
        }
      }
    }

    return newHeaders;
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
      openOptionsDialog,
      isFetching,
      suggestions,
      selectedSuggestions,
    } = this.state;
    const { t } = this.props;
    const headers = this.getHeaders();
    return (
      <Fragment>
        {!isFetching ? (
          <Container>
            <FixedColumnTable
              data={formatData(data, this, suggestions, selectedSuggestions)}
              headers={buildHeaders(headers, this)}
            />
            <OptionsDialog open={openOptionsDialog}>
              <div className="content">
                <p>{t('SOLVER.tabStatistics.columns')}</p>
                <FormControlLabel
                  control={
                    <MuiSwitch
                      checked={this.isCheckAll()}
                      onChange={this.handleChangeSwitch}
                      value="checkedColumsns"
                      color="secondary"
                    />
                  }
                  label={t('SOLVER.tabStatistics.allBases')}
                />
                <PerfectScrollbar option={perfectScrollConfig}>
                  <div className="col-options">{this.displayCheckBoxes()}</div>
                </PerfectScrollbar>
              </div>
              <div className="mask" onClick={this.handleOpenColumns} />
            </OptionsDialog>
          </Container>
        ) : (
          <ModalLoader
            open={isFetching}
            title={t('SOLVER.loaderStatistics.waitMessage')}
            subtitle={t('SOLVER.loaderStatistics.waitStatus')}
            color="white"
          />
        )}
      </Fragment>
    );
  }
}

StatisticsTable.propTypes = {
  t: PropTypes.func.isRequired,
  activeRequest: PropTypes.shape({}).isRequired,
};

export default StatisticsTable;
