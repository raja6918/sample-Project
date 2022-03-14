import styled from 'styled-components';
import MUIIcon from '@material-ui/core/Icon';

const Icon = styled(MUIIcon)`
  color: ${props =>
    props.iconcolor ? `${props.iconcolor} !important` : '#7e7e7e'};
  margin: ${props => (props.margin ? props.margin : '0 8px 0 0')};
  background-color: ${props => (props.bg ? props.bg : 'transparent')};
  border-radius: ${props => (props.rounded ? props.rounded : 'initial')};
  font-size: ${props => (props.size ? `${props.size}px` : null)};
`;

export default Icon;
