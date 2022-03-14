import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const RedirectLink = styled(Link)`
  color: #0a75c2;
  font-size: 12px;
  text-decoration: none;
  margin: ${props => props.margin};
  display: ${props => props.display};
  line-height: 31px;
  position: ${props => props.position};
`;

RedirectLink.propTypes = {
  margin: PropTypes.string,
  dispaly: PropTypes.string,
};

RedirectLink.defaultProps = {
  margin: '0 0 0 0px',
  display: 'inline-block',
};

export default RedirectLink;
