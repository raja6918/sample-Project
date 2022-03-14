import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBarMUI from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Form from '../../components/FormDrawer/Form';
import FormHeader from '../../components/FormDrawer/FormHeader';
import FormBody from '../../components/FormDrawer/FormBody';
import TextArea from '../../components/TextArea';

import { stringDateTime } from '../../utils/dates';
import {
  perfectScrollConfig,
  evaluateRegex,
  getFormOkButton,
  getFormCancelButton,
} from '../../utils/common';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import { SCENARIO_NAME_REGEX } from './constants';
import AccessEnabler from '../../components/AccessEnabler';
import { READ_ONLY } from '../../constants';

const Input = styled(TextField)`
  width: 100%;
  margin: 0;

  &.error > label {
    color: #d10000 !important;
  }
`;

const AppBar = styled(AppBarMUI)`
  background: #f7f7f7;
  color: #000;
`;

const BodySection = styled(FormBody)`
  padding: 0;
`;

const TabContent = styled.div`
  background: #f7f7f7;
  /* padding: 24px; */
  font-size: 12px;
  height: calc(100vh - 224px);
  overflow: auto;
  & > div > div {
  }
  & p {
    margin: 0 0 24px 0;
    color: rgba(0, 0, 0, 0.67);
    & span {
      display: block;
      padding: 5px 0 0 0;
      color: #000;
    }
  }
  .mb-16 {
    margin-bottom: 16px;
  }
`;

class ScenarioInfo extends Component {
  state = {
    name: '',
    tabIndex: 0,
    isFormDirty: true,
    errors: {
      scenarioName: false,
    },
  };

  validateScnNameAndSetErrors = () => {
    const { name, errors } = this.state;
    if (name !== '') {
      const isValidRegex = evaluateRegex(SCENARIO_NAME_REGEX, name);
      this.setState({ errors: { ...errors, scenarioName: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, scenarioName: false } });
    }
  };

  handleTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  onFormChange = () => {
    const name = document.getElementById('name');
    let valueName = '';
    if (name) {
      valueName = name.value.trim();
    }

    const isFormDirty = !Boolean(valueName);

    if (isFormDirty !== this.state.isFormDirty) {
      this.setState({ isFormDirty });
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      isFormDirty: true,
      name: nextProps.scenario ? nextProps.scenario.name : '',
    });
  }

  handleChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }, () => {
      switch (name) {
        case 'name':
          this.validateScnNameAndSetErrors();
          break;
        default:
          return 0;
      }
    });
  };

  getReferenceName = () => {
    const { scenario, templates, t } = this.props;
    if (!scenario.sourceExists) return t('SCENARIOS.info.deletedTemplate');
    const template = templates.find(
      template => template.id === scenario.sourceId
    );
    return template ? `${template.name} (${t('SCENARIOS.info.template')})` : '';
  };

  render() {
    const tabIndex = this.state.tabIndex;
    const { name, errors } = this.state;
    const { scenario, t, scopes, ...rest } = this.props;
    const isReadOnlyMode = scenario.status === READ_ONLY;

    return (
      scenario && (
        <AccessEnabler
          scopes={scopes.manage}
          disableComponent
          render={props => (
            <Form
              okButton={getFormOkButton(t, scenario)}
              cancelButton={getFormCancelButton(
                t,
                isReadOnlyMode || props.disableComponent
              )}
              isDisabled={this.state.isFormDirty}
              onChange={this.onFormChange || errors.scenarioName}
              enableReadOnly={isReadOnlyMode || props.disableComponent}
              restrictReadOnly={true}
              {...rest}
            >
              <FormHeader>
                <span>{t('GLOBAL.menu.getInfo')}</span>
                <span>{name}</span>
              </FormHeader>
              <BodySection>
                <AppBar
                  position="static"
                  color="default"
                  style={{ boxShadow: 'none' }}
                >
                  <Tabs
                    value={this.state.tabIndex}
                    onChange={this.handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label={t('SCENARIOS.info.tabs.details')} />
                    <Tab label={t('SCENARIOS.info.tabs.notes')} disabled />
                  </Tabs>
                </AppBar>
                {tabIndex === 0 && (
                  <TabContent>
                    <PerfectScrollbar option={perfectScrollConfig}>
                      <div>
                        <Grid className="mb-16" item xs={12}>
                          <Input
                            inputProps={{
                              name: 'name',
                              id: 'name',
                              maxLength: 50,
                            }}
                            required
                            label={t('SCENARIOS.info.scenarioName')}
                            value={name}
                            color="secondary"
                            onChange={this.handleChange}
                            disabled={isReadOnlyMode || props.disableComponent}
                            className={errors.scenarioName ? 'error' : ''}
                          />
                          <ErrorMessage
                            error={errors.scenarioName}
                            isVisible={errors.scenarioName}
                            message={t(`ERRORS.SCENARIOS.name`)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <p>
                            {t('SCENARIOS.info.referenceData')}
                            <span>{this.getReferenceName()}</span>
                          </p>
                          <p>
                            {t('SCENARIOS.info.created')}:{' '}
                            <span>{stringDateTime(scenario.creationTime)}</span>
                          </p>
                          <p>
                            {t('SCENARIOS.info.createdBy')}:{' '}
                            <span>{scenario.createdBy}</span>
                          </p>
                          <p>
                            {t('SCENARIOS.info.lastOpenedByMe')}:{' '}
                            <span>
                              {stringDateTime(scenario.lastOpenedByMe)}
                            </span>
                          </p>
                          <p>
                            {t('SCENARIOS.info.lastModified')}:{' '}
                            <span>
                              {stringDateTime(scenario.lastModifiedTime)}
                            </span>
                          </p>
                          <TextArea
                            inputProps={{
                              name: 'description',
                              maxLength: 1000,
                            }}
                            id="description"
                            label={t('SCENARIOS.info.description')}
                            style={{ display: 'block' }}
                            fullWidth
                            multiline
                            onChange={this.onFormChange}
                            defaultValue={scenario.description}
                            disabled={isReadOnlyMode || props.disableComponent}
                          />
                        </Grid>
                      </div>
                    </PerfectScrollbar>
                  </TabContent>
                )}
                {tabIndex === 1 && <TabContent>Notes</TabContent>}
              </BodySection>
            </Form>
          )}
        />
      )
    );
  }
}

ScenarioInfo.propTypes = {
  t: PropTypes.func.isRequired,
  templates: PropTypes.shape([]).isRequired,
  scenario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    createdBy: PropTypes.string,
    creationTime: PropTypes.string,
    description: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    isOpenedBy: PropTypes.string,
    lastModifiedTime: PropTypes.string,
    lastOpenedByMe: PropTypes.string,
    status: PropTypes.string,
    templateId: PropTypes.string,
    templateName: PropTypes.string,
  }),
  scopes: PropTypes.arrayOf(PropTypes.string),
};
ScenarioInfo.defaultProps = {
  scenario: null,
  scopes: [],
};

export default ScenarioInfo;
