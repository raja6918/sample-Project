import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ActionsContent from './../Dialog/ActionsContent';
import Button from '@material-ui/core/Button';
import Icon from './../Icon';

const StyledDialogContent = styled(DialogContent)`
  font-size: 12px;
  min-width: 400px;
  margin-top: 24px;
  ul {
    list-style-type: none;
  }
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  background: #d50000;
  font-size: 20px;
  height: 65px;
  padding: 0 20px;
`;

class ErrorModal extends React.Component {
  state = { open: true };

  handleCloseModal = () => {
    this.setState({ open: false }, this.props.clear());
  };

  render() {
    return (
      <Dialog open={this.state.open} title={'Error:'}>
        <ModalTitle>
          <Icon iconcolor={'#fff'} size={42}>
            error
          </Icon>
          <span>Errors</span>
        </ModalTitle>
        <StyledDialogContent>
          <p>{`${this.props.t('ERRORS.ERROR_HANDLING.ERRORS_DETECTED')}:`}</p>
          <ul>
            {this.props.errorMessageKeysTranslated.map(
              (errorMessage, index) => (
                <li key={`message-${index}`}>{errorMessage}</li>
              )
            )}
          </ul>
        </StyledDialogContent>
        <ActionsContent>
          <Button color="primary" onClick={() => this.handleCloseModal()}>
            Close
          </Button>
        </ActionsContent>
      </Dialog>
    );
  }
}

export default ErrorModal;
