import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '../../Icon';
import TextField from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';

export const AddButton = styled.div`
  & > span:first-child {
    padding: 12px !important;
  }
  & > span:last-child {
    font-size: 12px;
    color: #0a75c2;
    cursor: pointer;
  }

  & > span.disabled:last-child {
    color: #7e7e7e;
    cursor: auto;
  }
`;

export const DeleteBtn = styled(IconButton)`
  width: 30px;
  height: 30px;
  top: 17px;
`;

export const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

export const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

export const CustomGrid = styled(Grid)`
  position: relative;
  font-size: 0;
  padding: 4px !important;
  & > div:first-child {
    width: 100%;
  }
  & label {
    min-width: 100px;
  }
  & .error label {
    color: #d10000 !important;
  }
`;

export const TimeIcon = styled(Icon)`
  position: relative;
  top: -4px;
`;
