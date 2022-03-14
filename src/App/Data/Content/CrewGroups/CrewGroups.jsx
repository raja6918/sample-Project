import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from '../../../../components/DataContent/Container';
import AddHeader from '../../../../components/Headers/AddHeader';
import EditModeBar from '../../../../components/EditModeBar';
import CrewGroupsForm from './CrewGroupsForm';
import GenericTable from '../../../../components/GenericTable';
import Loading from '../../../../components/Loading';
import DataNotFound from '../../../../components/DataNotFound';
import Notification from '../../../../components/Notification';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';

import { DEBUG_MODE } from './../../../../_shared/constants';
import { orderBy, order, getHeaders, INITIAL_ITEMS, type } from './constants';
import { complementCrewGroupData } from './utils';
import { prepareSortPayload } from './../../../../components/GenericTable/helpers';
import {
  getCrewGroup,
  getCrewGroups,
  addCrewGroup,
  editCrewGroup,
  deleteCrewGroup,
} from '../../../../services/Data/crewGroups';
import { getCategories } from './../../../../services/Data/positions';
import { getAirlineIdentifiers } from './../../../../services/Data/operatingFlights';
import { getAircrafts } from './../../../../services/Data/aircraftTypes';
import { getRuleSets } from './../../../../services/Data/common';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { pushDataToAnalytics } from '../../../../utils/analytics';

export class CrewGroups extends Component {
  state = {
    fetching: true,
    crewGroups: [],
    positionsCategorized: [],
    airlines: [],
    aircraftTypes: [],
    ruleSets: [],
    selectedItem: null,
    isFormOpen: false,
    message: null,
    snackBarType: '',
    totalDataSize: 0,
  };

  paginationPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  closeForm = () => {
    this.setState({ isFormOpen: false });
  };

  handleOk = (form, entity) => {
    const crewGroup = {
      ...entity,
    };

    if (!crewGroup.id) {
      this.handleAddCrewGroup(crewGroup);
    } else {
      this.handleEditCrewGroup(crewGroup, crewGroup.id);
    }
  };

  handleAddCrewGroup = crewGroup => {
    addCrewGroup(crewGroup, this.props.openItemId)
      .then(r => {
        pushDataToAnalytics({
          type: 'Crew Groups',
          scenarioId: this.props.openItemId,
        });
        const newCrewGroup = complementCrewGroupData(r[0]);
        this.setState(state => ({
          crewGroups: [newCrewGroup, ...state.crewGroups],
          message: this.props.t('SUCCESS.CREW_GROUPS.ADD', {
            crewGroup: newCrewGroup.name,
          }),
          snackType: 'success',
          totalDataSize: state.totalDataSize + 1,
        }));
        this.toggleForm();
      })
      .catch(error => {
        const inputField = 'name';
        this.props.reportError({ error, inputField });
      });
  };

  handleEditCrewGroup = (crewGroup, id) => {
    const crewGroupsList = [...this.state.crewGroups];

    editCrewGroup(crewGroup, this.props.openItemId)
      .then(response => {
        pushDataToAnalytics(
          {
            type: 'Crew Groups',
            scenarioId: this.props.openItemId,
          },
          'Update'
        );
        const edittedCrewGroup = complementCrewGroupData(response[0]);
        const editedIndex = crewGroupsList.findIndex(
          crewGroupItem => crewGroupItem.id === id
        );
        crewGroupsList[editedIndex] = edittedCrewGroup;

        this.setState(
          {
            crewGroups: crewGroupsList,
            message: this.props.t('SUCCESS.CREW_GROUPS.EDIT', {
              crewGroup: edittedCrewGroup.name,
            }),
            snackType: 'success',
          },
          () => {
            this.scrollToUpdatedItem(id);
            this.toggleForm();
          }
        );
      })
      .catch(error => {
        const inputField = 'name';
        this.props.reportError({ error, inputField });
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

  toggleForm = () => {
    const { isFormOpen, selectedItem } = this.state;
    const dataToUpdate = { selectedItem, isFormOpen: !isFormOpen };

    if (isFormOpen && selectedItem) dataToUpdate.selectedItem = null;

    this.setState(dataToUpdate);
  };

  handleEditItem = async summaryItem => {
    const { openItemId } = this.props;
    const selectedItem = await getCrewGroup(summaryItem.id, openItemId);

    this.setState(
      {
        selectedItem,
      },
      this.toggleForm
    );
  };

  componentDidMount() {
    const { openItemId } = this.props;

    Promise.all([
      getCrewGroups(openItemId, this.paginationPayload),
      getCategories(openItemId),
      getAirlineIdentifiers(openItemId),
      getAircrafts(openItemId),
      getRuleSets(openItemId),
    ])
      .then(
        ([
          crewGroups,
          positionsCategorized,
          airlines,
          aircraftTypes,
          ruleSets,
        ]) => {
          const crewGroupsWithComplement = crewGroups.data.map(crewGroup => {
            return complementCrewGroupData(crewGroup);
          });

          this.setState({
            crewGroups: crewGroupsWithComplement,
            totalDataSize: crewGroups.totalDataSize,
            positionsCategorized,
            airlines,
            aircraftTypes: aircraftTypes.data,
            ruleSets,
            fetching: false,
          });
        }
      )
      .catch(err => {
        this.setState({ fetching: false });
        console.error(err);
      });
  }

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

    getCrewGroups(openItemId, this.paginationPayload).then(response => {
      if (DEBUG_MODE) {
        const elapsedTime = (Date.now() - timerStart) / 1000;
        // eslint-disable-next-line
        console.log('>>> Network time:', `${elapsedTime} seconds`);
      }

      const crewGroupsWithComplement = response.data.map(crewGroup => {
        return complementCrewGroupData(crewGroup);
      });

      const newCrewGroupsData = [
        ...this.state.crewGroups,
        ...crewGroupsWithComplement,
      ];

      this.setState({ crewGroups: newCrewGroupsData });
    });
  };

  handleSort = sortPayload => {
    const { openItemId: scenarioId } = this.props;
    this.paginationPayload = {
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };
    getCrewGroups(scenarioId, this.paginationPayload)
      .then(crewGroups => {
        const crewGroupsWithComplement = crewGroups.data.map(crewGroup => {
          return complementCrewGroupData(crewGroup);
        });

        this.setState({
          crewGroups: crewGroupsWithComplement,
          totalDataSize: crewGroups.totalDataSize,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  /*Delete Crew Groups*/

  deleteCrewGroup = ({ id, name }) => {
    deleteCrewGroup(id, this.props.openItemId)
      .then(() => {
        pushDataToAnalytics(
          {
            type: 'Crew Groups',
            scenarioId: this.props.openItemId,
          },
          'Delete'
        );
        this.setState({
          crewGroups: this.state.crewGroups.filter(item => item.id !== id),
          totalDataSize: this.state.totalDataSize - 1,
          message: this.props.t('SUCCESS.CREW_GROUPS.REMOVE', {
            crewGroup: name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.handleDeleteError(error, type, name);
      });
  };

  handleDelete = () => {
    this.deleteCrewGroup(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  render() {
    const {
      isFormOpen,
      positionsCategorized,
      airlines,
      aircraftTypes,
      ruleSets,
      totalDataSize,
    } = this.state;

    const {
      t,
      editMode,
      deleteDialogIsOpen,
      deleteDialogItem,
      openDeleteDialog,
      exitDeleteDialog,
      closeDeleteDialog,
      readOnly,
      inlineError,
      ...rest
    } = this.props;
    const dataScopes = editMode
      ? scopes.dataCardPage.dataTemplate
      : scopes.dataCardPage.dataScenario;

    const {
      fetching,
      crewGroups,
      message,
      snackType,
      selectedItem,
    } = this.state;

    if (fetching) return <Loading />;

    return (
      <React.Fragment>
        <AddHeader
          t={t}
          name={t('DATA.crewGroups.name')}
          onClick={this.toggleForm}
          editMode={editMode}
          scopes={dataScopes}
          disableAdd
          {...rest}
          className="tm-scenario_data_crew_groups__create-btn"
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          <AccessEnabler
            scopes={dataScopes}
            disableComponent
            render={props => (
              <CrewGroupsForm
                isOpen={isFormOpen}
                handleCancel={this.toggleForm}
                onClose={this.toggleForm}
                handleOk={this.handleOk}
                formId={'crewGroupsForm'}
                t={t}
                positionsCategorized={positionsCategorized}
                airlines={airlines}
                aircraftTypes={aircraftTypes}
                ruleSets={ruleSets}
                selectedItem={selectedItem}
                readOnly={readOnly}
                inlineError={inlineError}
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
          {crewGroups.length ? (
            <AccessEnabler
              scopes={dataScopes}
              disableComponent
              render={props => (
                <GenericTable
                  headers={getHeaders(t)}
                  data={crewGroups}
                  totalDataSize={totalDataSize}
                  orderBy={orderBy}
                  order={order}
                  handleDeleteItem={openDeleteDialog}
                  handleEditItem={this.handleEditItem}
                  handleFetchData={this.fetchData}
                  name={t('DATA.crewGroups.name')}
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
                data: t('DATA.crewGroups.name').toLowerCase(),
              })}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

CrewGroups.propTypes = {
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
  inlineError: PropTypes.shape(),
};

CrewGroups.defaultProps = {
  inlineError: null,
};

export default withErrorHandler(withDeleteHandler(CrewGroups)(type));
