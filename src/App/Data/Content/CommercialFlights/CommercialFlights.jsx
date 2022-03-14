import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { union } from 'lodash';
import CommercialFlightstsForm from './CommercialFlightsForm';
import Notification from '../../../../components/Notification';
import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import GenericTable from '../../../../components/GenericTable';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import DataNotFound from '../../../../components/DataNotFound';
import TableMessage from '../../../../components/GenericTable/TableMessage';
import EditModeBar from '../../../../components/EditModeBar';
import Loading from '../../../../components/Loading';
import storage from '../../../../utils/storage';
import * as flightsService from '../../../../services/Data/commercialFlights';
import { getTimeReferenceConfig, checkEmptyFilter } from './helpers.js';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import { DEBUG_MODE } from './../../../../_shared/constants';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';
import {
  orderBy,
  order,
  getHeaders,
  translationPath,
  TIME_REFERENCE,
  INITIAL_ITEMS,
  type,
} from './constants.js';
import * as stationsService from '../../../../services/Data/stations';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';

export class CommercialFlights extends Component {
  state = {
    fetching: true,
    message: null,
    snackType: '',
    totalDataSize: 0,
    filteredDataSize: 0,
    flightCount: 0,
    isFilter: false,
    flightsData: [],
    isFormOpen: false,
    selectedItem: null,
  };

  commercialFlightsPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
    filterCriteria: {},
  };

  componentDidMount() {
    const { openItemId } = this.props;

    Promise.all([
      flightsService.getCommercialFlights(
        openItemId,
        this.commercialFlightsPayload
      ),
      stationsService.getStations(openItemId),
      flightsService.getTags(openItemId),
    ])
      .then(([flights, stations, tags]) => {
        this.setState({
          flightsData: flights.data,
          totalDataSize: flights.totalDataSize,
          stations: stations.data,
          tags,
          fetching: false,
        });
      })
      .catch(err => {
        console.error(err);
      });
    this.setCommercialFlightCount();
  }

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

  handleSort = sortPayload => {
    const { openItemId } = this.props;

    this.commercialFlightsPayload = {
      ...this.commercialFlightsPayload,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    flightsService
      .getCommercialFlights(openItemId, this.commercialFlightsPayload)
      .then(response => {
        const newFlightsData = response.data;
        this.setState({ flightsData: newFlightsData });
      });
  };

  handleFilter = filters => {
    const isEmpTyFilterObj = checkEmptyFilter(filters);
    const { openItemId } = this.props;
    this.commercialFlightsPayload = {
      ...this.commercialFlightsPayload,
      filterCriteria: filters,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
    };
    flightsService
      .getCommercialFlights(openItemId, this.commercialFlightsPayload)
      .then(response => {
        this.setState({
          flightsData: response.data,
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

  deleteCommercialFlight = flightAggregates => {
    const { id, flightDesignator } = flightAggregates;

    flightsService
      .deleteCommercialFlight(id, this.props.openItemId)
      .then(() => {
        const { flightsData, totalDataSize } = this.state;
        // this.setOperatingFlightCount().finally(() => {
        if (this.state.isFilter) {
          this.handleFilter(this.operatingFlightsPayload.filterCriteria);
        }
        this.setState({
          flightsData: flightsData.filter(item => item.id !== id),
          totalDataSize: totalDataSize - 1,
          message: this.props.t('SUCCESS.COMMERCIAL_FLIGHTS.REMOVE', {
            flightDesignator: flightDesignator,
          }),
          snackType: 'success',
        });
        // });
      })
      .catch(error => {
        error.errorType = 'Snackbar';
        this.props.handleDeleteError(error, type, flightDesignator);
      });
  };

  handleDelete = () => {
    this.deleteCommercialFlight(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  fetchData = nextItems => {
    const timerStart = Date.now();
    const { totalDataSize, isFilter, filteredDataSize } = this.state;
    const { openItemId } = this.props;
    const { endIndex: currentEndIndex } = this.commercialFlightsPayload;

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

    this.commercialFlightsPayload = {
      ...this.commercialFlightsPayload,
      startIndex: nextStartIndex,
      endIndex: nextEndIndex,
    };

    flightsService
      .getCommercialFlights(openItemId, this.commercialFlightsPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const newFlightsData = [...this.state.flightsData, ...response.data];

        this.setState({ flightsData: newFlightsData });
      });
  };

  getScenarioDates = () => {
    const scenario = storage.getItem('openScenario');
    return {
      startDate: scenario ? scenario.startDate : '',
      endDate: scenario ? scenario.endDate : '',
    };
  };

  toggleForm = () => {
    const { isFormOpen, selectedItem } = this.state;
    if (isFormOpen && selectedItem) {
      this.setState({
        isFormOpen: !isFormOpen,
        selectedItem: null,
      });
    } else {
      this.setState({
        isFormOpen: !isFormOpen,
      });
    }
  };

  handleFlightForm = (flight, id) => {
    if (id === null) {
      this.addCommercialFlight(flight);
    } else {
      this.editCommercialFlight(flight, id);
    }
  };

  scrollToUpdatedItem = itemId => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${itemId}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  setCommercialFlightCount = () => {
    const { openItemId } = this.props;
    return flightsService
      .getCommercialFlightCount(openItemId)
      .then(flightCount => {
        this.setState({
          flightCount: flightCount.count,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  addCommercialFlight = flight => {
    flightsService
      .addCommercialFlight(flight, this.props.openItemId)
      .then(r => {
        this.setCommercialFlightCount().finally(() => {
          if (this.state.isFilter) {
            this.handleFilter(this.commercialFlightsPayload.filterCriteria);
          }
          this.setState(prevState => ({
            flightsData: [r[0], ...prevState.flightsData],
            tags: union(prevState.tags, r[0].tags),
            totalDataSize: this.state.totalDataSize + 1,
            message: this.props.t('SUCCESS.COMMERCIAL_FLIGHTS.ADD', {
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

  editCommercialFlight = (flight, flightId) => {
    const flightsData = this.state.flightsData;
    flight.id = parseInt(flightId, 10);

    flightsService
      .editCommercialFlight(flight, this.props.openItemId)
      .then(r => {
        const editedFlight = r[0];

        const editedIndex = flightsData.findIndex(
          edditedFlight => edditedFlight.id === flightId
        );

        flightsData[editedIndex] = editedFlight;

        this.setCommercialFlightCount().finally(() => {
          if (this.state.isFilter) {
            this.handleFilter(this.commercialFlightsPayload.filterCriteria);
          }
          this.setState(
            prevState => ({
              flightsData,
              tags: union(prevState.tags, r[0].tags),
              message: this.props.t('SUCCESS.COMMERCIAL_FLIGHTS.EDIT', {
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

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  render() {
    const {
      fetching,
      totalDataSize,
      flightsData,
      isFormOpen,
      stations,
      message,
      snackType,
      selectedItem,
      tags,
      isFilter,
      filteredDataSize,
      flightCount,
    } = this.state;
    const {
      t,
      editMode,
      openDeleteDialog,
      deleteDialogIsOpen,
      deleteDialogItem,
      exitDeleteDialog,
      closeDeleteDialog,
      readOnly,
      ...rest
    } = this.props;
    const dataScopes = editMode
      ? scopes.dataCardPage.dataTemplate
      : scopes.dataCardPage.dataScenario;
    const [timeReferenceText] = getTimeReferenceConfig(TIME_REFERENCE, t);

    if (fetching) {
      return <Loading />;
    } else {
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t('DATA.commercialFlights.name')}
            className="tm-scenario_data_commercial_flights__create-btn"
            onClick={this.toggleForm}
            disableAdd
            scopes={dataScopes}
            {...rest}
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
                    handleEditItem={this.handleEditItem}
                    handleDeleteItem={openDeleteDialog}
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
                <CommercialFlightstsForm
                  isOpen={isFormOpen}
                  t={t}
                  handleOk={this.handleFlightForm}
                  stations={stations}
                  handleCancel={this.toggleForm}
                  onClose={this.toggleForm}
                  selectedItem={selectedItem}
                  tagsSource={tags}
                  enableReadOnly={props.disableComponent}
                  readOnly={readOnly}
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

CommercialFlights.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  readOnly: PropTypes.bool.isRequired,
  reportError: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  handleDeleteError: PropTypes.func.isRequired,
  deleteDialogItem: PropTypes.shape().isRequired,
  deleteDialogIsOpen: PropTypes.bool.isRequired,
  closeDeleteDialog: PropTypes.func.isRequired,
  exitDeleteDialog: PropTypes.func.isRequired,
};

export default withErrorHandler(withDeleteHandler(CommercialFlights)(type));
