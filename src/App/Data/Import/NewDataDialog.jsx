import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Form from '../../../components/Dialog/Form';
import FormControl from '@material-ui/core/FormControl';
import VersionsRadioGroup from './VersionsRadioGroup';

const AddDialog = styled(Form)`
  & form > div:first-child {
    max-width: 580px;
    max-height: 252px;
    width: 100%;
    overflow-y: auto;
    padding: 0px 30px 20px 30px;

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

  & div.rowElement {
    flex-basis: 100%;
  }

  & div.radiogroup {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
    max-width: 512px;
  }
`;

const Title = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const DataTitle = styled.p`
  font-size: 16px;
  color: #ff650c;
  margin: 8px 0px 0px 0px;
`;

class NewDataDialog extends Component {
  state = {
    selectedVersions: {},
    disableSave: true,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      this.setState({ selectedVersions: {} });
    }
  }

  handleChange = event => {
    const { selectedVersions } = this.state;
    selectedVersions[event.target.name] = event.target.value;
    this.setState({ selectedVersions, disableSave: false });
  };

  updateFileVersion = () => {
    const { selectedVersions } = this.state;
    const { dataFiles, handleOk } = this.props;

    const scenarioBinsFiles = [];

    const dataTypes = Object.keys(selectedVersions);

    for (const datatype of dataTypes) {
      const binFileId = parseInt(selectedVersions[datatype], 10);

      const files = dataFiles.find(dt => {
        return dt.type === datatype;
      }).newFilesAvailable;

      const { version } = files.find(file => {
        return file.id === binFileId;
      });

      const binFile = {
        binFileId,
        datatype,
        version,
      };

      scenarioBinsFiles.push(binFile);
    }

    handleOk(scenarioBinsFiles);
  };

  render() {
    const {
      t,
      formId,
      open,
      closeDialog,
      dataFiles,
      isConnectedToBin,
    } = this.props;
    const { selectedVersions, disableSave } = this.state;

    return (
      <AddDialog
        formId={formId}
        open={open}
        title={
          isConnectedToBin
            ? t('DATA.newImportVersionsModal.title')
            : t('DATA.newVersionsModal.title')
        }
        okButton={
          isConnectedToBin
            ? t('DATA.newImportVersionsModal.importButton')
            : t('DATA.newVersionsModal.updateButton')
        }
        cancelButton={
          isConnectedToBin ? t('GLOBAL.form.skip') : t('GLOBAL.form.cancel')
        }
        onClose={closeDialog}
        handleCancel={closeDialog}
        handleOk={this.updateFileVersion}
        disableSave={disableSave}
      >
        <MainContainer>
          <Title>
            {isConnectedToBin
              ? t('DATA.newImportVersionsModal.innerText')
              : t('DATA.newVersionsModal.innerText')}
          </Title>
          {dataFiles.map((dataType, key) => (
            <div key={key} className={'rowElement'}>
              <DataTitle>{dataType.name}</DataTitle>
              <FormControl component="fieldset">
                <VersionsRadioGroup
                  handleChange={this.handleChange}
                  versions={dataType.newFilesAvailable}
                  t={t}
                  dataName={dataType.name}
                  version={selectedVersions[dataType.type] || ''}
                  dataType={dataType.type}
                />
              </FormControl>
            </div>
          ))}
        </MainContainer>
      </AddDialog>
    );
  }
}

NewDataDialog.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  dataFiles: PropTypes.arrayOf(PropTypes.shape),
  handleOk: PropTypes.func.isRequired,
};

NewDataDialog.defaultProps = {
  dataFiles: [],
};

export default NewDataDialog;
