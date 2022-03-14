import React, { Component } from 'react';
import PropType from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import Form from '../../components/FormDrawer/Form';
import FormHeader from '../../components/FormDrawer/FormHeader';
import FormBody from '../../components/FormDrawer/FormBody';
import ModelSelector from '../../components/ModelSelector';
import TextArea from '../../components/TextArea';

import { stringDateTime } from '../../utils/dates';
import templatesService from '../../services/Templates';

import { READ_ONLY, TEMPLATE_NAME_REGEX } from './constants';
import {
  perfectScrollConfig,
  evaluateRegex,
  getFormOkButton,
  getFormCancelButton,
} from '../../utils/common';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import AccessEnabler from '../../components/AccessEnabler';

const BodySection = styled(FormBody)`
  padding: 0;
`;
const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;
const InfoLabel = styled(Typography)`
  color: rgba(0, 0, 0, 0.67);
  font-size: 12px;
`;
const ContentLabel = styled(Typography)`
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
`;
const TabContent = styled.div`
  height: calc(100vh - 224px);
  overflow: auto;
`;

const InnerGrid = styled(Grid)`
  padding: 8px;
`;

class GetInfoForm extends Component {
  state = {
    isFormDirty: false,
    name: '',
    categories: [],
    category: null,
    tabSelected: 0,
    errors: {
      templateName: false,
    },
  };
  componentDidMount() {
    templatesService
      .getCategories()
      .then(response => {
        this.setState({
          categories: response,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  componentWillReceiveProps(nextProps) {
    const shouldUpdateInfo =
      nextProps.isOpen &&
      !!nextProps.template &&
      nextProps.template.id !== this.props.template.id;

    if (shouldUpdateInfo) {
      this.setState({
        category: nextProps.template.category || '',
        name: nextProps.template.name || '',
        isFormDirty: false,
      });
    }
  }
  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };
  onFormChange = () => {
    const name = document.getElementById('name').value.trim();
    const category = this.state.category;
    const description = document.getElementById('description').value.trim();

    if (
      (name !== this.getItemInfo('name') && name !== '') ||
      (category !== this.getItemInfo('category') && name !== '') ||
      (description !== this.getItemInfo('description') && name !== '')
    ) {
      if (!this.state.isFormDirty) {
        this.setState({
          isFormDirty: true,
        });
      }
    } else {
      if (this.state.isFormDirty) {
        this.setState({
          isFormDirty: false,
        });
      }
    }
  };

  getItemInfo = property => {
    const { template } = this.props;

    return template && template[property] ? template[property].toString() : '';
  };

  handleChangeTab = (event, tabSelected) => {
    this.setState({ tabSelected });
  };

  handleChange = e => {
    const name = e.target.name;
    this.setState(
      {
        [name]: e.target.value,
      },
      () => {
        switch (name) {
          case 'name':
            this.validateTempNameAndSetErrors();
            break;
          default:
            return 0;
        }
      }
    );
  };
  modelSelectorChange = category => {
    this.setState(
      {
        category,
      },
      this.onFormChange
    );
  };
  validateTempNameAndSetErrors = () => {
    const { name, errors } = this.state;
    if (name !== '') {
      const isValidRegex = evaluateRegex(TEMPLATE_NAME_REGEX, name);
      this.setState({ errors: { ...errors, templateName: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, templateName: false } });
    }
  };

  render() {
    const {
      template,
      categorySuggestions,
      formId,
      t,
      scopes,
      ...rest
    } = this.props;
    const { name, tabSelected, category, errors } = this.state;
    const isDisabled = this.isReadyToSubmit();
    const saveBtn = t('GLOBAL.form.save');
    const getInfo = 'TEMPLATES.getInfo';
    const categories =
      categorySuggestions.length > 0
        ? categorySuggestions
        : this.state.categories;
    const readOnly = template.status === READ_ONLY;

    return (
      template && (
        <AccessEnabler
          scopes={scopes.manage}
          disableComponent
          render={props => (
            <Form
              okButton={getFormOkButton(t, template)}
              cancelButton={getFormCancelButton(
                t,
                readOnly || props.disableComponent
              )}
              formId={formId}
              isDisabled={isDisabled || errors.templateName}
              onChange={this.onFormChange}
              anchor={'right'}
              enableReadOnly={readOnly || props.disableComponent}
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
                    variant="fullWidth"
                    value={tabSelected}
                    onChange={this.handleChangeTab}
                  >
                    <Tab label={t(`${getInfo}.detailsTab`)} />
                    <Tab label={t(`${getInfo}.notesTab`)} disabled />
                  </Tabs>
                </AppBar>
                {tabSelected === 0 && (
                  <TabContent>
                    <PerfectScrollbar option={perfectScrollConfig}>
                      <div>
                        <Grid container spacing={2}>
                          <InnerGrid item xs={12}>
                            <Input
                              inputProps={{
                                name: 'name',
                                maxLength: 50,
                              }}
                              required
                              id="name"
                              label={t(`${getInfo}.templateName`)}
                              value={name}
                              onChange={this.handleChange}
                              color="secondary"
                              disabled={readOnly || props.disableComponent}
                              className={errors.templateName ? 'error' : ''}
                            />
                            <ErrorMessage
                              error={errors.templateName}
                              isVisible={errors.templateName}
                              message={t(`ERRORS.TEMPLATES.name`)}
                            />
                          </InnerGrid>
                          <InnerGrid item xs={12} sm={12}>
                            <ModelSelector
                              name="category"
                              label={t(`${getInfo}.category`)}
                              required={false}
                              items={categories}
                              selected={category}
                              handleChange={this.modelSelectorChange}
                              setDefaultOption={false}
                              disabled={readOnly || props.disableComponent}
                            />
                          </InnerGrid>
                          <InnerGrid item xs={12} sm={12}>
                            <InfoLabel>{t(`${getInfo}.created`)}:</InfoLabel>
                            <ContentLabel>
                              {stringDateTime(template.creationTime)}
                            </ContentLabel>
                          </InnerGrid>
                          <InnerGrid item xs={12} sm={12}>
                            <InfoLabel>{t(`${getInfo}.createdBy`)}:</InfoLabel>
                            <ContentLabel>{template.createdBy}</ContentLabel>
                          </InnerGrid>
                          <InnerGrid item xs={12} sm={12}>
                            <InfoLabel>
                              {t(`${getInfo}.lastModified`)}:
                            </InfoLabel>
                            <ContentLabel>
                              {stringDateTime(template.lastModifiedTime)}
                            </ContentLabel>
                          </InnerGrid>
                          <InnerGrid item xs={12} sm={12}>
                            <InfoLabel>
                              {t(`${getInfo}.lastModifiedBy`)}:
                            </InfoLabel>
                            <ContentLabel>
                              {template.lastModifiedBy}
                            </ContentLabel>
                          </InnerGrid>
                          <Grid item xs={12} sm={12}>
                            <TextArea
                              inputProps={{
                                name: 'description',
                                maxLength: 1000,
                              }}
                              id="description"
                              label={t(`${getInfo}.description`)}
                              style={{ display: 'block' }}
                              fullWidth
                              multiline
                              defaultValue={this.getItemInfo('description')}
                              disabled={readOnly || props.disableComponent}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </PerfectScrollbar>
                  </TabContent>
                )}
                {tabSelected === 1 && <TabContent />}
              </BodySection>
            </Form>
          )}
        />
      )
    );
  }
}

GetInfoForm.propTypes = {
  template: PropType.shape({
    category: PropType.string,
    createdBy: PropType.string,
    creationTime: PropType.string,
    description: PropType.string,
    id: PropType.oneOfType([PropType.string, PropType.number]),
    isTemplate: PropType.bool,
    lastModifiedTime: PropType.string,
    lastModifiedBy: PropType.string,
    name: PropType.string,
    status: PropType.string,
  }),
  isOpen: PropType.bool.isRequired,
  handleCancel: PropType.func.isRequired,
  handleOk: PropType.func.isRequired,
  formId: PropType.string.isRequired,
  t: PropType.func.isRequired,
  onClose: PropType.func.isRequired,
  categorySuggestions: PropType.arrayOf(PropType.string),
  scopes: PropType.shape({
    add: PropType.arrayOf(PropType.string),
    delete: PropType.arrayOf(PropType.string),
    view: PropType.arrayOf(PropType.string),
    manage: PropType.arrayOf(PropType.string),
  }),
};
GetInfoForm.defaultProps = {
  template: {},
  categorySuggestions: [],
  scopes: {},
};
export default GetInfoForm;
