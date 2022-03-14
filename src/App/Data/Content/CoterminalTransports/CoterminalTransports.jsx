import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import GenericTable from '../../../../components/GenericTable';
import DataNotFound from '../../../../components/DataNotFound';
import Loading from '../../../../components/Loading';
import EditModeBar from '../../../../components/EditModeBar';
import Notification from '../../../../components/Notification';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';

import CoterminalTransportsForm from './CoterminalTransportsForm';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

import {
  orderBy,
  order,
  getHeaders,
  INITIAL_ITEMS,
  type,
} from './Constants.js';
import { DEBUG_MODE } from './../../../../_shared/constants';

import * as coterminalTransportsService from '../../../../services/Data/coterminalTransports';
import * as stationsService from '../../../../services/Data/stations';
import * as currenciesService from '../../../../services/Data/currencies';
import {
  getCreditPolicies,
  getTransportTypes,
  getTransportBillingPolicies,
} from '../../../../services/Data/common';

import { getStringHours } from '../../../../_shared/helpers';
import Sort from '../../../../utils/sortEngine';

export class CoterminalTransports extends Component {
  state = {
    fetching: true,
    coterminalTransports: [],
    stations: [],
    currencies: [],
    creditPolicies: [],
    transportTypes: [],
    transportBillingPolicies: [],
    selectedCoterminalTransport: null,
    isFormOpen: false,
    message: null,
    snackType: '',
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  componentDidMount() {
    const { openItemId } = this.props;
    const promises = [
      coterminalTransportsService.getCoterminalTransports(
        openItemId,
        this.paginationPayload
      ),
      stationsService.getStations(openItemId),
      currenciesService.getCurrencies(openItemId),
      getCreditPolicies(openItemId),
      getTransportTypes(openItemId),
      getTransportBillingPolicies(openItemId),
    ];
    Promise.all(promises)
      .then(responses => {
        const [
          coterminalTransports,
          stations,
          currencies,
          creditPolicies,
          transportTypes,
          transportBillingPolicies,
        ] = responses;

        const sortedCurrencies = new Sort(currencies.data, {
          type: 'string',
          direction: 'inc',
          field: 'code',
        }).sort();

        this.setState({
          stations: stations.data,
          currencies: sortedCurrencies,
          coterminalTransports: coterminalTransports.data,
          totalDataSize: coterminalTransports.totalDataSize,
          creditPolicies,
          transportTypes,
          transportBillingPolicies,
          fetching: false,
        });
      })
      .catch(err => console.log(err));
  }

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  toggleForm = () => {
    const { isFormOpen, selectedItem } = this.state;
    const dataToUpdate = { selectedItem, isFormOpen: !isFormOpen };

    if (isFormOpen && selectedItem) dataToUpdate.selectedItem = null;

    this.setState(dataToUpdate);
  };

  handleEditItem = async summaryItem => {
    const { openItemId } = this.props;
    const selectedItem = await coterminalTransportsService.getCoterminalTransportById(
      summaryItem.id,
      openItemId
    );

    this.setState(
      {
        selectedItem,
      },
      this.toggleForm
    );
  };

  handleItemStorage = (form, entity) => {
    const coterminalTransport = {
      arrivalStationCode: entity.arrivalStationCode,
      billingPolicyCode: entity.billingPolicyCode,
      capacity: entity.capacity !== '' ? +entity.capacity : null,
      cost: +entity.cost,
      credit: entity.credit !== '' ? +entity.credit : null,
      creditPolicyCode: entity.creditPolicyCode,
      currencyCode: entity.currencyCode,
      departureStationCode: entity.departureStationCode,
      id: entity.id,
      isBidirectional: entity.isBidirectional,
      inboundTiming: null,
      name: entity.name,
      outboundTiming: {
        connectionTimeAfter: entity.outboundConnectionTimeAfter,
        connectionTimeBefore: entity.outboundConnectionTimeBefore,
        duration: entity.outboundDuration,
        extraTravelTimes: entity.outboundExtraTravelTimes.map(extraTime => ({
          duration: +extraTime.extraTime,
          startTime: getStringHours(extraTime.startTime),
          endTime: getStringHours(extraTime.endTime),
        })),
        firstDepartureTime: getStringHours(entity.outboundFirstDepartureTime),
        lastDepartureTime: getStringHours(entity.outboundLastDepartureTime),
      },
      typeCode: entity.typeCode,
    };

    if (entity.isBidirectional) {
      coterminalTransport.inboundTiming = {
        connectionTimeAfter: entity.inboundConnectionTimeAfter,
        connectionTimeBefore: entity.inboundConnectionTimeBefore,
        duration: entity.inboundDuration,
        extraTravelTimes: entity.inboundExtraTravelTimes.map(extraTime => ({
          duration: +extraTime.extraTime,
          startTime: getStringHours(extraTime.startTime),
          endTime: getStringHours(extraTime.endTime),
        })),
        firstDepartureTime: getStringHours(entity.inboundFirstDepartureTime),
        lastDepartureTime: getStringHours(entity.inboundLastDepartureTime),
      };
    }

    if (!coterminalTransport.id) {
      this.addCoterminalTransport(coterminalTransport);
    } else {
      this.editCoterminalTransport(coterminalTransport, coterminalTransport.id);
    }
  };

  addCoterminalTransport = coterminalTransport => {
    coterminalTransportsService
      .addCoterminalTransport(coterminalTransport, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Coterminal Transports',
          scenarioId: this.props.openItemId,
        });
        this.setState(state => ({
          coterminalTransports: [r[0], ...state.coterminalTransports],
          message: this.props.t('SUCCESS.COTERMINAL_TRANSPORTS.ADD', {
            coterminalTransport: r[0].name,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  editCoterminalTransport = (dataToUpdate, id) => {
    dataToUpdate.id = id;
    const coterminalTransportsList = [...this.state.coterminalTransports];

    coterminalTransportsService
      .editCoterminalTransport(dataToUpdate, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics(
          {
            type: 'Coterminal Transports',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const edittedCoterminalTransport = r[0];
        const editedIndex = coterminalTransportsList.findIndex(
          coterminalTransportItem => coterminalTransportItem.id === id
        );
        coterminalTransportsList[editedIndex] = edittedCoterminalTransport;

        this.setState(
          {
            coterminalTransports: coterminalTransportsList,
            message: this.props.t('SUCCESS.COTERMINAL_TRANSPORTS.EDIT', {
              coterminalTransport: edittedCoterminalTransport.name,
            }),
            snackType: 'success',
          },
          () => this.scrollToUpdatedItem(id)
        );
        this.toggleForm();
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

    coterminalTransportsService
      .getCoterminalTransports(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const newCoterminalTransportsData = [
          ...this.state.coterminalTransports,
          ...response.data,
        ];

        this.setState({ coterminalTransports: newCoterminalTransportsData });
      });
  };

  handleSort = sortPayload => {
    const { openItemId: scenarioId } = this.props;
    this.paginationPayload = {
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    coterminalTransportsService
      .getCoterminalTransports(scenarioId, this.paginationPayload)
      .then(coterminalTransports => {
        this.setState({
          coterminalTransports: coterminalTransports.data,
          totalDataSize: coterminalTransports.totalDataSize,
        });
      })
      .catch(err => console.log(err));
  };

  deleteCoterminalTransport = ({ id, name }) => {
    coterminalTransportsService
      .deleteCoterminalTransport(id, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Coterminal Transports',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          coterminalTransports: this.state.coterminalTransports.filter(
            item => item.id !== id
          ),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.COTERMINAL_TRANSPORTS.REMOVE', {
            coterminalTransport: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteCoterminalTransport(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  render() {
    const {
      t,
      editMode,
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
      fetching,
      coterminalTransports,
      currencies,
      stations,
      creditPolicies,
      transportTypes,
      transportBillingPolicies,
      isFormOpen,
      message,
      snackType,
      selectedItem,
      totalDataSize,
    } = this.state;

    const coterminalTransportsText = 'DATA.coterminalTransports';

    if (fetching) return <Loading />;

    return (
      <React.Fragment>
        <AddHeader
          t={t}
          name={t(`${coterminalTransportsText}.name`)}
          onClick={this.toggleForm}
          editMode={editMode}
          scopes={dataScopes}
          disableAdd
          {...rest}
          className="tm-scenario_data_coterminal_transports__create-btn"
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          {coterminalTransports.length ? (
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <GenericTable
                  headers={getHeaders(t)}
                  data={coterminalTransports}
                  totalDataSize={totalDataSize}
                  orderBy={orderBy}
                  order={order}
                  handleDeleteItem={openDeleteDialog}
                  handleEditItem={this.handleEditItem}
                  handleFetchData={this.fetchData}
                  name={t(`${coterminalTransportsText}.name`)}
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
                data: t(`${coterminalTransportsText}.name`).toLowerCase(),
              })}
            />
          )}
          <AccessEnabler
            scopes={dataScopes}
            disableComponent
            render={props => (
              <CoterminalTransportsForm
                selectedItem={selectedItem}
                isOpen={isFormOpen}
                stations={stations}
                currencies={currencies}
                creditPolicies={creditPolicies}
                transportTypes={transportTypes}
                transportBillingPolicies={transportBillingPolicies}
                handleCancel={this.toggleForm}
                handleOk={this.handleItemStorage}
                formId={'coterminalTransportsForm'}
                t={t}
                onClose={this.toggleForm}
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
              name: deleteDialogItem.name || ' ',
            })}
            bodyText={t('DIALOG.DELETE_DATA.body', {
              type: t(type).toLowerCase(),
              name: deleteDialogItem.name || ' ',
            })}
            t={t}
          />
        </Container>
      </React.Fragment>
    );
  }
}

CoterminalTransports.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
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

export default withErrorHandler(withDeleteHandler(CoterminalTransports)(type));
