import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import GenericTable from '../../../../components/GenericTable';
import DataNotFound from '../../../../components/DataNotFound';
import EditModeBar from '../../../../components/EditModeBar';
import Notification from '../../../../components/Notification';
import Loading from '../../../../components/Loading';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import PositionsForm from './PositionsForm';

import { orderBy, order, groupBy, getHeaders, type } from './constants.js';
import * as positionsService from '../../../../services/Data/positions';
import { getPositionTypes } from '../../../../services/Data/common';
import { flattenPositionsCategorized } from './helpers';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class Positions extends Component {
  state = {
    positions: [],
    positionTypes: [],
    positionsCategorized: [],
    fetching: true,
    message: null,
    snackType: '',
    selectedPosition: null,
    isFormOpen: false,
  };

  componentDidMount() {
    const { openItemId } = this.props;
    Promise.all([
      getPositionTypes(openItemId),
      positionsService.getCategories(openItemId),
    ])
      .then(([positionTypes, positionsCategorized]) => {
        const flattenPositions = flattenPositionsCategorized(
          positionsCategorized
        );
        this.setState({
          positions: flattenPositions,
          positionTypes,
          fetching: false,
        });
      })
      .catch(err => {
        this.setState({ fetching: false });
        console.error(err);
      });
  }

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  toggleForm = async () => {
    this.props.clearErrorNotification();
    if (this.state.isFormOpen && this.state.selectedPosition) {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
        selectedPosition: null,
      });
    } else {
      const { openItemId } = this.props;
      const positionsCategorized = await positionsService.getCategories(
        openItemId
      );
      this.setState({
        isFormOpen: !this.state.isFormOpen,
        positionsCategorized,
      });
    }
  };

  handleEditItem = async position => {
    const { openItemId } = this.props;
    const selectedPosition = await positionsService.getPosition(
      position.code,
      openItemId
    );
    const positionsCategorized = await positionsService.getCategories(
      openItemId
    );

    this.setState(
      {
        selectedPosition,
        positionsCategorized,
      },
      this.toggleForm
    );
  };

  scrollToPosition = id => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${id}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  editPosition = (position, id) => {
    position.id = id;
    const { openItemId } = this.props;
    positionsService
      .editPosition(position, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Positions',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        positionsService
          .getCategories(openItemId)
          .then(positionsCategorized => {
            const editedPosition = res[0];
            this.setState(
              {
                positions: flattenPositionsCategorized(positionsCategorized),
                positionsCategorized,
                message: this.props.t('SUCCESS.POSITIONS.EDIT', {
                  position: `${editedPosition.name} (${editedPosition.code})`,
                }),
                snackType: 'success',
                isFormOpen: false,
                selectedPosition: null,
              },
              () => {
                this.scrollToPosition(id);
                this.props.clearErrorNotification();
              }
            );
          });
      })
      .catch(error => {
        const inputField = 'positionCode';
        this.props.reportError({ error, inputField });
      });
  };

  addPosition = position => {
    const { openItemId } = this.props;

    positionsService
      .addPosition(position, openItemId)
      .then(res => {
        pushDataToAnalytics({
          type: 'Positions',
          scenarioId: this.props.openItemId,
        });
        positionsService
          .getCategories(openItemId)
          .then(positionsCategorized => {
            this.setState(
              {
                positions: flattenPositionsCategorized(positionsCategorized),
                positionsCategorized,
                message: this.props.t('SUCCESS.POSITIONS.ADD', {
                  position: `${res[0].name} (${res[0].code})`,
                }),
                snackType: 'success',
                isFormOpen: false,
                selectedPosition: null,
              },
              this.props.clearErrorNotification
            );
          });
      })
      .catch(error => {
        const inputField = 'positionCode';
        this.props.reportError({ error, inputField });
      });
  };

  handlePositionsForm = positionsForm => {
    const { selectedPosition } = this.state;
    const position = {
      name: positionsForm.positionName.value.trim(),
      code: positionsForm.positionCode.value.trim().toUpperCase(),
      typeCode: positionsForm.positionType.value,
      order: positionsForm.order.value,
    };

    if (selectedPosition) {
      this.editPosition(position, selectedPosition.id);
    } else {
      this.addPosition(position);
    }
  };

  /*Delete Position*/

  deletePosition = ({ code }) => {
    positionsService
      .deletePosition(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Positions',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          positions: this.state.positions.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.POSITIONS.REMOVE', {
            position: code,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, code);
      });
  };

  handleDelete = () => {
    this.deletePosition(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  render() {
    const {
      t,
      editMode,
      openItemId,
      openItemName,
      inlineError,
      deleteDialogIsOpen,
      deleteDialogItem,
      openDeleteDialog,
      exitDeleteDialog,
      closeDeleteDialog,
      readOnly,
      ...rest
    } = this.props;
    const dataScopes = editMode
      ? scopes.dataCardPage.dataTemplate
      : scopes.dataCardPage.dataScenario;
    const {
      positions,
      positionTypes,
      positionsCategorized,
      fetching,
      isFormOpen,
      selectedPosition,
      message,
      snackType,
    } = this.state;
    const positionsText = 'DATA.positions';

    if (fetching) {
      return <Loading />;
    } else
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t(`${positionsText}.name`)}
            onClick={this.toggleForm}
            editMode={editMode}
            openItemId={openItemId}
            openItemName={openItemName}
            scopes={dataScopes}
            disableAdd
            {...rest}
            className="tm-scenario_data_positions__create-btn"
          />
          <Container>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <PositionsForm
                  position={selectedPosition}
                  positionsCategorized={positionsCategorized}
                  positionTypes={positionTypes}
                  isOpen={isFormOpen}
                  handleCancel={this.toggleForm}
                  handleOk={this.handlePositionsForm}
                  formId={'positionsForm'}
                  t={t}
                  onClose={this.toggleForm}
                  inlineError={inlineError}
                  readOnly={readOnly}
                  enableReadOnly={props.disableComponent}
                />
              )}
            />
            <Notification
              message={message}
              clear={this.onClearSnackBar}
              type={snackType}
            />
            <DeleteDialog
              open={deleteDialogIsOpen}
              handleOk={this.handleDelete}
              onExited={exitDeleteDialog}
              handleCancel={closeDeleteDialog}
              modalCommand={true}
              onClose={closeDeleteDialog}
              okText={t('GLOBAL.form.delete')}
              title={t('DIALOG.DELETE_DATA.title', {
                type: t(type).toLowerCase(),
                name: deleteDialogItem.code || ' ',
              })}
              bodyText={t('DIALOG.DELETE_DATA.body', {
                type: t(type).toLowerCase(),
                name: deleteDialogItem.code || ' ',
              })}
              t={t}
            />
            {positions.length ? (
              <AccessEnabler
                scopes={dataScopes}
                disableComponent
                render={props => (
                  <GenericTable
                    headers={getHeaders(t)}
                    data={positions}
                    totalDataSize={positions.length}
                    orderBy={orderBy}
                    order={order}
                    handleDeleteItem={openDeleteDialog}
                    handleEditItem={this.handleEditItem}
                    name={t(`${positionsText}.name`)}
                    t={t}
                    editMode={editMode}
                    groupBy={groupBy}
                    handleDisableEdit={() => props.disableComponent}
                    handleDisableDelete={() => props.disableComponent}
                  />
                )}
              />
            ) : (
              <DataNotFound
                text={t('GLOBAL.dataNotFound.message', {
                  data: t(`${positionsText}.name`).toLowerCase(),
                })}
              />
            )}
          </Container>
        </React.Fragment>
      );
  }
}

Positions.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  reportError: PropTypes.func.isRequired,
  inlineError: PropTypes.shape(),
  clearErrorNotification: PropTypes.func.isRequired,
  handleDeleteError: PropTypes.func.isRequired,
  deleteDialogItem: PropTypes.shape().isRequired,
  deleteDialogIsOpen: PropTypes.bool.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  closeDeleteDialog: PropTypes.func.isRequired,
  exitDeleteDialog: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

Positions.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(Positions)(type));
