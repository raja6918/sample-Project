import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const MenuText = styled(Typography)`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  color: ${props => (props.textColor ? props.textColor : 'initial')};
  line-height: 20px;
`;

export default MenuText;
