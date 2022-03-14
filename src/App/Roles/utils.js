import React from 'react';
import { cutOffTextWithEllipsis } from '../../utils/common';

const roleDescDisplayLimit = 60;

/**
 * @summary - Used to format default roles.
 * @roles - Array of roles.
 * @returns - Updated roles array.
 */
export const adminId = '756cbd11-4695-4e02-95b3-15382d89a064';

export const formatRoles = roles => {
  return roles.map(role => {
    const updatedRole = { ...role };
    if (updatedRole) {
      const { roleDescription } = updatedRole;
      if (
        roleDescription != null &&
        roleDescription.length > roleDescDisplayLimit
      )
        updatedRole.roleDescription = cutOffTextWithEllipsis(
          roleDescription,
          roleDescDisplayLimit
        );
    }

    if (updatedRole.id === adminId) {
      updatedRole.roleName = <i>{updatedRole.roleName}</i>;
      updatedRole.roleDescription = <i>{updatedRole.roleDescription}</i>;
      updatedRole.isReadOnly = true;
    }
    return updatedRole;
  });
};

export const setSubGroupPermissions = (resource = {}, permissions = []) => {
  const permissionGroups = [
    'permissionGroupDisabled',
    'permissionGroupEnabled',
  ];
  permissionGroups.forEach(permissionGroup => {
    if (resource[permissionGroup] && resource[permissionGroup].length) {
      resource[permissionGroup].forEach(permission => {
        permission.options.forEach(option => {
          option.selected = permissions.includes(option.permissionKey);
          if (option.hasGroup) setSubGroupPermissions(option, permissions);
        });
      });
    }
  });
};

export const setPermissionsOfResource = (resource = {}, permissions = []) => {
  const permissionGroups = ['permissionsDisabled', 'permissionsEnabled'];
  const resourcePermissions = [];
  permissionGroups.forEach(permissionGroup => {
    if (resource[permissionGroup] && resource[permissionGroup].length) {
      resource[permissionGroup].forEach(permission => {
        permission.options.forEach(option => {
          option.selected = permissions.includes(option.permissionKey);
          if (option.selected && !resource.enabled) {
            resource.enabled = true;
          }
          if (option.hasGroup) setSubGroupPermissions(option, permissions);
        });
      });
    }
  });
  return resourcePermissions;
};

export const setPermissionstoResource = (resources = [], permissions = []) => {
  resources.forEach(resource => {
    setPermissionsOfResource(resource, permissions);
  });
  return resources;
};

/**
 * @summary - used for getting selected sub group permission from a permission
 * @param {*} resource
 * @param {*} resourcePermissions
 */
export const getSubGroupPermissions = (
  resource = {},
  resourcePermissions = []
) => {
  const permissionGroups = [
    'permissionGroupDisabled',
    'permissionGroupEnabled',
  ];
  permissionGroups.forEach(permissionGroup => {
    if (resource[permissionGroup] && resource[permissionGroup].length) {
      resource[permissionGroup].forEach(permission => {
        permission.options.forEach(option => {
          if (option.selected) resourcePermissions.push(option.permissionKey);
          if (option.hasGroup)
            getSubGroupPermissions(option, resourcePermissions);
        });
      });
    }
  });
};

/**
 * @summary - get selected Permissions from a resource
 * @param {*} resource
 * @returns array of permission
 */

export const getResourcePermissions = resource => {
  const permissionGroups = ['permissionsDisabled', 'permissionsEnabled'];
  const resourcePermissions = [];
  permissionGroups.forEach(permissionGroup => {
    if (resource[permissionGroup] && resource[permissionGroup].length) {
      resource[permissionGroup].forEach(permission => {
        permission.options.forEach(option => {
          if (option.selected) resourcePermissions.push(option.permissionKey);
          if (option.hasGroup)
            getSubGroupPermissions(option, resourcePermissions);
        });
      });
    }
  });
  return resourcePermissions;
};

/**
 * @summary -used for getting all the selected permissions of resources
 * @param {*} resources
 * @returns  array of permission list
 */
const getSelectedPermissionsfromResource = (resources = []) => {
  let rolepermissions = [];
  resources.forEach(resource => {
    rolepermissions = [...rolepermissions, ...getResourcePermissions(resource)];
  });
  return rolepermissions;
};

export default getSelectedPermissionsfromResource;
