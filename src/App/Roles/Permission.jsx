import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonMUI from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormGroup } from '@material-ui/core';

import './Roles.scss';

const ClearAllButton = styled(ButtonMUI)`
  text-transform: none;
  font-size: 10px;
  padding: 0;
  margin-top: 3px;
  &:hover {
    background-color: transparent;
  }
  & .MuiButton-startIcon {
    margin-right: 0px;
  }
`;

const SelectAllButton = styled(ButtonMUI)`
  text-transform: none;
  font-size: 10px;
  padding: 0;
  margin-top: 3px;
  margin-right: 10px;
  &:hover {
    background-color: transparent;
  }
  & .MuiButton-startIcon {
    margin-right: 0px;
  }
`;

const SubPermission = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
  & > div {
    width: 100%;
  }
  & > div > div > label {
    margin-bottom: 16px;
    & > span:first-child {
      margin-right: 8px;
    }
  }
`;

class Permission extends Component {
  state = {
    options: this.props.options,
  };

  permissionCommon = 'ROLES.newUserRole.permissionDescription';

  componentWillReceiveProps(nextProps) {
    this.setState({ options: nextProps.options });
  }

  getSelectionDetails = () => {
    const { options } = this.state;
    let atLeastOneSelected = false;
    let isAllSelected = true;
    options.forEach(option => {
      if (option.hasGroup) {
        // checking for subgroups only
        option.permissionGroupEnabled.forEach(opt => {
          opt.options.forEach(o => {
            if (o.selected) {
              atLeastOneSelected = true;
            }
            if (!o.selected) {
              isAllSelected = false;
            }
          });
        });
      }
    });
    return { atLeastOneSelected, isAllSelected };
  };

  handleSelectAll = (value = true) => {
    const { selectedResource, updateResource, enableSave } = this.props;
    const options = [...this.state.options];
    enableSave(true);
    options.forEach(option => {
      if (option.hasGroup) {
        // checking for subgroups only
        option.permissionGroupEnabled.forEach(opt => {
          opt.options.forEach(o => {
            o.selected = value;
          });
        });
      }
    });
    this.setState({ options }, () => {
      updateResource(selectedResource);
    });
  };

  handleChange = (e, opt, displayType) => {
    const options = [...this.state.options];
    const { selectedResource, updateResource, enableSave } = this.props;
    enableSave(true);
    options.forEach(option => {
      if (displayType === 'radio') {
        if (option.permissionKey === opt.permissionKey) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      } else if (displayType === 'checkbox') {
        if (option.permissionKey === opt.permissionKey) {
          option.selected = e.target.checked;
        }
      }
      if (option.hasGroup) {
        this.updateChildPermissions(option);
      }
    });
    this.setState({ options }, () => {
      updateResource(selectedResource);
    });
  };

  updateChildPermissions(permission) {
    // we need to update only the Disabled child if parent is updated
    if (permission.permissionGroupDisabled) {
      permission.permissionGroupDisabled.forEach(childPermission => {
        childPermission.options.forEach(opt => {
          opt.selected = permission.selected;
          if (opt.hasGroup) {
            this.updateChildPermissions(opt); // recursively update all child Groups
          }
        });
      });
    }
    if (permission.permissionGroupEnabled && !permission.selected) {
      permission.permissionGroupEnabled.forEach(childPermission => {
        childPermission.options.forEach(opt => {
          opt.selected = permission.selected;
          if (opt.hasGroup) {
            this.updateChildPermissions(opt); // recursively update all child Groups
          }
        });
      });
    }
  }

  getMenuButtons = (resourceEnabled = false) => {
    const { atLeastOneSelected, isAllSelected } = this.getSelectionDetails();
    const { disabled } = this.props;
    return (
      <div
        style={{
          textAlign: 'right',
          borderTop: '1px solid #cccccc',
        }}
      >
        <SelectAllButton
          disabled={!resourceEnabled || isAllSelected || disabled}
          color="primary"
          startIcon={<CheckIcon />}
          disableRipple={true}
          disableFocusRipple={true}
          onClick={this.handleSelectAll}
        >
          {this.props.t('ROLES.newUserRole.selectAll')}
        </SelectAllButton>
        <ClearAllButton
          disabled={!resourceEnabled || !atLeastOneSelected || disabled}
          color="primary"
          startIcon={<CloseIcon />}
          disableRipple={true}
          disableFocusRipple={true}
          onClick={() => this.handleSelectAll(false)}
        >
          {this.props.t('ROLES.newUserRole.clearAll')}
        </ClearAllButton>
      </div>
    );
  };
  createSubPermissions = (resource, resourceEnabled = false) => {
    const { permissionGroupDisabled, permissionGroupEnabled } = resource;
    const {
      t,
      selectedResource,
      updateResource,
      enableSave,
      disabled,
    } = this.props;

    return (
      <SubPermission>
        <div>
          {permissionGroupDisabled.map(permission => {
            return permission.displayType === 'radio' ? (
              <RadioGroup name={permission.groupName}>
                <Permission
                  t={t}
                  options={permission.options || []}
                  displayType={permission.displayType}
                  selectedResource={selectedResource}
                  updateResource={updateResource}
                  disabled
                  enableSave={enableSave}
                />
              </RadioGroup>
            ) : (
              <FormGroup>
                <Permission
                  t={t}
                  options={permission.options || []}
                  displayType={permission.displayType}
                  selectedResource={selectedResource}
                  updateResource={updateResource}
                  disabled
                  enableSave={enableSave}
                />
              </FormGroup>
            );
          })}

          {permissionGroupEnabled.map(permission => {
            return (
              <Fragment>
                {permission.options.length >= 4 &&
                  this.getMenuButtons(resourceEnabled)}
                {permission.displayType === 'radio' ? (
                  <RadioGroup name={permission.groupName}>
                    <Permission
                      t={t}
                      options={permission.options || []}
                      displayType={permission.displayType}
                      selectedResource={selectedResource}
                      disabled={!resource.selected || disabled}
                      updateResource={updateResource}
                      enableSave={enableSave}
                    />
                  </RadioGroup>
                ) : (
                  <FormGroup>
                    <Permission
                      t={t}
                      options={permission.options || []}
                      displayType={permission.displayType}
                      selectedResource={selectedResource}
                      disabled={!resource.selected || disabled}
                      updateResource={updateResource}
                      enableSave={enableSave}
                    />
                  </FormGroup>
                )}
              </Fragment>
            );
          })}
        </div>
      </SubPermission>
    );
  };

  render() {
    const { displayType, groupName, disabled, t } = this.props;
    const { options } = this.state;
    return (
      <Fragment>
        {options.map(option => {
          return (
            <Fragment>
              <FormControlLabel
                style={{ width: 'fit-content' }}
                value={option.permissionKey}
                control={
                  displayType === 'radio' ? (
                    <Radio
                      name={groupName}
                      disabled={disabled}
                      onChange={e => this.handleChange(e, option, displayType)}
                      checked={option.selected}
                    />
                  ) : (
                    <Checkbox
                      name={groupName}
                      checked={option.selected}
                      disabled={disabled}
                      onChange={e => this.handleChange(e, option, displayType)}
                      className={
                        disabled && option.selected
                          ? 'checkboxEnabledAndDisabled'
                          : ''
                      }
                    />
                  )
                }
                label={
                  t(`${this.permissionCommon}.${option.permissionKey}`) ||
                  option.permissionName
                }
              />
              {option.hasGroup &&
                this.createSubPermissions(option, option.selected)}
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
}

Permission.propTypes = {
  updateResource: PropTypes.func.isRequired,
  selectedResource: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired,
  displayType: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  options: PropTypes.shape([]).isRequired,
  enableSave: PropTypes.func.isRequired,
};

Permission.defaultProps = {};

export default Permission;
