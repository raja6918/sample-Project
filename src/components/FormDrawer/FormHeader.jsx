import styled from 'styled-components';

const FormHeader = styled.div`
  background: #5098e7;
  padding: 20px 20px 34px 14px;
  height: 113px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  & span {
    display: block;
  }
  & > span:first-child {
    font-size: 14px;
    margin-top: 14px;
    font-weight: 400;
  }
  & > span:last-child {
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    padding-top: 5px;
  }
`;

export default FormHeader;
