import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Form from '../../../components/Dialog/Form';
import DropZone from './DropZone';
import FileCard from './FileCard';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { evaluateRegex } from '../../../utils/common';

import { validateTypes, fileValidation, generateMetadata } from './helpers';
import { defaultState, MAX_BIN_NAME_SIZE, BIN_NAME_REGEX } from './const';

const AddDialog = styled(Form)`
  & > div > div {
    width: 680px;
  }
  & form > div:first-child {
    position: relative;
    max-width: 675px;
    max-height: 420px;
    padding: 0;

    .drop {
      position: absolute;
      background: #ff650c;
    }

    .drop.top,
    .drop.bottom {
      left: 0;
      width: 100%;
      height: 3px;
    }

    .drop.top {
      top: 0px;
    }

    .drop.bottom {
      bottom: 0px;
    }

    .drop.left,
    .drop.right {
      width: 3px;
      height: 100%;
      top: 0px;
    }

    .drop.left {
      left: 0px;
    }

    .drop.right {
      right: 0px;
    }
  }
  & > div:last-child {
    max-width: 675px;
  }
  & form > div p {
    font-size: 13px;
    margin: 0 0 10px 0;
    color: rgba(0, 0, 0, 0.87);
  }

  & form > div p span {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
  }
`;

const MainWrapper = styled.div`
  padding: 0px 25px 35px 25px;
  max-height: 420px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
`;

const UploadContainer = styled.div`
  min-width: 625px;
  display: flex;
  flex-wrap: wrap;
`;

const ImportContainer = styled.div`
  width: 625px;
  display: flex;
  flex-direction: column;

  padding: 20px 5px 5px 5px;
  margin: 0px;

  & label {
    margin-left: 0px;
    margin-right: 0px;

    & span:first-child {
      width: 20px;
      height: 20px;
      margin-right: 4px;

      & svg {
        font-size: 18px;
      }
    }

    & span:last-child {
      font-size: 13px;
      font-weight: 500;
    }
  }

  & .title {
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0px;
  }

  & .titleDate {
    color: rgba(0, 0, 0);
    font-size: 14px;
    margin-top: 4px;
    margin-bottom: 15px;
  }

  & p.noBins {
    color: rgba(0, 0, 0, 0.67);
    font-size: 12px;
    font-style: italic;
    margin-left: 25px;
  }

  & .selectField {
    width: 279px;
    margin-left: 25px;
  }

  & p.customError {
    font-size: 10px;
    margin-left: 25px;
  }
`;

const Input = styled(TextField)`
  width: 314px;
  margin: 0 0 10px 25px;
  & div {
    & input {
      font-size: 14px;
    }
  }
  &.error > label {
    color: #d10000 !important;
  }
`;

class ImportDialog extends Component {
  state = { ...defaultState };

  handleFormClose = () => {
    this.props.closeDialog();
  };

  handleFormProcess = async () => {
    const { connectToBin, createNewBin, bins, t, toggleLoader } = this.props;
    const {
      importMethod,
      directoryName,
      selectedBin,
      processStep,
    } = this.state;

    if (processStep === 1) {
      let binName = '';

      switch (importMethod) {
        case '0':
          binName = directoryName.trim();
          createNewBin(binName);
          break;
        case '1':
          binName =
            bins[Object.keys(bins)[bins.findIndex(b => b.id === selectedBin)]]
              .name;
          connectToBin(binName, selectedBin);
          break;
        default:
          break;
      }
    } else if (processStep === 2) {
      const { files } = this.state;
      const filesArray = [];
      const metadataPayload = [];

      toggleLoader(t('DATA.import.loaderTitle'));

      for (const file of files) {
        filesArray.push(file.file);
        metadataPayload.push(generateMetadata(file));
      }

      const filesMetadata = await Promise.all(metadataPayload);

      this.props.handleImport(filesArray, filesMetadata);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.files.length > prevState.files.length &&
      this.state.files.length > 6
    ) {
      const containerDiv = document.getElementById('MainWrapper');
      containerDiv.scrollTop = containerDiv.scrollHeight;
    }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {};

    if (nextProps.open) {
      const { bins } = nextProps;
      document.addEventListener('dragover', this.listener, false);
      document.addEventListener('drop', this.listener, false);

      const binsFlag = Object.keys(bins).length === 0 ? false : true;
      const selectedBin = binsFlag ? bins[Object.keys(bins)[0]].id : null;
      const importMethod = binsFlag ? '1' : '0';

      newState = { ...newState, binsFlag, selectedBin, importMethod };
    } else {
      document.removeEventListener('dragover', this.listener, false);
      document.removeEventListener('drop', this.listener, false);
      this.setState({ ...defaultState });
    }

    if (nextProps.scenarioBinId) {
      newState = { ...newState, processStep: 2 };
    }

    this.setState(newState);
  }

  listener = e => {
    e = e || event;
    e.preventDefault();
  };

  handleFiles = addedFiles => {
    const { importConfig, importFileOptions } = this.props;
    const currentFiles = [...this.state.files];
    const files = this.formatFileArray(addedFiles);

    if (files.length === currentFiles.length) {
      return;
    }

    const updatedFileData = validateTypes(files, importConfig);
    const { files: filesData, globalError, filesAreValid } = fileValidation(
      updatedFileData,
      importConfig,
      importFileOptions
    );

    let enableUpload = filesAreValid;

    if (globalError.key) {
      enableUpload = false;
      this.generateNotification(globalError);
    }

    this.setState({
      files: filesData,
      isEmpty: false,
      enableUpload,
    });
  };

  formatFileArray = newFiles => {
    const files = [...this.state.files];

    for (let i = 0; i < newFiles.length; i++) {
      const newFileName = newFiles[i].name;
      if (!files.find(f => f.file.name === newFileName)) {
        files.push({ fileInfo: {}, file: newFiles[i] });
      }
    }
    return files;
  };

  deleteFile = key => {
    const { importConfig, importFileOptions } = this.props;
    let files = [...this.state.files];
    let enableUpload = this.state.enableUpload;

    files.splice(key, 1);
    const isEmpty = files.length === 0;

    if (isEmpty) {
      enableUpload = false;
    } else {
      const { files: filesData, globalError, filesAreValid } = fileValidation(
        files,
        importConfig,
        importFileOptions
      );

      enableUpload = filesAreValid;

      if (globalError.key) {
        enableUpload = false;
        files = filesData;
        this.generateNotification(globalError);
      }
    }

    this.setState({ files, enableUpload, isEmpty });
  };

  updateFileData = (key, data) => {
    const { importConfig, importFileOptions } = this.props;
    let files = [...this.state.files];
    files[key].fileInfo = Object.assign(files[key].fileInfo, data);

    const { files: filesData, globalError, filesAreValid } = fileValidation(
      files,
      importConfig,
      importFileOptions
    );

    let enableUpload = filesAreValid;

    if (globalError.key) {
      enableUpload = false;
      files = filesData;
      this.generateNotification(globalError);
    }

    this.setState({ files, enableUpload });
  };

  handleRadioChange = e => {
    const { isValidName } = this.state;
    const stateUpdate = {
      importMethod: e.target.value,
    };

    if (!isValidName) {
      stateUpdate.directoryName = '';
      stateUpdate.isValidName = true;
    }

    this.setState(stateUpdate);
  };

  handleSelectChange = e => {
    this.setState({ selectedBin: e.target.value });
  };

  handleInputChange = e => {
    const { binsFlag } = this.state;
    const { t, bins } = this.props;
    let isValidName = true;
    let nameError;
    if (!evaluateRegex(BIN_NAME_REGEX, e.target.value) && !!e.target.value) {
      isValidName = false;
      nameError = t('ERRORS.IMPORT.binNameIncorrect');
    } else if (binsFlag) {
      isValidName = !bins.some(bin => bin.name === e.target.value);
      if (!isValidName) nameError = t('DATA.import.duplicatedName');
    }
    this.setState({ directoryName: e.target.value, isValidName, nameError });
  };

  onDragOver = e => {
    e.preventDefault();
    this.setState({ highlight: true });
  };

  onDragLeave = e => {
    e.preventDefault();
    this.setState({ highlight: false });
  };

  onDrop = e => {
    e.preventDefault();
    this.setState({ highlight: false }, this.filesEventController(e));
  };

  toggleOuterHighlight = () => {
    const { highlight } = this.state;
    this.setState({ highlight: !highlight });
  };

  filesEventController = e => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.handleFiles(e.dataTransfer.files);
      try {
        e.dataTransfer.clearData('text');
      } catch (error) {
        console.error(error);
      }
    }
  };

  generateNotification = globalError => {
    const { t } = this.props;
    const errorMessage = t(
      `ERRORS.IMPORT.${globalError.key}`,
      globalError.params
    );

    const args = {
      message: errorMessage,
      type: 'error',
    };
    this.props.showNotification(args);
  };

  enableSaveButton = () => {
    const {
      enableUpload,
      processStep,
      selectedBin,
      directoryName,
      importMethod,
      isValidName,
      isEmpty,
    } = this.state;
    let buttonFlag = false;
    if (processStep === 1) {
      switch (importMethod) {
        case '0':
          buttonFlag =
            isValidName && directoryName.trim() !== '' ? true : false;
          break;
        case '1':
          buttonFlag = !!selectedBin;
          break;
        default:
          buttonFlag = false;
          break;
      }
    } else {
      buttonFlag = enableUpload && !isEmpty;
    }

    return buttonFlag;
  };

  render() {
    const {
      t,
      formId,
      scenarioDates,
      open,
      bins,
      importFileOptions,
      importConfig,
    } = this.props;
    const {
      isEmpty,
      files,
      processStep,
      binsFlag,
      selectedBin,
      directoryName,
      importMethod,
      isValidName,
      highlight,
      nameError,
    } = this.state;

    const AddDialogProps = {
      open,
      title: t('DATA.import.dialogTitleConnect'),
      okButton: t('DATA.import.dialogFormConnect'),
      cancelButton: t('GLOBAL.form.cancel'),
    };

    if (processStep === 2) {
      AddDialogProps.title = t('DATA.import.dialogTitle');
      AddDialogProps.okButton = t('DATA.import.dialogFormUpload');
    }

    const enableSave = this.enableSaveButton();

    return (
      <AddDialog
        {...AddDialogProps}
        formId={formId}
        maxWidth="md"
        disableSave={!enableSave}
        handleCancel={() => {
          this.handleFormClose();
        }}
        handleOk={() => {
          this.handleFormProcess();
        }}
        onClose={() => {
          this.handleFormClose();
        }}
      >
        <MainWrapper
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          id={'MainWrapper'}
        >
          {processStep === 1 ? (
            <ImportContainer>
              <p className={'title'}>{t('DATA.import.dialogMainMessage')}</p>
              <p className={'titleDate'}>{`${t(
                'DATA.import.dialogMainDate'
              )} ${scenarioDates}`}</p>
              <FormControl>
                <RadioGroup
                  name="importMethod"
                  value={importMethod}
                  onChange={this.handleRadioChange}
                >
                  <FormControlLabel
                    value={'0'}
                    control={<Radio />}
                    label={t('DATA.import.createNew')}
                  />
                  <FormControl error={!isValidName}>
                    <Input
                      id="name"
                      value={directoryName}
                      onChange={this.handleInputChange}
                      disabled={importMethod === '1'}
                      className={!isValidName ? 'error' : ''}
                      error={!isValidName}
                      placeholder={t('DATA.import.directoryPlaceholder')}
                      inputProps={{
                        maxLength: MAX_BIN_NAME_SIZE,
                      }}
                    />
                    {!isValidName && (
                      <FormHelperText
                        className={'customError'}
                        error={!isValidName}
                      >
                        {nameError}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControlLabel
                    value={'1'}
                    control={<Radio />}
                    label={t('DATA.import.addFromBin')}
                    disabled={!binsFlag}
                    className={!binsFlag ? 'noBins' : ''}
                  />
                  {binsFlag ? (
                    <FormControl className={'selectField'}>
                      <Select
                        value={selectedBin}
                        onChange={this.handleSelectChange}
                        disabled={importMethod === '0'}
                      >
                        {bins.map(bin => (
                          <MenuItem value={bin.id} key={bin.id}>
                            {bin.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <p className={'noBins'}>{t('DATA.import.noBins')}</p>
                  )}
                </RadioGroup>
              </FormControl>
            </ImportContainer>
          ) : (
            <UploadContainer>
              {!isEmpty
                ? files.map((file, k) => (
                    <FileCard
                      t={t}
                      key={`file_card_${k}}`}
                      index={k}
                      fileData={file}
                      deleteFile={this.deleteFile}
                      updateFileData={this.updateFileData}
                      importFileOptions={importFileOptions}
                      importConfig={importConfig}
                    />
                  ))
                : ''}
              <DropZone
                t={t}
                isEmpty={isEmpty}
                handleFiles={this.handleFiles}
                toggleOuterHighlight={this.toggleOuterHighlight}
                filesEventController={this.filesEventController}
              />
            </UploadContainer>
          )}
        </MainWrapper>

        <div hidden={!highlight}>
          <span className="drop top" />
          <span className="drop bottom" />
          <span className="drop left" />
          <span className="drop right" />
        </div>
      </AddDialog>
    );
  }
}

ImportDialog.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleImport: PropTypes.func.isRequired,
  scenarioDates: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
  bins: PropTypes.arrayOf(PropTypes.shape).isRequired,
  scenarioBinId: PropTypes.number,
  createNewBin: PropTypes.func.isRequired,
  connectToBin: PropTypes.func.isRequired,
  importConfig: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  importFileOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  toggleLoader: PropTypes.func.isRequired,
};

ImportDialog.defaultProps = {
  scenarioBinId: null,
};

export default ImportDialog;
