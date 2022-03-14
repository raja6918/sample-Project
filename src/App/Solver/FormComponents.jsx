import styled from 'styled-components';
import FormControlMUI from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

export const FormControl = styled(FormControlMUI)`
  width: 100%;
`;

export const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

export const GeneralTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  height: 28px;
`;

export const SpecificationTitle = styled.div`
  padding-left: 7px;
  & h2 {
    margin-top: 15px;
  }
`;

export const SolverFormHeader = styled.span`
  padding-left: 7px;
`;
