import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import Form from './Form';

const AddDialog = styled(Form)`
  & form > div:first-child {
    max-width: 560px;
    max-height: 180px;
    width: 100%;
    overflow-y: auto;
    padding: 0px 10px 20px 10px;

    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
  & > div:last-child {
    max-width: 560px;
  }
  & form > div:last-child {
    button {
      width: auto !important;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
`;

const MainContainer = styled.div`
  max-width: 490;
  margin-top: 20px;
  margin-left: 16px;

  & > p {
    font-size: 13px;
    color: #000000;
    text-align: left;
  }
`;

class StopDialog extends Component {
  render() {
    const { t, formId, open, handleClose, handleOk, texts } = this.props;

    return (
      <AddDialog
        formId={formId}
        open={open}
        title={texts.title}
        okButton={texts.okButton}
        cancelButton={t('GLOBAL.form.cancel')}
        onClose={handleClose}
        handleCancel={handleClose}
        handleOk={handleOk}
      >
        <MainContainer>
          <p>
            <ReactMarkdown
              renderers={{ paragraph: 'span' }}
              source={texts.content}
              escapeHtml={false}
            />
          </p>
        </MainContainer>
      </AddDialog>
    );
  }
}

StopDialog.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  texts: PropTypes.objectOf(PropTypes.String).isRequired,
};

export default StopDialog;
