import React, { Component } from 'react';
import PropTypes from 'prop-types';

import usersService from './../../services/Users';

import Header from '../../components/Headers/Header';
import UserForm from './UserForm';
import GenericTable from '../../components/GenericTable';
import Loading from '../../components/Loading';
import Container from '../../components/Container';
import DeleteDialog from '../../components/Dialog/DeleteDialog';
import DataNotFoundMessage from '../../components/DataNotFound';
import RedirectLink from '../../components/RedirectLink';

import Notification from '../../components/Notification';
import withErrorHandler from '../../components/ErrorHandler/withErrorHandler';

import { OrderBy, order, getHeaders, type } from './Constants.js';
import { sortData } from '../../utils/sort';
import storage from '../../utils/storage';
import { connect } from 'react-redux';
import { currentUserUpdated } from '../../actions/scenario';
import { setUserDetails } from '../../actions/user';
import { rolesFilter } from './utils';
import { checkPermission } from '../../utils/common';
import scopes from '../../constants/scopes';

export class Users extends Component {
  state = {
    users: [],
    roles: [],
    userFormIsOpen: false,
    deleteDialogIsOpen: false,
    isUsersEmpty: false,
    openSnackBar: false,
    snackMessage: '',
  };

  initialSort = [{ fieldName: OrderBy, direction: order }];

  openDeleteDialog = (user, index) => {
    this.setState({
      deleteDialogIsOpen: true,
      userToDelete: user,
      userIndex: index,
    });
  };

  onCloseSnack = () => {
    // clean the values of snackBar
    this.setState({
      openSnackBar: false,
      snackMessage: '',
      snackType: '',
    });
  };

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogIsOpen: false,
    });
  };

  openEditDialog = user => {
    return usersService
      .getUserDetails(user.id)
      .then(useDetails => {
        return this.setState(
          {
            userToEdit: useDetails,
          },
          () => this.openUserForm(true)
        );
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  openUserForm = (edit = false) => {
    this.setState(state => ({
      userFormIsOpen: true,
      userToEdit: edit ? state.userToEdit : false,
    }));
  };

  closeUserForm = () => {
    this.setState({
      userFormIsOpen: false,
    });
  };

  addUser = user => {
    const { t } = this.props;

    usersService
      .createUser(user)
      .then(r => {
        const fullName = `${r[0].firstName} ${r[0].lastName}`;
        user.id = r[0].id;
        delete user.passwordRe;
        delete user.password;

        this.setState(state => ({
          users: [user, ...state.users],
          isUsersEmpty: false,
          openSnackBar: true,
          snackMessage: t('SUCCESS.USERS.ADD', { user: fullName }),
          snackType: 'success',
          userFormIsOpen: false,
        }));
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  editUser = (user, id) => {
    const { t, userData, setUserDetails, currentuserUpdated } = this.props;
    usersService
      .updateUser({ ...user, id })
      .then(response => {
        const users = [...this.state.users];
        const editedUserIndex = users.findIndex(user => user.id === id);
        users[editedUserIndex] = response[0];
        const fullName = `${response[0].firstName} ${response[0].lastName}`;
        this.setState(
          {
            users: users,
            openSnackBar: true,
            snackMessage: t('SUCCESS.USERS.EDIT', { user: fullName }),
            snackType: 'success',
            userFormIsOpen: false,
          },
          () => {
            const user = userData;
            if (user && user.id === response[0].id.toString()) {
              storage.setItem('loggedUser', response[0]);
              setUserDetails(response[0]);
              currentuserUpdated(true);
            }
          }
        );
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  deleteUser = () => {
    const { t } = this.props;
    const user = this.state.userToDelete;
    const fullName = `${user.firstName} ${user.lastName}`;
    usersService
      .deleteUser(user.id)
      .then(() => {
        this.setState(state => {
          return state.users.length === 1
            ? {
                users: [],
                isUsersEmpty: true,
                openSnackBar: true,
                snackMessage: t('SUCCESS.USERS.REMOVE', { user: fullName }),
                snackType: 'success',
              }
            : {
                users: this.state.users.filter(usr => user.id !== usr.id),
                openSnackBar: true,
                snackMessage: t('SUCCESS.USERS.REMOVE', {
                  user: fullName,
                }),
                snackType: 'success',
              };
        }, this.closeDeleteDialog);
      })
      .catch(error => {
        this.props.reportError({ error });
        this.closeDeleteDialog();
      });
  };

  handleUserForm = (userForm, user) => {
    const changePassword = this.state.userToEdit
      ? userForm.changePassword.checked
      : false;

    if (this.state.userToEdit && !changePassword) {
      delete user.password;
    }

    if (this.state.userToEdit) {
      this.editUser(user, this.state.userToEdit.id);
    } else {
      this.addUser(user);
    }
  };

  componentDidMount() {
    Promise.all([usersService.getUsers(), usersService.getRoles()])
      .then(([users, roles]) => {
        this.setState({
          users: sortData(users, this.initialSort),
          roles: rolesFilter(roles),
        });
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  }

  componentWillUnmount() {
    this.onCloseSnack();
  }

  handleSort = sortPayload => {
    const sortResult = sortData(this.state.users, sortPayload);
    this.setState({
      users: sortResult,
    });
  };

  handleDisableDelete = data => {
    const { userData } = this.props;
    return data.id.toString() === userData.id.toString();
  };

  render() {
    const {
      users,
      userToDelete,
      roles,
      deleteDialogIsOpen,
      userFormIsOpen,
      userToEdit,
      openSnackBar,
      snackMessage,
      snackType,
      buttonText,
    } = this.state;
    const { t, location: locationConfig, userPermissions } = this.props;
    let editMode = false;
    if (locationConfig) {
      editMode = locationConfig.state ? locationConfig.state.editMode : false;
    }

    const redirectPermission = !checkPermission(
      scopes.users.user_roles_manage,
      userPermissions
    );

    if (users.length > 0)
      return (
        <Container margin={'0 auto'} id="main-container">
          <Header
            t={t}
            tableName={t('USERS.tableName')}
            openForm={() => this.openUserForm(false)}
            redirectLink={
              <RedirectLink
                margin="42px 0 0 0"
                position="absolute"
                to={{
                  pathname: `/users/roles`,
                }}
                style={
                  redirectPermission
                    ? { pointerEvents: 'none', color: 'rgba(0, 0, 0, 0.38)' }
                    : {}
                }
              >
                {t('USERS.rolesLink')}
              </RedirectLink>
            }
          />

          {users.length ? (
            <GenericTable
              data={users}
              headers={getHeaders(t)}
              orderBy={OrderBy}
              order={order}
              totalDataSize={users.length}
              handleEditItem={this.openEditDialog}
              handleDeleteItem={this.openDeleteDialog}
              handleSort={this.handleSort}
              name={t('USERS.tableName')}
              t={t}
              editMode={editMode}
              restrictReadOnly={true}
              handleDisableDelete={this.handleDisableDelete}
            />
          ) : (
            <DataNotFoundMessage
              text={t('GLOBAL.dataNotFound.message', {
                data: t('GLOBAL.dataNotFound.dataUsers').toLowerCase(),
              })}
            />
          )}
          <DeleteDialog
            open={deleteDialogIsOpen}
            handleCancel={this.closeDeleteDialog}
            handleOk={this.deleteUser}
            onExited={this.onExitedDialog}
            title={t('DIALOG.DELETE_DATA.title', {
              type: t(type).toLowerCase(),
              name: userToDelete
                ? `${userToDelete.firstName} ${userToDelete.lastName}`
                : ' ',
            })}
            bodyText={t('DIALOG.DELETE_DATA.body', {
              type: t(type).toLowerCase(),
              name: userToDelete
                ? `${userToDelete.firstName} ${userToDelete.lastName}`
                : ' ',
            })}
            okText={t('GLOBAL.form.delete')}
            strongText={
              userToDelete
                ? `${userToDelete.firstName} ${userToDelete.lastName}?`
                : null
            }
            t={t}
            modalCommand={true}
            onClose={this.closeDeleteDialog}
          />
          <UserForm
            user={userToEdit ? userToEdit : null}
            isOpen={userFormIsOpen}
            handleCancel={this.closeUserForm}
            handleOk={this.handleUserForm}
            formId={'userform'}
            t={t}
            roles={roles}
            onClose={this.closeUserForm}
          />
          {openSnackBar && (
            <Notification
              autoHideDuration={5000}
              message={snackMessage}
              clear={this.onCloseSnack}
              type={snackType}
              buttonText={buttonText}
            />
          )}
        </Container>
      );
    else return <Loading />;
  }
}

Users.propTypes = {
  t: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  currentuserUpdated: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      openItemName: PropTypes.string.isRequired,
      editMode: PropTypes.bool,
    }),
  }).isRequired,
  setUserDetails: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
  userPermissions: PropTypes.objectOf(PropTypes.string).isRequired,
};

Users.defaultProps = {
  userData: {},
};

const mapStatetoProps = state => {
  return {
    userData: state.user.userData,
    userPermissions: state.user.permissions,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    currentuserUpdated: bool => dispatch(currentUserUpdated(bool)),
    setUserDetails: data => dispatch(setUserDetails(data)),
  };
};
const UsersComponent = connect(mapStatetoProps, mapDispatchToProps)(Users);

export default withErrorHandler(UsersComponent);
