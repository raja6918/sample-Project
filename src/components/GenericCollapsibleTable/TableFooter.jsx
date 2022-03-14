import React from 'react';
import styled from 'styled-components';

const FooterText = styled.p`
  display: block;
  font-size: 12px;
  color: #000;
  margin: 16px 18px 0px 0px;
  line-height: 13px;
`;

const countText = ({ current, totalDataSize, total, name, isFilter }) =>
  total > current || isFilter
    ? `${current} of ${totalDataSize} ${name.toLowerCase()}`
    : `${totalDataSize} ${name.toLowerCase()}`;

const TableFooter = props => <FooterText>{countText(props)}</FooterText>;

export default TableFooter;
