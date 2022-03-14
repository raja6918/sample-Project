import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Form from '../../../components/Dialog/Form';
import FormControl from '@material-ui/core/FormControl';
import VersionsRadioGroup from './VersionsRadioGroup';

const AddDialog = styled(Form)`
  & form > div:first-child {
    max-width: 580px;
    max-height: 210px;
    width: 100%;
    overflow-y: auto;
    padding: 0px 10px 20px 10px;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  & > div:last-child {
    max-width: 580px;
  }
  & form > div p span {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
  }
`;

const MainContainer = styled.div`
  width: 511px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px;

  & fieldset {
    width: 100%;

    & label {
      width: 240px;

      & span:first-child {
        align-items: flex-start !important;
      }
    }
  }

  & div.radiogroup {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Title = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

class VersionsDialog extends Component {
  state = {
    version: '',
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      this.setState({ version: '' });
    }
  }

  handleChange = event => {
    this.setState({ version: event.target.value });
  };

  updateFileVersion = () => {
    const { version: selectedVersion } = this.state;
    const { versions, handleOk } = this.props;
    const binFileId = parseInt(selectedVersion, 10);

    const { fileType: datatype, version } = versions.find(file => {
      return file.id === binFileId;
    });

    const scenarioBinsFiles = {
      binFileId,
      datatype,
      version,
    };

    handleOk(scenarioBinsFiles);
  };

  render() {
    const { t, formId, open, closeDialog, dataName, versions } = this.props;

    const { version } = this.state;

    return (
      <AddDialog
        formId={formId}
        open={open}
        title={t('DATA.updateModal.title', { 0: dataName.toLowerCase() })}
        okButton={t('DATA.updateModal.updateButton')}
        cancelButton={t('GLOBAL.form.cancel')}
        onClose={closeDialog}
        handleCancel={closeDialog}
        handleOk={this.updateFileVersion}
        disableSave={version === '' ? true : false}
      >
        <MainContainer>
          <Title>{t('DATA.updateModal.innerText')}</Title>
          <FormControl component="fieldset">
            <VersionsRadioGroup
              handleChange={this.handleChange}
              versions={versions}
              t={t}
              dataName={dataName}
              version={version}
            />
          </FormControl>
        </MainContainer>
      </AddDialog>
    );
  }
}

VersionsDialog.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  dataName: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(PropTypes.shape),
  handleOk: PropTypes.func.isRequired,
};

VersionsDialog.defaultProps = {
  versions: [],
};

export default VersionsDialog;
