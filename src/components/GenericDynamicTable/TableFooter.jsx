import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ControlPointIcon from '@material-ui/icons/ControlPoint';

const FooterText = styled.p`
  display: block;
  font-size: 12px;
  color: #000;
  line-height: 13px;
  height: 50px;
  margin: 0;
  border-bottom: 1px solid #cccccc;
  margin-left: ${props => props.marginLeft};
`;

const TableFooter = ({ index, marginLeft, handleInsertRow, readOnly }) => (
  <FooterText marginLeft={marginLeft}>
    <div id="table-footer-first-column" style={{ float: 'left' }}>
      <IconButton
        style={{
          width: 24,
          height: 24,
          padding: '25px 25px 24px 25px',
        }}
        onClick={() => handleInsertRow(index, 'above', true)}
        disabled={readOnly}
      >
        <ControlPointIcon color={readOnly ? 'disabled' : 'primary'} />
      </IconButton>
    </div>
    <div
      id="table-footer-last-column"
      style={{ width: '45px', float: 'right', height: '50px' }}
    />
  </FooterText>
);

TableFooter.propTypes = {
  index: PropTypes.number.isRequired,
  marginLeft: PropTypes.string.isRequired,
  handleInsertRow: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default TableFooter;
