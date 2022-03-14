import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as ruleService from '../../../../../services/Data/rules';
import { emitClearDataAndRefetchPaneEvent } from '../../Chronos/utils';
import DescriptionWithConnect from './Description';
import './style.scss';

const SessionDiv = styled.div`
  padding: 14px 0px 14px 0px;
  font-size: 14px;
  line-height: 18px;
`;

const RuleTile = styled.b`
  font-size: 16px;
`;

export class RuleDialog extends Component {
  state = {
    code: null,
    ruleDescription: null,
    userId: this.props.userData ? this.props.userData.id : '',
  };

  componentDidMount() {
    this.fetchDescription(this.props.rule, this.props.ruleset);
  }

  fetchDescription = async (data, ruleset) => {
    try {
      const description = await ruleService.getRuleDescription(
        data.code,
        this.props.openItemId,
        this.state.userId,
        data.ruleset || ruleset
      );
      if (description) {
        this.setState({
          code: data.code,
          ruleDescription: description,
        });
      }
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  /**
   * This method will be called once the API call is successfully completed by Description component
   */
  handleParamSet = (name, value, ruleSet) => {
    const ruleDescription = this.state.ruleDescription;
    const paramObject = ruleDescription.userDescription.references[name];
    if (paramObject) {
      paramObject.definedInCurrent = true;
      paramObject.value = value;
      ruleDescription.userDescription.references[name] = paramObject;
    }
    this.setState({ ruleDescription });
    // We need to refresh all panes after we update rule parameter
    emitClearDataAndRefetchPaneEvent([1, 2, 3]);
  };

  handleParamReset = async (data, ruleset, code) => {
    try {
      this.props.toggleLoader(true);

      // Call the revert param API
      await ruleService.revertParam(
        this.state.userId,
        this.props.openItemId,
        ruleset,
        data.name
      );

      // Once revert is success, Call rule detail API to fetch its new value
      this.fetchDescription(this.props.rule, ruleset);
      // Reset paramsChanged and errorList because when you revert param you need to refetch everything
      this.setState({ paramsChanged: [], errorsList: [] });
      // We need to refresh all panes after we reset rule parameter
      emitClearDataAndRefetchPaneEvent([1, 2, 3]);
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    } finally {
      this.props.toggleLoader(false);
    }
  };

  setOverlay = () => {
    this.setState({ overlay: true });
  };

  userDescriptionTransformer = data => {
    const transformedData = {};
    const references = {};
    transformedData.data = data.data;
    if (Array.isArray(data.references)) {
      data.references.forEach(reference => {
        if (reference.name) references[reference.name] = reference;
      });
      transformedData.references = references;
      return transformedData;
    }
    return { ...data };
  };

  render() {
    const {
      t,
      openItemId,
      readOnly,
      reportError,
      toggleLoader,
      overlay,
      setOverlay,
      removeOverlay,
    } = this.props;
    const { userId, ruleDescription } = this.state;

    if (ruleDescription) {
      ruleDescription.userDescription = this.userDescriptionTransformer(
        ruleDescription.userDescription
      );
    }

    return (
      <Fragment>
        {ruleDescription && (
          <Fragment>
            {ruleDescription && (
              <div className="pairing-alert-rule-description">
                <RuleTile>{ruleDescription.name}</RuleTile>
                <SessionDiv>
                  {ruleDescription && ruleDescription.userDescription && (
                    <DescriptionWithConnect
                      t={t}
                      code={ruleDescription.code}
                      data={ruleDescription.userDescription}
                      ruleSet={ruleDescription.ruleset}
                      handleParamSet={this.handleParamSet}
                      handleParamReset={this.handleParamReset}
                      overlay={overlay}
                      setOverlay={setOverlay}
                      removeOverlay={removeOverlay}
                      userId={userId}
                      scenarioId={openItemId}
                      readOnly={readOnly}
                      toggleLoader={toggleLoader}
                      reportError={reportError}
                    />
                  )}
                </SessionDiv>
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

RuleDialog.propTypes = {
  t: PropTypes.func.isRequired,
  rule: PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  ruleset: PropTypes.number,
  reportError: PropTypes.func.isRequired,
  overlay: PropTypes.bool.isRequired,
  setOverlay: PropTypes.func.isRequired,
  removeOverlay: PropTypes.func.isRequired,
  toggleLoader: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

RuleDialog.defaultProps = {
  rule: null,
  ruleset: null,
  readOnly: false,
  userData: {},
};

const mapStateToProps = state => {
  return { userData: state.user.userData };
};
const RuleDialogComponent = connect(mapStateToProps)(RuleDialog, 360000);

export default RuleDialogComponent;
