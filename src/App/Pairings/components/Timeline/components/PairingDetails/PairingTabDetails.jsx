import React, { Component } from 'react';
import PropTypes from 'prop-types';
import storage from '../../../../../../utils/storage';
import PairingDetailsWithErrorHandling from './PairingDetails';

export class PairingTabDetails extends Component {
  componentDidMount() {
    // grab openPreview from session storage
    const openPairingDetails = storage.getItem('openPairingDetails');

    if (!openPairingDetails) {
      storage.setItem('openPairingDetails', {
        pathname: location.pathname,
      });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <PairingDetailsWithErrorHandling
        newTab={true}
        open={true}
        t={t}
        {...this.props}
      />
    );
  }
}

PairingTabDetails.propTypes = {
  t: PropTypes.func.isRequired,
};

export default PairingTabDetails;
