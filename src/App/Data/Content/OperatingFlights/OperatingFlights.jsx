import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { union } from 'lodash';
import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import TableMessage from '../../../../components/GenericTable/TableMessage';
import GenericTable from '../../../../components/GenericTable';
import DataNotFound from '../../../../components/DataNotFound';
import EditModeBar from '../../../../components/EditModeBar';
import Loading from '../../../../components/Loading';
import OperatingFlightsForm from './OperatingFlightsForm';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import Notification from '../../../../components/Notification';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';
import storage from '../../../../utils/storage';

import {
  orderBy,
  order,
  getHeaders,
  translationPath,
  TIME_REFERENCE,
  INITIAL_ITEMS,
  type,
} from './constants.js';

import { DEBUG_MODE } from './../../../../_shared/constants';

import {
  formatData,
  getTimeReferenceConfig,
  formatFlight,
  checkEmptyFilter,
} from './helpers.js';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';

import * as flightsService from '../../../../services/Data/operatingFlights';
import * as stationsService from '../../../../services/Data/stations';
import * as aircraftTypesService from '../../../../services/Data/aircraftTypes';
import * as positionsService from '../../../../services/Data/positions';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class OperatingFlights extends Component {
  state = {
    flightsData: [],
    fetching: true,
    selectedItem: null,
    isFormOpen: false,
    message: null,
    snackType: '',
    totalDataSize: 0,
    flightCount: 0,
    isFilter: false,
    filteredDataSize: 0,
  };

  operatingFlightsPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
    filterCriteria: {},
  };

  totalDataSize = null;

  componentDidMount() {
    const { openItemId } = this.props;

    Promise.all([
      aircraftTypesService.getAircrafts(openItemId),
      positionsService.getCategories(openItemId),
      stationsService.getStations(openItemId),
      flightsService.getAirlineIdentifiers(openItemId),
      flightsService.getServiceTypes(openItemId),
      flightsService.getTags(openItemId),
      flightsService.getOperatingFlights(
        openItemId,
        this.operatingFlightsPayload
      ),
    ])
      .then(
        ([
          aircrafts,
          positions,
          stations,
          airlines,
          services,
          tags,
          operatingFlights,
        ]) => {
          this.setState({
            flightsData: formatData(operatingFlights.data),
            totalDataSize: operatingFlights.totalDataSize,
            aircrafts: aircrafts.data,
            positions,
            stations: stations.data,
            airlines,
            services,
            tags,
            fetching: false,
          });
        }
      )
      .catch(err => {
        console.error(err);
      });

    this.setOperatingFlightCount();
  }

  setOperatingFlightCount = () => {
    const { openItemId } = this.props;
    return flightsService
      .getOperatingFlightCount(openItemId)
      .then(flightCount => {
        this.setState({
          flightCount: flightCount.count,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleEditItem = summaryItem => {
    const selectedItem = this.state.flightsData.find(
      flight => flight.id === summaryItem.id
    );

    this.setState(
      {
        selectedItem,
      },
      this.toggleForm
    );
  };

  toggleForm = () => {
    if (this.state.isFormOpen && this.state.selectedItem) {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
        selectedItem: null,
      });
    } else {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
      });
    }
  };

  handleCrewComplements = crewComposition => {
    this.crewComposition = crewComposition;
  };

  handleFlightForm = (flight, id) => {
    if (id === null) {
      this.addOperatingFlight(flight);
    } else {
      this.editOperatingFlight(flight, id);
    }
  };

  addOperatingFlight = flight => {
    const index = this.state.flightsData.length;

    flightsService
      .addOperatingFlight(flight, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Operating Flights',
          scenarioId: this.props.openItemId,
        });
        this.setOperatingFlightCount().finally(() => {
          if (this.state.isFilter) {
            this.handleFilter(this.operatingFlightsPayload.filterCriteria);
          }
          this.setState(prevState => ({
            flightsData: [formatFlight(r[0], index), ...prevState.flightsData],
            tags: union(prevState.tags, r[0].tags),
            totalDataSize: this.state.totalDataSize + 1,
            // flightsData: [...state.flightsData, formatFlight(r[0], index)],
            message: this.props.t('SUCCESS.OPERATING_FLIGHTS.ADD', {
              flightNumber: r[0].flightNumber,
            }),
            snackType: 'success',
          }));
          this.toggleForm();
        });
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  editOperatingFlight = (flight, flightId) => {
    const flightsData = this.state.flightsData;

    flightsService
      .editOperatingFlight(flight, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics(
          {
            type: 'Operating Flights',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedFlight = r[0];

        const editedIndex = flightsData.findIndex(
          edditedFlight => edditedFlight.id === flightId
        );

        flightsData[editedIndex] = formatFlight(editedFlight, flightId);

        this.setOperatingFlightCount().finally(() => {
          if (this.state.isFilter) {
            this.handleFilter(this.operatingFlightsPayload.filterCriteria);
          }
          this.setState(
            prevState => ({
              flightsData,
              tags: union(prevState.tags, r[0].tags),
              message: this.props.t('SUCCESS.OPERATING_FLIGHTS.EDIT', {
                flightNumber: r[0] ? r[0].flightNumber : '',
              }),
              snackType: 'success',
            }),
            () => this.scrollToUpdatedItem(flightId)
          );
          this.toggleForm();
        });
      })
      .catch(error => {
        this.props.reportError({ error });
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

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  componentWillUpdate() {
    this.timerStart = Date.now();
  }

  componentDidUpdate() {
    if (DEBUG_MODE) {
      const elapsedTime = (Date.now() - this.timerStart) / 1000;
      // eslint-disable-next-line
      console.log('>>> Render time:', `${elapsedTime} seconds`);
    }
  }

  handleSort = sortPayload => {
    const { openItemId } = this.props;

    this.operatingFlightsPayload = {
      ...this.operatingFlightsPayload,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    flightsService
      .getOperatingFlights(openItemId, this.operatingFlightsPayload)
      .then(response => {
        const newFlightsData = formatData(response.data);
        this.setState({ flightsData: newFlightsData });
      });
  };

  handleFilter = filters => {
    const isEmpTyFilterObj = checkEmptyFilter(filters);
    const { openItemId } = this.props;
    this.operatingFlightsPayload = {
      ...this.operatingFlightsPayload,
      filterCriteria: filters,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
    };
    flightsService
      .getOperatingFlightsBasedOnFilter(
        openItemId,
        this.operatingFlightsPayload
      )
      .then(response => {
        this.setState({
          flightsData: formatData(response.data),
          isFilter: isEmpTyFilterObj ? true : false,
          filteredDataSize: response.totalDataSize,
        });
      })
      .catch(err => {
        this.setState({
          flightsData: [],
          isFilter: isEmpTyFilterObj ? true : false,
          filteredDataSize: 0,
        });
        console.error(err);
      });
  };

  fetchData = nextItems => {
    const timerStart = Date.now();
    const { totalDataSize, isFilter, filteredDataSize } = this.state;
    const { openItemId } = this.props;
    const { endIndex: currentEndIndex } = this.operatingFlightsPayload;

    if (
      currentEndIndex === totalDataSize ||
      (totalDataSize > 0 && currentEndIndex > totalDataSize) ||
      (isFilter && currentEndIndex > filteredDataSize)
    )
      return;

    const nextStartIndex = currentEndIndex;
    let nextEndIndex = currentEndIndex + nextItems;

    if (nextEndIndex > totalDataSize) {
      nextEndIndex = totalDataSize;
    }

    this.operatingFlightsPayload = {
      ...this.operatingFlightsPayload,
      startIndex: nextStartIndex,
      endIndex: nextEndIndex,
    };

    flightsService
      .getOperatingFlights(openItemId, this.operatingFlightsPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        //temp fix , required unique id for operating flights
        const newFlightsData = formatData([
          ...this.state.flightsData,
          ...response.data,
        ]);

        this.setState({ flightsData: newFlightsData });
      });
  };

  /*Delete Operating Flight*/

  deleteOperatingFlight = flightAggregates => {
    const { _original, id, flightDesignator } = flightAggregates;
    const flightInstances = flightAggregates.flightInstances.map(
      instance => instance.id
    );

    flightsService
      .deleteOperatingFlight(
        {
          ..._original,
          startDates: [], // For deleting operating flight
          flightInstances,
        },
        this.props.openItemId
      )
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Operating Flights',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        const { flightsData, totalDataSize } = this.state;
        this.setOperatingFlightCount().finally(() => {
          if (this.state.isFilter) {
            this.handleFilter(this.operatingFlightsPayload.filterCriteria);
          }
          this.setState({
            flightsData: flightsData.filter(item => item.id !== id),
            totalDataSize: totalDataSize - 1,
            message: this.props.t('SUCCESS.OPERATING_FLIGHTS.REMOVE', {
              flightDesignator: flightDesignator,
            }),
            snackType: 'success',
          });
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, flightDesignator);
      });
  };

  handleDelete = () => {
    this.deleteOperatingFlight(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  getScenarioDates = () => {
    const scenario = storage.getItem('openScenario');
    return {
      startDate: scenario ? scenario.startDate : '',
      endDate: scenario ? scenario.endDate : '',
    };
  };

  render() {
    const {
      t,
      editMode,
      openItemId,
      openItemName,
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
      flightsData,
      fetching,
      selectedItem,
      isFormOpen,
      aircrafts,
      positions,
      stations,
      airlines,
      services,
      tags,
      message,
      snackType,
      totalDataSize,
      flightCount,
      isFilter,
      filteredDataSize,
    } = this.state;
    const [timeReferenceText] = getTimeReferenceConfig(TIME_REFERENCE, t);

    if (fetching) {
      return <Loading />;
    } else {
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t(`${translationPath}.name`)}
            onClick={this.toggleForm}
            editMode={editMode}
            openItemId={openItemId}
            openItemName={openItemName}
            scopes={dataScopes}
            disableAdd
            {...rest}
            className="tm-scenario_data_operating_flights__create-btn"
          />
          <Container>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
            <TableMessage>
              <span className="bold">
                {`Time reference: ${timeReferenceText}`}
              </span>
            </TableMessage>
            {flightsData.length || isFilter ? (
              <AccessEnabler
                scopes={dataScopes}
                disableComponent
                render={props => (
                  <GenericTable
                    headers={getHeaders(t, this.getScenarioDates().startDate)}
                    data={flightsData}
                    totalDataSize={totalDataSize}
                    orderBy={orderBy}
                    order={order}
                    handleDeleteItem={openDeleteDialog}
                    handleEditItem={this.handleEditItem}
                    handleFilter={this.handleFilter}
                    handleFetchData={this.fetchData}
                    handleSort={this.handleSort}
                    isFilter={isFilter}
                    filteredDataSize={filteredDataSize}
                    name={t(`${translationPath}.footerName`, {
                      flightCount,
                    })}
                    frontEndFilterdisabled={true}
                    t={t}
                    editMode={editMode}
                    handleDisableEdit={() => props.disableComponent}
                    handleDisableDelete={() => props.disableComponent}
                  />
                )}
              />
            ) : (
              <DataNotFound
                text={t('GLOBAL.dataNotFound.message', {
                  data: t(`${translationPath}.name`).toLowerCase(),
                })}
              />
            )}
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <OperatingFlightsForm
                  airlines={airlines}
                  services={services}
                  aircrafts={aircrafts}
                  positions={positions}
                  selectedItem={selectedItem}
                  stations={stations}
                  isOpen={isFormOpen}
                  tagsSource={tags}
                  handleCancel={this.toggleForm}
                  handleOk={this.handleFlightForm}
                  formId={'operatingFlightsForm'}
                  t={t}
                  onClose={this.toggleForm}
                  handleCrewComplements={this.handleCrewComplements}
                  openItemId={openItemId}
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
                name: deleteDialogItem.flightDesignator || ' ',
              })}
              bodyText={t('DIALOG.DELETE_DATA.body', {
                type: t(type).toLowerCase(),
                name: deleteDialogItem.flightDesignator || ' ',
              })}
              t={t}
            />
          </Container>
        </React.Fragment>
      );
    }
  }
}

OperatingFlights.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  reportError: PropTypes.func.isRequired,
  handleDeleteError: PropTypes.func.isRequired,
  deleteDialogItem: PropTypes.shape().isRequired,
  deleteDialogIsOpen: PropTypes.bool.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  closeDeleteDialog: PropTypes.func.isRequired,
  exitDeleteDialog: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default withErrorHandler(withDeleteHandler(OperatingFlights)(type));
