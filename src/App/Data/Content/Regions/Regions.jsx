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

import RegionsForm from './RegionsForm';

import * as regionsService from '../../../../services/Data/regions';

import {
  orderBy,
  order,
  getHeaders,
  INITIAL_ITEMS,
  type,
} from './constants.jsx';
import { DEBUG_MODE } from './../../../../_shared/constants';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class Regions extends Component {
  state = {
    regions: [],
    message: null,
    snackType: '',
    selectedRegion: null,
    fetching: true,
    isFormOpen: false,
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  componentDidMount() {
    regionsService
      .getRegions(this.props.openItemId, this.paginationPayload)
      .then(regions => {
        this.setState({
          regions: regions.data,
          totalDataSize: regions.totalDataSize,
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

    regionsService
      .getRegions(openItemId, this.paginationPayload)
      .then(response => {
        this.setState({
          regions: response.data,
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
    const { isFormOpen, selectedRegion } = this.state;
    const dataToUpdate = {
      selectedRegion,
      isFormOpen: !isFormOpen,
    };

    if (isFormOpen && selectedRegion) dataToUpdate.selectedRegion = null;

    this.setState(dataToUpdate, this.props.clearErrorNotification);
  };

  handleEditItem = async region => {
    const { openItemId } = this.props;
    const selectedRegion = await regionsService.getRegion(
      region.code,
      openItemId
    );

    this.setState(
      {
        selectedRegion,
      },
      this.toggleForm
    );
  };

  addRegion = region => {
    regionsService
      .addRegion(region, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Regions',
          scenarioId: this.props.openItemId,
        });
        this.setState(state => ({
          regions: [...r, ...state.regions],
          message: this.props.t('SUCCESS.REGIONS.ADD', {
            region: r[0].name,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'regionCode';
        this.props.reportError({ error, inputField });
      });
  };

  editRegion = (region, id) => {
    region.id = id;
    const regionsList = [...this.state.regions];
    regionsService
      .editRegion(region, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Regions',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedRegion = res[0];
        const editedIndex = regionsList.findIndex(
          regionItem => regionItem.id === id
        );

        regionsList[editedIndex] = editedRegion;

        this.setState(
          {
            regions: regionsList,
            message: this.props.t('SUCCESS.REGIONS.EDIT', {
              region: editedRegion.name,
            }),
            snackType: 'success',
          },
          () => this.scrollToRegion(id)
        );
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'regionCode';
        this.props.reportError({ error, inputField });
      });
  };

  scrollToRegion = regionId => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${regionId}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  handleRegionsForm = regionsForm => {
    const { selectedRegion } = this.state;
    const region = {
      name: regionsForm.regionName.value.trim(),
      code: regionsForm.regionCode.value.trim().toUpperCase(),
    };

    if (selectedRegion) this.editRegion(region, this.state.selectedRegion.id);
    else this.addRegion(region);
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

    regionsService
      .getRegions(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const newRegionsData = [...this.state.regions, ...response.data];

        this.setState({ regions: newRegionsData });
      });
  };

  /*Delete Region*/

  deleteRegion = ({ code, name }) => {
    regionsService
      .deleteRegion(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Regions',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          regions: this.state.regions.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.REGIONS.REMOVE', {
            region: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteRegion(this.props.deleteDialogItem);
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
      regions,
      fetching,
      selectedRegion,
      isFormOpen,
      message,
      snackType,
      totalDataSize,
    } = this.state;
    const regionText = 'DATA.regions';

    if (fetching) return <Loading />;

    return (
      <React.Fragment>
        <AddHeader
          t={t}
          name={t(`${regionText}.name`)}
          onClick={this.toggleForm}
          editMode={editMode}
          openItemId={openItemId}
          openItemName={openItemName}
          scopes={dataScopes}
          disableAdd
          {...rest}
          className="tm-scenario_data_regions__create-btn"
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          <AccessEnabler
            scopes={dataScopes}
            disableComponent
            render={props => (
              <RegionsForm
                region={selectedRegion}
                isOpen={isFormOpen}
                handleCancel={this.toggleForm}
                handleOk={this.handleRegionsForm}
                formId={'regionsForm'}
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
          {this.state.regions.length ? (
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <GenericTable
                  headers={getHeaders(t)}
                  data={regions}
                  totalDataSize={totalDataSize}
                  orderBy={orderBy}
                  order={order}
                  handleSort={this.handleSort}
                  handleDeleteItem={openDeleteDialog}
                  handleEditItem={this.handleEditItem}
                  handleFetchData={this.fetchData}
                  name={t(`${regionText}.name`)}
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
                data: t(`${regionText}.name`).toLowerCase(),
              })}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

Regions.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
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

Regions.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(Regions)(type));
