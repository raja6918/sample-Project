import styled from 'styled-components';

import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

export const InputSearch = styled(FormControl)`
  font-size: 14px;
  background-color: #fff;
  margin: 7px auto;
  width: 90%;

  div {
    color: inherit;
    padding: 0px 5px;
    border: 1px solid;
  }
  input {
    padding: 5px 0 5px 7px !important;

    font-family: 'Lato', seans-serif;
    font-size: 14px;
    caret-color: #4a4a4a;
    color: #4a4a4a;
  }
`;
export const SearchIcon = styled(Icon)`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  color: #7e7e7e;
`;

export const ClearButton = styled(IconButton)`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
`;

export const ClearIcon = styled(Icon)`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  color: #7e7e7e;
`;
