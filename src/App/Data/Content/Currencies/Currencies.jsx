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
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import {
  orderBy,
  order,
  getHeaders,
  INITIAL_ITEMS,
  type,
} from './constants.jsx';
import CurrenciesForm from './CurrenciesForm';
import {
  getCurrencies,
  getCurrency,
  addCurrency,
  editCurrency,
  deleteCurrency,
} from '../../../../services/Data/currencies';
import { DEBUG_MODE } from './../../../../_shared/constants';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class Currencies extends Component {
  state = {
    currencies: [],
    fetching: true,
    isFormOpen: false,
    message: null,
    snackType: '',
    selectedCurrency: null,
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  componentDidMount() {
    getCurrencies(this.props.openItemId, this.paginationPayload)
      .then(currencies => {
        this.setState({
          currencies: currencies.data,
          totalDataSize: currencies.totalDataSize,
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

    getCurrencies(openItemId, this.paginationPayload)
      .then(response => {
        this.setState({
          currencies: response.data,
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
    const { isFormOpen, selectedCurrency } = this.state;

    if (isFormOpen && selectedCurrency) {
      this.setState({
        isFormOpen: !isFormOpen,
        selectedCurrency: null,
      });
    } else {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
      });
    }
  };

  editCurrency = (currency, id) => {
    currency.id = id;
    const currenciesList = [...this.state.currencies];
    editCurrency(currency, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Currencies',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedCurrency = res[0];
        const editedIndex = currenciesList.findIndex(
          currencyItem => currencyItem.id === id
        );

        currenciesList[editedIndex] = editedCurrency;

        this.setState(
          {
            currencies: currenciesList,
            message: this.props.t('SUCCESS.CURRENCIES.EDIT', {
              currency: editedCurrency.name,
              currencyCode: editedCurrency.code,
            }),
            snackType: 'success',
          },
          () => this.scrollToCurrency(id)
        );
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'currencyCode';
        this.props.reportError({ error, inputField });
      });
  };

  addCurrency = currency => {
    addCurrency(currency, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Currencies',
          scenarioId: this.props.openItemId,
        });
        this.setState(state => ({
          currencies: [...r, ...state.currencies],
          message: this.props.t('SUCCESS.CURRENCIES.ADD', {
            currency: r[0].name,
            currencyCode: r[0].code,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'currencyCode';
        this.props.reportError({ error, inputField });
      });
  };

  handleEditItem = async currency => {
    const { openItemId } = this.props;
    const selectedCurrency = await getCurrency(currency.code, openItemId);

    this.setState(
      {
        selectedCurrency,
      },
      this.toggleForm
    );
  };

  handleCurrenciesForm = currenciesForm => {
    const { selectedCurrency } = this.state;
    const currency = {
      code: currenciesForm.currencyCode.value.trim().toUpperCase(),
      name: currenciesForm.currencyName.value.trim(),
      exchangeRate: +currenciesForm.currencyRate.value.trim(),
    };

    if (selectedCurrency)
      this.editCurrency(currency, this.state.selectedCurrency.id);
    else {
      this.addCurrency(currency);
    }
  };

  scrollToCurrency = currencyId => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${currencyId}`);
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

    getCurrencies(openItemId, this.paginationPayload).then(response => {
      if (DEBUG_MODE) {
        const elapsedTime = (Date.now() - timerStart) / 1000;
        // eslint-disable-next-line
        console.log('>>> Network time:', `${elapsedTime} seconds`);
      }

      const newCurrenciesData = [...this.state.currencies, ...response.data];

      this.setState({ currencies: newCurrenciesData });
    });
  };

  deleteCurrency = ({ code, name }) => {
    deleteCurrency(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Currencies',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          currencies: this.state.currencies.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.CURRENCIES.REMOVE', {
            currency: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteCurrency(this.props.deleteDialogItem);
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
      currencies,
      fetching,
      selectedCurrency,
      isFormOpen,
      message,
      snackType,
      totalDataSize,
    } = this.state;
    const currencyText = 'DATA.currencies';

    if (fetching) {
      return <Loading />;
    } else
      return (
        <React.Fragment>
          <AddHeader
            t={t}
            name={t(`${currencyText}.name`)}
            onClick={this.toggleForm}
            editMode={editMode}
            openItemId={openItemId}
            openItemName={openItemName}
            scopes={dataScopes}
            disableAdd
            {...rest}
            className="tm-scenario_data_currencies__create-btn"
          />
          <Container>
            {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <CurrenciesForm
                  currency={selectedCurrency}
                  isOpen={isFormOpen}
                  handleCancel={this.toggleForm}
                  handleOk={this.handleCurrenciesForm}
                  formId={'currenciesForm'}
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
                name: deleteDialogItem.name || ' ',
              })}
              bodyText={t('DIALOG.DELETE_DATA.body', {
                type: t(type).toLowerCase(),
                name: deleteDialogItem.name || ' ',
              })}
              t={t}
            />
            {this.state.currencies.length ? (
              <AccessEnabler
                scopes={dataScopes}
                disableComponent
                render={props => (
                  <GenericTable
                    headers={getHeaders(t)}
                    data={currencies}
                    totalDataSize={totalDataSize}
                    orderBy={orderBy}
                    order={order}
                    handleSort={this.handleSort}
                    handleDeleteItem={openDeleteDialog}
                    handleEditItem={this.handleEditItem}
                    handleFetchData={this.fetchData}
                    name={t(`${currencyText}.name`)}
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
                  data: t(`${currencyText}.name`).toLowerCase(),
                })}
              />
            )}
          </Container>
        </React.Fragment>
      );
  }
}
Currencies.propTypes = {
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
  readOnly: PropTypes.func.isRequired,
};

Currencies.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(Currencies)(type));
