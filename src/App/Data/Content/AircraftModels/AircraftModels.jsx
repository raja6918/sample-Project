import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import GenericTable from '../../../../components/GenericTable';
import DataNotFound from '../../../../components/DataNotFound';
import EditModeBar from '../../../../components/EditModeBar';
import Loading from '../../../../components/Loading';
import Notification from '../../../../components/Notification';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import RedirectLink from '../../../../components/RedirectLink';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import AircraftModelForm from './AircraftModelForm';

import * as aircraftModelsService from '../../../../services/Data/aircraftModels';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import {
  orderBy,
  order,
  getHeaders,
  INITIAL_ITEMS,
  type,
} from './constants.jsx';
import { DEBUG_MODE } from './../../../../_shared/constants';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class AircraftModels extends Component {
  state = {
    models: [],
    fetching: true,
    message: null,
    snackType: '',
    isFormOpen: false,
    selectedModel: null,
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  componentDidMount() {
    aircraftModelsService
      .getModels(this.props.openItemId, this.paginationPayload)
      .then(models => {
        this.setState({
          models: models.data,
          totalDataSize: models.totalDataSize,
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

  toggleForm = () => {
    this.props.clearErrorNotification();
    const { isFormOpen, selectedModel } = this.state;
    const dataToUpdate = { selectedModel, isFormOpen: !isFormOpen };

    if (isFormOpen && selectedModel) dataToUpdate.selectedModel = null;

    this.setState(dataToUpdate);
  };

  addModel = model => {
    return aircraftModelsService
      .addModel(model, this.props.openItemId)
      .then(m => {
        pushDataToAnalytics({
          type: 'Aircraft Models',
          scenarioId: this.props.openItemId,
        });
        const addedModel = m[0];
        this.setState(state => ({
          models: [addedModel, ...state.models],
          message: this.props.t('SUCCESS.AIRCRAFT_MODELS.ADD', {
            model: m[0],
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'modelCode';
        this.props.reportError({ error, inputField });
      });
  };

  editModel = (model, id) => {
    model.id = id;
    const modelsList = [...this.state.models];
    return aircraftModelsService
      .editModel(model, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Aircraft Models',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedModel = res[0];
        const editedModelIndex = modelsList.findIndex(
          modelItem => modelItem.id === id
        );
        modelsList[editedModelIndex] = editedModel;
        this.setState(
          {
            models: modelsList,
            message: this.props.t('SUCCESS.AIRCRAFT_MODELS.EDIT', {
              model,
            }),
            snackType: 'success',
          },
          () => this.scrollToUpdatedItem(id)
        );
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'modelCode';
        this.props.reportError({ error, inputField });
      });
  };

  scrollToUpdatedItem = itemId => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${itemId}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  handleForm = form => {
    const { selectedModel } = this.state;
    const dataToSave = {
      name: form.modelName.value.trim(),
      code: form.modelCode.value.trim().toUpperCase(),
    };

    if (selectedModel) this.editModel(dataToSave, selectedModel.id);
    else this.addModel(dataToSave);
  };

  handleSort = sortPayload => {
    const { openItemId: scenarioId } = this.props;

    this.paginationPayload = {
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    aircraftModelsService
      .getModels(scenarioId, this.paginationPayload)
      .then(models => {
        this.setState({
          models: models.data,
          totalDataSize: models.totalDataSize,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleEditItem = async model => {
    const { openItemId } = this.props;
    const selectedModel = await aircraftModelsService.getModel(
      model.code,
      openItemId
    );

    this.setState(
      {
        selectedModel,
      },
      this.toggleForm
    );
  };

  fetchData = nextItems => {
    const timerStart = Date.now();
    const { totalDataSize } = this.state;
    const { endIndex: currentEndIndex } = this.paginationPayload;

    if (
      currentEndIndex === totalDataSize ||
      (totalDataSize > 0 && currentEndIndex > totalDataSize)
    )
      return;

    const { openItemId } = this.props;

    const nextStartIndex = currentEndIndex;
    let nextEndIndex = currentEndIndex + nextItems;

    if (nextEndIndex > totalDataSize) {
      nextEndIndex = totalDataSize;
    }

    this.paginationPayload = {
      ...this.paginationPayload,
      startIndex: nextStartIndex,
      endIndex: nextEndIndex,
    };

    aircraftModelsService
      .getModels(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const newModelsData = [...this.state.models, ...response.data];

        this.setState({ models: newModelsData });
      });
  };

  deleteAircraftModel = ({ code, name }) => {
    aircraftModelsService
      .deleteModel(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Aircraft Models',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          models: this.state.models.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.AIRCRAFT_MODELS.REMOVE', {
            modelcode: code,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, code);
      });
  };

  handleDelete = () => {
    this.deleteAircraftModel(this.props.deleteDialogItem);
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
    const {
      models,
      fetching,
      selectedModel,
      isFormOpen,
      message,
      snackType,
      totalDataSize,
    } = this.state;
    const entityText = 'DATA.aircraftModels';

    if (fetching) return <Loading />;

    const dataScopes = editMode
      ? scopes.dataCardPage.dataTemplate
      : scopes.dataCardPage.dataScenario;
    return (
      <React.Fragment>
        <AddHeader
          t={t}
          name={t(`${entityText}.name`)}
          onClick={this.toggleForm}
          editMode={editMode}
          openItemId={openItemId}
          openItemName={openItemName}
          className="tm-scenario_data_aircraft_models__create-btn"
          redirectLink={
            <RedirectLink
              to={{
                pathname: `../aircraft`,
                state: {
                  editMode,
                  openItemId,
                  openItemName,
                  readOnly,
                },
              }}
              scopes={dataScopes}
              disableAdd
            >
              {t('GLOBAL.redirectTo', {
                data: t('DATA.aircraft.name').toLowerCase(),
              })}
            </RedirectLink>
          }
          scopes={dataScopes}
          disableAdd
          readOnly={readOnly}
          {...rest}
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          <AccessEnabler
            scopes={dataScopes}
            disableComponent
            render={props => (
              <AircraftModelForm
                model={selectedModel}
                isOpen={isFormOpen}
                handleCancel={this.toggleForm}
                handleOk={this.handleForm}
                formId={'modelsForm'}
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
          {totalDataSize ? (
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <GenericTable
                  headers={getHeaders(t)}
                  data={models}
                  totalDataSize={totalDataSize}
                  orderBy={orderBy}
                  order={order}
                  handleDeleteItem={openDeleteDialog}
                  handleEditItem={this.handleEditItem}
                  handleFetchData={this.fetchData}
                  name={t(`${entityText}.name`)}
                  t={t}
                  handleDisableEdit={() => props.disableComponent}
                  handleDisableDelete={() => props.disableComponent}
                  handleSort={this.handleSort}
                  editMode={editMode}
                />
              )}
            />
          ) : (
            <DataNotFound
              text={t('GLOBAL.dataNotFound.message', {
                data: t(`${entityText}.name`).toLowerCase(),
              })}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

AircraftModels.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
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

AircraftModels.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(AircraftModels)(type));
