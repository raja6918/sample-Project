import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ButtonMUI from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import RadioGroup from '@material-ui/core/RadioGroup';
import { FormGroup } from '@material-ui/core';

import { perfectScrollConfig } from '../../utils/common';
import Permission from './Permission';

const OptionsContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 2px 2px 12px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
  max-height: 160px;

  & > div > div > label {
    margin-bottom: 16px;
    & > span:first-child {
      margin-right: 8px;
    }
  }
  .MuiFormControlLabel-root {
    margin-left: 0;
  }
  .MuiTypography-root {
    font-size: 14px;
  }

  @media (min-height: 700px) {
    max-height: 290px;
  }
`;

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

class Access extends Component {
  scrollRef = React.createRef();

  componentWillReceiveProps(nxtProps) {
    const { resource } = this.props;
    const { resource: nxtResource } = nxtProps;
    if (nxtResource && resource && nxtResource.accessKey !== resource.accessKey)
      this.scrollRef.scrollTop = 0;
  }

  createPermissions = resource => {
    const { permissionsDisabled, permissionsEnabled } = resource;
    const {
      t,
      updateResource,
      resource: selectedResource,
      enableSave,
      disable,
    } = this.props;
    return (
      <Fragment>
        {permissionsDisabled.map(permission => {
          return permission.displayType === 'radio' ? (
            <RadioGroup name={permission.groupName}>
              <Permission
                t={t}
                options={permission.options || []}
                displayType={permission.displayType}
                updateResource={updateResource}
                groupName={permission.groupName}
                disabled
                selectedResource={selectedResource}
                enableSave={enableSave}
              />
            </RadioGroup>
          ) : (
            <FormGroup>
              <Permission
                t={t}
                options={permission.options || []}
                displayType={permission.displayType}
                updateResource={updateResource}
                groupName={permission.groupName}
                disabled
                selectedResource={selectedResource}
                enableSave={enableSave}
              />
            </FormGroup>
          );
        })}
        {permissionsEnabled.length >= 4 && this.getMenuButtons()}
        {permissionsEnabled.map(permission => {
          return permission.displayType === 'radio' ? (
            <RadioGroup name={permission.groupName}>
              <Permission
                t={t}
                options={permission.options || []}
                displayType={permission.displayType}
                updateResource={updateResource}
                groupName={permission.groupName}
                disabled={!resource.enabled || disable}
                selectedResource={selectedResource}
                enableSave={enableSave}
              />
            </RadioGroup>
          ) : (
            <FormGroup>
              <Permission
                t={t}
                options={permission.options || []}
                displayType={permission.displayType}
                updateResource={updateResource}
                groupName={permission.groupName}
                disabled={!resource.enabled || disable}
                selectedResource={selectedResource}
                enableSave={enableSave}
              />
            </FormGroup>
          );
        })}
      </Fragment>
    );
  };

  // this level of select all functionality is not yet implemented
  getMenuButtons = () => {
    const { t } = this.props;
    return (
      <div
        style={{
          textAlign: 'right',
          borderTop: '1px solid #cccccc',
        }}
      >
        <SelectAllButton
          //   disabled={!enableClearAll}
          color="primary"
          startIcon={<CheckIcon />}
          disableRipple={true}
          disableFocusRipple={true}
          //   onClick={handleClearAll}
        >
          {t('USERS.newUserRole.selectAll')}
        </SelectAllButton>
        <ClearAllButton
          //   disabled={!enableClearAll}
          color="primary"
          startIcon={<CloseIcon />}
          disableRipple={true}
          disableFocusRipple={true}
          //   onClick={handleClearAll}
        >
          {t('USERS.newUserRole.clearAll')}
        </ClearAllButton>
      </div>
    );
  };

  render() {
    const { resource } = this.props;
    return (
      <OptionsContent>
        <PerfectScrollbar
          option={perfectScrollConfig}
          containerRef={ref => {
            this.scrollRef = ref;
          }}
        >
          {resource && this.createPermissions(resource)}
        </PerfectScrollbar>
      </OptionsContent>
    );
  }
}

Access.propTypes = {
  resource: PropTypes.shape({}).isRequired,
  updateResource: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

Access.defaultProps = {};

export default Access;
