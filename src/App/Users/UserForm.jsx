import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pick from 'lodash/pick';
import get from 'lodash/get';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import MUIFormControl from '@material-ui/core/FormControl';

import ModelSelector from '../../components/ModelSelector';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import Form from '../../components/FormDrawer/Form';
import FormHeader from '../../components/FormDrawer/FormHeader';
import FormBody from '../../components/FormDrawer/FormBody';
import PasswordValidator from '../../components/PasswordValidator/PasswordValidator';
import { perfectScrollConfig } from '../../utils/common';

import {
  mapEntityToState,
  updateErrors,
  wereAllFieldsFilled,
  hasError,
} from './utils';
import { ENTITY_FIELDS, getDefaultEntity } from './Constants';

const Input = styled(TextField)`
  .MuiFormLabel-root.Mui-disabled {
    color: rgba(0, 0, 0, 0.38) !important;
  }
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

const GridMarginTop = styled(Grid)`
  margin-top: 14px;
`;

const GridCheckbox = styled(Grid)`
  & span {
    font-size: 14px;
  }
  margin-bottom: -32px;
  margin-top: -14px;
`;

class UserForm extends Component {
  state = {
    ...getDefaultEntity(),
    passwordRe: '',
    disablePasswordField: false,
    selectedRole: false,
    isFormDirty: false,
    errors: {
      firstName: false,
      lastName: false,
      userName: false,
      email: false,
      password: false,
      passwordRe: false,
      roleId: false,
    },
  };

  componentWillReceiveProps(nextProps) {
    const hasToggleOpen = this.props.isOpen !== nextProps.isOpen;
    const hasUserChanged =
      get(this.props.user, 'id') !== get(nextProps.user, 'id');

    if (!hasToggleOpen && !hasUserChanged) return;

    const dataToUpdate = {
      ...mapEntityToState(nextProps.user),
      passwordRe: '',
      disablePasswordField: false,
      isFormDirty: false,
      errors: {
        firstName: false,
        lastName: false,
        userName: false,
        email: false,
        password: false,
        passwordRe: false,
        roleId: false,
      },
    };

    if (nextProps.user) {
      dataToUpdate.disablePasswordField = true;
    }

    this.setState(dataToUpdate);
  }

  tooglePasswordFields = () => {
    const { disablePasswordField, errors } = this.state;

    const dataToUpdate = {
      disablePasswordField: !disablePasswordField,
      password: '',
      passwordRe: '',
      errors: {
        ...errors,
        password: false,
        passwordRe: false,
      },
    };

    this.forcePasswordFieldsCleanUp();

    this.setState(dataToUpdate, this.checkFormIsReady);
  };

  forcePasswordFieldsCleanUp = () => {
    document.getElementById('password').value = '';
    document.getElementById('passwordRe').value = '';
    /* The below piece of code is in order to remove the active behavior of an input,
       MUI does this by default but unfortunately on this case does not
    */
    const Labels = document.querySelectorAll("label[for^='password']");
    for (let i = 0; i < Labels.length; i++) {
      const labelClass = Labels[i].getAttribute('class');
      const classes = labelClass.split(' ');
      for (let j = 0; j < classes.length; j++) {
        if (classes[j].includes('shrink')) {
          Labels[i].classList.remove(classes[j]);
        }
      }
    }
    /* End code's comments */
  };

  isReadyToSubmit() {
    return !this.state.isFormDirty;
  }

  handleInputChange = e => {
    this.onChange(e.target.name, e.target.value);
  };

  onChange = (fieldName, value, shouldValidForm = true) => {
    const errors = updateErrors(fieldName, value, this.state);
    const { roles } = this.props;
    const role = {};
    let valueToBeSelected = {
      errors,
      [fieldName]: value,
    };
    if (fieldName === 'roleId') {
      const selectedRole = roles.filter(role => role.id === value);
      role['role'] = selectedRole[0].roleName;
      valueToBeSelected = { ...valueToBeSelected, ...role };
    }
    this.setState(valueToBeSelected, () => {
      if (shouldValidForm) this.checkFormIsReady();
    });
  };

  checkFormIsReady = () => {
    const { isFormDirty } = this.state;
    const _hasError = hasError(this.state.errors);
    const allFieldsWereFilled = wereAllFieldsFilled(this.state, this.props);

    if (allFieldsWereFilled && !_hasError) {
      if (!isFormDirty) {
        this.setState({
          isFormDirty: true,
        });
      }
    } else {
      if (isFormDirty) {
        this.setState({
          isFormDirty: false,
        });
      }
    }
  };

  handleSubmit = formRef => {
    const entity = pick(this.state, ENTITY_FIELDS);
    if (this.props.user) entity.id = this.props.user.id;
    this.props.handleOk(formRef, entity);
  };

  render() {
    const { t, roles, user, ...rest } = this.props;
    const addUser = 'DIALOG.ADD_USER';
    const editUser = 'DIALOG.EDIT_USER';
    const errorMessages = 'ERRORS.USERS';
    const {
      errors,
      firstName,
      lastName,
      userName,
      email,
      password,
      passwordRe,
      roleId,
    } = this.state;

    return (
      <Form
        okButton={t(`${user ? editUser : addUser}.ok`)}
        isDisabled={this.isReadyToSubmit()}
        anchor={'right'}
        formId={'userform'}
        restrictReadOnly={true}
        {...rest}
        handleOk={this.handleSubmit}
      >
        <FormHeader>
          <span>{!user ? t(`${addUser}.title`) : t(`${editUser}.title`)}</span>
          <span>{`${firstName} ${lastName}`}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl error={errors.firstName}>
                    <Input
                      inputProps={{
                        name: 'firstName',
                        maxLength: 50,
                      }}
                      id="firstName"
                      label={t(`${addUser}.firstName`)}
                      margin="normal"
                      onChange={this.handleInputChange}
                      defaultValue={firstName}
                      className={errors.firstName ? 'error' : ''}
                      required
                    />
                    <ErrorMessage
                      isVisible={errors.firstName}
                      message={t(`${errorMessages}.firstName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl error={errors.lastName}>
                    <Input
                      inputProps={{
                        name: 'lastName',
                        maxLength: 50,
                      }}
                      id="lastName"
                      label={t(`${addUser}.lastName`)}
                      margin="normal"
                      defaultValue={lastName}
                      onChange={this.handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      required
                    />
                    <ErrorMessage
                      isVisible={errors.lastName}
                      message={t(`${errorMessages}.lastName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.userName}>
                    <Input
                      inputProps={{
                        name: 'userName',
                        maxLength: 25,
                      }}
                      id="userName"
                      label={t(`${addUser}.userName`)}
                      margin="normal"
                      defaultValue={userName}
                      onChange={this.handleInputChange}
                      className={errors.userName ? 'error' : ''}
                      required
                      disabled={user}
                    />
                    <ErrorMessage
                      isVisible={errors.userName}
                      message={t(`${errorMessages}.userName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.email}>
                    <Input
                      inputProps={{
                        name: 'email',
                        maxLength: 100,
                      }}
                      id="email"
                      label={t(`${addUser}.email`)}
                      margin="normal"
                      defaultValue={email}
                      onChange={this.handleInputChange}
                      className={errors.email ? 'error' : ''}
                      required
                    />
                    <ErrorMessage
                      isVisible={errors.email}
                      message={t(`${errorMessages}.emailMalformed`)}
                    />
                  </FormControl>
                </Grid>
                {this.props.user && (
                  <GridCheckbox item xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ padding: 8 }}
                          color="secondary"
                          onChange={this.tooglePasswordFields}
                        />
                      }
                      name="changePassword"
                      label="Change password"
                      style={
                        !this.state.disablePasswordField
                          ? { paddingBottom: 22 }
                          : {}
                      }
                    />
                  </GridCheckbox>
                )}
                <Grid item xs={12} sm={12}>
                  <Collapse
                    in={!this.state.disablePasswordField || !this.props.user}
                  >
                    <Grid item xs={12} sm={12}>
                      <FormControl error={errors.password}>
                        <Input
                          inputProps={{
                            name: 'password',
                            type: 'password',
                            maxLength: 50,
                          }}
                          id="password"
                          label={
                            user
                              ? t(`${editUser}.password`)
                              : t(`${addUser}.password`)
                          }
                          margin="normal"
                          defaultValue={password}
                          onChange={this.handleInputChange}
                          required={
                            !this.state.disablePasswordField || !this.props.user
                          }
                        />
                        <PasswordValidator t={t} value={password} />
                      </FormControl>
                    </Grid>
                    <GridMarginTop item xs={12} sm={12}>
                      <FormControl error={errors.passwordRe}>
                        <Input
                          inputProps={{
                            name: 'passwordRe',
                            type: 'password',
                            maxLength: 50,
                          }}
                          id="passwordRe"
                          label={
                            user
                              ? t(`${editUser}.passwordRe`)
                              : t(`${addUser}.passwordRe`)
                          }
                          margin="normal"
                          defaultValue={passwordRe}
                          onChange={this.handleInputChange}
                          className={errors.passwordRe ? 'error' : ''}
                          required={
                            !this.state.disablePasswordField || !this.props.user
                          }
                        />
                        <ErrorMessage
                          isVisible={errors.passwordRe}
                          message={t(`${errorMessages}.passwordDoNotMatch`)}
                        />
                      </FormControl>
                    </GridMarginTop>
                  </Collapse>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <ModelSelector
                      label={t(`${addUser}.role`)}
                      name="roleId"
                      items={roles}
                      required={true}
                      selected={roleId}
                      menukey="id"
                      menuitemlabel="roleName"
                      setDefaultOption={false}
                      handleChange={value => this.onChange('roleId', value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

UserForm.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lastName: PropTypes.string.isRequired,
    password: PropTypes.string,
    role: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
};

UserForm.defaultProps = {
  user: null,
};

export default UserForm;
