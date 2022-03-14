import styled from 'styled-components';
import DialogActions from '@material-ui/core/DialogActions';

const ActionsContent = styled(DialogActions)`
  padding: 14px;
  padding-right: 24px;
  margin: 0;
  border-top: 1px solid #cccccc;

  & button {
    padding: 0 5px;
    min-width: 80px;
    min-height: 32px;
    font-size: 13px;
    line-height: 32px;
  }
  & button :first-child {
    border: 1px solid #0a75c2;
    border-radius: 2px;
  }
  & button:last-child {
    border-radius: 2px;
    font-size: 13px;
  }
  & button[disabled] {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

export default ActionsContent;
