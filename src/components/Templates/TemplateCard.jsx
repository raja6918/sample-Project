import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';

import Icon from '../Icon';
import MenuAction from '../Menu/MenuAction';

import { lastModified as lastModifiedFormat } from '../../utils/dates';
import { checkPermission } from '../../utils/common';

import { READ_ONLY } from '../../App/Scenarios/constants';
import SierraTooltip from '../../_shared/components/SierraTooltip';
import './TemplateCard.scss';
import { connect } from 'react-redux';

const TemplateHead = styled.div`
  color: #fff;
  cursor: pointer;
  background-color: #0a75c2;
  padding: 17px 20px;
  border-radius: 2px 2px 0 0;
  position: relative;
  p:first-of-type {
    font-size: 18px;
    margin-top: 0px;
  }
  & p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p:first-of-type {
    font-size: 18px;
    margin-top: 0px;
  }
  p:last-of-type {
    font-size: 14px;
    margin-bottom: 0px;
  }
`;

const Holder = styled(Card)`
  width: 310px;
  text-align: left;
  display: inline-block;
  margin: 0 15px 30px 15px;
  border-radius: 2px;
  p {
    margin: 3px 0;
  }
`;

const TemplateBody = styled.div`
  padding: 17px 20px;
  p {
    font-size: 12px;
    line-height: 15px;
  }
  div:first-of-type {
    color: rgba(0, 0, 0, 0.67);
  }
  div:last-of-type {
    color: rgba(0, 0, 0, 0.87);
  }
`;

const IconWrapper = styled.div`
  background-color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  right: 20px;
  top: 18px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

class TemplateCard extends React.Component {
  state = {
    anchorEl: null,
  };

  readOnlyStatus = this.props.template.status === READ_ONLY;

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloeMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = () => {
    const { template } = this.props;
    if (this.props.handleClick) {
      this.props.handleClick(template);
    }
  };

  createMenuActions = () => {
    const { template, cardMenuActions, scopes, userPermissions } = this.props;
    return cardMenuActions.map((menuAction, index) => {
      const isDisabled =
        ['delete'].includes(menuAction.icon) &&
        (this.readOnlyStatus ||
          !checkPermission(scopes.delete, userPermissions));
      return (
        <MenuAction
          disabled={isDisabled}
          key={`menu-action-${index}`}
          handleClick={() => {
            if (menuAction.closesMenu) {
              this.closeMenu();
            }
            menuAction.handleClick(template);
          }}
          icon={menuAction.icon}
          svgIcon={menuAction.svgIcon}
          text={menuAction.text}
        />
      );
    });
  };

  render() {
    const { anchorEl } = this.state;
    const {
      t,
      template,
      cardMenuActions,
      scopes,
      userPermissions,
    } = this.props;
    const needMenu = cardMenuActions.length;

    const readOrViewOnlyMessage =
      this.readOnlyStatus && checkPermission(scopes.manage, userPermissions)
        ? t('TEMPLATES.readOnlyTooltip')
        : t('TEMPLATES.viewOnlyTooltip');

    return (
      <Holder id={`template-${template.id}`}>
        <TemplateHead color="primary" onClick={this.handleClick}>
          <p
            style={{
              width: this.readOnlyStatus ? '250px' : 'auto',
            }}
          >
            {template.name}
          </p>
          <p style={{ height: template.category ? 'auto' : '17px' }}>
            {template.category}
          </p>
          {(this.readOnlyStatus ||
            !checkPermission(scopes.manage, userPermissions)) && (
            <IconWrapper>
              <SierraTooltip
                position="bottom"
                html={
                  <p className="temp-icon-tooltip">{readOrViewOnlyMessage}</p>
                }
              >
                <Icon className="temp-icon" iconcolor={'#0a75c2'}>
                  visibility
                </Icon>
              </SierraTooltip>
            </IconWrapper>
          )}
        </TemplateHead>
        <TemplateBody>
          <div style={{ display: 'inline-block' }}>
            <p>{t('GLOBAL.createdBy')}:</p>
            <p>{t('GLOBAL.lastModified')}:</p>
          </div>
          <div style={{ display: 'inline-block', paddingLeft: '10px' }}>
            <p>{template.createdBy}</p>
            <p>{lastModifiedFormat(template.lastModifiedTime)}</p>
          </div>
          <IconButton
            style={{
              float: 'right',
              marginTop: '0px',
              width: '30px',
              height: '30px',
              padding: '0px',
            }}
            aria-label="More"
            aria-owns={anchorEl ? 'long-menu' : null}
            aria-haspopup="true"
            onClick={this.openMenu}
          >
            <Icon iconcolor={'#0A75C2'} margin="0">
              more_vert
            </Icon>
          </IconButton>
          {needMenu && (
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.closeMenu}
            >
              {this.createMenuActions()}
            </Menu>
          )}
        </TemplateBody>
      </Holder>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    userPermissions: user.permissions,
  };
};

TemplateCard.propTypes = {
  t: PropTypes.func.isRequired,
  handleClick: PropTypes.func,
  template: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  cardMenuActions: PropTypes.arrayOf(PropTypes.object),
  scopes: PropTypes.shape({
    add: PropTypes.arrayOf(PropTypes.string),
    delete: PropTypes.arrayOf(PropTypes.string),
    view: PropTypes.arrayOf(PropTypes.string),
    manage: PropTypes.arrayOf(PropTypes.string),
  }),
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

TemplateCard.defaultProps = {
  handleClick: () => {},
  cardMenuActions: [],
  scopes: {},
};

const TemplateCardComponent = connect(mapStateToProps)(TemplateCard);

export default TemplateCardComponent;
