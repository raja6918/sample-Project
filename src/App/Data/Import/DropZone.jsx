import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../../components/Icon';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Drop = styled.div`
  height: 155px;
  border: 2px dashed;
  border-color: #e0e0e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
  padding: 20px;
  margin: 38px 5px 5px 5px;
  width: 500px;

  order: 99;

  & input {
    display: none;
  }
  & p {
    font-size: 12px;
    color: #e0e0e0;
    text-align: center;
    width: 100%;
  }

  & p.mini {
    font-size: 10px;
    width: 180px;
  }

  & span.cloud {
    margin: 0px 0px 0px 0px;
  }
`;

const FromMenu = styled(Menu)`
  margin-top: 40px;
`;

const MenuButton = styled(Button)`
  font-size: 13px;
  text-transform: lowercase;
  min-height: 16px;
  padding: 4px;
  margin-right: -10px;
  margin-top: -2px;
  background-color: transparent;
  width: fit-content;
  & span {
    color: #0a75c2 !important;
  }
  & :hover {
    background-color: transparent;
  }

  &.mini {
    font-size: 10px;
    padding: 3px;
    margin-right: none;
    margin-top: 0px;

    & span > span {
      margin: 0 6px 0px -4px;
    }
  }
`;

const Options = styled(MenuItem)`
  font-size: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

class DropZone extends Component {
  state = {
    hightlight: false,
    fileArray: [],
    anchorElement: null,
  };

  fileInputRef = React.createRef();

  handleMenuClick = event => {
    this.setState({ anchorElement: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  onFilesAdded = e => {
    const files = e.target.files;
    this.props.handleFiles(files);
    e.target.value = '';
  };

  openFileDialog = () => {
    this.fileInputRef.current.click();
    this.handleMenuClose();
  };

  onDragOver = e => {
    e.preventDefault();
    this.setState({ hightlight: true }, this.props.toggleOuterHighlight);
  };

  onDragLeave = e => {
    e.preventDefault();
    this.setState({ hightlight: false });
  };

  onDrop = e => {
    e.preventDefault();
    this.setState({ hightlight: false }, this.props.filesEventController(e));
  };

  render() {
    const { hightlight, anchorElement } = this.state;
    const { t, isEmpty } = this.props;

    const lineStyle = hightlight
      ? {
          borderColor: '#ff650c',
          borderStyle: 'solid',
        }
      : {
          borderColor: '#e0e0e0',
          borderStyle: 'dashed',
        };

    const size = isEmpty
      ? {
          width: '626px',
        }
      : {
          width: '198px',
          height: '135px',
        };

    const styles = { ...lineStyle, ...size };

    const miniClass = classnames({
      mini: !isEmpty,
    });

    return (
      <Drop
        style={styles}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <input
          ref={this.fileInputRef}
          type="file"
          multiple
          onChange={this.onFilesAdded}
        />

        <Icon
          size={isEmpty ? 52 : 30}
          iconcolor={hightlight ? '#ff650c' : '#e0e0e0'}
          className={'cloud'}
        >
          cloud_upload
        </Icon>

        <p className={miniClass}>
          {t('DATA.import.dropTextFirst')}
          <MenuButton
            aria-owns={anchorElement ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleMenuClick}
            size={'small'}
            disableRipple={true}
            className={miniClass}
          >
            {t('DATA.import.dropTextButton')}
            <Icon className={'buttonArrow'} size={18}>
              arrow_drop_down
            </Icon>
          </MenuButton>
          {t('DATA.import.dropTextLast')}
        </p>

        <FromMenu
          id="simple-menu"
          anchorEl={anchorElement}
          open={Boolean(anchorElement)}
          onClose={this.handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          getContentAnchorEl={null}
        >
          <Options onClick={this.openFileDialog}>
            {t('DATA.import.fromComputerButton')}
          </Options>
          {/* <Options>{t('DATA.import.fromAPIButton')}</Options> */}
        </FromMenu>
      </Drop>
    );
  }
}

DropZone.propTypes = {
  t: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  handleFiles: PropTypes.func.isRequired,
  toggleOuterHighlight: PropTypes.func.isRequired,
  filesEventController: PropTypes.func.isRequired,
};

export default DropZone;
