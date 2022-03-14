import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import GenericTable from '../../../../components/GenericTable';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import DataNotFound from '../../../../components/DataNotFound';
import Loading from '../../../../components/Loading';
import StationForm from './StationForm';
import Notification from '../../../../components/Notification';
import EditModeBar from '../../../../components/EditModeBar';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import { formatHoursToMinutes } from './TimeZone/utilities';
import * as stationsService from '../../../../services/Data/stations';
import { terminalsCleansing, checkEmptyFilter } from './helpers';
import { DEBUG_MODE } from './../../../../_shared/constants';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

import { type } from './constants';

const OrderBy = 'code';
const order = 'inc';
const INITIAL_ITEMS = 50;

export class Stations extends Component {
  state = {
    stations: [],
    message: null,
    selectedStation: null,
    fetching: true,
    isFormOpen: false,
    totalDataSize: 0,
    isFilter: false,
    filteredDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: OrderBy }, order),
    filterCriteria: {},
  };

  headers = [
    {
      field: 'code',
      displayName: this.props.t('DATA.stations.headers.code'),
    },
    {
      field: 'name',
      displayName: this.props.t('DATA.stations.headers.name'),
    },
    {
      field: 'countryDisplayName',
      displayName: this.props.t('DATA.stations.headers.country'),
      sortCriteria: 'countryCode',
    },
    {
      field: 'regionName',
      displayName: this.props.t('DATA.stations.headers.region'),
      sortCriteria: 'regionCodes',
    },
    {
      field: 'utcOffset',
      displayName: this.props.t('DATA.stations.headers.timeZone'),
    },
  ];

  componentDidMount() {
    stationsService
      .getStations(this.props.openItemId, this.paginationPayload)
      .then(r => {
        this.setState({
          stations: r.data,
          totalDataSize: r.totalDataSize,
          fetching: false,
        });
      })
      .catch(err => {
        this.setState({ fetching: false });
        console.error(err);
      });
  }

  handleSort = sortPayload => {
    const { openItemId } = this.props;

    this.paginationPayload = {
      ...this.paginationPayload,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    stationsService
      .getStations(openItemId, this.paginationPayload)
      .then(response => {
        this.setState({
          stations: response.data,
        });
      })
      .catch(err => console.error(err));
  };

  /*Delete Station */

  deleteStation = ({ code }) => {
    stationsService
      .deleteStation(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Stations',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        const { totalDataSize, stations } = this.state;
        this.setState({
          stations: stations.filter(item => item.code !== code),
          totalDataSize: totalDataSize - 1,
          message: this.props.t('SUCCESS.STATIONS.REMOVE', {
            station: code,
          }),
          snackType: 'success',
        });
        if (this.state.isFilter) {
          this.handleFilter(this.paginationPayload.filterCriteria);
        }
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, code);
      });
  };

  handleDelete = () => {
    this.deleteStation(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  /*Add & Edit Station */

  toggleForm = () => {
    this.props.clearErrorNotification();
    if (this.state.isFormOpen && this.state.selectedStation) {
      this.setState(
        {
          isFormOpen: !this.state.isFormOpen,
          selectedStation: null,
        },
        () => {
          setTimeout(() => {
            this.setState({ selectedStation: null });
          }, 300);
        }
      );
    } else {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
      });
    }
  };

  addStation = station => {
    stationsService
      .addStation(station, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Stations',
          scenarioId: this.props.openItemId,
        });
        const addedStation = r[0];
        this.setState(state => ({
          stations: [addedStation, ...state.stations],
          message: this.props.t('SUCCESS.STATIONS.ADD', {
            station: addedStation.name,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        if (this.state.isFilter) {
          this.handleFilter(this.paginationPayload.filterCriteria);
        }
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'IATACode';
        this.props.reportError({ error, inputField });
      });
  };

  mapStation_DEPRECATED = station => {
    station.countryLabel = this.getCountryLabelFromStation(station);
    return station;
  };

  handleFilter = filters => {
    const isEmptyFilterObj = checkEmptyFilter(filters);
    const { openItemId } = this.props;
    this.paginationPayload = {
      ...this.paginationPayload,
      filterCriteria: filters,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
    };

    stationsService
      .getStationsBasedOnFilter(openItemId, this.paginationPayload)
      .then(response => {
        this.setState({
          stations: response.data,
          isFilter: isEmptyFilterObj ? true : false,
          filteredDataSize: response.totalDataSize,
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          stations: [],
          isFilter: isEmptyFilterObj ? true : false,
          filteredDataSize: 0,
        });
      });
  };

  handleEditItem = async station => {
    const { openItemId } = this.props;
    const selectedStation = await stationsService.getStation(
      station.code,
      openItemId
    );

    this.setState(
      {
        selectedStation,
      },
      this.toggleForm
    );
  };

  editStation = (station, id) => {
    station.id = id;
    const stationsList = [...this.state.stations];

    stationsService
      .editStation(station, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Stations',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedStation = res[0];
        const editedIndex = stationsList.findIndex(
          stationItem => stationItem.id === id
        );
        stationsList[editedIndex] = editedStation;

        this.setState(
          {
            stations: stationsList,
            message:
              res.length > 1
                ? this.props.t('DATA.stations.editSuccessPlural', {
                    edited: res.length,
                  })
                : this.props.t('SUCCESS.STATIONS.EDIT', {
                    station: res[0].name,
                  }),
            snackType: 'success',
          },
          this.scrollToStation(id)
        );
        if (this.state.isFilter) {
          this.handleFilter(this.paginationPayload.filterCriteria);
        }
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'IATACode';
        this.props.reportError({ error, inputField });
      });
  };

  scrollToStation = id => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${id}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  getStringDate_DEPRECATED = date =>
    date ? new Date(date).toISOString() : null;

  parseStringDate = date => {
    const [selectedDate, selectedTime] = date.split(' ');
    const cleanedDate = selectedDate.replace(/\//g, '-');
    return `${cleanedDate}T${selectedTime}`;
  };

  tranformDST_DEPRECATED = dst =>
    isNaN(dst) ? formatHoursToMinutes(dst) : dst;

  buildCountryData_DEPRECATED = country => {
    const [countryName, countryCode] = country.split(',');

    return {
      countryCode,
      countryName,
    };
  };

  handleStationForm = (stationForm, entity) => {
    const station = {
      code: stationForm.IATACode.value.trim().toUpperCase(),
      name: stationForm.name.value.trim() || null,
      countryCode: entity.countryCode || null,
      regionCode: stationForm.regionCode.value || null,
      latitude:
        stationForm.latitude.value.trim() !== ''
          ? +stationForm.latitude.value.trim()
          : null,
      longitude:
        stationForm.longitude.value.trim() !== ''
          ? +stationForm.longitude.value.trim()
          : null,
      utcOffset: stationForm.utcOffset.value,
      dstShift: stationForm.dstShift.value,
      terminals: terminalsCleansing(stationForm.terminals.value),
      dstStartDateTime: stationForm.dstStartDateTime
        ? this.parseStringDate(stationForm.dstStartDateTime.value)
        : '1900-01-01T00:00',
      dstEndDateTime: stationForm.dstEndDateTime
        ? this.parseStringDate(stationForm.dstEndDateTime.value)
        : '1900-01-01T00:00',
    };

    if (this.state.selectedStation) {
      this.editStation(station, this.state.selectedStation.id);
    } else {
      this.addStation(station);
    }
  };

  getCountryLabelFromStation_DEPRECATED = ({ countryName, countryCode }) =>
    `${countryName}, ${countryCode}`;

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  fetchData = nextItems => {
    const timerStart = Date.now();
    const { totalDataSize, isFilter, filteredDataSize } = this.state;
    const { endIndex: currentEndIndex } = this.paginationPayload;

    if (
      currentEndIndex === totalDataSize ||
      (totalDataSize > 0 && currentEndIndex > totalDataSize) ||
      (isFilter && currentEndIndex > filteredDataSize)
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

    stationsService
      .getStations(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const newStationsData = [...this.state.stations, ...response.data];

        this.setState({ stations: newStationsData });
      });
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
      stations,
      message,
      selectedStation,
      fetching,
      isFormOpen,
      snackType,
      totalDataSize,
      isFilter,
      filteredDataSize,
    } = this.state;
    const airporText = 'DATA.stations';

    if (fetching) {
      return <Loading />;
    } else {
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t(`${airporText}.name`)}
            onClick={this.toggleForm}
            editMode={editMode}
            openItemId={openItemId}
            openItemName={openItemName}
            scopes={dataScopes}
            disableAdd
            {...rest}
            className="tm-scenario_data_stations__create-btn"
          />
          <Container>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <StationForm
                  station={selectedStation}
                  isOpen={isFormOpen}
                  handleCancel={this.toggleForm}
                  handleOk={this.handleStationForm}
                  openItemId={openItemId}
                  formId={'stationForm'}
                  t={t}
                  onClose={this.toggleForm}
                  inlineError={inlineError}
                  readOnly={readOnly}
                  enableReadOnly={props.disableComponent}
                />
              )}
            />
            {this.state.stations.length || isFilter ? (
              <AccessEnabler
                scopes={dataScopes}
                disableComponent
                render={props => (
                  <GenericTable
                    headers={this.headers}
                    data={stations}
                    totalDataSize={totalDataSize}
                    orderBy={OrderBy}
                    order={order}
                    handleSort={this.handleSort}
                    handleDeleteItem={openDeleteDialog}
                    handleEditItem={this.handleEditItem}
                    handleFetchData={this.fetchData}
                    handleFilter={this.handleFilter}
                    isFilter={isFilter}
                    name={t(`${airporText}.name`)}
                    t={t}
                    editMode={editMode}
                    filteredDataSize={filteredDataSize}
                    handleDisableEdit={() => props.disableComponent}
                    handleDisableDelete={() => props.disableComponent}
                  />
                )}
              />
            ) : (
              <DataNotFound
                text={t('GLOBAL.dataNotFound.message', {
                  data: t(`${airporText}.name`).toLowerCase(),
                })}
              />
            )}

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
            <Notification
              message={message}
              clear={this.onClearSnackBar}
              type={snackType}
            />
          </Container>
        </React.Fragment>
      );
    }
  }
}

Stations.propTypes = {
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

Stations.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(Stations)(type));
