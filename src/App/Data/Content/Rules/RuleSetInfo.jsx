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

import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import TextArea from '../../../../components/TextArea';
import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';

import {
  perfectScrollConfig,
  evaluateRegex,
  getFormCancelButton,
} from '../../../../utils/common';
import { stringDateTime } from '../../../../utils/dates';
import { RULESET_NAME_REGEX } from './constants';

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

class RuleSetInfo extends Component {
  state = {
    name: '',
    tabIndex: 0,
    isFormDirty: true,
    errors: {
      rulesetName: false,
    },
  };

  validateRuleAndSetErrors = () => {
    const { name, errors } = this.state;
    if (name !== '') {
      const isValidRegex = evaluateRegex(RULESET_NAME_REGEX, name);
      this.setState({ errors: { ...errors, rulesetName: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, rulesetName: false } });
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
    if (this.props.ruleset.name !== nextProps.ruleset.name) {
      this.setState({
        isFormDirty: true,
        name:
          nextProps.ruleset && nextProps.ruleset.name
            ? nextProps.ruleset.name
            : '',
      });
    }
  }

  handleChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }, () => {
      switch (name) {
        case 'name':
          this.validateRuleAndSetErrors();
          break;
        default:
          return 0;
      }
    });
  };

  render() {
    const tabIndex = this.state.tabIndex;
    const { name, errors } = this.state;
    const { ruleset, t, readOnly, disableComponent, ...rest } = this.props;
    const saveBtn = t('GLOBAL.form.save');
    const closeBtn = t('GLOBAL.form.close');
    return (
      <Form
        cancelButton={getFormCancelButton(t, readOnly || disableComponent)}
        okButton={readOnly || disableComponent ? closeBtn : saveBtn}
        isDisabled={
          (readOnly || disableComponent ? false : this.state.isFormDirty) ||
          errors.rulesetName
        }
        enableReadOnly={disableComponent}
        onChange={this.onFormChange}
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
              <Tab label={t('DATA.ruleSets.info.tabs.details')} />
              <Tab label={t('DATA.ruleSets.info.tabs.notes')} disabled />
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
                      label={t('DATA.ruleSets.info.rulesetName')}
                      required
                      value={name}
                      color="secondary"
                      onChange={this.handleChange}
                      disabled={readOnly || disableComponent}
                      readOnly={readOnly}
                      className={errors.rulesetName ? 'error' : ''}
                    />
                    <ErrorMessage
                      error={errors.rulesetName}
                      isVisible={errors.rulesetName}
                      message={t(`ERRORS.RULESET.name`)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <p>
                      {t('DATA.ruleSets.info.lastModifiedBy')}:{' '}
                      <span>{ruleset.lastModifiedBy}</span>
                    </p>
                    <p>
                      {t('DATA.ruleSets.info.lastModifiedDate')}:{' '}
                      <span>
                        {stringDateTime(ruleset.lastModifiedDateTime)}
                      </span>
                    </p>

                    <TextArea
                      inputProps={{
                        name: 'description',
                        maxLength: 1000,
                      }}
                      id="description"
                      label={t('DATA.ruleSets.info.description')}
                      style={{ display: 'block' }}
                      fullWidth
                      multiline
                      onChange={this.onFormChange}
                      defaultValue={ruleset.description}
                      disabled={readOnly || disableComponent}
                      readOnly={readOnly}
                    />
                  </Grid>
                </div>
              </PerfectScrollbar>
            </TabContent>
          )}
          {tabIndex === 1 && <TabContent>Notes</TabContent>}
        </BodySection>
      </Form>
    );
  }
}

RuleSetInfo.propTypes = {
  t: PropTypes.func.isRequired,
  ruleset: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    lastModified: PropTypes.string,
    lastOpenedBy: PropTypes.string,
    status: PropTypes.string,
  }),
  disableComponent: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  scopes: PropTypes.shape([]).isRequired,
};
RuleSetInfo.defaultProps = {
  ruleset: null,
  disableComponent: false,
};

export default RuleSetInfo;
