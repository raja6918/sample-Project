import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import GenericTable from '../../../../components/GenericTable';
import Loading from '../../../../components/Loading';
import DataNotFound from '../../../../components/DataNotFound';
import EditModeBar from '../../../../components/EditModeBar';
import Notification from '../../../../components/Notification';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import CountriesForm from './CountriesForm';

import * as countriesService from '../../../../services/Data/countries';

import {
  OrderBy,
  order,
  getHeaders,
  INITIAL_ITEMS,
  type,
} from './Constants.js';
import { DEBUG_MODE } from './../../../../_shared/constants';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class Countries extends Component {
  state = {
    countries: [],
    message: null,
    snackType: '',
    selectedCountry: null,
    fetching: true,
    isFormOpen: false,
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: OrderBy }, order),
  };

  componentDidMount() {
    countriesService
      .getCountries(this.props.openItemId, this.paginationPayload)
      .then(countries => {
        this.setState({
          countries: countries.data,
          totalDataSize: countries.totalDataSize,
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
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    countriesService
      .getCountries(openItemId, this.paginationPayload)
      .then(response => {
        this.setState({
          countries: response.data,
          totalDataSize: response.totalDataSize,
        });
      })
      .catch(err => console.error(err));
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  toggleForm = () => {
    this.props.clearErrorNotification();
    if (this.state.isFormOpen && this.state.selectedCountry) {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
        selectedCountry: null,
      });
    } else {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
      });
    }
  };

  handleEditItem = async country => {
    const { openItemId } = this.props;
    const selectedCountry = await countriesService.getCountry(
      country.code,
      openItemId
    );

    this.setState(
      {
        selectedCountry,
      },
      this.toggleForm
    );
  };

  scrollToCountry = id => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${id}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  editCountry = (country, id) => {
    country.id = id;
    const countriesList = [...this.state.countries];
    countriesService
      .editCountry(country, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Countries',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedCountry = res[0];
        const editedIndex = countriesList.findIndex(
          countryItem => countryItem.id === id
        );

        countriesList[editedIndex] = editedCountry;

        this.setState(
          {
            countries: countriesList,
            message: this.props.t('SUCCESS.COUNTRIES.EDIT', {
              country: editedCountry.name,
            }),
            snackType: 'success',
          },
          this.scrollToCountry(id)
        );

        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'countryCode';
        this.props.reportError({ error, inputField });
      });
  };

  addCountry = country => {
    countriesService
      .addCountry(country, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics({
          type: 'Countries',
          scenarioId: this.props.openItemId,
        });
        this.setState(state => ({
          countries: [...res, ...state.countries],
          message: this.props.t('SUCCESS.COUNTRIES.ADD', {
            country: res[0].name,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'countryCode';
        this.props.reportError({ error, inputField });
      });
  };

  handleCountriesForm = (countriesForm, entity) => {
    const { selectedCountry } = this.state;
    const country = {
      name: countriesForm.countryName.value.trim(),
      code: countriesForm.countryCode.value.trim().toUpperCase(),
      currencyCode: entity.currencyCode || null,
    };

    if (selectedCountry) {
      this.editCountry(country, selectedCountry.id);
    } else {
      this.addCountry(country);
    }
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

    countriesService
      .getCountries(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const newCountriesData = [...this.state.countries, ...response.data];

        this.setState({ countries: newCountriesData });
      });
  };

  deleteCountry = ({ code, name }) => {
    countriesService
      .deleteCountry(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Countries',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          countries: this.state.countries.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.COUNTRIES.REMOVE', {
            country: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteCountry(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  render() {
    const {
      fetching,
      countries,
      selectedCountry,
      isFormOpen,
      message,
      snackType,
      totalDataSize,
    } = this.state;
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
    const countriesText = 'DATA.countries';

    if (fetching) {
      return <Loading />;
    }

    return (
      <React.Fragment>
        <AddHeader
          t={t}
          name={t(`${countriesText}.name`)}
          onClick={this.toggleForm}
          editMode={editMode}
          openItemId={openItemId}
          openItemName={openItemName}
          scopes={dataScopes}
          disableAdd
          {...rest}
          className="tm-scenario_data_countries__create-btn"
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          <AccessEnabler
            scopes={dataScopes}
            disableComponent
            render={props => (
              <CountriesForm
                country={selectedCountry}
                isOpen={isFormOpen}
                handleCancel={this.toggleForm}
                handleOk={this.handleCountriesForm}
                formId={'countriesForm'}
                t={t}
                onClose={this.toggleForm}
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
              name: deleteDialogItem.name || ' ',
            })}
            bodyText={t('DIALOG.DELETE_DATA.body', {
              type: t(type).toLowerCase(),
              name: deleteDialogItem.name || ' ',
            })}
            t={t}
          />
          {countries.length ? (
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <GenericTable
                  headers={getHeaders(t)}
                  data={countries}
                  totalDataSize={totalDataSize}
                  orderBy={OrderBy}
                  order={order}
                  handleDeleteItem={openDeleteDialog}
                  handleSort={this.handleSort}
                  handleEditItem={this.handleEditItem}
                  handleFetchData={this.fetchData}
                  name={t(`${countriesText}.name`)}
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
                data: t(`${countriesText}.name`).toLowerCase(),
              })}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

Countries.propTypes = {
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

Countries.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(Countries)(type));
