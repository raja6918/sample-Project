import styled from 'styled-components';

const FormBody = styled.div`
  background: #f7f7f7;
  height: calc(100vh - 176px);
  /* overflow-y: auto; */
  /* padding: 20px; */
  & > div > div:first-child {
    padding: 20px;
  }
  & input {
    width: 100%;
    margin: 0;
  }
  & .error > label {
    color: #d10000;
  }

  & h2 {
    font-size: 16px;
    font-family: 'Roboto-Regular', sans-serif;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 20px;
  }
`;

export default FormBody;
