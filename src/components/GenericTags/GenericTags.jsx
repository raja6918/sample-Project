import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import AutocompleteChips from '../AutocompleteChips/AutocompleteChips';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import { Typography } from '@material-ui/core';
import './style.scss';

const translationKey = 'PAIRINGS.details';

export const CustomText = styled.p`
  font-size: 12px;
  color: #666666;
  text-align: left;
  margin: 0px;
`;

class GenericTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
      // showWarning: false,
    };
  }

  componentDidMount() {
    const { tags } = this.state;
    this.setState({ tags });
  }

  handleTagsUpdate = tags => {
    const { onChange } = this.props;

    this.setState(
      {
        tags,
      },
      () => {
        onChange(tags);
      }
    );
  };

  render() {
    const { t, currentTags, disabled, placeholder } = this.props;
    const { tags } = this.state;

    return (
      <React.Fragment>
        <Grid container spacing={2} className="generic-tags">
          <Grid item xs={12} sm={12}>
            <CustomText id="tags" style={{ marginBottom: 10 }}>
              {t(`${translationKey}.tags`)}
            </CustomText>
            <AutocompleteChips
              chips={tags}
              chipsSource={currentTags}
              onChipsUpdate={this.handleTagsUpdate}
              disabled={disabled}
              label={t(`${translationKey}.tagsLabel`)}
              placeholder={placeholder}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

GenericTags.propTypes = {
  t: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  currentTags: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

GenericTags.defaultProps = {
  tags: [],
  currentTags: [],
  disabled: false,
  placeholder: '',
};

export default GenericTags;
