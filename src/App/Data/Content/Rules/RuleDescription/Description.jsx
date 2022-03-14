import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getComponent, getValidation } from './constants';
import Notification from '../../../../../components/Notification';
import * as ruleService from '../../../../../services/Data/rules';
import ReactMarkdown from 'react-markdown';

const HyperLink = styled.span`
  color: #0a75c2;
  text-decoration: underline;
  cursor: pointer;
`;

export class Description extends PureComponent {
  state = {
    error: false,
    snackMessage: null,
    errorField: '',
  };

  componentWillReceiveProps(nextProps) {
    /**
     * To remove error state when overlay in outer component is removed
     */
    if (nextProps.overlay !== this.state.error && this.state.error) {
      this.setState({ error: nextProps.overlay, snackMessage: null });
    }
  }

  isTooltipDisabled = (value, data) =>
    !data.definedInCurrent || this.props.readOnly;

  getTooltipContent = (value, data) =>
    !data.definedInCurrent
      ? this.props.t('DATA.rules.tooltip.settingsFrom', {
          name: data.referenceRulesetName,
        })
      : this.props.t('DATA.rules.tooltip.revertTo', {
          name: data.referenceRulesetName,
        });

  handleDisable = (value, data) => this.props.readOnly;

  handleOnchange = async (value, data) => {
    try {
      // Here we can write logic for custum local validation based on input type and name
      const validation = getValidation(data);
      if (validation) validation(this.props.t, value, data);

      // this.props.toggleLoader(true);
      // Call setPram API
      await ruleService.setParam(
        this.props.userId,
        this.props.scenarioId,
        this.props.ruleSet,
        data.name,
        value
      );
      // Once API call is success we update the global state
      this.props.handleParamSet(value, data, this.props.code);

      if (this.state.error) {
        this.setState({ error: false });
      }
    } catch (error) {
      if (error.response) {
        this.setState({ error: true, errorField: data.name }, () => {
          this.props.reportError(error);
          this.props.toggleLoader(false);
          this.props.setOverlay();
        });
      } else {
        // For handling client validation side error
        this.setState(
          { error: true, errorField: data.name, snackMessage: error.message },
          () => this.props.setOverlay()
        );
      }

      console.error(error);
    }
  };

  onClearSnackBar = () => {
    this.setState({ snackMessage: null });
  };

  /**
   * To remove parent component overlay when someone click on rendered generic component
   */
  removeOverlay = () => {
    if (this.props.overlay) {
      this.props.removeOverlay();
      this.onClearSnackBar();
    }
  };

  handleParamReset = data => {
    this.props.handleParamReset(data, this.props.ruleSet, this.props.code);
  };

  customRenderers = {
    paragraph: 'span',
    link: props => {
      const parsedData = this.props.data.references[
        props.children[0].props.value
      ];
      const component = parsedData ? getComponent(parsedData) : null;
      if (component) {
        const CustomComponent = component.component;

        return (
          <Fragment>
            <CustomComponent
              {...component.props}
              error={
                this.state.error && this.state.errorField === parsedData.name
              }
              data={parsedData}
              onChange={this.handleOnchange}
              handleDisable={this.handleDisable}
              handleReset={this.handleParamReset}
              handleTooltipDisable={this.isTooltipDisabled}
              getTooltipContent={this.getTooltipContent}
              removeOverlay={this.removeOverlay}
              scenarioId={this.props.scenarioId}
              userId={this.props.userId}
              ruleSet={this.props.ruleSet}
              reportError={this.props.reportError}
              refreshRules={this.props.refreshRules}
            />
            <Notification
              message={this.state.snackMessage}
              clear={this.onClearSnackBar}
              type={'error'}
              autoHideDuration={360000}
            />
          </Fragment>
        );
      } else if (parsedData && parsedData.type === 'hyperlink') {
        return (
          <HyperLink
            onClick={() =>
              this.props.handleLink(parsedData, this.props.ruleSet)
            }
          >
            {parsedData.value}
          </HyperLink>
        );
      } else {
        return <Fragment />;
      }
    },
  };

  render() {
    const { data } = this.props;

    if (data) {
      return (
        <ReactMarkdown renderers={this.customRenderers} source={data.data} />
      );
    }
    return <Fragment />;
  }
}

Description.propTypes = {
  t: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  data: PropTypes.shape().isRequired,
  ruleSet: PropTypes.number.isRequired,
  handleParamSet: PropTypes.func.isRequired,
  handleParamReset: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  overlay: PropTypes.bool.isRequired,
  setOverlay: PropTypes.func.isRequired,
  removeOverlay: PropTypes.func.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  reportError: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  toggleLoader: PropTypes.func.isRequired,
  refreshRules: PropTypes.func.isRequired,
};

export default Description;
