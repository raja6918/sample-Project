import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

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
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';

import AccommodationsForm from './AccommodationsForm';
import Sort from '../../../../utils/sortEngine';
import { getStations } from '../../../../services/Data/stations';
import { getCurrencies } from '../../../../services/Data/currencies';
import { pushDataToAnalytics } from '../../../../utils/analytics';

import {
  OrderBy,
  order,
  getHeaders,
  INITIAL_ITEMS,
  type,
} from './Constants.js';
import * as accommodationsService from '../../../../services/Data/accommodations';
import {
  getAccommodationBillingPolicies,
  getTransportBillingPolicies,
  getAccommodationTypes,
} from '../../../../services/Data/common';
import { formatTransitDetails, getDefaultTransitDetails } from './utils';
import { numberOrNull } from './../../../../_shared/helpers';
import { DEBUG_MODE } from './../../../../_shared/constants';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';

const TruncateColumn = styled.div`
  & table tbody tr td:nth-child(3) {
    max-width: 237px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export class Accommodations extends Component {
  state = {
    fetching: true,
    accommodations: [],
    accommodationBillingPolicies: [],
    transportBillingPolicies: [],
    accommodationTypes: [],
    selectedAccommodation: null,
    isFormOpen: false,
    suggestions: [],
    currencyCodes: [],
    message: null,
    snackType: '',
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: OrderBy }, order),
  };

  componentDidMount() {
    const openItemId = this.props.openItemId;
    Promise.all([
      accommodationsService.getAccommodations(
        openItemId,
        this.paginationPayload
      ),
      getAccommodationBillingPolicies(openItemId),
      getTransportBillingPolicies(openItemId),
      getAccommodationTypes(openItemId),
      getStations(openItemId),
      getCurrencies(openItemId),
    ])

      .then(
        ([
          accommodations,
          accommodationBillingPolicies,
          transportBillingPolicies,
          accommodationTypes,
          stations,
          currencies,
        ]) => {
          const currencyCodes = currencies.data.map(c => c.code);

          const formattedAccommodationData = accommodations.data.map(
            accommodation => this.getFormattedAccommodationData(accommodation)
          );

          const sortedStations = new Sort(stations.data, {
            type: 'string',
            direction: 'inc',
            field: 'code',
          }).sort();
          const suggestions = sortedStations.map(station => {
            return {
              display: `${station.code} - ${station.name}`,
              value: station.code,
            };
          });

          this.setState({
            accommodations: formattedAccommodationData,
            totalDataSize: accommodations.totalDataSize,
            accommodationBillingPolicies,
            transportBillingPolicies,
            accommodationTypes,
            fetching: false,
            suggestions,
            currencyCodes,
          });
        }
      )
      .catch(err => console.error(err));
  }

  handleSort = sortPayload => {
    const { openItemId } = this.props;

    this.paginationPayload = {
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    accommodationsService
      .getAccommodations(openItemId, this.paginationPayload)
      .then(response => {
        const formattedAccommodationData = response.data.map(accommodation =>
          this.getFormattedAccommodationData(accommodation)
        );
        this.setState({
          accommodations: formattedAccommodationData,
          totalDataSize: response.totalDataSize,
        });
      })
      .catch(err => console.error(err));
  };

  toggleForm = () => {
    const { isFormOpen, selectedAccommodation } = this.state;
    const dataToUpdate = { selectedAccommodation, isFormOpen: !isFormOpen };

    if (isFormOpen && selectedAccommodation)
      dataToUpdate.selectedAccommodation = null;

    this.setState(dataToUpdate);
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  handleAccommodations = (form, transitDetails, defaultTransits) => {
    const { selectedAccommodation } = this.state;
    const stations = form.stations.value.split(',').map(s => {
      return { code: s };
    });

    const accommodation = {
      name: form.name.value.trim(),
      typeCode: form.typeCode.value,
      cost: +form.cost.value,
      capacity: numberOrNull(form.capacity.value),
      contractStartDate: form.contractStartDate.value
        ? this.getStringDate(form.contractStartDate.value)
        : null,
      contractLastDate: form.contractLastDate.value
        ? this.getStringDate(form.contractLastDate.value)
        : null,
      currencyCode: form.currencyCode.value,
      billingPolicyCode: form.billingPolicyCodeHiddenInput.value,
      checkInTime: form.checkInTime ? form.checkInTime.value : null,
      checkOutTime: form.checkOutTime ? form.checkOutTime.value : null,
      extendedStayCostFactor: numberOrNull(form.extendedStayCostFactor.value),
      transports: defaultTransits
        ? getDefaultTransitDetails(stations, this.props.t)
        : formatTransitDetails(transitDetails),
    };
    const cleanedAccomodation = omitBy(accommodation, isNil);

    if (selectedAccommodation) {
      this.editAccommodation(
        cleanedAccomodation,
        this.state.selectedAccommodation.id
      );
    } else {
      this.addAccommodation(cleanedAccomodation);
    }
  };

  addAccommodation = accommodation => {
    accommodationsService
      .addAccommodation(accommodation, this.props.openItemId)
      .then(r => {
        const addedAccommodation = r[0];
        pushDataToAnalytics({
          type: 'Accomodations',
          scenarioId: this.props.openItemId,
        });
        this.setState(state => ({
          accommodations: [
            this.getFormattedAccommodationData(addedAccommodation),
            ...state.accommodations,
          ],
          totalDataSize: state.totalDataSize + 1,
          message: this.props.t('SUCCESS.ACCOMMODATIONS.ADD', {
            accommodation: addedAccommodation.name,
          }),
          snackType: 'success',
        }));
        this.toggleForm();
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  editAccommodation = (accommodation, id) => {
    accommodation.id = id;
    const accommodationsList = [...this.state.accommodations];
    accommodationsService
      .editAccommodation(accommodation, this.props.openItemId)
      .then(response => {
        pushDataToAnalytics(
          { type: 'Accomodations', scenarioId: this.props.openItemId },
          'Update'
        );
        const edittedAccommodation = response[0];

        const editedIndex = accommodationsList.findIndex(
          accommodationItem => accommodationItem.id === id
        );

        accommodationsList[editedIndex] = this.getFormattedAccommodationData(
          edittedAccommodation
        );

        this.setState(
          {
            accommodations: accommodationsList,
            message: this.props.t('SUCCESS.ACCOMMODATIONS.EDIT', {
              accommodation: edittedAccommodation.name,
            }),
            snackType: 'success',
          },
          () => this.scrollToAccommodation(id)
        );
        this.toggleForm();
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  getStringDate = date => (date ? date.replace(/\//g, '-') : null);

  getFormattedAccommodationData = accommodation => {
    accommodation.stationsStr = accommodation.stationCodes.join(', ');
    return accommodation;
  };

  handleEditItem = async accommodation => {
    const { openItemId } = this.props;
    const selectedAccommodation = await accommodationsService.getAccommodation(
      accommodation.id,
      openItemId
    );
    this.setState(
      {
        selectedAccommodation,
      },
      this.toggleForm
    );
  };

  scrollToAccommodation = accommodationId => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${accommodationId}`);
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

    accommodationsService
      .getAccommodations(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const formattedAccommodationData = response.data.map(accommodation =>
          this.getFormattedAccommodationData(accommodation)
        );

        const newAccommodationsData = [
          ...this.state.accommodations,
          ...formattedAccommodationData,
        ];

        this.setState({ accommodations: newAccommodationsData });
      });
  };

  deleteAccommodation = ({ id, name }) => {
    accommodationsService
      .deleteAccommodation(id, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          { type: 'Accomodations', scenarioId: this.props.openItemId },
          'Delete'
        );
        this.setState({
          accommodations: this.state.accommodations.filter(
            item => item.id !== id
          ),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.ACCOMMODATIONS.REMOVE', {
            accommodation: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteAccommodation(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
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
    const {
      fetching,
      selectedAccommodation,
      isFormOpen,
      suggestions,
      accommodations,
      accommodationTypes,
      accommodationBillingPolicies,
      transportBillingPolicies,
      currencyCodes,
      message,
      snackType,
      totalDataSize,
    } = this.state;
    const dataScopes = editMode
      ? scopes.dataCardPage.dataTemplate
      : scopes.dataCardPage.dataScenario;
    const accommodationsText = 'DATA.accommodations';

    if (fetching) {
      return <Loading />;
    } else
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t(`${accommodationsText}.name`)}
            onClick={this.toggleForm}
            editMode={editMode}
            openItemId={openItemId}
            openItemName={openItemName}
            {...rest}
            scopes={dataScopes}
            disableAdd
            className="tm-scenario_data_accomodations__create-btn"
          />
          <Container>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}

            {accommodations.length ? (
              <TruncateColumn>
                <AccessEnabler
                  scopes={dataScopes}
                  disableComponent
                  render={props => (
                    <GenericTable
                      headers={getHeaders(t)}
                      data={accommodations}
                      totalDataSize={totalDataSize}
                      orderBy={OrderBy}
                      order={order}
                      handleSort={this.handleSort}
                      handleDeleteItem={openDeleteDialog}
                      handleEditItem={this.handleEditItem}
                      handleFetchData={this.fetchData}
                      name={t(`${accommodationsText}.tableName`)}
                      t={t}
                      handleDisableEdit={() => props.disableComponent}
                      handleDisableDelete={() => props.disableComponent}
                      editMode={editMode}
                    />
                  )}
                />
              </TruncateColumn>
            ) : (
              <DataNotFound
                text={t('GLOBAL.dataNotFound.message', {
                  data: t(`${accommodationsText}.name`).toLowerCase(),
                })}
              />
            )}
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <AccommodationsForm
                  accommodation={selectedAccommodation}
                  isOpen={isFormOpen}
                  handleCancel={this.toggleForm}
                  handleOk={this.handleAccommodations}
                  formId={'accommodationsForm'}
                  t={t}
                  onClose={this.toggleForm}
                  suggestions={suggestions}
                  currencies={currencyCodes}
                  accommodationTypes={accommodationTypes}
                  accommodationBillingPolicies={accommodationBillingPolicies}
                  transportBillingPolicies={transportBillingPolicies}
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
              modalCommand={true}
              onClose={closeDeleteDialog}
            />
          </Container>
        </React.Fragment>
      );
  }
}
Accommodations.propTypes = {
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

export default withErrorHandler(withDeleteHandler(Accommodations)(type));
