import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddHeader from '../../../../components/Headers/AddHeader';
import Container from '../../../../components/DataContent/Container';
import GenericTable from '../../../../components/GenericTable';
import DataNotFound from '../../../../components/DataNotFound';
import Notification from '../../../../components/Notification';
import EditModeBar from '../../../../components/EditModeBar';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import { orderBy, order, getHeaders, INITIAL_ITEMS, type } from './constants';
import { DEBUG_MODE } from './../../../../_shared/constants';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';

import {
  getCrewBase,
  getCrewBases,
  addCrewBases,
  editCrewBases,
  deleteCrewBases,
} from '../../../../services/Data/crewBases';
import CrewBasesForm from './CrewBasesForm.jsx';

import Loading from '../../../../components/Loading';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class CrewBases extends Component {
  state = {
    fetching: true,
    crewBases: [],
    selectedCrewBase: null,
    isFormOpen: false,
    message: null,
    snackType: '',
    totalDataSize: 0,
  };
  stations = [];
  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  generateStationsString = crewBase => {
    return crewBase.stationCodes.join(', ');
  };

  componentDidMount() {
    const { openItemId } = this.props;

    getCrewBases(openItemId, this.paginationPayload)
      .then(crewBases => {
        const crewBasesWithStationsString = crewBases.data.map(crewBase => {
          return {
            ...crewBase,
            stations: this.generateStationsString(crewBase),
          };
        });

        this.setState({
          crewBases: crewBasesWithStationsString,
          fetching: false,
          totalDataSize: crewBases.totalDataSize,
        });
      })
      .catch(err => {
        this.setState({ fetching: false });
        console.error(err);
      });
  }

  toggleForm = () => {
    this.props.clearErrorNotification();
    if (this.state.isFormOpen && this.state.selectedCrewBase) {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
        selectedCrewBase: null,
      });
    } else {
      this.setState({
        isFormOpen: !this.state.isFormOpen,
      });
    }
  };

  formatBases_DEPRECATED = crewBase => {
    function getFormattedStation(stations) {
      let stationsCodes = '';
      for (let i = 0; i < stations.length; i++) {
        stationsCodes = `${stationsCodes}, ${stations[i].code}`;
      }

      return stationsCodes.substring(2);
    }

    return {
      ...crewBase,
      countryName:
        crewBase.countryName && crewBase.countryCode
          ? `${crewBase.countryName}, ${crewBase.countryCode}`
          : '',
      bases: [...crewBase.stations],
      stations: getFormattedStation(crewBase.stations),
    };
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  editCrewBase = (crewBase, id) => {
    crewBase.id = id;
    const crewBasesList = [...this.state.crewBases];
    editCrewBases(crewBase, this.props.openItemId)
      .then(res => {
        pushDataToAnalytics(
          {
            type: 'Crew Bases',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const editedCrewBase = res[0];
        editedCrewBase.stations = this.generateStationsString(editedCrewBase);

        const editedIndex = crewBasesList.findIndex(
          crewBasetItem => crewBasetItem.id === id
        );
        crewBasesList[editedIndex] = editedCrewBase;

        this.setState(
          {
            crewBases: crewBasesList,
            message: this.props.t('SUCCESS.CREWBASES.EDIT', {
              crewbase: editedCrewBase.name,
            }),
            snackType: 'success',
          },
          this.scrollToCrewBase(id)
        );

        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'baseCode';
        this.props.reportError({ error, inputField });
      });
  };

  scrollToCrewBase = id => {
    window.setTimeout(() => {
      const element = document.getElementById(`tablerow${id}`);
      if (element) {
        element.scrollIntoView(true);
      }
    }, 200);
  };

  addCrewBase = crewBase => {
    addCrewBases(crewBase, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Crew Bases',
          scenarioId: this.props.openItemId,
        });
        const addedCrewBase = r[0];
        addedCrewBase.stations = this.generateStationsString(addedCrewBase);
        this.setState(state => ({
          crewBases: [addedCrewBase, ...state.crewBases],
          message: this.props.t('SUCCESS.CREWBASES.ADD', {
            crewbase: addedCrewBase.name,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'baseCode';
        this.props.reportError({ error, inputField });
      });
  };

  handleCrewBasesForm = crewBasesForm => {
    const node_country = crewBasesForm.countryCode[0];
    const countryCode = node_country ? node_country.value : null;
    const crewBase = {
      countryCode,
      code: crewBasesForm.baseCode.value.trim(),
      name: crewBasesForm.baseName.value.trim(),
      stationCodes: this.stations,
    };

    if (this.state.selectedCrewBase) {
      this.editCrewBase(crewBase, this.state.selectedCrewBase.id);
    } else {
      this.addCrewBase(crewBase);
    }
  };

  updateStations = stations => {
    this.stations = stations;
  };

  handleEditItem = async crewBase => {
    const { openItemId } = this.props;
    const selectedCrewBase = await getCrewBase(crewBase.code, openItemId);

    this.setState(
      {
        selectedCrewBase,
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

    getCrewBases(openItemId, this.paginationPayload)
      .then(openItemId, this.paginationPayload)
      .then(response => {
        if (DEBUG_MODE) {
          const elapsedTime = (Date.now() - timerStart) / 1000;
          // eslint-disable-next-line
          console.log('>>> Network time:', `${elapsedTime} seconds`);
        }

        const crewBasesWithStationsString = response.data.map(crewBase => {
          return {
            ...crewBase,
            stations: this.generateStationsString(crewBase),
          };
        });

        const newCrewBasesData = [
          ...this.state.crewBases,
          ...crewBasesWithStationsString,
        ];

        this.setState({ crewBases: newCrewBasesData });
      });
  };

  handleSort = sortPayload => {
    const { openItemId: scenarioId } = this.props;
    this.paginationPayload = {
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    getCrewBases(scenarioId, this.paginationPayload)
      .then(crewBases => {
        const crewBasesWithStationsString = crewBases.data.map(crewBase => {
          return {
            ...crewBase,
            stations: this.generateStationsString(crewBase),
          };
        });

        this.setState({
          crewBases: crewBasesWithStationsString,
          totalDataSize: crewBases.totalDataSize,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  /*Delete Crew Base*/

  deleteCrewBase = ({ code, name }) => {
    deleteCrewBases(code, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Crew Bases',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          crewBases: this.state.crewBases.filter(item => item.code !== code),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.CREWBASES.REMOVE', {
            crewBase: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteCrewBase(this.props.deleteDialogItem);
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
      fetching,
      crewBases,
      selectedCrewBase,
      isFormOpen,
      message,
      snackType,
      totalDataSize,
    } = this.state;
    const crewBasesText = 'DATA.crewBases';

    if (fetching) return <Loading />;

    return (
      <React.Fragment>
        <AddHeader
          t={t}
          name={t(`${crewBasesText}.name`)}
          onClick={this.toggleForm}
          editMode={editMode}
          openItemId={openItemId}
          openItemName={openItemName}
          scopes={dataScopes}
          disableAdd
          {...rest}
          className="tm-scenario_data_crew_bases__create-btn"
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          <AccessEnabler
            scopes={dataScopes}
            disableComponent
            render={props => (
              <CrewBasesForm
                crewBase={selectedCrewBase}
                isOpen={isFormOpen}
                handleCancel={this.toggleForm}
                handleOk={this.handleCrewBasesForm}
                formId={'crewBasesForm'}
                t={t}
                onClose={this.toggleForm}
                updateBases={this.updateStations}
                openItemId={openItemId}
                inlineError={inlineError}
                readOnly={readOnly}
                enableReadOnly={props.disableComponent}
              />
            )}
          />
          {this.state.crewBases.length ? (
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <GenericTable
                  headers={getHeaders(t)}
                  data={crewBases}
                  totalDataSize={totalDataSize}
                  orderBy={orderBy}
                  order={order}
                  handleDeleteItem={openDeleteDialog}
                  handleEditItem={this.handleEditItem}
                  handleFetchData={this.fetchData}
                  name={t(`${crewBasesText}.name`)}
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
                data: t(`${crewBasesText}.name`).toLowerCase(),
              })}
            />
          )}
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

CrewBases.propTypes = {
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

CrewBases.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(CrewBases)(type));
