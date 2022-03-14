import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import ErrorDialog from '../Dialog/ErrorDialog';

/**
 * A generic HOC to handle delete functionality in generic table
 *
 * @param {React.Component} WrappedComponent
 * @param {string} type - Error message type translation key
 */
const withDeleteHandler = WrappedComponent => type => {
  return class withDeleteHandler extends React.Component {
    state = {
      deleteDialogItem: {},
      deleteDialogIsOpen: false,
      errorDialogItem: null,
      errorDialogIsOpen: false,
    };

    openDeleteDialog = deleteDialogItem => {
      this.setState({
        deleteDialogItem,
        deleteDialogIsOpen: true,
      });
    };

    closeDeleteDialog = () => {
      this.setState({ deleteDialogIsOpen: false });
    };

    exitDeleteDialog = () => {
      this.setState({ selectedItem: null });
    };

    handleDeleteError = (error, type, name) => {
      const m = Array.isArray(error.response.data)
        ? 'response.data[0].errorDetails[0].messageKey'
        : 'response.data.messageKey';
      const messageKey = get(error, m);
      if (
        messageKey === 'ENTITY_IN_USE' ||
        messageKey === 'USER_ROLE_CANNOT_BE_DELETED'
      ) {
        this.openErrorDialog({ name });
      } else {
        this.props.reportError({
          error,
          customMessageArguments: [this.props.t(type), name],
          errorType: error.errorType,
        });
      }
    };

    openErrorDialog = errorDialogItem => {
      this.setState({
        errorDialogItem,
        errorDialogIsOpen: true,
      });
    };

    closeErrorDialog = () => {
      this.setState({ errorDialogIsOpen: false });
    };

    exitErrorDialog = () => {
      this.setState({ errorDialogItem: null });
    };

    static propTypes = {
      t: PropTypes.func.isRequired,
      reportError: PropTypes.func.isRequired,
    };

    render() {
      const {
        deleteDialogItem,
        deleteDialogIsOpen,
        errorDialogItem,
        errorDialogIsOpen,
      } = this.state;

      const { t } = this.props;
      const msgKey =
        type === 'ROLES.type'
          ? 'ROLE_REFERENCE_ERROR'
          : 'GENERIC_DELETE_DUPLICATE_ERROR';
      return (
        <React.Fragment>
          <WrappedComponent
            deleteDialogItem={deleteDialogItem}
            deleteDialogIsOpen={deleteDialogIsOpen}
            openDeleteDialog={this.openDeleteDialog}
            closeDeleteDialog={this.closeDeleteDialog}
            exitDeleteDialog={this.exitDeleteDialog}
            handleDeleteError={this.handleDeleteError}
            {...this.props}
          />
          <ErrorDialog
            open={errorDialogIsOpen}
            handleOk={this.closeErrorDialog}
            onExited={this.exitErrorDialog}
            okText={t('GLOBAL.form.close')}
            title={t('DIALOG.DELETE_DATA.title', {
              type: t(type),
              name: errorDialogItem ? errorDialogItem.name : ' ',
            })}
            bodyText={t(`ERRORS.${msgKey}.message`, {
              type: t(type).toLowerCase(),
            })}
            onClose={this.closeErrorDialog}
          />
        </React.Fragment>
      );
    }
  };
};

export default withDeleteHandler;
