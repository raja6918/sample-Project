import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { arrayMove } from './../../../../_shared/helpers';

import Grid from '@material-ui/core/Grid';
import MUIFormControl from '@material-ui/core/FormControl';

import InputSelector from '../../../../components/InputSelector';
import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import PositionSeniority from './components/PositionSeniority';
import { Input } from './../Accommodations/FormComponents';

import { preparePositionTypes } from './constants';
import { generateItemsList } from './helpers';
import { getInlineErrorMessage } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;
class PositionsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionName: '',
      positionCode: '',
      positionType: '',
      isFormDirty: false,
      positionsDragAndDropList: [],
      errors: {
        positionName: false,
        positionCode: false,
      },
    };
  }

  sortItems = (oldIndex, newIndex) => {
    const { positionsDragAndDropList } = this.state;
    const reorderedPositions = arrayMove(
      positionsDragAndDropList,
      oldIndex,
      newIndex
    );
    this.setState(
      {
        positionsDragAndDropList: reorderedPositions,
      },
      this.onFormChange
    );
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      const { position, positionsCategorized } = nextProps;

      const positionCode = position ? position.code : '';
      const positionName = position ? position.name : '';
      const positionType = position ? position.typeCode : '';

      const positionsDragAndDropList = generateItemsList(
        {
          positions: positionsCategorized,
          selectedPosition: position,
          positionCode,
          positionName,
          positionType,
        },
        position
      );

      this.setState({
        positionName,
        positionCode,
        positionType,
        positionsDragAndDropList,
        isFormDirty: false,
        errors: {
          positionCode: false,
          positionName: false,
        },
      });
    }

    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkIfFormisReady);
    }
  }

  updateItemsList = (itemsList, positionData) => {
    const targetIdx = itemsList.findIndex(item => item.targetItem);
    itemsList[targetIdx] = {
      ...itemsList[targetIdx],
      ...positionData,
    };
    return itemsList;
  };

  onSelectChange = value => {
    const { positionType, positionCode, positionName } = this.state;

    let newState = {
      positionType: value,
    };

    if (positionType !== value) {
      /* Only generate list when the position type changes */
      const positionsDragAndDropList = generateItemsList({
        positions: this.props.positionsCategorized,
        selectedPosition: this.props.position,
        positionCode,
        positionName,
        positionType: value,
      });

      newState = {
        ...newState,
        positionsDragAndDropList,
      };
    }

    this.setState(newState, this.onFormChange);
  };

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  checkIfFormisReady = () => {
    const node_positionCode = document.getElementById('positionCode');
    const node_positionType = document.getElementById('positionType');

    const positionCode = node_positionCode
      ? node_positionCode.value.trim()
      : '';
    const positionType = node_positionType
      ? node_positionType.value.trim()
      : '';
    const { errors, isFormDirty } = this.state;
    const isError = errors.positionName || errors.positionCode;

    if (
      positionCode !== '' &&
      positionType !== null &&
      positionType !== '' &&
      !isError
    ) {
      if (!isFormDirty) {
        this.setState({
          isFormDirty: true,
        });
      }
    } else {
      if (isFormDirty) {
        this.setState({
          isFormDirty: false,
        });
      }
    }
  };

  onFormChange = () => {
    this.checkIfFormisReady();
  };

  evaluateRegex = (regex, term) => {
    const reg = new RegExp(regex);
    const isValidRegex = reg.test(term);
    return isValidRegex;
  };

  updateErrors = (e, regexp: '') => {
    const event = e.target || e.srcElement;
    const key = event.name;
    const value = event.value;
    const isError = value === '' ? false : !this.evaluateRegex(regexp, value);

    return {
      ...this.state.errors,
      [key]: isError,
    };
  };

  handleChange = (e, regexp: '') => {
    const { inlineError } = this.props;
    const errors = this.updateErrors(e, regexp);
    const inlineErrorMessage = getInlineErrorMessage(e, inlineError);
    const { positionsDragAndDropList } = this.state;

    let propertyKey = null;
    let positionData = {};

    if (e.target.name === 'positionName') {
      propertyKey = 'name';
    } else if (e.target.name === 'positionCode') {
      propertyKey = 'code';
    }

    if (propertyKey) {
      positionData = { [propertyKey]: e.target.value };
    }

    const updatedPositionsDragAndDropList = this.updateItemsList(
      positionsDragAndDropList,
      positionData
    );

    this.setState(
      {
        errors,
        [e.target.name]: e.target.value,
        positionsDragAndDropList: updatedPositionsDragAndDropList,
        inlineErrorMessage,
      },
      this.checkIfFormisReady
    );
  };

  render() {
    const {
      position,
      formId,
      t,
      positionTypes,
      positions,
      readOnly,
      enableReadOnly,
      ...rest
    } = this.props;
    const {
      errors,
      positionType,
      positionName,
      positionCode,
      positionsDragAndDropList,
      inlineErrorMessage,
    } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const addPosition = 'DATA.positions.form';
    const sectionGeneral = 'DATA.positions.form.section.general';
    const errorMsg = 'ERRORS.POSITIONS';

    let codeErrorMessage = t(`${errorMsg}.positionCode`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, position)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        enableReadOnly={enableReadOnly}
        anchor={'right'}
        {...rest}
      >
        <FormHeader>
          <span>
            {getFormHeading(t, position, readOnlyStatus, addPosition)}
          </span>
          <span>{positionName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.positionCode}>
                    <Input
                      inputProps={{
                        name: 'positionCode',
                        maxLength: 10,
                      }}
                      className={errors.positionCode ? 'error' : ''}
                      id="positionCode"
                      label={t(`${sectionGeneral}.positionCode`)}
                      color="secondary"
                      onChange={e =>
                        this.handleChange(
                          e,
                          '^[a-zA-Z0-9]+(?:[-$#&/.,%-_][a-zA-Z0-9)]+)*$'
                        )
                      }
                      value={positionCode}
                      error={errors.positionCode}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.positionCode}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={errors.positionName}>
                    <Input
                      inputProps={{
                        name: 'positionName',
                        maxLength: 50,
                      }}
                      id="positionName"
                      label={t(`${addPosition}.positionName`)}
                      color="secondary"
                      className={errors.positionName ? 'error' : ''}
                      value={positionName}
                      error={errors.positionName}
                      onChange={e => this.handleChange(e, '^[a-zA-Z0-9].*')}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.positionName}
                      message={t(`${errorMsg}.positionName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputSelector
                    name="positionType"
                    label={t(`${sectionGeneral}.positionType`)}
                    required={true}
                    items={preparePositionTypes(positionTypes)}
                    selected={positionType}
                    handleChange={this.onSelectChange}
                    disabled={readOnlyStatus}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <PositionSeniority
                    position={position}
                    positions={positionsDragAndDropList}
                    positionType={positionType}
                    sortItems={this.sortItems}
                    disabled={readOnlyStatus}
                  />
                </Grid>
              </Grid>
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

PositionsForm.propTypes = {
  t: PropTypes.func.isRequired,
  position: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
    typeCode: PropTypes.string,
    typeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
};

PositionsForm.defaultProps = {
  position: {},
  inlineError: null,
};

export default PositionsForm;
