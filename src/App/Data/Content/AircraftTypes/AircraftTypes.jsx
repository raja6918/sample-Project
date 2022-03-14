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
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';

import { order, orderBy, getHeaders, INITIAL_ITEMS, type } from './Constants';
import AircraftTypesForm from './AircraftTypesForm';

import * as positionsService from '../../../../services/Data/positions';
import * as aircraftModelsService from '../../../../services/Data/aircraftModels';
import * as aircraftTypesService from '../../../../services/Data/aircraftTypes';
import { getRestFacilities } from '../../../../services/Data/common';

import { DEBUG_MODE } from './../../../../_shared/constants';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class AircraftTypes extends Component {
  state = {
    aircrafts: [],
    fetching: true,
    selectedAircraft: null,
    isFormOpen: false,
    message: null,
    snackType: '',
    totalDataSize: 0,
  };
  crewComposition = [];

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  componentDidMount() {
    const scenarioId = this.props.openItemId;
    Promise.all([
      aircraftTypesService.getAircrafts(scenarioId, this.paginationPayload),
      positionsService.getCategories(scenarioId),
      aircraftModelsService.getModels(scenarioId),
      getRestFacilities(scenarioId),
    ])
      .then(([aircrafts, positions, models, restFacilities]) => {
        const formattedAircraftData = aircrafts.data.map(aircraft => {
          return {
            ...aircraft,
            standardComplement: this.generateCrewCompositionString(aircraft),
          };
        });

        this.setState({
          aircrafts: formattedAircraftData,
          totalDataSize: aircrafts.totalDataSize,
          positions,
          models,
          restFacilities,
          fetching: false,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  generateCrewCompositionString = aircraft => {
    const crewComposition = aircraft.crewComposition.map(
      position => `${position.quantity} ${position.positionCode}`
    );

    return crewComposition.join(', ');
  };

  createAircraft_DEPRECATED = (aircraft, models, positions) => {
    const positionsIDs = aircraft.crewComposition
      .filter(c => parseInt(c.quantity, 10) !== 0)
      .map(item => parseInt(item.id, 10));

    aircraft.standardComplement = positions
      .reduce((acc, positionCategorized) => {
        const currentPositions = positionCategorized.positions.filter(p => {
          return positionsIDs.indexOf(p.id) !== -1;
        });
        currentPositions.forEach(p => {
          aircraft.crewComposition.forEach(item => {
            if (p.id === parseInt(item.id, 10)) {
              acc.push(`${parseInt(item.quantity, 10)} ${p.code}`);
            }
          });
        });
        return acc;
      }, [])
      .join(', ');

    return aircraft;
  };

  toggleForm = () => {
    this.props.clearErrorNotification();
    if (this.state.isFormOpen && this.state.selectedAircraft) {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
        selectedAircraft: null,
      });
    } else {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
      });
    }
  };
  scrollToAircraft = id => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${id}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };
  editAircraft = (aircraft, id) => {
    aircraft.id = id;
    const aircraftsList = [...this.state.aircrafts];
    aircraftTypesService
      .editAircraft(aircraft, this.props.openItemId)
      .then(response => {
        pushDataToAnalytics(
          {
            type: 'Aircraft Types',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedAircraft = response[0];
        editedAircraft.standardComplement = this.generateCrewCompositionString(
          editedAircraft
        );

        const editedIndex = aircraftsList.findIndex(
          aircraftItem => aircraftItem.id === id
        );
        aircraftsList[editedIndex] = editedAircraft;

        this.setState(
          {
            aircrafts: aircraftsList,
            message: this.props.t('SUCCESS.AIRCRAFT.EDIT', {
              aircraft: `${editedAircraft.name} (${editedAircraft.code})`,
            }),
            snackType: 'success',
          },
          this.scrollToAircraft(id)
        );
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'aircraftType';
        this.props.reportError({ error, inputField });
      });
  };
  addAircraft = aircraft => {
    aircraftTypesService
      .addAircraft(aircraft, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics({
          type: 'Aircraft Types',
          scenarioId: this.props.openItemId,
        });
        const addedAircraft = res[0];

        addedAircraft.standardComplement = this.generateCrewCompositionString(
          addedAircraft
        );

        this.setState(state => ({
          aircrafts: [addedAircraft, ...state.aircrafts],
          message: this.props.t('SUCCESS.AIRCRAFT.ADD', {
            aircraft: `${addedAircraft.name} (${addedAircraft.code})`,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'aircraftType';
        this.props.reportError({ error, inputField });
      });
  };

  clearCrewComposition = crewComposition => {
    const filteredCrewComposition = crewComposition.filter(
      position => position.quantity > 0
    );
    return filteredCrewComposition;
  };

  handleAircraftForm = aircraftForm => {
    const aircraft = {
      modelCode: aircraftForm.aircraftModel.value,
      name: aircraftForm.aircraftName.value.trim(),
      restFacilityCode: aircraftForm.restFacility.value,
      code: aircraftForm.aircraftType.value.trim().toUpperCase(),
      crewComposition: this.clearCrewComposition(this.crewComposition),
    };

    if (this.state.selectedAircraft) {
      this.editAircraft(aircraft, this.state.selectedAircraft.id);
    } else {
      this.addAircraft(aircraft);
    }
  };

  handleCrewComplements = crewComposition => {
    this.crewComposition = crewComposition;
  };
  handleSort = sortPayload => {
    const { openItemId: scenarioId } = this.props;
    this.paginationPayload = {
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    aircraftTypesService
      .getAircrafts(scenarioId, this.paginationPayload)
      .then(aircrafts => {
        const formattedAircraftData = aircrafts.data.map(aircraft => {
          return {
            ...aircraft,
            standardComplement: this.generateCrewCompositionString(aircraft),
          };
        });

        this.setState({
          aircrafts: formattedAircraftData,
          totalDataSize: aircrafts.totalDataSize,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleEditItem = async aircraft => {
    const { openItemId } = this.props;
    const selectedAircraft = await aircraftTypesService.getAircraft(
      aircraft.code,
      openItemId
    );

    this.setState(
      {
        selectedAircraft,
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

    aircraftTypesService
      .getAircrafts(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const formattedAircraftData = response.data.map(aircraft => {
          return {
            ...aircraft,
            standardComplement: this.generateCrewCompositionString(aircraft),
          };
        });

        const newAircraftTypesData = [
          ...this.state.aircrafts,
          ...formattedAircraftData,
        ];

        this.setState({ aircrafts: newAircraftTypesData });
      });
  };

  deleteAircraft = ({ code }) => {
    aircraftTypesService
      .deleteAircraft(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Aircraft Types',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          aircrafts: this.state.aircrafts.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.AIRCRAFT.REMOVE', {
            aircraft: code,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, code);
      });
  };

  handleDelete = () => {
    this.deleteAircraft(this.props.deleteDialogItem);
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
      aircrafts,
      models,
      restFacilities,
      fetching,
      selectedAircraft,
      isFormOpen,
      message,
      snackType,
      totalDataSize,
    } = this.state;
    const aircraftText = 'DATA.aircraft';
    if (fetching) {
      return <Loading />;
    } else
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t(`${aircraftText}.name`)}
            onClick={this.toggleForm}
            editMode={editMode}
            openItemId={openItemId}
            openItemName={openItemName}
            redirectLink={
              <RedirectLink
                to={{
                  pathname: `aircraft/models`,
                  state: {
                    openItemId: openItemId,
                    openItemName: openItemName,
                    editMode: editMode,
                    readOnly,
                  },
                }}
                scopes={dataScopes}
                disableAdd
              >
                {t('DATA.aircraftModels.link')}
              </RedirectLink>
            }
            scopes={dataScopes}
            disableAdd
            readOnly={readOnly}
            className="tm-scenario_data_aircraft_types__create-btn"
            {...rest}
          />

          <Container>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <AircraftTypesForm
                  models={models}
                  restFacilities={restFacilities}
                  aircraft={selectedAircraft}
                  isOpen={isFormOpen}
                  handleCancel={this.toggleForm}
                  handleOk={this.handleAircraftForm}
                  formId={'aircraftForm'}
                  t={t}
                  onClose={this.toggleForm}
                  handleCrewComplements={this.handleCrewComplements}
                  openItemId={openItemId}
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
            {aircrafts.length ? (
              <AccessEnabler
                scopes={dataScopes}
                disableComponent
                render={props => (
                  <GenericTable
                    headers={getHeaders(t)}
                    data={[...aircrafts]}
                    totalDataSize={totalDataSize}
                    orderBy={orderBy}
                    order={order}
                    handleDeleteItem={openDeleteDialog}
                    handleEditItem={this.handleEditItem}
                    handleFetchData={this.fetchData}
                    name={t(`${aircraftText}.nameTypes`)}
                    t={t}
                    editMode={editMode}
                    handleSort={this.handleSort}
                    handleDisableEdit={() => props.disableComponent}
                    handleDisableDelete={() => props.disableComponent}
                  />
                )}
              />
            ) : (
              <DataNotFound
                text={t('GLOBAL.dataNotFound.message', {
                  data: t(`${aircraftText}.name`).toLowerCase(),
                })}
              />
            )}
          </Container>
        </React.Fragment>
      );
  }
}
AircraftTypes.propTypes = {
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

AircraftTypes.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(AircraftTypes)(type));
