import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding-right: 24px;
  padding-left: 24px;
  margin: ${props => (props.margin ? props.margin : '0 auto')};
`;
export default Container;
