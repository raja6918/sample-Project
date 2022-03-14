import React, { Component } from 'react';

import PropTypes from 'prop-types';

import SummaryFormWithConnect from './SummaryForm';

class Summary extends Component {
  isEditing = false;

  checkEditing = edit => {
    this.isEditing = edit;
  };

  shouldComponentUpdate() {
    return !this.isEditing;
  }

  render() {
    return (
      <React.Fragment>
        <SummaryFormWithConnect isEditing={this.checkEditing} {...this.props} />
      </React.Fragment>
    );
  }
}
Summary.propTypes = {
  activeRequest: PropTypes.shape({
    crewGroupName: PropTypes.string,
    elapsedTime: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEndorsed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.shape({
      activeBtns: PropTypes.arrayOf(PropTypes.string).isRequired,
      block: PropTypes.bool.isRequired,
      dateCurrent: PropTypes.bool.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      routes: PropTypes.arrayOf(PropTypes.number).isRequired,
      showTimer: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      statusId: PropTypes.number.isRequired,
      textBar: PropTypes.string.isRequired,
      timerType: PropTypes.string.isRequired,
    }).isRequired,
    lastModified: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  updateEndorsed: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Summary;
