import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import InputMUI from '@material-ui/core/TextField';
import { ListItemIcon } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import Dialog from '../../components/Dialog/Form';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import TextArea from '../../components/TextArea';
import { perfectScrollConfig } from '../../utils/common';
import { evaluateRegex } from '../../utils/common';
import { USER_ROLE_NAME_REGEX } from './constants';
import getSelectedPermissionsfromResource, {
  setPermissionstoResource,
  adminId,
} from './utils';
import Access from './Access';

const AddDialog = styled(Dialog)`
  & div:last-child form {
    width: 856px;
    max-width: 856px;
  }
  & div:last-child form > div:first-child {
    padding-top: 10px;
    background: #f7f7f7;
  }
  .MuiDialog-paperWidthSm {
    max-width: 856px;
  }
`;

const Input = styled(InputMUI)`
  & label {
    color: rgba(0, 0, 0, 0.87);
  }
  &.error > label {
    color: #d10000 !important;
  }
`;

const MuiSwitch = styled(Switch)`
  & .MuiSwitch-switchBase {
    left: 6px !important;
    bottom: 0px !important;
    color: #808080;
  }
  & .MuiSwitch-track {
    background-color: #cccccc;
    opacity: 1;
  }
  & .MuiSwitch-colorSecondary.Mui-checked {
    color: #ff650c !important;
  }
  & .MuiIconButton-root:hover {
    background-color: transparent;
  }
`;

const PermissionText = styled.p`
  font-size: 14px;
  color: #333333;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0;
`;

const PermissionContent = styled.div`
  display: flex;
  border: 1px solid #cccccc;
  background: #ffffff;
  & > div:first-child {
    width: 30%;
    border-right: 1px solid #cccccc;
  }
  & > div:last-child {
    width: 70%;
  }
`;

const PermissionCard = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 2px 0;
  cursor: pointer;
  &:hover {
    background: #ebebeb;
  }
  & > div:first-child {
    width: 25%;
  }
  & > div:nth-child(2) {
    width: 65%;
  }
  & > div:last-child {
    width: 10%;
  }
  .MuiSvgIcon-fontSizeSmall {
    font-size: 1rem;
  }
`;

const ResourceDiv = styled.div`
  max-height: 200px;

  @media (min-height: 700px) {
    max-height: 350px;
  }
`;

class NewUserRole extends Component {
  state = {
    name: '',
    description: '',
    resources: [],
    selectedResource: null,
    errors: {
      name: false,
    },
    saveButtonDisable: true,
  };

  permissionCommon = 'ROLES.newUserRole.permissions';
  permissionGroups = ['permissionsDisabled', 'permissionsEnabled'];
  permissionSubGroups = ['permissionGroupDisabled', 'permissionGroupEnabled'];

  componentWillReceiveProps(nextProps) {
    const {
      mode,
      resources,
      selectedRole,
      apiError,
      isApiCallActive,
    } = nextProps;
    const updatedState = {};
    updatedState.resources = cloneDeep(resources);
    if (mode === 'edit') {
      updatedState.name = selectedRole.roleName;
      updatedState.description = selectedRole.roleDescription;
      updatedState.resources = setPermissionstoResource(
        updatedState.resources,
        selectedRole.permissions
      );
    }
    if (!apiError && !isApiCallActive) {
      this.setState(updatedState);
    }
  }

  componentDidMount() {
    const { resources } = this.props;
    this.setState({ resources: cloneDeep(resources) });
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.isApiCallActive;
  }

  shouldEnableCreateButton = () => {
    const { name, resources, saveButtonDisable, errors } = this.state;
    const { isApiCallActive, selectedRole } = this.props;
    let isAnyPermissionEnabled = false;
    resources.forEach(resource => {
      if (resource.enabled) {
        isAnyPermissionEnabled = true;
      }
    });
    if (selectedRole.id === adminId) {
      return false;
    } else {
      return (
        !(name !== '' && isAnyPermissionEnabled) ||
        isApiCallActive ||
        saveButtonDisable ||
        errors.name
      );
    }
  };

  updateResource = updatedResource => {
    const { resources } = this.state;
    resources.forEach(resource => {
      if (resource.accessKey === updatedResource.accessKey) {
        resource = updatedResource;
      }
    });
    this.setState({ resources });
  };

  validateRoleNameAndSetErrors = () => {
    const { name, errors } = this.state;
    if (name !== '') {
      const isValidRegex = evaluateRegex(USER_ROLE_NAME_REGEX, name);
      this.setState({ errors: { ...errors, name: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, name: false } });
    }
  };

  handleResourceToggle = accessKey => {
    const { resources } = this.state;
    const resource = resources.find(
      resource => resource.accessKey === accessKey
    );
    resource.enabled = !resource.enabled;
    if (!resource.enabled) {
      this.clearPermissions(resource);
    }

    if (resource.enabled) {
      this.setDefaultPermission(resource);
    }

    if (resource) {
      this.setState({
        resources,
        saveButtonDisable: false,
      });
    } else {
      this.setState({ saveButtonDisable: false });
    }
  };

  clearPermissions = resource => {
    this.permissionGroups.forEach(group => {
      if (resource[group] && resource[group].length) {
        resource[group].forEach(permission => {
          permission.options.forEach(option => {
            option.selected = false;
            if (option.hasGroup) {
              this.clearSubGroupSelection(option);
            }
          });
        });
      }
    });
  };

  setDefaultPermission = resource => {
    this.permissionGroups.forEach(group => {
      if (resource[group] && resource[group].length) {
        resource[group].forEach(permission => {
          permission.options.forEach(option => {
            if (resource.defaultPermission === option.permissionKey) {
              option.selected = true;
            }
          });
        });
      }
    });
  };

  clearSubGroupSelection = option => {
    this.permissionSubGroups.forEach(group => {
      if (option[group] && option[group].length) {
        option[group].forEach(opt => {
          opt.options.forEach(o => {
            o.selected = false;
            if (o.hasGroup) {
              this.clearSubGroupSelection(o);
            }
          });
        });
      }
    });
  };

  handleChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value, saveButtonDisable: false }, () => {
      switch (name) {
        case 'name':
          this.validateRoleNameAndSetErrors();
          break;
        default:
          return 0;
      }
    });
  };

  setSelectedResource = resource => {
    this.setState({ selectedResource: resource });
  };

  handleOk = () => {
    const { resources, name, description } = this.state;
    const { handleOk, selectedRole } = this.props;
    const permissionsSelected = getSelectedPermissionsfromResource(resources);
    if (selectedRole.id === adminId) {
      this.handleCancel();
    } else {
      this.setState({ saveButtonDisable: true }, () =>
        handleOk(name, description, permissionsSelected, this.resetData)
      );
    }
  };

  resetData = () => {
    const { resources } = this.props;
    this.setState({
      resources: cloneDeep(resources),
      selectedResource: null,
      name: '',
      description: '',
      saveButtonDisable: true,
    });
  };

  /* Check recursively if the given permission list has atleast one deselected option */
  isFullAccess = permissionEnabled => {
    let fullAccess = true;
    permissionEnabled.forEach(permission => {
      permission.options.forEach(option => {
        if (!option.selected) {
          fullAccess = false;
        } else if (option.hasGroup) {
          this.isFullAccess(option.permissionGroupEnabled);
        }
      });
    });
    return fullAccess;
  };

  /* The method returns back custom text messages corresponding to different resource */
  getCustomTexts = access => {
    const viewAndManageRadioLevel = ['DASHBOARD', 'SCENARIOS', 'TEMPLATES'];
    const { t } = this.props;
    if (viewAndManageRadioLevel.includes(access.accessKey)) {
      if (access.permissionsEnabled[0].options[0].selected) {
        return t(`${this.permissionCommon}.viewOnly`);
      } else if (access.permissionsEnabled[0].options[1].selected) {
        return this.isFullAccess(
          access.permissionsEnabled[0].options[1].permissionGroupEnabled
        )
          ? t(`${this.permissionCommon}.viewAndManageFull`)
          : t(`${this.permissionCommon}.viewAndManagePartial`);
      }
    } else if (access.accessKey === 'REPORTS') {
      return this.isFullAccess(access.permissionsEnabled)
        ? t(`${this.permissionCommon}.generateAndManage`)
        : t(`${this.permissionCommon}.generate`);
    } else if (access.accessKey === 'AUDIT_TRAIL') {
      return t(`${this.permissionCommon}.view`);
    } else if (access.accessKey === 'SETTINGS') {
      return this.isFullAccess(access.permissionsEnabled)
        ? t(`${this.permissionCommon}.modifyFull`)
        : t(`${this.permissionCommon}.modifyPartial`);
    } else if (access.accessKey === 'USERS') {
      return this.isFullAccess(access.permissionsEnabled)
        ? t(`${this.permissionCommon}.viewAndManageFull`)
        : t(`${this.permissionCommon}.viewAndManagePartial`);
    } else {
      return t(`${this.permissionCommon}.unknown`);
    }
  };

  getPermissionText = access => {
    const { t } = this.props;
    if (access) {
      if (!access.enabled) {
        return t(`${this.permissionCommon}.noAccess`);
      } else {
        return this.getCustomTexts(access);
      }
    }
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel(this.resetData);
  };

  enableSave = (hasChanged = false) => {
    const { mode } = this.props;
    if (mode === 'edit') {
      this.setState({ saveButtonDisable: !hasChanged });
    }
  };

  render() {
    const { t, isApiCallActive, mode, selectedRole, ...rest } = this.props;
    const {
      errors,
      name,
      resources,
      selectedResource,
      description,
    } = this.state;
    const editModeText = 'edit';
    const roleOption = 'ROLES.newUserRole';
    const title =
      mode === editModeText
        ? t(`${roleOption}.editFormTitle`)
        : t(`${roleOption}.formTitle`);

    const buttonOption =
      selectedRole.id === adminId
        ? 'CLOSE'
        : mode === editModeText
        ? t(`${roleOption}.updateRoleButton`)
        : t(`${roleOption}.createNewRoleButton`);

    return (
      <AddDialog
        title={title}
        subTitle={name}
        disableSave={this.shouldEnableCreateButton()}
        {...rest}
        handleCancel={this.handleCancel}
        onClose={this.handleCancel}
        handleOk={this.handleOk}
        okButton={buttonOption}
        hideCancelBtn={selectedRole.id === adminId}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '48%' }}>
            <Input
              inputProps={{
                name: 'name',
                maxLength: 50,
                required: true,
              }}
              id="name"
              label={t('ROLES.newUserRole.userRoleName')}
              required
              fullWidth
              value={name}
              onChange={this.handleChange}
              color="primary"
              className={errors.name ? 'error' : ''}
              disabled={selectedRole.id === adminId}
            />
            <ErrorMessage
              error={errors.name}
              isVisible={errors.name}
              message={t(`ERRORS.ROLES.userRoleName`)}
            />
          </div>
          <TextArea
            inputProps={{
              name: 'description',
              maxLength: 250,
            }}
            id="description"
            label={t('ROLES.newUserRole.description')}
            value={description}
            style={{ display: 'block', width: '48%' }}
            onChange={this.handleChange}
            fullWidth
            multiline
            customheight="75"
            disabled={selectedRole.id === adminId}
          />
        </div>
        <div>
          <PermissionText style={{ fontSize: '16px', marginBottom: '8px' }}>
            {t('ROLES.newUserRole.permissionsText')}
          </PermissionText>
          <PermissionText style={{ fontWeight: 400, marginBottom: '8px' }}>
            {t('ROLES.newUserRole.permissionSubtext')}
          </PermissionText>
          <PermissionContent>
            <div>
              <PerfectScrollbar option={perfectScrollConfig}>
                <ResourceDiv>
                  <PermissionText
                    style={{ fontSize: '15px', padding: '10px 8px' }}
                  >
                    {' '}
                    {t('ROLES.newUserRole.grantDenyAccess')}
                  </PermissionText>
                  <div style={{ overflow: 'hidden' }}>
                    {resources.map(resource => {
                      const isSelected =
                        selectedResource &&
                        resource &&
                        selectedResource.accessKey === resource.accessKey;
                      return (
                        <PermissionCard
                          onClick={() => this.setSelectedResource(resource)}
                          style={isSelected ? { background: '#EBEBEB' } : {}}
                        >
                          <div>
                            <MuiSwitch
                              checked={resource.enabled}
                              disabled={selectedRole.id === adminId}
                              onChange={() =>
                                this.handleResourceToggle(resource.accessKey)
                              }
                              name="resourceToggle"
                            />
                          </div>
                          <div>
                            {' '}
                            <PermissionText
                              style={{
                                fontWeight: resource.enabled ? 700 : 400,
                              }}
                            >
                              {t(
                                `ROLES.newUserRole.resources.${resource.accessKey}`
                              ) || resource.accessName}
                            </PermissionText>
                            <PermissionText
                              style={{ fontSize: '12px', fontWeight: 400 }}
                            >
                              {this.getPermissionText(resource)}
                            </PermissionText>
                          </div>
                          <div>
                            <ListItemIcon
                              style={{ width: '10px', color: '#979797' }}
                            >
                              <ArrowForwardIosIcon fontSize="small" />
                            </ListItemIcon>
                          </div>
                        </PermissionCard>
                      );
                    })}
                  </div>
                </ResourceDiv>
              </PerfectScrollbar>
            </div>
            <div>
              <PermissionText style={{ fontSize: '15px', padding: '10px 8px' }}>
                {' '}
                {t('ROLES.newUserRole.options')}
              </PermissionText>
              <Access
                t={t}
                resource={selectedResource}
                updateResource={this.updateResource}
                enableSave={this.enableSave}
                disable={selectedRole.id === adminId}
              />
            </div>
          </PermissionContent>
        </div>
      </AddDialog>
    );
  }
}
NewUserRole.propTypes = {
  resources: PropTypes.shape([{}]).isRequired,
  open: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  okButton: PropTypes.string,
  cancelButton: PropTypes.string,
  isApiCallActive: PropTypes.bool,
  mode: PropTypes.string,
  selectedRole: PropTypes.shape([{}]),
  apiError: PropTypes.bool,
};

NewUserRole.defaultProps = {
  okButton: '',
  cancelButton: '',
  isApiCallActive: false,
  mode: 'add',
  selectedRole: {},
  apiError: false,
};

export default NewUserRole;
