import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '../../../../components/Dialog/Form';
import PerfectScrollbar from 'react-perfect-scrollbar';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import GenericTags from '../../../../components/GenericTags/GenericTags';
import Notification from '../../../../components/Notification';
import * as pairingService from '../../../../services/Pairings';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { perfectScrollConfig } from '../../../../utils/common';
import moment from 'moment';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paperWidthSm {
    width: 600px;
  }
  & .MuiDialogContent-root {
    height: 64px !important;
  }
  #tagsComponentDialog > div {
    padding-top: 10px;
  }
  #tagsComponentDialog .crewCompTitle {
    font-size: 14px;
    font-weight: 700;
  }
`;

export class TagsComponentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableSave: true,
      tags: this.setTags(this.props.selectedPairing),
      toastMsg: null,
      snackType: '',
    };
  }

  isMixedTags = false;

  componentWillReceiveProps(nextProps) {
    this.setState({
      disableSave: true,
      tags: this.setTags(nextProps.selectedPairing),
    });
  }

  handleTags = tags => {
    this.setState({
      disableSave: false,
      tags,
    });
  };

  setTags = selectedPairings => {
    if (Array.isArray(selectedPairings)) {
      this.isMixedTags = false;
      if (selectedPairings.length === 1) {
        return selectedPairings[0].tags || [];
      }

      let commonTags = null;
      for (let el of selectedPairings) {
        let tags = el.tags || [];

        if (!commonTags) {
          commonTags = tags;
        } else {
          if (commonTags.length !== tags.length) {
            this.isMixedTags = true;
            break;
          }

          let returnTags = new Set([...commonTags, ...tags]);
          returnTags = Array.from(returnTags);
          if (returnTags.length !== commonTags.length) {
            this.isMixedTags = true;
            break;
          }
        }
      }
      return this.isMixedTags ? [] : commonTags;
    }
  };

  handleOk = () => {
    const { tags } = this.state;
    const { t, openItemId, handleSave, selectedPairing } = this.props;
    const data = [];

    selectedPairing.forEach(elem => {
      data.push({ id: elem.id, tags });
    });
    this.setState({ disableSave: true });
    pairingService
      .updatePairings(openItemId, data)
      .then(() => {
        this.setState(
          {
            toastMsg:
              selectedPairing.length > 1
                ? t('PAIRINGS.tags.successMessageForMulti', {
                    count: selectedPairing.length,
                  })
                : t('PAIRINGS.tags.successMessage', {
                    pairingName: selectedPairing[0].name || '',
                    departureDate: moment(selectedPairing[0].startDate).format(
                      'YYYY-MM-DD'
                    ),
                  }),
            snackType: 'success',
          },
          () => {
            handleSave({ ...selectedPairing, tags });
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

  getTagsComponentTitle = () => {
    const { t, selectedPairing, readOnly } = this.props;
    const headers = 'PAIRINGS.tags';

    if (!Array.isArray(selectedPairing)) return;
    const key = selectedPairing.length === 1 ? 'name' : 'count';
    let title = 'multiPairingsHeading';
    let value = selectedPairing.length;
    if (key === 'name') {
      title =
        selectedPairing[0].isLocked || readOnly ? 'viewTagsHeading' : 'heading';
      value = selectedPairing[0].name || '';
    }
    return t(`${headers}.${title}`, {
      [key]: value,
    });
  };

  render() {
    const { disableSave, tags, toastMsg, snackType } = this.state;
    const { t, open, openItemId, readOnly, selectedPairing } = this.props;
    const isDisabled =
      readOnly || (selectedPairing.length === 1 && selectedPairing[0].isLocked);

    return (
      <React.Fragment>
        <StyledDialog
          title={this.getTagsComponentTitle()}
          cancelButton={t(`PAIRINGS.alerts.DIALOG.cancel`)}
          okButton={t('GLOBAL.form.save')}
          formId={'tagsComponentDialog'}
          open={open}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
          onClose={this.handleCancel}
          disableSave={disableSave || isDisabled}
        >
          <PerfectScrollbar option={perfectScrollConfig}>
            <GenericTags
              id="tags"
              t={t}
              onChange={this.handleTags}
              tags={tags}
              currentTags={this.setTags(selectedPairing)}
              openItemId={openItemId}
              placeholder={this.isMixedTags ? 'Mixed' : ''}
              disabled={isDisabled}
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

TagsComponentContainer.propTypes = {
  t: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  readOnly: PropTypes.bool,
  handleCancel: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectedPairing: PropTypes.shape({}).isRequired,
};

TagsComponentContainer.defaultProps = {
  readOnly: false,
};

export default withErrorHandler(TagsComponentContainer);
