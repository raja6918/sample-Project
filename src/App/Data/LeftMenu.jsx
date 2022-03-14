import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import ListMUI from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Icon from '../../components/Icon';
import { perfectScrollConfig } from '../../utils/common';
import SierraMuiTooltip from '../../_shared/components/SierraMuiTooltip/SierraMuiTooltip';

export const Container = styled.div`
  height: calc(100vh - 54px);
  width: ${props => (props.open ? '256px' : '65px')};
  vertical-align: top;
  display: inline-block;
  border-right: 1px solid #cccccc;
  position: relative;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.18), 0 16px 16px 0 rgba(0, 0, 0, 0.24);
  transition: width 0.2s ease;
  overflow-x: hidden;
  font-size: 0;
  & * {
    margin: 0;
    padding: 0;
  }
  & svg {
    width: 1em;
    height: 1em;
    overflow: hidden;
    font-size: 24px;
    user-select: none;
    flex-shrink: 0;
  }
  & nav a {
    padding: 12px 20px;
  }
  & > a {
    padding: ${props =>
      props.open ? '16px 20px 36px 20px' : '12px 14px 16px 15px'};
    height: 58px;
    width: ${props => (props.open ? '256px' : '65px')};
    position: relative;

    & span {
      margin-right: ${props => (props.open ? '30px' : '0')};
      margin-left: ${props => (props.open ? 0 : '3px')};
      position: ${props => (props.open ? 'static' : 'absolute')};
      top: ${props => (props.open ? 'inherit' : '8px')};
    }
    & span:last-child {
      top: ${props => (props.open ? 'inherit' : '35px')};
    }
  }
`;

export const ExpandCollapseButton = styled.div`
  background-color: #afafaf;
  height: 48px;
  line-height: 48px;
  position: fixed;
  bottom: 0;
  width: ${props => (props.open ? '256px' : '65px')};
  transition: width 0.2s ease;
  &:hover {
    background-color: #afafaf;
  }
  & span {
    position: absolute;
    top: 12px;
  }
  & span:nth-child(1) {
    right: 23px;
  }
  & span:nth-child(2) {
    right: 13px;
  }

  & div {
    width: 65px;
    height: 48px;
    float: right;
    cursor: pointer;
  }
`;
const DataLink = styled(Link)`
  background-color: #000000;
  color: #fff;
  font-size: 14px;
  -webkit-text-align: center;
  text-align: center;
  font-weight: normal;
  width: 100%;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  text-align: center;
  & span {
    color: #fff;

    margin-right: 30px;
  }
  & h2 {
    font-size: 24px;

    font-weight: normal;
  }
`;

const List = styled(ListMUI)`
  height: calc(100vh - 160px);
  overflow-y: auto;
  overflow-x: hidden;
  width: ${props => (props.open ? '100%' : '65px')};
  & a {
    width: 100%;
    text-decoration: none;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    & p {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      display: inline-block;
      margin-left: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
export const ListItemMU = styled(ListItem)`
  &:hover a span {
    color: ${props => props.hovercolor};
  }
  &:hover * {
    fill: ${props => props.hovercolor};
  }
`;
export class MenuItem extends React.Component {
  state = {
    isTooltipOpen: false,
  };

  onOpenTooltip = () => {
    this.setState({ isTooltipOpen: true });
  };

  onCloseTooltip = () => {
    this.setState({ isTooltipOpen: false });
  };

  render() {
    const {
      link,
      icon,
      name,
      location,
      open,
      hovercolor,
      showInEditMode,
      editMode,
      openItemId,
      openItemName,
      svgIcon,
      viewBox,
      readOnly,
      className,
    } = this.props;

    const { isTooltipOpen } = this.state;

    if (showInEditMode) {
      return (
        <SierraMuiTooltip
          title={!open ? `${name}` : ''}
          classes={{ popper: `ellipse-zoom-popper` }}
          placement="right"
          open={!open && isTooltipOpen}
          onOpen={this.onOpenTooltip}
          onClose={this.onCloseTooltip}
          disableTouchListener
          disableFocusListener
          key={`tooltip_${link}`}
        >
          <ListItemMU
            button
            style={
              location === link ? { backgroundColor: 'rgba(0,0,0,0.08)' } : null
            }
            className={className}
            hovercolor={hovercolor}
          >
            <Link
              to={{
                pathname: link,
                state: {
                  editMode,
                  openItemId,
                  openItemName,
                  readOnly,
                },
              }}
            >
              {svgIcon ? (
                svgIcon({
                  fill: location === link ? hovercolor : '#7e7e7e',
                  viewBox: viewBox ? viewBox : '0 0 44 44',
                  width: '24px',
                })
              ) : (
                <Icon iconcolor={location === link ? hovercolor : null}>
                  {icon}
                </Icon>
              )}

              <p>{name}</p>
            </Link>
          </ListItemMU>
        </SierraMuiTooltip>
      );
    }
    return null;
  }
}

const LeftMenu = ({
  t,
  current_path,
  handleExpandCollapseMenu,
  open,
  options,
  ...rest
}) => {
  const { editMode, openItemId, openItemName, readOnly } = rest;

  const route = {
    pathname: `/data/${openItemId}`,
    state: {
      editMode,
      openItemId,
      openItemName,
      readOnly,
    },
  };
  return (
    <Container open={open}>
      <DataLink to={route}>
        <Icon>arrow_back</Icon>
        <span>{t('DATA.title')}</span>
      </DataLink>
      <List component="nav" open={open}>
        <PerfectScrollbar option={perfectScrollConfig}>
          {options.map(menuOption => {
            const {
              path,
              hideInEditMode = false,
              component,
              showInMenu = true,
              className,
              ...restOptionProps
            } = menuOption;
            const showInEditMode = !hideInEditMode ? true : !editMode;
            const link = `${current_path}${path}`;

            if (!showInMenu) return <noscript key={path} link={link} />;

            return (
              <MenuItem
                key={path}
                link={link}
                showInEditMode={showInEditMode}
                {...restOptionProps}
                {...rest}
                open={open}
                className={className}
              />
            );
          })}
        </PerfectScrollbar>
        <ExpandCollapseButton open={open}>
          <div onClick={handleExpandCollapseMenu}>
            <Icon iconcolor={'#ffffff'}>
              {open ? 'chevron_left' : 'chevron_right'}
            </Icon>
            <Icon iconcolor={'#ffffff'}>
              {open ? 'chevron_left' : 'chevron_right'}
            </Icon>
          </div>
        </ExpandCollapseButton>
      </List>
    </Container>
  );
};

LeftMenu.propTypes = {
  t: PropTypes.func.isRequired,
  current_path: PropTypes.string.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  open: PropTypes.bool,
  handleExpandCollapseMenu: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.string,
      hovercolor: PropTypes.string,
    })
  ).isRequired,
};

LeftMenu.defaultProps = {
  open: false,
};

MenuItem.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hovercolor: PropTypes.string.isRequired,
  showInEditMode: PropTypes.bool.isRequired,
  location: PropTypes.string.isRequired,
  open: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  svgIcon: PropTypes.func,
  viewBox: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
};

MenuItem.defaultProps = {
  svgIcon: undefined,
  viewBox: '0 0 44 44',
  open: false,
  readOnly: false,
};

export default LeftMenu;
