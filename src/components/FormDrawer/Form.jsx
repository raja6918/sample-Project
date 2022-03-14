import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

import Base from './Base';
import ActionsContent from '../Dialog/ActionsContent';

import ReadOnlyModeContext from '../../App/ReadOnlyModeContext';

import './Form.scss';

const FormContainer = styled.div`
  position: relative;
  width: 400px;
  height: 100vh;
`;
const FormFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: right;
  background: #fff;
`;

class Form extends Component {
  state = {
    isDisabled: this.props.isDisabled,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.isDisabled !== nextProps.isDisabled) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isDisabled: nextProps.isDisabled });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  handleOk = () => {
    this.removeTableRowClass();
    const isValidForm = this.ref.checkValidity();
    if (isValidForm) {
      this.setState({ isDisabled: true }, () => {
        this.props.handleOk(this.ref);
      });
    }
  };

  removeTableRowClass = () => {
    //used for loop for IE support(el: nodeList)
    const el = document.querySelectorAll('[id^="tablerow"]');
    for (let i = 0; i < el.length; i++) {
      el[i].classList.remove('highlight');
    }
  };

  handleCancel = () => {
    this.removeTableRowClass();
    this.props.handleCancel();
  };
  render() {
    const { isDisabled } = this.state;
    const {
      handleCancel,
      cancelButton,
      okButton,
      formId,
      onChange,
      restrictReadOnly = false,
      enableReadOnly,
      ...rest
    } = this.props;

    return (
      <Base handleCancel={this.handleCancel} {...rest}>
        <FormContainer>
          <ReadOnlyModeContext.Consumer>
            {({ readOnly }) => {
              const isReadOnlyForm =
                (readOnly && !restrictReadOnly) || enableReadOnly;
              const variant = isReadOnlyForm ? { variant: 'contained' } : {};
              return (
                <form
                  id={formId}
                  name={formId}
                  ref={ref => (this.ref = ref)}
                  onSubmit={this.handleSubmit}
                  onChange={onChange}
                  className={isReadOnlyForm ? 'read-only-form' : ''}
                >
                  {this.props.children}
                  <React.Fragment>
                    <FormFooter>
                      <ActionsContent>
                        <Button
                          color="primary"
                          onClick={this.handleCancel}
                          {...variant}
                        >
                          {cancelButton || 'Cancel'}
                        </Button>
                        <Button
                          disabled={isDisabled}
                          className={isReadOnlyForm ? 'hide-btn' : ''}
                          type="submit"
                          onClick={this.handleOk}
                          variant="contained"
                          color="primary"
                        >
                          {okButton || 'Ok'}
                        </Button>
                      </ActionsContent>
                    </FormFooter>
                  </React.Fragment>
                </form>
              );
            }}
          </ReadOnlyModeContext.Consumer>
        </FormContainer>
      </Base>
    );
  }
}

Form.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  handleOk: PropTypes.func,
  onChange: PropTypes.func,
  formId: PropTypes.string,
  cancelButton: PropTypes.string,
  okButton: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  restrictReadOnly: PropTypes.bool.isRequired,
  enableReadOnly: PropTypes.bool,
};

Form.defaultProps = {
  handleSubmit: () => {},
  onChange: () => {},
  cancelButton: 'Cancel',
  okButton: 'Ok',
  children: [],
  formId: '',
  handleOk: () => {},
  enableReadOnly: false,
};
export default Form;
