import UnknownIcon from '../Icons/UnknownIcon';
import { fileMetadataInfo } from './const';
import sha1 from 'crypto-js/sha1';
import cryptoJs from 'crypto-js';

const compareFile = (fileName, rules) => {
  const fileMetadata = { ...fileMetadataInfo };
  fileMetadata.icon = UnknownIcon;

  for (let i = 0; i < rules.length; i++) {
    const dataInfo = rules[i];
    const { extensions } = dataInfo;
    const fileExtension = fileName.split('.').pop();

    fileMetadata.name = fileName;

    if (extensions.indexOf(fileExtension) > -1) {
      fileMetadata.icon = dataInfo.icon;
      fileMetadata.dataType = dataInfo.type;
      fileMetadata.typeName = dataInfo.name;
      fileMetadata.isCustomIcon = dataInfo.isCustomIcon;
      fileMetadata.iconStyles = dataInfo.iconStyles;

      for (let f = 0; f < dataInfo.files.length; f++) {
        if (dataInfo.files[f].extensions.indexOf(fileExtension) !== -1) {
          fileMetadata.fileId = dataInfo.files[f].id;
          break;
        }
      }
      break;
    }
  }
  return fileMetadata;
};

export const generateMetadata = file => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onloadend = () => {
        const wordArray = cryptoJs.lib.WordArray.create(reader.result);
        const checksum = sha1(wordArray).toString();
        const { name, dataType, fileId, isTypeChanged } = file.fileInfo;

        const fileMetadata = {
          name,
          datatype: dataType,
          fileId,
          isTypeChanged,
          checksum,
        };

        resolve(fileMetadata);
      };

      reader.onerror = () => {
        const { name, dataType, fileId, isTypeChanged } = file.fileInfo;

        const fileMetadata = {
          name,
          datatype: dataType,
          fileId,
          isTypeChanged,
          checksum: '',
        };

        resolve(fileMetadata);
      };

      reader.readAsArrayBuffer(file.file);
    } catch (error) {
      reject(error);
    }
  });
};

export const fileValidation = (filesObject, rules, fileOptions) => {
  const files = [...filesObject];
  let globalError = { key: null, params: null };
  const validatedTypes = [];
  const fileIdList = [];
  const duplicatedIds = [];
  let filesAreValid = true;

  //Get filetype render value
  const getFileName = (fileId, param = 'errorString') => {
    return fileOptions.find(f => f.id === fileId)[param];
  };

  //General Error Handling
  const setGlobalError = (errorKey, errorParams) => {
    const error = { key: null, params: [] };

    if (globalError.key !== 'generic') {
      if (globalError.key === null && globalError.params === null) {
        error.key = errorKey;
        error.params = errorParams;
      } else if (globalError.key !== null && globalError.key !== errorKey) {
        error.key = 'generic';
      } else {
        const newParamsLength = errorParams.length;
        const currentParamsLength = globalError.params.length;

        if (newParamsLength !== currentParamsLength) {
          error.key = 'generic';
        } else if (newParamsLength > 0) {
          if (errorParams[0] !== globalError.params[0]) {
            error.key = 'generic';
          } else {
            error.key = errorKey;
            error.params = errorParams;
          }
        } else {
          error.key = errorKey;
          error.params = errorParams;
        }
      }

      globalError = error;
    }
  };

  //Individual File Error handling
  const pushFileError = (fileId, error) => {
    const { key: errorKey, params: errorParams } = error;

    files.forEach(f => {
      if (
        fileId === f.fileInfo.fileId &&
        !f.fileInfo.errors.find(e => e.key === errorKey)
      ) {
        f.fileInfo.errors.push(error);
        if (errorKey !== 'unrecognized') {
          setGlobalError(errorKey, errorParams);
        }
      }
    });
  };

  //Different Id list generator
  for (let i = 0; i < files.length; i++) {
    const fileId = files[i].fileInfo.fileId;
    files[i].fileInfo.errors = [];

    if (fileId !== -1) {
      //Validate duplicate files
      if (fileIdList.indexOf(fileId) === -1) {
        fileIdList.push(fileId);
        //Cleaning previous errors
      } else {
        duplicatedIds.push(fileId);

        const errorKey = 'duplicatedSingular';
        const errorParams = [getFileName(fileId, 'name'), 1];
        const error = { key: errorKey, params: errorParams };
        pushFileError(fileId, error);
      }
    }
  }

  //File list comparisson
  const filesComparator = fileIds => {
    let counter = 0;
    const missingIds = [];

    for (let i = 0; i < fileIds.length; i++) {
      if (fileIdList.indexOf(fileIds[i]) !== -1) {
        counter++;
      } else {
        missingIds.push(fileIds[i]);
      }
    }
    return { counter, missingIds };
  };

  //Rules Error Generator
  const rulesError = (fileIds, errorKey, extraInfo) => {
    let key = errorKey;
    let missingFiles = '';
    let params = [];

    if (key !== 'duplicated') {
      extraInfo.forEach(f => {
        const fileName = getFileName(f);
        missingFiles =
          missingFiles === '' ? fileName : `${missingFiles}, ${fileName}`;
      });
    }

    fileIds.forEach(f => {
      const currentFile = getFileName(f);

      switch (key) {
        case 'duplicated':
          params = [...extraInfo];
          key = extraInfo[0] > 1 ? 'duplicatedPlural' : 'duplicatedSingular';
          break;
        case 'missingComplementary':
        case 'missingMandatory':
          params = [];
          params.push(currentFile);
          params.push(missingFiles);
          break;
        default:
          break;
      }

      const error = { key, params };
      pushFileError(f, error);
    });
  };

  files.forEach(fileData => {
    const file = fileData.fileInfo;
    const fileId = file.fileId;
    const dataType = file.dataType;
    const dataTypeString = file.typeName;

    if (fileId !== -1) {
      if (validatedTypes.indexOf(dataType) === -1) {
        const dataTypeConfig = rules.find(r => r.type === dataType);
        const {
          rules: dataTypeRules,
          mandatoryFileIds,
          optionalFileIds,
        } = dataTypeConfig;

        const mandatoryRules = dataTypeRules ? dataTypeRules.mandatory : null;
        const optionalRules = dataTypeRules ? dataTypeRules.optional : null;

        //Rules validation
        if (dataTypeRules) {
          //Validate Mandatory rules
          if (mandatoryRules) {
            if (mandatoryRules.and) {
              const { fileIds, occurrences } = mandatoryRules.and;
              const { counter: fileCount, missingIds } = filesComparator(
                fileIds
              );

              if (fileCount < occurrences) {
                //For mandatory Files
                if (occurrences > 1) {
                  rulesError(
                    mandatoryFileIds,
                    'missingComplementary',
                    missingIds
                  );
                }
                //ForOptionaFiles
                if (optionalFileIds.length) {
                  rulesError(optionalFileIds, 'missingMandatory', missingIds);
                }
              }
            }
            if (mandatoryRules.or) {
              const { fileIds, occurrences } = mandatoryRules.or;
              const { counter: fileCount, missingIds } = filesComparator(
                fileIds
              );

              if (fileCount === 0) {
                //ForOptionalFiles
                if (optionalFileIds.length) {
                  rulesError(optionalFileIds, 'missingMandatory', missingIds);
                }
              } else if (fileCount < occurrences) {
                //ForMandatoryFiles
                rulesError(
                  mandatoryFileIds,
                  'missingComplementary',
                  missingIds
                );
                //ForOptionalFiles
                if (optionalFileIds.length) {
                  rulesError(optionalFileIds, 'missingMandatory', missingIds);
                }
              } else if (fileCount > occurrences) {
                //ForMandatoryFiles
                rulesError(mandatoryFileIds, 'duplicated', [
                  dataTypeString,
                  occurrences,
                ]);
              }
            }
          }
          //Validate Optional rules
          if (optionalRules) {
            if (optionalRules.and) {
              const { fileIds, occurrences } = optionalRules.and;
              const { counter: fileCount, missingIds } = filesComparator(
                fileIds
              );

              if (fileCount !== 0 && fileCount < occurrences) {
                //ForOptionalFiles
                rulesError(optionalFileIds, 'missingComplementary', missingIds);
              } else if (fileCount > occurrences) {
                //ForMandatoryFiles
                rulesError(optionalFileIds, 'duplicated', [
                  dataTypeString,
                  occurrences,
                ]);
              }
            }
            if (optionalRules.or) {
              const { fileIds, occurrences } = optionalRules.or;
              const { counter: fileCount } = filesComparator(fileIds);

              if (fileCount > occurrences) {
                //ForOptionalFiles
                rulesError(optionalFileIds, 'duplicated', [
                  dataTypeString,
                  occurrences,
                ]);
              }
            }
          }
        }

        //Check for Parameters validation
        //if(files.parameters.length) {}
        validatedTypes.push(dataType);
      }
    } else {
      const error = { key: 'unrecognized' };
      filesAreValid = false;
      pushFileError(fileId, error);
    }
  });

  return { files, globalError, filesAreValid };
};

export const validateTypes = (files, rules) => {
  files.forEach(fileData => {
    let fileMetadata = { ...fileMetadataInfo };

    if (fileData.fileInfo.dataType) {
      fileMetadata = fileData.fileInfo;
    } else {
      const fileValues = compareFile(fileData.file.name, rules);
      Object.assign(fileMetadata, fileValues);

      fileData.fileInfo = { ...fileMetadata };
    }
  });

  return files;
};

export const findDataTypeIndex = (rules, fileId) => {
  for (let i = 0; i < rules.length; i += 1) {
    const dataType = rules[i];
    for (let f = 0; f < dataType.files.length; f++) {
      const file = dataType.files[f];
      if (file.id === fileId) {
        return dataType;
      }
    }
  }
};

export const getParamArray = (indexes, params) => {
  let paramArray = [];
  if (Array.isArray(indexes)) {
    const paramsLength = params.length;
    paramArray = indexes.map(i => {
      const param = i < paramsLength ? params[i] : '';
      return param;
    });
  } else {
    paramArray.push(indexes);
  }

  return paramArray;
};

export const getConversionParamArray = (indexes, params) => {
  let paramArray = [];
  if (Array.isArray(indexes)) {
    const paramsLength = params.length;
    paramArray = indexes.map(i => {
      const param = i < paramsLength ? params[i] : '';
      return param;
    });
  } else {
    paramArray.push(params[indexes]);
  }

  return paramArray;
};
