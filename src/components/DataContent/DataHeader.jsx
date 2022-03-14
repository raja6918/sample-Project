import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const Header = styled.div`
  h2 {
    font-weight: 400;
    margin: 0;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.87);
    margin: 32px 0 0 0;

    span {
      display: block;
      font-size: 16px;
    }
  }

  button {
    position: absolute;
    right: 0;
    top: 0;
  }
`;
Header.displayName = 'Header';
const ItemName = styled.p`
  display: inline-block;
  vertical-align: top;
  width: 45%;
  font-size: 18px;
  color: #0a75c2;
  margin: 32px 0 0 0;
  @media (max-width: 768px) {
    left: 60% !important;
  }
`;
const NameAndTemplate = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 38%;
  margin-right: 5%;
`;

class DataHeader extends Component {
  render() {
    const { name, onClick, scenarioName, editMode, templateName } = this.props;

    return (
      <Header>
        <NameAndTemplate>
          <h2>{name}</h2>
        </NameAndTemplate>

        <ItemName>{editMode ? templateName : scenarioName}</ItemName>
        <Fab color="secondary" onClick={onClick} aria-label="add">
          <AddIcon />
        </Fab>
      </Header>
    );
  }
}

DataHeader.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  scenarioName: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  templateName: PropTypes.string.isRequired,
};
export default DataHeader;
