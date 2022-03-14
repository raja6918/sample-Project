import React, { Component, Fragment } from 'react';
import { t } from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

import Dialog from './Dialog';
import Breadcrumb from './Breadcrumb';
import ExceptionPanel from './ExceptionPanel';
import DataNotFound from '../../../../../../../components/DataNotFound';
import GenericDynamicTable from '../../../../../../../components/GenericDynamicTable/GenericDynamicTable';
import Notification from '../../../../../../../components/Notification';
import Sort from '../../../../../../../utils/sortEngine';

import {
  getHeaders,
  getTableConfiguration,
  getDefaultComponentConfigs,
  getComponentDefaults,
  getSortType,
  getExpectionMetaInfo,
} from './constants';
import { getValidation } from '../../constants';
import {
  getKeyItem,
  generateKey,
  generateInitialTimeRanges,
  generateUpdatedTimeRanges,
} from './helpers';
import {
  validateTimeRangeGaps,
  validateTimeRangeDuration,
} from './validations';
import {
  getTooltipContent,
  getResetedExceptions,
  getHighestExpectionType,
  getUpdatedException,
  selectDependentExceptions,
  clearDependentExceptionsSelected,
} from './multiDimensionalTableUtils';
import { fetchMasterData } from '../../../../../../../actions/data';

import './style.scss';
import * as ruleService from '../../../../../../../services/Data/rules';

const OrangeSpan = styled.span`
  color: #ff650c;
  cursor: pointer;
`;

const OrangeIconButton = styled(IconButton)`
  color: #ff650c;
`;

const Container = styled.div`
  display: ${props => props.display};
`;

const TableWrapper = styled.div`
  padding: 24px;
  padding-bottom: ${props => props.paddingBottom};
`;

const defaultState = {
  open: false,
  overlay: false,
  isLoading: false,
  errors: [],
  snackMessage: null,
  disableSave: true,
  type: null,
  title: '',
  code: null,
  rowHeader: '',
  columnHeader: '',
  tableData: null,
  transformedData: null,
  defaultHeaderType: null,
  defaultBodyType: null,
  defaultHeaderRules: null,
  defaultBodyRules: null,
  defaultHeaderPlaceholder: '',
  defaultBodyPlaceholder: '',
  enableSort: true,
  exceptions: null,
  exceptionsSelected: null,
  exceptionState: 'general',
};
export class RuleTableDialog extends Component {
  state = { ...defaultState };

  keyField = null;
  keyFieldDisplayName = '';
  defaultHeaderPlaceholder = '';
  displayOnlyFields = [];
  initialExceptionsSelected = null;
  exceptionKeys = [];
  tableRef = React.createRef();
  timeRangeParamType = null; // Special time range component need extra processing

  handleOpenDialog = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true }, () => {
        this.fetchData();
      });
    }
  };

  /**
   * According to API spec one column header may contain isKey attribute.
   * if not then it will be a list or fixed table with code as key attribute.
   * According to API spec one or more column header can have displayOnly attribute (ie not a parameter).
   */
  setKeyAndDisplayOnlyField = headers => {
    this.keyField = 'code';
    if (Array.isArray(headers)) {
      for (const header of headers) {
        if (header.isKey) {
          this.keyField = header.field;
          this.keyFieldDisplayName = header.displayName;
        }
        if (header.displayOnly) this.displayOnlyFields.push(header.field);
        // Check for timeRangeParamType
        if (header.type === 'timeRangeParamType') {
          this.timeRangeParamType = header.field;
        }
      }
    }
  };

  getTransformedData = (type, data) => {
    const { getTransformer } = getTableConfiguration(type);
    return getTransformer(
      data,
      this.displayOnlyFields,
      this.keyField,
      this.state.exceptions
    );
  };

  getTableData = ({ type, header, data }) => {
    let tableData = {
      header: header,
      data: Array.isArray(data) ? [...data] : [],
    };

    // If it is a list or simplelist table we need to generate list column
    if (type === 'simpleList' || type === 'list') {
      const updatedHeader = [
        {
          field: 'code', // since default keyField is code
          displayName: t('DYNAMIC_TABLE.tableType.list.keyDisplayName'),
          type: 'listTitle',
          isKey: true,
        },
        ...header,
      ];

      const updatedData = Array.isArray(data)
        ? data.map((item, index) => {
            return { code: index + 1, ...item };
          })
        : [];

      tableData = {
        header: updatedHeader,
        data: updatedData,
      };
    }

    return tableData;
  };

  /**
   * If header contains dynamic enums we need to resolve it before we render the table.
   * This slows down the modal's opening time.
   * But once enums are prefetched we don't need to call API again as it is cached ie huge performance benefits.
   */
  prefetchDynamicEnums = async headers => {
    if (Array.isArray(headers)) {
      const { scenarioId, dynamicEnumData, fetchMasterData } = this.props;
      for (const header of headers) {
        if (
          header.type === 'dynamicEnumParamType' &&
          header.enumType &&
          !dynamicEnumData[header.enumType]
        ) {
          // eslint-disable-next-line no-await-in-loop
          await fetchMasterData(header.enumType, scenarioId);
        }
      }
    }
  };

  /**
   * Prefetch exceptions data that is needed to populate auto complete component
   */
  prefetchExceptions = async exceptions => {
    if (Array.isArray(exceptions)) {
      const { scenarioId, dynamicEnumData, fetchMasterData } = this.props;
      for (const exception of exceptions) {
        if (!dynamicEnumData[exception.key]) {
          // eslint-disable-next-line no-await-in-loop
          await fetchMasterData(exception.key, scenarioId);
        }
      }
    }
  };

  processExceptions = exceptions => {
    const exceptionsSelected = {};
    if (Array.isArray(exceptions)) {
      for (const exception of exceptions) {
        exceptionsSelected[exception.key] = null;
        this.exceptionKeys.push(exception.key);
      }
    }
    this.initialExceptionsSelected = exceptionsSelected;
    return { exceptionsSelected };
  };

  handleExceptionStateChange = value => {
    this.setState({ exceptionState: value }, () => {
      this.clearExceptionsSelected();
    });
  };

  clearExceptionsSelected = () => {
    this.setState({ exceptionsSelected: this.initialExceptionsSelected });
  };

  handleExceptionsSelectedChange = (key, value, index) => {
    const updatedPrevKeys = selectDependentExceptions(
      [...this.exceptionKeys],
      index,
      value,
      this.props.dynamicEnumData
    );
    const updatedNextKeys = clearDependentExceptionsSelected(
      [...this.exceptionKeys],
      index
    );

    this.setState(prevState => ({
      exceptionsSelected: {
        ...prevState.exceptionsSelected,
        ...updatedPrevKeys,
        ...updatedNextKeys,
        [key]: value,
      },
    }));
  };

  fetchData = async () => {
    const { scenarioId, userId, ruleSet } = this.props;
    try {
      const { param: response } = await ruleService.getTableDataDetails(
        this.props.data.name,
        scenarioId,
        userId,
        ruleSet
      );

      this.setKeyAndDisplayOnlyField(response.header);

      await this.prefetchDynamicEnums(response.header);
      await this.prefetchExceptions(response.exceptions);

      const { exceptionsSelected } = this.processExceptions(
        response.exceptions
      );

      const tableData = this.getTableData(response);

      const enableSort =
        tableData.header[0].enableSort !== undefined
          ? tableData.header[0].enableSort
          : true;
      let sortedTableData = enableSort
        ? new Sort(tableData.data, {
            type: getSortType(tableData.header[0].type),
            direction: 'inc',
            field: tableData.header[0].field,
          }).sort()
        : tableData.data;

      if (this.timeRangeParamType) {
        sortedTableData = generateInitialTimeRanges(
          sortedTableData,
          this.timeRangeParamType
        );
      }

      this.setState({
        open: true,
        title: response.title,
        code: response.code,
        rowHeader: response.rowHeader,
        columnHeader: response.columnHeader,
        type: response.type,
        defaultHeaderType: response.defaultHeaderType,
        defaultBodyType: response.defaultBodyType,
        tableData: { header: tableData.header, data: sortedTableData },
        defaultHeaderRules: response.defaultHeaderRules,
        defaultBodyRules: response.defaultBodyRules,
        defaultHeaderPlaceholder: response.defaultHeaderPlaceholder,
        defaultBodyPlaceholder: response.defaultBodyPlaceholder,
        enableSort: response.enableSort,
        exceptions: Array.isArray(response.exceptions)
          ? [...response.exceptions].reverse() // Since reverse mutate original array
          : null,
        exceptionsSelected,
        isLoading: false,
      });

      this.keyFieldDisplayName =
        this.keyFieldDisplayName || response.defaultBodyPlaceholder;
      this.defaultHeaderPlaceholder = response.defaultHeaderPlaceholder || '';
    } catch (error) {
      console.error(error);
      if (error.response) {
        this.props.reportError(error);
      }
    }
  };

  handleSave = async () => {
    try {
      const { type, tableData, code } = this.state;
      const { userId, scenarioId, ruleSet, refreshRules } = this.props;

      if (this.timeRangeParamType) {
        validateTimeRangeGaps(tableData, this.timeRangeParamType);
        validateTimeRangeDuration(tableData, this.timeRangeParamType);
      }

      const transformedData = this.getTransformedData(type, tableData.data);

      this.setState({ disableSave: true });
      // Call Save API here after transformation
      await ruleService.setParam(
        userId,
        scenarioId,
        ruleSet,
        code,
        transformedData
      );

      refreshRules();
      this.handleCancel();
    } catch (error) {
      console.error(error);
      if (error.response) {
        this.setState({
          snackMessage: t('ERRORS.COMPLEX_RULE_ENTITY_FIELD_ERROR'),
        });
        // once withErrorHandler is updated to latest error spec we will update this
        // this.props.reportError(error);
        // this.setOverlay();
      } else {
        // For handling client validation side error
        this.setState({
          snackMessage: error.message,
          disableSave: true,
        });
      }
    }
  };

  handleCancel = () => {
    this.setState({ ...defaultState });
    this.keyField = null;
    this.keyFieldDisplayName = '';
    this.defaultHeaderPlaceholder = '';
    this.displayOnlyFields = [];
    this.initialExceptionsSelected = null;
    this.exceptionKeys = [];
  };

  setOverlay = () => {
    this.setState({ overlay: true });
  };

  removeOverlay = () => {
    this.setState({ overlay: false, errors: [], snackMessage: null });
  };

  onClearSnackBar = () => {
    this.setState({ snackMessage: null });
  };

  getUpdatedTableData = (value, metadata) => {
    let { data } = this.state.tableData;
    if (Array.isArray(data)) {
      data = data.map(item => {
        if (item[this.keyField] === metadata[this.keyField]) {
          return { ...item, [metadata._header.field]: value };
        }
        return item;
      });
    }
    return data;
  };

  validateKey = value => {
    const keyExist = getKeyItem(value, this.state.tableData, this.keyField);
    if (keyExist) {
      throw new Error(
        t(`ERRORS.RULE_TABLE.uniqueKey`, [this.keyFieldDisplayName])
      );
    }
  };

  handleParamChange = (value, data) => {
    try {
      console.log(value, data);
      const { tableData, exceptions, exceptionsSelected } = this.state;

      // Here we can write logic for custum local validation based on input type and name
      const validation = getValidation(data._header);
      const rules =
        data._header && data._header.rules ? data._header.rules : {};
      if (validation) validation(t, value, rules);

      if (data._header.field === this.keyField) {
        this.validateKey(value, this.state.tableData, this.keyField);
      }

      const exceptionType = getHighestExpectionType(
        exceptions,
        exceptionsSelected
      );

      let updatedData = tableData.data;
      let updatedExceptions = exceptions;
      if (exceptionType && Array.isArray(exceptions)) {
        const row = data[this.keyField];
        updatedExceptions = getUpdatedException(
          value,
          data,
          row,
          exceptions,
          exceptionsSelected,
          exceptionType
        );
      } else {
        updatedData = this.getUpdatedTableData(value, data);
      }

      this.setState(prevState => ({
        tableData: { ...prevState.tableData, data: updatedData },
        exceptions: updatedExceptions,
        disableSave: false,
        errors: [],
        overlay: false,
        snackMessage: null,
      }));
    } catch (error) {
      // For handling client validation side error
      const errorObj = { key: data[this.keyField], field: data._header.field };
      this.setState(
        {
          snackMessage: error.message,
          errors: [...this.state.errors, errorObj],
        },
        () => this.setOverlay()
      );

      console.error(error);
    }
  };

  handleSort = sortPayload => {
    const { tableData } = this.state;
    const headerItem = tableData.header.find(
      item => item.field === sortPayload[0].fieldName
    );
    const sortedTableData = new Sort(tableData.data, {
      type: getSortType(headerItem.type),
      direction: sortPayload[0].direction,
      field: sortPayload[0].fieldName,
    }).sort();
    this.setState({
      tableData: { header: tableData.header, data: sortedTableData },
    });
  };

  resolveDynamicEnum = enumType => {
    return this.props.dynamicEnumData[enumType];
  };

  validateHeader = value => {
    const { tableData } = this.state;
    if (tableData) {
      const keyExist = tableData.header.find(item => item.value === value);
      if (keyExist) {
        throw new Error(
          t(`ERRORS.RULE_TABLE.uniqueHeader`, [this.defaultHeaderPlaceholder])
        );
      }
    }
  };

  getUpdatedTableField = (prevField, newField) => {
    let { data } = this.state.tableData;
    if (Array.isArray(data)) {
      data = data.map(item => {
        const newItem = { ...item };
        const value = newItem[prevField];
        newItem[newField] = value;
        delete newItem[prevField];
        return { ...newItem };
      });
    }
    return data;
  };

  handleHeaderValueChange = (value, data) => {
    try {
      const { tableData, defaultHeaderType, defaultHeaderRules } = this.state;

      // Here we can write logic for custum local validation based on input type and name
      const validation = getValidation({ type: defaultHeaderType });
      const rules = defaultHeaderRules ? defaultHeaderRules : {};
      if (validation) validation(t, value, rules);

      this.validateHeader(value);

      // Update table header
      const header = [...tableData.header];
      const prevHeader = header[data.index];
      const prevField = prevHeader.field;
      const field = value ? value.toString() : ''; // Since fields should be always string
      header[data.index] = { ...prevHeader, field, value };

      // Update table data
      const updatedData = this.getUpdatedTableField(prevField, field);

      this.setState({
        tableData: { header, data: updatedData },
        disableSave: false,
        errors: [],
      });
    } catch (error) {
      // For handling client validation side error
      const errorObj = { hfield: data._header.field };
      this.setState(
        {
          snackMessage: error.message,
          errors: [...this.state.errors, errorObj],
        },
        () => this.setOverlay()
      );

      console.error(error);
    }
  };

  handleInsertRow = (index, position, isFooter) => {
    const { tableData, type } = this.state;
    const { header } = tableData;
    let { data } = tableData;

    const newRowData = {};
    const updatedIndex = position === 'above' ? index : index + 1;

    let customeKeyGenerated = false;
    for (const headerItem of header) {
      if (headerItem.isKey) {
        if (
          headerItem.type === 'timeParamType' ||
          headerItem.type === 'dateParamType'
        ) {
          newRowData[headerItem.field] = generateKey(
            headerItem.type,
            tableData,
            this.keyField,
            index,
            position,
            isFooter
          );
          customeKeyGenerated =
            typeof newRowData[headerItem.field] !== 'symbol' ? true : false;
        } else {
          newRowData[headerItem.field] = Symbol(headerItem.field);
        }
      } else {
        const config = getComponentDefaults(headerItem.type);
        newRowData[headerItem.field] = config ? config.defaultValue : '';
      }
    }

    data.splice(updatedIndex, 0, newRowData);

    // If simpleList or list table we need to reorder index key
    if (type === 'simpleList' || type === 'list') {
      data = data.map((item, index) => ({ ...item, code: index + 1 }));
    }

    let updatedTableData = {
      header,
      data,
    };
    // If timeRangeParamType present then we need to create from value of newly added row
    if (this.timeRangeParamType) {
      updatedTableData = generateUpdatedTimeRanges(
        updatedTableData,
        this.timeRangeParamType,
        updatedIndex
      );
    }

    this.setState(
      {
        tableData: updatedTableData,
        disableSave: customeKeyGenerated ? false : true,
      },
      () => {
        if (this.tableRef.current) {
          this.tableRef.current.columsResizing();
          this.tableRef.current.triggerTableBodyVerticalScroll(
            position,
            isFooter
          );
        }
      }
    );
  };

  handleDeleteRow = index => {
    const { tableData, type } = this.state;
    const { header } = tableData;
    let { data } = tableData;

    if (index > -1) {
      data.splice(index, 1);
    }

    // If simpleList or list table we need to reorder index key
    if (type === 'simpleList' || type === 'list') {
      data = data.map((item, index) => ({ ...item, code: index + 1 }));
    }

    this.setState(
      {
        tableData: {
          header,
          data,
        },
        disableSave: false,
      },
      () => {
        if (this.tableRef.current) {
          this.tableRef.current.columsResizing();
        }
      }
    );
  };

  checkEmptyValues = () => {
    if (this.state.tableData) {
      // Check for empty headers
      for (const header of this.state.tableData.header) {
        const value = header.value;
        const field = header.field;
        if (value === '' && typeof field === 'symbol') {
          return true;
        }
      }
      // Check for empty data
      for (const data of this.state.tableData.data) {
        for (const header of this.state.tableData.header) {
          const value = data[header.field];
          if (
            value === undefined ||
            value === null ||
            value === '' ||
            typeof value === 'symbol'
          ) {
            return true;
          }
        }
        // Check whether any of to values in timeRangeParamType empty
        if (this.timeRangeParamType) {
          const value = data['_to'];
          if (
            value === undefined ||
            value === null ||
            value === '' ||
            typeof value === 'symbol'
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  handleInsertColumn = (index, position, isLastColumn) => {
    const {
      tableData,
      defaultHeaderType,
      defaultBodyType,
      enableSort,
    } = this.state;
    const header = [...tableData.header];
    let { data } = tableData;

    const key = Symbol(new Date().getTime());

    // update table header
    const headerConfig = getComponentDefaults(defaultHeaderType);
    const defaultHeaderValue = headerConfig ? headerConfig.defaultValue : '';
    const newHeaderData = {
      field: key,
      value: defaultHeaderValue,
      type: defaultBodyType,
      enableSort,
    };
    const updatedIndex = position === 'left' ? index : index + 1;
    header.splice(updatedIndex, 0, newHeaderData);

    // update table body
    const config = getComponentDefaults(defaultBodyType);
    const defaultBodyValue = config ? config.defaultValue : '';
    data = data.map(item => ({ ...item, [key]: defaultBodyValue }));

    this.setState(
      {
        tableData: {
          header,
          data,
        },
      },
      () => {
        if (this.tableRef.current) {
          this.tableRef.current.columsResizing();
          this.tableRef.current.triggerTableHorizontalScroll(
            index,
            position,
            isLastColumn
          );
        }
      }
    );
  };

  handleDeleteColumn = index => {
    const { tableData } = this.state;
    const header = [...tableData.header];
    let { data } = tableData;

    if (index > -1) {
      const field = header[index].field;
      // Remove header
      header.splice(index, 1);
      // Remove field from header
      data = data.map(item => {
        const newItem = { ...item };
        delete newItem[field];
        return newItem;
      });
    }

    this.setState(
      {
        tableData: {
          header,
          data,
        },
        disableSave: false,
      },
      () => {
        if (this.tableRef.current) {
          this.tableRef.current.columsResizing();
        }
      }
    );
  };

  handleDisable = (value, data) => {
    return this.props.handleDisable();
  };

  handleTooltipDisable = (value, data) => {
    return this.props.handleDisable();
  };

  getTooltipContent = (value, data) => {
    return getTooltipContent(data, this.state.exceptionsSelected);
  };

  handleReset = data => {
    const { exceptionsSelected, exceptions } = this.state;
    const row = data[this.keyField];
    const updatedExceptions = getResetedExceptions(
      data,
      row,
      exceptions,
      exceptionsSelected
    );
    this.setState({ exceptions: updatedExceptions, disableSave: false });
  };

  handleCellOverrides = componentData => {
    const { exceptionsSelected, exceptions } = this.state;

    if (Array.isArray(exceptions)) {
      const row = componentData[this.keyField];
      const column = componentData._header ? componentData._header.field : null;
      const commonProps = {
        enableReset: true,
        handleDisable: this.handleDisable,
        handleTooltipDisable: this.handleTooltipDisable,
        getTooltipContent: this.getTooltipContent,
        handleReset: this.handleReset,
      };

      for (let i = 0; i < exceptions.length; i++) {
        const exception = exceptions[i];
        if (exceptionsSelected[exception.key]) {
          const data = exception.values
            ? exception.values[exceptionsSelected[exception.key]]
            : null;
          const item = data ? data[row] : null;
          const value = item ? item[column] : null;

          if (value) {
            const exceptionMetaInfo = getExpectionMetaInfo(exception.key);
            const readOnly = this.props.handleDisable();
            if (exceptionMetaInfo) {
              const className = exceptionMetaInfo.className;
              const revertTo = exceptionMetaInfo.belongsTo;
              const exceptionType = exception.key;

              return {
                value,
                className: readOnly ? className + '-read-only' : className,
                exceptionType,
                revertTo,
                ...commonProps,
              };
            }
          }
        }
      }
    }
  };

  ruleText = 'DATA.rules';

  render() {
    const {
      open,
      overlay,
      snackMessage,
      type,
      title,
      tableData,
      disableSave,
      errors,
      rowHeader,
      columnHeader,
      defaultHeaderType,
      defaultHeaderRules,
      defaultBodyRules,
      defaultHeaderPlaceholder,
      defaultBodyPlaceholder,
      exceptions,
      exceptionsSelected,
      exceptionState,
    } = this.state;
    const { data, handleDisable, dynamicEnumData } = this.props;

    const {
      paddingBottom,
      showRowOptions,
      showColumnOptions,
      showFooter,
      showColumnDivider,
    } = getTableConfiguration(type);

    const defaultHeaderComponent = getDefaultComponentConfigs(
      defaultHeaderType,
      {
        handleParamChange: this.handleHeaderValueChange,
        removeOverlay: this.removeOverlay,
        resolveDynamicEnum: this.resolveDynamicEnum,
        defaultRules: defaultHeaderRules,
        defaultPlaceholder: defaultHeaderPlaceholder,
        handleDisable,
      }
    );
    const readOnly = handleDisable();

    return (
      <Fragment>
        <Dialog
          title={title}
          formId="rule-table"
          disableSave={
            disableSave || errors.length > 0 || this.checkEmptyValues()
          }
          handleCancel={this.handleCancel}
          onClose={this.handleCancel}
          handleOk={this.handleSave}
          okButton={t('GLOBAL.form.save')}
          cancelButton={t('GLOBAL.form.cancel')}
          closeButton={t('GLOBAL.form.close')}
          open={open}
          maxWidth={false}
          readOnly={readOnly}
          overlayComponent={
            overlay ? (
              <div
                className="rule-table-alert-rule-overlay"
                onClick={this.removeOverlay}
              />
            ) : null
          }
        >
          <Container display={exceptions ? 'flex' : 'block'}>
            {Array.isArray(exceptions) && (
              <ExceptionPanel
                exceptionState={exceptionState}
                exceptions={[...exceptions].reverse()}
                dynamicEnumData={dynamicEnumData}
                exceptionsSelected={exceptionsSelected}
                handleExceptionsSelectedChange={
                  this.handleExceptionsSelectedChange
                }
                handleStateChange={this.handleExceptionStateChange}
              />
            )}
            <TableWrapper paddingBottom={paddingBottom || 0}>
              {Array.isArray(exceptions) && (
                <Breadcrumb
                  exceptions={[...exceptions].reverse()}
                  exceptionsSelected={exceptionsSelected}
                  handleStateChange={this.handleExceptionStateChange}
                  handleExceptionsSelectedChange={
                    this.handleExceptionsSelectedChange
                  }
                />
              )}
              {tableData ? (
                <GenericDynamicTable
                  t={t}
                  ref={this.tableRef}
                  headers={getHeaders(tableData.header, {
                    handleParamChange: this.handleParamChange,
                    removeOverlay: this.removeOverlay,
                    resolveDynamicEnum: this.resolveDynamicEnum,
                    defaultRules: defaultBodyRules,
                    defaultPlaceholder: defaultBodyPlaceholder,
                    handleDisable,
                  })}
                  data={tableData.data}
                  orderBy={tableData.header[0].field}
                  order={'inc'}
                  handleSort={this.handleSort}
                  readOnly={readOnly}
                  errors={errors}
                  keyField={this.keyField}
                  showRowOptions={showRowOptions}
                  showFooter={showFooter}
                  rowHeader={rowHeader}
                  columnHeader={columnHeader}
                  getComponentDefaults={getComponentDefaults}
                  handleInsertRow={this.handleInsertRow}
                  handleDeleteRow={this.handleDeleteRow}
                  defaultHeaderComponent={defaultHeaderComponent}
                  showColumnOptions={showColumnOptions}
                  handleInsertColumn={this.handleInsertColumn}
                  handleDeleteColumn={this.handleDeleteColumn}
                  showColumnDivider={showColumnDivider}
                  cellOverrides={!!exceptions}
                  handleCellOverrides={this.handleCellOverrides}
                />
              ) : (
                <DataNotFound
                  text={t('GLOBAL.dataNotFound.message', {
                    data: t(`${this.ruleText}.name`),
                  })}
                />
              )}
            </TableWrapper>
          </Container>
        </Dialog>
        <OrangeSpan onClick={this.handleOpenDialog}>
          {data.displayValue + ' '}
          <OrangeIconButton aria-label="rule table" size={'small'}>
            <TableChartOutlinedIcon />
          </OrangeIconButton>
        </OrangeSpan>
        <Notification
          message={snackMessage}
          clear={this.onClearSnackBar}
          type={'error'}
          autoHideDuration={360000}
        />
      </Fragment>
    );
  }
}

RuleTableDialog.propTypes = {
  data: PropTypes.shape().isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  reportError: PropTypes.func.isRequired,
  handleDisable: PropTypes.func,
  dynamicEnumData: PropTypes.shape().isRequired,
  fetchMasterData: PropTypes.func.isRequired,
  ruleSet: PropTypes.number.isRequired,
  refreshRules: PropTypes.func.isRequired,
};

RuleTableDialog.defaultProps = {
  handleDisable: () => false,
};

const mapStateToProps = (state, props) => {
  return {
    dynamicEnumData: state.data,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchMasterData: (dataAPI, scenarioId, key) =>
    dispatch(fetchMasterData(dataAPI, scenarioId, key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleTableDialog);
