import styled from 'styled-components';
import MUIMenuItem from '@material-ui/core/MenuItem';

const MenuItem = styled(MUIMenuItem)`
  height: 48px;
  &:hover .material-icons {
    color: #4a4a4a;
  }

  &:hover svg *[fill] {
    fill: #4a4a4a;
  }
`;

export const MenuItemLink = styled(MUIMenuItem)`
  padding: 0;
  height: 100%;
  &:hover .material-icons {
    color: #f5f5f5;
    transform: scaleY(-1);
  }

  &:hover svg *[fill] {
    fill: #f5f5f5;
  }
`;

export default MenuItem;
