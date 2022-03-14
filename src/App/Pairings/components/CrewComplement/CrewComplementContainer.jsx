import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dialog from '../../../../components/Dialog/Form';
import Notification from '../../../../components/Notification';
import * as pairingService from '../../../../services/Pairings';

import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import StandardCrewComplement from '../../../../components/StandardCrewComplement';
import { perfectScrollConfig } from '../../../../utils/common';
import moment from 'moment';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paperWidthSm {
    width: 600px;
  }
  & .MuiDialogContent-root {
    height: 253px !important;
  }
  #crewCompositionDialog > div {
    padding-top: 10px;
  }
  #crewCompositionDialog .crewCompTitle {
    font-size: 14px;
    font-weight: 700;
  }
`;

export class CrewComplementContainer extends Component {
  state = {
    disableSave: true,
    crewComposition: [],
    toastMsg: null,
    snackType: '',
  };

  handleCrewComplement = (crewComposition, totalCountArray) => {
    let total = 0;
    if (totalCountArray && Array.isArray(totalCountArray)) {
      for (const key of Object.keys(totalCountArray)) {
        total += totalCountArray[key];
      }
    }
    if (total > 0) {
      this.setState({
        disableSave: false,
        crewComposition,
      });
    } else {
      this.setState({
        disableSave: true,
        crewComposition,
      });
    }
  };

  handleOk = () => {
    const { crewComposition } = this.state;
    const {
      t,
      openItemId,
      selectedPairing,
      handleSave,
      isJoinAction,
    } = this.props;
    const data = [];

    if (isJoinAction) {
      handleSave({ crewComposition, isJoinAction });
      return;
    }

    selectedPairing.forEach(elem => {
      data.push({ id: elem.id, crewComposition });
    });

    this.setState({ disableSave: true });
    pairingService
      .updatePairings(openItemId, data)
      .then(() => {
        this.setState(
          {
            toastMsg:
              selectedPairing.length > 1
                ? t('PAIRINGS.crewComplement.successMessageForMulti', {
                    count: selectedPairing.length,
                  })
                : t('PAIRINGS.crewComplement.successMessage', {
                    pairingName: selectedPairing[0].name || '',
                    departureDate: moment(selectedPairing.startDate).format(
                      'YYYY-MM-DD'
                    ),
                  }),
            snackType: 'success',
          },
          () => {
            handleSave({ ...selectedPairing, crewComposition });
          }
        );
      })
      .catch(err => {
        this.setState({ disableSave: false });
        if (err.response) this.props.reportError({ error: err });
      });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  onClearSnackBar = () => {
    this.setState({
      toastMsg: null,
      snackType: '',
    });
  };

  render() {
    const { disableSave, toastMsg, snackType } = this.state;
    const {
      t,
      open,
      openItemId,
      readOnly,
      currentCrewGroupId,
      selectedPairing,
      isJoinAction,
    } = this.props;

    const isDisabled =
      readOnly || (selectedPairing.length === 1 && selectedPairing[0].isLocked);
    return (
      <React.Fragment>
        <StyledDialog
          title={t(
            isJoinAction
              ? `PAIRINGS.crewComplement.join`
              : isDisabled
              ? `PAIRINGS.crewComplement.view`
              : `PAIRINGS.crewComplement.edit`
          )}
          cancelButton={t(`PAIRINGS.alerts.DIALOG.cancel`)}
          okButton={
            isJoinAction ? t('GLOBAL.form.create') : t('GLOBAL.form.save')
          }
          formId={'crewCompositionDialog'}
          open={open}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
          onClose={this.handleCancel}
          disableSave={disableSave || isDisabled}
        >
          <PerfectScrollbar option={perfectScrollConfig}>
            <StandardCrewComplement
              id="crewComposition"
              t={t}
              onChange={this.handleCrewComplement}
              defaultValues={selectedPairing}
              openItemId={openItemId}
              disabled={isDisabled}
              showOnlyAssociatedCGPositions={true}
              currentCrewGroupId={currentCrewGroupId}
              initialAssociatedPositionsValue={isJoinAction ? 1 : 0}
            />
          </PerfectScrollbar>
        </StyledDialog>
        <Notification
          autoHideDuration={5000}
          message={toastMsg}
          clear={this.onClearSnackBar}
          type={snackType}
        />
      </React.Fragment>
    );
  }
}

CrewComplementContainer.propTypes = {
  t: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  readOnly: PropTypes.bool,
  handleCancel: PropTypes.func.isRequired,
  currentCrewGroupId: PropTypes.number,
  selectedPairing: PropTypes.shape().isRequired,
  reportError: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  isJoinAction: PropTypes.bool,
};

CrewComplementContainer.defaultProps = {
  readOnly: null,
  currentCrewGroupId: null,
  isJoinAction: false,
};

export default withErrorHandler(CrewComplementContainer);
