import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkDown from 'react-markdown';
import Confirmation from '../../components/Dialog/Confirmation';

const DeleteDialog = props => {
  const { t, title, okText, strongText, bodyText, bodyText2, ...rest } = props;

  return (
    <Confirmation title={title} okButton={okText} {...rest}>
      <div style={{ marginBottom: '25px', marginTop: '24px' }}>
        <p
          style={{
            marginTop: 0,
            fontSize: '14px',
            color: '#000000',
            lineHeight: '18px',
          }}
        >
          <ReactMarkDown source={bodyText} renderers={{ paragraph: 'span' }} />
          {/* <strong>{strongText}</strong> */}
        </p>
        {bodyText2 && (
          <p
            style={{
              marginBottom: 0,
              marginTop: '10px',
              fontSize: '14px',
              color: '#000000',
              lineHeight: '18px',
            }}
          >
            {bodyText2}
          </p>
        )}
      </div>
    </Confirmation>
  );
};

DeleteDialog.propTypes = {
  t: PropTypes.func.isRequired,
  title: PropTypes.string,
  okText: PropTypes.string,
  strongText: PropTypes.string,
  bodyText: PropTypes.string,
  bodyText2: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  onExited: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

DeleteDialog.defaultProps = {
  title: '',
  okText: '',
  strongText: '',
  bodyText: '',
  bodyText2: '',
  onExited: () => {},
};

export default DeleteDialog;
