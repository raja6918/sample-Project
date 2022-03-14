import React from 'react';
import errorTypes, { errorCodes } from './constants';
import Notification from './../Notification';
import ErrorModal from './ErrorModal';
import ErrorPage from './ErrorPage';
import flatten from 'lodash/flatten';
import get from 'lodash/get';

const initialState = {
  errorType: null,
  error: {},
  errorMessageKeysTranslated: [],
  inlineError: null,
};
const BUSINESS_VALIDATION_ERROR_CODE = 400;
const PAGE_NOT_FOUND = 404;
const DUPLICATE_CODE_ERROR = 'ENTITY_FIELD_DUPLICATE';

function withErrorHandler(WrappedComponent, timeOut = 5000) {
  return class ErrorHandler extends React.Component {
    state = {
      ...initialState,
    };

    componentDidCatch(error, info) {
      console.error(error, info);
    }

    reportError = errorData => {
      const { error, messageKeySuffix } = errorData;
      let {
        errorType,
        customMessageArguments,
        isHtml,
        isCustomError = false,
        message = '',
      } = errorData;
      errorType = errorType || errorTypes.GUESS;
      customMessageArguments = customMessageArguments || [];
      let inlineError = null;
      let duplicateError = null;
      let duplicateErrorMessage = '';

      const { t } = this.props;
      let errorMessageKeysTranslated = [];

      // Set isCustomError to true if you want to always display custom error message in snackbar instead of error message from BE.
      if (isCustomError && message) {
        errorType = errorTypes.SNACK;
        errorMessageKeysTranslated.push(message);
        return this.setState({
          errorType,
          errorMessageKeysTranslated,
        });
      }

      if (isHtml) {
        if (!error.response || error.response.status === 500) return; // after new overlay layer implementation
        errorType = errorTypes.SNACK;
        const status = error.response ? error.response.status : 404;
        errorMessageKeysTranslated.push(
          this.props.t(`ERRORS.SNACK_${status}_ERROR.message`)
        );
        if (errorCodes.includes(status))
          return this.setState({
            errorType,
            errorMessageKeysTranslated,
          });
      }

      if (
        error.message === 'Network Error' ||
        !error.response ||
        !error.response.status
      ) {
        errorType = errorTypes.PAGE;
        error.response = Object.assign({}, error.response, { status: 404 });

        return this.setState({
          errorType,
          error,
        });
      }

      try {
        const errorObjData = get(error, 'response.data');
        if (!errorObjData) return;
        const response = Array.isArray(error.response.data)
          ? errorObjData
          : [errorObjData];

        errorMessageKeysTranslated = flatten(
          response.map(error => {
            const errorDetails = error.errorDetails
              ? error.errorDetails
              : [error];
            /*
                By now, will be able to override the messageArguments when we got
                just one error message from the back-end
              */
            if (errorDetails.length === 1 && customMessageArguments.length) {
              errorDetails[0].messageArguments = [...customMessageArguments];
            }
            const messageKeysAndArguments = errorDetails.map(errorDetail => {
              const messageKey = messageKeySuffix
                ? `${errorDetail.messageKey}_${messageKeySuffix}`
                : errorDetail.messageKey;
              const messageArguments = errorDetail.messageArguments;
              const errorMessageTranslated = t(`ERRORS.${messageKey}`, {
                ...messageArguments,
              });
              if (errorDetail.messageKey === DUPLICATE_CODE_ERROR) {
                duplicateError = errorDetail;
                duplicateErrorMessage = errorMessageTranslated;
              }
              return errorMessageTranslated;
            });

            return messageKeysAndArguments;
          })
        );
      } catch (error) {
        console.error('error', error);
      }

      if (
        duplicateError &&
        (duplicateError.messageArguments[1] === 'code' ||
          duplicateError.messageArguments[1] === 'name') &&
        errorData.inputField
      ) {
        duplicateErrorMessage = duplicateErrorMessage.replace(/\*/g, '');
        const inputField = errorData.inputField;
        inlineError = {
          [inputField]: '',
          errors: {
            [inputField]: true,
          },
          inlineErrorMessage: duplicateErrorMessage,
        };
      }
      if (
        get(error, 'response.status') === PAGE_NOT_FOUND &&
        (error.response.data.messageKey === 'SCENARIO_NOT_FOUND' ||
          error.response.data.messageKey === 'ENTITY_NOT_FOUND')
      ) {
        errorType = errorTypes.SNACK;
        return this.setState({
          errorType,
          error,
          errorMessageKeysTranslated: errorMessageKeysTranslated,
          inlineError,
        });
      }

      if (get(error, 'response.status') !== BUSINESS_VALIDATION_ERROR_CODE) {
        /*
        Force to display the error in a page if the
        status code is no a BUSINESS_VALIDATION_ERROR_CODE
        */
        errorType = errorTypes.PAGE;
      } else if (errorType === errorTypes.GUESS) {
        console.log('==> Determine how to display the error');
        if (errorMessageKeysTranslated.length === 1) {
          errorType = errorTypes.SNACK;
        } else if (errorMessageKeysTranslated.length > 1) {
          errorType = errorTypes.MODAL;
          console.log('=== DISPLAY MODAL WINDOW');
        }
        // Look for the right information to display.
      } else {
        console.log('==> Display the error in the selected way by the user');
      }

      console.log(errorType, errorMessageKeysTranslated);
      this.setState({
        errorType,
        error,
        errorMessageKeysTranslated: errorMessageKeysTranslated,
        inlineError,
      });
    };

    clear = () => {
      this.setState({ ...initialState });
    };

    render() {
      const {
        error,
        errorType,
        errorMessageKeysTranslated,
        inlineError,
      } = this.state;
      const { t } = this.props;

      let errorMessage = null;

      if (errorType && errorType === errorTypes.SNACK) {
        errorMessage = errorMessageKeysTranslated[0];
      }

      const notificationTime = inlineError !== null ? 3600000 : timeOut;

      return (
        <React.Fragment>
          {errorType === errorTypes.SNACK && (
            <Notification
              message={errorMessage}
              clear={this.clear}
              type="error"
              autoHideDuration={notificationTime}
            />
          )}
          {errorType === errorTypes.PAGE && <ErrorPage t={t} error={error} />}
          {errorType === errorTypes.MODAL && (
            <ErrorModal
              t={t}
              error={error}
              clear={this.clear}
              errorMessageKeysTranslated={errorMessageKeysTranslated}
            />
          )}
          {errorType !== errorTypes.PAGE && (
            <WrappedComponent
              reportError={this.reportError}
              reportUnhandledHttpErrors={this.reportUnhandledHttpErrors}
              inlineError={inlineError}
              clearErrorNotification={this.clear}
              {...this.props}
            />
          )}
        </React.Fragment>
      );
    }
  };
}

export default withErrorHandler;
