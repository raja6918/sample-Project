import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';

const TableName = styled(Typography)`
  display: flex;
  flex: 1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  align-items: center;
`;

const StyledHeader = styled.div`
  display: flex;
  padding: 21px 0;
  position: relative;
  & h2 {
    margin: 0;
    padding: 0;
    line-height: 24px;
  }
  & button:last-child {
    position: absolute;
    right: 0px;
    top: 10px;
  }
`;

class Header extends React.Component {
  onClick = () => {
    this.props.openForm();
  };
  handleNewUserRole = () => {
    this.props.handleNewUserRole();
  };
  render() {
    const { tableName, redirectLink, openForm } = this.props;
    return (
      <StyledHeader>
        <TableName variant="h6">
          {tableName}
          {redirectLink}
        </TableName>
        <Fab color="secondary" onClick={openForm} aria-label="add">
          <AddIcon />
        </Fab>
      </StyledHeader>
    );
  }
}

Header.propTypes = {
  tableName: PropTypes.string.isRequired,
  openForm: PropTypes.func.isRequired,
  redirectLink: PropTypes.oneOfType([PropTypes.element, PropTypes.null]),
};

Header.defaultProps = {
  redirectLink: null,
};
export default Header;
