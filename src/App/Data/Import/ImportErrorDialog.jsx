import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Form from '../../../components/Dialog/Form';
import Icon from '../../../components/Icon';

const AddDialog = styled(Form)`
  & form > div:first-child {
    max-width: 560px;
    max-height: 480px;
    height: 193px;
    width: 100%;
    overflow-y: auto;
    padding: 0px 35px 20px 5px;

    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
  & > div:last-child {
    max-width: 560px;
  }
  & form > div:last-child {
    button {
      width: auto !important;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
`;

const MainContainer = styled.div`
  max-width: 490;
  margin-top: 20px;
  margin-left: 16px;

  & > p {
    font-size: 13px;
    color: #000000;
    text-align: left;
  }
`;

const FlexContainer = styled.div`
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  margin-left: 32px;

  & > p {
    font-size: 13px;
  }

  & > p.description {
    margin-left: 20px;
  }
`;

class ImportErrorDialog extends Component {
  render() {
    const {
      t,
      formId,
      open,
      closeDialog,
      closeOnly,
      conversionErrors,
      isInternalError,
    } = this.props;
    return (
      <AddDialog
        formId={formId}
        open={open}
        title={t('DATA.import.importFailedTitle')}
        cancelButton={t('GLOBAL.form.close')}
        onClose={closeDialog}
        handleCancel={closeDialog}
        closeOnly
      >
        <MainContainer>
          <FlexContainer>
            <Icon iconcolor="red">info</Icon>
            <b>
              {isInternalError
                ? t('DATA.import.InternalErrorText')
                : t('DATA.import.importFailedText')}
            </b>
          </FlexContainer>
          <Content>
            <p>
              {isInternalError ? (
                t('DATA.import.contactAdministratorText')
              ) : (
                <b>{t('DATA.import.dataConversionText')}</b>
              )}
            </p>
            <p className="description">
              {!isInternalError &&
                Array.isArray(conversionErrors) &&
                conversionErrors.map((e, i) => {
                  return (
                    <Fragment key={i}>
                      <span>-</span>
                      {e.errorDescription}
                    </Fragment>
                  );
                })}
            </p>
          </Content>
        </MainContainer>
      </AddDialog>
    );
  }
}

ImportErrorDialog.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  closeOnly: PropTypes.bool.isRequired,
  conversionErrors: PropTypes.instanceOf(Array).isRequired,
  isInternalError: PropTypes.bool.isRequired,
};

export default ImportErrorDialog;
