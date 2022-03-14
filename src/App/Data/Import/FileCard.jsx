import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from '../../../components/Icon';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { formatFileDate } from '../utils/utils';
import { findDataTypeIndex } from './helpers';
import SierraTooltip from './../../../_shared/components/SierraTooltip/';

const UploadCard = styled.div`
  height: 135px;
  width: 198px;
  margin: 21px 5px 5px 5px;

  & span.icon {
    position: relative;
    width: 40px;
    height: 40px;
    text-align: center;
    color: #fff;
    border-radius: 40px;
    margin-left: 79px;
    line-height: 40px;
  }

  & span.removeIcon {
    position: relative;
    cursor: pointer;
    margin-left: 53px;
    padding-top: 4px;
    transform: translate(10%, 48%);
  }

  & span.cRemoveIcon {
    position: relative;
    cursor: pointer;
    margin-left: 53px;
    padding-top: 3px;
    transform: translate(4%, 48%);
  }

  & div.infoContainer {
    height: 100%;
    width: 100%;
    border: 2px solid;
    border-color: #ff650c;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    padding: 10px;
    margin-top: -25px;

    & span.fileDataContainer {
      display: flex;
      width: 180px;

      & p {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 5px;
      }

      & .detailsIcon {
        margin: 0px;
      }
    }

    & .fileType {
      font-size: 16px;
      color: #ff650c;
      margin-top: 18px;
    }

    & p.time {
      width: 180px;
      font-size: 10px;
      color: #7e7e7e;
      margin-left: 40px;
    }

    & .selectForm {
      margin: 15px 0;
    }
  }
`;

const MenuOption = styled(MenuItem)`
  font-size: 15px;
  /* height: 12px; */
`;

const FileSelect = styled(Select)`
  width: 180px;
  font-size: 16px;
  color: #ff650c;
  border-color: #ff650c;
  border-bottom: 2px solid;

  & div > div {
    padding-right: 23px;
    padding-left: 18px;
    text-align: center;
  }

  &.error {
    color: #d10000;
    border-color: #d10000;
    border-bottom: 2px solid;
  }
`;

const DescriptiveKey = styled.span`
  font-size: 10px;
  font-style: italic;
  font-weight: 200;
  transform: translate(0px, 1px);
  margin-left: 2px;
  color: #000000 25% !important;
`;

class FileCard extends Component {
  state = {
    time: '',
  };

  componentWillMount() {
    const { lastModifiedDate } = this.props.fileData.file;
    const time = formatFileDate(lastModifiedDate);

    this.setState({ time });
  }

  menuOptions = () => {
    const { importFileOptions } = this.props;
    const items = [];

    importFileOptions.forEach(item => {
      let firstElement = '';
      let secondElement = '';
      let onlyName = true;

      switch (item.indicator) {
        case 'SFX':
        default:
          firstElement = item.name;
          secondElement = item.extraKey;
          onlyName = false;
          break;
        case 'PFX':
          firstElement = `${item.extraKey} ${item.name}`;
          secondElement = '';
          onlyName = true;
          break;
        case 'KNL':
          firstElement = item.extraKey;
          secondElement = '';
          onlyName = true;
          break;
        case 'NKY':
          firstElement = item.name;
          secondElement = '';
          onlyName = true;
          break;
      }

      items.push(
        <MenuOption value={item.id} key={item.id}>
          {onlyName ? (
            <React.Fragment>{firstElement}</React.Fragment>
          ) : (
            <React.Fragment>
              {firstElement}
              <DescriptiveKey>{secondElement}</DescriptiveKey>
            </React.Fragment>
          )}
        </MenuOption>
      );
    });

    return items;
  };

  handleSelectChange = e => {
    const { importConfig } = this.props;
    const fileId = e.target.value;

    if (fileId !== -1) {
      const selectedDataType = findDataTypeIndex(importConfig, fileId);

      const updatedData = {
        fileId,
        icon: selectedDataType.icon,
        dataType: selectedDataType.type,
        isTypeChanged: true,
        isCustomIcon: selectedDataType.isCustomIcon,
        iconStyles: selectedDataType.iconStyles,
        typeName: selectedDataType.name,
      };

      this.props.updateFileData(this.props.index, updatedData);
    }
  };

  render() {
    const { time } = this.state;
    const { fileData, t, index, deleteFile } = this.props;
    const {
      icon,
      errors,
      isCustomIcon,
      name,
      fileId,
      iconStyles,
    } = fileData.fileInfo;
    const CIcon = icon;
    const errorCount = errors.length;
    let mainErrorMessage = '';

    const lineStyle = { borderColor: '#ff650c' };
    const iconContainer = {
      backgroundColor: '#ff650c',
      padding: '14px 2px 6px 2px',
    };
    const CustomIconProps = {
      width: '28px',
      height: '28px',
      viewBox: '0 0 45 45',
      fill: '#FFF',
    };

    if (isCustomIcon) {
      iconContainer.padding = '14px 20px 6px 20px';
    }

    if (fileId === -1) {
      lineStyle.borderColor = '#d10000';
      CustomIconProps.width = '32px';
      CustomIconProps.height = '32px';
      iconContainer.backgroundColor = '#d10000';
    }

    if (errorCount) {
      lineStyle.borderColor = '#d10000';
      iconContainer.backgroundColor = '#d10000';

      const key = errors[0].key;
      const params = errors[0].params;
      mainErrorMessage = t(`ERRORS.IMPORT.${key}`, params);
    }

    const cardStyle = isCustomIcon
      ? { transform: 'translate(0px, 2px)' }
      : { transform: 'translate(0px, 1px)' };

    return (
      <UploadCard
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        style={cardStyle}
      >
        {isCustomIcon ? (
          <span className={'icon'} style={iconContainer}>
            <CIcon {...CustomIconProps} style={iconStyles} />
          </span>
        ) : (
          <span className={'icon'} style={iconContainer}>
            <Icon size={27} iconcolor={'#ffffff'} style={iconStyles}>
              {icon}
            </Icon>
          </span>
        )}

        <Icon
          className={isCustomIcon ? 'cRemoveIcon' : 'removeIcon'}
          size={18}
          onClick={() => deleteFile(index)}
        >
          clear
        </Icon>

        <div className={'infoContainer'} style={lineStyle}>
          <FormControl className={'selectForm'}>
            <FileSelect
              value={fileId}
              onChange={this.handleSelectChange}
              displayEmpty
              name="fileType"
              disableUnderline
              className={errorCount ? 'error' : ''}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
                className: 'menuList',
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    transform: 'translate(0px, 4px)',
                  },
                },
              }}
            >
              {fileId === -1 && (
                <MenuOption value={-1}>
                  {t(`DATA.import.fileTypes.unknown`)}
                </MenuOption>
              )}
              {this.menuOptions()}
            </FileSelect>
          </FormControl>

          <span className="fileDataContainer">
            <Icon size={15} className="detailsIcon" iconcolor="#7E7E7E">
              description
            </Icon>
            <p>{name}</p>
            {errorCount > 0 && (
              <SierraTooltip
                position="bottom"
                html={
                  <div
                    style={{
                      padding: '5px',
                      fontSize: '12px',
                      maxWidth: '344px',
                      fontWeight: '300',
                      textAlign: 'justify',
                    }}
                  >
                    {mainErrorMessage}
                  </div>
                }
              >
                <Icon size={16} className="detailsIcon" iconcolor="#D10000">
                  error
                </Icon>
              </SierraTooltip>
            )}
          </span>
          <p className="time">{time}</p>
        </div>
      </UploadCard>
    );
  }
}

FileCard.propTypes = {
  t: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  fileData: PropTypes.shape({
    file: PropTypes.shape({
      lastModifiedDate: PropTypes.date,
      name: PropTypes.string,
    }),
    fileInfo: PropTypes.shape({}),
  }).isRequired,
  index: PropTypes.number.isRequired,
  updateFileData: PropTypes.func.isRequired,
  importFileOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  importConfig: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default FileCard;
