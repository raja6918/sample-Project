import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import styled from 'styled-components';

import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

const Form = styled(FormControl)`
  margin: 10px 30px;
  background: rgb(255, 255, 255);
  color: #ffffff;
  font-size: 14px;
  border-radius: 3px;
  min-width: 400px;
  @media (max-width: 768px) {
    min-width: 250px;
  }
  @media (max-width: 576px) {
    min-width: auto;
    margin: 0px;
  }
  div {
    color: inherit;
    padding: 0px 10px;
  }
  input {
    padding-left: 7px;
    padding-right: 7px;
    font-family: 'Lato', seans-serif;
    font-size: 14px;
    caret-color: #4a4a4a;
    color: #4a4a4a;
  }
`;
const SearchIcon = styled(Icon)`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  color: #7e7e7e;
`;

class SearchEngine extends Component {
  render() {
    const { t } = this.props;
    return (
      <Form>
        <Input
          id="seachEngine"
          type="text"
          disableUnderline={true}
          startAdornment={<SearchIcon>search</SearchIcon>}
          placeholder={t('SEARCHENGINE')}
        />
      </Form>
    );
  }
}

SearchEngine.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(SearchEngine);
