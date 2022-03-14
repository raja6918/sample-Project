import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/Headers/Header';
import GenericTable from '../../components/GenericTable';
import Container from '../../components/Container';
import DataNotFoundMessage from '../../components/DataNotFound';
import Loading from '../../components/Loading';
import RedirectLink from '../../components/RedirectLink';
import withErrorHandler from '../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../components/DeleteHandler/withDeleteHandler';
import DeleteDialog from '../../components/Dialog/DeleteDialog';
import { order, OrderBy, getHeaders, type } from './constants.js';
import { sortData } from '../../utils/sort';
import NewUserRole from './NewUserRole';
import { connect } from 'react-redux';

import {
  getPermision,
  getUserRoles,
  createUserRole,
  getUserRoleById,
  updateUserRole,
  deleteUserRole,
} from '../../services/Roles';
import Notification from '../../components/Notification';
import { formatRoles } from './utils';

export class Roles extends Component {
  state = {
    newUserFormOpen: false,
    mode: 'add',
    roleData: [],
    resources: [],
    toastMessage: '',
    snackType: '',
    isApiCallActive: false,
    roleId: '',
    selectedRole: {},
    apiError: false,
  };

  initialSort = [{ fieldName: 'roleName', direction: 'inc' }];

  componentDidMount() {
    Promise.all([getUserRoles(), getPermision()])
      .then(([roleData, permission]) => {
        this.setState({
          roleData: sortData(roleData, this.initialSort),
          resources: permission.data,
        });
      })
      .catch(err => console.error(err));
  }

  removeTableRowClass = () => {
    //used for loop for IE support(el: nodeList)
    const el = document.querySelectorAll('[id^="tablerow"]');
    for (let i = 0; i < el.length; i++) {
      el[i].classList.remove('highlight');
    }
  };

  handleCancel = callback => {
    this.setState(
      {
        newUserFormOpen: false,
        selectedRole: {},
        apiError: false,
      },
      callback
    );
    this.removeTableRowClass();
  };

  handleEditItem = role => {
    getUserRoleById(role.id)
      .then(response => {
        this.setState(
          {
            mode: 'edit',
            selectedRole: response,
            roleId: role.id,
          },
          () => this.openRoleForm(true)
        );
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  openRoleForm = (edit = false) => {
    this.setState(() => ({
      newUserFormOpen: true,
      mode: edit ? 'edit' : 'add',
    }));
  };

  handleSort = sortPayload => {
    const { roleData } = this.state;
    const sortResult = sortData(roleData, sortPayload);
    this.setState({
      users: sortResult,
    });
  };

  createNewUserRole = (payload, callback) => {
    const { t } = this.props;
    createUserRole(payload)
      .then(response => {
        const roleDataCopy = [...this.state.roleData];
        const { id, roleName, roleDescription } = response;
        roleDataCopy.unshift({ id, roleName, roleDescription });
        this.setState({
          newUserFormOpen: false,
          toastMessage: t('SUCCESS.ROLE.ADD', {
            role: roleName,
          }),
          snackType: 'success',
          isApiCallActive: false,
          roleData: roleDataCopy,
          apiError: false,
        });
        callback();
      })
      .catch(error => {
        console.error(error);
        const errorResponse = error.response;
        let errorMessage;
        if (errorResponse && errorResponse.data[0].errorDetails) {
          const msgKey = errorResponse.data[0].errorDetails[0].messageKey;
          switch (msgKey) {
            case 'USER_ROLE_DUPLICATED':
              errorMessage = t(`ERRORS.ROLES.userRoleDuplicate`, {
                name: payload.roleName,
              });
              break;
            default:
              errorMessage = t(`ERRORS.ROLES.roleCreationFailureDefault`);
          }
        } else {
          errorMessage = t(`ERRORS.ROLES.roleCreationFailureDefault`);
        }

        this.setState({
          toastMessage: errorMessage,
          snackType: 'error',
          isApiCallActive: false,
          apiError: true,
        });
      });
  };

  updateUserRole = (payloadData, callback) => {
    const { roleId } = this.state;
    const { t } = this.props;
    payloadData.id = roleId;
    updateUserRole(payloadData)
      .then(response => {
        const roleDataCopy = [...this.state.roleData];
        const editedRoleIndex = roleDataCopy.findIndex(
          role => role.id === roleId
        );
        roleDataCopy[editedRoleIndex] = response;
        this.setState({
          newUserFormOpen: false,
          toastMessage: t('ROLES.newUserRole.updateSuccess', {
            name: response.roleName,
          }),
          snackType: 'success',
          isApiCallActive: false,
          roleData: roleDataCopy,
          selectedRole: {},
          roleId: '',
          apiError: false,
        });
        callback();
        this.removeTableRowClass();
      })
      .catch(error => {
        console.error(error);
        const errorResponse = error.response.data;
        let errorMessage;
        if (Array.isArray(errorResponse) && errorResponse[0].errorDetails) {
          const msgKey = errorResponse[0].errorDetails[0].messageKey;
          if (msgKey)
            switch (msgKey) {
              case 'USER_ROLE_DUPLICATED':
                errorMessage = t(`ERRORS.ROLES.userRoleDuplicate`, {
                  name: payloadData.roleName,
                });
                break;
              case 'USER_ROLE_CANNOT_BE_MODIFIED':
                errorMessage = t(`ERRORS.ROLES.userRoleDuplicate`, {
                  name: payloadData.roleName,
                });
                break;
              default:
                errorMessage = t(`ERRORS.ROLES.roleUpdateFailureDefault`);
            }
        } else {
          errorMessage = t(`ERRORS.ROLES.roleUpdateFailureDefault`);
        }

        this.setState({
          toastMessage: errorMessage,
          snackType: 'error',
          isApiCallActive: false,
          apiError: true,
        });
      });
  };

  updateUserRole = (payloadData, callback) => {
    const { roleId } = this.state;
    const { t } = this.props;
    payloadData.id = roleId;
    updateUserRole(payloadData)
      .then(response => {
        const roleDataCopy = [...this.state.roleData];
        const editedRoleIndex = roleDataCopy.findIndex(
          role => role.id === roleId
        );
        roleDataCopy[editedRoleIndex] = response;
        this.setState({
          newUserFormOpen: false,
          toastMessage: t('SUCCESS.ROLE.EDIT', {
            role: response.roleName,
          }),
          snackType: 'success',
          isApiCallActive: false,
          roleData: roleDataCopy,
          selectedRole: {},
          roleId: '',
        });
        callback();
        this.removeTableRowClass();
      })
      .catch(error => {
        console.error(error);
        let errorMessage;
        const msgKey = error.response.data[0].errorDetails[0].messageKey;
        switch (msgKey) {
          case 'USER_ROLE_DUPLICATED':
            errorMessage = t(`ERRORS.ROLES.userRoleDuplicate`, {
              name: payloadData.roleName,
            });
            break;
          case 'USER_ROLE_CANNOT_BE_MODIFIED':
            errorMessage = t(`ERRORS.ROLES.userRoleDuplicate`, {
              name: payloadData.roleName,
            });
            break;
          default:
            errorMessage = t(`ERRORS.ROLES.roleUpdateFailureDefault`);
        }

        this.setState({
          toastMessage: errorMessage,
          snackType: 'error',
          isApiCallActive: false,
        });
      });
  };

  handleOk = (roleName, roleDescription, permissions, callback) => {
    const { mode } = this.state;
    this.setState({ isApiCallActive: true });
    const payload = {
      roleName,
      roleDescription,
      permissions,
    };
    if (mode === 'add') {
      this.createNewUserRole(payload, callback);
    } else {
      this.updateUserRole(payload, callback);
    }
  };

  onClearSnackBar = () => {
    this.setState({
      toastMessage: '',
      snackType: '',
    });
  };

  deleteUserRoleFunc = roleToDelete => {
    const { t } = this.props;
    const { roleData } = this.state;
    if (typeof 'object' && 'id' in roleToDelete) {
      deleteUserRole(roleToDelete.id)
        .then(() => {
          const filteredRoles = roleData.filter(
            role => role.id !== roleToDelete.id
          );
          this.setState({
            roleData: filteredRoles,
            snackType: 'success',
            toastMessage: t('SUCCESS.ROLE.REMOVE', {
              role: roleToDelete.roleName,
            }),
          });
        })
        .catch(error => {
          this.props.handleDeleteError(error, type, roleToDelete.roleName);
        });
    }
  };

  handleDelete = () => {
    this.deleteUserRoleFunc(this.props.deleteDialogItem);
    this.props.closeDeleteDialog();
  };

  render() {
    const {
      newUserFormOpen,
      mode,
      roleData,
      toastMessage,
      snackType,
      isApiCallActive,
      resources,
      selectedRole,
      apiError,
    } = this.state;
    const {
      t,
      location: locationConfig,
      currentUserRole,
      openDeleteDialog,
      deleteDialogIsOpen,
      closeDeleteDialog,
      exitDeleteDialog,
      deleteDialogItem,
    } = this.props;

    let editMode = false;
    if (locationConfig) {
      editMode = locationConfig.state ? locationConfig.state.editMode : false;
    }

    if (roleData.length > 0)
      return (
        <Container margin={'0 auto'} id="main-container">
          <Header
            t={t}
            tableName={t('ROLES.tableName')}
            openForm={() => this.openRoleForm(false)}
            redirectLink={
              <RedirectLink
                margin="42px 0 0 0"
                position="absolute"
                to={{
                  pathname: `/users`,
                }}
              >
                {t('ROLES.usersLink')}
              </RedirectLink>
            }
          />

          {roleData.length ? (
            <GenericTable
              data={formatRoles(roleData, currentUserRole)}
              headers={getHeaders(t)}
              orderBy={OrderBy}
              order={order}
              totalDataSize={roleData.length}
              handleEditItem={this.handleEditItem}
              handleDeleteItem={openDeleteDialog}
              handleSort={this.handleSort}
              name={t('ROLES.tableName')}
              t={t}
              editMode={editMode}
              handleDisableDelete={role =>
                role.isReadOnly || role.roleName === currentUserRole
              }
              restrictReadOnly={true}
            />
          ) : (
            <DataNotFoundMessage
              text={t('GLOBAL.dataNotFound.message', {
                data: t('GLOBAL.dataNotFound.dataRoles').toLowerCase(),
              })}
            />
          )}
          <DeleteDialog
            open={deleteDialogIsOpen}
            onExited={exitDeleteDialog}
            handleCancel={closeDeleteDialog}
            modalCommand={true}
            onClose={closeDeleteDialog}
            handleOk={this.handleDelete}
            title={t('DIALOG.DELETE_DATA.title', {
              type: t(type).toLowerCase(),
              name: deleteDialogItem.roleName || ' ',
            })}
            bodyText={t('DIALOG.DELETE_DATA.body', {
              type: t(type).toLowerCase(),
              name: deleteDialogItem.roleName || ' ',
            })}
            okText={t('GLOBAL.form.delete')}
            strongText={''}
            t={t}
          />

          <NewUserRole
            open={newUserFormOpen}
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}
            mode={mode}
            t={t}
            isApiCallActive={isApiCallActive}
            resources={resources}
            selectedRole={selectedRole}
            apiError={apiError}
          />

          <Notification
            message={toastMessage}
            autoHideDuration={snackType === 'error' ? 3600000 : 5000}
            clear={this.onClearSnackBar}
            type={snackType}
          />
        </Container>
      );
    else return <Loading />;
  }
}
Roles.propTypes = {
  t: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      editMode: PropTypes.bool,
    }),
  }).isRequired,
  reportError: PropTypes.func.isRequired,
  handleDeleteError: PropTypes.func.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  deleteDialogItem: PropTypes.shape().isRequired,
  closeDeleteDialog: PropTypes.func.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  exitDeleteDialog: PropTypes.func.isRequired,
  deleteDialogIsOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    currentUserRole: user.userData.role,
  };
};

const RolesComponent = connect(mapStateToProps)(Roles);

export default withErrorHandler(withDeleteHandler(RolesComponent)(type));
